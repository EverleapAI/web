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
// not a fact — nobody should have to count icons to learn where they are. Row and
// caption measure the SAME thing (rungs climbed); they used to disagree, showing
// five and a half trophies beside "8 of 24 at gold".

import * as React from "react";
import { ChevronRight, Trophy } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import { useBadgeStats, type BadgeStats } from "@/lib/achievements/useBadgeStats";
import { RowTitle } from "@/lib/ui/card";

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
  interactive = true,
}: {
  /** Pass the page's existing stats to avoid a second /api/achievements call. */
  stats?: BadgeStats | null;
  className?: string;
  /**
   * Inside "Where you are" the trophies are a READOUT, not a door.
   *
   * They used to be a button to Awards, sitting directly above "Next up: X" which
   * is now also a button to Awards — two doors to the same room, from one small
   * card, one of which lands you nowhere in particular. The named one wins: it
   * opens the badge you are actually working on. Elsewhere (the Me page, the
   * footer) the meter is still the way in, because there is nothing else there.
   */
  interactive?: boolean;
}) {
  // Only fetch when the page didn't already have the numbers (Actions, Me).
  const own = useBadgeStats(stats === undefined);
  const s = stats === undefined ? own : stats;

  if (!s || s.totalCount <= 0) return null;

  // THE ROW AND THE CAPTION NOW MEASURE THE SAME THING.
  //
  // The trophies filled on RUNGS while the caption counted GOLD, so the screen
  // showed five and a half of ten lit beside "8 of 24 at gold" — two different
  // measures side by side, and a reader who tried to reconcile them couldn't.
  // Rungs is the honest one: it moves every time you climb a tier, where gold
  // stays still through all the work that leads up to it.
  const onRungs = s.rungsTotal > 0;
  const lit = onRungs
    ? litCount(s.rungsEarned, s.rungsTotal)
    : litCount(s.earnedCount, s.totalCount);
  const caption = onRungs
    ? `${s.rungsEarned} of ${s.rungsTotal} rungs climbed`
    : // Older payloads carry no rung counts; say what they can actually support
      // rather than a number the row isn't drawing.
      `${s.earnedCount} of ${s.totalCount} started`;

  // A READOUT GETS NO BOX; A BUTTON DOES.
  //
  // This drew its own border + tint unconditionally, which was invisible when the
  // SectionCard around it was also invisible (1.024:1 — it was, in fact, the only
  // boundary on the screen, so it looked like the card). Now that cards are
  // genuinely visible, an inner bordered box inside an outer bordered box reads as
  // clutter — a box in a box, and the cheapest-looking thing on Today.
  //
  // Inside "Where you are" the trophies are a readout (interactive={false}), so
  // they are now just a row. Where the meter really IS the door (the Me page, the
  // footer) it keeps its shell, because there it has to look pressable.
  const shell = [
    "flex w-full items-center gap-3 text-left",
    interactive
      ? "group rounded-panel border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5 transition hover:bg-white/[0.045] active:opacity-80"
      : "cursor-default",
    className ?? "",
  ].join(" ");

  const body = (
    <span className="min-w-0 flex-1">
      {/* AN EYEBROW AND A CHIP, like every other card on these screens.
          This was the one element with neither — the system's whole identity
          mechanism (glyph + eyebrow + CTA) was switched off for it, so it read
          as something that had drifted in from another page. Tom: does it "need
          some form of header or separator to make it less lost looking". A
          separator would have treated the symptom; a rule above it divides the
          page further. What it needed was to speak the page's language. */}
      <span className="mb-2 flex items-center gap-2">
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-control"
          style={{ background: "rgba(232,199,126,0.13)", color: LIT }}
        >
          <Trophy className="h-3.5 w-3.5" />
        </span>
        <span
          className="text-micro font-bold uppercase tracking-eyebrow"
          style={{ color: "rgba(232,199,126,0.92)" }}
        >
          Awards
        </span>
      </span>

      <span aria-hidden className="flex items-center gap-[5px]">
        {Array.from({ length: TROPHIES }).map((_, i) => (
          <MeterTrophy key={i} fill={Math.max(0, Math.min(1, lit - i))} />
        ))}
      </span>

      <span className="mt-1.5 block">
        <RowTitle style={{ color: LIT }}>{caption}</RowTitle>
      </span>
    </span>
  );

  // A readout. No chevron, because there is nothing to tap.
  if (!interactive) {
    return (
      <div className={shell} aria-label={`Awards — ${caption}.`}>
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label={`Awards — ${caption}. Open your badges.`}
      className={shell}
    >
      {body}
      <ChevronRight className="h-4 w-4 shrink-0 text-white/28 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}
