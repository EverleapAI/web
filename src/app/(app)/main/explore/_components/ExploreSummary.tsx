// apps/web/src/app/(app)/main/explore/_components/ExploreSummary.tsx
//
// The Explore Summary tab — a destination, like Insights. One agentic "whole-life
// read" card carries the page; below it, a single honest card of concrete paths
// worth a real look, one per direction. No score meters (the Phase-A keyword
// scorer saturates on a rich profile and the numbers read as meaningless) and no
// nav duplication (the lanes already live in the tab rail).

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { LANE_ACCENT, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { LANE_ICON, rgba } from "./exploreUi";
import { ExploreSummaryCard, type SummaryRequest } from "./ExploreSummaryCard";
import { WhereYouAre } from "@/app/(app)/main/components/achievements/WhereYouAre";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";

const LANE_LABEL: Record<Lane, string> = {
  work: "Work",
  learning: "Learning",
  world: "World",
  impact: "Impact",
  play: "Play",
};

const LANE_ORDER: Lane[] = ["work", "learning", "world", "impact", "play"];

export type SummaryLane = { lane: Lane; paths: ExplorePath[] };

type LaneTop = { lane: Lane; path: ExplorePath; score: number };

function LaneMark({ lane }: { lane: Lane }) {
  const accent = LANE_ACCENT[lane];
  const Icon = LANE_ICON[lane];
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
      style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function ExploreSummary({ lanes }: { lanes: SummaryLane[] }) {
  const { profile, isReady } = useExploreProfile();

  // One strongest pick per lane, kept in a stable direction order (not ranked by
  // the saturated score — just a real path to start with in each direction).
  const laneTops = React.useMemo<LaneTop[]>(() => {
    if (!profile) return [];
    const byLane = new Map<Lane, SummaryLane>(lanes.map((l) => [l.lane, l]));
    const tops: LaneTop[] = [];
    for (const lane of LANE_ORDER) {
      const entry = byLane.get(lane);
      if (!entry || !entry.paths.length) continue;
      // Work is ranked server-side (the career-match layer): its deck already
      // arrives in fit order with each card's personalized "why", so take the
      // top match as-is rather than re-scoring it with the client keyword
      // scorer (which would scramble the order and drop the why). Other lanes
      // stay client-scored until their phase.
      if (lane === "work") {
        tops.push({ lane, path: entry.paths[0], score: 0 });
        continue;
      }
      const ranked = rankPaths(entry.paths, profile, 1)[0];
      if (ranked) tops.push({ lane, path: ranked.path, score: ranked.score });
    }
    return tops;
  }, [lanes, profile]);

  const request = React.useMemo<SummaryRequest>(
    () => ({
      firstName: profile?.firstName ?? null,
      motivations: profile?.motivations ?? [],
      strengths: profile?.strengths ?? [],
      skills: profile?.skills ?? [],
      freeText: profile?.fullText ?? "",
      topPicks: laneTops.map((t) => ({
        lane: t.lane,
        title: t.path.card.title,
        hook: t.path.card.hook,
        score: t.score,
      })),
    }),
    [profile, laneTops]
  );

  // Every hook must run on every render, so this sits ABOVE the `isReady` gate.
  // It used to sit below it: on the first render isReady is false, the component
  // returned early, and useBadgeStats never ran — then on the next render it did.
  // React lines hooks up by call order, so the 5th slot was `undefined` one render
  // and a useState the next, and state can be handed to the wrong hook.
  const badges = useBadgeStats();

  if (!isReady) return null;
  const hasSignal = Boolean(profile?.hasQuestionSignal) && laneTops.length > 0;

  return (
    <div className="space-y-4">
      <ExploreSummaryCard
        request={request}
        hasSignal={hasSignal}
        firstName={profile?.firstName ?? null}
      />

      {/* "Where you are" — below the agent's read, never above it. This used to
          live in the Explore layout, above everything, so a scoreboard was the
          first thing the page said to you. */}
      <WhereYouAre
        block={badges?.surfaces?.explore?.block ?? null}
        stats={badges}
      />

      {laneTops.length > 0 ? (
        <SectionCard tone="neutral">
          <h2 className="text-meta font-semibold uppercase tracking-eyebrow text-white/55">
            Worth a real look
          </h2>
          <p className="mt-1 text-meta leading-body text-white/50">
            One path to actually dig into in each of your five directions.
          </p>
          <div className="mt-3 space-y-2">
            {laneTops.map((t) => (
              <Link
                key={`${t.lane}:${t.path.slug}`}
                href={`/main/explore/${t.lane}/${t.path.slug}`}
                className="group flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 transition hover:bg-white/[0.04]"
              >
                <LaneMark lane={t.lane} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-label font-semibold text-ink-strong">{t.path.card.title}</span>
                    <span className="text-micro uppercase tracking-eyebrow text-white/40">
                      {LANE_LABEL[t.lane]}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-meta font-normal leading-read tracking-normal text-ink-quiet">
                    {t.path.card.hook}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default ExploreSummary;
