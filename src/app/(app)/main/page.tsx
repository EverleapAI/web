// src/app/(app)/main/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";

/* =============================================================================
   Storage keys
   ============================================================================= */

// localStorage
const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";

// sessionStorage
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";

// login banner (session)
const JUST_LOGGED_IN_SESSION_KEY = "everleap.main.justLoggedIn.v1";

/* =============================================================================
   Completion thresholds
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Types
   ============================================================================= */

type SessionTinyState = {
  shownIds: string[];
  completedIds: string[];
};

type Saved = { answer?: string; skipped?: boolean };

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
  return next === "motivations" ? "Motivations" : next === "strengths" ? "Strengths" : "Skills";
}

function openingLine(name: string) {
  const n = (name ?? "").trim();
  return n ? `Hey ${n}.` : "Welcome — I’m your Everleap counselor.";
}

function cleanOneLine(s: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function isMeaningfulText(value: string): boolean {
  const trimmed = (value ?? "").trim();
  if (trimmed.length < 3) return false;
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;
  const unique = new Set(lettersOnly.toLowerCase()).size;
  if (unique <= 2) return false;
  const squashed = trimmed.replace(/\s+/g, "");
  if (/^(.)\1{6,}$/i.test(squashed)) return false;
  return true;
}

/* =============================================================================
   SessionTiny normalizer (NO any)
   ============================================================================= */

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}

function readVmSessionTiny(vm: unknown): SessionTinyState {
  if (!vm || typeof vm !== "object") return { shownIds: [], completedIds: [] };

  const obj = vm as Record<string, unknown>;
  const st = obj["sessionTiny"];

  if (!st || typeof st !== "object") return { shownIds: [], completedIds: [] };

  const stObj = st as Record<string, unknown>;
  return {
    shownIds: toStringArray(stObj["shownIds"]),
    completedIds: toStringArray(stObj["completedIds"]),
  };
}

/* =============================================================================
   Tiny task session state (sessionStorage)
   ============================================================================= */

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };

  const parsed = safeJsonParse<SessionTinyState>(window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY));
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
   Story + onboarding readers (for meaningful copy)
   ============================================================================= */

type OnboardingV4 = {
  name?: string;
  situation?: "high_school" | "young_adult" | null;
  certainty?: "strong" | "kinda" | "no_clue" | null;
};

function readOnboardingV4(): OnboardingV4 {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  const parsed = safeJsonParse<OnboardingV4>(raw);
  return parsed ?? {};
}

function loadStorySaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORY_STORAGE_KEY_V3);
  const parsed = safeJsonParse<Record<string, Saved>>(raw);
  return parsed ?? {};
}

type ExtractedSignal = {
  category: RecommendedNext;
  questionId: string;
  answer: string;
  confidence: number; // 0..1
  interpretation: string;
  extraInterpretation?: string;
};

function scoreAnswer(a: string) {
  const t = cleanOneLine(a);
  if (!isMeaningfulText(t)) return 0;

  const len = t.length;
  const hasEffort = /\b(hard|work|earned|effort|discipline|practice|train|grind|progress)\b/i.test(t);
  const hasMovement = /\b(gym|run|lift|workout|move|training|practice)\b/i.test(t);
  const hasEmotion = /\b(happy|calm|proud|stressed|anxious|excited|good|better)\b/i.test(t);
  const hasRoutine = /\b(day|daily|routine|morning|night|shower|sleep|schedule)\b/i.test(t);

  let score = 0;
  score += Math.min(50, len) / 50;
  score += hasEffort ? 0.35 : 0;
  score += hasMovement ? 0.25 : 0;
  score += hasEmotion ? 0.18 : 0;
  score += hasRoutine ? 0.12 : 0;

  return Math.min(2, score);
}

