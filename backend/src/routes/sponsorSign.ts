import { Router, Request, Response } from 'express';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64, toB64 } from '@mysten/bcs';

const router = Router();

router.post('/sponsor/sign', async (req: Request, res: Response) => {
  try {
    const { txBytes } = req.body;

    if (!txBytes) {
      return res.status(400).json({ error: 'txBytes wajib diisi' });
    }

    const backendKey = process.env.BACKEND_PRIVATE_KEY;
    if (!backendKey) {
      return res.status(500).json({ error: 'BACKEND_PRIVATE_KEY belum di set di .env' });
    }

    // Keypair backend
    const keypair = Ed25519Keypair.fromSecretKey(fromB64(backendKey));

    // Sign txBytes
    const signature = await keypair.sign(fromB64(txBytes));

    return res.json({
      signature: toB64(signature),
      pubkey: toB64(keypair.getPublicKey().toRawBytes()),
    });

  } catch (err: any) {
    console.error('Sponsor sign error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

export default router;