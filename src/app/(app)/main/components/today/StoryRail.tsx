"use client";

// The shared progress motif: "Your story is forming" — the three self-knowledge
// families (motivations / skills / strengths) you've told us about. Tapping it
// opens the achievements pyramid, so progress and reward share one surface.
// When all three are in, it flips to a "story's told" state that points at the
// badge you earned. This is the component we reuse on every main page.

import { Trophy, ChevronRight } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";
import type { Coverage } from "./todayHeart.types";

const STORY_KEYS = ["motivations", "skills", "strengths"] as const;

export function StoryRail({
  coverage,
  accentRgb,
}: {
  coverage: Coverage;
  accentRgb: string;
}) {
  const areas = STORY_KEYS.map((k) =>
    coverage.areas.find((a) => a.key === k)
  ).filter((a): a is Coverage["areas"][number] => Boolean(a));

  if (areas.length === 0) return null;

  const filled = areas.filter((a) => a.filled).length;
  const complete = filled === areas.length;

  return (
    <button
      type="button"
      onClick={() => emitOpenAchievements()}
      className="mt-6 w-full rounded-2xl border border-white/[0.03] bg-white/[0.015] p-3.5 text-left transition hover:border-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">
          {complete ? "Your story's told" : "Your story is forming"}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] tabular-nums text-white/70">
          {complete ? (
            <Trophy className="h-3.5 w-3.5" style={{ color: `rgb(${accentRgb})` }} />
          ) : (
            <span>
              {filled} / {areas.length}
            </span>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-white/30" />
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
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

      <div className="mt-2.5 flex justify-between text-[12.5px] font-medium">
        {areas.map((a) => (
          <span
            key={a.key}
            style={{
              color: a.filled ? `rgba(${accentRgb},0.95)` : "rgba(238,241,251,0.5)",
            }}
          >
            {a.label}
          </span>
        ))}
      </div>
    </button>
  );
}