function interpretAnswer(opts: {
  answer: string;
  lane: "high_school" | "young_adult" | "unknown";
  confidence: number;
}): { interpretation: string; extra?: string } {
  const { answer, lane, confidence } = opts;
  const t = cleanOneLine(answer);

  const hasEffort = /\b(hard|work|earned|effort|discipline|practice|train|progress)\b/i.test(t);
  const hasMovement = /\b(gym|run|lift|workout|move|training)\b/i.test(t);
  const hasReset = /\b(shower|sleep|reset|clean|fresh)\b/i.test(t);
  const hasMood = /\b(happy|calm|good|better|peace|ok)\b/i.test(t);

  let interpretation =
    "You do best when there’s a clear win in the day — something you can point to and say, “I did that.”";

  if (hasEffort && hasMovement) {
    interpretation = "You do best when progress feels earned — effort + momentum matter to you.";
  } else if (hasEffort) {
    interpretation = "You do best when the day feels earned — real effort, real progress, not just drifting.";
  } else if (hasMovement) {
    interpretation = "You do best with momentum — when you move, your head clears and you lock in.";
  } else if (hasMood) {
    interpretation = "Your mood isn’t random — it tracks with what your day actually contains.";
  }

  if (hasReset) {
    interpretation += " You also have a reset ritual — that’s you protecting your headspace.";
  }

  let extra: string | undefined;
  if (confidence >= 0.78) {
    if (lane === "high_school") {
      extra = "So I’m going to steer you toward options you can build over time — skills you can level up, not vibes.";
    } else if (lane === "young_adult") {
      extra = "So I’m going to bias toward paths with visible momentum — projects, routines, and environments where progress shows.";
    } else {
      extra = "So I’m going to recommend next steps you can actually train — not just browse.";
    }
  }

  if (confidence < 0.45) return { interpretation, extra: undefined };
  return { interpretation, extra };
}

function pickBestSignal(): ExtractedSignal | null {
  if (typeof window === "undefined") return null;

  const saved = loadStorySaved();
  const onboarding = readOnboardingV4();

  const lane: "high_school" | "young_adult" | "unknown" =
    onboarding.situation === "high_school"
      ? "high_school"
      : onboarding.situation === "young_adult"
        ? "young_adult"
        : "unknown";

  const candidates: Array<{ id: string; cat: RecommendedNext; answer: string; score: number }> = [];

  const addIf = (id: string, cat: RecommendedNext) => {
    const s = saved[id];
    const a = cleanOneLine(s?.answer ?? "");
    if (!a || !isMeaningfulText(a)) return;
    candidates.push({ id, cat, answer: a, score: scoreAnswer(a) });
  };

  for (let i = 1; i <= 5; i += 1) addIf(`motivations_${i}`, "motivations");
  for (let i = 1; i <= 5; i += 1) addIf(`strengths_${i}`, "strengths");
  for (let i = 1; i <= 5; i += 1) addIf(`skills_${i}`, "skills");

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const biasA = a.cat === "motivations" ? 0.06 : 0;
    const biasB = b.cat === "motivations" ? 0.06 : 0;
    return b.score + biasB - (a.score + biasA);
  });

  const top = candidates[0]!;
  const normalized = Math.max(0, Math.min(1, top.score / 2));
  const { interpretation, extra } = interpretAnswer({
    answer: top.answer,
    lane,
    confidence: normalized,
  });

  return {
    category: top.cat,
    questionId: top.id,
    answer: top.answer,
    confidence: normalized,
    interpretation,
    extraInterpretation: extra,
  };
}

/* =============================================================================
   Coach copy helpers (spoken, grounded, progress-aware)
   ============================================================================= */

type NarrativeMode = "welcome_new" | "in_progress" | "complete_signals";

function certaintyLine(certainty?: OnboardingV4["certainty"]) {
  if (certainty === "strong") return "You sound pretty clear on what you want — we’ll make it real, not vague.";
  if (certainty === "kinda") return "You’re not guessing, but you’re not locked in either — that’s a good place to work from.";
  if (certainty === "no_clue") return "You don’t need a “forever plan.” We just need one honest direction to test.";
  return "";
}

function nextWhy(next: RecommendedNext) {
  if (next === "motivations") {
    return "Motivations tells me what actually pulls you forward (and what drains you) — it’s how I stop guessing.";
  }
  if (next === "strengths") {
    return "Strengths is how we make sure options fit how you operate day to day — not just what sounds interesting.";
  }
  return "Skills is where we turn direction into something concrete — what to try, build, or practice next.";
}

