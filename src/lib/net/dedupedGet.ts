"use client";

// One GET per URL per screen, however many components ask for it.
//
// This keeps growing back. /api/achievements was fetched twice on every screen
// (the trophy meter and the app-wide earn detector) and was fixed in July.
// /api/regauth/me was fetched twice on Today, Me and Profile-edit (the layout's
// session guard and each page's own load) and was fixed the same way.
// /api/guidance/actions is fetched two or three times on Actions and Me.
//
// The pattern is always the same: two components each legitimately need the
// same value, neither knows about the other, and nobody notices because on a
// laptop it costs nothing visible. On a phone, against a server where a warm
// call is ~150ms and the first call after an idle gap is over a second, it is
// the difference between a screen that feels immediate and one that doesn't.
//
// So this is the fix as a tool rather than as another one-off: components ask
// for what they need, and identical in-flight or just-finished GETs collapse
// onto one request.
//
// Deliberately NOT a cache. The TTL is short enough that it only ever covers
// one screen's mount, so nothing here can be the reason someone sees stale
// data after an action — which is what would make a real cache dangerous on
// endpoints that change when the user does something.

type Entry = { at: number; value: unknown };

const DEFAULT_TTL_MS = 4_000;

const inflight = new Map<string, Promise<unknown>>();
const recent = new Map<string, Entry>();

export function dedupedGet<T = unknown>(
  url: string,
  opts?: { ttlMs?: number; signal?: AbortSignal },
): Promise<T | null> {
  const ttl = opts?.ttlMs ?? DEFAULT_TTL_MS;
  const now = Date.now();

  const hit = recent.get(url);
  if (hit && now - hit.at < ttl) return Promise.resolve(hit.value as T | null);

  const pending = inflight.get(url);
  if (pending) return pending as Promise<T | null>;

  const run = fetch(url, { credentials: "include", signal: opts?.signal })
    .then((r) => (r.ok ? (r.json() as Promise<T>) : null))
    .then((value) => {
      recent.set(url, { at: Date.now(), value });
      return value;
    })
    .catch(() => null)
    .finally(() => {
      if (inflight.get(url) === run) inflight.delete(url);
    });

  inflight.set(url, run);
  return run as Promise<T | null>;
}

/** Call after a write so the next read of that URL goes to the server. */
export function invalidateGet(url: string): void {
  recent.delete(url);
}
