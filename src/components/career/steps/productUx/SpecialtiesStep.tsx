"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import type {
  StepperStep,
  StepperPersistedState,
} from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
  setProgress: React.Dispatch<React.SetStateAction<StepperPersistedState>>;
  state?: unknown; // StepperShell passes nav API here
};

type Specialty = {
  id: string;
  title: string;
  narrative: string[];
  examples: string[];
  bestFor: string;
};

const SPECIALTIES: Specialty[] = [
  {
    id: "consumerApps",
    title: "Consumer apps",
    narrative: [
      "This is the world of speed + taste. You ship fast, learn fast, and you obsess over the *feel*.",
      "A great day here is turning messy human behavior into something that feels effortless.",
      "If you love tiny moments of delight and clean interaction patterns, this is your lane.",
    ],
    examples: ["Social", "Music", "Photo/video", "Fitness", "Shopping"],
    bestFor: "You want to build things people choose to use every day.",
  },
  {
    id: "healthcare",
    title: "Healthcare / medical UX",
    narrative: [
      "Here, UX isn’t decoration — it’s safety, trust, and reducing real-world harm.",
      "You design for anxious moments, busy clinicians, and decisions that carry weight.",
      "If you like meaningful constraints and high integrity work, this one hits different.",
    ],
    examples: ["Patient portals", "Telehealth", "Clinician tools", "Wearables"],
    bestFor: "Impact matters more than hype — and you want your work to count.",
  },
  {
    id: "education",
    title: "Education products",
    narrative: [
      "This is motivation design. You’re helping someone move from ‘I can’t’ to ‘I’ve got this.’",
      "You’ll think about attention, confidence, pacing, and the little wins that keep people going.",
      "If you like coaching through design, you’ll love this space.",
    ],
    examples: [
      "Study tools",
      "Tutoring platforms",
      "School systems",
      "Language learning",
    ],
    bestFor: "You like turning confusion into progress people can feel.",
  },
  {
    id: "games",
    title: "Games / interactive experiences",
    narrative: [
      "Here, UX *is* the product. You’re shaping flow state, feedback loops, and emotion.",
      "You’ll care about pacing, reward timing, friction (the good kind), and retention without being gross.",
      "If you’re obsessed with engagement and feeling, this is your playground.",
    ],
    examples: ["Mobile games", "Game UX/UI", "Live ops", "Player journeys"],
    bestFor: "You want to design moments people remember.",
  },
  {
    id: "fintech",
    title: "Fintech",
    narrative: [
      "Money is emotional. Your job is to bring calm, clarity, and trust to high-stakes decisions.",
      "You design for risk, error prevention, and ‘I understand exactly what happens next.’",
      "If you like clean decision-making under pressure, you’ll thrive here.",
    ],
    examples: ["Banking", "Investing", "Payments", "Budgeting"],
    bestFor: "You want to help people feel confident (not confused) about money.",
  },
  {
    id: "enterprise",
    title: "Enterprise / B2B tools",
    narrative: [
      "This is ‘make hard jobs easier.’ Power-user workflows, real constraints, big systems.",
      "You’ll spend time untangling complexity, reducing chaos, and designing for speed at scale.",
      "If you like systems thinking and craftsmanship, this lane is quietly elite.",
    ],
    examples: ["Dashboards", "Admin tools", "Workflow systems", "Analytics"],
    bestFor: "You want to build tools that professionals rely on all day.",
  },
  {
    id: "aiProducts",
    title: "AI product UX",
    narrative: [
      "You’re designing human + model collaboration — good defaults, good boundaries, good outcomes.",
      "You’ll care about explainability, trust, calibration, and how people recover when the model is wrong.",
      "If you like building the future *and* making it understandable, this is for you.",
    ],
    examples: ["Copilots", "Chat UX", "AI editors", "Safety UX"],
    bestFor: "You want to shape how humans work with intelligence.",
  },
  {
    id: "accessibility",
    title: "Accessibility & inclusive design",
    narrative: [
      "This is impact-multiplying design. You’re making sure more humans can succeed.",
      "You’ll think about clarity, affordances, motion, contrast, neurodiversity, and real-world constraints.",
      "If you want your work to help the widest set of people, this is the path.",
    ],
    examples: ["WCAG", "Neurodiversity", "Assistive tech", "Plain language"],
    bestFor: "You want ‘good design’ to include more people by default.",
  },
];

