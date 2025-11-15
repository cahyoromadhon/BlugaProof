// src/services/walrusClient.ts
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { walrus, WalrusFile } from '@mysten/walrus';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { WalrusUploadResult } from '../utils/types';
import dotenv from 'dotenv';
dotenv.config();

const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'),
}).$extend(
  walrus({
    network: 'testnet',
    uploadRelay: {
      host: 'https://upload-relay.testnet.walrus.space',
      sendTip: { max: 1_000 },
    },
  }),
);

const walrusKey = process.env.WALRUS_PRIVATE_KEY;
if (!walrusKey) {
  throw new Error('WALRUS_PRIVATE_KEY belum di-set di .env backend');
}

const { secretKey } = decodeSuiPrivateKey(walrusKey);
const walrusKeypair = Ed25519Keypair.fromSecretKey(secretKey);

export async function uploadToWalrus(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<WalrusUploadResult> {
  const walrusFile = WalrusFile.from({
    contents: buffer,
    identifier: filename,
    tags: { 'content-type': mimeType || 'application/octet-stream' },
  });

  const flow = suiClient.walrus.writeFilesFlow({ files: [walrusFile] });
  await flow.encode();

  const registerTx = flow.register({
    epochs: 3,
    deletable: true,
    owner: walrusKeypair.getPublicKey().toSuiAddress(),
  });

  const registerResult = await (suiClient as any).signAndExecuteTransaction({
    signer: walrusKeypair,
    transaction: registerTx,
  });

  await flow.upload({ digest: registerResult.digest });

  const certifyTx = flow.certify();

  await (suiClient as any).signAndExecuteTransaction({
    signer: walrusKeypair,
    transaction: certifyTx,
  });

  const [{ blobId }] = await flow.listFiles();
  const walrus_url = `https://walruscan.com/testnet/blob/${blobId}`;

  return { blobId, walrus_url };
}
