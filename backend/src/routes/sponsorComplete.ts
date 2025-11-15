// src/routes/sponsorComplete.ts
import { Router, Request, Response } from 'express';
import { enokiComplete } from '../services/enokiClient';

const router = Router();

router.post('/sponsor/complete', async (req: Request, res: Response) => {
  try {
    const { digest, userSignature } = req.body;

    if (!digest || !userSignature) {
      return res.status(400).json({ error: 'digest dan userSignature wajib diisi' });
    }

    const data = await enokiComplete(digest, userSignature);
    return res.json(data);
  } catch (err: any) {
    console.error('Enoki complete error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

export default router;
