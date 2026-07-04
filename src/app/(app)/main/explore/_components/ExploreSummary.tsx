// apps/web/src/app/(app)/main/explore/_components/ExploreSummary.tsx
//
// The Explore Summary tab — a destination, not a menu. An agentic "whole-life
// read" card, then insight-framed supporting cards (the strongest picks across
// all lanes, and which directions light up most). Navigation lives in the tab
// rail, so this page is free to actually say something.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { LANE_ACCENT, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { LANE_ICON, SignalChip, rgba } from "./exploreUi";
import { ExploreSummaryCard, type SummaryRequest } from "./ExploreSummaryCard";

const LANE_LABEL: Record<Lane, string> = {
  work: "Work",
  learning: "Learning",
  world: "World",
  impact: "Impact",
  play: "Play",
};

export type SummaryLane = { lane: Lane; paths: ExplorePath[] };

type LaneTop = { lane: Lane; path: ExplorePath; score: number };

function LaneMark({ lane }: { lane: Lane }) {
  const accent = LANE_ACCENT[lane];
  const Icon = LANE_ICON[lane];
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
      style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function ExploreSummary({ lanes }: { lanes: SummaryLane[] }) {
  const { profile, isReady } = useExploreProfile();

  const laneTops = React.useMemo<LaneTop[]>(() => {
    if (!profile) return [];
    const tops: LaneTop[] = [];
    for (const { lane, paths } of lanes) {
      if (!paths.length) continue;
      const ranked = rankPaths(paths, profile, 1)[0];
      if (ranked) tops.push({ lane, path: ranked.path, score: ranked.score });
    }
    return tops;
  }, [lanes, profile]);

  const byScore = React.useMemo(
    () => [...laneTops].sort((a, b) => b.score - a.score),
    [laneTops]
  );
  const worthALook = byScore.slice(0, 3);

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

  if (!isReady) return null;
  const hasSignal = Boolean(profile?.hasQuestionSignal) && laneTops.length > 0;

  return (
    <div className="space-y-4">
      <ExploreSummaryCard
        request={request}
        hasSignal={hasSignal}
        firstName={profile?.firstName ?? null}
      />

      {worthALook.length > 0 ? (
        <SectionCard tone="neutral">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
            Worth a real look
          </h2>
          <div className="mt-3 space-y-2.5">
            {worthALook.map((t) => (
              <Link
                key={`${t.lane}:${t.path.slug}`}
                href={`/main/explore/${t.lane}/${t.path.slug}`}
                className="group flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 transition hover:bg-white/[0.04]"
              >
                <LaneMark lane={t.lane} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-white">{t.path.card.title}</span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                      {LANE_LABEL[t.lane]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-[1.5] text-white/62">
                    {t.path.card.hook}
                  </p>
                  <div className="mt-2">
                    <SignalChip score={t.score} accent={LANE_ACCENT[t.lane]} />
                  </div>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {byScore.length > 0 ? (
        <SectionCard tone="neutral">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
            Your directions
          </h2>
          <div className="mt-3 space-y-2">
            {byScore.map((t) => (
              <Link
                key={t.lane}
                href={`/main/explore/${t.lane}`}
                className="group flex items-center gap-3 rounded-xl px-1.5 py-1.5 transition hover:bg-white/[0.03]"
              >
                <LaneMark lane={t.lane} />
                <span className="w-[68px] shrink-0 text-[13.5px] font-semibold text-white">
                  {LANE_LABEL[t.lane]}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(8, Math.min(100, t.score))}%`,
                      backgroundColor: rgba(LANE_ACCENT[t.lane], 0.75),
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[12.5px] tabular-nums text-white/55">
                  {t.score}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default ExploreSummary;
