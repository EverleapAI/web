"use client";

// The shared progress motif: "Your story is forming" — the three self-knowledge
// families (motivations / skills / strengths) you've told us about. The Awards
// control opens the achievements pyramid, so progress and reward share one
// surface. When all three are in, it flips to a "story's told" state.

import * as React from "react";
import { Trophy, ChevronRight } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import { useBadgeStats, type BadgeStats } from "@/lib/achievements/useBadgeStats";
import { NearestBadgeLine } from "../achievements/NearestBadgeLine";
import type { Coverage } from "./todayHeart.types";

// Order must match the story's canonical family order (motivations → strengths
// → skills, as in TodayHeart's STORY_FAMILIES) so the bar reads in the same
// sequence as the story itself.
const STORY_KEYS = ["motivations", "strengths", "skills"] as const;

// How many trophy slots represent 100% of badges earned.
const TROPHY_SLOTS = 10;

// Half a trophy: a dim outline with an accent-filled left half laid over it.
function HalfTrophy({ accentRgb }: { accentRgb: string }) {
  return (
    <span className="relative inline-flex h-3.5 w-3.5 shrink-0">
      <Trophy
        className="absolute inset-0 h-3.5 w-3.5"
        style={{ color: "rgba(238,241,251,0.16)" }}
      />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: "50%" }}
      >
        <Trophy className="h-3.5 w-3.5" style={{ color: `rgb(${accentRgb})` }} />
      </span>
    </span>
  );
}

// A row of trophies that fills to the share of badges earned — e.g. 10 of 20
// badges → 5 trophies, 19 of 20 → 9½. The whole row opens the Awards modal.
function TrophyMeter({
  stats,
  accentRgb,
}: {
  stats: BadgeStats | null;
  accentRgb: string;
}) {
  const total = stats?.totalCount ?? 0;
  const earned = stats?.earnedCount ?? 0;

  // Loaded, but the system has no badges to speak of — show nothing.
  if (stats && total <= 0) return null;

  const ratio = total > 0 ? Math.min(1, earned / total) : 0;
  // Scale to the slot count, snap to the nearest half-trophy.
  const halves = Math.round(ratio * TROPHY_SLOTS * 2) / 2;
  const full = Math.floor(halves);
  const hasHalf = halves - full === 0.5;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label={
        stats
          ? `${earned} of ${total} badges earned — open your Awards`
          : "Open your Awards"
      }
      className="group inline-flex items-center gap-[3px] rounded-full px-1.5 py-1 transition hover:bg-white/[0.04] active:opacity-70"
    >
      {/* Ten trophies plus a label is tight at 390px — without nowrap this wraps
          to "Your / achievements" and the row loses its line. */}
      <span className="mr-2 whitespace-nowrap text-[12px] font-medium tracking-[0.2px] text-white/45">
        Awards
      </span>
      {Array.from({ length: TROPHY_SLOTS }).map((_, i) => {
        if (i < full) {
          return (
            <Trophy
              key={i}
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: `rgb(${accentRgb})` }}
            />
          );
        }
        if (i === full && hasHalf) {
          return <HalfTrophy key={i} accentRgb={accentRgb} />;
        }
        return (
          <Trophy
            key={i}
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "rgba(238,241,251,0.16)" }}
          />
        );
      })}
      <ChevronRight className="ml-0.5 h-3.5 w-3.5 shrink-0 text-white/20 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}

export function StoryRail({
  coverage,
  accentRgb,
  showHeadline = true,
}: {
  coverage: Coverage;
  accentRgb: string;
  // When a lead sentence already introduces the strip (as on Today), hide the
  // built-in "Your story is forming" label so the two don't echo each other —
  // the trophy meter stays, pinned to the right.
  showHeadline?: boolean;
}) {
  const badges = useBadgeStats();

  const areas = STORY_KEYS.map((k) =>
    coverage.areas.find((a) => a.key === k)
  ).filter((a): a is Coverage["areas"][number] => Boolean(a));

  if (areas.length === 0) return null;

  const filled = areas.filter((a) => a.filled).length;
  const complete = filled === areas.length;

  return (
    <div className="w-full rounded-2xl border border-white/[0.03] bg-white/[0.015] px-3.5 py-3">
      {showHeadline ? (
        <div className="mb-2.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/50">
            {complete ? "Your story's told" : "Your story is forming"}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-1.5">
        {areas.map((a) => (
          <span
            key={a.key}
            className="h-[7px] rounded-full transition-colors"
            style={
              a.filled
                ? {
                    background: `rgb(${accentRgb})`,
                    boxShadow: `0 0 8px rgba(${accentRgb},0.5)`,
                  }
                : { background: "rgba(255,255,255,0.09)" }
            }
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[12.5px] font-medium">
        {areas.map((a) => (
          <span
            key={a.key}
            style={{
              color: a.filled ? `rgba(${accentRgb},0.95)` : "rgba(238,241,251,0.34)",
            }}
          >
            {a.label}
          </span>
        ))}
      </div>

      {/* The trophy meter — badge progress + the only tap target (opens Awards).
          Sits at the bottom as the closing footer, filling from the left like a
          meter. */}
      <div className="mt-2">
        <TrophyMeter stats={badges} accentRgb={accentRgb} />
      </div>

      {/* ...and directly beneath it, the one badge you're closest to earning from
          this screen. Today is the only page where this costs no new real estate:
          the rail already existed, so the line lands inside furniture the user has
          already learned. */}
      <NearestBadgeLine
        nearest={badges?.surfaces?.today?.nearest ?? null}
        accentRgb={accentRgb}
      />
    </div>
  );
}
