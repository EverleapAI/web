// src/app/main/components/SignalsCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";

import type { RecommendedNext } from "./TodayIntro";

/* =============================================================================
   Types
   ============================================================================= */

export type SignalsProgress = {
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;

  // Optional totals (future-proof for 30–50 questions per lane)
  motivationsTotal?: number;
  strengthsTotal?: number;
  skillsTotal?: number;
};

export type SignalsCardProps = {
  dark: boolean;
  progress: SignalsProgress;
  /** Expected from VM; tolerate unknown strings gracefully */
  nextKey: string;
};

type Cat = RecommendedNext;

const SIGNAL_COMPLETE_COUNT = 5; // fallback total for now
const DASH_COUNT = 12;

/* =============================================================================
   Helpers
   ============================================================================= */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function label(cat: Cat) {
  return cat === "motivations" ? "Motivations" : cat === "strengths" ? "Strengths" : "Skills";
}

function desc(cat: Cat) {
  if (cat === "motivations") return "What pulls you forward (and what drains you).";
  if (cat === "strengths") return "How you operate when you’re at your best.";
  return "What you can build or practice next.";
}

function hrefFor(cat: Cat) {
  const params = new URLSearchParams();
  params.set("cat", cat);
  params.set("returnTo", "/main");
  return `/main/questions?${params.toString()}`;
}

function toCat(nextKey: string): Cat {
  const k = (nextKey ?? "").toLowerCase();
  if (k.includes("strength")) return "strengths";
  if (k.includes("skill")) return "skills";
  return "motivations";
}

function accentDotClass(dark: boolean, cat: Cat) {
  // Subtle identity without “boxes in boxes”
  if (cat === "motivations") return dark ? "bg-amber-200/75" : "bg-amber-500/80";
  if (cat === "strengths") return dark ? "bg-sky-200/65" : "bg-sky-500/70";
  return dark ? "bg-violet-200/65" : "bg-violet-500/70";
}

function dashFillClass(dark: boolean, cat: Cat) {
  // Match lane identity (more “signal” than a generic bar)
  if (cat === "motivations") return dark ? "bg-amber-200/80" : "bg-amber-500/85";
  if (cat === "strengths") return dark ? "bg-sky-200/70" : "bg-sky-500/80";
  return dark ? "bg-violet-200/70" : "bg-violet-500/80";
}

