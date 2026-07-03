"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  isDarkTheme,
  type SpotlightThemeId,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TinyTaskCard } from "./components/nextSteps/TinyTaskCard";
import { TodayTinyTaskCard } from "./components/nextSteps/TodayTinyTaskCard";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";
import { SectionCard } from "./components/ui/SectionCard";
import { TodayCard } from "./components/today";

const SIGNAL_COMPLETE_COUNT = 5;
const STORAGE_KEY_V3 = "everleap.story.answers.v3";
const ONBOARDING_STORAGE_KEY = "everleap_onboarding_answers";
const ONBOARDING_SNAPSHOT_KEY = "everleapOnboarding_v4_convo_min";

type Category = "motivations" | "strengths" | "skills";
type Saved = { answer?: string; skipped?: boolean };
type TodayViewModel = ReturnType<typeof buildTodayViewModel>;

type TodayMicroTask = {
  id: string;
  question: string;
  options: string[];
  signal_key: string;
  selected_option: string | null;
  selected_option_index: number | null;
};

type StoryProgress = {
  answered: number;
  total: number;
  percent: number;
};

type TodayGuidance = {
  headline: string;
  reflection?: string | null;
  observation?: string | null;
  next_step?: string | null;
  guidance_text?: string | null;
  next_action_label: string;
  next_action_route: string;
  tiny_tasks?: TodayMicroTask[];
  story_progress?: StoryProgress | null;
};

function pagePadding() {
  return "pt-2 pb-5";
}

function pageShell() {
  return "mx-auto w-full max-w-[720px] px-[4px]";
}

function labelForCategory(cat: Category) {
  return cat === "motivations"
    ? "Motivations"
    : cat === "strengths"
      ? "Strengths"
      : "Skills";
}

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    return parsed as Record<string, Saved>;
  } catch {
    return {};
  }
}

function isAnswered(saved: Saved | undefined): boolean {
  if (!saved) return false;
  if (saved.skipped) return true;

  return typeof saved.answer === "string" && saved.answer.trim().length > 0;
}

function getNextUnansweredTarget(): { cat: Category; questionId: string } {
  const saved = loadSaved();
  const order: Category[] = ["motivations", "strengths", "skills"];

  for (const cat of order) {
    for (let i = 1; i <= SIGNAL_COMPLETE_COUNT; i += 1) {
      const questionId = `${cat}_${i}`;

      if (!isAnswered(saved[questionId])) {
        return { cat, questionId };
      }
    }
  }

  return { cat: "motivations", questionId: "motivations_1" };
}

