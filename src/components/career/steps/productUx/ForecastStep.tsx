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

function MiniCard({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-50">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-200/85">{body}</div>
    </div>
  );
}

export function ForecastStep({ step, progress }: Props) {
  const zip = (progress.zipCode ?? "").trim();

  // Keep this “forecast” intentionally plain + mobile-first.
  const headlines = [
    "Product + UX is still growing — but the bar is rising.",
    "AI won’t replace UX. It will replace sloppy UX.",
    "The winning designers will be: faster, clearer, and closer to real users.",
  ];

  const whatChanges = [
    {
      title: "What changes",
      body: (
        <ul className="ml-5 list-disc space-y-1">
          <li>More work happens inside prototypes, not docs.</li>
          <li>Design gets measured (conversion, retention, trust).</li>
          <li>Teams expect you to think like a product partner, not just “make screens.”</li>
          <li>AI tools speed up drafts — feedback + judgment still wins.</li>
        </ul>
      ),
    },
    {
      title: "What stays valuable",
      body: (
        <ul className="ml-5 list-disc space-y-1">
          <li>Understanding humans (behavior, emotion, motivation).</li>
          <li>Turning messy problems into clear decisions.</li>
          <li>Testing fast with real users.</li>
          <li>Craft: making complex things feel simple.</li>
        </ul>
      ),
    },
  ];

  const whatToPracticeNow = [
    "Write clearer micro-copy (buttons, errors, empty states).",
    "Run 1 user test per week (even with a friend).",
    "Learn 1 prototyping tool deeply (Figma is the default).",
    "Ship tiny: one screen → one flow → one improvement.",
  ];

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
          The next 3–5 years (plain-language forecast)
        </h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          This isn’t a “job guarantee.” It’s a map of where the field is heading so you can aim your practice in the right
          direction.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="text-sm font-semibold text-slate-50">3 headlines</div>
        <div className="mt-3 space-y-2">
          {headlines.map((h) => (
            <div key={h} className="flex gap-3">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
              <div className="text-sm text-slate-200/90">{h}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip>AI-assisted workflows</Chip>
          <Chip>User research matters more</Chip>
          <Chip>Craft + clarity</Chip>
          <Chip>Proof &gt; pedigree</Chip>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {whatChanges.map((x) => (
          <MiniCard key={x.title} title={x.title} body={x.body} />
        ))}
      </div>

      <MiniCard
        title="If you want to be “future-proof”…"
        body={
          <div className="space-y-3">
            <div>
              The safest strategy is simple: <span className="text-slate-50 font-semibold">be the person who can find the real problem</span>,{" "}
              <span className="text-slate-50 font-semibold">test quickly</span>, and{" "}
              <span className="text-slate-50 font-semibold">ship improvements that actually work</span>.
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/70">
                What to practice this month
              </div>
              <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-slate-200/85">
                {whatToPracticeNow.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <div className="pt-1 text-xs text-slate-300/60">
        {zip ? (
          <>
            We’ll eventually tailor this to <span className="text-slate-100">{zip}</span> (local internships, programs,
            meetups, volunteer UX projects).
          </>
        ) : (
          <>We’ll tailor the opportunities section once we have your ZIP (programs, meetups, internships).</>
        )}
      </div>
    </section>
  );
}
