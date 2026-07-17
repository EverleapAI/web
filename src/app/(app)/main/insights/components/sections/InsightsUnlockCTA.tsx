// apps/web/src/app/(app)/main/insights/components/sections/InsightsUnlockCTA.tsx
//
// The signal-level call-to-action on the Motivations / Strengths / Skills tabs.
// Two colourful variants, by how much of the category the user has answered:
//   "low"     (<20%)   — amber. Nothing to show yet: "there's a lot we could
//                        show you here, we just don't have enough — unlock it."
//   "partial" (20-99%) — sky.   Content IS shown alongside it: "we've got enough
//                        for some early thinking, finish the category to sharpen."
// Both are deliberately COLOURFUL so they read as the one thing to act on, and
// both link to the next question in that category in Story.

"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export function InsightsUnlockCTA({
  dark,
  category,
  href,
  variant = "low",
}: {
  dark: boolean;
  /** Display label for the category, e.g. "Motivations". */
  category: string;
  href: string;
  variant?: "low" | "partial";
}) {
  void dark; // this page is always dark (nightDusk); kept for a consistent API
  const categoryLower = category.toLowerCase();

  const cfg =
    variant === "partial"
      ? {
          accent: "96, 176, 255", // sky — "you're on your way"
          Icon: TrendingUp,
          eyebrow: "You're on your way",
          cta: `Finish ${category} questions`,
        }
      : {
          accent: "251, 191, 36", // amber — "there's more to unlock"
          Icon: Sparkles,
          eyebrow: "There's a lot more here",
          cta: `Answer ${category} questions`,
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

        {variant === "partial" ? (
          <p className="text-body leading-body text-ink">
            We’ve got enough here to show you some early thinking about your{" "}
            {categoryLower} — but there’s more to this category, and finishing it
            lets us do it real justice. A few more {category} questions and this
            sharpens.
          </p>
        ) : (
          <p className="text-body leading-body text-ink">
            There’s a lot we can show you about your {categoryLower} — the patterns
            behind them, what’s really driving them, and where they show up in your
            life. We just don’t have enough from you yet to say any of it with
            confidence. A few {category} questions is all it takes to unlock it.
          </p>
        )}

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

export default InsightsUnlockCTA;
