// src/components/career/steps/productUx/FutureAiSalaryStep.tsx
"use client";

import * as React from "react";
import type {
  StepperStep,
  StepperPersistedState,
} from "@/components/career/stepperTypes";

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

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/16 via-cyan-400/9 to-indigo-500/10 blur-3xl opacity-70" />
        <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/14 via-fuchsia-400/8 to-sky-500/10 blur-3xl opacity-60" />
      </div>

      <div className="relative">
        <div className="text-sm font-semibold text-slate-50">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-slate-200/85">{subtitle}</div>
        ) : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
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

type ImpactCard = {
  title: string;
  vibe: string;
  bullets: string[];
};

export function FutureAiSalaryStep({ step }: Props) {
  const aiImpact: ImpactCard[] = [
    {
      title: "What AI accelerates",
      vibe: "AI is great at *drafting*. It helps you go from “blank page” → “something to react to.”",
      bullets: [
        "Fast drafts: layouts, variations, copy options",
        "Prototype generation (rough versions, quickly)",
        "Research summarization (notes → themes faster)",
      ],
    },
    {
      title: "What AI doesn’t replace",
      vibe: "The human part still decides what matters — and what people will trust.",
      bullets: [
        "Taste + judgment (what’s actually good)",
        "Human insight (why people behave that way)",
        "Tradeoffs (what to cut, what to keep)",
        "Trust-building (ethics, accessibility, clarity)",
      ],
    },
  ];

  const howToWin = [
    "Get elite at problem framing (ask the right question).",
    "Run tiny user tests weekly (5–15 minutes is enough).",
    "Explain decisions simply (the “why” in plain English).",
    "Ship artifacts (screens, flows, prototypes) — not just opinions.",
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Dive deeper · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          How AI changes this work
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          Let’s keep this useful and honest: AI changes *how* the work happens,
          but it doesn’t erase the need for good taste, clear thinking, and real user empathy.
        </p>
      </div>

      <Panel
        title="What actually moves the needle"
        subtitle="Not a number — the things that make someone worth hiring, whatever the pay turns out to be."
      >
        <div className="flex flex-wrap gap-2">
          <Chip>Portfolio &gt; resume</Chip>
          <Chip>City matters</Chip>
          <Chip>Company stage matters</Chip>
          <Chip>Specialty can boost</Chip>
        </div>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        {aiImpact.map((x, idx) => {
          const accent =
            idx === 0
              ? "from-sky-300/22 via-cyan-300/12 to-indigo-300/12"
              : "from-rose-300/18 via-amber-300/10 to-lime-300/10";

          return (
            <div
              key={x.title}
              className="relative overflow-hidden rounded-[26px] border border-white/10 p-[1px] backdrop-blur-xl"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} />
              <div className="relative rounded-[25px] bg-slate-950/46 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                <div className="text-sm font-semibold text-slate-50">{x.title}</div>
                <div className="mt-2 text-sm text-slate-200/85">{x.vibe}</div>
                <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-slate-200/85">
                  {x.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <Card title="How to win in an AI-heavy UX world">
        <div className="text-sm text-slate-200/85">
          The goal is simple: use AI to go faster, but keep the <span className="font-semibold text-slate-50">human</span>{" "}
          part sharper than everyone else.
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">
            Your advantage
          </div>
          <ul className="mt-3 ml-5 list-disc space-y-2 text-sm text-slate-200/85">
            {howToWin.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="mt-3 text-xs text-slate-300/60">
          Translation: if you can frame problems well, test quickly, and communicate clearly —
          you’ll stay valuable no matter what tools show up next.
        </div>
      </Card>
    </section>
  );
}
