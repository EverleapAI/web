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

import { emitOpenAchievements, type BadgeSurface } from "@/lib/actionsBus";
import type { SurfaceBlock, BlockItem } from "@/lib/achievements/useBadgeStats";

// Metal lives on the MEDAL only — never on the bars.
//
// A first-time user has no idea what bronze means. It's a concept, and a coloured
// bar can't teach one: they just see an orange bar and two grey ones. Metal works
// in the Awards modal, where the badge is named and explained; it does not work as
// an unlabelled colour on a progress meter.
//
// Colouring the bars by tier also meant they were filled SOLID regardless of
// progress — one answer of seven rendered as a complete bar. The bar was showing
// what you'd earned, not how far you'd got, which is the one thing a progress bar
// exists to say.
const METAL: Record<string, { line: string; ink: string; fill: string }> = {
  bronze: { line: "#C08457", ink: "#E8B98F", fill: "rgba(192,132,87,0.14)" },
  silver: { line: "#C6CBD6", ink: "#E3E7EF", fill: "rgba(198,203,214,0.14)" },
  gold: { line: "#E8C77E", ink: "#F4DFAE", fill: "rgba(232,199,126,0.16)" },
};

const DIM_BAR = "rgba(255,255,255,0.09)";
const ACCENT = "rgb(182,160,255)";
const ACCENT_GLOW = "0 0 8px rgba(182,160,255,0.5)";

/** How full this badge is, as a percentage of its next rung. Gold = done = full. */
function pctOf(item: { tier: string; current: number; target: number }): number {
  if (item.tier === "gold") return 100;
  if (item.target <= 0) return 0;
  return Math.max(0, Math.min(100, (item.current / item.target) * 100));
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

/** Sibling badges side by side — the three story sections, each filling as you go. */
function Group({ items }: { items: BlockItem[] }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex gap-1.5">
        {items.map((item) => {
          const pct = pctOf(item);

          return (
            <span
              key={item.slug}
              className="h-[7px] flex-1 overflow-hidden rounded-full"
              style={{ background: DIM_BAR }}
            >
              <span
                className="block h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${pct}%`,
                  background: ACCENT,
                  boxShadow: pct > 0 ? ACCENT_GLOW : undefined,
                }}
              />
            </span>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[12px] font-medium">
        {items.map((item) => (
          <span
            key={item.slug}
            className="flex-1 last:text-right [&:nth-child(2)]:text-center"
            style={{
              color:
                item.tier === "nothing"
                  ? "rgba(238,241,251,0.32)"
                  : "rgba(182,160,255,0.95)",
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
                  ? { background: ACCENT, boxShadow: ACCENT_GLOW }
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
              background: ACCENT,
              boxShadow: ACCENT_GLOW,
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

export function AchievementBlock({
  block,
  surface,
}: {
  block: SurfaceBlock;
  /** The screen this block is on — Awards opens scoped to it. */
  surface?: BadgeSurface;
}) {
  if (!block) return null;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements(surface)}
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