function primaryCtaLabel(next: RecommendedNext, allComplete: boolean) {
  return allComplete ? "Go to Insights" : `Continue to ${labelForNext(next)}`;
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // NOTE: AppChrome is now provided by /main/layout.tsx.
  // We keep theme values here only for page-level calculations (dark/orb glow),
  // even though we no longer pass them into AppChrome from this page.
  const [themeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel] = React.useState<GradientLevel>(3);
  void gradientLevel;

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
        ? "bg-sky-400/25"
        : "bg-amber-300/30";

  const [presenceSoft, setPresenceSoft] = React.useState(false);

  type TodayVM = ReturnType<typeof buildTodayViewModel>;

  const makeEmptyVm = (): TodayVM =>
    ({
      snapshot: null,
      quote: undefined,
      progress: { motivationsAnswered: 0, strengthsAnswered: 0, skillsAnswered: 0 },
      weeklyFocus: null,
      sprintCount: 0,
      sessionTiny: { shownIds: [], completedIds: [] },
      nextKey: "motivations",
    } as unknown as TodayVM);

  const [vm, setVm] = React.useState<TodayVM>(makeEmptyVm);
  const [mounted, setMounted] = React.useState(false);

  const [motionEnabled, setMotionEnabled] = React.useState(true);
  const [transitioning, setTransitioning] = React.useState(false);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  const [justLoggedIn, setJustLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setVm(buildTodayViewModel());

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

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const m = searchParams?.get("m") ?? "";
    if (m !== "login") return;

    const already = window.sessionStorage.getItem(JUST_LOGGED_IN_SESSION_KEY) === "1";

    if (!already) {
      setJustLoggedIn(true);
      try {
        window.sessionStorage.setItem(JUST_LOGGED_IN_SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }

    router.replace("/main");
  }, [router, searchParams]);

  const progress = mounted ? vm.progress : { motivationsAnswered: 0, strengthsAnswered: 0, skillsAnswered: 0 };

  const motAnswered = progress.motivationsAnswered ?? 0;
  const strAnswered = progress.strengthsAnswered ?? 0;
  const sklAnswered = progress.skillsAnswered ?? 0;

  const motComplete = motAnswered >= SIGNAL_COMPLETE_COUNT;
  const strComplete = strAnswered >= SIGNAL_COMPLETE_COUNT;
  const sklComplete = sklAnswered >= SIGNAL_COMPLETE_COUNT;

  const allSignalsComplete = motComplete && strComplete && sklComplete;

  const recommendedNext: RecommendedNext = !motComplete ? "motivations" : !strComplete ? "strengths" : "skills";

  const vmTiny = readVmSessionTiny(vm);
  const sprintDoneThisSession = mounted ? vmTiny.completedIds.includes("curiosity_sprint") : false;

  const weeklyFocusSet = !!(vm.weeklyFocus?.vibe && vm.weeklyFocus?.target);
  const sprintCount = vm.sprintCount ?? 0;
  const shownTinyCount = vmTiny.shownIds.length;

  const tasks: TinyTaskSummary[] = [
    {
      id: "weekly_focus",
      title: "Weekly focus",
      subtitle: "Pick a vibe + a target for this week.",
      status: weeklyFocusSet ? "set" : "start",
    },
    {
      id: "curiosity_sprint",
      title: "Curiosity sprint",
      subtitle: "10 minutes. One small experiment you can actually do.",
      count: sprintCount,
      disabled: sprintDoneThisSession,
      status: sprintDoneThisSession ? "done" : "start",
    },
  ];

  const buildQuestionsHref = (cat: RecommendedNext) => {
    const params = new URLSearchParams();
    params.set("cat", cat);
    params.set("returnTo", "/main");
    return `/main/questions?${params.toString()}`;
  };

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

  const name = mounted ? niceName(getSnapshotName(vm.snapshot)) : "";
  const open = openingLine(name);

  const onboarding = mounted ? readOnboardingV4() : {};
  const signal = mounted ? pickBestSignal() : null;

  const hasAnyProgress = motAnswered > 0 || strAnswered > 0 || sklAnswered > 0;
  const hasAnyAction = weeklyFocusSet || sprintCount > 0 || shownTinyCount > 0;
  const hasOnboarded = mounted ? !!(onboarding.name || vm.snapshot) : false;

  const mode: NarrativeMode =
    allSignalsComplete
      ? "complete_signals"
      : hasOnboarded && !hasAnyProgress && !signal && !hasAnyAction
        ? "welcome_new"
        : "in_progress";

  const loginLine = "Alright — you’re in. Let’s pick up where you left off.";

  const paragraphs: string[] = React.useMemo(() => {
    if (!mounted) return ["…"];

    const next = recommendedNext;
    const why = nextWhy(next);
    const certainty = certaintyLine(onboarding.certainty);

    const didLineParts: string[] = [];
    if (motComplete) didLineParts.push("Motivations");
    if (strComplete) didLineParts.push("Strengths");
    if (sklComplete) didLineParts.push("Skills");

    const didLine =
      didLineParts.length === 0
        ? ""
        : didLineParts.length === 1
          ? `You’ve already locked in ${didLineParts[0]}.`
          : didLineParts.length === 2
            ? `You’ve already locked in ${didLineParts[0]} + ${didLineParts[1]}.`
            : "You’ve already locked in Motivations + Strengths + Skills.";

    const actionLine = weeklyFocusSet
      ? "And you’ve got a weekly focus set — that’s where progress starts showing up."
      : sprintCount > 0
        ? `You’ve already done ${sprintCount} curiosity sprint${sprintCount === 1 ? "" : "s"} — that’s real momentum.`
        : "";

    const signalLine = signal?.interpretation ? `One pattern I’m taking seriously: ${signal.interpretation}` : "";

    const lines: string[] = [open];
    if (justLoggedIn) lines.push(loginLine);

    if (mode === "complete_signals") {
      lines.push("You’ve got the full set — Motivations, Strengths, and Skills.");
      lines.push("Insights is where I translate that into patterns + next steps you can actually act on.");
      return lines.filter(Boolean).slice(0, 5);
    }

    if (mode === "welcome_new") {
      lines.push("Welcome to Everleap. I’ll be your coach here — the goal is a direction that feels real, not random.");
      lines.push("We’ll go Motivations → Strengths → Skills, then turn that into small actions you can actually do.");
      lines.push(
        next === "motivations"
          ? "We start with Motivations because it tells me what actually pulls you forward — it’s the foundation for everything else."
          : `Next I want ${labelForNext(next)} so I’m building from you, not a template.`
      );
      if (certainty) lines.push(certainty);
      return lines.filter(Boolean).slice(0, 6);
    }

    lines.push("Good — you’ve started giving me real signal. That’s how this stops feeling generic.");
    if (didLine) lines.push(didLine);
    if (actionLine) lines.push(actionLine);

    if (signalLine) {
      lines.push(signalLine);
      if (signal?.extraInterpretation) lines.push(signal.extraInterpretation);
    }

    lines.push(`My recommendation: ${labelForNext(next)}. ${why}`);

    if (next !== "motivations") {
      lines.push(`If that doesn’t feel right today, ${next === "strengths" ? "Motivations" : "Strengths"} is still a solid move.`);
    }

    return lines.filter(Boolean).slice(0, 8);
  }, [
    mounted,
    mode,
    open,
    recommendedNext,
    onboarding.certainty,
    motComplete,
    strComplete,
    sklComplete,
    weeklyFocusSet,
    sprintCount,
    signal,
    justLoggedIn,
  ]);

  const ctaLabel = React.useMemo(() => {
    if (!mounted) return undefined;
    return primaryCtaLabel(recommendedNext, allSignalsComplete);
  }, [mounted, recommendedNext, allSignalsComplete]);

  return (
    <>
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
                motionEnabled={motionEnabled}
                isTransitioning={transitioning}
                quote={mounted ? vm.quote : undefined}
                paragraphs={paragraphs}
                primaryCtaLabel={ctaLabel}
                onPrimary={() => {
                  if (allSignalsComplete) {
                    void fadeThen(async () => router.push("/main/insights"));
                    return;
                  }
                  void fadeThen(async () => router.push(buildQuestionsHref(recommendedNext)));
                }}
              />

              {mounted ? (
                <>
                  {!allSignalsComplete ? (
                    <div className="mt-1">
                      <SignalsCard dark={dark} progress={vm.progress} nextKey={vm.nextKey} />
                    </div>
                  ) : null}

                  <div className="mt-5">
                    <TinyTasks
                      tasks={tasks}
                      onOpenTask={(id) => {
                        const s = readSessionTinyState();
                        writeSessionTinyState({
                          shownIds: Array.from(new Set([...s.shownIds, String(id)])),
                          completedIds: s.completedIds,
                        });
                        setActiveTaskId(id);
                        setTaskOpen(true);
                      }}
                      dark={dark}
                    />
                  </div>
                </>
              ) : null}

              <div className="h-3" />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}