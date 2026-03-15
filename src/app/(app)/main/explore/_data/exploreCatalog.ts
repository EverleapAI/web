// apps/web/src/app/(app)/main/explore/_data/exploreCatalog.ts

import { EXPLORE_CATALOG, EXPLORE_LANE_CONFIGS } from "./exploreSeedData";
import type {
  ExploreCatalog,
  ExploreLaneConfig,
  ExploreLaneDefinition,
  ExploreLaneId,
  ExplorePath,
} from "./exploreTypes";

const catalog: ExploreCatalog = EXPLORE_CATALOG;

function isActivePath(path: ExplorePath) {
  return path.status === "active";
}

export function getExploreCatalog(): ExploreCatalog {
  return catalog;
}

export function getExploreLaneConfig(
  laneId: ExploreLaneId,
): ExploreLaneConfig | undefined {
  return EXPLORE_LANE_CONFIGS[laneId];
}

export function requireExploreLaneConfig(
  laneId: ExploreLaneId,
): ExploreLaneConfig {
  const laneConfig = getExploreLaneConfig(laneId);

  if (!laneConfig) {
    throw new Error(`Explore lane config not found for lane "${laneId}".`);
  }

  return laneConfig;
}

export function getExploreLaneDefinition(
  laneId: ExploreLaneId,
): ExploreLaneDefinition | undefined {
  return catalog.lanes.find((lane) => lane.config.id === laneId);
}

export function requireExploreLaneDefinition(
  laneId: ExploreLaneId,
): ExploreLaneDefinition {
  const lane = getExploreLaneDefinition(laneId);

  if (!lane) {
    throw new Error(`Explore lane definition not found for lane "${laneId}".`);
  }

  return lane;
}

export function getExplorePathsForLane(laneId: ExploreLaneId): ExplorePath[] {
  return getExploreLaneDefinition(laneId)?.paths ?? [];
}

export function getActiveExplorePathsForLane(
  laneId: ExploreLaneId,
): ExplorePath[] {
  return getExplorePathsForLane(laneId).filter(isActivePath);
}

export function getRecommendationSourcePathsForLane(
  laneId: ExploreLaneId,
): ExplorePath[] {
  return getActiveExplorePathsForLane(laneId);
}

export function getAllExplorePaths(): ExplorePath[] {
  return catalog.lanes.flatMap((lane) => lane.paths);
}

export function getAllActiveExplorePaths(): ExplorePath[] {
  return getAllExplorePaths().filter(isActivePath);
}

export function getExplorePathById(pathId: string): ExplorePath | undefined {
  return getAllExplorePaths().find((path) => path.id === pathId);
}

export function requireExplorePathById(pathId: string): ExplorePath {
  const path = getExplorePathById(pathId);

  if (!path) {
    throw new Error(`Explore path not found for id "${pathId}".`);
  }

  return path;
}

export function getExplorePathBySlug(
  laneId: ExploreLaneId,
  slug: string,
): ExplorePath | undefined {
  return getExplorePathsForLane(laneId).find((path) => path.slug === slug);
}

export function requireExplorePathBySlug(
  laneId: ExploreLaneId,
  slug: string,
): ExplorePath {
  const path = getExplorePathBySlug(laneId, slug);

  if (!path) {
    throw new Error(
      `Explore path not found for lane "${laneId}" and slug "${slug}".`,
    );
  }

  return path;
}

export function hasExploreLanePaths(laneId: ExploreLaneId): boolean {
  return getExplorePathsForLane(laneId).length > 0;
}

export function hasActiveExploreLanePaths(laneId: ExploreLaneId): boolean {
  return getActiveExplorePathsForLane(laneId).length > 0;
}
