"use client";

// The one LOUD card in the system.
//
// Everything else on a screen shares the near-black surface, and accent lives
// only in a glyph, an eyebrow and a CTA. This is the deliberate exception: a
// card that is genuinely tinted, because it exists to say "there is something
// here you can't see yet, and you're a few questions away from it".
//
// It earns the exception by being TEMPORARY. It appears when a pool is thin and
// goes away for good once it isn't, so it can never become part of the furniture
// — which is exactly what made per-card accent washes read as a patchwork when
// every card had one. One loud card on a quiet page is emphasis. Every card
// loud is noise.
//
// The recipe was already written, twice over, inside InsightsUnlockCTA. It lives
// here now so the story nudge on Today and the category nudges on Insights are
// the same object rather than two things that merely resemble each other.

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function UnlockCard({
  accent,
  Icon,
  eyebrow,
  href,
  cta,
  children,
  className,
}: {
  /** "r, g, b" — carries the whole card, not just its furniture. */
  accent: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  eyebrow: string;
  href: string;
  cta: string;
  /** The body copy. Says what is missing and what unlocks it. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["relative overflow-hidden rounded-card border p-4 sm:p-5", className ?? ""].join(" ")}
      style={{
        borderColor: `rgba(${accent}, 0.32)`,
        background: `linear-gradient(180deg, rgba(${accent},0.12), rgba(255,255,255,0.02)), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 60%, rgb(4,8,20) 100%)`,
        boxShadow: `inset 0 0 0 1px rgba(${accent},0.10), 0 18px 46px rgba(0,0,0,0.42)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(200px 130px at 90% 0%, rgba(${accent},0.24), transparent 70%)`,
        }}
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
            {eyebrow}
          </div>
        </div>

        <div className="text-body leading-body text-ink">{children}</div>

        <div className="mt-3.5">
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-label font-semibold transition"
            style={{ color: `rgba(${accent}, 0.98)` }}
          >
            <span>{cta}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UnlockCard;
