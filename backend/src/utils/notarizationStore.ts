import fs from 'fs/promises';
import path from 'path';

export interface NotarizationRecord {
  hash: string;
  blobId: string;
  walrusUrl: string;
  filename?: string;
  storedAt: string;
}

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'notarizations.json');

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

async function readRecords(): Promise<NotarizationRecord[]> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (err) {
    console.error('Failed to read notarizations file:', err);
    return [];
  }
}

async function writeRecords(records: NotarizationRecord[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

export async function saveNotarizationRecord(record: NotarizationRecord) {
  const normalizedHash = record.hash.toLowerCase();
  const records = await readRecords();

  const existingIndex = records.findIndex((item) => item.hash === normalizedHash);
  const newRecord = { ...record, hash: normalizedHash };

  if (existingIndex >= 0) {
    records[existingIndex] = newRecord;
  } else {
    records.push(newRecord);
  }

  await writeRecords(records);
}

export async function findNotarizationRecordByHash(
  hash: string,
): Promise<NotarizationRecord | null> {
  const normalizedHash = hash.toLowerCase();
  const records = await readRecords();
  return records.find((item) => item.hash === normalizedHash) || null;
}