export default function MainHomePage() {
  const router = useRouter();

  const [themeId] = React.useState<SpotlightThemeId>("nightDusk");
  const dark = isDarkTheme(themeId);

  const [vm, setVm] = React.useState<TodayViewModel | null>(null);
  const [todayGuidance, setTodayGuidance] =
    React.useState<TodayGuidance | null>(null);
  const [guidanceLoaded, setGuidanceLoaded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [motionEnabled] = React.useState(true);
  const [transitioning] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [generationGoal, setGenerationGoal] =
  React.useState<string | null>(null);

  React.useEffect(() => {
    async function claimOnboarding() {
      try {
        const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (!raw) return;

        const answers = JSON.parse(raw);
        if (!answers || Object.keys(answers).length === 0) return;

        const res = await fetch("/api/onboarding/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        });

        if (res.ok) {
          localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        }
      } catch {
        // Retry next load.
      }
    }

    claimOnboarding();
  }, []);

  React.useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/regauth/me", {
          cache: "no-store",
        });

        const data = await res.json();

        try {
          const guidanceRes = await fetch("/api/guidance/today", {
            cache: "no-store",
          });

          const guidanceData = await guidanceRes.json();
          setIsUpdating(guidanceData?.is_updating === true);
          setGenerationGoal(
         guidanceData?.generation_goal ?? null
          );

          if (!alive) return;

          if (guidanceData?.ok && guidanceData?.guidance) {
            setTodayGuidance(guidanceData.guidance);
          }
        } catch {
          // Fall back to existing Today content.
        } finally {
          if (alive) {
            setGuidanceLoaded(true);
          }
        }

        if (!alive) return;

        if (data?.ok) {
          try {
            const existing = localStorage.getItem(ONBOARDING_SNAPSHOT_KEY);

            if (!existing) {
              const snapshot = {
                name: data.user?.email?.split("@")[0] ?? null,
                zip_code: data.user?.zip_code ?? null,
              };

              localStorage.setItem(
                ONBOARDING_SNAPSHOT_KEY,
                JSON.stringify(snapshot)
              );
            }
          } catch {
            // Ignore local snapshot bridge failures.
          }
        }

        const nextVm = buildTodayViewModel();
        setVm(nextVm);
        setMounted(true);
      } catch {
        if (!alive) return;

        const nextVm = buildTodayViewModel();
        setVm(nextVm);
        setMounted(true);
        setGuidanceLoaded(true);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const nextTarget = React.useMemo(
    () =>
      mounted
        ? getNextUnansweredTarget()
        : { cat: "motivations" as const, questionId: "motivations_1" },
    [mounted]
  );

  const nextCategoryLabel = labelForCategory(nextTarget.cat);

  const nextSteps = React.useMemo(
    () => getNextStepsDefinition("main.home.need_motivations"),
    []
  );

  const progress = vm?.progress;

  const allSignalsComplete =
    mounted &&
    (progress?.motivationsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress?.strengthsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress?.skillsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT;

  const fallbackCtaLabel = allSignalsComplete
    ? "Open Insights"
    : `Continue to ${nextCategoryLabel}`;

  const ctaLabel = todayGuidance?.next_action_label ?? fallbackCtaLabel;
  const ctaRoute = todayGuidance?.next_action_route ?? null;

  const storyPercent = todayGuidance?.story_progress?.percent ?? 0;

  function handlePrimary() {
    if (!mounted) return;

    if (ctaRoute) {
      router.push(ctaRoute);
      return;
    }

    if (allSignalsComplete) {
      router.push("/main/insights");
      return;
    }

    const target = getNextUnansweredTarget();

    router.push(
      `/main/questions?cat=${target.cat}&questionId=${target.questionId}&returnTo=/main`
    );
  }

  return (
    <>
      <AnimatePresence>
        {transitioning && motionEnabled ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>

      <div className="flex min-h-[100svh] flex-col">
        <main className={`${pagePadding()} flex-1`}>
          <div className={pageShell()}>
            <section>
              <SectionCard tone="hero" className="px-4 py-5">
                {guidanceLoaded ? (
                  <TodayCard
                    headline={todayGuidance?.headline}
                    reflection={todayGuidance?.reflection}
                    observation={todayGuidance?.observation}
                    nextStep={todayGuidance?.next_step}
                    guidanceText={todayGuidance?.guidance_text}
                    ctaLabel={ctaLabel}
                    onPrimary={handlePrimary}
                  />
                ) : (
                  <div className="min-h-[330px]" />
                )}
              </SectionCard>
              {isUpdating ? (
  <section className="mt-4 px-4">

    <div className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3">

      <div className="flex items-center gap-2">

        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />

        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
          Still looking at this
        </div>

      </div>

      <p className="mt-2 text-[14px] leading-6 text-white/56">

        {generationGoal ??
          "Some of your recent answers may change what I think is most useful to explore next."}

      </p>

    </div>

  </section>
) : null}
            </section>

            <section className="mt-5 px-4">
              {guidanceLoaded && todayGuidance?.tiny_tasks?.length ? (
                <TodayTinyTaskCard
                  dark={dark}
                  tasks={todayGuidance.tiny_tasks}
                />
              ) : (
                <TinyTaskCard
                  dark={dark}
                  useLocal={mounted}
                  definition={nextSteps.tinyTask}
                />
              )}
            </section>

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/main/ai-lab")}
                className="text-[12px] font-medium text-white/34 transition hover:text-cyan-200"
              >
                Open AI Lab
              </button>

              <span className="text-white/16">•</span>

              <button
                type="button"
                onClick={() => router.push("/main/reset-answers")}
                className="text-[12px] font-medium text-white/30 transition hover:text-cyan-200"
              >
                Reset Answers
              </button>
            </div>

            <div className="h-4" />
          </div>
        </main>
      </div>
    </>
  );
}