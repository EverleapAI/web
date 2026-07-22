// apps/web/src/app/(app)/main/explore/_components/WorkLanding.tsx
//
// The dedicated careers (Work lane) experience — the Insights/Explore-summary
// shape brought down to the recommendations, careers-first:
//   1. Agentic entry (one paragraph)
//   2. Trophies (AwardsMeter → Achievements)
//   3. Signal gate (by % of ALL questions answered): <20% no cards + unlock;
//      20-99% cards + "we can do better"; 100% nothing
//   4. Four CareerCards — creative cards + feedback (Try it mission / dismiss /
//      tell me more); "Not for me" slides in the next ranked career
//   5. "Something I'm wondering" (careers-scoped tiny tasks)
//
// Other lanes stay on the shared ExploreLanding until their own phase.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import { ArrivalGate } from "../../components/interstitial/ArrivalGate";
import type { MicroTaskBatchItem } from "@/lib/microTasks/useMicroTaskBatch";

import { LANE_ACCENT, type ExplorePath } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { CareerCard, CAREER_ACCENTS } from "./CareerCard";
import { WorkSignalGate } from "./WorkSignalGate";
import { OnetNotice } from "./ExploreAttribution";

const VISIBLE = 4;
const QUESTIONS_HREF = "/main/story?returnTo=/main/explore/work";

type StoryProgress = { percent: number; done: boolean } | null;

function useStoryProgress(): StoryProgress {
  const [progress, setProgress] = React.useState<StoryProgress>(null);
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/story/next", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((d: { ok?: boolean; done?: boolean; progress?: { answered?: number; total?: number } }) => {
        if (cancelled || !d?.ok) return;
        const answered = d.progress?.answered ?? 0;
        const total = d.progress?.total ?? 0;
        setProgress({
          percent: total > 0 ? Math.round((answered / total) * 100) : 0,
          done: Boolean(d.done),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return progress;
}

// Slugs the user already dismissed ("Not for me"), so they never reappear.
function useDismissedCareers(): {
  dismissed: Set<string>;
  dismiss: (slug: string) => void;
} {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/guidance/insights-card-reaction?pageKey=explore_work", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { ok?: boolean; reactions?: { itemKey: string; reaction: string }[] }) => {
        if (cancelled || !d?.ok) return;
        const gone = (d.reactions ?? [])
          .filter((r) => r.reaction === "not_for_me")
          .map((r) => r.itemKey);
        if (gone.length) setDismissed((prev) => new Set([...prev, ...gone]));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const dismiss = React.useCallback((slug: string) => {
    setDismissed((prev) => new Set([...prev, slug]));
  }, []);
  return { dismissed, dismiss };
}

// Every mission on this screen in one request. Each CareerCard used to ask the
// actions endpoint about itself; with four visible cards that is four round
// trips for data one query answers.
function useDeckMissions(ready: boolean): Map<string, { id: string; status: string }> {
  const [missions, setMissions] = React.useState<Map<string, { id: string; status: string }>>(
    new Map()
  );
  React.useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetch("/api/guidance/actions?source_ref_prefix=explore_work%3A", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; actions?: { id: string; status: string; sourceRef?: string }[] } | null) => {
        if (cancelled || !d?.ok || !Array.isArray(d.actions)) return;
        const map = new Map<string, { id: string; status: string }>();
        for (const a of d.actions) {
          const slug = (a.sourceRef ?? "").split(":")[1];
          // Newest first from the API, so only keep the first per career.
          if (slug && !map.has(slug)) map.set(slug, { id: a.id, status: a.status });
        }
        setMissions(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ready]);
  return missions;
}

export function WorkLanding({
  paths,
  deckLoading = false,
}: {
  paths: ExplorePath[];
  deckLoading?: boolean;
}) {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const progress = useStoryProgress();
  const { dismissed, dismiss } = useDismissedCareers();

  const accent = LANE_ACCENT.work;
  const name = profile?.firstName ?? null;

  // The visible deck: ranked, minus dismissed, top N.
  const remaining = React.useMemo(
    () => paths.filter((p) => !dismissed.has(p.slug)),
    [paths, dismissed]
  );
  const visible = remaining.slice(0, VISIBLE);

  // Gate state — by share of ALL story questions answered.
  const pct = progress?.percent ?? 0;
  const gate: "low" | "partial" | "none" =
    progress == null ? "none" : progress.done ? "none" : pct < 20 ? "low" : "partial";
  const showCards = gate !== "low" && paths.length > 0;

  const deckMissions = useDeckMissions(Boolean(isReady));

  if (!isReady) return null;

  return (
    // Work borrows Explore's question batch, but keeps its OWN appearance
    // budget: it is a different screen to the person looking at it.
    <ArrivalGate
      pageKey="explore_work"
      taskSource="explore_summary"
    >
    <div className="space-y-4">
      {/* Back to Explore — replaces the lane rail, like the Insights sub-pages. */}
      <Link
        href="/main/explore"
        replace
        className="group -mb-1 inline-flex items-center gap-1.5 text-label font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Explore</span>
      </Link>

      {/* 1) Agentic entry */}
      <SectionCard tone="hero" voice backdrop={<ReadAtmosphere seed="lane:work" accent={accent} />}>
        <div className="relative max-w-2xl">
          <AgenticHeader
            glyph={
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-cyan-300/[0.08] text-cyan-200/75 ring-1 ring-cyan-300/[0.18]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow="Explore · Careers"
            accentRgb="92, 180, 255"
          />
          <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
            {name ? `${name}, careers that actually fit how you work.` : "Careers that actually fit how you work."}
          </h1>
          <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
            These come from the same read Everleap builds of your motivations, strengths, and
            skills — matched to real careers, not job-title guesses. React to each one to sharpen
            what comes next, and turn any that pull you into something you actually try.
          </p>
        </div>
      </SectionCard>

      {/* 2) Trophies → Achievements */}
      <AwardsMeter stats={badges} />

      {/* 3) Signal gate */}
      {gate !== "none" ? <WorkSignalGate variant={gate} href={QUESTIONS_HREF} /> : null}

      {/* 4) The recommendations */}
      {showCards ? (
        visible.length > 0 ? (
          <div className="space-y-4">
            {visible.map((path, i) => (
              <CareerCard
                key={path.id}
                path={path}
                accent={CAREER_ACCENTS[i % CAREER_ACCENTS.length]}
                onDismiss={dismiss}
                missions={deckMissions}
              />
            ))}
          </div>
        ) : deckLoading ? (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-card border border-white/10 bg-white/[0.03] px-5 py-6"
              >
                <div className="h-4 w-1/2 rounded bg-white/10" />
                <div className="mt-3 h-3 w-full rounded bg-white/[0.07]" />
                <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.07]" />
              </div>
            ))}
          </div>
        ) : (
          <SectionCard tone="neutral" compact>
            <p className="text-label text-white/70">
              That’s every match we have for you right now. Answer a few more questions and
              we’ll surface fresh careers to consider.
            </p>
          </SectionCard>
        )
      ) : null}

      {/* Career data grounded in U.S. Dept. of Labor sources. */}
      <OnetNotice className="px-1 pt-2" />
    </div>
    </ArrivalGate>
  );
}

export default WorkLanding;
