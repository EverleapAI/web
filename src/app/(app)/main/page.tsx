"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  isDarkTheme,
  type SpotlightThemeId,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";
import { TinyTaskCard } from "./components/nextSteps/TinyTaskCard";
import { ActionCard } from "./components/nextSteps/ActionCard";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";
import { SectionCard } from "./components/ui/SectionCard";

const SIGNAL_COMPLETE_COUNT = 5;
const STORAGE_KEY_V3 = "everleap.story.answers.v3";

type Category = RecommendedNext;
type Saved = { answer?: string; skipped?: boolean };

function pagePadding() {
  return "pb-24 pt-1 sm:pt-1.5 lg:pt-2";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-2.5 sm:px-4 md:px-5 lg:px-6";
}

function sectionSpacing() {
  return "mt-4 sm:mt-5";
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

function getNextUnansweredTarget(): {
  cat: Category;
  questionId: string;
} {
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

  const [vm, setVm] = React.useState<any>(null);
  const [mounted, setMounted] = React.useState(false);
  const [motionEnabled] = React.useState(true);
  const [transitioning] = React.useState(false);

  React.useEffect(() => {
    const nextVm = buildTodayViewModel();
    setVm(nextVm);
    setMounted(true);
  }, []);

  const progress = vm?.progress ?? {
    motivationsAnswered: 0,
    strengthsAnswered: 0,
    skillsAnswered: 0,
    motivationsTotal: SIGNAL_COMPLETE_COUNT,
    strengthsTotal: SIGNAL_COMPLETE_COUNT,
    skillsTotal: SIGNAL_COMPLETE_COUNT,
  };

  const motAnswered = progress?.motivationsAnswered ?? 0;
  const strAnswered = progress?.strengthsAnswered ?? 0;
  const sklAnswered = progress?.skillsAnswered ?? 0;

  const isZeroState =
    mounted &&
    motAnswered === 0 &&
    strAnswered === 0 &&
    sklAnswered === 0;

  const allSignalsComplete =
    mounted &&
    motAnswered >= SIGNAL_COMPLETE_COUNT &&
    strAnswered >= SIGNAL_COMPLETE_COUNT &&
    sklAnswered >= SIGNAL_COMPLETE_COUNT;

  const nextTarget = React.useMemo(
    () => (
      mounted
        ? getNextUnansweredTarget()
        : { cat: "motivations" as const, questionId: "motivations_1" }
    ),
    [mounted, vm]
  );

  const recommendedNext: RecommendedNext = nextTarget.cat;
  const nextCategoryLabel = labelForCategory(recommendedNext);

  const nextSteps = React.useMemo(
    () => getNextStepsDefinition("main.home.need_motivations"),
    []
  );

  const introTitle = React.useMemo(() => {
    if (isZeroState) return "Let’s start building your direction";
    if (allSignalsComplete) return "Your direction is starting to take shape";
    return "We need a bit more to go on";
  }, [isZeroState, allSignalsComplete]);

  const introBody = React.useMemo(() => {
    if (isZeroState) {
      return "You don’t need a clear answer yet — that’s not how this works. Everleap uses a science-based system to turn small signals into clear, usable direction. We start with motivations, strengths, and skills, then connect them into patterns and real paths you can actually explore.";
    }

    if (allSignalsComplete) {
      return "You’ve now given Everleap enough signal across motivations, strengths, and skills to start turning those patterns into clearer ideas about what may fit.";
    }

    return `You still have a few questions to answer before Everleap can give you ideas that actually fit. Everleap looks for patterns in what pulls you in, what drains you, and how you think — those patterns become your signals. The clearest next move is to continue ${nextCategoryLabel} and pick up at the first question in that section you have not answered yet.`;
  }, [isZeroState, allSignalsComplete, nextCategoryLabel]);

  const ctaLabel = !mounted
    ? ""
    : isZeroState
      ? "Start with a few questions"
      : allSignalsComplete
        ? "Open Insights"
        : `Continue to ${nextCategoryLabel}`;

  function handlePrimary() {
    if (!mounted) return;

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
            <section className="relative pt-4 sm:pt-5">
              <SectionCard tone="hero" className="px-4 py-5 sm:px-5 sm:py-5">
                <TodayIntro
                  title={introTitle || "Let’s start building your direction"}
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  body={
                    introBody ||
                    "You don’t need a clear answer yet — that’s not how this works. Everleap uses a science-based system to turn small signals into clear, usable direction. We start with motivations, strengths, and skills, then connect them into patterns and real paths you can actually explore."
                  }
                  primaryCtaLabel={ctaLabel || "Start with a few questions"}
                  onPrimary={handlePrimary}
                />
              </SectionCard>
            </section>

            <section className={sectionSpacing()}>
              <SectionCard tone="plum" compact>
                <SignalsCard
                  dark={dark}
                  progress={progress}
                  nextKey={recommendedNext}
                />
              </SectionCard>
            </section>

            <section className={sectionSpacing()}>
              <SectionCard tone="teal" compact>
                <TinyTaskCard
                  dark={dark}
                  useLocal={mounted}
                  definition={nextSteps.tinyTask}
                />
              </SectionCard>
            </section>

            <section className={sectionSpacing()}>
              <SectionCard tone="amber" compact>
                <ActionCard
                  dark={dark}
                  useLocal={mounted}
                  definition={nextSteps.action}
                />
              </SectionCard>
            </section>

            <div className="h-6 sm:h-8" />
          </div>
        </main>
      </div>
    </>
  );
}