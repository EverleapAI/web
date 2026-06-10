"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

import {
  isDarkTheme,
  type SpotlightThemeId,
} from "@/theme/everleapVisuals";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TinyTaskCard } from "./components/nextSteps/TinyTaskCard";
import { getNextStepsDefinition } from "@/app/(app)/main/content/nextSteps";
import { SectionCard } from "./components/ui/SectionCard";

const SIGNAL_COMPLETE_COUNT = 5;
const STORAGE_KEY_V3 = "everleap.story.answers.v3";
const ONBOARDING_STORAGE_KEY = "everleap_onboarding_answers";
const ONBOARDING_SNAPSHOT_KEY = "everleapOnboarding_v4_convo_min";

type Category = "motivations" | "strengths" | "skills";
type Saved = { answer?: string; skipped?: boolean };
type TodayViewModel = ReturnType<typeof buildTodayViewModel>;

type TodayGuidance = {
  headline: string;
  guidance_text: string;
  next_action_label: string;
  next_action_route: string;
};

type JourneyBadge = {
  id: string;
  label: string;
  src: string;
};

const JOURNEY_BADGES: JourneyBadge[] = [
  { id: "onboard", label: "Onboard", src: "/onboarding/icons/badges/1_onboard.png" },
  { id: "story", label: "Story", src: "/onboarding/icons/badges/2_story.png" },
  { id: "reflection", label: "Reflection", src: "/onboarding/icons/badges/3_reflection.png" },
  { id: "explore", label: "Explore", src: "/onboarding/icons/badges/4_explore.png" },
  { id: "takeoff", label: "Takeoff", src: "/onboarding/icons/badges/5_takeoff.png" },
];

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

function getEarnedBadgeCount(vm: TodayViewModel | null): number {
  const progress = vm?.progress;
  if (!progress) return 1;

  const totalAnswered =
    (progress.motivationsAnswered ?? 0) +
    (progress.strengthsAnswered ?? 0) +
    (progress.skillsAnswered ?? 0);

  const allSignalsComplete =
    (progress.motivationsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress.strengthsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress.skillsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT;

  if (allSignalsComplete) return 5;
  if (totalAnswered >= 10) return 4;
  if (totalAnswered >= 5) return 3;
  if (totalAnswered > 0) return 2;

  return 1;
}

function TodayCard(props: {
  headline?: string | null;
  guidanceText?: string | null;
  ctaLabel: string;
  onPrimary: () => void;
}) {
  return (
    <div className="relative">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-4 w-4 items-center justify-center text-white/42">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/54">
          Today
        </div>
      </div>

    <h1 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-white">
  {props.headline ?? "Let's begin."}
</h1>

      <p className="mt-5 text-[15px] leading-7 tracking-[-0.015em] text-white/84">
        {props.guidanceText ??
          "Today let’s keep building your story. I’ll ask a few more questions so Everleap can better understand your motivations, strengths, and skills."}
      </p>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={props.onPrimary}
          className="group inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-cyan-300 transition hover:text-cyan-100"
        >
          <span>{props.ctaLabel === "Start My Story" ? "Begin Story" : props.ctaLabel}</span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function DiscoveryCard(props: { onPrimary: () => void }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[18px]">✨</span>
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/54">
          Your Story
        </div>
      </div>
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-white">
        Start building your Story.
      </h2>
      <p className="mt-4 text-[15px] leading-7 tracking-[-0.015em] text-white/80">
        Your Story is where Everleap starts turning your answers into signals,
        insights, and new possibilities. You can answer a little at a time and watch
        the picture come into focus.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          What starts opening up
        </div>

        <div className="mt-3 space-y-2 text-[14px] leading-6 text-white/82">
          <div>• Story progress</div>
          <div>• Early signals</div>
          <div>• Personalized insights</div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={props.onPrimary}
          className="group inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-cyan-300 transition hover:text-cyan-100"
        >
          <span>Start My Story</span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function JourneyCard(props: { earnedCount: number }) {
  return (
    <div>
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
        Your Journey
      </h2>

      <div className="mt-5 grid grid-cols-5 gap-2">
        {JOURNEY_BADGES.map((badge, index) => {
          const earned = index < props.earnedCount;
          const current = index === props.earnedCount;

          return (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2"
              title={badge.label}
            >
              <div
                className={[
                  "relative flex h-[50px] w-[50px] items-center justify-center rounded-full border transition",
                  earned
                    ? "border-amber-200/70 bg-white/[0.06] shadow-[0_0_24px_rgba(251,191,36,0.16)]"
                    : current
                      ? "border-cyan-200/55 bg-cyan-200/[0.05]"
                      : "border-white/18 bg-white/[0.025] opacity-55",
                ].join(" ")}
              >
                <Image
                  src={badge.src}
                  alt={`${badge.label} badge`}
                  width={36}
                  height={36}
                  className={[
                    "h-9 w-9 object-contain",
                    earned ? "opacity-100" : "opacity-45 grayscale",
                  ].join(" ")}
                />

                {earned ? (
                  <div className="absolute -right-0.5 -top-0.5 rounded-full bg-slate-950 text-amber-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : null}
              </div>

              <div
                className={[
                  "text-center text-[10px] font-medium leading-tight",
                  earned
                    ? "text-white/82"
                    : current
                      ? "text-cyan-200"
                      : "text-white/38",
                ].join(" ")}
              >
                {index === 0
                  ? "Onboard"
                  : index === 1
                    ? "Your Story"
                    : index === 2
                      ? "First Insight"
                      : index === 3
                        ? "Explore"
                        : "Action"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/75">
          Next unlock
        </div>
        <div className="mt-1 text-[14px] font-semibold tracking-[-0.015em] text-white">
          Begin Your Story
        </div>
      </div>
    </div>
  );
}

export default function MainHomePage() {
  const router = useRouter();

  const [themeId] = React.useState<SpotlightThemeId>("nightDusk");
  const dark = isDarkTheme(themeId);

  const [vm, setVm] = React.useState<TodayViewModel | null>(null);
  const [todayGuidance, setTodayGuidance] =
    React.useState<TodayGuidance | null>(null);
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
        // Retry next load.
      }
    }

    claimOnboarding();
  }, []);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/regauth/me", { cache: "no-store" });
        const data = await res.json();

        try {
          const guidanceRes = await fetch("/api/guidance/today", {
            cache: "no-store",
          });

          const guidanceData = await guidanceRes.json();

          if (guidanceData?.ok && guidanceData?.guidance) {
            setTodayGuidance(guidanceData.guidance);
          }
        } catch {
          // Fall back to existing Today content.
        }

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
        const nextVm = buildTodayViewModel();
        setVm(nextVm);
        setMounted(true);
      }
    }

    load();
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

  const earnedBadgeCount = getEarnedBadgeCount(vm);

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
                <TodayCard
                  headline={todayGuidance?.headline}
                  guidanceText={todayGuidance?.guidance_text}
                  ctaLabel={ctaLabel}
                  onPrimary={handlePrimary}
                />
              </SectionCard>
            </section>

            <section className={sectionSpacing()}>
              <SectionCard tone="hero" className="px-4 py-5">
                <JourneyCard earnedCount={earnedBadgeCount} />
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

            <div className="h-4" />
          </div>
        </main>
      </div>
    </>
  );
}