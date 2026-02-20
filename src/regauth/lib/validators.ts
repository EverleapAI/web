// src/regauth/lib/validators.ts

import type { AuthIdentifier } from "../types";

/**
 * NOTE: UI-first normalization.
 * When you go production, for phone you should normalize to E.164
 * using a library (e.g., libphonenumber-js) server-side.
 */

export type IdentifierParseResult =
  | { ok: true; identifier: AuthIdentifier }
  | { ok: false; reason: "empty" | "invalid" };

export function parseIdentifier(raw: string): IdentifierParseResult {
  const v = (raw ?? "").trim();
  if (!v) return { ok: false, reason: "empty" };

  if (looksLikeEmail(v)) {
    return {
      ok: true,
      identifier: {
        raw: v,
        normalized: normalizeEmail(v),
        type: "email",
      },
    };
  }

  if (looksLikePhone(v)) {
    return {
      ok: true,
      identifier: {
        raw: v,
        normalized: normalizePhoneDigits(v),
        type: "phone",
      },
    };
  }

  return { ok: false, reason: "invalid" };
}

export function looksLikeEmail(v: string) {
  // Keep this permissive for UX; strict validation happens server-side later.
  return /.+@.+\..+/.test(v.trim());
}

export function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

export function looksLikePhone(v: string) {
  const digits = v.replace(/[^\d]/g, "");
  return digits.length >= 10;
}

export function normalizePhoneDigits(v: string) {
  // UI stub: store digits only. Production: E.164 (country-aware).
  return v.replace(/[^\d]/g, "");
}
