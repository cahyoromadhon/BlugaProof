import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { generateNonce } from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

export function createEphemeral() {
  const ephemeral = new Ed25519Keypair();
  const maxEpoch = 500000000;
  const randomness = BigInt(
    "0x" + crypto.getRandomValues(new Uint8Array(32)).reduce(
      (s, b) => s + b.toString(16).padStart(2, "0"), 
      ""
    )
  );

  const nonce = generateNonce(
    ephemeral.getPublicKey(),
    maxEpoch,
    randomness
  );

  return { ephemeral, nonce, maxEpoch, randomness };
}
