"use client";

// The in-page Achievements line: the ONE badge you're closest to earning on the
// screen you're standing on, and what to do about it.
//
// Deliberately one line, not the three-row block from the design mock. This sits
// at the BOTTOM of long mobile pages, below the fold — a tall block there would
// mostly go unseen, and a collapsed one is worse still, because nobody expands a
// row whose payoff they can't see. Ambient awareness ("am I close to anything?")
// has to be free. The full ladder is a browse, and it belongs in the Awards
// pyramid, which the trophy meter already opens.

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import type { SurfaceNearest } from "@/lib/achievements/useBadgeStats";

// Bronze / silver / gold. The metal is the reward a teen reads instantly — no
// number, no percentage. "High Signal" would have meant nothing to them.
const METAL: Record<string, { ring: string; ink: string; fill: string }> = {
  bronze: { ring: "#C08457", ink: "#E8B98F", fill: "rgba(192,132,87,0.13)" },
  silver: { ring: "#C6CBD6", ink: "#E3E7EF", fill: "rgba(198,203,214,0.13)" },
  gold: { ring: "#E8C77E", ink: "#F4DFAE", fill: "rgba(232,199,126,0.15)" },
};

const UNEARNED = {
  ring: "rgba(255,255,255,0.10)",
  ink: "rgba(238,241,251,0.30)",
  fill: "transparent",
};

export function NearestBadgeLine({
  nearest,
  accentRgb,
}: {
  nearest: SurfaceNearest | null;
  accentRgb: string;
}) {
  // Nothing left to chase on this screen — say nothing rather than invent a task.
  if (!nearest || !nearest.nextTier) return null;

  // The ring shows what you've ALREADY got, so an unearned badge reads as an
  // empty outline waiting to be filled.
  const metal = nearest.tier !== "nothing" ? METAL[nearest.tier] : UNEARNED;
  const pct =
    nearest.target > 0
      ? Math.max(0, Math.min(100, (nearest.current / nearest.target) * 100))
      : 0;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      aria-label={`${nearest.name} — ${nearest.current} of ${nearest.target}. ${
        nearest.hint ?? ""
      } Open your Awards.`}
      className="group mt-2 flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition hover:bg-white/[0.03] active:opacity-70"
    >
      <span
        aria-hidden
        className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[12px] leading-none"
        style={{
          border: `1.5px solid ${metal.ring}`,
          background: metal.fill,
          color: metal.ink,
          boxShadow:
            nearest.tier === "gold" ? "0 0 12px rgba(232,199,126,0.22)" : undefined,
        }}
      >
        {nearest.glyph}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13px] font-semibold tracking-[0.1px] text-white/72">
            {nearest.name}
          </span>
          <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-white/38">
            {nearest.current}/{nearest.target}
          </span>
        </span>

        <span
          aria-hidden
          className="mt-1.5 block h-[3px] w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <span
            className="block h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background: `rgb(${accentRgb})`,
              boxShadow: `0 0 8px rgba(${accentRgb},0.5)`,
            }}
          />
        </span>

        {/* The hint is the whole point of the line — it says what to DO. Never
            truncate it: "Answer twenty-five story questi…" is worse than the two
            lines it costs to say it. */}
        {nearest.hint ? (
          <span className="mt-1.5 block text-[12px] font-medium leading-[1.4] tracking-[0.2px] text-white/40">
            {nearest.hint}
          </span>
        ) : null}
      </span>

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}
