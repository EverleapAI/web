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
   Session keys
   ============================================================================= */

const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";
const INTRO_SEEN_SESSION_KEY = "everleap.main.introSeen.v1";

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

function greet(name: string) {
  const n = name?.trim();
  return n ? `Hey ${n}.` : "Hey.";
}

function labelForNext(next: RecommendedNext) {
  return next === "motivations" ? "Motivations" : next === "strengths" ? "Strengths" : "Skills";
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

  const motComplete = progress.motivationsAnswered >= SIGNAL_COMPLETE_COUNT;
  const strComplete = progress.strengthsAnswered >= SIGNAL_COMPLETE_COUNT;
  const sklComplete = progress.skillsAnswered >= SIGNAL_COMPLETE_COUNT;

  const allSignalsComplete = motComplete && strComplete && sklComplete;

  const recommendedNext: RecommendedNext =
    !motComplete ? "motivations" : !strComplete ? "strengths" : "skills";

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
     Copy derivations (ALL variants are conversational + name-aware)
     --------------------------------------------------------------------------- */

  const name = mounted ? niceName(getSnapshotName(vm.snapshot)) : "";
  const hello = greet(name);

  const snapshot = mounted ? vm.snapshot : null;

  const arrivalReference: ArrivalReference =
    sklComplete
      ? "skills_done"
      : strComplete
      ? "strengths_done"
      : motComplete
      ? "motivations_done"
      : snapshot
      ? "onboarding_only"
      : "returning_no_action";

  // Phase A: arrival acknowledgement (always starts with greeting)
  const arrivalParagraphs: string[] = (() => {
    if (!mounted) return ["…"];

    if (arrivalReference === "onboarding_only") {
      return [
        hello,
        "I’ve got your onboarding answers — enough to stop guessing.",
        "Now we turn that into a direction that feels real (not random).",
      ];
    }

    if (arrivalReference === "motivations_done") {
      return [
        hello,
        "You’ve already done Motivations — that tells me what reliably energizes you and what drains you.",
        "That’s a strong start. Next we make it usable.",
      ];
    }

    if (arrivalReference === "strengths_done") {
      return [
        hello,
        "You’ve already done Strengths — that tells me how you actually operate day to day.",
        "That’s the difference between “cool idea” and “this fits you.”",
      ];
    }

    if (arrivalReference === "skills_done") {
      return [
        hello,
        "Nice — you’ve already done Skills too.",
        "That means I can stop being vague and start being specific about what you should try next.",
      ];
    }

    return [hello, "Picking up where we left off."];
  })();

  // Phase B: direction + why (always starts with greeting)
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
          hello,
          "Before I suggest anything, I want one thing clear: what actually pulls you forward (and what drains you).",
          "That’s Motivations. It helps me avoid recommending paths that look good on paper but won’t feel right in real life.",
          "If you’ve got two minutes, let’s do it now.",
        ],
        primaryCtaLabel: "Continue to Motivations",
        secondaryCtaLabel: "Not yet",
      };
    }

    if (recommendedNext === "strengths") {
      return {
        paragraphs: [
          hello,
          "You’ve told me what motivates you — great.",
          "Next is Strengths. This is how I make sure the options I suggest match how you actually work, not just what sounds interesting.",
          "Want to keep going?",
        ],
        primaryCtaLabel: "Continue to Strengths",
        secondaryCtaLabel: "Not yet",
      };
    }

    // skills
    return {
      paragraphs: [
        hello,
        "You’ve already nailed Motivations and Strengths — that’s the hard thinking.",
        "Skills is the part where things get practical. It’s how I turn “direction” into specific next steps — what to try, build, or practice next.",
        "If you’re down, let’s finish that piece.",
      ],
      primaryCtaLabel: "Continue to Skills",
      secondaryCtaLabel: "Not yet",
    };
  })();

  // Phase C: unlocked header copy (still conversational, always greeting)
  // - If ALL complete: push to Insights (door open)
  // - If incomplete: keep nudging next signal, but like a human
  const unlockedParagraphsAndCtas = (() => {
    if (!mounted) {
      return { paragraphs: ["…"], primaryCtaLabel: undefined as string | undefined };
    }

    if (allSignalsComplete) {
      return {
        paragraphs: [
          hello,
          "You’ve got the full set now — Motivations, Strengths, and Skills.",
          "That’s the moment Everleap stops being generic. Insights is where I translate your signals into actual picks: patterns, next steps, and what to explore.",
        ],
        primaryCtaLabel: "Go to Insights",
      };
    }

    const nextLabel = labelForNext(recommendedNext);

    if (recommendedNext === "motivations") {
      return {
        paragraphs: [
          hello,
          "Quick check: I still don’t have your Motivations.",
          "That’s the piece that keeps me from pushing “good on paper” paths that won’t feel right for you.",
          "Want to knock it out so the rest of Everleap gets smarter immediately?",
        ],
        primaryCtaLabel: `Continue to ${nextLabel}`,
      };
    }

    if (recommendedNext === "strengths") {
      return {
        paragraphs: [
          hello,
          "I’ve got your Motivations — good.",
          "Strengths is what helps me recommend options that fit how you operate day to day.",
          "If you do one thing next, do this.",
        ],
        primaryCtaLabel: `Continue to ${nextLabel}`,
      };
    }

    // skills
    return {
      paragraphs: [
        hello,
        "Motivations and Strengths are in — you’ve done the foundation work.",
        "Skills is what lets me turn that into concrete next steps instead of broad ideas.",
        "Give me Skills, and I can start making sharper calls.",
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
