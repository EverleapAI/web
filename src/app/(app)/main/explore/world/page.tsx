"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { worldPathsToExplorePaths } from "./_data/worldAdapter";
import { WORLD_PATHS } from "./_data/worldPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const WORLD_EXPLORE_PATHS = worldPathsToExplorePaths(WORLD_PATHS);

export default function WorldExplorePage() {
  // Doors-first: World's content is already action-shaped, so the ways in lead.
  return <ExploreLandingLoader lane="world" fallback={WORLD_EXPLORE_PATHS} variant="doors" />;
}
