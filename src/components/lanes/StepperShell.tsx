// src/components/lanes/StepperShell.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, ChevronRight } from "lucide-react";

import type {
  StepperLaneId,
  StepperPersistedState,
  StepperShellCta,
  StepperShellState,
  StepperStep,
} from "@/components/career/stepperTypes";

/* =========================
   Types
========================= */

/**
 * Common props used by legacy lane step components under:
 *  - src/components/lanes/productUx/*
 *
 * These files currently expect:
 *   dark, accentClass, laneId, progress, setProgress, openGuide
 */
export type StepCommonProps<TProgress extends Record<string, unknown> = Record<string, unknown>> = {
  dark: boolean;
  accentClass: string;
  laneId: StepperLaneId;
  progress: TProgress;
  setProgress: React.Dispatch<React.SetStateAction<TProgress>>;
  openGuide?: (detail?: Record<string, unknown>) => void;
};

type RenderCtx<TProgress extends Record<string, unknown>> = {
  laneId: StepperLaneId;
  step: StepperStep;
  state: StepperShellState;
  progress: TProgress;
  setProgress: React.Dispatch<React.SetStateAction<TProgress>>;
  ctas: StepperShellCta[];
  onNext: () => void;
  onBack: () => void;
  goToStepId: (id: StepperStep["id"]) => void;

  // optional visuals/hooks for legacy steps
  dark?: boolean;
  accentClass?: string;
  openGuide?: (detail?: Record<string, unknown>) => void;
};

type StepperShellProps<TProgress extends Record<string, unknown>> = {
  laneId: StepperLaneId;
  title: string;
  subtitle?: string;

  /** ordered list of steps for this lane */
  steps: StepperStep[];

  /** localStorage key to persist step + progress */
  storageKey?: string;

  /** initial progress shape */
  initialProgress: TProgress;

  /** where to go when user exits */
  exitHref?: string;

  /** where to go when user finishes */
  doneHref?: string;

  /**
   * render the current step
   * (legacy lane components can be rendered inside here)
   */
  renderStep: (ctx: RenderCtx<TProgress>) => React.ReactNode;

  /** optional styling/context helpers */
  dark?: boolean;
  accentClass?: string;
  openGuide?: (detail?: Record<string, unknown>) => void;
};

const DEFAULT_STORAGE_KEY = "everleap.career.stepper.v1";

/* =========================
   Helpers
========================= */

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * CTA rules:
 * - Keep mobile simple: 1 primary button always.
 * - Optional "Back" (if not first step).
 */
function buildCtas(step: StepperStep, isFirst: boolean, isLast: boolean): StepperShellCta[] {
  const primaryLabel =
    step.id === "finish" || isLast ? "Back to Insights" : step.id === "dayInLife" ? "Continue" : "Next";

  const ctas: StepperShellCta[] = [
    {
      id: "primary",
      kind: "primary",
      label: primaryLabel,
      intent: isLast ? "done" : "next",
    },
  ];

  if (!isFirst) {
    ctas.unshift({
      id: "back",
      kind: "secondary",
      label: "Back",
      intent: "back",
    });
  }

  return ctas;
}

/* =========================
   Component
========================= */

