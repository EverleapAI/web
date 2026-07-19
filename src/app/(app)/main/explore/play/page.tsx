"use client";

import { ExploreLandingLoader } from "../_components/ExploreLandingLoader";
import { playActivitiesToExplorePaths } from "./_data/playAdapter";
import { PLAY_ACTIVITIES } from "./_data/playPaths";

const PLAY_PATHS = playActivitiesToExplorePaths(PLAY_ACTIVITIES);

export default function PlayExplorePage() {
  // Doors-first: you can't research your way into liking climbing — go once.
  return <ExploreLandingLoader lane="play" fallback={PLAY_PATHS} variant="doors" />;
}
