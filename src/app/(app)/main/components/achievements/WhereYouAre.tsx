"use client";

// "Where you are" — the same section on every main screen, in the same place.
//
// It is one card: the trophies (how far), the badge you are closest to (which),
// and a button that actually goes there (how). That last part is the point. The
// line used to read "Next up: Strengths — 7 more answers" and then stop, which
// tells someone exactly what they need and leaves them to work out where to do
// it. A fact with no door reads as helpful and behaves as a wall.
//
// The destination is not guessed here. The badge engine knows which condition is
// blocking the badge, and that condition is the only thing that knows the answer,
// so `route` and `cta` come down with the block.
//
// PLACEMENT: this always sits AFTER the screen's agentic entry, never above it.
// The agent's read is why you are on the page; progress is context for it. On
// Insights, Explore and Actions the block used to sit at the very top, so the
// first thing the app said to you was a scoreboard.

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";

import type {
  SurfaceBlock,
  BlockItem,
  BadgeStats,
} from "@/lib/achievements/useBadgeStats";
import { PROSE_CLASS, PROSE_STYLE, TEXT_SECONDARY } from "@/lib/ui/prose";

import { SectionCard } from "../ui/SectionCard";
import { AwardsMeter } from "./AwardsMeter";

const GOLD = "rgba(232,199,126,0.92)";
const GOLD_RGB = "232,199,126";

const METAL: Record<string, { line: string; ink: string; fill: string }> = {
  bronze: { line: "#C08457", ink: "#E8B98F", fill: "rgba(192,132,87,0.14)" },
  silver: { line: "#C6CBD6", ink: "#E3E7EF", fill: "rgba(198,203,214,0.14)" },
  gold: { line: "#E8C77E", ink: "#F4DFAE", fill: "rgba(232,199,126,0.16)" },
};

type NextUp = {
  slug: string;
  name: string;
  detail: string;
  glyph: string;
  tier: string;
  route: string | null;
  cta: string | null;
};

/**
 * The badge this screen is closest to, what it wants, and where to do it.
 *
 * A "single" block already IS the nearest badge — the engine picked it — and it
 * carries the hint written for exactly this job. A "group" (the three story
 * sections) has no hint, so the count does the work: the first section that isn't
 * finished, and how far into it you are.
 */
export function nextUp(block: SurfaceBlock): NextUp | null {
  if (!block) return null;

  if (block.kind === "single") {
    const b = block.badge;
    const left = Math.max(0, b.target - b.current);

    return {
      slug: b.slug,
      name: b.name,
      detail: b.hint?.trim() || `${left} to go.`,
      glyph: b.glyph,
      tier: b.tier,
      route: b.route ?? null,
      cta: b.cta ?? null,
    };
  }

  const unfinished: BlockItem | undefined = block.items.find(
    (i) => i.tier !== "gold"
  );

  // Every section is gold — the medal is the whole point of the group, so say so.
  if (!unfinished) {
    return {
      slug: block.medal.slug,
      name: block.medal.name,
      detail: "Earned.",
      glyph: block.medal.glyph,
      tier: block.medal.tier,
      route: null,
      cta: null,
    };
  }

  const left = Math.max(0, unfinished.target - unfinished.current);

  return {
    slug: unfinished.slug,
    name: unfinished.name,
    detail:
      left > 0
        ? `${left} more ${left === 1 ? "answer" : "answers"}.`
        : `${unfinished.current} of ${unfinished.target}.`,
    glyph: unfinished.glyph,
    tier: unfinished.tier,
    route: unfinished.route ?? null,
    cta: unfinished.cta ?? null,
  };
}

/**
 * Where you stand across the whole collection, in a sentence.
 *
 * The card is called "Where you are" and it is about the BIG picture, but the
 * only sentence in it was about the story — so a user who had answered every
 * question in the app read "the picture's complete" directly above a nudge
 * telling them to go do more. Both were true. Together they were nonsense.
 *
 * So the sentence now describes the collection, and it names the thing people
 * actually get wrong: a badge you have STARTED is not a badge you have FINISHED.
 * Eleven bronzes and eleven golds are not the same twenty-two.
 */
