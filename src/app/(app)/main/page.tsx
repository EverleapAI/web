"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

import {
  isDarkTheme,
  type SpotlightThemeId,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";
import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";

/* =============================================================================
   Constants
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Layout helpers
   ============================================================================= */

function pagePadding() {
  return "pb-24 pt-3 sm:pt-4 lg:pt-5";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-4 sm:px-5 md:px-6 lg:px-7";
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ----------------------------------------------------------------------------
   Theme
   ---------------------------------------------------------------------------- */

  const [themeId] = React.useState<SpotlightThemeId>("nightDusk");
  const dark = isDarkTheme(themeId);

  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const orbGlowClass =
    (theme as { orbGlowClass?: string }).orbGlowClass ??
    (dark ? "bg-sky-400/25" : "bg-amber-300/30");

  /* ----------------------------------------------------------------------------
   State
   ---------------------------------------------------------------------------- */

  const [presenceSoft, setPresenceSoft] = React.useState(false);
  const [vm, setVm] = React.useState<any>(null);
  const [mounted, setMounted] = React.useState(false);
  const [motionEnabled] = React.useState(true);
  const [transitioning] = React.useState(false);

  /* ----------------------------------------------------------------------------
   Effects
   ---------------------------------------------------------------------------- */

  React.useEffect(() => {
    setMounted(true);
    setVm(buildTodayViewModel());
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 8) setPresenceSoft(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ----------------------------------------------------------------------------
   Progress
   ---------------------------------------------------------------------------- */

  const progress = vm?.progress ?? {
    motivationsAnswered: 0,
    strengthsAnswered: 0,
    skillsAnswered: 0,
  };

  const motAnswered = progress.motivationsAnswered ?? 0;
  const strAnswered = progress.strengthsAnswered ?? 0;
  const sklAnswered = progress.skillsAnswered ?? 0;

  const isZeroState =
    motAnswered === 0 && strAnswered === 0 && sklAnswered === 0;

  const allSignalsComplete =
    motAnswered >= SIGNAL_COMPLETE_COUNT &&
    strAnswered >= SIGNAL_COMPLETE_COUNT &&
    sklAnswered >= SIGNAL_COMPLETE_COUNT;

  const recommendedNext: RecommendedNext =
    motAnswered < SIGNAL_COMPLETE_COUNT
      ? "motivations"
      : strAnswered < SIGNAL_COMPLETE_COUNT
        ? "strengths"
        : "skills";

  /* ----------------------------------------------------------------------------
   Narrative
   ---------------------------------------------------------------------------- */

  const introTitle = React.useMemo(() => {
    if (!mounted) return "Let’s start building your direction";
    if (isZeroState) return "Let’s start building your direction";
    if (allSignalsComplete) return "Your direction is starting to take shape";
    return "What’s starting to come into focus";
  }, [mounted, isZeroState, allSignalsComplete]);

  const paragraphs = React.useMemo(() => {
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

    return [
      <>
        You’ve started giving Everleap something real to work with. The picture
        is still early, but patterns are beginning to form. Keep going and the
        guidance gets sharper.
      </>,
    ];
  }, [mounted, isZeroState]);

  const ctaLabel = isZeroState
    ? "Start with a few questions"
    : allSignalsComplete
      ? "Open Insights"
      : "Continue";

  /* ----------------------------------------------------------------------------
   Render
   ---------------------------------------------------------------------------- */

  return (
    <>
      <AnimatePresence>
        {transitioning && motionEnabled && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-[100svh] flex-col">
        <main className={`${pagePadding()} flex-1`}>
          <div className={pageShell()}>
            
            {/* INTRO */}
            <section className="relative overflow-x-clip">
              <div className="pointer-events-none absolute inset-x-0 top-[-1rem] bottom-[-2.5rem] z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/18 to-transparent backdrop-blur-[2px]" />
              </div>

              <motion.div
                className="pointer-events-none absolute right-2 top-1 h-20 w-20 rounded-full"
                animate={{ opacity: presenceSoft ? 0.12 : 0.18 }}
              >
                <div className={`h-full w-full rounded-full ${orbGlowClass} blur-[14px]`} />
              </motion.div>

              <div className="relative z-10">
                <TodayIntro
                  title={introTitle}
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  paragraphs={paragraphs}
                  primaryCtaLabel={ctaLabel}
                  onPrimary={() => {
                    if (isZeroState) {
                      router.push("/main/questions?cat=motivations&returnTo=/main");
                      return;
                    }

                    if (allSignalsComplete) {
                      router.push("/main/insights");
                      return;
                    }

                    router.push(`/main/questions?cat=${recommendedNext}&returnTo=/main`);
                  }}
                />
              </div>
            </section>

            {/* DIVIDER */}
            <div className="my-3.5 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent sm:my-5" />

            {/* NEXT STEPS */}
            <section>
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