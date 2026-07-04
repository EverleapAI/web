"use client";

import { ExploreLanding } from "../_components/ExploreLanding";
import { worldPathsToExplorePaths } from "./_data/worldAdapter";
import { WORLD_PATHS } from "./_data/worldPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const WORLD_EXPLORE_PATHS = worldPathsToExplorePaths(WORLD_PATHS);

export default function WorldExplorePage() {
  return <ExploreLanding lane="world" paths={WORLD_EXPLORE_PATHS} />;
}
