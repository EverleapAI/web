// src/app/main/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";
import { TinyTasks, type TinyTaskSummary } from "./components/TinyTasks";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import {
  TaskRunnerModal,
  type TinyTaskId,
  type OnboardingSnapshot as ModalOnboardingSnapshot,
} from "./TaskRunnerModal";

import { buildTodayViewModel } from "./app/buildTodayViewModel";

import {
  TodayIntro,
  type TodayPhase,
  type ArrivalReference,
  type RecommendedNext,
} from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";

/* =============================================================================
   Storage keys (QA reset + session gates)
   ============================================================================= */

// localStorage
const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

// sessionStorage
const QUOTE_SESSION_KEY = "everleap.main.quote.v1";
const INTRO_SEEN_SESSION_KEY = "everleap.main.introSeen.v1";
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";

// session prefix
const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

/* =============================================================================
   Completion thresholds
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Types
   ============================================================================= */

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

/* =============================================================================
   Utils
   ============================================================================= */

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function readIntroSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeIntroSeen() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(INTRO_SEEN_SESSION_KEY, "1");
  } catch {
    // ignore
  }
}

function firstName(raw: string) {
  const cleaned = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function niceName(raw: string) {
  const n = firstName(raw);
  if (!n) return "";
  return n.length === 1 ? n.toUpperCase() : `${n[0]!.toUpperCase()}${n.slice(1)}`;
}

function getSnapshotName(snapshot: unknown): string {
  if (!snapshot || typeof snapshot !== "object") return "";
  const s = snapshot as { name?: unknown };
  return typeof s.name === "string" ? s.name : "";
}

function labelForNext(next: RecommendedNext) {
  return next === "motivations"
    ? "Motivations"
    : next === "strengths"
    ? "Strengths"
    : "Skills";
}

/**
 * Opening line for copy:
 * - If name exists → greet.
 * - If no name → counselor welcome (never “Hey.”).
 */
function openingLine(name: string) {
  const n = (name ?? "").trim();
  return n ? `Hey ${n}.` : "Welcome — I’m your Everleap counselor.";
}

/* =============================================================================
   Tiny task session state
   ============================================================================= */

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };

  const parsed = safeJsonParse<SessionTinyState>(
    window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY)
  );
  if (!parsed) return { shownIds: [], completedIds: [] };

  return {
    shownIds: parsed.shownIds ?? [],
    completedIds: parsed.completedIds ?? [],
  };
}

