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
};

export type SignalsCardProps = {
  dark: boolean;
  progress: SignalsProgress;
  /** Expected from VM; tolerate unknown strings gracefully */
  nextKey: string;
};

type Cat = RecommendedNext;

const SIGNAL_COMPLETE_COUNT = 5;

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

  const items: Array<{ cat: Cat; answered: number }> = [
    { cat: "motivations", answered: Number(progress?.motivationsAnswered ?? 0) },
    { cat: "strengths", answered: Number(progress?.strengthsAnswered ?? 0) },
    { cat: "skills", answered: Number(progress?.skillsAnswered ?? 0) },
  ];

  const shellClass = dark
    ? "border-white/10 bg-white/5 text-white"
    : "border-black/10 bg-white/70 text-slate-900";

  const headerMuted = dark ? "text-white/70" : "text-slate-600";
  const fineMuted = dark ? "text-white/60" : "text-slate-600";
  const divider = dark ? "bg-white/10" : "bg-black/10";

  return (
    <div className="mt-2">
      <div className="mb-2 flex items-end justify-between">
        <div className="text-sm font-semibold">Signals</div>
        <div className={`text-xs ${headerMuted}`}>
          Next up: <span className={dark ? "text-white/85" : "text-slate-900"}>{label(next)}</span>
        </div>
      </div>

      <div className={`rounded-2xl border ${shellClass}`}>
        {/* Single container, minimal inner structure */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {items.map((it, idx) => {
            const answered = clamp(it.answered, 0, SIGNAL_COMPLETE_COUNT);
            const pct = (answered / SIGNAL_COMPLETE_COUNT) * 100;
            const complete = answered >= SIGNAL_COMPLETE_COUNT;
            const isNext = !complete && it.cat === next;

            const itemBorder =
              idx === 0
                ? ""
                : dark
                ? "border-white/10 md:border-l"
                : "border-black/10 md:border-l";

            const rowDivider =
              idx === 0
                ? ""
                : dark
                ? "border-t border-white/10 md:border-t-0"
                : "border-t border-black/10 md:border-t-0";

            const hoverBg = dark ? "hover:bg-white/6" : "hover:bg-black/[0.03]";
            const focusRing = dark
              ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20";

            const pillTone: "done" | "next" | "neutral" = complete ? "done" : isNext ? "next" : "neutral";

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
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      pillClass(dark, pillTone),
                    ].join(" ")}
                  >
                    {complete ? "Done" : `${answered}/${SIGNAL_COMPLETE_COUNT}`}
                  </div>
                </div>

                <div className={`mt-1 text-xs leading-snug ${fineMuted}`}>{desc(it.cat)}</div>

                {/* Minimal progress bar (no inner “card”) */}
                <div className="mt-3">
                  <div className={`h-px w-full ${divider}`} />
                  <div
                    className={[
                      "mt-2 h-[2px] w-full rounded-full",
                      dark ? "bg-white/10" : "bg-black/10",
                    ].join(" ")}
                    aria-hidden
                  >
                    <div
                      className={[
                        "h-[2px] rounded-full transition-[width] duration-300 ease-out",
                        dark ? "bg-white/45" : "bg-slate-900/40",
                      ].join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className={`mt-2 text-[11px] ${fineMuted}`}>
                    {complete ? (
                      <span>Complete.</span>
                    ) : (
                      <span className="group-hover:opacity-95">
                        One solid answer at a time.
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`px-4 pb-3 pt-2 text-[11px] ${fineMuted}`}>
          These aren’t labels. They’re signal — enough for me to recommend next steps that actually fit you.
        </div>
      </div>
    </div>
  );
}
