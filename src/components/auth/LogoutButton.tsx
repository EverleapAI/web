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
      // Ask backend to clear the HttpOnly session
      await api.post<{ ok: boolean }>("/auth/logout", {});
    } catch {
      // Even if the network call fails, fall through and clear local hints
    } finally {
      // Clear any local/UI hints
      try {
        localStorage.removeItem("everleap.verified");
        localStorage.removeItem("everleap.userId");
        localStorage.removeItem("everleap.session");
        localStorage.removeItem("everleap.otp.requestId");
        document.cookie = "everleap_verified=; Max-Age=0; path=/; SameSite=Lax";
      } catch {
        /* ignore */
      }
      setBusy(false);
      router.replace("/");
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
