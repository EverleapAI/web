"use client";

import * as React from "react";

import { clearAuthedCache } from "@/regauth/state/session";
import { clearAuthStorage, clearRegAuthDraft } from "@/regauth/state/storage";

async function postLogout(): Promise<void> {
  try {
    await fetch("/api/regauth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Still continue with local cleanup + hard redirect.
  }
}

export default function RegAuthLogoutPage(): React.JSX.Element {
  React.useEffect(() => {
    async function logout() {
      await postLogout();

      clearAuthedCache();
      clearAuthStorage();
      clearRegAuthDraft();

      window.location.href = "/";
    }

    void logout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-white">
      <div className="text-sm text-white/55">Signing you out…</div>
    </main>
  );
}