function dashEmptyClass(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function pillClass(dark: boolean, tone: "done" | "next" | "neutral") {
  if (dark) {
    if (tone === "done") return "bg-emerald-400/10 text-emerald-100";
    if (tone === "next") return "bg-white/10 text-white/85";
    return "bg-white/8 text-white/70";
  }
  if (tone === "done") return "bg-emerald-600/10 text-emerald-800";
  if (tone === "next") return "bg-slate-900/10 text-slate-900";
  return "bg-slate-900/5 text-slate-600";
}

/* =============================================================================
   Component
   ============================================================================= */

export function SignalsCard(props: SignalsCardProps) {
  const { dark, progress, nextKey } = props;

  const next = toCat(nextKey);

  const totalFor = (cat: Cat) => {
    const fallback = SIGNAL_COMPLETE_COUNT;
    if (cat === "motivations") return Number(progress?.motivationsTotal ?? fallback);
    if (cat === "strengths") return Number(progress?.strengthsTotal ?? fallback);
    return Number(progress?.skillsTotal ?? fallback);
  };

  const answeredFor = (cat: Cat) => {
    if (cat === "motivations") return Number(progress?.motivationsAnswered ?? 0);
    if (cat === "strengths") return Number(progress?.strengthsAnswered ?? 0);
    return Number(progress?.skillsAnswered ?? 0);
  };

  const items: Array<{ cat: Cat; answered: number; total: number }> = [
    { cat: "motivations", answered: answeredFor("motivations"), total: totalFor("motivations") },
    { cat: "strengths", answered: answeredFor("strengths"), total: totalFor("strengths") },
    { cat: "skills", answered: answeredFor("skills"), total: totalFor("skills") },
  ];

  // Slightly less “boxed” / more cinematic: softer border + more transparent fill
  const shellClass = dark
    ? "border-white/8 bg-white/4 text-white"
    : "border-black/8 bg-white/60 text-slate-900";

  const headerMuted = dark ? "text-white/65" : "text-slate-600";
  const fineMuted = dark ? "text-white/55" : "text-slate-600";

  return (
    <div className="mt-2">
      <div className="mb-2">
        <div className="flex items-end justify-between">
          <div className="text-sm font-semibold">Signals</div>

          {/* Make “Next up” quieter so it doesn’t compete with the framing line */}
          <div className={`text-[11px] ${headerMuted}`}>
            Next up:{" "}
            <span className={dark ? "text-white/80" : "text-slate-900/85"}>
              {label(next)}
            </span>
          </div>
        </div>

        {/* Option B (kept) */}
        <div className={`mt-1 text-[11px] ${fineMuted}`}>
          These aren’t labels — they’re clues. Enough for me to point you toward next steps that actually fit.
        </div>
      </div>

      <div className={`rounded-2xl border ${shellClass}`}>
        {/* Single container, minimal inner structure */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {items.map((it, idx) => {
            const total = Math.max(1, Number.isFinite(it.total) ? it.total : SIGNAL_COMPLETE_COUNT);
            const answered = clamp(Number.isFinite(it.answered) ? it.answered : 0, 0, total);

            const pct = clamp(total > 0 ? answered / total : 0, 0, 1);
            const filled = clamp(Math.round(pct * DASH_COUNT), 0, DASH_COUNT);

            const complete = pct >= 0.999;
            const isNext = !complete && it.cat === next;

            const itemBorder =
              idx === 0
                ? ""
                : dark
                ? "border-white/8 md:border-l"
                : "border-black/8 md:border-l";

            const rowDivider =
              idx === 0
                ? ""
                : dark
                ? "border-t border-white/8 md:border-t-0"
                : "border-t border-black/8 md:border-t-0";

            const hoverBg = dark ? "hover:bg-white/5" : "hover:bg-black/[0.025]";
            const focusRing = dark
              ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/22"
              : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/18";

            const pillTone: "done" | "next" | "neutral" = complete ? "done" : isNext ? "next" : "neutral";
            const pctLabel = complete ? "Done" : `${Math.round(pct * 100)}%`;

            return (
              <Link
                key={it.cat}
                href={hrefFor(it.cat)}
                className={[
                  "group block",
                  "px-4 py-3",
                  "transition",
                  hoverBg,
                  focusRing,
                  itemBorder,
                  rowDivider,
                ].join(" ")}
                aria-label={`Open ${label(it.cat)} questions`}
                title={`Open ${label(it.cat)}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className={`h-2 w-2 shrink-0 rounded-full ${accentDotClass(dark, it.cat)}`}
                    />
                    <div className="min-w-0 truncate text-sm font-semibold">{label(it.cat)}</div>
                  </div>

                  <div
                    className={[
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                      pillClass(dark, pillTone),
                    ].join(" ")}
                    aria-label={`${label(it.cat)} progress ${pctLabel}`}
                  >
                    {pctLabel}
                  </div>
                </div>

                <div className={`mt-1 text-xs leading-snug ${fineMuted}`}>{desc(it.cat)}</div>

                {/* Segmented “signal” dashes (percent-based, with more breathing room on mobile) */}
                <div className="mt-3" aria-hidden>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {Array.from({ length: DASH_COUNT }).map((_, i) => {
                      const isFilled = i < filled;
                      return (
                        <span
                          key={`${it.cat}_dash_${i}`}
                          className={[
                            "inline-block",
                            "h-1.5",
                            // slightly smaller on the tightest screens, breathes better
                            "w-4 sm:w-5 md:w-6",
                            "rounded-full",
                            isFilled ? dashFillClass(dark, it.cat) : dashEmptyClass(dark),
                          ].join(" ")}
                        />
                      );
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
