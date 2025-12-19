"use client";

import * as React from "react";
import type { StepperStep } from "@/components/career/stepperTypes";
import type { StepperPersistedState } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
};

export function OverviewStep({ step, progress }: Props) {
  const zip = (progress.zipCode ?? "").trim();

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      {/* Step label */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          Product / UX
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          You’re wired for clarity + momentum. Product/UX rewards people who can
          turn messy human needs into something real — and improve it fast.
        </p>
      </div>

      {/* Micro chips (skim-friendly) */}
      <div className="flex flex-wrap gap-2">
        {[
          "Build → test → iterate",
          "Real users",
          "Fast feedback",
          "Outcome-focused",
          "Creative + logical",
        ].map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 3 quick sections (cards) */}
      <div className="grid gap-3">
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="text-sm font-semibold text-slate-50">
            Why this fits
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200/85">
            <li>You like impact you can see — Product work gives fast signal.</li>
            <li>You get bored by performative work — this forces outcomes.</li>
            <li>
              Your edge is sense-making: what matters, what doesn’t, what to fix
              next.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="text-sm font-semibold text-slate-50">
            What you’ll actually do
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-200/85">
            You’ll design and improve experiences people use: apps, websites,
            flows, onboarding, checkout, dashboards. You’ll talk to users, make
            prototypes, test ideas, and iterate.
          </p>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200/80">
            <span className="font-semibold text-slate-100">Reality check:</span>{" "}
            Most of the job is deciding what to build next and why — not “making
            it pretty.”
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="text-sm font-semibold text-slate-50">
            Your 3-day micro test
          </div>
          <ol className="mt-3 space-y-2 text-sm text-slate-200/85">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                1
              </span>
              Pick one app you use daily. Screenshot one annoying screen.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                2
              </span>
              Redesign it quickly (paper, Figma, or slides). Make it clearer.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                3
              </span>
              Show it to 2 people: “What’s better? What’s confusing?”
            </li>
          </ol>
        </div>
      </div>

      {/* Tiny footer hint */}
      <div className="pt-2 text-xs text-slate-300/60">
        {zip ? (
          <>
            We’ll use <span className="text-slate-100">{zip}</span> later to
            show local classes, meetups, and programs.
          </>
        ) : (
          <>Later we’ll ask for your ZIP so we can show local options.</>
        )}
      </div>
    </section>
  );
}
