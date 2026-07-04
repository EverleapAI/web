"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import AppChrome from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";

const INSIGHTS_TAB_KEYS: Record<string, string> = {
  motivations: "motivations",
  strengths: "strengths",
  skills: "skills",
  funfacts: "fun_facts",
  "fun-facts": "fun_facts",
  fun: "fun_facts",
};

function normalizePageKey(pathname: string, searchParams: URLSearchParams): string {
  if (pathname === "/main" || pathname === "/main/") return "today";

  if (pathname.startsWith("/main/insights")) {
    const rawTab = (
      searchParams.get("tab") ||
      searchParams.get("section") ||
      "summary"
    ).toLowerCase();
    return `insights_${INSIGHTS_TAB_KEYS[rawTab] ?? "summary"}`;
  }

  const section = pathname.split("/").filter(Boolean)[1] ?? "unknown";
  return section.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isQuestions = pathname?.startsWith("/main/questions");

  const searchParamsKey = searchParams?.toString() ?? "";

  React.useEffect(() => {
    if (!pathname) return;

    const pageKey = normalizePageKey(pathname, new URLSearchParams(searchParamsKey));

    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_key: pageKey, target: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParamsKey]);

  // Self-heal a dead session. The middleware only checks that the session cookie
  // *exists*, so a present-but-invalid cookie (expired, or revoked server-side)
  // traps the user on /main: no content loads (API 401s) and /regauth bounces
  // back here because the cookie is still there. If /api/regauth/me reports we're
  // not actually authed while we're on a /main page, clear the dead cookie and
  // send the user to login instead of leaving them stuck.
  React.useEffect(() => {
    let alive = true;

    async function probeAuthed(): Promise<boolean> {
      const res = await fetch("/api/regauth/me", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      return data?.authed === true;
    }

    async function checkSession() {
      try {
        let authed = await probeAuthed();
        if (!authed) {
          // One retry so a transient API blip doesn't log out a valid user.
          await new Promise((r) => setTimeout(r, 1500));
          if (!alive) return;
          authed = await probeAuthed();
        }
        if (!alive || authed) return;
        window.location.href = "/api/regauth/logout?redirect=/regauth";
      } catch {
        // Network error reaching our own route — leave the user be.
      }
    }

    checkSession();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AppChrome flushContent={isQuestions}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className={`min-h-0 flex-1 ${isQuestions ? "" : "pb-[92px]"}`}>
          {children}
        </div>

        {!isQuestions ? <BottomNav /> : null}
      </div>
    </AppChrome>
  );
}