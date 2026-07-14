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

  renderStep: (args: RenderStepArgs) => React.ReactNode;

  getCtas?: (args: {
    step: StepperStep;
    state: StepperShellState;
    progress: StepperPersistedState;
  }) => StepperShellCta[];

  onExit?: () => void;

  laneTitle?: string;
  laneSubtitle?: string;
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

    const updatedAt =
      typeof obj.updatedAt === "string" ? obj.updatedAt : base.updatedAt;

    const progress =
      typeof obj.progress === "object" && obj.progress !== null
        ? (obj.progress as Record<string, unknown>)
        : {};

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type Accent = {
  halo: string;
  rail: string;
  chip: string;
  cta: string;
  ctaShadow: string;
};

function pickAccent(input: { laneId: string; laneTitle?: string }): Accent {
  const key = `${input.laneId} ${input.laneTitle ?? ""}`.toLowerCase();

  if (key.includes("product") || key.includes("ux") || key.includes("ui")) {
    return {
      halo: "from-sky-500/20 via-cyan-400/10 to-indigo-500/12",
      rail: "from-sky-300 via-cyan-300 to-indigo-300",
      chip: "border-sky-200/20 bg-sky-300/10 text-sky-100",
      cta: "bg-sky-300 text-slate-950 hover:bg-sky-200",
      ctaShadow: "shadow-sky-300/30",
    };
  }

  if (key.includes("data") || key.includes("analytics")) {
    return {
      halo: "from-emerald-500/18 via-teal-400/10 to-sky-500/12",
      rail: "from-emerald-300 via-teal-300 to-sky-300",
      chip: "border-emerald-200/20 bg-emerald-300/10 text-emerald-100",
      cta: "bg-emerald-300 text-slate-950 hover:bg-emerald-200",
      ctaShadow: "shadow-emerald-300/30",
    };
  }

  if (
    key.includes("founder") ||
    key.includes("startup") ||
    key.includes("entrepreneur")
  ) {
    return {
      halo: "from-amber-500/18 via-orange-400/10 to-rose-500/12",
      rail: "from-amber-300 via-orange-300 to-rose-300",
      chip: "border-amber-200/20 bg-amber-300/10 text-amber-100",
      cta: "bg-amber-300 text-slate-950 hover:bg-amber-200",
      ctaShadow: "shadow-amber-300/30",
    };
  }

  return {
    halo: "from-violet-500/18 via-fuchsia-400/10 to-sky-500/12",
    rail: "from-violet-300 via-fuchsia-300 to-sky-300",
    chip: "border-violet-200/20 bg-violet-300/10 text-violet-100",
    cta: "bg-violet-300 text-slate-950 hover:bg-violet-200",
    ctaShadow: "shadow-violet-300/30",
  };
}

