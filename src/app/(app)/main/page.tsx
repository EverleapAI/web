// src/app/(app)/main/page.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";
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
  return n ? `Hey ${n}.` : "Welcome to Everleap.";
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
   Coach copy helpers
   ============================================================================= */

type NarrativeMode = "welcome_new" | "in_progress" | "complete_signals";

function certaintyLine(certainty?: OnboardingV4["certainty"]) {
  if (certainty === "strong") {
    return "You already sound pretty clear on what you want. Now the point is to make that usable inside the platform.";
  }
  if (certainty === "kinda") {
    return "You’ve got signal already. The point now is to sharpen it until the next moves feel more obvious.";
  }
  if (certainty === "no_clue") {
    return "That’s okay. Everleap is built for finding signal before forcing a big answer.";
  }
  return "";
}

function nextWhy(next: RecommendedNext) {
  if (next === "motivations") {
    return "Motivations shows what actually pulls you forward and what tends to drain you.";
  }
  if (next === "strengths") {
    return "Strengths shows how you naturally operate when things are working.";
  }
  return "Skills turns self-knowledge into something more concrete, trainable, and usable.";
}

function primaryCtaLabel(next: RecommendedNext, allComplete: boolean) {
  return allComplete ? "Go to Insights" : `Continue to ${labelForNext(next)}`;
}

function sectionKicker(dark: boolean) {
  return [
    "text-[12px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-600",
  ].join(" ");
}

function mutedText(dark: boolean) {
  return dark ? "text-white/65" : "text-slate-600";
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
  const [justLoggedIn, setJustLoggedIn] = React.useState(false);

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
      setJustLoggedIn(true);
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
  const open = openingLine(name);

  const onboarding = mounted ? readOnboardingV4() : {};
  const signal = mounted ? pickBestSignal() : null;

  const hasAnyProgress = motAnswered > 0 || strAnswered > 0 || sklAnswered > 0;
  const hasOnboarded = mounted ? !!(onboarding.name || vm.snapshot) : false;

  const mode: NarrativeMode = allSignalsComplete
    ? "complete_signals"
    : hasOnboarded && !hasAnyProgress && !signal
      ? "welcome_new"
      : "in_progress";

  const loginLine = "Alright — you’re in. Let’s pick up where you left off.";

  const paragraphs: string[] = React.useMemo(() => {
    if (!mounted) return [];

    const next = recommendedNext;
    const certainty = certaintyLine(onboarding.certainty);
    const lines: string[] = [open];

    if (justLoggedIn) lines.push(loginLine);

    if (mode === "complete_signals") {
      lines.push(
        "Your foundation is in. Motivations, Strengths, and Skills are all complete — which means Everleap can stop asking who you might be and start showing you what fits."
      );

      lines.push(
        "This is where the platform opens up. Insights helps you read deeper patterns. Explore helps you test directions and possibilities. Careers, Community, and Hobbies help turn that signal into real life."
      );

      if (signal?.interpretation) {
        lines.push(signal.interpretation);
      } else {
        lines.push(
          "You’re not here to collect labels. You’re here to find directions that feel real."
        );
      }

      lines.push("Best next step: go to Insights and start connecting the dots.");
      return lines.filter(Boolean).slice(0, 4);
    }

    if (mode === "welcome_new") {
      lines.push("Welcome to Everleap.");

      lines.push(
        "This is where we start building your map — what drives you, how you move through the world, and what kinds of futures may actually fit."
      );

      lines.push(
        "The first step is simple: give the platform real signal. Once that foundation is in, the rest of Everleap gets sharper, more personal, and more useful."
      );

      if (certainty) {
        lines.push(certainty);
      } else {
        lines.push(`Best next step: start with ${labelForNext(next)}.`);
      }

      return lines.filter(Boolean).slice(0, 4);
    }

    lines.push("Your map is underway.");

    lines.push(
      "Everleap works best when the foundation is real: Motivations shows what pulls you, Strengths shows how you naturally operate, and Skills shows what wants to be built."
    );

    if (signal?.interpretation) {
      lines.push(signal.interpretation);
    } else {
      lines.push(
        `Best next step: finish ${labelForNext(next)}. ${nextWhy(next)}`
      );
    }

    lines.push(
      `Best next step: finish ${labelForNext(next)} so the rest of the platform gets more specific — and less generic.`
    );

    return lines.filter(Boolean).slice(0, 4);
  }, [
    mounted,
    mode,
    open,
    recommendedNext,
    onboarding.certainty,
    signal,
    justLoggedIn,
  ]);

  const ctaLabel = React.useMemo(() => {
    if (!mounted) return undefined;
    return primaryCtaLabel(recommendedNext, allSignalsComplete);
  }, [mounted, recommendedNext, allSignalsComplete]);

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
            <div
              className={dark ? "h-full w-full bg-black" : "h-full w-full bg-white"}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pt-8">
          <section className="relative">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: presenceSoft ? 0.1 : 0.22 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={`h-full w-full rounded-full ${orbGlowClass} blur-[10px]`}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(251,191,36,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_48%)]" />

              <div className="relative">
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
                    void fadeThen(async () =>
                      router.push(buildQuestionsHref(recommendedNext))
                    );
                  }}
                />
              </div>
            </div>
          </section>

          {!allSignalsComplete ? (
            <section className="mt-8">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_20px_64px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6 sm:py-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_0%,rgba(96,165,250,0.10),transparent_22%),radial-gradient(circle_at_14%_100%,rgba(167,139,250,0.08),transparent_26%)]" />
                <div className="relative">
                  <div className={sectionKicker(dark)}>Build Your Map</div>
                  <div
                    className={[
                      "mt-2 text-[14px] leading-relaxed",
                      mutedText(dark),
                    ].join(" ")}
                  >
                    Finish the foundation first. The more complete this gets, the more
                    specific Everleap can be.
                  </div>

                  <div className="mt-5">
                    <SignalsCard
                      dark={dark}
                      progress={vm.progress}
                      nextKey={vm.nextKey}
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="mt-8">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_20px_64px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6 sm:py-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(251,191,36,0.10),transparent_22%),radial-gradient(circle_at_88%_100%,rgba(236,72,153,0.06),transparent_24%)]" />
              <div className="relative">
                <div className={sectionKicker(dark)}>Next Steps</div>
                <div
                  className={[
                    "mt-2 text-[14px] leading-relaxed",
                    mutedText(dark),
                  ].join(" ")}
                >
                  {allSignalsComplete
                    ? "One real move. Small is fine. Real is the point."
                    : "Finish the map, then make one real move with it."}
                </div>

                {nextStepsDefinition ? (
                  <div className="mt-5">
                    <NextStepsStack
                      dark={dark}
                      useLocal={mounted}
                      definition={nextStepsDefinition}
                      variant="embedded"
                      collapsible={false}
                      defaultOpen
                    />
                  </div>
                ) : (
                  <div
                    className={[
                      "mt-5 text-[15px] leading-relaxed",
                      mutedText(dark),
                    ].join(" ")}
                  >
                    Next steps are loading…
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="h-3" />
        </main>
      </div>
    </>
  );
}