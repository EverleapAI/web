"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { impactPathsToExplorePaths } from "./_data/impactAdapter";
import { IMPACT_PATHS } from "./_data/impactPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const IMPACT_EXPLORE_PATHS = impactPathsToExplorePaths(IMPACT_PATHS);

export default function ImpactExplorePage() {
  return <ExploreLandingLoader lane="impact" fallback={IMPACT_EXPLORE_PATHS} />;
}
