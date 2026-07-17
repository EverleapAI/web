// apps/web/src/app/(app)/main/explore/_components/ExploreWorlds.tsx
//
// The five "worlds" grid on the Explore home. Each lane is a world with its own
// light (accent), motif (icon), an evocative subtitle, and — when we have signal
// — a whispered top pick pulled from what we already rank (no new generation).
// This replaces the flat "Worth a real look" list; the agentic whole-life read
// still sits above it, so the agent greets you before the worlds do.
//
// Note the deliberate departure from the Insights "accent only in glyph+eyebrow"
// rule: worlds are a navigation surface where lane colour IS the information, so
// the accent also carries the whisper, the count, and a soft corner halo.

"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

import { LANE_ACCENT, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { LANE_ICON, rgba } from "./exploreUi";

const WORLD_ORDER: Lane[] = ["work", "learning", "world", "impact"]; // play renders full-width below

const WORLD_LABEL: Record<Lane, string> = {
  work: "Career",
  learning: "Learning",
  world: "World",
  impact: "Impact",
  play: "Play",
};

const WORLD_SUB: Record<Lane, string> = {
  work: "Lives built around what you do",
  learning: "Fields worth falling into",
  world: "Places, cultures, ways to live",
  impact: "Making a dent worth making",
  play: "Things worth doing for the joy of it",
};

export type WorldsLane = { lane: Lane; count: number; top: ExplorePath | null };

function WorldCard({ lane, count, top, span2 = false }: WorldsLane & { span2?: boolean }) {
  const accent = LANE_ACCENT[lane];
  const Icon = LANE_ICON[lane];

  const halo = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(130px 96px at 88% 0%, ${rgba(accent, 0.16)}, transparent 70%)` }}
    />
  );
  const iconChip = (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
      style={{ backgroundColor: rgba(accent, 0.13), color: rgba(accent, 0.92) }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
  const countRow = (
    <span className="inline-flex items-center gap-0.5 text-label font-semibold" style={{ color: rgba(accent, 0.95) }}>
      {count} {count === 1 ? "path" : "paths"}
      <ChevronRight className="h-4 w-4" />
    </span>
  );

  return (
    <Link
      href={`/main/explore/${lane}`}
      className={`group relative block overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]${
        span2 ? " sm:col-span-2" : ""
      }`}
    >
      {halo}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-body font-semibold text-ink-strong">{WORLD_LABEL[lane]}</span>
        {iconChip}
      </div>
      <p className="relative mt-1.5 text-label leading-body text-white/60">{WORLD_SUB[lane]}</p>
      {top ? (
        <p
          className="relative mt-2 flex items-start gap-1.5 text-meta leading-snug"
          style={{ color: rgba(accent, 0.9) }}
        >
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{top.card.title}</span>
        </p>
      ) : null}
      <div className="relative mt-2.5">{countRow}</div>
    </Link>
  );
}

export function ExploreWorlds({ lanes }: { lanes: WorldsLane[] }) {
  const byLane = React.useMemo(() => new Map(lanes.map((l) => [l.lane, l])), [lanes]);
  const play = byLane.get("play");

  return (
    <section aria-label="Explore the five worlds">
      <h2 className="mb-3 px-1 text-meta font-semibold uppercase tracking-eyebrow text-white/55">
        Where do you want to wander?
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {WORLD_ORDER.map((lane) => {
          const entry = byLane.get(lane);
          if (!entry) return null;
          return <WorldCard key={lane} {...entry} />;
        })}
        {play ? <WorldCard {...play} span2 /> : null}
      </div>
    </section>
  );
}

export default ExploreWorlds;
