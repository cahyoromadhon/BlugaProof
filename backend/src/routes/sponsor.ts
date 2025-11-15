// src/routes/sponsor.ts
import { Router, Request, Response } from 'express';
import { enokiSponsor } from '../services/enokiClient';

const router = Router();

router.post('/sponsor', async (req: Request, res: Response) => {
  try {
    const { transactionBlockKindBytes, zkloginJwt } = req.body;

    if (!transactionBlockKindBytes || !zkloginJwt) {
      return res.status(400).json({ error: 'transactionBlockKindBytes dan zkloginJwt wajib diisi' });
    }

    const data = await enokiSponsor(transactionBlockKindBytes, zkloginJwt);
    return res.json(data);
  } catch (err: any) {
    console.error('Enoki sponsor error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

export default router;
