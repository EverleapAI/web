// src/app/main/domain/types.ts

/* =============================================================================
   Shared domain types for Today (/main)
   - Pure types only (no runtime logic)
   - Used by signals, motivation synthesis, retort, and the page view-model
   ============================================================================= */

/* =============================================================================
   Core story + signals
   ============================================================================= */

export type StoryAnswers = Record<string, { answer?: string; skipped?: boolean }>;

export type SignalKey = "motivations" | "strengths" | "skills";

export type SignalsProgress = {
  motivationsDone: boolean;
  strengthsDone: boolean;
  skillsDone: boolean;
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;
  totalPer: number;
};

export type AgentState = "EMPTY" | "WELCOME" | "FOUNDATION" | "ACTIVE" | "RETURNING";

export type RetortViewModel = {
  /** 2–3 paragraphs (rendered as narrative) */
  paragraphs: string[];
  /** stable-ish key so React keys don’t churn */
  key: string;
};

/* =============================================================================
   Synthesis / reflection
   ============================================================================= */

/** “Stew” blend labels — not a single trait, but a dominant mixture */
export type MotivationBlend =
  | "momentum_plus_fit"
  | "curiosity_plus_practicality"
  | "impact_plus_realism"
  | "autonomy_plus_structure"
  | "exploration_with_constraints"
  | "balanced_unclear";

/** Synthesized listening result (pattern + optional evidence) */
export type Reflection = {
  /** Interpreted synthesis across multiple answers (non-parroting) */
  patternLine: string;
  /** One concrete example clause (paraphrased), max one sentence */
  evidenceLine?: string;
  /** Debuggable blend id (optional to surface later) */
  blend?: MotivationBlend;
};

/* =============================================================================
   Quote
   ============================================================================= */

export type Quote = { text: string; author: string };

/* =============================================================================
   Tiny tasks + persisted tiny task state
   ============================================================================= */

export type TinyTaskId = "weekly_focus" | "curiosity_sprint";

export type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

/* =============================================================================
   Storage shapes owned by other modules (kept permissive)
   ============================================================================= */

/** Storage snapshot shape is owned by onboarding; keep this permissive. */
export type OnboardingSnapshot = Record<string, unknown> & {
  name?: string;
  zip?: string;
  situation?: string;

  // Optional fields we may use as onboarding becomes richer:
  stage?: string; // e.g., "high school"
  grade?: string;
  outsideSchool?: string[]; // e.g., ["sports", "art"]
  afterHighSchool?: string[]; // e.g., ["job", "trade", "four_year"]
  animal?: string;
};

export type WeeklyFocusState = Record<string, unknown> & {
  vibe?: string;
  target?: string;
};

export type CuriositySprintState = Record<string, unknown> & {
  createdAt?: string;
  title?: string;
};