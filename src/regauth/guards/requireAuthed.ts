// src/regauth/guards/requireAuthed.ts

import { REGAUTH_ROUTES } from "../config";
import { sanitizeReturnTo } from "../lib/returnTo";
import { getAuthedCached } from "../state/session";

/**
 * Client-side guard.
 * - Middleware is authoritative for /main/*
 * - This is a convenience guard for client-side navigation / UI actions.
 */
export async function requireAuthed(opts?: {
  returnTo?: string;
}): Promise<{ ok: true } | { ok: false; redirectTo: string }> {
  const desired = sanitizeReturnTo(opts?.returnTo);

  const { authed } = await getAuthedCached();

  if (authed) return { ok: true };

  const redirectTo = desired
    ? `${REGAUTH_ROUTES.entry}?returnTo=${encodeURIComponent(desired)}`
    : REGAUTH_ROUTES.entry;

  return { ok: false, redirectTo };
}
