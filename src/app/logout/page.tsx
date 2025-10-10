"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Clears Everleap session via server (HttpOnly cookies) + local hints, then redirects.
 */
export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // Clear HttpOnly cookies on the server (no credentials needed; same-origin)
        await fetch("/api/session/logout", { method: "POST", cache: "no-store" });
      } catch {
        // ignore — we'll still clear local hints and redirect
      }

      try {
        // Clear local UI hints
        localStorage.removeItem("everleap.verified");
        localStorage.removeItem("everleap.userId");
        localStorage.removeItem("everleap.session");
        localStorage.removeItem("everleap.otp.requestId");
      } catch {
        /* ignore */
      }

      // Client-clearing attempt (non-authoritative, but helps older tabs)
      try {
        const expire = "Expires=Thu, 01 Jan 1970 00:00:00 GMT";
        const base = "Path=/; SameSite=Lax";
        const secure = location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `everleap_verified=; ${base}; ${expire}${secure}`;
        document.cookie = `everleap_session=; ${base}; ${expire}${secure}`;
      } catch {
        /* ignore */
      }

      router.replace("/welcome");
    })();
  }, [router]);

  return (
    <main className="min-h-dvh grid place-items-center">
      <p className="text-sm text-black/60">Signing you out…</p>
    </main>
  );
}
