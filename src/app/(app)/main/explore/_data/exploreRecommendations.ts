// apps/web/src/app/(app)/main/explore/_data/exploreRecommendations.ts

import type {
  ExploreLaneId,
  ExplorePath,
  ExploreSignal,
  ExploreUserProfileSnapshot,
  PathRecommendation,
  RecommendationDeck,
  RecommendationEngineInput,
  RecommendationEngineOutput,
  RecommendationReason,
  RecommendationScoreBreakdown,
  SignalVector,
} from "./exploreTypes";

const SIGNAL_KEYS: ExploreSignal[] = [
  "creativity",
  "systems",
  "people",
  "curiosity",
  "analysis",
  "build",
  "impact",
  "story",
];

type RecommendationOptions = {
  now?: string;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function getSignalDistance(a: SignalVector, b: SignalVector) {
  const deltas = SIGNAL_KEYS.map((key) => Math.abs(a[key] - b[key]));
  return average(deltas);
}

function getSignalAlignmentScore(
  userSignals: SignalVector,
  pathSignals: SignalVector,
) {
  const distance = getSignalDistance(userSignals, pathSignals);
  return clamp(100 - distance);
}

function getPreferredTagBoost(
  path: ExplorePath,
  user: ExploreUserProfileSnapshot,
) {
  const preferredTags = user.preferences?.preferredTags ?? [];
  const avoidedTags = user.preferences?.avoidedTags ?? [];
  const pathTags = path.tags ?? [];

  let boost = 0;

  for (const tag of pathTags) {
    if (preferredTags.includes(tag)) boost += 2;
    if (avoidedTags.includes(tag)) boost -= 3;
  }

  return clamp(boost, -12, 12);
}

function getDismissPenalty(
  path: ExplorePath,
  user: ExploreUserProfileSnapshot,
  excludePathIds: string[],
) {
  const dismissedPathIds = user.preferences?.dismissedPathIds ?? [];

  if (excludePathIds.includes(path.id)) return 100;
  if (dismissedPathIds.includes(path.id)) return 18;

  return 0;
}

function buildReasons(
  path: ExplorePath,
  user: ExploreUserProfileSnapshot,
  signalAlignment: number,
  tagBoost: number,
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  const pathSignals = path.signals;
  const topSignalMatches = SIGNAL_KEYS
    .map((key) => ({
      key,
      userValue: user.signals.current[key],
      pathValue: pathSignals[key],
      delta: Math.abs(user.signals.current[key] - pathSignals[key]),
    }))
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3);

  if (signalAlignment >= 75) {
    const labels = topSignalMatches.map((item) => item.key).join(" + ");
    reasons.push({
      type: "signal-match",
      title: "Strong signal match",
      detail: `This path lines up especially well with your ${labels} profile.`,
      weight: round(signalAlignment / 100),
    });
  } else if (signalAlignment >= 60) {
    reasons.push({
      type: "signal-match",
      title: "Solid overall fit",
      detail:
        "This path shares several of your strongest signals, even if it is not a perfect match.",
      weight: round(signalAlignment / 100),
    });
  }

  if (tagBoost > 0) {
    reasons.push({
      type: "interest-match",
      title: "Matches your current preferences",
      detail:
        "This recommendation gets a lift because it overlaps with the kinds of paths you seem to prefer.",
      weight: round(tagBoost / 12),
    });
  }

  if ((path.deepDive.specialties?.items.length ?? 0) >= 3) {
    reasons.push({
      type: "editorial",
      title: "Rich path to explore",
      detail:
        "This option has multiple branches and is a strong path for deeper exploration.",
      weight: 0.45,
    });
  }

  if (!reasons.length) {
    reasons.push({
      type: "editorial",
      title: "Worth exploring",
      detail:
        "This path is included because it still offers enough overlap to be interesting and useful to compare.",
      weight: 0.25,
    });
  }

  return reasons;
}

function buildScoreBreakdown(
  signalAlignment: number,
  tagBoost: number,
  penalty: number,
): RecommendationScoreBreakdown {
  const interestAlignment = Math.max(0, tagBoost);
  const total = clamp(signalAlignment + interestAlignment - penalty);

  return {
    signalAlignment: round(signalAlignment),
    interestAlignment: round(interestAlignment),
    behaviorAlignment: 0,
    goalAlignment: 0,
    freshness: 0,
    diversity: 0,
    editorialBoost: 0,
    penalty: round(penalty),
    total: round(total),
  };
}

function scorePath(
  path: ExplorePath,
  user: ExploreUserProfileSnapshot,
  excludePathIds: string[],
) {
  const signalAlignment = getSignalAlignmentScore(
    user.signals.current,
    path.signals,
  );
  const tagBoost = getPreferredTagBoost(path, user);
  const penalty = getDismissPenalty(path, user, excludePathIds);
  const scoreBreakdown = buildScoreBreakdown(signalAlignment, tagBoost, penalty);

  return {
    path,
    score: scoreBreakdown.total,
    scoreBreakdown,
    reasons: buildReasons(path, user, signalAlignment, tagBoost),
  };
}

export function rankPathsForLane(
  laneId: ExploreLaneId,
  paths: ExplorePath[],
  user: ExploreUserProfileSnapshot,
  excludePathIds: string[] = [],
) {
  return paths
    .filter((path) => path.laneId === laneId)
    .filter((path) => path.status === "active")
    .filter((path) => !excludePathIds.includes(path.id))
    .map((path) => scorePath(path, user, excludePathIds))
    .sort((a, b) => b.score - a.score);
}

