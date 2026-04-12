"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";
import { SignalWord } from "./components/SignalWord";
import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";

/* =============================================================================
   Storage keys
   ============================================================================= */

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";
const JUST_LOGGED_IN_SESSION_KEY = "everleap.main.justLoggedIn.v1";

/* =============================================================================
   Completion thresholds
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Types
   ============================================================================= */

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
  return next === "motivations"
    ? "Motivations"
    : next === "strengths"
      ? "Strengths"
      : "Skills";
}

function openingLine(name: string) {
  const n = (name ?? "").trim();
  return n ? `Hey ${n}` : "Welcome back";
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

function pagePadding() {
  return "pb-24 pt-3 sm:pt-4 lg:pt-5";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-4 sm:px-5 md:px-6 lg:px-7";
}

function normalizeSourcePath(path: string): string | null {
  const p = cleanOneLine(path);

  if (!p) return null;
  if (p.includes("/main/insights")) return "Insights";
  if (p.includes("/main/explore")) return "Explore";
  if (p.includes("/main/actions")) return "Actions";
  if (p.includes("/main/questions")) {
    if (p.includes("cat=motivations")) return "Motivations";
    if (p.includes("cat=strengths")) return "Strengths";
    if (p.includes("cat=skills")) return "Skills";
    return "Questions";
  }
  return null;
}

function inferSourceLabel(searchParams: ReturnType<typeof useSearchParams>): string | null {
  if (typeof window === "undefined") return null;

  const fromParam = searchParams?.get("from");
  if (fromParam) return normalizeSourcePath(fromParam);

  const returnTo = searchParams?.get("returnTo");
  if (returnTo) return normalizeSourcePath(returnTo);

  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === window.location.origin) {
      return normalizeSourcePath(`${ref.pathname}${ref.search}`);
    }
  } catch {
    // ignore
  }

  return null;
}

/* =============================================================================
   Story + onboarding readers
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
  confidence: number;
  interpretation: string;
  extraInterpretation?: string;
};

function scoreAnswer(a: string) {
  const t = cleanOneLine(a);
  if (!isMeaningfulText(t)) return 0;

  const len = t.length;
  const hasEffort =
    /\b(hard|work|earned|effort|discipline|practice|train|grind|progress)\b/i.test(
      t
    );
  const hasMovement =
    /\b(gym|run|lift|workout|move|training|practice)\b/i.test(t);
  const hasEmotion =
    /\b(happy|calm|proud|stressed|anxious|excited|good|better)\b/i.test(t);
  const hasRoutine =
    /\b(day|daily|routine|morning|night|shower|sleep|schedule)\b/i.test(t);

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

  const hasEffort =
    /\b(hard|work|earned|effort|discipline|practice|train|progress)\b/i.test(
      t
    );
  const hasMovement = /\b(gym|run|lift|workout|move|training)\b/i.test(t);
  const hasMood = /\b(happy|calm|good|better|peace|ok)\b/i.test(t);

  let interpretation =
    "You seem to do best when there’s something real to move toward, not just vague activity.";

  if (hasEffort && hasMovement) {
    interpretation =
      "You seem to come alive when effort turns into momentum and you can feel progress happening.";
  } else if (hasEffort) {
    interpretation =
      "You seem to trust effort more than hype. Progress matters when it feels earned.";
  } else if (hasMovement) {
    interpretation =
      "You seem to think more clearly once things are in motion. Movement creates clarity for you.";
  } else if (hasMood) {
    interpretation =
      "Your energy seems tied to what your days actually contain, not just what you say you want.";
  }

  let extra: string | undefined;
  if (confidence >= 0.78) {
    if (lane === "high_school") {
      extra =
        "That usually means you’ll respond better to real reps, real feedback, and real environments than abstract advice.";
    } else if (lane === "young_adult") {
      extra =
        "That usually means the best next moves will be the ones you can actually test in real life.";
    } else {
      extra =
        "That usually means Everleap should point you toward things you can try, build, or act on — not just think about.";
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

  const candidates: Array<{
    id: string;
    cat: RecommendedNext;
    answer: string;
    score: number;
  }> = [];

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
  const { interpretation } = interpretAnswer({
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
  };
}

/* =============================================================================
   Coach copy helpers
   ============================================================================= */

type NarrativeMode = "welcome_new" | "in_progress" | "complete_signals";

function certaintyLine(certainty?: OnboardingV4["certainty"]) {
  if (certainty === "strong") {
    return "You already sound pretty clear on what you want.";
  }
  if (certainty === "kinda") {
    return "You’ve got signal already. Now it needs shape.";
  }
  if (certainty === "no_clue") {
    return "That is fine. Everleap works best when the signal comes first and the answer comes later.";
  }
  return "";
}

