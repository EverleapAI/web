"use client";

// The Explore entry screen — an Insights-style summary showing the strongest
// pick from each of the five lanes. Replaces the old redirect to /work.

import type { SummaryLane } from "./_components/ExploreSummary";
import { ExploreSummaryLoader } from "./_components/ExploreSummaryLoader";

import { workPathsToExplorePaths } from "./work/_data/workAdapter";
import { WORK_PATHS } from "./work/_data/workPaths";
import { learningPathsToExplorePaths } from "./learning/_data/learningAdapter";
import { LEARNING_PATHS } from "./learning/_data/learningPaths";
import { worldPathsToExplorePaths } from "./world/_data/worldAdapter";
import { WORLD_PATHS } from "./world/_data/worldPaths";
import { impactPathsToExplorePaths } from "./impact/_data/impactAdapter";
import { IMPACT_PATHS } from "./impact/_data/impactPaths";
import { playActivitiesToExplorePaths } from "./play/_data/playAdapter";
import { PLAY_ACTIVITIES } from "./play/_data/playPaths";

const LANES: SummaryLane[] = [
  { lane: "work", paths: workPathsToExplorePaths(WORK_PATHS) },
  { lane: "learning", paths: learningPathsToExplorePaths(LEARNING_PATHS) },
  { lane: "world", paths: worldPathsToExplorePaths(WORLD_PATHS) },
  { lane: "impact", paths: impactPathsToExplorePaths(IMPACT_PATHS) },
  { lane: "play", paths: playActivitiesToExplorePaths(PLAY_ACTIVITIES) },
];

export default function ExplorePage() {
  return <ExploreSummaryLoader fallbackLanes={LANES} />;
}