const PICK_KEY = "productUx_specialties";

/** Read-only helpers (no `any`) */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  if (!v.every((x) => typeof x === "string")) return [];
  return v;
}

/**
 * PersistedState doesn’t guarantee a “bag” key.
 * We support common keys: data | progress | meta.
 * If none exist, we create/use `data`.
 */
function getBag(
  p: StepperPersistedState
): { key: "data" | "progress" | "meta"; bag: Record<string, unknown> } {
  const root = p as unknown as Record<string, unknown>;

  const d = root["data"];
  if (isRecord(d)) return { key: "data", bag: d };

  const pr = root["progress"];
  if (isRecord(pr)) return { key: "progress", bag: pr };

  const m = root["meta"];
  if (isRecord(m)) return { key: "meta", bag: m };

  return { key: "data", bag: {} };
}

function setBag(
  p: StepperPersistedState,
  key: "data" | "progress" | "meta",
  bag: Record<string, unknown>
) {
  return {
    ...(p as unknown as Record<string, unknown>),
    [key]: bag,
    updatedAt: new Date().toISOString(),
  } as StepperPersistedState;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100">
      {children}
    </span>
  );
}

function accentFor(id: string) {
  if (id === "consumerApps")
    return "from-sky-300/25 via-cyan-300/12 to-indigo-300/12";
  if (id === "healthcare")
    return "from-emerald-300/22 via-teal-300/12 to-sky-300/10";
  if (id === "education")
    return "from-amber-300/22 via-orange-300/12 to-rose-300/10";
  if (id === "games")
    return "from-violet-300/22 via-fuchsia-300/12 to-sky-300/10";
  if (id === "fintech")
    return "from-lime-300/18 via-emerald-300/10 to-teal-300/10";
  if (id === "enterprise")
    return "from-slate-300/16 via-slate-200/8 to-sky-300/10";
  if (id === "aiProducts")
    return "from-fuchsia-300/20 via-violet-300/12 to-sky-300/10";
  if (id === "accessibility")
    return "from-rose-300/18 via-amber-300/10 to-lime-300/10";
  return "from-sky-300/20 via-cyan-300/10 to-indigo-300/10";
}

function railFor(id: string) {
  if (id === "consumerApps") return "from-sky-300 via-cyan-300 to-indigo-300";
  if (id === "healthcare") return "from-emerald-300 via-teal-300 to-sky-300";
  if (id === "education") return "from-amber-300 via-orange-300 to-rose-300";
  if (id === "games") return "from-violet-300 via-fuchsia-300 to-sky-300";
  if (id === "fintech") return "from-lime-300 via-emerald-300 to-teal-300";
  if (id === "enterprise") return "from-slate-300 via-slate-200 to-sky-300";
  if (id === "aiProducts") return "from-fuchsia-300 via-violet-300 to-sky-300";
  if (id === "accessibility") return "from-rose-300 via-amber-300 to-lime-300";
  return "from-sky-300 via-cyan-300 to-indigo-300";
}

/**
 * ✅ Suggestion A nav API from StepperShell
 * We avoid relying on goToStep("forecast") for the pill.
 * The pill should behave like the old sticky primary CTA: advance one step.
 */
function getGoNext(state: unknown): (() => void) | null {
  const obj = (state ?? {}) as Record<string, unknown>;
  const fn = obj.goNext;
  return typeof fn === "function" ? (fn as () => void) : null;
}

function pillTextFor(title: string) {
  return `Future outlook: ${title}`;
}

