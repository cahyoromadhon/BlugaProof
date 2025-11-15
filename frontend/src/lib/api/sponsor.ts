import { API_URL } from "@/constants";

export async function sponsorStart(body: any) {
  const res = await fetch(`${API_URL}/sponsor/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sponsorComplete(body: any) {
  const res = await fetch(`${API_URL}/sponsor/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
