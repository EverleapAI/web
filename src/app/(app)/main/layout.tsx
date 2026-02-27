// src/app/(app)/main/layout.tsx
"use client";

import * as React from "react";
import AppChrome from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useAuthed } from "@/regauth/hooks/useAuthed";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { loading, authed } = useAuthed();

  const showSignOut = !loading && authed;
  const logoutHref = `/regauth/logout?returnTo=/regauth`;

  return (
    <AppChrome>
      <div className="relative min-h-[100svh] flex flex-col">
        {showSignOut ? (
          <div className="pointer-events-none fixed right-3 top-3 z-[80]">
            <a
              href={logoutHref}
              className="pointer-events-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur hover:bg-white/8 hover:text-white/85 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              Sign out
            </a>
          </div>
        ) : null}

        {/* Main content (pad bottom so BottomNav doesn't cover it) */}
        <div className="flex-1 pb-[92px]">{children}</div>

        {/* Logged-in "footer" */}
        <BottomNav />
      </div>
    </AppChrome>
  );
}