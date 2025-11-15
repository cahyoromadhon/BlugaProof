import { generateNonce } from "@mysten/sui/zklogin";
import { PublicKey } from "@mysten/sui/cryptography";

export function generateRandomness(): bigint {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);

    const hex = Array.from(arr)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return BigInt("0x" + hex);
}

export function createNonce(ephemeralPublicKey: PublicKey, maxEpoch: number) {
    const randomness = generateRandomness();
    return generateNonce(ephemeralPublicKey, maxEpoch, randomness);
}