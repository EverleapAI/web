// src/regauth/lib/mask.ts

import type { AuthIdentifier } from "../types";

export function maskIdentifier(id: AuthIdentifier): string {
  if (id.type === "email") return maskEmail(id.normalized);
  return maskPhoneDigits(id.normalized);
}

export function maskEmail(email: string): string {
  const v = (email ?? "").trim().toLowerCase();
  const at = v.indexOf("@");
  if (at <= 1) return "•••";
  const name = v.slice(0, at);
  const domain = v.slice(at);
  return `${name[0]}***${name[name.length - 1]}${domain}`;
}

/**
 * Input is digits-only (current stub normalization).
 * Production: you’ll likely mask E.164 + country formatting server-side.
 */
export function maskPhoneDigits(digits: string): string {
  const d = (digits ?? "").replace(/[^\d]/g, "");
  if (d.length < 4) return "•••";
  const last2 = d.slice(-2);
  const last4 = d.slice(-4);
  return `+• ••• ••${last2} (••${last4})`;
}
