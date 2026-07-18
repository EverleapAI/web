// apps/web/src/app/(app)/main/explore/_data/exploreSchema.ts
//
// The single, unified content schema for every Explore lane.
// See docs/Everleap_Product_Bible/06_Architecture/063_EXPLORE_ARCHITECTURE.md
//
// One `ExplorePath` = one canonical catalog row (user-independent, cacheable).
// Personalization lives separately in `PathMatch` (per-user, never cached).
//
// Phase A note: content is still sourced from local mock modules and the
// per-user match/signal is still computed client-side from localStorage. The
// shape below is the target the mocks are migrated onto so that Phase B can
// swap the *source* (mock module -> DB) without touching the render engines.

/* =============================================================================
   Primitives
============================================================================= */

export type Lane = "work" | "learning" | "world" | "impact" | "play";

export type Rgb = { r: number; g: number; b: number };

/** How a catalog row was produced. Meaningful in Phase B/C; "seed" for mocks. */
export type ContentModel = "seed" | "warm" | "on-demand";

export type Citation = {
  /** Approved source, e.g. "O*NET", "BLS OOH", "UNESCO". */
  source: string;
  label?: string;
  url?: string;
};

/* =============================================================================
   Deck / list level
============================================================================= */

export type PathCard = {
  title: string;
  hook: string;
  description: string;
};

/* =============================================================================
   Spine 1 — Overview ("what it is / why you fit")
============================================================================= */

export type TraitChip = { id: string; label: string };

export type FitSignal = {
  id: string;
  label: string;
  /** 0–100 alignment strength for the signal meter. */
  score: number;
  explanation: string;
};

export type PathOverview = {
  eyebrow?: string;
  title: string;
  hook: string;
  summary: string;
  // The "whole picture" behind summary (the read), shown in the "More" modal.
  // Optional: seed/mock catalog paths may not carry it.
  more?: string;
  whyItPullsYouIn: string[];
  traitChips: TraitChip[];
  fitSignals: FitSignal[];
};

/* =============================================================================
   Spine 2 — Reality ("what it's really like" / a day in the life)
============================================================================= */

export type RealityMoment = {
  id: string;
  timeLabel?: string;
  title: string;
  body: string;
  /** Optional scene photo for the immersive day descent. When absent, the descent
   *  falls back to a generated time-of-day atmosphere. */
  image?: string;
};

export type PathReality = {
  title: string;
  summary: string;
  /** Optional evocative one-liner ("the pulse"). */
  pulse?: string;
  moments: RealityMoment[];
};

/* =============================================================================
   Spine 3 — Trajectory ("where it leads" / forecast / growth)
============================================================================= */

export type TrajectoryTone = "positive" | "warning" | "mixed" | "neutral";

export type TrajectoryMetric = {
  id: string;
  label: string;
  value: string;
  tone?: TrajectoryTone;
  note?: string;
};

export type SalaryBand = {
  low: string;
  median: string;
  high: string;
  note?: string;
};

export type AiImpact = {
  level: string;
  summary: string;
  helpsWith: string[];
  putsPressureOn: string[];
  humansStillOwn: string[];
};

export type PathTrajectory = {
  outlookLabel: string;
  outlookSummary: string;
  metrics: TrajectoryMetric[];
  salaryBand?: SalaryBand;
  whatIsGrowing: string[];
  whatIsUnderPressure: string[];
  aiImpact?: AiImpact;
  whyExciting: string[];
  whyRisky: string[];
};

/* =============================================================================
   Spine 4 — Next steps ("try it for real")
============================================================================= */

export type OpportunityMode = "local" | "remote" | "virtual" | "hybrid" | "travel";

export type Opportunity = {
  id: string;
  title: string;
  href: string;
  note?: string;
  badge?: string;
  provider?: string;
  mode?: OpportunityMode;
};

export type OpportunitySection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** local = "near you", remote/virtual = "online". */
  mode: "local" | "remote";
  items: Opportunity[];
};

export type PathNextSteps = {
  heroTitle?: string;
  heroSummary?: string;
  heroBadge?: string;
  sections: OpportunitySection[];
};

/* =============================================================================
   Optional branch module (Work specialties, Impact branches, Learning tracks…)
============================================================================= */

export type PathBranchPreview = {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  whyItCouldFit: string;
  energy?: string;
};

export type PathBranch = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whatYouActuallyDo: string[];
  skillsThatGrowHere: string[];
  starterProjects: string[];
  /** Optional per-branch accent override. */
  accent?: Rgb;
};

export type PathBranchModule = {
  /** Lane-appropriate noun: "specialties", "branches", "tracks", "itineraries". */
  label: string;
  intro?: string;
  previews: PathBranchPreview[];
  detail: PathBranch[];
};

/* =============================================================================
   Theme (Phase A keeps one muted tone per lane; accent is an optional override)
============================================================================= */

export type PathTheme = {
  /** Optional per-path accent override; defaults to the lane tone. */
  accent?: Rgb;
  surfaceLabel?: string;
};

/* =============================================================================
   ExplorePath — one canonical catalog row
============================================================================= */

export type ExplorePath = {
  id: string; // canonical key, e.g. "onet:29-1215"
  lane: Lane;
  slug: string;
  title: string;
  /** O*NET / cause / activity code used for dedup + canonicalization. */
  taxonomyCode?: string;
  /** O*NET Bright Outlook (rapid growth / many openings) — Work deck cards. */
  brightOutlook?: boolean;

  theme?: PathTheme;

  // Universal spine — every lane renders these
  card: PathCard;
  overview: PathOverview;
  reality: PathReality;
  trajectory: PathTrajectory;
  nextSteps: PathNextSteps;

  // Optional branch module — only where the domain earns it
  branches?: PathBranchModule;

  // Provenance & freshness (Phase B/C; defaulted for seed mocks)
  sources?: Citation[];
  generatedAt?: string;
  sourceVersion?: string;
  contentModel?: ContentModel;
};

/* =============================================================================
   PathMatch — per-user personalization. Never stored on the catalog row.
============================================================================= */

export type MatchReason = {
  type: "signal-match" | "interest-match" | "editorial";
  title: string;
  detail: string;
};

export type PathMatch = {
  userId: string;
  pathId: string;
  /** 0–100 fit for the deck ordering + signal meter. */
  score: number;
  rank: number;
  /** Personalized "why this fits you" line. */
  whyYou: string;
  reasons: MatchReason[];
  generatedAt?: string;
};

/* =============================================================================
   Lane presentation tokens (single muted tone per lane — matches the site)
============================================================================= */

export const LANE_ACCENT: Record<Lane, Rgb> = {
  work: { r: 92, g: 180, b: 255 }, // sky
  learning: { r: 182, g: 160, b: 255 }, // violet
  world: { r: 244, g: 198, b: 103 }, // amber
  impact: { r: 87, g: 214, b: 160 }, // emerald
  play: { r: 255, g: 144, b: 192 }, // pink
};

export function laneAccent(path: Pick<ExplorePath, "lane" | "theme">): Rgb {
  return path.theme?.accent ?? LANE_ACCENT[path.lane];
}
