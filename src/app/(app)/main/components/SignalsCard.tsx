"use client";

import * as React from "react";
import Link from "next/link";

import type { RecommendedNext } from "./TodayIntro";
import { SignalWord } from "./SignalWord";

/* =============================================================================
   Types
   ============================================================================= */

export type SignalsProgress = {
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;
  motivationsTotal?: number;
  strengthsTotal?: number;
  skillsTotal?: number;
};

export type SignalsCardProps = {
  dark: boolean;
  progress: SignalsProgress;
  nextKey: string;
};

type Cat = RecommendedNext;

const SIGNAL_COMPLETE_COUNT = 5;
const DASH_COUNT = 12;

/* =============================================================================
   Helpers
   ============================================================================= */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function label(cat: Cat) {
  return cat === "motivations"
    ? "Motivations"
    : cat === "strengths"
      ? "Strengths"
      : "Skills";
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
  if (cat === "motivations") return dark ? "bg-amber-200/75" : "bg-amber-500/80";
  if (cat === "strengths") return dark ? "bg-sky-200/65" : "bg-sky-500/70";
  return dark ? "bg-violet-200/65" : "bg-violet-500/70";
}

function dashFillClass(dark: boolean, cat: Cat) {
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

function nodeGlowClass(cat: Cat) {
  if (cat === "motivations") return "bg-amber-300/60";
  if (cat === "strengths") return "bg-sky-300/60";
  return "bg-violet-300/60";
}

function nodeCoreClass(cat: Cat) {
  if (cat === "motivations") return "bg-amber-200";
  if (cat === "strengths") return "bg-sky-200";
  return "bg-violet-200";
}

function traceClass(cat: Cat) {
  if (cat === "motivations") {
    return "bg-[linear-gradient(90deg,rgba(251,191,36,0.00)_0%,rgba(253,230,138,0.72)_48%,rgba(251,191,36,0.00)_100%)]";
  }
  if (cat === "strengths") {
    return "bg-[linear-gradient(90deg,rgba(56,189,248,0.00)_0%,rgba(186,230,253,0.76)_48%,rgba(56,189,248,0.00)_100%)]";
  }
  return "bg-[linear-gradient(90deg,rgba(167,139,250,0.00)_0%,rgba(221,214,254,0.78)_48%,rgba(167,139,250,0.00)_100%)]";
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

  const allComplete = items.every((it) => it.answered >= it.total);

  const shellClass = dark
    ? "border-white/8 bg-white/4 text-white"
    : "border-black/8 bg-white/60 text-slate-900";

  const headerMuted = dark ? "text-white/65" : "text-slate-600";
  const fineMuted = dark ? "text-white/55" : "text-slate-600";

  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-[28px] border ${shellClass} shadow-[0_20px_64px_rgba(0,0,0,0.22)] backdrop-blur-xl`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_0%,rgba(96,165,250,0.08),transparent_22%),radial-gradient(circle_at_14%_100%,rgba(167,139,250,0.07),transparent_28%)]" />

        <div className="relative px-4 pb-2 pt-3 sm:px-5 sm:pt-4 lg:px-6">
          <div className="flex items-end justify-between gap-3">
            <div className="text-sm">
              <SignalWord>Signals</SignalWord>
            </div>

            {!allComplete ? (
              <div className={`text-[11px] ${headerMuted}`}>
                Next up:{" "}
                <span className={dark ? "text-white/82" : "text-slate-900/85"}>
                  {label(next)}
                </span>
              </div>
            ) : (
              <div className={`text-[11px] ${headerMuted}`}>Pattern ready</div>
            )}
          </div>
        </div>

        {allComplete ? (
          <div className="relative px-4 pb-3 pt-2 sm:px-5 sm:pb-4 lg:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/8" />

            <div className="relative h-[48px] sm:h-[54px]">
              <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 h-px -translate-y-1/2 bg-white/10" />

              <div className="pointer-events-none absolute left-[18%] top-1/2 h-[2px] w-[26%] -translate-y-1/2 opacity-80">
                <div
                  className={`h-full w-full rounded-full blur-[0.5px] ${traceClass("motivations")}`}
                />
              </div>

              <div className="pointer-events-none absolute left-[56%] top-1/2 h-[2px] w-[24%] -translate-y-1/2 opacity-80">
                <div
                  className={`h-full w-full rounded-full blur-[0.5px] ${traceClass("skills")}`}
                />
              </div>

              <div className="absolute left-[4%] top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span
                    className={`absolute inset-0 rounded-full blur-[5px] ${nodeGlowClass("motivations")}`}
                  />
                  <span
                    className={`relative h-2 w-2 rounded-full ${nodeCoreClass("motivations")}`}
                  />
                </span>
                <span className="text-[12px] font-semibold text-white/90">
                  Motivations
                </span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span
                    className={`absolute inset-0 rounded-full blur-[5px] ${nodeGlowClass("strengths")}`}
                  />
                  <span
                    className={`relative h-2 w-2 rounded-full ${nodeCoreClass("strengths")}`}
                  />
                </span>
                <span className="text-[12px] font-semibold text-white/90">
                  Strengths
                </span>
              </div>

              <div className="absolute right-[4%] top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[12px] font-semibold text-white/90">Skills</span>
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span
                    className={`absolute inset-0 rounded-full blur-[5px] ${nodeGlowClass("skills")}`}
                  />
                  <span
                    className={`relative h-2 w-2 rounded-full ${nodeCoreClass("skills")}`}
                  />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3">
            {items.map((it, idx) => {
              const total = Math.max(1, it.total ?? SIGNAL_COMPLETE_COUNT);
              const answered = clamp(it.answered ?? 0, 0, total);

              const pct = clamp(answered / total, 0, 1);
              const filled = Math.round(pct * DASH_COUNT);

              const complete = pct >= 0.999;
              const isNext = !complete && it.cat === next;

              const pillTone: "done" | "next" | "neutral" = complete
                ? "done"
                : isNext
                  ? "next"
                  : "neutral";

              const pctLabel = complete ? "Done" : `${Math.round(pct * 100)}%`;

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

              return (
                <Link
                  key={it.cat}
                  href={hrefFor(it.cat)}
                  className={[
                    "group px-4 py-3 transition sm:px-5 sm:py-4 lg:px-6",
                    dark ? "hover:bg-white/5" : "hover:bg-black/[0.025]",
                    itemBorder,
                    rowDivider,
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${accentDotClass(dark, it.cat)}`}
                      />
                      <div className="text-sm font-semibold">{label(it.cat)}</div>
                    </div>

                    <div
                      className={[
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        pillClass(dark, pillTone),
                      ].join(" ")}
                    >
                      {pctLabel}
                    </div>
                  </div>

                  <div className={`mt-1 text-xs leading-5 ${fineMuted}`}>
                    {desc(it.cat)}
                  </div>

                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: DASH_COUNT }).map((_, i) => (
                      <span
                        key={i}
                        className={[
                          "h-1.5 w-4 rounded-full",
                          i < filled ? dashFillClass(dark, it.cat) : dashEmptyClass(dark),
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}