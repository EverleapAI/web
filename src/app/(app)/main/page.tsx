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
import { NextStepsStack } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";

const SIGNAL_COMPLETE_COUNT = 5;

function pagePadding() {
  return "pb-24 pt-1.5 sm:pt-2 lg:pt-3";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-4 sm:px-5 md:px-6 lg:px-7";
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

  const hasVm = vm !== null;

  const progress = vm?.progress;

  const motAnswered = progress?.motivationsAnswered ?? 0;
  const strAnswered = progress?.strengthsAnswered ?? 0;
  const sklAnswered = progress?.skillsAnswered ?? 0;

  const isZeroState =
    hasVm &&
    motAnswered === 0 &&
    strAnswered === 0 &&
    sklAnswered === 0;

  const allSignalsComplete =
    hasVm &&
    motAnswered >= SIGNAL_COMPLETE_COUNT &&
    strAnswered >= SIGNAL_COMPLETE_COUNT &&
    sklAnswered >= SIGNAL_COMPLETE_COUNT;

  const recommendedNext: RecommendedNext =
    motAnswered < SIGNAL_COMPLETE_COUNT
      ? "motivations"
      : strAnswered < SIGNAL_COMPLETE_COUNT
        ? "strengths"
        : "skills";

  const introTitle = React.useMemo(() => {
    if (!hasVm) return "What’s starting to come into focus";
    if (isZeroState) return "Let’s start building your direction";
    if (allSignalsComplete) return "Your direction is starting to take shape";
    return "What’s starting to come into focus";
  }, [hasVm, isZeroState, allSignalsComplete]);

  const introBody = React.useMemo(() => {
    if (!hasVm) {
      return "You’ve already helped Everleap understand your motivations, strengths, and skills, so Insights is where those signals can start turning into a clearer picture of who you are and what may fit.";
    }

    if (isZeroState) {
      return "You don’t need a clear answer yet — that’s not how this works. Everleap uses a science-based system to turn small signals — what pulls you in, what drains you, and how you operate — into clear, usable direction. We start by understanding your motivations, strengths, and skills, then connect them into patterns and real paths you can actually explore. It starts with a few simple questions.";
    }

    return "You’ve already helped Everleap understand your motivations, strengths, and skills, so Insights is where those signals can start turning into a clearer picture of who you are and what may fit.";
  }, [hasVm, isZeroState]);

  const ctaLabel = !hasVm
    ? "Continue"
    : isZeroState
      ? "Start with a few questions"
      : allSignalsComplete
        ? "Open Insights"
        : "Continue";

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
            <section className="relative">
              <div className="pointer-events-none absolute right-3 top-3 h-14 w-14 rounded-full opacity-[0.06]">
                <div className="h-full w-full rounded-full bg-sky-300/30" />
              </div>

              <div className="relative z-10">
                <TodayIntro
                  title={introTitle}
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  body={introBody}
                  primaryCtaLabel={ctaLabel}
                  onPrimary={() => {
                    if (!hasVm) {
                      router.push("/main/insights");
                      return;
                    }

                    if (isZeroState) {
                      router.push("/main/questions?cat=motivations&returnTo=/main");
                      return;
                    }

                    if (allSignalsComplete) {
                      router.push("/main/insights");
                      return;
                    }

                    router.push(
                      `/main/questions?cat=${recommendedNext}&returnTo=/main`
                    );
                  }}
                />
              </div>
            </section>

            <section className="mt-6 sm:mt-8">
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