function nextWhy(next: RecommendedNext) {
  if (next === "motivations") {
    return "That is where we get a clearer read on what pulls you in and what quietly drains you.";
  }
  if (next === "strengths") {
    return "That is where your natural pattern starts to look more solid and usable.";
  }
  return "That is where direction starts turning into something you can actually build.";
}

function primaryCtaLabel(next: RecommendedNext, allComplete: boolean) {
  return allComplete ? "Open Insights" : `Continue to ${labelForNext(next)}`;
}

function sectionEyebrowClass(dark: boolean) {
  return [
    "text-[10px] font-semibold uppercase tracking-[0.24em]",
    dark ? "text-white/46" : "text-slate-500",
  ].join(" ");
}

function sectionEyebrowRowClass() {
  return "inline-flex items-center gap-2";
}

function signalsIconClass(dark: boolean) {
  return dark ? "text-sky-200/80" : "text-sky-700";
}

function sectionTitleClass(dark: boolean) {
  return [
    "mt-2 text-[1.05rem] font-semibold tracking-[-0.01em] sm:text-[1.18rem]",
    dark ? "text-white" : "text-slate-950",
  ].join(" ");
}

function sectionBodyClass(dark: boolean) {
  return [
    "mt-2 max-w-[38rem] text-[14px] leading-6 sm:text-[15px] sm:leading-7",
    dark ? "text-white/66" : "text-slate-700",
  ].join(" ");
}

