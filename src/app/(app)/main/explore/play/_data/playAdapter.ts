// apps/web/src/app/(app)/main/explore/play/_data/playAdapter.ts
//
// Maps Play activities onto the unified ExplorePath. Play is the lightest lane
// (no forecast / day-in-life yet), so reality + trajectory are intentionally
// empty and the detail engine hides them.

import type { ExplorePath, OpportunitySection } from "../../_data/exploreSchema";
import { getPlayOpportunities, type PlayActivity } from "./playPaths";

function nextStepsFrom(activity: PlayActivity): OpportunitySection[] {
  const opps = getPlayOpportunities(activity);
  const local = opps.filter((o) => o.mode === "local");
  const remote = opps.filter((o) => o.mode === "remote");

  const sections: OpportunitySection[] = [];
  if (local.length) {
    sections.push({
      id: `${activity.id}-near`,
      title: "Near you",
      mode: "local",
      items: local.map((o) => ({ id: o.id, title: o.title, href: o.href, note: o.note, mode: "local" as const })),
    });
  }
  if (remote.length) {
    sections.push({
      id: `${activity.id}-online`,
      title: "Online",
      mode: "remote",
      items: remote.map((o) => ({ id: o.id, title: o.title, href: o.href, note: o.note, mode: "remote" as const })),
    });
  }
  return sections;
}

export function playActivityToExplorePath(activity: PlayActivity): ExplorePath {
  return {
    id: activity.id,
    lane: "play",
    slug: activity.slug,
    title: activity.card.title,

    card: activity.card,

    overview: {
      title: activity.card.title,
      hook: activity.card.hook,
      summary: activity.card.description,
      whyItPullsYouIn: activity.fitSignals,
      traitChips: [],
      fitSignals: [],
    },

    reality: { title: "", summary: "", moments: [] },
    trajectory: {
      outlookLabel: "",
      outlookSummary: "",
      metrics: [],
      whatIsGrowing: [],
      whatIsUnderPressure: [],
      whyExciting: [],
      whyRisky: [],
    },
    nextSteps: { sections: nextStepsFrom(activity) },

    contentModel: "seed",
  };
}

export function playActivitiesToExplorePaths(activities: PlayActivity[]): ExplorePath[] {
  return activities.map(playActivityToExplorePath);
}
