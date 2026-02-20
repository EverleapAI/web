// src/regauth/state/session.ts

export type MeResponse =
  | { ok: true; authed: false }
  | { ok: true; authed: true; user?: { id: string; displayName: string | null } };

let cache: { authed: boolean; user?: { id: string; displayName: string | null }; checkedAt: number } | null =
  null;

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/regauth/me", { method: "GET" });
  const data = (await res.json().catch(() => null)) as MeResponse | null;

  if (!data || data.ok !== true) return { ok: true, authed: false };
  return data;
}

export async function getAuthedCached(ttlMs = 15_000): Promise<{
  authed: boolean;
  user?: { id: string; displayName: string | null };
}> {
  const now = Date.now();
  if (cache && now - cache.checkedAt < ttlMs) return { authed: cache.authed, user: cache.user };

  try {
    const me = await fetchMe();
    const authed = me.authed === true;

    cache = {
      authed,
      user: authed ? me.user : undefined,
      checkedAt: now,
    };

    return { authed: cache.authed, user: cache.user };
  } catch {
    cache = { authed: false, checkedAt: now };
    return { authed: false };
  }
}

export function clearAuthedCache() {
  cache = null;
}
