// apps/web/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import LogoutButton from "@/components/auth/LogoutButton";
import RequireAuth from "@/components/auth/RequireAuth";
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
};

export default function DashboardPage() {
  const [me, setMe] = useState<MeState>({});
  const [userId, setUserId] = useState<string>("");

  // Authoritative session → userId + set local hints
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const sess = await api.get<MeResponse>("/api/session/me");
        if (cancelled) return;

        if (sess?.ok && sess.verified && sess.userId) {
          setUserId(String(sess.userId));
          // ensure client hints are in sync
          try {
            localStorage.setItem("everleap.verified", "1");
            localStorage.setItem("everleap.userId", String(sess.userId));
          } catch {}
        } else {
          // fallback (should rarely happen because RequireAuth guards this page)
          try {
            const localId = localStorage.getItem("everleap.userId") || "";
            if (localId) setUserId(localId);
          } catch {}
        }
      } catch {
        // fallback to any local hints
        try {
          const localId = localStorage.getItem("everleap.userId") || "";
          if (localId) setUserId(localId);
        } catch {}
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Profile-ish display values (from Welcome flow hints for now)
  useEffect(() => {
    try {
      // Primary: values saved by Welcome flow
      const primary = JSON.parse(localStorage.getItem("everleap.user") || "{}");
      // Fallback (older sessions): previous key
      const fallback = JSON.parse(localStorage.getItem("everleap.welcome") || "{}");

      setMe({
        role: primary.role || fallback.role,
        firstName: primary.firstName || fallback.firstName,
        lastName: primary.lastName || fallback.lastName,
      });
    } catch {}
  }, []);

  const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ").trim() || "there";

  return (
    <RequireAuth>
      <div className="min-h-dvh bg-app">
        <SiteHeader />

        {/* Centered content on a soft spotlight */}
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
                  {/* Route to questions entry page */}
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
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </RequireAuth>
  );
}
