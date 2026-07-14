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

import { emitOpenAchievements } from "@/lib/actionsBus";
import { useBadgeStats, type BadgeStats } from "@/lib/achievements/useBadgeStats";

const TROPHIES = 10;

const LIT = "rgba(232,199,126,0.92)";
const UNLIT = "rgba(255,255,255,0.10)";

// Lit trophies, to the nearest half, out of ten — filled by RUNGS, not badges.
//
// This used to fill on "badges with any tier at all", so a user holding 22 of 24
// badges — eleven of them at bronze, with real work still in them — saw a nearly
// full rack and was then handed a to-do list. The meter was the thing lying. A
// rung is one tier a badge actually offers, so the fraction now moves every time
// you climb, and only reads full when there is genuinely nothing left.
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
  className,
}: {
  /** Pass the page's existing stats to avoid a second /api/achievements call. */
  stats?: BadgeStats | null;
  className?: string;
}) {
  // Only fetch when the page didn't already have the numbers (Actions, Me).
  const own = useBadgeStats(stats === undefined);
  const s = stats === undefined ? own : stats;

  if (!s || s.totalCount <= 0) return null;

  // Fill on rungs; label on gold. Older payloads have neither, so fall back to the
  // badge count rather than rendering an empty rack.
  const lit =
    s.rungsTotal > 0
      ? litCount(s.rungsEarned, s.rungsTotal)
      : litCount(s.earnedCount, s.totalCount);
  const gold = s.goldCount ?? 0;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label={`Awards — ${gold} of ${s.totalCount} awards at gold. Open your badges.`}
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
            {gold} of {s.totalCount} at gold
          </span>
        </span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-white/28 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}
