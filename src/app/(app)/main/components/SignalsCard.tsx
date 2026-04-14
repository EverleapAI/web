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
  nextKey?: RecommendedNext;
};

type Cat = RecommendedNext;
type Saved = { answer?: string; skipped?: boolean };

const STORAGE_KEY_V3 = "everleap.story.answers.v3";
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

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Saved>;
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

  for (let i = 1; i <= SIGNAL_COMPLETE_COUNT; i += 1) {
    const questionId = `${cat}_${i}`;
    if (!isAnswered(source[questionId])) {
      return questionId;
    }
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

function rowClass(dark: boolean, _highlighted: boolean, hasDivider: boolean) {
  return [
    "relative block px-0 py-4 transition",
    hasDivider ? (dark ? "border-t border-white/8" : "border-t border-black/8") : "",
    dark ? "hover:bg-white/[0.015]" : "hover:bg-black/[0.015]",
  ].join(" ");
}

function highlightGlowClass(cat: Cat) {
  if (cat === "motivations") {
    return "bg-[radial-gradient(circle_at_right,rgba(251,191,36,0.04),transparent_52%)]";
  }
  if (cat === "strengths") {
    return "bg-[radial-gradient(circle_at_right,rgba(56,189,248,0.04),transparent_52%)]";
  }
  return "bg-[radial-gradient(circle_at_right,rgba(167,139,250,0.04),transparent_52%)]";
}

function CreativeSignalLead({ dark }: { dark: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span className={["h-1.5 w-1.5 rounded-full", dark ? "bg-amber-200/78" : "bg-amber-600/74"].join(" ")} />
      <span className={["h-1.5 w-1.5 rounded-full", dark ? "bg-sky-200/62" : "bg-sky-600/58"].join(" ")} />
      <span className={["h-1.5 w-1.5 rounded-full", dark ? "bg-violet-200/62" : "bg-violet-600/58"].join(" ")} />
      <span className={["ml-0.5 h-[1px] w-4 rounded-full", dark ? "bg-white/16" : "bg-slate-900/14"].join(" ")} />
    </span>
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function SignalsCard(props: SignalsCardProps) {
  const { dark, progress, nextKey } = props;

  const [saved, setSaved] = React.useState<Record<string, Saved>>({});

  React.useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const text = dark ? "text-white/78" : "text-slate-900";
  const sub = dark ? "text-white/52" : "text-slate-600";
  const meta = dark ? "text-white/42" : "text-slate-500";

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
    <div className="w-full">
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <CreativeSignalLead dark={dark} />
          <SignalWord>Signals</SignalWord>
        </div>

        <div className={`text-[13px] leading-6 ${sub}`}>
          Signals show patterns in what pulls you forward — and what drains you.
        </div>
      </div>

      <div className="relative">
        {items.map((it, idx) => {
          const total = Math.max(1, it.total);
          const answered = clamp(it.answered, 0, total);
          const pct = answered / total;
          const filled = Math.round(pct * DASH_COUNT);
          const highlighted = nextKey === it.cat;
          const questionId = firstUnansweredQuestionId(it.cat, saved);
          const href = buildHref(it.cat, questionId);

          return (
            <Link key={it.cat} href={href} className={rowClass(dark, highlighted, idx !== 0)}>
              {highlighted ? (
                <span className={`pointer-events-none absolute inset-0 ${highlightGlowClass(it.cat)}`} />
              ) : null}

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${accentClass(dark, it.cat)}`} />
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

              <div className="relative z-10 mt-3 flex w-full gap-1">
                {Array.from({ length: DASH_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className={[
                      "h-[5px] min-w-0 flex-1 rounded-full",
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