import { Router, Request, Response } from 'express';
import { findNotarizationRecordByHash } from '../utils/notarizationStore';

const DEFAULT_WALRUS_EXPLORER = 'https://walruscan.com/testnet/blob';
const DEFAULT_HASH_LOOKUP_ENDPOINT =
  process.env.WALRUS_HASH_LOOKUP_URL ||
  'https://aggregator.testnet.walrus.space/v1/aggregator/hash';

function buildLookupUrl(hash: string) {
  const base = DEFAULT_HASH_LOOKUP_ENDPOINT;
  if (base.includes('{hash}')) {
    return base.replace('{hash}', hash);
  }
  return `${base.replace(/\/$/, '')}/${hash}`;
}

function extractBlobId(payload: unknown): string | null {
  if (!payload) return null;

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const blobId = extractBlobId(item);
      if (blobId) return blobId;
    }
    return null;
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['blobId', 'blob_id', 'id', 'blob']) {
      const value = record[key];
      if (typeof value === 'string') {
        return value;
      }
    }

    for (const value of Object.values(record)) {
      const nested = extractBlobId(value);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

async function lookupBlobIdFromWalrus(hash: string) {
  const url = buildLookupUrl(hash);

  let response: any;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(
      `Gagal menghubungi Walrus aggregator (${(err as Error).message ?? 'unknown network error'})`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Walrus aggregator mengembalikan status ${response.status}: ${await response.text()}`,
    );
  }

  const payload = await response.json().catch(() => null);
  const blobId = extractBlobId(payload);

  if (!blobId) {
    throw new Error('Walrus aggregator tidak mengembalikan blob ID.');
  }

  return { blobId, payload };
}

// -------------------------------------------------------------------

const router = Router();

/**
 * FINAL: verify hash → langsung cek DB, tanpa aggregator lookup
 */
router.get('/verify/:hash', async (req: Request, res: Response) => {
  const hash = (req.params.hash || '').trim().toLowerCase();
  const sha256Regex = /^[a-f0-9]{64}$/;

  if (!sha256Regex.test(hash)) {
    return res.status(400).json({
      error: 'Hash harus berupa string hex SHA-256 sepanjang 64 karakter.',
    });
  }

  try {
    const record = await findNotarizationRecordByHash(hash);

    if (!record) {
      return res.status(404).json({
        error: "Hash tidak ditemukan pada catatan notarization.",
      });
    }

    return res.json({
      hash: record.hash,
      blobId: record.blobId,
      walrus_url: record.walrusUrl || `${DEFAULT_WALRUS_EXPLORER}/${record.blobId}`,
      filename: record.filename,
      storedAt: record.storedAt,
    });
  } catch (err: any) {
    console.error('verify error:', err);
    return res.status(500).json({
      error: err.message || 'Unknown error',
    });
  }
});

export default router;