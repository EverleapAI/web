"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { worldPathsToExplorePaths } from "./_data/worldAdapter";
import { WORLD_PATHS } from "./_data/worldPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const WORLD_EXPLORE_PATHS = worldPathsToExplorePaths(WORLD_PATHS);

export default function WorldExplorePage() {
  // World now has real places and traditions inside each country, so it reads
  // like Learning and Impact: each path is a world you open, grouped by region.
  return <ExploreLandingLoader lane="world" fallback={WORLD_EXPLORE_PATHS} variant="worlds" />;
}
