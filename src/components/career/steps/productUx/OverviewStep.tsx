"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { StepperStep, StepperPersistedState } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
  state?: unknown; // passed from StepperShell via lanes.tsx (used for step navigation)
};

type Pulse = "yes" | "maybe" | "no";

function copyForPulse(p: Pulse | null) {
  if (p === "yes") {
    return {
      title: "Okay… I see you 😄",
      body: "That little “I want to fix it” feeling? That’s the signal. Next we’ll pick a specialty so this gets personal fast.",
    };
  }
  if (p === "maybe") {
    return {
      title: "Honestly? “Maybe” is perfect.",
      body: "We’ll keep it low stakes. No committing. Just explore one layer deeper and see if it clicks.",
    };
  }
  if (p === "no") {
    return {
      title: "That’s still a win.",
      body: "If it’s not your thing, cool — you just saved yourself time. You can bounce anytime and try a different lane.",
    };
  }
  return null;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-100">
      {children}
    </span>
  );
}

function getGoToStep(state: unknown): ((id: string) => void) | null {
  const obj = (state ?? {}) as Record<string, unknown>;
  const fn = obj.goToStep;
  return typeof fn === "function" ? (fn as (id: string) => void) : null;
}

function MiniCard({
  title,
  body,
  chips,
}: {
  title: string;
  body: string;
  chips: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-14 -right-12 h-52 w-52 rounded-full bg-fuchsia-500/8 blur-3xl" />
      </div>

      <div className="relative">
        <div className="text-sm font-semibold text-slate-50">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-slate-200/85">{body}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OverviewStep({ step, state }: Props) {
  const [pulse, setPulse] = React.useState<Pulse | null>(null);
  const pulseCopy = copyForPulse(pulse);

  const goToStep = React.useMemo(() => getGoToStep(state), [state]);

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      {/* Step label */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
        Dive deeper · {step.title}
      </div>

      {/* Hero (stronger “pop”) */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-sky-400/22 via-fuchsia-400/12 to-amber-300/14 p-[1px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-fuchsia-500/16 blur-3xl opacity-60" />
        </div>

        <div className="relative rounded-[27px] bg-slate-950/55 p-5 backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Product / UX</h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-200/90">
            You know that moment when an app makes you go{" "}
            <span className="text-slate-50 font-semibold">“bruh… why is this so hard?”</span>{" "}
            That’s the whole job.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-slate-200/85">
            Product/UX is taking confusing screens and making them feel obvious — then checking if real people actually get it.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>make it clearer</Chip>
            <Chip>test it fast</Chip>
            <Chip>fix what’s weird</Chip>
            <Chip>small wins</Chip>
          </div>
        </div>
      </div>

      {/* Gut-check */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-50">Quick gut-check</div>
            <div className="mt-1 text-sm text-slate-200/85">
              When you picture doing this… does it feel{" "}
              <span className="text-slate-50 font-semibold">kinda exciting</span>?
            </div>
            <div className="mt-2 text-xs text-slate-300/60">No pressure. You’re just collecting signal.</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPulse((p) => (p === "yes" ? null : "yes"))}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                pulse === "yes"
                  ? "border-sky-200/25 bg-sky-300/20 text-sky-50"
                  : "border-white/10 bg-slate-950/30 text-slate-100 hover:bg-white/10"
              }`}
            >
              ✅ Yep
            </button>

            <button
              type="button"
              onClick={() => setPulse((p) => (p === "maybe" ? null : "maybe"))}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                pulse === "maybe"
                  ? "border-amber-200/25 bg-amber-300/18 text-amber-50"
                  : "border-white/10 bg-slate-950/30 text-slate-100 hover:bg-white/10"
              }`}
            >
              🙂 Maybe
            </button>

            <button
              type="button"
              onClick={() => setPulse((p) => (p === "no" ? null : "no"))}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition active:scale-95 ${
                pulse === "no"
                  ? "border-rose-200/25 bg-rose-300/18 text-rose-50"
                  : "border-white/10 bg-slate-950/30 text-slate-100 hover:bg-white/10"
              }`}
            >
              👎 Nope
            </button>
          </div>
        </div>

        {pulseCopy ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
            <div className="text-sm font-semibold text-slate-50">{pulseCopy.title}</div>
            <div className="mt-1 text-sm text-slate-200/85">{pulseCopy.body}</div>
          </div>
        ) : null}
      </div>

      {/* Conversational cards */}
      <div className="grid gap-3">
        <MiniCard
          title="What this feels like"
          body="You spot something confusing, you tweak it, and suddenly people don’t struggle anymore. It’s weirdly satisfying."
          chips={["clarity", "tiny experiments", "real reactions"]}
        />

        <MiniCard
          title="What you’d actually do"
          body="You redesign flows like onboarding, checkout, and settings. Then you test it with humans and fix whatever still feels off."
          chips={["prototype", "test", "iterate"]}
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="text-sm font-semibold text-slate-50">Tiny 3-day experiment</div>
            <div className="mt-2 text-sm text-slate-200/85">
              Not “pick a career.” Just try a mini version and see if your brain likes it.
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                  1
                </span>
                <div className="text-sm text-slate-100">Pick one screen that annoys you (any app).</div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                  2
                </span>
                <div className="text-sm text-slate-100">Redesign it fast. Paper is fine. Make it clearer.</div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-slate-950">
                  3
                </span>
                <div className="text-sm text-slate-100">Show 2 people. Ask: “Better… or still confusing?”</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-xs text-slate-200/80">
              <span className="font-semibold text-slate-50">Real secret:</span> It doesn’t need to look pretty — it needs to feel obvious.
            </div>
          </div>
        </div>
      </div>

      {/* Next step (stronger CTA card) */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-400/18 via-cyan-400/10 to-indigo-400/12 p-[1px]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-14 -left-10 h-56 w-56 rounded-full bg-sky-500/14 blur-3xl" />
          <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-indigo-500/14 blur-3xl" />
        </div>

        <div className="relative rounded-[23px] bg-slate-950/55 p-5 backdrop-blur-2xl">
          <div className="text-sm font-semibold text-slate-50">Okay — now pick your “version” of Product/UX</div>
          <div className="mt-2 text-sm leading-relaxed text-slate-200/85">
            Different worlds feel totally different: consumer apps, healthcare, games, AI…
            Next screen: choose the ones that feel most like you.
          </div>

          <button
            type="button"
            onClick={() => goToStep?.("specialties")}
            disabled={!goToStep}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-95 ${
              goToStep
                ? "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-sky-300/30"
                : "cursor-not-allowed bg-white/10 text-slate-200/60"
            }`}
          >
            Dive into specialties <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
