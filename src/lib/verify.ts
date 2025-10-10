export type SendPayload = { contact: string; channel: "sms" | "email" };
export type SendResponse = { ok: boolean; sid?: string; to?: string };

export async function sendVerification(p: SendPayload): Promise<SendResponse> {
  const res = await fetch("/api/send-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error(`Send failed (${res.status})`);
  return res.json();
}

export async function checkVerification(contact: string, code: string): Promise<{ ok: boolean }> {
  const res = await fetch("/api/check-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact, code }),
  });
  if (!res.ok) throw new Error(`Check failed (${res.status})`);
  return res.json();
}
