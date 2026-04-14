"use client";

import * as React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

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
  nextKey?: RecommendedNext;
};

type Cat = RecommendedNext;
type Saved = { answer?: string; skipped?: boolean };

const STORAGE_KEY_V3 = "everleap.story.answers.v3";
const SIGNAL_COMPLETE_COUNT = 5;
const DASH_COUNT = 12;

/* =============================================================================
   Header
   ============================================================================= */

function headerRow() {
  return "mb-3 flex items-center gap-2";
}

function headerIconWrap(dark: boolean) {
  return [
    "flex h-4 w-4 items-center justify-center rounded-[5px]",
    dark
      ? "bg-violet-300/10 text-violet-200/70"
      : "bg-violet-500/10 text-violet-600/70",
  ].join(" ");
}

function headerTitleClass(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.28em]",
    dark ? "text-white/42" : "text-slate-600",
  ].join(" ");
}

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

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function isAnswered(saved: Saved | undefined): boolean {
  if (!saved) return false;
  if (saved.skipped) return true;
  return typeof saved.answer === "string" && saved.answer.trim().length > 0;
}

function firstUnansweredQuestionId(cat: Cat, saved?: Record<string, Saved>) {
  const source = saved ?? {};
  for (let i = 1; i <= SIGNAL_COMPLETE_COUNT; i++) {
    const id = `${cat}_${i}`;
    if (!isAnswered(source[id])) return id;
  }
  return `${cat}_1`;
}

function buildHref(cat: Cat, questionId: string) {
  const params = new URLSearchParams();
  params.set("cat", cat);
  params.set("questionId", questionId);
  params.set("returnTo", "/main");
  return `/main/questions?${params.toString()}`;
}

function accentClass(dark: boolean, cat: Cat) {
  if (cat === "motivations") return dark ? "bg-amber-200/78" : "bg-amber-500/82";
  if (cat === "strengths") return dark ? "bg-sky-200/74" : "bg-sky-500/82";
  return dark ? "bg-violet-200/74" : "bg-violet-500/82";
}

function dashFillClass(dark: boolean, cat: Cat) {
  if (cat === "motivations") return dark ? "bg-amber-200/82" : "bg-amber-500/86";
  if (cat === "strengths") return dark ? "bg-sky-200/78" : "bg-sky-500/86";
  return dark ? "bg-violet-200/78" : "bg-violet-500/86";
}

function dashEmptyClass(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function rowClass(dark: boolean, hasDivider: boolean) {
  return [
    "relative block px-0 py-3 transition",
    hasDivider ? (dark ? "border-t border-white/8" : "border-t border-black/8") : "",
  ].join(" ");
}

/* =============================================================================
   Component
   ============================================================================= */

export function SignalsCard(props: SignalsCardProps) {
  const { dark, progress } = props;

  const [saved, setSaved] = React.useState<Record<string, Saved>>({});

  React.useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const text = dark ? "text-white/78" : "text-slate-900";
  const sub = dark ? "text-white/52" : "text-slate-600";
  const meta = dark ? "text-white/42" : "text-slate-500";

  const items: Array<{ cat: Cat; answered: number; total: number }> = [
    {
      cat: "motivations",
      answered: Number(progress?.motivationsAnswered ?? 0),
      total: Number(progress?.motivationsTotal ?? SIGNAL_COMPLETE_COUNT),
    },
    {
      cat: "strengths",
      answered: Number(progress?.strengthsAnswered ?? 0),
      total: Number(progress?.strengthsTotal ?? SIGNAL_COMPLETE_COUNT),
    },
    {
      cat: "skills",
      answered: Number(progress?.skillsAnswered ?? 0),
      total: Number(progress?.skillsTotal ?? SIGNAL_COMPLETE_COUNT),
    },
  ];

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className={headerRow()}>
        <span className={headerIconWrap(dark)}>
          <Activity className="h-3.5 w-3.5" />
        </span>

        <div className={headerTitleClass(dark)}>Signals</div>
      </div>

      {/* CONTENT */}
      <div>
        {items.map((it, idx) => {
          const total = Math.max(1, it.total);
          const answered = clamp(it.answered, 0, total);
          const pct = answered / total;
          const filled = Math.round(pct * DASH_COUNT);
          const questionId = firstUnansweredQuestionId(it.cat, saved);
          const href = buildHref(it.cat, questionId);

          return (
            <Link key={it.cat} href={href} className={rowClass(dark, idx !== 0)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${accentClass(dark, it.cat)}`} />
                    <div className={`text-[15px] font-semibold ${text}`}>
                      {label(it.cat)}
                    </div>
                  </div>

                  <div className={`mt-0.5 text-[13px] ${sub}`}>
                    {desc(it.cat)}
                  </div>
                </div>

                <div className={`shrink-0 text-[12px] ${meta}`}>
                  {Math.round(pct * 100)}%
                </div>
              </div>

              <div className="mt-2 flex w-full gap-1">
                {Array.from({ length: DASH_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className={[
                      "h-[5px] flex-1 rounded-full",
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
  );
}