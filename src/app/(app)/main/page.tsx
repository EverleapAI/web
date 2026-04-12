"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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
  return "pb-24 pt-1 sm:pt-1.5 lg:pt-2";
}

function pageShell() {
  return "mx-auto w-full max-w-[52rem] px-4 sm:px-5 md:px-6 lg:px-7";
}

function introCtaClass(dark: boolean) {
  return [
    "group inline-flex items-center gap-2",
    "text-[1.02rem] font-medium transition",
    "sm:text-[1.05rem]",
    dark
      ? "text-white/80 hover:text-white/92"
      : "text-sky-700 hover:text-sky-900",
    "focus-visible:outline-none",
  ].join(" ");
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

  function handlePrimary() {
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
              <div className="pointer-events-none absolute right-2 top-2 h-14 w-14 rounded-full opacity-[0.025]">
                <div className="h-full w-full rounded-full bg-sky-300/20" />
              </div>

              <div className="relative z-10">
                <TodayIntro
                  title={introTitle}
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  body={introBody}
                />

                <div className="mt-4 sm:mt-5">
                  {motionEnabled ? (
                    <motion.button
                      type="button"
                      onClick={handlePrimary}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32, ease: "easeOut" }}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.995 }}
                      className={introCtaClass(dark)}
                    >
                      <span>{ctaLabel}</span>
                      <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrimary}
                      className={introCtaClass(dark)}
                    >
                      <span>{ctaLabel}</span>
                      <ChevronRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-[3px]" />
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 border-t border-white/6 pt-4 sm:mt-7 sm:pt-5">
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