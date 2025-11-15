import { api } from "../api/api";

export async function notarizeInit(payload: {
  fileHash: string;
  ephemeralPublicKey: string;
  nonce: string;
}) {
  const res = await api.post("/notarize/init", payload);
  return res.data;
}

export async function notarizeComplete(payload: {
  sponsorSignature: string;
  ephemeralPublicKey: string;
  fileHash: string;
}) {
  const res = await api.post("/notarize/complete", payload);
  return res.data;
}