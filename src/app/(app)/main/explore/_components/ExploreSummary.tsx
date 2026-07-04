// apps/web/src/app/(app)/main/explore/_components/ExploreSummary.tsx
//
// The Explore summary / entry screen (new default for /main/explore).
// Insights-style overview: a framing hero + the single strongest pick from each
// lane, putting all five lanes on equal footing instead of landing on Work.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { LANE_ACCENT, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { CornerConstellation, LANE_ICON, SignalChip, rgba } from "./exploreUi";

const LANE_LABEL: Record<Lane, string> = {
  work: "Work",
  learning: "Learning",
  world: "World",
  impact: "Impact",
  play: "Play",
};

const LANE_BLURB: Record<Lane, string> = {
  work: "Careers worth a real look",
  learning: "Ways to keep growing",
  world: "See more of the world",
  impact: "Make a real difference",
  play: "Fun that fits you",
};

export type SummaryLane = { lane: Lane; paths: ExplorePath[] };

function LaneRow({ lane, paths }: SummaryLane) {
  const { profile } = useExploreProfile();
  const accent = LANE_ACCENT[lane];
  const Icon = LANE_ICON[lane];

  const top = React.useMemo(() => {
    if (!profile || paths.length === 0) return null;
    return rankPaths(paths, profile, 1)[0] ?? null;
  }, [paths, profile]);

  return (
    <SectionCard tone="neutral" compact>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-[8px]"
            style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-white">{LANE_LABEL[lane]}</div>
            <div className="text-[11.5px] text-white/50">{LANE_BLURB[lane]}</div>
          </div>
        </div>
        <Link
          href={`/main/explore/${lane}`}
          className="shrink-0 text-[12.5px] font-medium text-white/55 transition hover:text-white/85"
        >
          See all →
        </Link>
      </div>

      {top ? (
        <Link
          href={`/main/explore/${lane}/${top.path.slug}`}
          className="group mt-3 block rounded-2xl border border-white/6 bg-white/[0.02] px-3.5 py-3 transition hover:bg-white/[0.04]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white">{top.path.card.title}</div>
              <p className="mt-1 line-clamp-2 text-[13px] leading-[1.5] text-white/62">{top.path.card.hook}</p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
          </div>
          <div className="mt-2.5">
            <SignalChip score={top.score} accent={accent} />
          </div>
        </Link>
      ) : (
        <p className="mt-3 text-[13px] text-white/50">Answer a few questions to see your top {LANE_LABEL[lane]} pick.</p>
      )}
    </SectionCard>
  );
}

export function ExploreSummary({ lanes }: { lanes: SummaryLane[] }) {
  const { profile, isReady } = useExploreProfile();
  if (!isReady) return null;

  const name = profile?.firstName;
  const hasSignal = Boolean(profile?.hasQuestionSignal);

  return (
    <div className="space-y-4">
      <SectionCard tone="hero">
        <CornerConstellation />
        <div className="relative max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-cyan-300/12 text-cyan-200/75">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">Explore</span>
          </div>
          <h1 className="text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[28px]">
            {name ? `${name}, here's your whole-life view.` : "Your whole-life view."}
          </h1>
          <p className="mt-3 text-[14px] leading-[1.66] text-white/74 sm:text-[15px]">
            {hasSignal
              ? "Explore is more than a career quiz — it's five directions a good life can grow in. Here's the single strongest pick Everleap sees in each, from the signal you're already giving off."
              : "Explore turns your signal into real paths across five directions of a life — work, learning, world, impact, and play. Answer a few quick questions and each one sharpens."}
          </p>
          {!hasSignal ? (
            <Link
              href="/main/questions?returnTo=/main/explore"
              className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-white/82 transition hover:text-white"
            >
              <span>Start with a few quick questions</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </SectionCard>

      <div className="space-y-4">
        {lanes.map(({ lane, paths }) => (
          <LaneRow key={lane} lane={lane} paths={paths} />
        ))}
      </div>
    </div>
  );
}

export default ExploreSummary;
