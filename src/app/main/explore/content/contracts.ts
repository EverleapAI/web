// src/app/main/explore/content/contracts.ts

/* ============================================================================
   Everleap Explore — Contracts (Step 3.1)
   - No UI logic here
   - No storage / API here
   - Stable types that scale to DB + server later
============================================================================ */

/** ISO date string (e.g., new Date().toISOString()) */
export type ISODateString = string;

/** Where this item originated (kept broad so Insights can share later) */
export type ContentSource = "explore" | "insights" | "ai";

/** Explore content domains (expand freely as you add lanes) */
export type ExploreDomain =
  | "education"
  | "travel"
  | "community"
  | "hobbies"
  | "career"
  | "wellbeing"
  | "relationships"
  | "creative"
  | "finance"
  | "other";

/** User’s feedback on a claim/recommendation */
export type FeedbackResponse = "agree" | "mixed" | "disagree";

/** Optional structured reason chips (Phase 2+). Keep as open string union for now. */
export type FeedbackReason =
  | "too_expensive"
  | "too_time_intensive"
  | "too_risky"
  | "not_me"
  | "already_doing_this"
  | "not_now"
  | "too_vague"
  | "too_corporate"
  | "too_social"
  | "too_solo"
  | "other";

/* ============================================================================
   RecommendationItem — what AI returns (batch) + what UI renders
============================================================================ */

export type RecommendationSignal = {
  /** A normalized dimension you can score against (e.g. "structure", "socialIntensity") */
  key: string;
  /** Whether this recommendation leans away/neutral/toward that signal */
  direction: -1 | 0 | 1;
  /** How strongly it leans (0..1) */
  strength: number; // 0..1
};

export type RecommendationItem = {
  /* Identity */
  /** Stable unique ID for this recommendation item */
  recId: string;
  /**
   * Stable ID for the underlying claim/assertion the user is reacting to.
   * Often the same as recId, but kept separate for future flexibility.
   */
  claimId: string;

  /* Origin */
  source: ContentSource; // "explore" today
  domain: ExploreDomain;

  /* Display */
  title: string;
  /** 1–2 line card summary */
  summary: string;
  /** 2–4 bullets that support the recommendation */
  why: string[];
  /** Optional CTA-style text for the next step */
  nextStep?: string;

  /* Rerank metadata */
  /** Lightweight semantic tags that help local reranking */
  tags: string[];
  /** Optional structured signals to support richer reranking */
  signals?: RecommendationSignal[];

  /* Scoring */
  /** Model’s raw score for this item (0..1). If unknown, use 0.5. */
  modelScore: number; // 0..1
  /**
   * UI/local score after applying user feedback (0..1).
   * Optional because older content may not include it.
   */
  rankScore?: number; // 0..1
  /** Optional confidence (0..1) if/when you add it */
  confidence?: number; // 0..1

  /* Constraints / guardrails */
  /** Optional caveats (e.g. “requires transportation”) */
  constraints?: string[];
  /** Optional “this may not fit if…” bullets */
  antiFit?: string[];

  /* Provenance */
  /** Ties a group of recommendations to a single generation run */
  generationRunId: string;
  generatedAt: ISODateString;
  /** Optional model name/version string (useful for debugging later) */
  model?: string;
};

/* ============================================================================
   UserBeliefFeedback — universal feedback event (claim or recommendation)
============================================================================ */

export type FeedbackTargetType = "recommendation" | "claim";

export type UserBeliefFeedback = {
  feedbackId: string;

  /** Future: user id from auth/db; optional for now */
  userId?: string;

  /** Tie feedback to the batch/run that produced the item */
  generationRunId: string;

  targetType: FeedbackTargetType;
  /** recId or claimId depending on targetType */
  targetId: string;

  response: FeedbackResponse;

  /** Optional freeform user explanation */
  comment?: string | null;

  /** Optional chip reasons (Phase 2+). If present, keep "other" + comment for nuance. */
  reasons?: FeedbackReason[];

  createdAt: ISODateString;

  /** Optional: whether feedback could be shared with a coach/mentor later */
  visibility?: "private" | "shareable";
};

/* ============================================================================
   ExploreBatch — what one AI call produces & what UI iterates through
============================================================================ */

export type ExploreBatchStatus =
  | "active"
  | "exhausted"
  | "recalibrating"
  | "superseded";

export type ExploreBatch = {
  generationRunId: string;
  userId?: string;

  createdAt: ISODateString;
  /** The recommendations returned by the model (e.g., 8 or 20) */
  recommendations: RecommendationItem[];

  /** What the user has been shown already (order matters) */
  shownRecIds: string[];
  /** Explicit dislikes (usually response=disagree) */
  dismissedRecIds: string[];
  /** Explicit likes/saves (usually response=agree) */
  savedRecIds: string[];

  /** All feedback events for this generation run */
  feedbackEvents: UserBeliefFeedback[];

  status: ExploreBatchStatus;

  /**
   * Optional: when a recalibration job is scheduled/started.
   * This is helpful if you later show “ready at X time”.
   */
  recalibrationRequestedAt?: ISODateString;
};

/* ============================================================================
   RankingState — cheap local brain to avoid extra AI calls
============================================================================ */

export type RankingState = {
  /**
   * Weights applied to tags (positive boosts, negative penalties).
   * Start empty. Missing tag => implicit weight 0.
   */
  tagWeights: Record<string, number>;

  /**
   * Optional: weights applied to signal keys.
   * Missing key => implicit weight 0.
   */
  signalWeights?: Record<string, number>;

  lastUpdatedAt: ISODateString;
};

/* ============================================================================
   Small helper types (optional but useful)
============================================================================ */

export type ExploreFeedbackConfig = {
  /**
   * How many cards are rendered at once (your “top 4”).
   * Used by UI logic; config lives here for consistency.
   */
  visibleCount: number;

  /**
   * When to suggest “Recalibrate Suggestions”.
   * These are just defaults; logic file can interpret them.
   */
  suggestRecalibrateAfterDisagrees: number;

  /**
   * Consider the batch exhausted if fewer than this many unseen items remain.
   * Example: if visibleCount is 4, set this to 4.
   */
  minUnseenToContinue: number;
};

export const DEFAULT_EXPLORE_FEEDBACK_CONFIG: ExploreFeedbackConfig = {
  visibleCount: 4,
  suggestRecalibrateAfterDisagrees: 2,
  minUnseenToContinue: 4,
};
