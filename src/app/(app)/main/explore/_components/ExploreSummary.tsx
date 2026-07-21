// apps/web/src/app/(app)/main/explore/_components/ExploreSummary.tsx
//
// The Explore Summary tab — a destination, like Insights. One agentic "whole-life
// read" card carries the page; below it, the five lanes as *worlds* (ExploreWorlds)
// — each with its own light, an evocative subtitle, a whispered top pick, and a real
// path count. The agent greets you first; the worlds are where its voice points you.
// No score meters (the Phase-A keyword scorer saturates on a rich profile and the
// numbers read as meaningless).

"use client";

import * as React from "react";

import { type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { ExploreSummaryCard, type SummaryRequest } from "./ExploreSummaryCard";
import { ExploreWorlds, type WorldsLane } from "./ExploreWorlds";
import { SectionCard } from "../../components/ui/SectionCard";
import { ArrivalGate } from "../../components/interstitial/ArrivalGate";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";

const LANE_ORDER: Lane[] = ["work", "learning", "world", "impact", "play"];

export type SummaryLane = { lane: Lane; paths: ExplorePath[]; total?: number };

type LaneTop = { lane: Lane; path: ExplorePath; score: number };

export function ExploreSummary({ lanes }: { lanes: SummaryLane[] }) {
  const { profile, isReady } = useExploreProfile();

  // The Explore "Something I'm wondering" batch, lifted from the summary fetch.

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

  // The five worlds: real path count per lane + the strongest pick (the "whisper").
  // Always shown — it is the primary navigation — so counts render even before any
  // signal; whispers appear once we have a top pick to point at.
  const worlds = React.useMemo<WorldsLane[]>(() => {
    const topByLane = new Map(laneTops.map((t) => [t.lane, t.path]));
    // The lane's real size, not the size of the deck we happened to serve —
    // Work returns 12 matches out of 807 careers, and counting the deck made
    // Career read as the smallest lane when it is the largest.
    const countByLane = new Map(lanes.map((l) => [l.lane, l.total ?? l.paths.length]));
    return LANE_ORDER.map((lane) => ({
      lane,
      count: countByLane.get(lane) ?? 0,
      top: topByLane.get(lane) ?? null,
    }));
  }, [lanes, laneTops]);

  const badges = useBadgeStats();
  const hasSignal = isReady && Boolean(profile?.hasQuestionSignal) && laneTops.length > 0;

  // The worlds render immediately (static counts) — we no longer blank the whole
  // page while the profile loads and the read generates. Only the read itself
  // waits, showing a skeleton, so navigating to Explore always shows content fast.
  return (
    <ArrivalGate
      pageKey="explore_summary"
    >
    <div className="space-y-4">
      {isReady ? (
        <ExploreSummaryCard
          request={request}
          hasSignal={hasSignal}
          firstName={profile?.firstName ?? null}
        />
      ) : (
        <SectionCard tone="hero" voice>
          <div className="max-w-2xl animate-pulse space-y-3">
            <div className="h-7 w-3/4 rounded-lg bg-white/10" />
            <div className="mt-4 h-3.5 w-full rounded bg-white/[0.07]" />
            <div className="h-3.5 w-[88%] rounded bg-white/[0.07]" />
          </div>
        </SectionCard>
      )}

      {/* Progress + the door to Awards — the compact meter that opens the
          achievements screen, sits right under the read, above the cards. */}
      <AwardsMeter stats={badges} />

      {/* The five worlds — the agent's read points into them. */}
      <ExploreWorlds lanes={worlds} />
    </div>
    </ArrivalGate>
  );
}

export default ExploreSummary;
