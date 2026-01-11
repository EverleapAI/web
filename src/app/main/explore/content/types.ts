// src/app/main/explore/content/types.ts
import type { ReactNode } from "react";

/* ============================================================
   Explore content types (DATA ONLY)
   Keep Explore totally separate from Insights.
   ============================================================ */

/** Core lane/area ids (your 5 Explore facades) */
export type ExploreAreaId =
  | "recommendations"
  | "education"
  | "travel"
  | "community"
  | "hobbies";

/** Alias used by the Explore page/controller */
export type ExploreKey = ExploreAreaId;

/** Chip renderer type (one renderer per area) */
export type ExploreChipType = ExploreAreaId;

export type NextMove = {
  id: string;
  title: string;
  blurb: string;
};

/**
 * Mini card used inside each ExploreArea.
 * NOTE: We extended this for Recommendations to match the richer Insights look,
 * but it remains Explore-only.
 */
export type MiniCard = {
  id: string;
  icon: string; // emoji string (kept compatible with existing UI)
  title: string;

  /**
   * Short description (used everywhere).
   * For Recommendations, can be the main "why it fits".
   */
  short: string;

  /**
   * Optional richer fields (Recommendations uses these).
   * Other lanes can ignore them.
   */
  bestFor?: string;
  starterExperiment?: string;

  /**
   * Optional deep link target, if a renderer wants to push somewhere.
   * (e.g. Recommendations -> /main/career/[laneId]?mode=explore)
   */
  href?: string;
};

/**
 * Base content model for each Explore area.
 */
export type ExploreArea = {
  id: ExploreAreaId;
  label: string;
  chip: string;
  glowClass: string; // tailwind gradient classes: "from-... via-... to-..."
  href: string;

  headline: string;
  summary: string;
  hint: string;

  signals: string[];
  nextMoves: NextMove[];
  cards: MiniCard[];

  /** Optional: UI icon (for future index cards/menus) */
  icon?: ReactNode;
};

/* ============================================================
   UI/controller shapes (what page.tsx + renderers consume)
   ============================================================ */

export type ExploreChip = {
  id: string;
  type: ExploreChipType;
  area: ExploreArea;
};

export type ExploreSection = {
  key: ExploreKey;
  label: string;

  title: string;
  subtitle: string;

  chips: ExploreChip[];
};

export type ExploreRendererProps = {
  chip: ExploreChip;
  dark: boolean;
};

/**
 * Loose props variant (lets a renderer accept anything shaped like a section)
 * Helpful while iterating without getting blocked on types.
 */
export type ExploreRendererPropsLoose = {
  section: unknown;
  dark: boolean;
};
