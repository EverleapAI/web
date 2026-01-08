"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import type {
  StepperStep,
  StepperShellState,
  StepperShellCta,
  StepperPersistedState,
  StepperLaneId,
} from "@/components/career/stepperTypes";

type RenderStepArgs = {
  step: StepperStep;
  state: StepperShellState;
  progress: StepperPersistedState;
  setProgress: React.Dispatch<React.SetStateAction<StepperPersistedState>>;
};

type Props = {
  laneId: StepperLaneId;
  steps: StepperStep[];

  /** Render-prop: the actual step UI */
  renderStep: (args: RenderStepArgs) => React.ReactNode;

  /** Optional: override CTAs per step */
  getCtas?: (args: {
    step: StepperStep;
    state: StepperShellState;
    progress: StepperPersistedState;
  }) => StepperShellCta[];

  /** Where to go when user exits */
  onExit?: () => void;
};

const STORAGE_PREFIX = "everleap.career.stepper.v1:";

function storageKey(laneId: StepperLaneId) {
  return `${STORAGE_PREFIX}${laneId}`;
}

function safeReadPersisted(laneId: StepperLaneId): StepperPersistedState {
  const base: StepperPersistedState = {
    laneId,
    updatedAt: new Date().toISOString(),
    progress: {},
  };

  if (typeof window === "undefined") return base;

  try {
    const raw = window.localStorage.getItem(storageKey(laneId));
    if (!raw) return base;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return base;

    const obj = parsed as Record<string, unknown>;

    const updatedAt = typeof obj.updatedAt === "string" ? obj.updatedAt : base.updatedAt;

    const progress =
      typeof obj.progress === "object" && obj.progress !== null
        ? (obj.progress as Record<string, unknown>)
        : {};

    // zipCode is optional and may not exist in older saves
    const zipCode = typeof obj.zipCode === "string" ? obj.zipCode : undefined;

    return { laneId, updatedAt, progress, ...(zipCode ? { zipCode } : {}) };
  } catch {
    return base;
  }
}

function safeWritePersisted(laneId: StepperLaneId, state: StepperPersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(laneId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function StepperShell({ laneId, steps, renderStep, getCtas, onExit }: Props) {
  const router = useRouter();

  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [progress, setProgress] = React.useState<StepperPersistedState>(() => safeReadPersisted(laneId));

  // Persist progress whenever it changes
  React.useEffect(() => {
    safeWritePersisted(laneId, progress);
  }, [laneId, progress]);

  // If lane changes, reset and load correct persisted progress
  React.useEffect(() => {
    setStepIndex(0);
    setProgress(safeReadPersisted(laneId));
  }, [laneId]);

  const step = steps[stepIndex] ?? steps[0];
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= steps.length - 1;

  // IMPORTANT:
  // We intentionally keep the state minimal to prevent “type drift”.
  // If StepperShellState adds fields later, this won’t break the build.
  const state = React.useMemo(() => {
    return ({ stepIndex } as unknown) as StepperShellState;
  }, [stepIndex]);

  const goBack = React.useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = React.useCallback(() => {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }, [steps.length]);

  const doExit = React.useCallback(() => {
    if (onExit) onExit();
    else router.push("/main/insights");
  }, [onExit, router]);

  // Default CTAs: keep type-safe with only known StepperShellCta fields.
  // Behavior is derived from id + isLast in onCta().
  const defaultCtas: StepperShellCta[] = [
    ...(isFirst ? [] : [{ id: "back", label: "Back" }]),
    { id: "primary", label: isLast ? "Finish" : "Next" },
  ];

  const ctas = getCtas ? getCtas({ step, state, progress }) : defaultCtas;

  function onCta(cta: StepperShellCta) {
    // Convention:
    // - id === "back"   => goBack
    // - id === "exit"   => doExit
    // - id === "primary" => goNext, or doExit when last step
    // - any other id => treat as primary-ish: next / done based on isLast
    if (cta.id === "back") return goBack();
    if (cta.id === "exit") return doExit();

    const isPrimaryLike = cta.id === "primary" || cta.id === "next" || cta.id === "done";
    if (isPrimaryLike) return isLast ? doExit() : goNext();

    // Fallback: if you add custom CTAs later, default to next/done flow.
    return isLast ? doExit() : goNext();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 md:px-8 md:pt-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={doExit}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
        >
          <X className="h-4 w-4" />
          Exit
        </button>

        <div className="text-xs text-slate-300/70">
          Step {Math.min(stepIndex + 1, steps.length)} / {steps.length}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[40vh]">
        {step ? (
          renderStep({ step, state, progress, setProgress })
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-200/85">
            Missing step definition.
          </div>
        )}
      </div>

      {/* Bottom CTAs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isFirst ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {ctas
            .filter((c) => c.id !== "back")
            .map((cta) => {
              // Primary styling heuristic:
              // - primary button if it's the conventional primary CTA id
              const primary = cta.id === "primary" || cta.id === "next" || cta.id === "done";

              return (
                <button
                  key={cta.id}
                  type="button"
                  onClick={() => onCta(cta)}
                  className={
                    primary
                      ? "inline-flex items-center gap-2 rounded-full bg-sky-300 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-300/30 hover:bg-sky-200 active:scale-95"
                      : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
                  }
                >
                  {cta.label}
                  <ArrowRight className="h-4 w-4 opacity-80" />
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
