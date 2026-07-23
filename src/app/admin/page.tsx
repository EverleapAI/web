// apps/web/src/app/admin/page.tsx
//
// The admin home. This is Part 1 — the gate + shell. It proves the whole access
// path end-to-end: middleware requires a session to reach here, and this page
// asks the server (/api/console/status → requireAdmin) whether the caller is an
// admin before showing anything. A signed-in non-admin gets the "no access"
// state; the API would 403 them anyway. The editors (questions, options, badges,
// audit log) land in the next parts and hang off this shell.

"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, ListChecks, Trophy, ScrollText, Lock } from "lucide-react";

type Status = "checking" | "denied" | "ok";

const SECTIONS: {
  key: string;
  title: string;
  blurb: string;
  Icon: typeof ListChecks;
  href?: string;
  status: "open" | "later";
}[] = [
  {
    key: "content",
    title: "Questions & answers",
    blurb:
      "Edit question wording, options, order, family and science tag. Live in the DB — no deploy.",
    Icon: ListChecks,
    href: "/admin/questions",
    status: "open",
  },
  {
    key: "badges",
    title: "Badges",
    blurb:
      "Tune bronze / silver / gold criteria and copy, validated against the known metrics.",
    Icon: Trophy,
    href: "/admin/badges",
    status: "open",
  },
  {
    key: "audit",
    title: "Audit log",
    blurb:
      "Every admin change, with who / what / when and a before-after snapshot.",
    Icon: ScrollText,
    status: "later",
  },
];

export default function AdminHome() {
  const [status, setStatus] = React.useState<Status>("checking");
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/console/status", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; admin?: boolean; email?: string }
          | null;
        if (!alive) return;
        if (res.ok && data?.admin) {
          setEmail(data.email ?? null);
          setStatus("ok");
        } else {
          setStatus("denied");
        }
      } catch {
        if (alive) setStatus("denied");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-[100svh] bg-[#020617] px-5 py-10 text-white">
      <div className="mx-auto w-full max-w-[720px]">
        {status === "checking" ? (
          <p className="text-label text-white/50">Checking access…</p>
        ) : status === "denied" ? (
          <div className="flex flex-col items-start gap-4 pt-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-control bg-white/[0.06] text-white/60">
              <Lock className="h-5 w-5" />
            </span>
            <div className="space-y-1.5">
              <h1 className="text-title font-semibold tracking-title">Not your area</h1>
              <p className="max-w-[46ch] text-label leading-body text-white/60">
                This is the Everleap admin console. Your account doesn&apos;t have access.
              </p>
            </div>
            <Link
              href="/main"
              className="text-label font-medium text-cyan-200/90 transition hover:text-cyan-100"
            >
              Back to Everleap →
            </Link>
          </div>
        ) : (
          <>
            {/* Masthead — the same lockup shape the main screens wear. */}
            <div className="mb-2 flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-amber-300/[0.08] text-amber-200/80 ring-1 ring-amber-300/[0.18]">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
              <span className="text-label font-bold uppercase tracking-eyebrow text-amber-200/90">
                Admin
              </span>
            </div>
            <h1 className="text-title font-semibold leading-display tracking-title sm:text-display">
              Everleap control
            </h1>
            <p className="mt-1.5 text-label leading-body text-white/55">
              Signed in as {email ?? "an admin"}. Changes made here are live and audited.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SECTIONS.map((s) => {
                const inner = (
                  <>
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-control bg-white/[0.05] text-white/70">
                        <s.Icon className="h-4 w-4" />
                      </span>
                      <span
                        className={`text-micro font-semibold uppercase tracking-eyebrow ${
                          s.status === "open" ? "text-cyan-200/70" : "text-white/35"
                        }`}
                      >
                        {s.status === "open" ? "Open" : "Later"}
                      </span>
                    </div>
                    <h2 className="text-body font-semibold text-white">{s.title}</h2>
                    <p className="mt-1 text-meta leading-body text-white/55">{s.blurb}</p>
                  </>
                );
                const cls =
                  "block rounded-card border border-white/[0.07] bg-[rgb(18,24,44)] p-5";
                return s.href ? (
                  <Link
                    key={s.key}
                    href={s.href}
                    className={`${cls} transition hover:border-white/15 hover:bg-[rgb(22,29,54)]`}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={s.key} className={`${cls} opacity-70`}>
                    {inner}
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-meta text-white/40">
              Part 1 — the gate and audit trail are in place. The editors attach here next.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
