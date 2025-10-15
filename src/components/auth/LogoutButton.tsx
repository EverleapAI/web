// apps/web/src/components/auth/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Props = {
  className?: string;
  label?: string;
};

export default function LogoutButton({ className, label = "Sign out" }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);

    try {
      // Clear the server-side (HttpOnly) session.
      // NOTE: no `/api` prefix — api.ts proxies this to Functions.
      await api.post<{ ok: boolean }>("/api/session/logout", {});
    } catch {
      // Even if the network fails, proceed to clear local hints.
    } finally {
      // Clear local/UI hints so the header & guards don't think we're still signed in.
      try {
        localStorage.removeItem("everleap.verified");
        localStorage.removeItem("everleap.userId");
        localStorage.removeItem("everleap.session");
        localStorage.removeItem("everleap.otp.requestId");

        // Nudge other tabs via storage event
        localStorage.setItem("everleap.logout.ts", String(Date.now()));
        // (optional) tidy up the nudge key
        setTimeout(() => {
          try { localStorage.removeItem("everleap.logout.ts"); } catch {}
        }, 0);

        // Best-effort clear of any non-HttpOnly hint cookie
        document.cookie = "everleap_verified=; Max-Age=0; path=/; SameSite=Lax";
      } catch {
        /* ignore */
      }

      setBusy(false);

      // Navigate home and refresh to ensure a clean tree.
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={
        className ??
        "rounded-full px-3 py-1.5 text-sm font-semibold bg-white/95 text-[rgb(var(--accent-rgb))] ring-1 ring-white/25 shadow-sm hover:opacity-95 disabled:opacity-60"
      }
      aria-busy={busy}
    >
      {busy ? "Signing out…" : label}
    </button>
  );
}
