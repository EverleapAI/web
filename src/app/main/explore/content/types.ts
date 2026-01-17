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

/* ============================================================
   Visual Break (Layer 1 Careers emphasis)
   One quiet image moment inserted between narrative + Tiny Task.
   No text overlay. No captions required.
   ============================================================ */

export type VisualBreakAsset = {
  /** Public path, e.g. "/images/explore/careers/game-designer.jpg" */
  src: string;
  /** Intent (safe to ignore today) */
  kind?: "process" | "human" | "place" | "artifact" | "abstract";
  /** Accessibility alt text */
  alt: string;
};

export type VisualBreak = {
  asset: VisualBreakAsset;

  /** Non-blocking hints */
  constraints?: {
    noTextOverlay?: boolean;
    noPolishedStock?: boolean;
  };
};

/* ============================================================
   NEW: Opportunity types (Education + future lanes)
   Curated, real-world “doors to walk through”.
   ============================================================ */

export type ExploreOpportunity = {
  /** Short label users will recognize */
  name: string;

  /** Org / provider (optional but useful for credibility) */
  provider?: string;

  /** Where it happens (city/region) or “Online” */
  location?: string;

  /** Why it’s a good fit / what you’d do there (1 short line) */
  note?: string;

  /** Optional URL you can wire up later in the UI */
  url?: string;

  /** Optional hints: cost/age/season/time commitment */
  meta?: string;
};

export type ExploreOpportunityGroup = {
  /** Nearby / Bay Area / 94901-ish */
  local?: ExploreOpportunity[];

  /** Recognizable programs beyond local region */
  national?: ExploreOpportunity[];

  /** Online-anytime paths */
  online?: ExploreOpportunity[];
};

/**
 * Mini card used inside each ExploreArea.
 * NOTE:
 * - Recommendations is richer, but remains Explore-only.
 * - Layer 1 Careers uses `short` as the canonical narrative source.
 */
export type MiniCard = {
  id: string;
  icon: string; // emoji string
  title: string;

  /**
   * Canonical conversational narrative.
   * Renderer is responsible for paragraph splitting.
   */
  short: string;

  /**
   * Optional structured extensions (safe to ignore by renderers).
   */
  narrative?: string[];
  bestFor?: string;
  starterExperiment?: string;

  /**
   * Recommendations-only (Layer 1 Careers)
   */
  why?: string[]; // card-specific reasons
  hint?: string; // micro nudge / next step
  tags?: string[]; // optional tags/signals

  /**
   * ✅ Visual moment (Layer 1 Careers)
   */
  visualBreak?: VisualBreak;

  /**
   * NEW: Curated opportunities (Education lane now; others later)
   * Keep it small per bucket (3–6).
   */
  opportunities?: ExploreOpportunityGroup;

  /**
   * Optional deep link target
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
  glowClass: string;
  href: string;

  headline: string;
  summary: string;
  hint: string;

  signals: string[];
  nextMoves: NextMove[];
  cards: MiniCard[];

  /** Optional: UI icon (future use) */
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
 * Loose props variant (for iteration without blocking on types)
 */
export type ExploreRendererPropsLoose = {
  section: unknown;
  dark: boolean;
};
