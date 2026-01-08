// src/components/career/steps/productUx/FutureAiSalaryStep.tsx
"use client";

import * as React from "react";
import type { StepperStep, StepperPersistedState } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100">
      {children}
    </span>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-50">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-200/85">{children}</div>
    </div>
  );
}

function RangeRow({
  label,
  range,
  note,
}: {
  label: string;
  range: string;
  note: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-50">{label}</div>
        <div className="mt-1 text-xs text-slate-300/75">{note}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-semibold text-sky-200">{range}</div>
        <div className="mt-1 text-[0.7rem] text-slate-300/60">USD / year</div>
      </div>
    </div>
  );
}

function normalizeZip(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (/^\d{5}(-\d{4})?$/.test(s)) return s;
  return "";
}

/**
 * NOTE:
 * These are intentionally "safe placeholder" ranges for now.
 * Later we can pull live ranges by region + level, and show citations.
 */
const PLACEHOLDER_RANGES = [
  {
    label: "Intern / student",
    range: "$0 – $30k",
    note: "Often hourly / part-time. Real value = portfolio + mentorship.",
  },
  {
    label: "Entry (0–2 yrs)",
    range: "$70k – $110k",
    note: "Depends heavily on city, company, and portfolio strength.",
  },
  {
    label: "Mid (2–5 yrs)",
    range: "$110k – $160k",
    note: "You’re expected to own flows, ship improvements, and test with users.",
  },
  {
    label: "Senior (5+ yrs)",
    range: "$160k – $230k+",
    note: "Own outcomes, lead strategy, partner with PM + eng, mentor others.",
  },
];

export function FutureAiSalaryStep({ step, progress }: Props) {
  const zip = normalizeZip(progress["zip"]);

  const aiImpact = [
    {
      title: "What AI accelerates",
      bullets: [
        "Fast drafts: layouts, variations, copy options",
        "Prototype generation (rough versions, quickly)",
        "Research summarization (notes → themes faster)",
      ],
    },
    {
      title: "What AI doesn’t replace",
      bullets: [
        "Taste + judgment (what’s actually good)",
        "Human insight (why people behave that way)",
        "Tradeoffs (what to cut, what to keep)",
        "Trust-building (ethics, accessibility, clarity)",
      ],
    },
  ];

  const howToWin = [
    "Become elite at problem framing (the right question).",
    "Get good at user testing (tiny tests, weekly).",
    "Communicate decisions clearly (simple rationale).",
    "Ship artifacts (screens, flows, prototypes) — not just opinions.",
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">AI + salary (what to expect)</h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          Today these are placeholder ranges. Soon we’ll tailor this by location and lane specialty—plus show where the
          numbers come from.
        </p>
      </div>

      <Card title="Salary ranges (placeholder for now)">
        <div className="mt-3 space-y-2">
          {PLACEHOLDER_RANGES.map((r) => (
            <RangeRow key={r.label} label={r.label} range={r.range} note={r.note} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>Portfolio &gt; resume</Chip>
          <Chip>City matters</Chip>
          <Chip>Company stage matters</Chip>
          <Chip>Specialty can boost</Chip>
        </div>

        <div className="mt-3 text-xs text-slate-300/60">
          {zip ? (
            <>
              Later: we’ll estimate a ZIP-adjusted range for <span className="text-slate-100">{zip}</span>.
            </>
          ) : (
            <>Later: we’ll estimate a ZIP-adjusted range once we have your ZIP.</>
          )}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {aiImpact.map((x) => (
          <div
            key={x.title}
            className="rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <div className="text-sm font-semibold text-slate-50">{x.title}</div>
            <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-slate-200/85">
              {x.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Card title="How to win in an AI-heavy UX world">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">Your advantage</div>
          <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-slate-200/85">
            {howToWin.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="mt-3 text-xs text-slate-300/60">
          The goal is simple: use AI to go faster, but keep the *human* part sharper than everyone else.
        </div>
      </Card>
    </section>
  );
}
