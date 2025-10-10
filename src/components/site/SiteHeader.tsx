// apps/web/src/components/site/SiteHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { api } from "@/lib/api";

type Props = {
  /** When true, use a translucent glass header (for video hero). */
  translucent?: boolean;
};

type MeResponse = {
  ok: boolean;
  verified: boolean;
  userId?: string | null;
  verifiedAtUtc?: string | null;
};

/** Lightweight, immediate check (UI hint) */
function hasVerifiedCookie(): boolean {
  try {
    return document.cookie.split(";").some((c) => c.trim().startsWith("everleap_verified=1"));
  } catch {
    return false;
  }
}
function isVerifiedNow(): boolean {
  try {
    if (localStorage.getItem("everleap.verified") === "1") return true;
  } catch {}
  return hasVerifiedCookie();
}

export default function SiteHeader({ translucent = false }: Props) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  // Build a consent link that returns the user to the current page after action
  const consentHref = useMemo(() => {
    try {
      const qs = typeof window !== "undefined" ? window.location.search : "";
      const next = `${pathname}${qs}`;
      return `/consent?next=${encodeURIComponent(next)}`;
    } catch {
      return "/consent";
    }
  }, [pathname]);

  useEffect(() => {
    const ctrl = new AbortController();

    const checkAuthoritative = async () => {
      // fast-path UI hint
      setAuthed((prev) => prev || isVerifiedNow());

      try {
        const data = await api.get<MeResponse>("/session/me");
        setAuthed(Boolean(data?.verified));
      } catch {
        // ignore network/cancel
      }
    };

    checkAuthoritative();

    // Sync across tabs when localStorage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === "everleap.verified" || e.key === "everleap.session") {
        checkAuthoritative();
      }
    };
    window.addEventListener("storage", onStorage);

    // Re-check when tab becomes visible (covers cookie updates/expiry)
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkAuthoritative();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ctrl.abort();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shell = translucent
    ? "site-header header-glass"
    : "site-header bg-brand header-elevated";

  return (
    <header className={shell}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold tracking-tight hover:opacity-95"
          aria-label="Everleap Home"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-white text-[11px] font-bold text-[rgb(var(--accent-rgb))] shadow-sm ring-1 ring-white/25">
            EL
          </span>
          <span className="text-white/95">Everleap</span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-3">
          <Link
            href="/contact"
            prefetch={false}
            className="rounded-lg px-2 py-1 text-sm text-white/95 underline-offset-2 hover:underline"
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>

          <Link
            href={consentHref}
            prefetch={false}
            className="rounded-lg px-2 py-1 text-sm text-white/95 underline-offset-2 hover:underline"
            aria-current={pathname.startsWith("/consent") ? "page" : undefined}
          >
            Privacy
          </Link>

          {authed ? (
            <LogoutButton className="rounded-full px-3 py-1.5 text-sm font-semibold bg-white/95 text-[rgb(var(--accent-rgb))] ring-1 ring-white/25 shadow-sm hover:opacity-95" />
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="rounded-full px-3 py-1.5 text-sm font-semibold bg-white/95 text-[rgb(var(--accent-rgb))] ring-1 ring-white/25 shadow-sm hover:opacity-95"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