function writeSessionTinyState(next: SessionTinyState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TINY_TASKS_SESSION_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

/* =============================================================================
   QA reset helpers
   ============================================================================= */

function clearSessionPrefix(prefix: string) {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}

function wipeEverleapClientStorage() {
  if (typeof window === "undefined") return;

  try {
    // localStorage
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    window.localStorage.removeItem(STORY_STORAGE_KEY_V3);
    window.localStorage.removeItem(WEEKLY_FOCUS_KEY);
    window.localStorage.removeItem(CURIOSITY_SPRINTS_KEY);

    // sessionStorage
    window.sessionStorage.removeItem(QUOTE_SESSION_KEY);
    window.sessionStorage.removeItem(INTRO_SEEN_SESSION_KEY);
    window.sessionStorage.removeItem(TINY_TASKS_SESSION_KEY);

    // session prefix
    clearSessionPrefix(ZIP_PLACE_SESSION_PREFIX);
  } catch {
    // ignore
  }
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  const router = useRouter();

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
      ? "bg-sky-400/25"
      : "bg-amber-300/30";

  const [presenceSoft, setPresenceSoft] = React.useState(false);

  const [vm, setVm] = React.useState(() => buildTodayViewModel());
  const [mounted, setMounted] = React.useState(false);

  const [phase, setPhase] = React.useState<TodayPhase>("arrival");

  const [motionEnabled, setMotionEnabled] = React.useState(true);

  const [arrivalShowContinue, setArrivalShowContinue] = React.useState(false);
  const [directionShowPrimary, setDirectionShowPrimary] = React.useState(false);
  const [directionShowSecondary, setDirectionShowSecondary] = React.useState(false);

  const [transitioning, setTransitioning] = React.useState(false);
  const interactedRef = React.useRef(false);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  // QA reset UI
  const [qaResetOpen, setQaResetOpen] = React.useState(false);

  // Show only in dev OR when explicitly enabled
  const showQaReset =
    typeof window !== "undefined" &&
    (process.env.NODE_ENV !== "production" ||
      (process.env.NEXT_PUBLIC_QA_MODE ?? "") === "1");

  /* ---------------------------------------------------------------------------
     Mount / refresh
     --------------------------------------------------------------------------- */

  React.useEffect(() => {
    setMounted(true);

    // Refresh VM after mount (prevents hydration mismatch from storage/random)
    setVm(buildTodayViewModel());

    // reduced motion
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduce = !!mq?.matches;
    setMotionEnabled(!reduce);

    const onChange = () => {
      setMotionEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    mq?.addEventListener?.("change", onChange);

    const onFocus = () => setVm(buildTodayViewModel());
    window.addEventListener("focus", onFocus);

    return () => {
      mq?.removeEventListener?.("change", onChange);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 8) setPresenceSoft(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------------------------------------------------------------------
     Auto-advance cancel on interaction (Arrival only)
     --------------------------------------------------------------------------- */

  React.useEffect(() => {
    interactedRef.current = false;
    if (!motionEnabled) return;

    const mark = () => {
      interactedRef.current = true;
    };

    window.addEventListener("pointerdown", mark, { passive: true });
    window.addEventListener("keydown", mark);
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchstart", mark, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchstart", mark);
    };
  }, [motionEnabled]);

  /* ---------------------------------------------------------------------------
     Completion + gate decision
     --------------------------------------------------------------------------- */

  const progress = mounted
    ? vm.progress
    : { motivationsAnswered: 0, strengthsAnswered: 0, skillsAnswered: 0 };

  const motStarted = progress.motivationsAnswered > 0;
  const strStarted = progress.strengthsAnswered > 0;
  const sklStarted = progress.skillsAnswered > 0;

  const motComplete = progress.motivationsAnswered >= SIGNAL_COMPLETE_COUNT;
  const strComplete = progress.strengthsAnswered >= SIGNAL_COMPLETE_COUNT;
  const sklComplete = progress.skillsAnswered >= SIGNAL_COMPLETE_COUNT;

  const allSignalsComplete = motComplete && strComplete && sklComplete;

  const recommendedNext: RecommendedNext =
    !motComplete ? "motivations" : !strComplete ? "strengths" : "skills";

  // "Returning" should be true only for real past activity (NOT just onboarding).
  const hasWeeklyFocus = mounted ? !!(vm.weeklyFocus?.vibe && vm.weeklyFocus?.target) : false;
  const hasSprints = mounted ? (vm.sprintCount ?? 0) > 0 : false;
  const hasTinyCompleted = mounted ? (vm.sessionTiny?.completedIds?.length ?? 0) > 0 : false;
  const hasAnySignalsProgress = motStarted || strStarted || sklStarted;

  const isReturning =
    mounted && (hasAnySignalsProgress || hasWeeklyFocus || hasSprints || hasTinyCompleted);

  // Decide initial phase once we have mounted data
  React.useEffect(() => {
    if (!mounted) return;

    // If all done: "door open" immediately
    if (allSignalsComplete) {
      setPhase("unlocked");
      writeIntroSeen();
      return;
    }

    // Otherwise: run cinematic only once per session
    const seen = readIntroSeen();
    setPhase(seen ? "unlocked" : "arrival");
  }, [mounted, allSignalsComplete]);

  /* ---------------------------------------------------------------------------
     Phase timing + staged UI
     --------------------------------------------------------------------------- */

  React.useEffect(() => {
    if (!motionEnabled) {
      setArrivalShowContinue(true);
      setDirectionShowPrimary(true);
      setDirectionShowSecondary(true);
      return;
    }

    if (phase === "arrival") {
      setArrivalShowContinue(false);
      setDirectionShowPrimary(false);
      setDirectionShowSecondary(false);

      const tContinue = window.setTimeout(() => setArrivalShowContinue(true), 2000);

      // Arrival auto-advance only (and only if not interacted)
      const tAuto = window.setTimeout(() => {
        if (!interactedRef.current) setPhase("direction");
      }, 10000);

      return () => {
        window.clearTimeout(tContinue);
        window.clearTimeout(tAuto);
      };
    }

    if (phase === "direction") {
      setArrivalShowContinue(true);
      setDirectionShowPrimary(false);
      setDirectionShowSecondary(false);

      const tPrimary = window.setTimeout(() => setDirectionShowPrimary(true), 900);
      const tSecondary = window.setTimeout(() => setDirectionShowSecondary(true), 1500);

      return () => {
        window.clearTimeout(tPrimary);
        window.clearTimeout(tSecondary);
      };
    }

    // unlocked
    setArrivalShowContinue(true);
    setDirectionShowPrimary(true);
    setDirectionShowSecondary(true);
  }, [phase, motionEnabled]);

  /* ---------------------------------------------------------------------------
     Copy derivations (conversational + name-aware + status-aware)
     --------------------------------------------------------------------------- */

  const name = mounted ? niceName(getSnapshotName(vm.snapshot)) : "";
  const open = openingLine(name);

  const arrivalReference: ArrivalReference = sklComplete
    ? "skills_done"
    : strComplete
    ? "strengths_done"
    : motComplete
    ? "motivations_done"
    : isReturning
    ? "returning_no_action"
    : "onboarding_only";

  // Phase A: Arrival
  const arrivalParagraphs: string[] = (() => {
    if (!mounted) return ["…"];

    // No-name experience: counselor welcome + one-sentence promise.
    const promise =
      "I’ll help turn what you’re into into a clear direction — and a few next steps you can actually do.";

    // Brand-new: never say “picking up…”
    if (!isReturning && !motStarted && !strStarted && !sklStarted) {
      // If they have a name, still greet, but keep the same promise.
      return [open, promise];
    }

    // Returning states
    if (arrivalReference === "motivations_done") {
      return [
        open,
        "You’ve already done Motivations — nice.",
        "Now we’ll turn that into a direction and a next step that feels real.",
      ];
    }

    if (arrivalReference === "strengths_done") {
      return [
        open,
        "You’ve already done Strengths — that’s the part most people skip.",
        "Now we use it to make options that fit you day to day.",
      ];
    }

    if (arrivalReference === "skills_done") {
      return [
        open,
        "Nice — you’ve already captured Skills too.",
        "That’s enough signal for me to stop being vague and start being specific.",
      ];
    }

    // Only valid if returning
    return [open, "Picking up where we left off."];
  })();

  // Phase B: Direction (friendlier grammar, always references status)
  const directionParagraphsAndCtas = (() => {
    if (!mounted) {
      return {
        paragraphs: ["…"],
        primaryCtaLabel: "Continue",
        secondaryCtaLabel: "Not yet",
      };
    }

    if (recommendedNext === "motivations") {
      return {
        paragraphs: [
          name ? open : "Alright — quick start.",
          "You haven’t done Motivations yet — totally normal.",
          "Motivations tells me what actually energizes you (and what drains you).",
          "Give me that, and everything Everleap suggests gets way more you.",
        ],
        primaryCtaLabel: "Continue to Motivations",
        secondaryCtaLabel: "Not yet",
      };
    }

    if (recommendedNext === "strengths") {
      return {
        paragraphs: [
          open,
          "You’ve already done Motivations — great.",
          "Next is Strengths. This is how I make sure your options fit how you operate day to day — not just what sounds interesting.",
          "Want to keep going?",
        ],
        primaryCtaLabel: "Continue to Strengths",
        secondaryCtaLabel: "Not yet",
      };
    }

    // skills
    return {
      paragraphs: [
        open,
        "You’ve got Motivations and Strengths — that’s the foundation.",
        "Skills is the practical layer. It’s how I turn “direction” into real next steps: what to try, build, or practice next.",
        "If you’re down, let’s finish that piece.",
      ],
      primaryCtaLabel: "Continue to Skills",
      secondaryCtaLabel: "Not yet",
    };
  })();

  // Phase C: Unlocked (friendlier grammar; no “quick check” stiffness)
  const unlockedParagraphsAndCtas = (() => {
    if (!mounted) {
      return { paragraphs: ["…"], primaryCtaLabel: undefined as string | undefined };
    }

    if (allSignalsComplete) {
      return {
        paragraphs: [
          open,
          "You’ve got the full set — Motivations, Strengths, and Skills.",
          "Insights is where I translate that into real picks: patterns, next steps, and what to explore next.",
        ],
        primaryCtaLabel: "Go to Insights",
      };
    }

    const nextLabel = labelForNext(recommendedNext);

    if (recommendedNext === "motivations") {
      return {
        paragraphs: [
          name ? open : "Want me to stop guessing?",
          "Motivations is the fastest way to make Everleap feel personal.",
          "Two minutes — then I can start giving you real direction.",
        ],
        primaryCtaLabel: `Continue to ${nextLabel}`,
      };
    }

    if (recommendedNext === "strengths") {
      return {
        paragraphs: [
          open,
          "I’ve got your Motivations — good.",
          "Strengths is what makes the recommendations actually fit you day to day.",
          "If you do one thing next, do this.",
        ],
        primaryCtaLabel: `Continue to ${nextLabel}`,
      };
    }

    // skills
    return {
      paragraphs: [
        open,
        "You’ve done the foundation work.",
        "Skills is what lets me turn it into concrete next steps instead of broad ideas.",
        "Give me Skills, and I can make sharper calls.",
      ],
      primaryCtaLabel: `Continue to ${nextLabel}`,
    };
  })();

  /* ---------------------------------------------------------------------------
     Tiny Tasks
     --------------------------------------------------------------------------- */

  const sprintDoneThisSession = mounted
    ? vm.sessionTiny.completedIds.includes("curiosity_sprint")
    : false;

  const tasks: TinyTaskSummary[] = [
    {
      id: "weekly_focus",
      title: "Weekly focus",
      subtitle: "Pick a vibe + a target for this week.",
      status: vm.weeklyFocus?.vibe && vm.weeklyFocus?.target ? "set" : "start",
    },
    {
      id: "curiosity_sprint",
      title: "Curiosity sprint",
      subtitle: "10 minutes. One small experiment you can actually do.",
      count: vm.sprintCount,
      disabled: sprintDoneThisSession,
      status: sprintDoneThisSession ? "done" : "start",
    },
  ];

  /* ---------------------------------------------------------------------------
     Navigation helpers
     --------------------------------------------------------------------------- */

  const buildQuestionsHref = (cat: RecommendedNext) => {
    const params = new URLSearchParams();
    params.set("cat", cat);
    params.set("returnTo", "/main");
    return `/main/questions?${params.toString()}`;
  };

  /* ---------------------------------------------------------------------------
     Click-driven fades
     --------------------------------------------------------------------------- */

  const fadeThen = async (fn: () => void | Promise<void>) => {
    if (!motionEnabled) {
      await fn();
      return;
    }
    if (transitioning) return;

    setTransitioning(true);
    await sleep(220);
    await fn();
    await sleep(140);
    setTransitioning(false);
  };

  /* ---------------------------------------------------------------------------
     QA reset handlers
     --------------------------------------------------------------------------- */

  const doQaReset = async () => {
    // close modal immediately for snappier UX
    setQaResetOpen(false);

    await fadeThen(async () => {
      wipeEverleapClientStorage();

      // reset local state
      setVm(buildTodayViewModel());

      // restart the cinematic
      setPhase("arrival");

      // ensure we start at top
      try {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }

      // optional: refresh route cache
      router.refresh();
    });
  };

  /* ---------------------------------------------------------------------------
     Render
     --------------------------------------------------------------------------- */

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="spotlight_orb"
      ambientCap={0.35}
    >
      {/* Scrim fade for click transitions */}
      <AnimatePresence>
        {transitioning && motionEnabled ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className={dark ? "h-full w-full bg-black" : "h-full w-full bg-white"} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* QA Reset Modal */}
      <AnimatePresence>
        {qaResetOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Reset Everleap data"
          >
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close"
              onClick={() => setQaResetOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative w-full max-w-md rounded-2xl border p-4 shadow-xl ${
                dark
                  ? "border-white/10 bg-slate-950/70 text-white backdrop-blur"
                  : "border-black/10 bg-white/80 text-slate-900 backdrop-blur"
              }`}
            >
              <div className="text-sm font-semibold">Reset this device’s Everleap data?</div>
              <div className={`mt-2 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                This clears onboarding, signals (Motivations/Strengths/Skills), weekly focus, sprints,
                and session caches so QA can start over.
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQaResetOpen(false)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    dark
                      ? "bg-white/10 text-white hover:bg-white/14"
                      : "bg-slate-900 text-white hover:bg-slate-950"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void doQaReset()}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    dark
                      ? "bg-red-500/20 text-red-100 hover:bg-red-500/26"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {taskOpen && activeTaskId ? (
          <TaskRunnerModal
            open={taskOpen}
            onClose={() => {
              setTaskOpen(false);
              setActiveTaskId(null);
              setVm(buildTodayViewModel());
            }}
            taskId={activeTaskId}
            snapshot={vm.snapshot as unknown as ModalOnboardingSnapshot | null}
            dark={dark}
          />
        ) : null}
      </AnimatePresence>

      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pt-8">
          <section className="relative">
            {/* agent presence */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-1 top-2 h-10 w-10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: presenceSoft ? 0.08 : 0.22 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={`h-full w-full rounded-full ${orbGlowClass} blur-[1px]`}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <div className="pl-12">
              {/* QA Reset pill */}
              {mounted && showQaReset ? (
                <div className="mb-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setQaResetOpen(true)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      dark
                        ? "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white/85"
                        : "bg-slate-900/90 text-white/80 hover:bg-slate-950 hover:text-white"
                    }`}
                    aria-label="QA Reset"
                    title="QA Reset"
                  >
                    QA Reset
                  </button>
                </div>
              ) : null}

              <TodayIntro
                dark={dark}
                phase={phase}
                motionEnabled={motionEnabled}
                isTransitioning={transitioning}
                quote={mounted ? vm.quote : undefined}
                arrival={{
                  reference: arrivalReference,
                  paragraphs: arrivalParagraphs,
                  showContinue: arrivalShowContinue,
                }}
                direction={{
                  recommendedNext,
                  paragraphs: directionParagraphsAndCtas.paragraphs,
                  primaryCtaLabel: directionParagraphsAndCtas.primaryCtaLabel,
                  secondaryCtaLabel: directionParagraphsAndCtas.secondaryCtaLabel,
                  showPrimaryCta: directionShowPrimary,
                  showSecondaryCta: directionShowSecondary,
                }}
                unlocked={{
                  paragraphs: unlockedParagraphsAndCtas.paragraphs,
                  primaryCtaLabel: unlockedParagraphsAndCtas.primaryCtaLabel,
                  showPrimaryCta: true,
                  showSecondaryCta: false,
                }}
                onArrivalContinue={() => {
                  void fadeThen(() => setPhase("direction"));
                }}
                onDirectionAccept={() => {
                  writeIntroSeen();
                  void fadeThen(async () => {
                    setPhase("unlocked");
                    router.push(buildQuestionsHref(recommendedNext));
                  });
                }}
                onDirectionSkip={() => {
                  writeIntroSeen();
                  void fadeThen(() => setPhase("unlocked"));
                }}
                onUnlockedPrimary={() => {
                  writeIntroSeen();
                  if (allSignalsComplete) {
                    void fadeThen(async () => {
                      router.push("/main/insights");
                    });
                  } else {
                    void fadeThen(async () => {
                      router.push(buildQuestionsHref(recommendedNext));
                    });
                  }
                }}
              />

              {/* FULL PAGE AREA (only after unlocked) */}
              {phase === "unlocked" && mounted && (
                <>
                  {/* If all 3 done: door open wide → no Signals pressure */}
                  {!allSignalsComplete ? (
                    <SignalsCard dark={dark} progress={vm.progress} nextKey={vm.nextKey} />
                  ) : null}

                  <TinyTasks
                    tasks={tasks}
                    onOpenTask={(id) => {
                      const s = readSessionTinyState();
                      writeSessionTinyState({
                        shownIds: Array.from(new Set([...s.shownIds, id])),
                        completedIds: s.completedIds,
                      });
                      setActiveTaskId(id);
                      setTaskOpen(true);
                    }}
                    dark={dark}
                  />
                </>
              )}

              <div className="h-3" />
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
