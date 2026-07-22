"use client";

import { ExploreLandingLoader } from "../../_components/ExploreLandingLoader";
import { worldPathsToExplorePaths } from "../_data/worldAdapter";
import { WORLD_PATHS } from "../_data/worldPaths";

// The 153-country catalog, kept as a second door rather than the only one.
// Whoever wants to wander places can; nobody has to in order to find a way in.
const WORLD_EXPLORE_PATHS = worldPathsToExplorePaths(WORLD_PATHS);

export default function WorldPlacesPage() {
  return <ExploreLandingLoader lane="world" fallback={WORLD_EXPLORE_PATHS} variant="worlds" />;
}