function sectionSpacing() {
  return "mt-5 sm:mt-7 lg:mt-9";
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [themeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel] = React.useState<GradientLevel>(3);
  void gradientLevel;

  const dark = isDarkTheme(themeId);
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

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

  React.useEffect(() => {
    setMounted(true);
    setVm(buildTodayViewModel());

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduce = !!mq?.matches;
    setMotionEnabled(!reduce);

    const onChange = () => {
      setMotionEnabled(
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
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

    const already =
      window.sessionStorage.getItem(JUST_LOGGED_IN_SESSION_KEY) === "1";

    if (!already) {
      try {
        window.sessionStorage.setItem(JUST_LOGGED_IN_SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }

    router.replace("/main");
  }, [router, searchParams]);

  const progress = mounted
    ? vm.progress
    : { motivationsAnswered: 0, strengthsAnswered: 0, skillsAnswered: 0 };

  const motAnswered = progress.motivationsAnswered ?? 0;
  const strAnswered = progress.strengthsAnswered ?? 0;
  const sklAnswered = progress.skillsAnswered ?? 0;

  const isZeroState =
    motAnswered === 0 && strAnswered === 0 && sklAnswered === 0;

  const motComplete = motAnswered >= SIGNAL_COMPLETE_COUNT;
  const strComplete = strAnswered >= SIGNAL_COMPLETE_COUNT;
  const sklComplete = sklAnswered >= SIGNAL_COMPLETE_COUNT;

  const allSignalsComplete = motComplete && strComplete && sklComplete;

  const recommendedNext: RecommendedNext = !motComplete
    ? "motivations"
    : !strComplete
      ? "strengths"
      : "skills";

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
  const sourceLabel = mounted ? inferSourceLabel(searchParams) : null;

  const onboarding = mounted ? readOnboardingV4() : {};
  const signal = mounted ? pickBestSignal() : null;

  const hasAnyProgress = motAnswered > 0 || strAnswered > 0 || sklAnswered > 0;
  const hasOnboarded = mounted ? !!(onboarding.name || vm.snapshot) : false;

  const mode: NarrativeMode = allSignalsComplete
    ? "complete_signals"
    : hasOnboarded && !hasAnyProgress && !signal
      ? "welcome_new"
      : "in_progress";

  const sourceSentence = sourceLabel
    ? `You just came from ${sourceLabel}.`
    : "You’re back on your home base.";

  const paragraphs: React.ReactNode[] = React.useMemo(() => {
    if (!mounted) return [];

    if (isZeroState) {
      return [
        <>
          You don’t need a clear answer yet — that’s not how this works. Everleap
          uses a science-based system to turn small signals — what pulls you in,
          what drains you, and how you operate — into clear, usable direction. We
          start by understanding your motivations, strengths, and skills, then
          connect them into patterns and real paths you can actually explore. It
          starts with a few simple questions.
        </>,
      ];
    }

    const next = recommendedNext;
    const welcome = `${openingLine(name)} — welcome back.`;

    if (mode === "complete_signals") {
      return [
        <>
          {welcome} The picture is starting to hold. Your <SignalWord>signals</SignalWord>{" "}
          are no longer scattered inputs — they are beginning to read like a real pattern.
          What pulls you in, how you operate, and what you can build now line up enough
          for Everleap to read with more confidence. That makes the next step cleaner.
        </>,
      ];
    }

    if (mode === "welcome_new") {
      const certainty = certaintyLine(onboarding.certainty);

      return [
        <>
          {welcome} This is your home base — the place where early <SignalWord>signal</SignalWord>{" "}
          starts turning into direction. You do not need a polished answer yet.{" "}
          {certainty ? `${certainty} ` : ""}
          Start with {labelForNext(next)} and let the pattern build from there.
        </>,
      ];
    }

    const stateRead = signal?.interpretation ? `${signal.interpretation} ` : "";

    return [
      <>
        {welcome} {sourceSentence} You already have the beginning of a pattern. {stateRead}
        The clearest move now is to finish {labelForNext(next)}. {nextWhy(next)}
      </>,
    ];
  }, [
    mounted,
    isZeroState,
    mode,
    name,
    sourceSentence,
    recommendedNext,
    onboarding.certainty,
    signal,
  ]);

  const ctaLabel = React.useMemo(() => {
    if (!mounted) return undefined;
    if (isZeroState) return "Start with a few questions";
    if (allSignalsComplete) return "Open Insights";
    return primaryCtaLabel(recommendedNext, allSignalsComplete);
  }, [mounted, isZeroState, recommendedNext, allSignalsComplete]);

  const nextStepsPageId = allSignalsComplete
    ? "main.home.complete"
    : recommendedNext === "motivations"
      ? "main.home.need_motivations"
      : recommendedNext === "strengths"
        ? "main.home.need_strengths"
        : "main.home.need_skills";

  const nextStepsDefinition = React.useMemo(() => {
    return (
      getNextStepsDefinition(nextStepsPageId) ??
      getNextStepsDefinition("insights.summary")
    );
  }, [nextStepsPageId]);

  const signalsIntro = allSignalsComplete
    ? "The map is far enough along now that Everleap can read the pattern instead of isolated fragments."
    : "These are the first clear signs taking shape underneath your answers. As they sharpen, the guidance gets more specific and more like you.";

  return (
    <>
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

      <div className="relative flex min-h-[100svh] flex-col">
        <main className={`relative z-10 flex-1 ${pagePadding()}`}>
          <div className={pageShell()}>
            <section className="relative">
              <div className="pointer-events-none absolute inset-x-[-1rem] top-[-1rem] bottom-[-1.25rem] z-0 sm:inset-x-[-1.25rem] sm:top-[-1.25rem] sm:bottom-[-1.5rem]">
                <div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/22 to-transparent backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.22),transparent_58%)]" />
              </div>

              <motion.div
                aria-hidden
                className="pointer-events-none absolute right-2 top-1 z-[1] h-20 w-20 rounded-full sm:right-4 sm:top-3 sm:h-24 sm:w-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: presenceSoft ? 0.12 : 0.18 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className={`h-full w-full rounded-full ${orbGlowClass} blur-[14px]`}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <div className="relative z-10">
                <TodayIntro
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  quote={mounted ? vm.quote : undefined}
                  paragraphs={paragraphs}
                  primaryCtaLabel={ctaLabel}
                  onPrimary={() => {
                    if (isZeroState) {
                      void fadeThen(async () =>
                        router.push(buildQuestionsHref("motivations"))
                      );
                      return;
                    }

                    if (allSignalsComplete) {
                      void fadeThen(async () => router.push("/main/insights"));
                      return;
                    }

                    void fadeThen(async () =>
                      router.push(buildQuestionsHref(recommendedNext))
                    );
                  }}
                />
              </div>
            </section>

            {!isZeroState && (
              <>
                <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent sm:my-7" />

                <section className={sectionSpacing()}>
                  <div className={sectionEyebrowRowClass()}>
                    <Activity className={`h-3.5 w-3.5 ${signalsIconClass(dark)}`} aria-hidden />
                    <div className={sectionEyebrowClass(dark)}>Signals</div>
                  </div>

                  <h2 className={sectionTitleClass(dark)}>What’s starting to take shape</h2>
                  <p className={sectionBodyClass(dark)}>{signalsIntro}</p>

                  <div className="mt-4 sm:mt-5">
                    <SignalsCard
                      dark={dark}
                      progress={vm.progress}
                      nextKey={vm.nextKey}
                    />
                  </div>
                </section>
              </>
            )}

            <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent sm:my-7" />

            <section className={sectionSpacing()}>
              {nextStepsDefinition ? (
                <NextStepsStack
                  dark={dark}
                  useLocal={mounted}
                  definition={nextStepsDefinition}
                  variant="embedded"
                  collapsible={false}
                  defaultOpen
                />
              ) : null}
            </section>

            <div className="h-6 sm:h-8" />
          </div>
        </main>
      </div>
    </>
  );
}