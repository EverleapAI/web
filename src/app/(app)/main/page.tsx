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
import { ConstellationAnchor } from "./components/ui/ConstellationAnchor";
import {
  TodayCard,
  TodayCardSkeleton,
  TodayHeart,
  type TodayHeartData,
} from "./components/today";

// Atmosphere accent (the ConstellationAnchor tint) follows the dispatch type.
const HEART_ACCENT_RGB: Record<string, { r: number; g: number; b: number }> = {
  learn: { r: 182, g: 160, b: 255 },
  look: { r: 92, g: 180, b: 255 },
  do: { r: 246, g: 178, b: 60 },
  close: { r: 55, g: 211, b: 160 },
};

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
  const [heart, setHeart] = React.useState<TodayHeartData | null>(null);
  const [guidanceLoaded, setGuidanceLoaded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [motionEnabled] = React.useState(true);
  const [transitioning] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

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

  // Light regen poll: while Today is regenerating, re-fetch the dispatch so a
  // returning user sees fresh content land without a manual reload.
  React.useEffect(() => {
    if (!isUpdating) return;
    let alive = true;
    let tries = 0;
    const id = window.setInterval(async () => {
      tries += 1;
      try {
        const r = await fetch("/api/guidance/today", { cache: "no-store" });
        const g = await r.json();
        if (!alive) return;
        setIsUpdating(g?.is_updating === true);
        if (g?.ok && g?.guidance) setTodayGuidance(g.guidance);
        if (g?.ok && g?.dispatch && g?.coverage && g?.rhythm && g?.welcome) {
          // The reinforcement is rationed server-side (shown once, then held
          // back), so a poll re-fetch legitimately returns null for it — keep the
          // line already on screen instead of letting it flicker away mid-view.
          setHeart((prev) => ({
            dispatch: g.dispatch,
            coverage: g.coverage,
            rhythm: g.rhythm,
            welcome: g.welcome,
            synthesis: g.synthesis ?? null,
            reinforcement: g.reinforcement ?? prev?.reinforcement ?? null,
            reads: g.reads ?? prev?.reads ?? null,
            lead: g.lead ?? prev?.lead ?? null,
            retort: g.retort ?? prev?.retort ?? null,
            body: g.body ?? prev?.body ?? null,
            why: g.why ?? prev?.why ?? null,
            looseThread: g.looseThread ?? null,
          }));
        }
      } catch {
        // keep the existing content
      }
      if (tries >= 6) window.clearInterval(id);
    }, 3000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [isUpdating]);

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

          if (!alive) return;

          if (guidanceData?.ok && guidanceData?.guidance) {
            setTodayGuidance(guidanceData.guidance);
          }

          // The "beating heart" payload — present even for brand-new users
          // (no guidance row), since it's computed live from current state.
          if (
            guidanceData?.ok &&
            guidanceData?.dispatch &&
            guidanceData?.coverage &&
            guidanceData?.rhythm &&
            guidanceData?.welcome
          ) {
            setHeart({
              dispatch: guidanceData.dispatch,
              coverage: guidanceData.coverage,
              rhythm: guidanceData.rhythm,
              welcome: guidanceData.welcome,
              synthesis: guidanceData.synthesis ?? null,
              reinforcement: guidanceData.reinforcement ?? null,
              reads: guidanceData.reads ?? null,
              lead: guidanceData.lead ?? null,
              retort: guidanceData.retort ?? null,
              body: guidanceData.body ?? null,
              why: guidanceData.why ?? null,
              looseThread: guidanceData.looseThread ?? null,
            });
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
            // Hydrate the local snapshot from the DB — the source of truth —
            // instead of an email-prefix stub. This is what makes name + signals
            // survive a logout / new device / cleared storage: the DB always has
            // them, so every load refreshes the local cache from it.
            type ServerProfile = {
              name?: string | null;
              zip?: string | null;
              situation?: string | null;
              certainty?: string | null;
              certaintyIdea?: string | null;
              postPlans?: string[];
              activities?: string[];
              motivations?: string[];
              strengths?: string[];
              skills?: string[];
              answers?: Record<string, unknown>;
            };
            let serverProfile: ServerProfile | null = null;
            try {
              const pr = await fetch("/api/guidance/profile", { cache: "no-store" });
              if (pr.ok) {
                const pj = await pr.json();
                if (pj?.ok && pj.profile) serverProfile = pj.profile as ServerProfile;
              }
            } catch {
              // fall through to whatever is already local
            }

            const existingRaw = localStorage.getItem(ONBOARDING_SNAPSHOT_KEY);
            const merged: Record<string, unknown> = existingRaw
              ? JSON.parse(existingRaw) || {}
              : {};

            if (serverProfile) {
              const put = (key: string, value: unknown) => {
                if (
                  value != null &&
                  value !== "" &&
                  !(Array.isArray(value) && value.length === 0)
                ) {
                  merged[key] = value;
                }
              };
              put("name", serverProfile.name);
              put("zip_code", serverProfile.zip);
              put("situation", serverProfile.situation);
              put("certainty", serverProfile.certainty);
              put("certaintyIdea", serverProfile.certaintyIdea);
              put("postPlans", serverProfile.postPlans);
              put("activities", serverProfile.activities);
              put("motivations", serverProfile.motivations);
              put("strengths", serverProfile.strengths);
              put("skills", serverProfile.skills);
              put("answers", serverProfile.answers);
            }

            // Last-resort fallbacks only if the DB genuinely has nothing.
            if (merged.name == null)
              merged.name = data.user?.email?.split("@")[0] ?? null;
            if (merged.zip_code == null) merged.zip_code = data.user?.zip_code ?? null;

            localStorage.setItem(ONBOARDING_SNAPSHOT_KEY, JSON.stringify(merged));
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
  const ctaRoute =
    heart?.dispatch.destination.route ??
    todayGuidance?.next_action_route ??
    null;

  const heartAccent = heart
    ? HEART_ACCENT_RGB[heart.dispatch.type] ?? HEART_ACCENT_RGB.learn
    : { r: 92, g: 180, b: 255 };

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
              <SectionCard
                tone="hero"
                className="!px-5 !py-3.5"
                backdrop={
                  <>
                    {/* The Oura move: the atmosphere lives up top behind the
                        masthead as a soft, out-of-focus haze and DISSOLVES before
                        the reading copy — so text sits on a clean field and never
                        on sharp star points. Blurred, not just dimmed (Today only). */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        opacity: 0.5,
                        filter: "blur(1.2px)",
                        // Fade the atmosphere DOWN (top note only) AND pinch both
                        // side edges to zero, so the right-weighted star bloom
                        // dissolves before the card edge instead of hard-clipping
                        // there. Two mask layers intersected.
                        WebkitMaskImage:
                          "linear-gradient(180deg, #000 0%, #000 14%, transparent 40%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
                        WebkitMaskComposite: "source-in",
                        maskImage:
                          "linear-gradient(180deg, #000 0%, #000 14%, transparent 40%), linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
                        maskComposite: "intersect",
                      }}
                    >
                      <ConstellationAnchor
                        seed={`today:${new Date().toISOString().slice(0, 10)}`}
                        accent={heartAccent}
                      />
                    </div>
                  </>
                }
              >
                {guidanceLoaded ? (
                  heart ? (
                    <TodayHeart data={heart} onPrimary={handlePrimary} />
                  ) : (
                    <TodayCard
                      headline={todayGuidance?.headline}
                      reflection={todayGuidance?.reflection}
                      observation={todayGuidance?.observation}
                      nextStep={todayGuidance?.next_step}
                      guidanceText={todayGuidance?.guidance_text}
                      ctaLabel={ctaLabel}
                      onPrimary={handlePrimary}
                    />
                  )
                ) : (
                  <TodayCardSkeleton />
                )}
              </SectionCard>
            </section>

            <section className="mt-5">
              <SectionCard tone="neutral" className="px-4 py-5">
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
              </SectionCard>
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