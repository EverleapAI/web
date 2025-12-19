"use client";

import * as React from "react";
import type { StepperStep, StepperPersistedState } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
};

type Specialty = {
  id: string;
  title: string;
  blurb: string;
  examples: string[];
  bestFor: string;
};

const SPECIALTIES: Specialty[] = [
  {
    id: "consumerApps",
    title: "Consumer apps",
    blurb: "High-velocity products where clarity + delight matter. Strong taste + fast iteration.",
    examples: ["Social", "Music", "Photo/video", "Fitness", "Shopping"],
    bestFor: "If you love making things feel effortless.",
  },
  {
    id: "healthcare",
    title: "Healthcare / medical UX",
    blurb: "Complex systems with real consequences. Safety, trust, and accessibility are everything.",
    examples: ["Patient portals", "Telehealth", "Clinician tools", "Wearables"],
    bestFor: "If meaning + impact is non-negotiable.",
  },
  {
    id: "education",
    title: "Education products",
    blurb: "Learning design + motivation design. You build for attention, confidence, and progress.",
    examples: ["Study tools", "Tutoring platforms", "School systems", "Language learning"],
    bestFor: "If you like coaching people through change.",
  },
  {
    id: "games",
    title: "Games / interactive experiences",
    blurb: "Flow state, feedback loops, and emotional design. UX is the product.",
    examples: ["Mobile games", "Game UX/UI", "Live ops", "Player journeys"],
    bestFor: "If you’re obsessed with engagement and feeling.",
  },
  {
    id: "fintech",
    title: "Fintech",
    blurb: "Money is emotional. You design for trust, risk, and clean decision-making.",
    examples: ["Banking", "Investing", "Payments", "Budgeting"],
    bestFor: "If you like clarity under pressure.",
  },
  {
    id: "enterprise",
    title: "Enterprise / B2B tools",
    blurb: "Power-user workflows. Less flashy, more “make hard jobs easier.”",
    examples: ["Dashboards", "Admin tools", "Workflow systems", "Analytics"],
    bestFor: "If you like systems thinking and reducing chaos.",
  },
  {
    id: "aiProducts",
    title: "AI product UX",
    blurb: "Explainability + trust + good defaults. You design human + model collaboration.",
    examples: ["Copilots", "Chat UX", "AI editors", "Safety UX"],
    bestFor: "If you like building the future (and making it understandable).",
  },
  {
    id: "accessibility",
    title: "Accessibility & inclusive design",
    blurb: "Designing so more humans can succeed. This multiplies impact across every product.",
    examples: ["WCAG", "Neurodiversity", "Assistive tech", "Plain language"],
    bestFor: "If you want your work to help the widest set of people.",
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100">
      {children}
    </span>
  );
}

export function SpecialtiesStep({ step, progress }: Props) {
  const [picked, setPicked] = React.useState<string[]>([]);

  function toggle(id: string) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)));
  }

  const pickedSet = new Set(picked);

  // Small “coach” logic: show 2–3 suggestions based on picks (simple heuristics)
  const coachLine = React.useMemo(() => {
    if (!picked.length) return "Pick up to 3 — just the ones that spark curiosity. This isn’t a commitment.";
    if (picked.length === 1) return "Nice. Add one more so we can triangulate your vibe.";
    if (picked.length === 2) return "Good signal. If you add a third, we can get even sharper.";
    return "Great. These three are enough to guide the next steps.";
  }, [picked.length]);

  const zip = (progress.zipCode ?? "").trim();

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Pick a specialty vibe</h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          Product/UX is a huge umbrella. Your “lane” gets clearer when you choose what kind of problems and people you
          want to design for.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-50">Coach note</div>
          <div className="text-xs text-slate-300/60">{picked.length}/3 picked</div>
        </div>
        <p className="mt-2 text-sm text-slate-200/85">{coachLine}</p>

        {picked.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {picked.map((id) => {
              const s = SPECIALTIES.find((x) => x.id === id);
              if (!s) return null;
              return <Chip key={id}>{s.title}</Chip>;
            })}
          </div>
        ) : null}
      </div>

      {/* Mobile-friendly list of cards */}
      <div className="space-y-3">
        {SPECIALTIES.map((s) => {
          const on = pickedSet.has(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              className={`
                w-full text-left transition active:scale-[0.99]
                rounded-[28px] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl
                ${on ? "border-sky-300/60 bg-slate-950/55" : "border-white/10 bg-slate-950/40 hover:bg-slate-950/50"}
              `}
              aria-pressed={on}
              aria-label={`Toggle ${s.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-50">{s.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-200/85">{s.blurb}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.examples.slice(0, 4).map((e) => (
                      <Chip key={e}>{e}</Chip>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-slate-300/70">
                    <span className="font-semibold text-slate-100">Best for:</span> {s.bestFor}
                  </div>
                </div>

                <div
                  className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    on ? "border-sky-300/60 bg-sky-300/15 text-sky-100" : "border-white/10 bg-white/5 text-white/70"
                  }`}
                  aria-hidden
                >
                  {on ? "✓" : "+"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-xs text-slate-300/60">
        {zip ? (
          <>
            Later, we’ll use <span className="text-slate-100">{zip}</span> to surface local programs for the specialties
            you pick.
          </>
        ) : (
          <>Later we’ll ask for your ZIP so we can show local options for your specialty picks.</>
        )}
      </div>
    </section>
  );
}
