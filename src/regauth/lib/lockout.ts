// src/regauth/lib/lockout.ts

import { REGAUTH_UX } from "../config";
import type { RegAuthDraftPayload } from "../types";

/**
 * Extend draft payload with lockout fields without polluting core types.
 */
type DraftExt = RegAuthDraftPayload & {
  verifyAttempts?: number;
  lockedUntil?: string; // ISO timestamp
};

function nowMs(): number {
  return Date.now();
}

function parseIsoMs(iso?: string): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

export function isLockedOut(
  draft: RegAuthDraftPayload,
): { locked: boolean; secondsLeft: number } {
  const d = draft as DraftExt;
  const untilMs = parseIsoMs(d.lockedUntil);

  if (!untilMs) return { locked: false, secondsLeft: 0 };

  const remainingMs = untilMs - nowMs();
  if (remainingMs <= 0) return { locked: false, secondsLeft: 0 };

  return { locked: true, secondsLeft: Math.ceil(remainingMs / 1000) };
}

export function getAttempts(draft: RegAuthDraftPayload): number {
  const d = draft as DraftExt;
  const n = d.verifyAttempts ?? 0;
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function registerFailedAttempt(
  draft: RegAuthDraftPayload,
): RegAuthDraftPayload {
  const d = draft as DraftExt;

  const attempts = getAttempts(draft) + 1;
  const shouldLock = attempts >= REGAUTH_UX.verifyMaxAttempts;

  const next: DraftExt = {
    ...draft,
    schemaVersion: 1,
    verifyAttempts: attempts,
    lockedUntil: shouldLock
      ? new Date(nowMs() + 60_000).toISOString()
      : d.lockedUntil,
  };

  return next;
}

export function resetAttempts(
  draft: RegAuthDraftPayload,
): RegAuthDraftPayload {
  const next: RegAuthDraftPayload = {
    ...draft,
    schemaVersion: 1,
  };

  // Explicitly remove extension fields
  delete (next as DraftExt).verifyAttempts;
  delete (next as DraftExt).lockedUntil;

  return next;
}
