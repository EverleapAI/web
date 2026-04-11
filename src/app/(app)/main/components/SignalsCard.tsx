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

function accentClass(dark: boolean, cat: Cat) {
  if (cat === "motivations") return dark ? "bg-amber-200/75" : "bg-amber-500/80";
  if (cat === "strengths") return dark ? "bg-sky-200/75" : "bg-sky-500/80";
  return dark ? "bg-violet-200/75" : "bg-violet-500/80";
}

function dashFillClass(dark: boolean, cat: Cat) {
  if (cat === "motivations") return dark ? "bg-amber-200/82" : "bg-amber-500/85";
  if (cat === "strengths") return dark ? "bg-sky-200/82" : "bg-sky-500/85";
  return dark ? "bg-violet-200/82" : "bg-violet-500/85";
}

function dashEmptyClass(dark: boolean) {
  return dark ? "bg-white/12" : "bg-black/10";
}

/* =============================================================================
   Component
   ============================================================================= */

export function SignalsCard(props: SignalsCardProps) {
  const { dark, progress } = props;

  const text = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-white/60" : "text-slate-600";
  const meta = dark ? "text-white/48" : "text-slate-500";
  const divider = dark ? "border-white/10" : "border-black/10";
  const surface = dark
    ? "border border-white/10 bg-white/[0.03] backdrop-blur-xl"
    : "border border-black/10 bg-white/80";

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

  return (
    <div className="mt-4">
      <div className={`overflow-hidden rounded-[24px] ${surface}`}>
        <div>
          {items.map((it, idx) => {
            const total = Math.max(1, it.total);
            const answered = clamp(it.answered, 0, total);
            const pct = answered / total;
            const filled = Math.round(pct * DASH_COUNT);

            return (
              <Link
                key={it.cat}
                href={hrefFor(it.cat)}
                className={[
                  "block px-4 py-4 transition sm:px-5",
                  idx !== 0 ? `border-t ${divider}` : "",
                  dark ? "hover:bg-white/[0.03]" : "hover:bg-black/[0.02]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${accentClass(dark, it.cat)}`}
                      />
                      <div className={`text-[15px] font-semibold ${text}`}>
                        {label(it.cat)}
                      </div>
                    </div>

                    <div className={`mt-1 text-[13px] ${sub}`}>
                      {desc(it.cat)}
                    </div>

                    <div className={`mt-2 text-[12px] ${meta}`}>
                      {answered} of {total}
                    </div>
                  </div>

                  <div className={`shrink-0 text-[12px] ${meta}`}>
                    {Math.round(pct * 100)}%
                  </div>
                </div>

                <div className="mt-3 flex w-full gap-1">
                  {Array.from({ length: DASH_COUNT }).map((_, i) => (
                    <span
                      key={i}
                      className={[
                        "h-[4px] min-w-0 flex-1 rounded-full",
                        i < filled ? dashFillClass(dark, it.cat) : dashEmptyClass(dark),
                      ].join(" ")}
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}