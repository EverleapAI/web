// apps/web/src/app/(app)/main/explore/_components/WorkSignalGate.tsx
//
// The signal-level card on the careers page, mirroring the Insights unlock CTA
// but keyed to how much of ALL story questions the user has answered:
//   "low"     (<20%)   — amber. Too little signal to recommend honestly: no cards
//                        shown, just this "answer a few and we'll match you" card.
//   "partial" (20-99%) — sky.   Cards ARE shown; this says "these are real, but
//                        we can do better once you finish."
// At 100% neither renders (the caller drops it).

"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export function WorkSignalGate({
  variant,
  href,
}: {
  variant: "low" | "partial";
  href: string;
}) {
  const cfg =
    variant === "partial"
      ? {
          accent: "96, 176, 255", // sky
          Icon: TrendingUp,
          eyebrow: "You're on your way",
          body:
            "These are real matches from what we already know about you — but you haven't answered everything yet, and the more you do, the sharper and more surprising these get.",
          cta: "Answer a few more questions",
        }
      : {
          accent: "251, 191, 36", // amber
          Icon: Sparkles,
          eyebrow: "Let's find your matches",
          body:
            "We match careers to who you actually are — how you think, what pulls you, what you're good at. We just don't know enough about you yet to do it honestly. A few questions is all it takes to unlock real recommendations.",
          cta: "Answer a few questions",
        };
  const { accent, Icon } = cfg;

  return (
    <div
      className="relative overflow-hidden rounded-card border p-4 sm:p-5"
      style={{
        borderColor: `rgba(${accent}, 0.32)`,
        background: `linear-gradient(180deg, rgba(${accent},0.12), rgba(255,255,255,0.02)), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 60%, rgb(4,8,20) 100%)`,
        boxShadow: `inset 0 0 0 1px rgba(${accent},0.10), 0 18px 46px rgba(0,0,0,0.42)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(200px 130px at 90% 0%, rgba(${accent},0.24), transparent 70%)` }}
      />
      <div className="relative">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
            style={{ backgroundColor: `rgba(${accent}, 0.18)`, color: `rgba(${accent}, 0.98)` }}
          >
            <Icon size={18} strokeWidth={2.1} />
          </span>
          <div
            className="text-meta font-semibold uppercase tracking-eyebrow"
            style={{ color: `rgba(${accent}, 0.92)` }}
          >
            {cfg.eyebrow}
          </div>
        </div>

        <p className="text-body leading-body text-ink">{cfg.body}</p>

        <div className="mt-3.5">
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-label font-semibold transition"
            style={{ color: `rgba(${accent}, 0.98)` }}
          >
            <span>{cfg.cta}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WorkSignalGate;
