"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { workPathsToExplorePaths } from "./_data/workAdapter";
import { WORK_PATHS } from "./_data/workPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const WORK_EXPLORE_PATHS = workPathsToExplorePaths(WORK_PATHS);

export default function WorkExplorePage() {
  return <ExploreLandingLoader lane="work" fallback={WORK_EXPLORE_PATHS} />;
}
