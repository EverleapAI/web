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
  /** Where to go to move this badge, and what the button says. */
  route?: string | null;
  cta?: string | null;
};

/** One badge inside a group, with where it currently stands. */
export type BlockItem = {
  slug: string;
  name: string;
  glyph: string;
  tier: "nothing" | "bronze" | "silver" | "gold";
  current: number;
  target: number;
  route?: string | null;
  cta?: string | null;
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

// Awards is one collection however you open it, so there is nothing to scope to
// and no `nearest`/`slugs` here. `block` is what a screen renders.
export type SurfaceProgress = {
  block: SurfaceBlock;
  earnedCount: number;
  totalCount: number;
};

export type BadgeStats = {
  /** Badges with ANY tier. Counts a bronze the same as a gold — do not meter on it. */
  earnedCount: number;
  totalCount: number;
  /** Badges actually finished. */
  goldCount: number;
  /**
   * Rungs, not badges. "22 of 24 earned" read as 92% done while eleven badges
   * still had work in them; the trophies were measuring what you'd touched, not
   * what you'd finished. Rungs earned over rungs available is the honest fill.
   */
  rungsEarned: number;
  rungsTotal: number;
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
          goldCount: Number(data.goldCount ?? 0),
          // Zero means "this payload predates rungs" — the meter falls back to the
          // badge count rather than rendering an empty rack.
          rungsEarned: Number(data.rungsEarned ?? 0),
          rungsTotal: Number(data.rungsTotal ?? 0),
          surfaces: (data.surfaces ?? {}) as BadgeStats["surfaces"],
        });
      } catch {
        // Keep whatever we last had.
      }
    }

    // Deliberately NOT cached: this call re-evaluates and awards badges server
    // side, so a cached response would quietly stop people earning them. What it
    // can do is get out of the way — it took ~1.2s on every path page, competing
    // with the fetch that actually puts content on screen. The trophy meter is
    // ambient, so it waits for the browser to be idle before asking.
    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? (cb: () => void) =>
            (window as unknown as { requestIdleCallback: (c: () => void, o?: { timeout: number }) => number })
              .requestIdleCallback(cb, { timeout: 2000 })
        : (cb: () => void) => window.setTimeout(cb, 400);
    const handle = idle(() => {
      if (alive) load();
    });

    const onEarned = () => load();
    window.addEventListener(BADGE_EARNED, onEarned);
    return () => {
      alive = false;
      const w = window as unknown as { cancelIdleCallback?: (h: number) => void };
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      window.removeEventListener(BADGE_EARNED, onEarned);
    };
  }, [enabled]);

  return stats;
}
