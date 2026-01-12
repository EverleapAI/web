// src/app/main/explore/content/ranking.ts

import type {
  FeedbackResponse,
  RankingState,
  RecommendationItem,
  UserBeliefFeedback,
  ISODateString,
} from "./contracts";

/* ============================================================================
   Everleap Explore — Ranking helpers (Step 3.2)
   - Pure functions only
   - No UI
   - No storage
   - No API
============================================================================ */

/** Clamp a number into [min, max]. */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Safe “now” helper for consistent ISO date strings. */
function nowIso(): ISODateString {
  return new Date().toISOString();
}

/**
 * Convert a feedback response to a weight delta.
 * Chosen to be simple and stable:
 * - agree     => +1.0
 * - mixed     => +0.3
 * - disagree  => -1.0
 */
export function responseToDelta(response: FeedbackResponse): number {
  switch (response) {
    case "agree":
      return 1.0;
    case "mixed":
      return 0.3;
    case "disagree":
      return -1.0;
    default: {
      const _exhaustive: never = response;
      return _exhaustive;
    }
  }
}

/** The effect size of tag weights vs modelScore (keep small; modelScore still anchors). */
const TAG_WEIGHT_FACTOR = 0.06;
/** The effect size of signal weights (often slightly smaller than tags). */
const SIGNAL_WEIGHT_FACTOR = 0.04;

/**
 * Compute a rank score for one recommendation from:
 * - its modelScore (base)
 * - tagWeights (local preference steering)
 * - signalWeights (optional richer steering)
 *
 * Returns a value clamped to [0, 1].
 */
export function scoreRecommendation(
  rec: RecommendationItem,
  ranking: RankingState
): number {
  const base = clamp(rec.modelScore ?? 0.5, 0, 1);

  // Tags
  const tagWeights = ranking.tagWeights ?? {};
  let tagSum = 0;
  for (const tag of rec.tags ?? []) {
    tagSum += tagWeights[tag] ?? 0;
  }

  // Signals (optional)
  const signalWeights = ranking.signalWeights ?? {};
  let signalSum = 0;
  if (rec.signals && rec.signals.length > 0) {
    for (const s of rec.signals) {
      const w = signalWeights[s.key] ?? 0;
      const strength = clamp(s.strength ?? 0, 0, 1);
      signalSum += w * s.direction * strength;
    }
  }

  const adjusted = base + tagSum * TAG_WEIGHT_FACTOR + signalSum * SIGNAL_WEIGHT_FACTOR;
  return clamp(adjusted, 0, 1);
}

/**
 * Produce a new array of recommendations with rankScore computed and applied.
 * Sorting is stable-ish: ties fall back to modelScore then title then recId.
 */
export function rerankRecommendations(
  recommendations: RecommendationItem[],
  ranking: RankingState
): RecommendationItem[] {
  const scored = recommendations.map((r) => ({
    ...r,
    rankScore: scoreRecommendation(r, ranking),
  }));

  scored.sort((a, b) => {
    const ra = a.rankScore ?? 0;
    const rb = b.rankScore ?? 0;
    if (rb !== ra) return rb - ra;

    const ma = clamp(a.modelScore ?? 0.5, 0, 1);
    const mb = clamp(b.modelScore ?? 0.5, 0, 1);
    if (mb !== ma) return mb - ma;

    const ta = (a.title ?? "").toLowerCase();
    const tb = (b.title ?? "").toLowerCase();
    if (ta < tb) return -1;
    if (ta > tb) return 1;

    const ida = a.recId ?? "";
    const idb = b.recId ?? "";
    if (ida < idb) return -1;
    if (ida > idb) return 1;

    return 0;
  });

  return scored;
}

/* ============================================================================
   Feedback → Ranking updates
============================================================================ */

/**
 * Apply a single feedback event to a RankingState by adjusting weights for:
 * - the recommendation's tags
 * - (optionally) its signals
 *
 * Notes:
 * - We treat feedback about a recommendation as feedback about its features.
 * - Feedback about a bare claim (targetType="claim") can still map if you pass the rec.
 */
export function applyFeedbackToRankingState(
  ranking: RankingState,
  feedback: Pick<UserBeliefFeedback, "response">,
  rec: Pick<RecommendationItem, "tags" | "signals">
): RankingState {
  const delta = responseToDelta(feedback.response);

  const nextTagWeights: Record<string, number> = { ...(ranking.tagWeights ?? {}) };
  for (const tag of rec.tags ?? []) {
    const cur = nextTagWeights[tag] ?? 0;
    nextTagWeights[tag] = cur + delta;
  }

  // Optional: signals can also be updated, but kept gentler than tags.
  // We nudge the signal weight by delta * strength * direction.
  let nextSignalWeights: Record<string, number> | undefined = ranking.signalWeights
    ? { ...ranking.signalWeights }
    : undefined;

  if (rec.signals && rec.signals.length > 0) {
    if (!nextSignalWeights) nextSignalWeights = {};
    for (const s of rec.signals) {
      const cur = nextSignalWeights[s.key] ?? 0;
      const strength = clamp(s.strength ?? 0, 0, 1);

      // If a rec leans strongly toward "structure" and user dislikes it,
      // this decreases the user's structureWeight (and vice versa).
      const signedStrength = s.direction * strength;

      // Gentle adjustment:
      const nudge = delta * signedStrength * 0.5;
      nextSignalWeights[s.key] = cur + nudge;
    }
  }

  return {
    tagWeights: nextTagWeights,
    signalWeights: nextSignalWeights,
    lastUpdatedAt: nowIso(),
  };
}

/**
 * Convenience: apply many feedback events to a ranking state in sequence.
 * You must provide a resolver that returns the RecommendationItem for each feedback event.
 */
export function applyFeedbackEventsToRankingState(
  initial: RankingState,
  feedbackEvents: UserBeliefFeedback[],
  resolveRecForFeedback: (fb: UserBeliefFeedback) => RecommendationItem | null
): RankingState {
  return feedbackEvents.reduce((state, fb) => {
    const rec = resolveRecForFeedback(fb);
    if (!rec) return state;
    return applyFeedbackToRankingState(state, fb, rec);
  }, initial);
}

/* ============================================================================
   Helpers to initialize
============================================================================ */

export function createInitialRankingState(): RankingState {
  return {
    tagWeights: {},
    signalWeights: {},
    lastUpdatedAt: nowIso(),
  };
}
