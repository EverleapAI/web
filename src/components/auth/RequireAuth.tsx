// apps/web/src/components/auth/RequireAuth.tsx
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type MeResponse = {
  ok: boolean;
  verified: boolean;
  userId?: string | null;
  issuedAtUtc?: string | null;
};

type Props = {
  children: ReactNode;
  /** Where to send unauthenticated users (defaults to /login?next=<current>) */
  redirectTo?: string;
};

export default function RequireAuth({ children, redirectTo }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Compute redirect target with ?next=<current>
  const target = useMemo(() => {
    try {
      const qs = typeof window !== "undefined" ? window.location.search : "";
      const next = `${pathname}${qs}`;
      const base = redirectTo || "/login";
      const sep = base.includes("?") ? "&" : "?";
      return `${base}${sep}next=${encodeURIComponent(next)}`;
    } catch {
      return redirectTo || "/login";
    }
  }, [redirectTo, pathname]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // IMPORTANT: hit our Next.js route handler (same-origin)
        const data = await api.get<MeResponse>("/api/session/me");
        if (!cancelled) {
          setAuthed(Boolean(data?.verified));
        }
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // After check, if not authed → redirect
  useEffect(() => {
    if (checked && !authed) {
      router.replace(target);
    }
  }, [checked, authed, router, target]);

  if (!checked || !authed) {
    // Lightweight, centered “checking” affordance
    return (
      <div className="min-h-[40vh] grid place-items-center px-4">
        <div className="rounded-2xl card-surface px-4 py-3 text-sm">
          {checked ? "Redirecting…" : "Checking your session…"}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