export function SpecialtiesStep({ step, progress, setProgress, state }: Props) {
  const { bag } = getBag(progress);

  const picked = readStringArray(bag[PICK_KEY]);
  const pickedSet = React.useMemo(() => new Set(picked), [picked]);

  const goNext = React.useMemo(() => getGoNext(state), [state]);

  function setPicked(next: string[]) {
    setProgress((prev) => {
      const { key, bag: prevBag } = getBag(prev);
      const nextBag: Record<string, unknown> = { ...prevBag, [PICK_KEY]: next };
      return setBag(prev, key, nextBag);
    });
  }

  function toggle(id: string) {
    const next = pickedSet.has(id)
      ? picked.filter((x) => x !== id)
      : [...picked, id].slice(-3);
    setPicked(next);
  }

  function ensurePicked(id: string) {
    if (pickedSet.has(id)) return;
    setPicked([...picked, id].slice(-3));
  }

  function diveFrom(id: string) {
    ensurePicked(id);
    goNext?.();
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-white/70">
        Dive deeper · {step.title}
      </div>

      {/* Slim header: only ONE line after header; no picked pills */}
      <div className="relative overflow-hidden rounded-card border border-white/10 bg-slate-950/35 p-5 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/18 via-cyan-400/10 to-indigo-500/10 blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/16 via-fuchsia-400/9 to-sky-500/10 blur-3xl opacity-55" />
        </div>

        <div className="relative space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
            Pick a specialty vibe
          </h1>

          <p className="text-sm leading-relaxed text-slate-200/85">
            Product/UX has lots of specialties. Choose a few that match your kind of
            people + problems — then tap a Future outlook pill to go deeper.
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {SPECIALTIES.map((s) => {
          const on = pickedSet.has(s.id);
          const accent = accentFor(s.id);
          const rail = railFor(s.id);

          return (
            <div
              key={s.id}
              className={`
                relative overflow-hidden rounded-card border p-[1px] backdrop-blur-xl
                ${on ? "border-sky-300/55" : "border-white/10"}
              `}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}
              />
              <div
                className={`
                  relative rounded-card p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)]
                  ${on ? "bg-slate-950/62" : "bg-slate-950/42"}
                `}
              >
                {/* Accent rail */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-6 h-[70%] w-[3px] rounded-full bg-gradient-to-b ${rail} opacity-90`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-base font-semibold text-slate-50">
                          {s.title}
                        </div>

                        {on ? (
                          <span className="inline-flex items-center rounded-full border border-sky-200/25 bg-sky-300/15 px-2 py-0.5 text-[0.7rem] font-semibold text-sky-100">
                            Selected
                          </span>
                        ) : null}
                      </div>

                      {/* Conversational narrative */}
                      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-200/85">
                        {s.narrative.map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.examples.slice(0, 4).map((e) => (
                          <Chip key={e}>{e}</Chip>
                        ))}
                      </div>

                      <div className="mt-3 text-xs text-slate-300/70">
                        <span className="font-semibold text-slate-100">
                          Best for:
                        </span>{" "}
                        {s.bestFor}
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => toggle(s.id)}
                      className={`mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition active:scale-95 ${
                        on
                          ? "border-sky-300/60 bg-sky-300/18 text-sky-100 hover:bg-sky-300/22"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Pick"} ${s.title}`}
                      title={on ? "Selected" : "Pick this"}
                    >
                      {on ? "✓" : "+"}
                    </button>
                  </div>

                  {/* Per-specialty CTA as a small pill (not a big block) */}
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => diveFrom(s.id)}
                      disabled={!goNext}
                      className={`
                        group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-95
                        ${
                          goNext
                            ? "border-white/10 bg-white/5 text-slate-50 hover:bg-white/10"
                            : "cursor-not-allowed border-white/10 bg-white/5 text-slate-200/50"
                        }
                      `}
                      aria-label={`Open future outlook for ${s.title}`}
                      title={goNext ? "Future outlook" : "Navigation not wired yet"}
                    >
                      <span
                        className={`
                          inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br ${accent}
                          opacity-90 shadow-[0_0_0_3px_rgba(255,255,255,0.04)]
                        `}
                        aria-hidden
                      />
                      <span className="max-w-[16rem] truncate">
                        {pillTextFor(s.title)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
