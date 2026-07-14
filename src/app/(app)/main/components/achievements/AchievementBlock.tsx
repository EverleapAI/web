"use client";

// The achievement block: the trophies, and the one badge you're closest to.
//
// This used to render progress bars — three for the story sections, or one for a
// single badge — with the trophy meter underneath. That was the same fact told
// twice. The bars said "you are 60% of the way through this screen's badges"; the
// trophies said "you are 11 of 24 through all of them". Two meters, two scales,
// one message, and the bars only ever meant anything to a user who hadn't finished
// their story yet.
//
// So the bars are gone and the trophies carry it. But trophies can only ever say
// HOW FAR — ten icons mapped onto twenty-four badges is a proportion, and a
// proportion cannot name anything. So the sentence underneath does the naming:
// which badge is next, and what it is waiting for. Feeling on top, fact below.
//
// The meter is the door to Awards; the line beneath it is a readout and taps
// nowhere.

import * as React from "react";

import type {
  SurfaceBlock,
  BlockItem,
  BadgeStats,
} from "@/lib/achievements/useBadgeStats";

import { AwardsMeter } from "./AwardsMeter";

const GOLD = "rgba(232,199,126,0.92)";

const METAL: Record<string, { line: string; ink: string; fill: string }> = {
  bronze: { line: "#C08457", ink: "#E8B98F", fill: "rgba(192,132,87,0.14)" },
  silver: { line: "#C6CBD6", ink: "#E3E7EF", fill: "rgba(198,203,214,0.14)" },
  gold: { line: "#E8C77E", ink: "#F4DFAE", fill: "rgba(232,199,126,0.16)" },
};

type NextUp = { name: string; detail: string; glyph: string; tier: string };

/**
 * The badge this screen is closest to, and what it's waiting for.
 *
 * A "single" block already IS the nearest badge — the engine picked it — and it
 * carries the hint written for exactly this job. A "group" (the three story
 * sections) has no hint, so the count does the work: the first section that
 * isn't finished, and how far into it you are.
 */
function nextUp(block: SurfaceBlock): NextUp | null {
  if (!block) return null;

  if (block.kind === "single") {
    const b = block.badge;
    const left = Math.max(0, b.target - b.current);

    return {
      name: b.name,
      // The hint is written for exactly this job, but older badges don't all
      // carry one — fall back to the count, which is always true.
      detail: b.hint?.trim() || `${left} to go.`,
      glyph: b.glyph,
      tier: b.tier,
    };
  }

  const unfinished: BlockItem | undefined = block.items.find(
    (i) => i.tier !== "gold"
  );

  // Every section is gold — the medal is the whole point of the group, so say so.
  if (!unfinished) {
    return {
      name: block.medal.name,
      detail: "Earned.",
      glyph: block.medal.glyph,
      tier: block.medal.tier,
    };
  }

  const left = Math.max(0, unfinished.target - unfinished.current);

  return {
    name: unfinished.name,
    detail:
      left > 0
        ? `${left} more ${left === 1 ? "answer" : "answers"}.`
        : `${unfinished.current} of ${unfinished.target}.`,
    glyph: unfinished.glyph,
    tier: unfinished.tier,
  };
}

function Medal({ glyph, tier }: { glyph: string; tier: string }) {
  const m = METAL[tier];

  return (
    <span
      aria-hidden
      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] leading-none"
      style={
        m
          ? { border: `1.5px solid ${m.line}`, background: m.fill, color: m.ink }
          : {
              // Not yet earned: a dashed outline, visibly waiting to be filled.
              border: "1.5px dashed rgba(255,255,255,0.13)",
              color: "rgba(238,241,251,0.26)",
            }
      }
    >
      {glyph}
    </span>
  );
}

export function AchievementBlock({
  block,
  stats,
}: {
  block: SurfaceBlock;
  /** Feeds the awards meter without a second /api/achievements call. */
  stats?: BadgeStats | null;
}) {
  const next = nextUp(block);

  return (
    <div className="space-y-2.5">
      {/* The trophies — how far, and the labelled door to the collection. */}
      <AwardsMeter stats={stats} />

      {/* The naming. What the trophies structurally cannot say. */}
      {next ? (
        <div className="flex items-center gap-2.5 px-1">
          <Medal glyph={next.glyph} tier={next.tier} />
          <p className="min-w-0 text-[12.5px] leading-[1.45] text-white/44">
            <span className="font-semibold" style={{ color: GOLD }}>
              Next up: {next.name}
            </span>{" "}
            — {next.detail}
          </p>
        </div>
      ) : null}
    </div>
  );
}