export function StepperShell<TProgress extends Record<string, unknown>>({
  laneId,
  title,
  subtitle,
  steps,
  storageKey = DEFAULT_STORAGE_KEY,
  initialProgress,
  exitHref = "/main/carousel",
  doneHref = "/main/carousel",
  renderStep,
  dark,
  accentClass,
  openGuide,
}: StepperShellProps<TProgress>) {
  const router = useRouter();

  const [mounted, setMounted] = React.useState<boolean>(false);

  // ✅ Explicit generic ensures updater param is typed (no "s is any" squiggles)
  const [state, setState] = React.useState<StepperShellState>({
    laneId,
    activeStepIndex: 0,
  });

  const [progress, setProgress] = React.useState<TProgress>(initialProgress);

  /* keep laneId aligned if prop changes */
  React.useEffect(() => {
    setState((s: StepperShellState) => (s.laneId === laneId ? s : { ...s, laneId }));
  }, [laneId]);

  /* mount (avoid hydration mismatch) */
  React.useEffect(() => {
    setMounted(true);
  }, []);

  /* load persisted */
  React.useEffect(() => {
    if (!mounted) return;

    const raw = window.localStorage.getItem(storageKey);
    const parsed = safeParse<StepperPersistedState>(raw);

    if (!parsed || parsed.laneId !== laneId) return;

    const nextIdx = clamp(parsed.activeStepIndex ?? 0, 0, Math.max(steps.length - 1, 0));
    setState({ laneId, activeStepIndex: nextIdx });

    if (parsed.progress && typeof parsed.progress === "object") {
      setProgress((p: TProgress) => ({ ...p, ...(parsed.progress as Partial<TProgress>) }));
    }
  }, [mounted, laneId, storageKey, steps.length]);

  /* persist whenever step/progress changes */
  React.useEffect(() => {
    if (!mounted) return;

    const payload: StepperPersistedState = {
      laneId,
      activeStepIndex: state.activeStepIndex,
      progress,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [mounted, laneId, progress, state.activeStepIndex, storageKey]);

  const activeStep = steps[state.activeStepIndex] ?? steps[0];
  const isFirst = state.activeStepIndex <= 0;
  const isLast = state.activeStepIndex >= steps.length - 1;

  const ctas = React.useMemo(() => buildCtas(activeStep, isFirst, isLast), [activeStep, isFirst, isLast]);

  function goToIndex(idx: number) {
    setState((s: StepperShellState) => ({ ...s, activeStepIndex: clamp(idx, 0, steps.length - 1) }));
  }

  function goToStepId(id: StepperStep["id"]) {
    const idx = steps.findIndex((s) => s.id === id);
    if (idx >= 0) goToIndex(idx);
  }

  function onBack() {
    if (isFirst) return;
    goToIndex(state.activeStepIndex - 1);
  }

  function onNext() {
    if (activeStep?.id === "finish" || isLast) {
      router.push(doneHref);
      return;
    }
    goToIndex(state.activeStepIndex + 1);
  }

  function onExit() {
    router.push(exitHref);
  }

  // Top dots (mobile-friendly: capped)
  const dotCount = Math.min(steps.length, 7);
  const dotWindowStart = clamp(state.activeStepIndex - 3, 0, Math.max(steps.length - dotCount, 0));
  const dotIndices = Array.from({ length: dotCount }).map((_, i) => dotWindowStart + i);

  return (
    <div className="relative min-h-[100svh]">
      <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-[0.98]"
            aria-label="Exit"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Insights</span>
            <span className="sm:hidden">Back</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
            aria-label="Close"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Hero */}
        <div className="mb-5 rounded-[32px] border border-white/10 bg-slate-950/35 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/60">{title}</div>
          {subtitle ? <div className="mt-2 text-sm text-slate-200/85">{subtitle}</div> : null}

          {/* Step dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {dotIndices.map((idx) => {
              const on = idx <= state.activeStepIndex;
              const current = idx === state.activeStepIndex;
              return (
                <span
                  key={idx}
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    on ? "bg-sky-300" : "bg-white/10",
                    current ? "ring-2 ring-sky-300/30" : "",
                  ].join(" ")}
                />
              );
            })}
            <span className="ml-2 text-xs text-slate-300/60">
              Step {state.activeStepIndex + 1} / {steps.length}
            </span>
          </div>
        </div>

        {/* Body */}
        <main className="flex-1">
          {renderStep({
            laneId,
            step: activeStep,
            state,
            progress,
            setProgress,
            ctas,
            onNext,
            onBack,
            goToStepId,
            dark,
            accentClass,
            openGuide,
          })}
        </main>

        {/* Bottom CTA Bar (sticky) */}
        <div className="fixed inset-x-0 bottom-0 z-30">
          <div className="mx-auto w-full max-w-5xl px-4 pb-5 md:px-8">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-3 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
              <div className="flex items-center gap-2">
                {!isFirst ? (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-[0.99]"
                  >
                    Back
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex flex-[2] items-center justify-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.3)] transition hover:bg-sky-200 active:scale-[0.99]"
                >
                  {isLast || activeStep?.id === "finish" ? "Back to Insights" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 text-center text-[0.72rem] text-slate-300/50">Progress saves automatically.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
