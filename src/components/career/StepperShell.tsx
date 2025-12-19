"use client";

import * as React from "react";

import type {
  StepperStep,
  StepperShellState,
  StepperShellCta,
  StepperPersistedState,
  StepperLaneId,
} from "./stepperTypes";

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

const STORAGE_PREFIX = "everleap.career.stepper";

function storageKey(laneId: StepperLaneId) {
  return `${STORAGE_PREFIX}.${laneId}`;
}

function loadPersisted(laneId: StepperLaneId): StepperPersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(laneId));
    if (!raw) return null;
    return JSON.parse(raw) as StepperPersistedState;
  } catch {
    return null;
  }
}

function persist(state: StepperPersistedState) {
  try {
    window.localStorage.setItem(
      storageKey(state.laneId),
      JSON.stringify(state)
    );
  } catch {
    // ignore storage errors
  }
}

export function StepperShell({
  laneId,
  steps,
  renderStep,
  getCtas,
  onExit,
}: Props) {
  const [progress, setProgress] = React.useState<StepperPersistedState>(() => {
    return (
      loadPersisted(laneId) ?? {
        laneId,
        activeStepIndex: 0,
        progress: {},
        zipCode: undefined,
        updatedAt: new Date().toISOString(),
      }
    );
  });

  const state: StepperShellState = {
    laneId,
    activeStepIndex: progress.activeStepIndex,
  };

  const step = steps[state.activeStepIndex];

  // Persist on every meaningful change
  React.useEffect(() => {
    persist({
      ...progress,
      updatedAt: new Date().toISOString(),
    });
  }, [progress]);

  function goNext() {
    setProgress((p) => ({
      ...p,
      activeStepIndex: Math.min(
        p.activeStepIndex + 1,
        steps.length - 1
      ),
    }));
  }

  function goBack() {
    setProgress((p) => ({
      ...p,
      activeStepIndex: Math.max(p.activeStepIndex - 1, 0),
    }));
  }

  function exit() {
    onExit?.();
  }

  const defaultCtas: StepperShellCta[] = [
    {
      id: "back",
      kind: "ghost",
      label: "Back",
      intent: "back",
      disabled: state.activeStepIndex === 0,
    },
    {
      id: "primary",
      kind: "primary",
      label:
        state.activeStepIndex === steps.length - 1
          ? "Finish"
          : "Next",
      intent:
        state.activeStepIndex === steps.length - 1
          ? "done"
          : "next",
    },
  ];

  const ctas =
    getCtas?.({
      step,
      state,
      progress,
    }) ?? defaultCtas;

  function handleCta(cta: StepperShellCta) {
    if (cta.disabled) return;

    switch (cta.intent) {
      case "back":
        goBack();
        break;
      case "next":
        goNext();
        break;
      case "done":
      case "exit":
        exit();
        break;
      case "custom":
      default:
        break;
    }
  }

  return (
    <div className="flex min-h-[100svh] flex-col">
      {/* Step content */}
      <main className="flex-1 px-4 pb-28 pt-6">
        {renderStep({
          step,
          state,
          progress,
          setProgress,
        })}
      </main>

      {/* Sticky CTA bar (mobile-first) */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          {ctas.map((cta) => (
            <button
              key={cta.id}
              type="button"
              disabled={cta.disabled}
              onClick={() => handleCta(cta)}
              className={`
                inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold
                transition active:scale-95
                ${
                  cta.kind === "primary"
                    ? "bg-sky-300 text-slate-950 shadow-lg shadow-sky-300/40 hover:bg-sky-200"
                    : cta.kind === "secondary"
                    ? "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    : "text-slate-300 hover:text-slate-50"
                }
                ${cta.disabled ? "opacity-40 pointer-events-none" : ""}
              `}
            >
              {cta.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
