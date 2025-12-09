// src/routes/notarize.ts
import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { uploadToWalrus } from '../services/walrusClient';
import { saveNotarizationRecord } from '../utils/notarizationStore';

const router = Router();
const upload = multer();

router.post('/notarize', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file wajib diupload (field name: file)' });
    }

    const buffer = req.file.buffer;
    const filename = req.file.originalname;
    const mimeType = req.file.mimetype || 'application/octet-stream';

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const { blobId, walrus_url } = await uploadToWalrus(buffer, filename, mimeType);

    try {
      await saveNotarizationRecord({
        hash: hash.toLowerCase(),
        blobId,
        walrusUrl: walrus_url,
        filename,
        storedAt: new Date().toISOString(),
      });
    } catch (storeErr) {
      console.warn('Failed to persist notarization record:', storeErr);
    }

    return res.json({
      file_hash: hash,
      filename,
      filetype: mimeType,
      blobId,
      walrus_url,
    });
  } catch (err: any) {
    console.error('notarize error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

export default router;
