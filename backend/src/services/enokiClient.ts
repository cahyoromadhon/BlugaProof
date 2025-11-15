// src/services/enokiClient.ts
import { EnokiSponsorResponse, EnokiCompleteResponse } from '../utils/types';

const ENOKI_BASE_URL = 'https://api.enoki.mystenlabs.com';
const ENOKI_API_KEY = process.env.ENOKI_API_KEY!;

// helper untuk fetch JSON ke Enoki
async function callEnoki(path: string, init: RequestInit): Promise<any> {
  const apiKey = process.env.ENOKI_API_KEY;
  if (!apiKey) {
    throw new Error('ENOKI_API_KEY belum di-set di .env backend');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-enoki-key': apiKey,
    ...(init.headers as any),
  };

  const res = await fetch(ENOKI_BASE_URL + path, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Enoki error ${res.status}: ${text}`);
  }

  return res.json();
}

// STEP 1: minta sponsorship (dipakai di routes/sponsor.ts)
export async function enokiSponsor(
  transactionBlockKindBytes: string,
  zkloginJwt: string,
): Promise<EnokiSponsorResponse> {
  return callEnoki('/transaction-blocks/sponsor', {
    method: 'POST',
    headers: {
      'zklogin-jwt': zkloginJwt,
    },
    body: JSON.stringify({
      network: 'testnet',
      transactionBlockKindBytes,
    }),
  });
}

// STEP 3: kirim signature user ke Enoki (dipakai di sponsorComplete.ts)
export async function enokiComplete(
  digest: string,
  userSignature: string,
): Promise<EnokiCompleteResponse> {
  return callEnoki(`/transaction-blocks/sponsor/${digest}`, {
    method: 'POST',
    body: JSON.stringify({
      userSignature,
    }),
  });
}

export async function enokiSponsorTransaction(txKindBytes: Uint8Array) {
    
  const init = await fetch(
    `https://api.enoki.mystenlabs.com/transaction-blocks/sponsor`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-enoki-api-key': ENOKI_API_KEY,
      },
      body: JSON.stringify({
        network: 'testnet',
        transactionBlockKindBytes: Buffer.from(txKindBytes).toString('base64'),
      }),
    }
  ).then(r => r.json());

  if (!init.bytes || !init.digest) {
    throw new Error('Sponsor init failed: ' + JSON.stringify(init));
  }

  return {
    digest: init.digest,
  };
}
