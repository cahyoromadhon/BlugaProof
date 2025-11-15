import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export function generateEphemeral() {
    return Ed25519Keypair.generate();
}