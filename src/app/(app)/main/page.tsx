"use client";

import * as React from "react";

import { fetchMe } from "@/lib/session/me";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { ArrivalGate } from "./components/interstitial/ArrivalGate";
import { SectionCard } from "./components/ui/SectionCard";
import {
  TodayCardSkeleton,
  TodayHeart,
  TodayUnavailable,
  type TodayHeartData,
} from "./components/today";

// The atmosphere accent moved into TodayHeart with the card it belongs to — the
// read is the only section that carries the constellation now.

const ONBOARDING_STORAGE_KEY = "everleap_onboarding_answers";
const ONBOARDING_SNAPSHOT_KEY = "everleapOnboarding_v4_convo_min";


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

export default function MainHomePage() {
  const router = useRouter();

  const [todayGuidance, setTodayGuidance] =
    React.useState<TodayGuidance | null>(null);
  const [heart, setHeart] = React.useState<TodayHeartData | null>(null);
  const [guidanceLoaded, setGuidanceLoaded] = React.useState(false);
  // Bumping this re-runs the load effect — the retry on the "Today didn't load"
  // card. Clearing guidanceLoaded first puts the skeleton back, so the retry is
  // visibly doing something rather than sitting on a dead button.
  const [reloadKey, setReloadKey] = React.useState(0);

  const reloadToday = React.useCallback(() => {
    setGuidanceLoaded(false);
    setReloadKey((k) => k + 1);
  }, []);
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
        const data = await fetchMe();

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

            // The email's local part is a handle, not a name. One account here
            // is "epeedog" — épée plus dog, chosen by a fencer — who told us to
            // call them "timmy" when onboarding asked. Falling back to the
            // address overrode an explicit answer to that exact question, and
            // for anyone who genuinely hasn't given a name it invents one out of
            // whatever is left of their email. No name is better than a wrong
            // one; the copy already reads fine without it.
            if (merged.zip_code == null) merged.zip_code = data.user?.zip_code ?? null;

            localStorage.setItem(ONBOARDING_SNAPSHOT_KEY, JSON.stringify(merged));
          } catch {
            // Ignore local snapshot bridge failures.
          }
        }

        setMounted(true);
      } catch {
        if (!alive) return;

        setMounted(true);
        setGuidanceLoaded(true);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [reloadKey]);

  // Where the card's one button goes. The dispatch decides it; the older guidance
  // blob is kept only as a fallback for a pack written before dispatch existed.
  const ctaRoute =
    heart?.dispatch.destination.route ??
    todayGuidance?.next_action_route ??
    null;

  function handlePrimary() {
    if (!mounted) return;

    if (ctaRoute) {
      router.push(ctaRoute);
      return;
    }

    // No route at all means we have no dispatch — which now only happens when the
    // load failed. Sending them into the story is the one move that is always safe
    // and always useful; the local keyword engine that used to guess a specific
    // question here has been deleted along with the fallback card it fed.
    router.push("/main/story");
  }

  return (
    // The question that used to sit in a card partway down this page now plays
    // in front of it. Three appearances, then it retires here.
    <ArrivalGate
      pageKey="today"
    >
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
            {/* Today is four cards, and TodayHeart owns the first three — the read,
                where you are, and the action to reflect on. It renders them as peers
                rather than as one canvas, so this section does NOT wrap them in a
                card of its own: that would nest a card inside a card and undo the
                separation. */}
            <section>
              {guidanceLoaded ? (
                heart ? (
                  <TodayHeart data={heart} onPrimary={handlePrimary} />
                ) : (
                  // The heart is computed live and comes back even for an account
                  // with no guidance row at all — so if it is missing, the request
                  // failed. Say that, instead of rendering a stand-in that looks
                  // like a working screen.
                  <SectionCard tone="hero" className="!px-5 !py-5">
                    <TodayUnavailable
                      onRetry={reloadToday}
                      retrying={!guidanceLoaded}
                    />
                  </SectionCard>
                )
              ) : (
                <SectionCard tone="hero" className="!px-5 !py-3.5">
                  <TodayCardSkeleton />
                </SectionCard>
              )}
            </section>

            {/* 4 · The question used to sit here, in a card.
                It now plays in front of this page as the arrival interstitial
                (see ArrivalInterstitial) — because as a card it was skimmed
                past, and on some screens answered literally never. */}

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/main/ai-lab")}
                className="text-meta font-medium text-white/34 transition hover:text-cyan-200"
              >
                Open AI Lab
              </button>

              <span className="text-white/16">•</span>

              <button
                type="button"
                onClick={() => router.push("/main/reset-answers")}
                className="text-meta font-medium text-white/30 transition hover:text-cyan-200"
              >
                Start over
              </button>
            </div>

            <div className="h-4" />
          </div>
        </main>
      </div>
    </ArrivalGate>
  );
}
