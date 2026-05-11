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
const ONBOARDING_STORAGE_KEY = "everleap_onboarding_answers";
const ONBOARDING_SNAPSHOT_KEY = "everleapOnboarding_v4_convo_min";

type Category = RecommendedNext;
type Saved = { answer?: string; skipped?: boolean };
type TodayViewModel = ReturnType<typeof buildTodayViewModel>;

function pagePadding() {
  return "pt-2 pb-5";
}

function pageShell() {
  return "mx-auto w-full max-w-[720px] px-[4px]";
}

function sectionSpacing() {
  return "mt-3";
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

  const [vm, setVm] = React.useState<TodayViewModel | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [motionEnabled] = React.useState(true);
  const [transitioning] = React.useState(false);

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
        // retry next load
      }
    }

    claimOnboarding();
  }, []);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/regauth/me", { cache: "no-store" });
        const data = await res.json();

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
            // ignore local snapshot bridge failures
          }
        }

        const nextVm = buildTodayViewModel();
        setVm(nextVm);
        setMounted(true);
      } catch {
        const nextVm = buildTodayViewModel();
        setVm(nextVm);
        setMounted(true);
      }
    }

    load();
  }, []);

  const progress = vm?.progress ?? {
    motivationsAnswered: 0,
    strengthsAnswered: 0,
    skillsAnswered: 0,
    motivationsTotal: SIGNAL_COMPLETE_COUNT,
    strengthsTotal: SIGNAL_COMPLETE_COUNT,
    skillsTotal: SIGNAL_COMPLETE_COUNT,
  };

  const motAnswered = progress.motivationsAnswered ?? 0;
  const strAnswered = progress.strengthsAnswered ?? 0;
  const sklAnswered = progress.skillsAnswered ?? 0;

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
    () =>
      mounted
        ? getNextUnansweredTarget()
        : { cat: "motivations" as const, questionId: "motivations_1" },
    [mounted]
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
      return "You don’t need a clear answer yet — that’s not how this works. Everleap uses a science-based system to turn small signals into clear, usable direction.";
    }

    if (allSignalsComplete) {
      return "You’ve now given Everleap enough signal across motivations, strengths, and skills to start turning those patterns into clearer ideas about what may fit.";
    }

    return `You still have a few questions to answer before Everleap can give you ideas that actually fit. Continue ${nextCategoryLabel}.`;
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
            <section>
              <SectionCard tone="hero" className="px-3 py-4">
                <TodayIntro
                  title={introTitle}
                  dark={dark}
                  motionEnabled={motionEnabled}
                  isTransitioning={transitioning}
                  body={introBody}
                  primaryCtaLabel={ctaLabel}
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
<section className={sectionSpacing()}>
  <button
    type="button"
    onClick={() => {
      const code = window.prompt("Enter AI Lab access code");

      if (code === "101010") {
        router.push("/main/ai-lab");
        return;
      }

      if (code !== null) {
        window.alert("Invalid code");
      }
    }}
    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/35 transition hover:border-cyan-300/30 hover:text-cyan-200"
  >
    Internal AI Lab
  </button>
</section>
            <div className="h-4" />
          </div>
        </main>
      </div>
    </>
  );
}