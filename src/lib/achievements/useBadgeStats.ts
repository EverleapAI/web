"use client";

// Badge progress for the current user, for lightweight indicators (e.g. the
// trophy meter on Today). Reuses the same /api/achievements proxy the modal
// hits, and re-fetches when a badge is earned elsewhere so the meter stays live.
//
// Note: GET /api/achievements also re-evaluates + awards badges server-side, but
// that's idempotent and only the inserting call reports a badge as newly earned,
// so this never double-toasts against the modal's own BadgeSync.

import * as React from "react";

import { BADGE_EARNED } from "@/lib/actionsBus";

export type Surface = "today" | "insights" | "explore" | "actions";

/** The badge you're closest to advancing on a given screen. */
export type SurfaceNearest = {
  slug: string;
  name: string;
  glyph: string;
  accent: string;
  tier: "nothing" | "bronze" | "silver" | "gold";
  nextTier: "bronze" | "silver" | "gold" | null;
  hint: string | null;
  current: number;
  target: number;
};

/** One badge inside a group, with where it currently stands. */
export type BlockItem = {
  slug: string;
  name: string;
  glyph: string;
  tier: "nothing" | "bronze" | "silver" | "gold";
  current: number;
  target: number;
};

/**
 * What this screen's achievement block should render. "group" = sibling badges
 * with a medal that lights when they all land (the three story sections under
 * Story Told). "single" = one badge working toward its next rung.
 */
export type SurfaceBlock =
  | { kind: "group"; items: BlockItem[]; medal: BlockItem }
  | { kind: "single"; badge: SurfaceNearest }
  | null;

export type SurfaceProgress = {
  nearest: SurfaceNearest | null;
  block: SurfaceBlock;
  earnedCount: number;
  totalCount: number;
  /** Every badge this screen can move — Awards opens scoped to these. */
  slugs: string[];
};

export type BadgeStats = {
  earnedCount: number;
  totalCount: number;
  /** Per-screen progress, rides along on the same request. */
  surfaces: Partial<Record<Surface, SurfaceProgress>>;
};

/**
 * @param enabled pass false when the caller already has stats from a parent —
 * this endpoint re-evaluates badges server-side, so a second call is real work.
 */
export function useBadgeStats(enabled = true): BadgeStats | null {
  const [stats, setStats] = React.useState<BadgeStats | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/achievements", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (!alive || !data?.ok) return;
        setStats({
          earnedCount: Number(data.earnedCount ?? 0),
          totalCount: Number(data.total ?? data.badges?.length ?? 0),
          surfaces: (data.surfaces ?? {}) as BadgeStats["surfaces"],
        });
      } catch {
        // Keep whatever we last had.
      }
    }

    load();
    const onEarned = () => load();
    window.addEventListener(BADGE_EARNED, onEarned);
    return () => {
      alive = false;
      window.removeEventListener(BADGE_EARNED, onEarned);
    };
  }, [enabled]);

  return stats;
}
