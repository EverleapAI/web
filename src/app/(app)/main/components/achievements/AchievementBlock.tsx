"use client";

// The achievement block: one meter, one goal, one reward.
//
// This replaces the three story bars + the trophy meter + the separate badge line
// that used to stack up here. Those were three progress meters on three different
// scales, two of which were secretly the same data — Motivations / Strengths /
// Skills are now badges, so the bars ARE the badge block rather than a bespoke
// widget sitting next to it.
//
// It never expires. The story runs out in a week; badges don't. Once the sections
// are all gold the block re-points at whatever is next, so the same furniture keeps
// working long after the story is told.

import * as React from "react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import type { SurfaceBlock, BlockItem } from "@/lib/achievements/useBadgeStats";

// Bronze / silver / gold — the reward a teen reads without being taught it.
const METAL: Record<string, { line: string; ink: string; fill: string }> = {
  bronze: { line: "#C08457", ink: "#E8B98F", fill: "rgba(192,132,87,0.14)" },
  silver: { line: "#C6CBD6", ink: "#E3E7EF", fill: "rgba(198,203,214,0.14)" },
  gold: { line: "#E8C77E", ink: "#F4DFAE", fill: "rgba(232,199,126,0.16)" },
};

const DIM_BAR = "rgba(255,255,255,0.09)";

function barColor(tier: string): string {
  return METAL[tier]?.line ?? DIM_BAR;
}

/** The medal at the end of the row — the thing the whole block adds up to. */
function Medal({ item }: { item: BlockItem }) {
  const m = METAL[item.tier];

  return (
    <span
      aria-hidden
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[16px] leading-none"
      style={
        m
          ? {
              border: `1.5px solid ${m.line}`,
              background: m.fill,
              color: m.ink,
              boxShadow:
                item.tier === "gold" ? "0 0 18px rgba(232,199,126,0.25)" : undefined,
            }
          : {
              // Not yet earned: a dashed outline, visibly waiting to be filled.
              border: "1.5px dashed rgba(255,255,255,0.13)",
              color: "rgba(238,241,251,0.26)",
            }
      }
    >
      {item.glyph}
    </span>
  );
}

/** Sibling badges side by side — the three story sections. */
function Group({ items }: { items: BlockItem[] }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex gap-1.5">
        {items.map((item) => (
          <span
            key={item.slug}
            className="h-[7px] flex-1 rounded-full transition-colors"
            style={{
              background: barColor(item.tier),
              boxShadow:
                item.tier === "gold"
                  ? "0 0 9px rgba(232,199,126,0.45)"
                  : item.tier !== "nothing"
                    ? `0 0 8px ${barColor(item.tier)}55`
                    : undefined,
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[12px] font-medium">
        {items.map((item) => (
          <span
            key={item.slug}
            className="flex-1 last:text-right [&:nth-child(2)]:text-center"
            style={{
              color: METAL[item.tier]?.ink ?? "rgba(238,241,251,0.32)",
            }}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * One badge working toward its next rung. Shape follows the goal: something you
 * can count gets pips you can count; a big number gets a proportion. Never a bar
 * for five things, never five pips for fifty.
 */
const PIP_MAX = 5;

function Single({
  badge,
}: {
  badge: Extract<SurfaceBlock, { kind: "single" }>["badge"];
}) {
  const pips = badge.target <= PIP_MAX;
  const pct =
    badge.target > 0
      ? Math.max(0, Math.min(100, (badge.current / badge.target) * 100))
      : 0;

  return (
    <div className="min-w-0 flex-1">
      {pips ? (
        <div className="flex gap-1.5">
          {Array.from({ length: badge.target }).map((_, i) => (
            <span
              key={i}
              className="h-[7px] flex-1 rounded-full"
              style={
                i < badge.current
                  ? {
                      background: "rgb(182,160,255)",
                      boxShadow: "0 0 8px rgba(182,160,255,0.5)",
                    }
                  : { background: DIM_BAR }
              }
            />
          ))}
        </div>
      ) : (
        <div
          className="h-[7px] w-full overflow-hidden rounded-full"
          style={{ background: DIM_BAR }}
        >
          <span
            className="block h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background: "rgb(182,160,255)",
              boxShadow: "0 0 8px rgba(182,160,255,0.5)",
            }}
          />
        </div>
      )}

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-[12px] font-medium leading-[1.4] text-white/44">
          {badge.hint}
        </span>
        <span className="shrink-0 text-[12px] font-semibold tabular-nums text-white/36">
          {badge.current}/{badge.target}
        </span>
      </div>
    </div>
  );
}

export function AchievementBlock({ block }: { block: SurfaceBlock }) {
  if (!block) return null;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label="Your achievements — open your Awards"
      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.03] bg-white/[0.015] px-3.5 py-3 text-left transition hover:bg-white/[0.03] active:opacity-80"
    >
      {block.kind === "group" ? (
        <Group items={block.items} />
      ) : (
        <Single badge={block.badge} />
      )}

      <Medal
        item={
          block.kind === "group"
            ? block.medal
            : {
                slug: block.badge.slug,
                name: block.badge.name,
                glyph: block.badge.glyph,
                tier: block.badge.tier,
                current: block.badge.current,
                target: block.badge.target,
              }
        }
      />
    </button>
  );
}
