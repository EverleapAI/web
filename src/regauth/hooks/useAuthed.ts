// src/regauth/hooks/useAuthed.ts
"use client";

import * as React from "react";
import { getAuthedCached, clearAuthedCache } from "../state/session";

type AuthedUser = { id: string; displayName: string | null };

export function useAuthed() {
  const [loading, setLoading] = React.useState(true);
  const [authed, setAuthed] = React.useState(false);
  const [user, setUser] = React.useState<AuthedUser | undefined>(undefined);
  const [error, setError] = React.useState<string | null>(null);

  const applyResult = React.useCallback((res: { authed: boolean; user?: AuthedUser }) => {
    setAuthed(res.authed);
    setUser(res.user);
  }, []);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAuthedCached(0); // force refresh
      applyResult(res);
    } catch {
      // Keep error copy consistent and non-technical
      setError("We couldn’t check your session. Try again.");
      setAuthed(false);
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  }, [applyResult]);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await getAuthedCached();
        if (!alive) return;
        applyResult(res);
      } catch {
        if (!alive) return;
        setError("We couldn’t check your session. Try again.");
        setAuthed(false);
        setUser(undefined);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [applyResult]);

  const bust = React.useCallback(() => {
    clearAuthedCache();
  }, []);

  return { loading, authed, user, error, refresh, bust };
}
