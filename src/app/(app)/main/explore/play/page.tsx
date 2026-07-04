"use client";

import { ExploreLanding } from "../_components/ExploreLanding";
import { playActivitiesToExplorePaths } from "./_data/playAdapter";
import { PLAY_ACTIVITIES } from "./_data/playPaths";

const PLAY_PATHS = playActivitiesToExplorePaths(PLAY_ACTIVITIES);

export default function PlayExplorePage() {
  return <ExploreLanding lane="play" paths={PLAY_PATHS} />;
}
