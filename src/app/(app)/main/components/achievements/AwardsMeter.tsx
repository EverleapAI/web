"use client";

// The awards meter: the one control, on every main page, that opens Awards.
//
// Ten trophies stand for every badge there is; they fill to the share you've
// earned (13 of 24 -> five and a half lit). The row is deliberately NOT a chart
// of any one screen's progress — the bars above it already do that job, on a
// different scale, and letting a reader tap those bars to land on the badges page
// is what this component exists to fix. The bars are a readout; this is the door.
//
// The caption carries the real number, because a half-lit trophy is a feeling,
// not a fact — nobody should have to count icons to learn they have 13 of 24.

import * as React from "react";
import { ChevronRight, Trophy } from "lucide-react";

import { emitOpenAchievements, type BadgeSurface } from "@/lib/actionsBus";
import { useBadgeStats, type BadgeStats } from "@/lib/achievements/useBadgeStats";

const TROPHIES = 10;

const LIT = "rgba(232,199,126,0.92)";
const UNLIT = "rgba(255,255,255,0.10)";

/** Lit trophies, to the nearest half, out of ten. */
function litCount(earned: number, total: number): number {
  if (total <= 0) return 0;
  const share = Math.max(0, Math.min(1, earned / total));
  return Math.round(share * TROPHIES * 2) / 2;
}

/** A trophy filled left-to-right by `fill` (0, 0.5 or 1) — the half is clipped. */
function MeterTrophy({ fill }: { fill: number }) {
  return (
    <span className="relative inline-flex h-[15px] w-[15px] shrink-0">
      <Trophy className="h-[15px] w-[15px]" style={{ color: UNLIT }} />
      {fill > 0 ? (
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <Trophy className="h-[15px] w-[15px]" style={{ color: LIT }} />
        </span>
      ) : null}
    </span>
  );
}

export function AwardsMeter({
  stats,
  surface,
  className,
}: {
  /** Pass the page's existing stats to avoid a second /api/achievements call. */
  stats?: BadgeStats | null;
  /** Awards opens scoped to this screen when given. */
  surface?: BadgeSurface;
  className?: string;
}) {
  // Only fetch when the page didn't already have the numbers (Actions, Me).
  const own = useBadgeStats(stats === undefined);
  const s = stats === undefined ? own : stats;

  if (!s || s.totalCount <= 0) return null;

  const lit = litCount(s.earnedCount, s.totalCount);

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements(surface)}
      aria-label={`Awards — ${s.earnedCount} of ${s.totalCount} badges earned. Open your badges.`}
      className={[
        "group flex w-full items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5 text-left transition hover:bg-white/[0.045] active:opacity-80",
        className ?? "",
      ].join(" ")}
    >
      <span className="min-w-0 flex-1">
        <span aria-hidden className="flex items-center gap-[5px]">
          {Array.from({ length: TROPHIES }).map((_, i) => (
            <MeterTrophy
              key={i}
              fill={Math.max(0, Math.min(1, lit - i))}
            />
          ))}
        </span>

        <span className="mt-1.5 block text-[12.5px] leading-[1.4]">
          <span className="font-semibold" style={{ color: LIT }}>
            Awards
          </span>
          <span className="text-white/40">
            {" · "}
            {s.earnedCount} of {s.totalCount} badges earned
          </span>
        </span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-white/28 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}
