// src/app/main/explore/content/index.ts

import type { ExploreArea, ExploreSection, ExploreChipType, ExploreKey } from "./types";

// These imports assume each file exports DEFAULT ExploreArea.
// If your files use named exports instead, switch accordingly.
import recommendations from "./recommendations";
import education from "./education";
import travel from "./travel";
import community from "./community";
import hobbies from "./hobbies";

const AREAS: ExploreArea[] = [recommendations, education, travel, community, hobbies];

function toSection(area: ExploreArea): ExploreSection {
  const key = area.id as ExploreKey;

  return {
    key,
    label: area.label,

    // Page header text
    title: area.headline,
    subtitle: area.summary,

    // One chip per section (keeps it simple and matches your renderer pattern)
    chips: [
      {
        id: `${area.id}-chip`,
        type: area.id as ExploreChipType,
        area,
      },
    ],
  };
}

export const EXPLORE_SECTIONS = AREAS.map(toSection) satisfies ExploreSection[];

// Optional re-exports (handy elsewhere)
export { recommendations, education, travel, community, hobbies };
export { AREAS as EXPLORE_AREAS };
