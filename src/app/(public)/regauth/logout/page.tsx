// src/app/(public)/regauth/logout/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { REGAUTH_ROUTES } from "@/regauth/config";
import { clearAuthStorage, clearRegAuthDraft } from "@/regauth/state/storage";
import { sanitizeReturnTo } from "@/regauth/lib/returnTo";
import { clearAuthedCache } from "@/regauth/state/session";

async function postLogout(): Promise<boolean> {
  try {
    const res = await fetch("/api/regauth/logout", { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

export default function RegAuthLogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    (async () => {
      // Clear server session cookie (httpOnly)
      await postLogout();

      // Bust in-memory authed cache
      clearAuthedCache();

      // Clear client-local auth state (UI stub)
      clearAuthStorage();
      clearRegAuthDraft();

      // Redirect back to auth entry (or safe returnTo)
      const returnTo = sanitizeReturnTo(searchParams?.get("returnTo"));
      router.replace(returnTo || REGAUTH_ROUTES.entry);
    })();
  }, [router, searchParams]);

  return <div className="text-sm text-neutral-300">Signing you out…</div>;
}
