"use client";

// One `/api/regauth/me` per page load, not two.
//
// The main layout asks who you are on every screen (it has to — it is the thing
// that notices a dead session and sends you to sign in), and then Today, Me,
// Profile-edit and Journey each asked again on mount. Two identical requests,
// fired within milliseconds of each other, for a value that cannot have changed
// in between.
//
// That is not free. It is a route handler on the web app rather than a proxy to
// the API, so it is a real server round trip — measured at 145-330ms warm and
// over a second on the first call after an idle gap. Doing it twice on a phone
// is the difference between a screen that feels immediate and one that doesn't.
//
// This is the same fix, and the same shape, as the one applied to
// /api/achievements in July: collapse concurrent callers onto one in-flight
// promise, and hold the answer briefly so two mounts in the same tick share it.
// It grew back here because there was nothing stopping it.

export type MeResponse = {
  ok?: boolean;
  authed?: boolean;
  user?: {
    id?: string;
    email?: string | null;
    first_name?: string | null;
    zip_code?: string | null;
    created_at?: string | null;
    // Callers read a few more fields than these; keep the shape open rather
    // than making this module the place every profile field has to be declared.
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
};

/**
 * Long enough that everything mounting on one screen shares a single request,
 * short enough that it is never the reason someone sees a stale name. A page
 * that genuinely needs the current value after a write passes `force`.
 */
const TTL_MS = 5_000;

let inflight: Promise<MeResponse | null> | null = null;
let cached: { at: number; value: MeResponse | null } | null = null;

export function fetchMe(opts?: { force?: boolean }): Promise<MeResponse | null> {
  const force = opts?.force === true;
  const now = Date.now();

  if (!force && cached && now - cached.at < TTL_MS) {
    return Promise.resolve(cached.value);
  }
  if (!force && inflight) return inflight;

  const run = fetch("/api/regauth/me", { credentials: "include", cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<MeResponse>) : null))
    .then((value) => {
      cached = { at: Date.now(), value };
      return value;
    })
    .catch(() => null)
    .finally(() => {
      if (inflight === run) inflight = null;
    });

  inflight = run;
  return run;
}

/** After a write that changes the answer (profile edit), so the next read is true. */
export function invalidateMe(): void {
  cached = null;
}
