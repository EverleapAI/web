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
   Constants
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Utils
   ============================================================================= */

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pagePadding() {
  return "pb-24 pt-3 sm:pt-4 lg:pt-5";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-4 sm:px-5 md:px-6 lg:px-7";
}

function sectionSpacing() {
  return "mt-6 sm:mt-8 lg:mt-10";
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
      ? String((theme as any).orbGlowClass ?? "")
      : dark
        ? "bg-sky-400/25"
        : "bg-amber-300/30";

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
  }, []);

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
    await sleep(200);
    await fn();
    await sleep(120);
    setTransitioning(false);
  };

  const paragraphs: React.ReactNode[] = React.useMemo(() => {
    if (!mounted) return [];

    if (isZeroState) {
      return [
        <>
          You don’t need a clear answer yet — that’s not how this works. Everleap uses a science-based system to turn small signals — what pulls you in, what drains you, and how you operate — into clear, usable direction. We start by understanding your motivations, strengths, and skills, then connect them into patterns and real paths you can actually explore. It starts with a few simple questions.
        </>,
      ];
    }

    return [
      <>
        You already have the beginning of a pattern. The clearest move now is to continue and build it.
      </>,
    ];
  }, [mounted, isZeroState]);

  const ctaLabel = isZeroState
    ? "Start with a few questions"
    : allSignalsComplete
      ? "Open Insights"
      : "Continue";

  return (
    <>
      <div className="relative flex min-h-[100svh] flex-col">
        <main className={`relative z-10 flex-1 ${pagePadding()}`}>
          <div className={pageShell()}>

            <section className="relative">

              {/* 🔥 OVERLAY FIX */}
              <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.35),transparent_60%)]" />
              </div>

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
                      void fadeThen(async () =>
                        router.push("/main/insights")
                      );
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
                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent sm:my-8" />

                <section className={sectionSpacing()}>
                  <SignalsCard
                    dark={dark}
                    progress={vm.progress}
                    nextKey={vm.nextKey}
                  />
                </section>
              </>
            )}

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent sm:my-8" />

            <section className={sectionSpacing()}>
              <NextStepsStack
                dark={dark}
                useLocal={mounted}
                definition={getNextStepsDefinition("main.home.need_motivations")}
                variant="embedded"
                collapsible={false}
                defaultOpen
              />
            </section>

            <div className="h-6 sm:h-8" />
          </div>
        </main>
      </div>
    </>
  );
}