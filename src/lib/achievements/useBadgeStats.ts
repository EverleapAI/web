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

export type SurfaceProgress = {
  nearest: SurfaceNearest | null;
  earnedCount: number;
  totalCount: number;
};

export type BadgeStats = {
  earnedCount: number;
  totalCount: number;
  /** Per-screen progress, rides along on the same request. */
  surfaces: Partial<Record<Surface, SurfaceProgress>>;
};

export function useBadgeStats(): BadgeStats | null {
  const [stats, setStats] = React.useState<BadgeStats | null>(null);

  React.useEffect(() => {
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
  }, []);

  return stats;
}