export function achievementsLead(stats: BadgeStats | null | undefined): string | null {
  if (!stats || stats.totalCount <= 0) return null;

  const total = stats.totalCount;
  const gold = stats.goldCount ?? 0;
  const started = stats.earnedCount ?? 0;
  const partway = Math.max(0, started - gold);
  const untouched = Math.max(0, total - started);

  if (gold >= total) {
    return "Every award, all the way to gold. There is nothing left to chase here — which is its own kind of finished.";
  }

  if (started === 0) {
    return `No awards yet. All ${total} of them light up as you tell your story, explore a direction, and try things for real.`;
  }

  // The sentence has one job: explain why a nearly-full rack still comes with a
  // list of things to do.
  const parts: string[] = [
    `${gold} of your ${total} awards ${gold === 1 ? "is" : "are"} gold`,
  ];

  if (partway > 0) {
    parts.push(
      `${partway} more ${partway === 1 ? "is" : "are"} part-way there`
    );
  }
  if (untouched > 0) {
    parts.push(
      `${untouched} ${untouched === 1 ? "hasn't" : "haven't"} started`
    );
  }

  const standing =
    parts.length === 1
      ? `${parts[0]}.`
      : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}.`;

  return `${standing} The rest move when you explore, try things, and tell me how they went.`;
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

/**
 * The inner block — trophies, the naming, and the door. Used on its own by Today,
 * which supplies its own card and its own story lead above it.
 */
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
      {/* The trophies — a readout. They used to be the door to Awards as well,
          which made two doors to the same room from one card. */}
      <AwardsMeter stats={stats} interactive={false} />

      {/* The one door, and the only one.
          "Next up: Steadfast" opens Steadfast — not the collection, the badge —
          and the badge is where the power now lives: it shows the rung you are on,
          what the next one wants, and a button that goes and earns it. A pill here
          would only ever know the category; the badge knows the whole story. */}
      {next ? (
        <button
          type="button"
          onClick={() => emitOpenAchievements(next.slug)}
          className="group flex w-full items-center gap-2.5 rounded-xl px-1 py-1 text-left transition hover:bg-white/[0.03] active:opacity-80"
          aria-label={`Next up: ${next.name}. ${next.detail} Open this award.`}
        >
          <Medal glyph={next.glyph} tier={next.tier} />
          <p className="min-w-0 flex-1 text-[12.5px] leading-[1.45] text-white/44">
            <span className="font-semibold" style={{ color: GOLD }}>
              Next up: {next.name}
            </span>{" "}
            — {next.detail}
          </p>
          <ChevronRight
            className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
            style={{ color: `rgba(${GOLD_RGB},0.55)` }}
          />
        </button>
      ) : null}
    </div>
  );
}

/**
 * The whole section, card and all — what Insights, Explore and Actions render.
 * Today builds its own card because it has a story lead to put above the block.
 */
export function WhereYouAre({
  block,
  stats,
  lead,
  className,
}: {
  block: SurfaceBlock;
  stats?: BadgeStats | null;
  /** Optional line above the trophies. Today uses this for the story sentence. */
  lead?: React.ReactNode;
  className?: string;
}) {
  // Nothing earned and nothing to chase — an empty trophy rack is not a section.
  if (!stats || stats.totalCount <= 0) return null;

  return (
    <SectionCard tone="amber" className={`!px-5 !py-4 ${className ?? ""}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[14px] leading-none"
          style={{
            color: `rgb(${GOLD_RGB})`,
            background: `rgba(${GOLD_RGB},0.08)`,
            border: `1px solid rgba(${GOLD_RGB},0.18)`,
          }}
        >
          ◆
        </span>
        <span
          className="text-[14px] font-semibold tracking-[0.005em]"
          style={{ color: TEXT_SECONDARY }}
        >
          Where you are
        </span>
      </div>

      {/* Without a lead the card is a scoreboard with no explanation of itself.
          Every screen gets the standing sentence; Today overrides it while the
          story is still worth nudging. */}
      {lead ?? achievementsLead(stats) ? (
        <div
          className={`mb-4 max-w-[640px] text-[19px] ${PROSE_CLASS}`}
          style={PROSE_STYLE}
        >
          {lead ?? achievementsLead(stats)}
        </div>
      ) : null}

      <AchievementBlock block={block} stats={stats} />
    </SectionCard>
  );
}