export function buildRecommendationDeck(
  input: RecommendationEngineInput,
  options: RecommendationOptions = {},
): RecommendationDeck {
  const now = options.now ?? new Date().toISOString();
  const { context, paths, user } = input;

  const ranked = rankPathsForLane(
    context.laneId,
    paths,
    user,
    context.excludePathIds ?? [],
  );

  const limited = ranked.slice(0, context.maxResults);

  const recommendations: PathRecommendation[] = limited.map((item, index) => ({
    recommendationId: `rec-${context.laneId}-${item.path.id}-${index + 1}`,
    userId: user.userId,
    laneId: context.laneId,
    pathId: item.path.id,
    rank: index + 1,
    score: item.score,
    scoreBreakdown: item.scoreBreakdown,
    reasons: item.reasons,
    dismissed: false,
    pinned: false,
    generatedBy: "mock",
    generatedAt: now,
  }));

  return {
    laneId: context.laneId,
    maxVisible: context.maxResults,
    rankedPathIds: ranked.map((item) => item.path.id),
    activeRecommendationIds: recommendations.map(
      (recommendation) => recommendation.recommendationId,
    ),
    recommendations,
  };
}

export function buildRecommendationOutput(
  input: RecommendationEngineInput,
  options: RecommendationOptions = {},
): RecommendationEngineOutput {
  const deck = buildRecommendationDeck(input, options);

  const visibleRecommendations = deck.recommendations.slice(0, input.context.maxResults);
  const visiblePathIds = new Set(
    visibleRecommendations.map((recommendation) => recommendation.pathId),
  );

  const ranked = rankPathsForLane(
    input.context.laneId,
    input.paths,
    input.user,
    input.context.excludePathIds ?? [],
  );

  const overflowRecommendations: PathRecommendation[] = ranked
    .filter((item) => !visiblePathIds.has(item.path.id))
    .map((item, index) => ({
      recommendationId: `rec-${input.context.laneId}-${item.path.id}-overflow-${index + 1}`,
      userId: input.user.userId,
      laneId: input.context.laneId,
      pathId: item.path.id,
      rank: visibleRecommendations.length + index + 1,
      score: item.score,
      scoreBreakdown: item.scoreBreakdown,
      reasons: item.reasons,
      dismissed: false,
      pinned: false,
      generatedBy: "mock",
      generatedAt: options.now ?? new Date().toISOString(),
    }));

  return {
    laneId: input.context.laneId,
    rankedRecommendations: [...visibleRecommendations, ...overflowRecommendations],
    visibleRecommendations,
    overflowRecommendations,
  };
}

export function dismissRecommendation(
  deck: RecommendationDeck,
  dismissedRecommendationId: string,
  options: {
    allPaths: ExplorePath[];
    user: ExploreUserProfileSnapshot;
    laneId: ExploreLaneId;
    now?: string;
  },
): RecommendationDeck {
  const now = options.now ?? new Date().toISOString();

  const existing = deck.recommendations.find(
    (recommendation) => recommendation.recommendationId === dismissedRecommendationId,
  );

  if (!existing) {
    return deck;
  }

  const dismissedPathId = existing.pathId;

  const updatedRecommendations = deck.recommendations.map((recommendation) =>
    recommendation.recommendationId === dismissedRecommendationId
      ? {
          ...recommendation,
          dismissed: true,
          replacement: {
            wasRejected: true,
            rejectedAt: now,
          },
        }
      : recommendation,
  );

  const stillVisible = updatedRecommendations.filter(
    (recommendation) => !recommendation.dismissed,
  );

  const usedPathIds = new Set(stillVisible.map((recommendation) => recommendation.pathId));
  usedPathIds.add(dismissedPathId);

  const reranked = rankPathsForLane(
    options.laneId,
    options.allPaths,
    options.user,
    Array.from(usedPathIds),
  );

  const nextPath = reranked[0];

  let nextRecommendations = [...stillVisible];

  if (nextPath) {
    const replacementRank = nextRecommendations.length + 1;
    const replacementId = `rec-${options.laneId}-${nextPath.path.id}-replacement-${replacementRank}`;

    nextRecommendations.push({
      recommendationId: replacementId,
      userId: options.user.userId,
      laneId: options.laneId,
      pathId: nextPath.path.id,
      rank: replacementRank,
      score: nextPath.score,
      scoreBreakdown: nextPath.scoreBreakdown,
      reasons: nextPath.reasons,
      dismissed: false,
      pinned: false,
      generatedBy: "mock",
      generatedAt: now,
    });

    nextRecommendations = nextRecommendations.map((recommendation) =>
      recommendation.pathId === dismissedPathId
        ? {
            ...recommendation,
            replacement: {
              wasRejected: true,
              rejectedAt: now,
              replacedByPathId: nextPath.path.id,
              replacementRank,
            },
          }
        : recommendation,
    );
  }

  const normalized = nextRecommendations
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((recommendation, index) => ({
      ...recommendation,
      rank: index + 1,
    }));

  return {
    laneId: deck.laneId,
    maxVisible: deck.maxVisible,
    rankedPathIds: normalized.map((recommendation) => recommendation.pathId),
    activeRecommendationIds: normalized.map(
      (recommendation) => recommendation.recommendationId,
    ),
    recommendations: normalized,
  };
}
