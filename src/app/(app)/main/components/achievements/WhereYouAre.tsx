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
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

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

/**
 * The section a route lands in: "/main/actions/abc-123" -> "/main/actions".
 * Query strings are part of the destination but not of the place.
 */
function sectionOf(route: string | null | undefined): string | null {
  if (!route) return null;
  const path = route.split("?")[0].split("#")[0];
  const parts = path.split("/").filter(Boolean); // ["main", "actions", "abc"]
  if (parts.length < 2) return path || null;
  return `/${parts[0]}/${parts[1]}`;
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
  doorsAlreadyOpen,
}: {
  block: SurfaceBlock;
  /** Feeds the awards meter without a second /api/achievements call. */
  stats?: BadgeStats | null;
  /**
   * Routes this screen ALREADY offers a button for. The badge pill is dropped when
   * it would land in the same place as one of them.
   *
   * Today showed "Reflect on an action" (from Everleaper, whose blocking metric is
   * actions_reflected) directly above a card called "Reflect on your actions" with
   * a button reading "Reflect on it" — two pills, one meaning, stacked. The other
   * one wins every time: it names the actual action and says why. A badge is a
   * reason to go somewhere, and it stops being one the moment the screen is
   * already pointing at the door.
   */
  doorsAlreadyOpen?: (string | null | undefined)[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const next = nextUp(block);

  // Don't offer a door that is already open — either because another button on
  // this screen goes there, or because you are standing in the room.
  const taken = new Set(
    [...(doorsAlreadyOpen ?? []), pathname]
      .map(sectionOf)
      .filter((s): s is string => Boolean(s))
  );
  const showCta = Boolean(
    next?.route && next.cta && !taken.has(sectionOf(next.route) ?? "")
  );

  return (
    <div className="space-y-2.5">
      {/* The trophies — how far, and the labelled door to the collection. */}
      <AwardsMeter stats={stats} />

      {/* The naming — what the trophies structurally cannot say. */}
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

      {/* The door — unless the screen is already holding it open somewhere else. */}
      {showCta && next ? (
        <div className="pt-1.5">
          <button
            type="button"
            onClick={() => router.push(next.route!)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition hover:brightness-110 active:opacity-80"
            style={{
              color: GOLD,
              background: `rgba(${GOLD_RGB},0.08)`,
              border: `1px solid rgba(${GOLD_RGB},0.28)`,
            }}
          >
            <span>{next.cta}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
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
  doorsAlreadyOpen,
}: {
  block: SurfaceBlock;
  stats?: BadgeStats | null;
  /** Optional line above the trophies. Today uses this for the story sentence. */
  lead?: React.ReactNode;
  className?: string;
  /** Routes this screen already has a button for — see AchievementBlock. */
  doorsAlreadyOpen?: (string | null | undefined)[];
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
          className={`mb-4 max-w-[560px] text-[19px] ${PROSE_CLASS}`}
          style={PROSE_STYLE}
        >
          {lead ?? achievementsLead(stats)}
        </div>
      ) : null}

      <AchievementBlock
        block={block}
        stats={stats}
        doorsAlreadyOpen={doorsAlreadyOpen}
      />
    </SectionCard>
  );
}
