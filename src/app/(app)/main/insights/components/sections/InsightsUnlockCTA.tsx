// apps/web/src/app/(app)/main/insights/components/sections/InsightsUnlockCTA.tsx
//
// The low-signal call-to-action shown on the Motivations / Strengths / Skills
// tabs when there isn't enough signal in that category yet. Unlike the other
// cards it is deliberately COLOURFUL — a warm amber "there's more to unlock"
// card — so it clearly calls itself out as the one thing to act on. The copy is
// verbose on purpose: it tells the user there's a lot we CAN show them here, we
// just don't have enough yet, and exactly how to unlock it.

"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const ACCENT = "251, 191, 36"; // amber — "there's more to unlock here"

export function InsightsUnlockCTA({
  dark,
  category,
  href,
}: {
  dark: boolean;
  /** Display label for the category, e.g. "Motivations". */
  category: string;
  href: string;
}) {
  void dark; // this page is always dark (nightDusk); kept for a consistent API
  const categoryLower = category.toLowerCase();

  return (
    <div
      className="relative overflow-hidden rounded-card border p-4 sm:p-5"
      style={{
        borderColor: `rgba(${ACCENT}, 0.32)`,
        background: `linear-gradient(180deg, rgba(${ACCENT},0.12), rgba(255,255,255,0.02)), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 60%, rgb(4,8,20) 100%)`,
        boxShadow: `inset 0 0 0 1px rgba(${ACCENT},0.10), 0 18px 46px rgba(0,0,0,0.42)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(200px 130px at 90% 0%, rgba(${ACCENT},0.24), transparent 70%)` }}
      />

      <div className="relative">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
            style={{ backgroundColor: `rgba(${ACCENT}, 0.18)`, color: `rgba(${ACCENT}, 0.98)` }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div
            className="text-meta font-semibold uppercase tracking-eyebrow"
            style={{ color: `rgba(${ACCENT}, 0.92)` }}
          >
            There’s a lot more here
          </div>
        </div>

        <p className="text-body leading-body text-ink">
          There’s a lot we can show you about your {categoryLower} — the patterns
          behind them, what’s really driving them, and where they show up in your
          life. We just don’t have enough from you yet to say any of it with
          confidence. A few {category} questions is all it takes to unlock it.
        </p>

        <div className="mt-3.5">
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-label font-semibold transition"
            style={{ color: `rgba(${ACCENT}, 0.98)` }}
          >
            <span>Answer {category} questions</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InsightsUnlockCTA;
