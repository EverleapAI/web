// src/app/main/explore/content/index.ts

import type { ExploreArea, ExploreSection } from "./types";

// These imports assume each file exports DEFAULT ExploreArea.
import careers from "./careers";
import education from "./education";
import travel from "./travel";
import community from "./community";
import hobbies from "./hobbies";

/**
 * Canonical order + top-level nav for Explore.
 * This is what drives the 5 big buttons:
 * Careers, Education, Travel, Community, Hobbies
 */
const AREAS: ExploreArea[] = [careers, education, travel, community, hobbies];

function toSection(area: ExploreArea): ExploreSection {
  return {
    key: area.id,
    label: area.label,
    title: area.headline,
    subtitle: area.summary,
    chips: [
      {
        id: `${area.id}-chip`,
        type: area.id,
        area,
      },
    ],
  };
}

export const EXPLORE_SECTIONS = AREAS.map(toSection) satisfies ExploreSection[];

// Optional re-exports (handy elsewhere)
export { careers, education, travel, community, hobbies };
export { AREAS as EXPLORE_AREAS };
