// src/app/main/explore/content/index.ts

import type { ExploreArea, ExploreSection, ExploreChipType, ExploreKey } from "./types";

// These imports assume each file exports DEFAULT ExploreArea.
import recommendations from "./recommendations";
import education from "./education";
import travel from "./travel";
import community from "./community";
import hobbies from "./hobbies";

/**
 * Canonical order + top-level nav for Explore.
 * This is what drives the 5 big buttons you described:
 * Careers, Education, Travel, Community, Hobbies
 */
const AREAS: ExploreArea[] = [
  recommendations, // Careers
  education,
  travel,
  community,
  hobbies,
];

function toSection(area: ExploreArea): ExploreSection {
  const key = area.id as ExploreKey;

  return {
    key,

    // 🔑 Use the area label directly (we renamed it to "Careers" in recommendations.ts)
    label: area.label,

    // Page header text
    title: area.headline,
    subtitle: area.summary,

    // One chip per section (keeps renderer model consistent)
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
