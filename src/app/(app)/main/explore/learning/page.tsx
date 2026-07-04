"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { learningPathsToExplorePaths } from "./_data/learningAdapter";
import { LEARNING_PATHS } from "./_data/learningPaths";

// Existing mock content, adapted to the unified ExplorePath shape once at load.
// Phase B swaps the source (mock -> DB) behind this same boundary.
const LEARNING_EXPLORE_PATHS = learningPathsToExplorePaths(LEARNING_PATHS);

export default function LearningExplorePage() {
  return <ExploreLandingLoader lane="learning" fallback={LEARNING_EXPLORE_PATHS} />;
}