function cleanTitle(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function primaryLabelForNextStep(nextStep: StepperStep | undefined) {
  if (!nextStep) return "Back to Explore";

  // Make the “Specialties” moment explicit because that’s what teens want next.
  if (nextStep.id === "specialties") return "Dive into Specialties";

  const t = cleanTitle(nextStep.title || "the next part");
  return `Dive into ${t}`;
}

export default function StepperShell({
  laneId,
  steps,
  renderStep,
  getCtas,
  onExit,
  laneTitle,
  laneSubtitle,
}: Props) {
  const router = useRouter();

  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [progress, setProgress] = React.useState<StepperPersistedState>(() =>
    safeReadPersisted(laneId)
  );

  const accent = React.useMemo(
    () => pickAccent({ laneId, laneTitle }),
    [laneId, laneTitle]
  );

  React.useEffect(() => {
    safeWritePersisted(laneId, progress);
  }, [laneId, progress]);

  React.useEffect(() => {
    setStepIndex(0);
    setProgress(safeReadPersisted(laneId));
  }, [laneId]);

  const step = steps[stepIndex] ?? steps[0];
  const isFirst = stepIndex <= 0;
  const isLast = stepIndex >= steps.length - 1;
  const nextStep = steps[stepIndex + 1];

  const goBack = React.useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = React.useCallback(() => {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }, [steps.length]);

  // ✅ allow steps to jump directly to an id (e.g., "specialties")
  const goToStep = React.useCallback(
    (id: string) => {
      const idx = steps.findIndex((s) => s.id === id);
      if (idx >= 0) setStepIndex(idx);
    },
    [steps]
  );

  const doExit = React.useCallback(() => {
    if (onExit) onExit();
    else router.push("/main/insights");
  }, [onExit, router]);

  /**
   * ✅ Navigation API exposed to steps (Suggestion A).
   * Steps should call:
   * - state.goNext() to advance (same behavior as sticky primary CTA)
   * - state.goBack() to go back
   * - state.goToStep("forecast") for explicit jumps
   */
  const state = React.useMemo(() => {
    return ({
      stepIndex,
      goToStep,
      goNext,
      goBack,
    } as unknown) as StepperShellState;
  }, [stepIndex, goToStep, goNext, goBack]);

  const defaultCtas: StepperShellCta[] = [
    ...(isFirst ? [] : [{ id: "back", label: "Back" }]),
    {
      id: "primary",
      label: isLast ? "Back to Explore" : primaryLabelForNextStep(nextStep),
    },
  ];

  const ctas = getCtas ? getCtas({ step, state, progress }) : defaultCtas;

  /**
   * UX RULES:
   * - Overview: primary CTA lives inside the overview card, not the sticky bar.
   * - Specialties: forward navigation should live inside each specialty card (per-card pill),
   *   and the sticky primary CTA + "Next:" helper should be suppressed.
   */
  const suppressPrimaryInStickyBar =
    step?.id === "overview" || step?.id === "specialties";

  // Specialties also hides the sticky "Next:" helper line and the top-right subtitle.
  const suppressStickyHelperText = step?.id === "specialties";
  const suppressLaneSubtitle = step?.id === "specialties";

  function onCta(cta: StepperShellCta) {
    if (cta.id === "back") return goBack();
    if (cta.id === "exit") return doExit();

    const isPrimaryLike =
      cta.id === "primary" || cta.id === "next" || cta.id === "done";
    if (isPrimaryLike) return isLast ? doExit() : goNext();

    return isLast ? doExit() : goNext();
  }

  const stepNumber = clamp(stepIndex + 1, 1, Math.max(1, steps.length));

  // Right-side CTAs exclude back; we also optionally suppress the primary CTA (overview + specialties).
  const rightCtas = ctas
    .filter((c) => c.id !== "back")
    .filter((c) => (suppressPrimaryInStickyBar ? c.id !== "primary" : true));

  /**
   * IMPORTANT:
   * BottomNav is fixed at the bottom of the screen.
   * If we also stick our CTA bar to bottom:0, it gets hidden.
   * This pushes the Stepper CTA bar ABOVE BottomNav.
   *
   * Tune this if your BottomNav height changes.
   */
  const BOTTOM_NAV_OFFSET_PX = 76;

  return (
    <div className="mx-auto w-full max-w-5xl px-0 pb-28 pt-2 md:px-0 md:pt-3">
      {/* Minimal context strip */}
      <div className="mb-3 px-4 md:px-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${accent.chip}`}
            >
              Dive deeper
            </span>
            {laneTitle ? (
              <span className="text-xs font-semibold text-slate-100/90">
                {laneTitle}
              </span>
            ) : null}
            <span className="text-xs text-slate-300/70">
              {stepNumber}/{steps.length}
            </span>
          </div>

          {!suppressLaneSubtitle && laneSubtitle ? (
            <div className="max-w-[70%] truncate text-xs text-slate-300/70">
              {laneSubtitle}
            </div>
          ) : null}
        </div>

        <div className="mt-2 h-[2px] w-full rounded-full bg-white/10">
          <div
            className={`h-[2px] rounded-full bg-gradient-to-r ${accent.rail}`}
            style={{
              width: `${Math.round(
                (stepNumber / Math.max(1, steps.length)) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="relative px-4 md:px-0">
        <div
          className={`pointer-events-none absolute inset-0 -z-10 rounded-card bg-gradient-to-br ${accent.halo} blur-2xl opacity-30`}
        />

        <div className="min-h-[40vh] rounded-card border border-white/10 bg-slate-950/30 p-1 backdrop-blur-2xl">
          <div className="rounded-card bg-slate-950/15 p-4 md:p-6">
            {step ? (
              renderStep({ step, state, progress, setProgress })
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-200/85">
                Missing step definition.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar (visible ABOVE BottomNav) */}
      <div
        className="fixed inset-x-0 z-[60]"
        style={{
          bottom: `calc(${BOTTOM_NAV_OFFSET_PX}px + env(safe-area-inset-bottom))`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pt-3 md:px-8">
          <div className="flex items-center justify-between gap-3 rounded-panel border border-white/10 bg-slate-950/75 px-3 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            {/* Left: Back (or step count) */}
            <div className="flex min-w-0 items-center gap-2">
              {!isFirst ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div className="pl-1 text-xs text-slate-300/70">
                  {stepNumber}/{steps.length}
                </div>
              )}

              {/* Exit is ALWAYS available */}
              <button
                type="button"
                onClick={doExit}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/35 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-950/55 active:scale-95"
                aria-label="Exit"
                title="Exit"
              >
                <X className="h-4 w-4" />
                Exit
              </button>
            </div>

            {/* Middle helper (suppressed on specialties) */}
            {!suppressStickyHelperText ? (
              <div className="hidden min-w-0 flex-1 px-2 sm:block">
                <div className="truncate text-xs text-slate-300/70">
                  {isLast ? "Done — return to Explore" : "Next: one level deeper"}
                </div>
              </div>
            ) : (
              <div className="hidden min-w-0 flex-1 px-2 sm:block" />
            )}

            {/* Right: Primary CTA (suppressed on overview + specialties) */}
            <div className="flex items-center gap-2">
              {rightCtas.map((cta) => {
                const primary =
                  cta.id === "primary" || cta.id === "next" || cta.id === "done";

                return (
                  <button
                    key={cta.id}
                    type="button"
                    onClick={() => onCta(cta)}
                    className={
                      primary
                        ? `inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg ${accent.ctaShadow} transition active:scale-95 ${accent.cta}`
                        : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
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
      </div>

      {/* Spacer so content never sits behind the CTA bar */}
      <div style={{ height: BOTTOM_NAV_OFFSET_PX + 96 }} />
    </div>
  );
}
