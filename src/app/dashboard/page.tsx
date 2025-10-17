// apps/web/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import LogoutButton from "@/components/auth/LogoutButton";
// TEMP: remove RequireAuth during diagnosis
// import RequireAuth from "@/components/auth/RequireAuth";
import { api } from "@/lib/api";

type MeState = {
  role?: "student" | "supporter";
  firstName?: string;
  lastName?: string;
};

type MeResponse = {
  ok: boolean;
  verified: boolean;
  userId?: string | null;
  issuedAtUtc?: string | null;
  [k: string]: unknown;
};

export default function DashboardPage() {
  const [me, setMe] = useState<MeState>({});
  const [userId, setUserId] = useState<string>("");
  const [sessionResp, setSessionResp] = useState<MeResponse | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [docCookies, setDocCookies] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // IMPORTANT: backend route is hyphenated ("session-me")
        const sess = await api.get<MeResponse>("session-me");
        if (cancelled) return;

        setSessionResp(sess);
        setDocCookies(document.cookie || "(no document.cookie)");

        if (sess?.ok && sess.verified && sess.userId) {
          setUserId(String(sess.userId));
          try {
            localStorage.setItem("everleap.verified", "1");
            localStorage.setItem("everleap.userId", String(sess.userId));
          } catch {}
        } else {
          try {
            const localId = localStorage.getItem("everleap.userId") || "";
            if (localId) setUserId(localId);
          } catch {}
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setSessionError(msg);
        try {
          const localId = localStorage.getItem("everleap.userId") || "";
          if (localId) setUserId(localId);
        } catch {}
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const primary = JSON.parse(localStorage.getItem("everleap.user") || "{}");
      const fallback = JSON.parse(localStorage.getItem("everleap.welcome") || "{}");

      setMe({
        role: (primary.role || fallback.role) as MeState["role"],
        firstName: (primary.firstName || fallback.firstName) as string | undefined,
        lastName: (primary.lastName || fallback.lastName) as string | undefined,
      });
    } catch {}
  }, []);

  const fullName =
    [me.firstName, me.lastName].filter(Boolean).join(" ").trim() || "there";

  return (
    <div className="min-h-dvh bg-app">
      <SiteHeader />

      <main className="spotlight-white">
        <div className="relative z-10 mx-auto w-full max-w-lg px-4 pb-10 pt-6">
          <section className="space-y-4" role="region" aria-labelledby="dash-title">
            <div className="flex items-start justify-between gap-3">
              <h1 id="dash-title" className="text-2xl font-semibold tracking-tight">
                Welcome, {fullName}.
              </h1>
              <LogoutButton className="btn-link text-sm shrink-0" />
            </div>

            <p className="text-sm opacity-80">
              {me.role === "supporter"
                ? "Thanks for supporting a student’s journey. When they’re ready, you’ll see their progress here."
                : "Ready to begin? We’ll take this one small step at a time."}
            </p>

            <div className="card-surface rounded-2xl p-4 space-y-3">
              <div className="text-sm opacity-80">
                Next up: we’ll start with a few short questions to understand what drives you.
              </div>
              <div className="flex gap-3">
                <Link href="/questions" className="btn-primary flex-1">
                  Start questions
                </Link>
                <Link href="/profile" className="btn-muted flex-1">
                  View profile
                </Link>
              </div>
              <p className="text-[11px] opacity-70">
                You can return and change answers anytime.
              </p>
              {userId && (
                <p className="text-[11px] opacity-60">
                  Signed in as <span className="font-mono">{userId}</span>
                </p>
              )}
            </div>

            {/* Diagnostics */}
            <div className="rounded-2xl border p-4 space-y-2">
              <div className="text-sm font-medium opacity-70">Diagnostics</div>
              <div className="text-xs opacity-70">document.cookie</div>
              <pre className="whitespace-pre-wrap break-words text-xs">
                {docCookies}
              </pre>

              <div className="text-xs opacity-70">GET session-me response</div>
              {sessionResp ? (
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(sessionResp, null, 2)}
                </pre>
              ) : sessionError ? (
                <pre className="overflow-auto text-xs text-red-700">
                  {sessionError}
                </pre>
              ) : (
                <div className="text-xs">Loading…</div>
              )}

              <p className="text-[11px] opacity-60">
                This page performs no client-side redirects. If you still get bounced,
                something upstream (middleware/layout/hosting) did it.
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
