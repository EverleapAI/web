"use client";

// The global awards counter: "13 of 24 badges". Sits in the page's top row, not
// inside the achievement block — the block is about ONE goal, this is about all of
// them, and mixing the two is what made that area read as a dashboard.
//
// It replaces the old ten-trophy meter, which needed ten icons to say what a
// fraction says in six characters.

import * as React from "react";
import { Trophy } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import type { BadgeStats } from "@/lib/achievements/useBadgeStats";

export function AwardsChip({ stats }: { stats: BadgeStats | null }) {
  if (!stats || stats.totalCount <= 0) return null;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label={`${stats.earnedCount} of ${stats.totalCount} badges earned — open your Awards`}
      className="group flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-white/[0.05] active:opacity-70"
    >
      <Trophy
        className="h-3 w-3 shrink-0"
        style={{ color: "rgba(232,199,126,0.75)" }}
      />
      <span className="text-[11px] font-semibold tabular-nums text-white/40">
        {stats.earnedCount}/{stats.totalCount}
      </span>
    </button>
  );
}
