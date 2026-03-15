// apps/web/src/app/(app)/main/explore/_data/exploreEngine.ts

import { EXPLORE_MOCK_USER } from "./exploreSeedData";
import {
  getRecommendationSourcePathsForLane,
  requireExplorePathById,
} from "./exploreCatalog";

import {
  buildRecommendationDeck,
  dismissRecommendation,
} from "./exploreRecommendations";

import type {
  ExploreLaneId,
  ExplorePath,
  RecommendationDeck,
} from "./exploreTypes";

function getPathsForLane(laneId: ExploreLaneId): ExplorePath[] {
  return getRecommendationSourcePathsForLane(laneId);
}

export function generateLaneDeck(laneId: ExploreLaneId): RecommendationDeck {
  const paths = getPathsForLane(laneId);

  return buildRecommendationDeck({
    user: EXPLORE_MOCK_USER,
    paths,
    context: {
      laneId,
      availablePathIds: paths.map((p) => p.id),
      maxResults: 4,
    },
  });
}

export function rejectRecommendation(
  deck: RecommendationDeck,
  recommendationId: string,
  laneId: ExploreLaneId,
): RecommendationDeck {
  const paths = getPathsForLane(laneId);

  return dismissRecommendation(deck, recommendationId, {
    allPaths: paths,
    user: EXPLORE_MOCK_USER,
    laneId,
  });
}

export function getVisiblePaths(deck: RecommendationDeck): ExplorePath[] {
  return deck.recommendations
    .slice(0, deck.maxVisible)
    .map((rec) => requireExplorePathById(rec.pathId));
}

export function getRecommendationByPathId(
  deck: RecommendationDeck,
  pathId: string,
) {
  return deck.recommendations.find((r) => r.pathId === pathId);
}
