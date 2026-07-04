// apps/web/src/app/(app)/main/explore/world/_data/worldAdapter.ts
//
// Maps the existing World mock content (WorldPathContent) onto the unified
// ExplorePath. Content is preserved verbatim; only the shape changes. In Phase B
// this adapter boundary is where the source swaps from mock module to DB.

import type {
  ExplorePath,
  OpportunitySection,
  PathNextSteps,
  PathReality,
} from "../../_data/exploreSchema";
import type {
  WorldOpportunity,
  WorldOpportunityMode,
  WorldPathContent,
} from "./worldPathSchema";

/** World opportunity modes collapse onto the engine's local/remote split. */
function sectionModeFrom(mode: WorldOpportunityMode): "local" | "remote" {
  return mode === "virtual" ? "remote" : "local";
}

function realityFrom(w: WorldPathContent): PathReality {
  const wye = w.whatYouExplore;
  if (!wye) {
    return { title: "", summary: "", moments: [] };
  }
  return {
    title: wye.title ?? "What you explore",
    summary: wye.intro ?? "",
    pulse: w.hero.pullQuote,
    moments: wye.items.map((it, i) => ({
      id: `m${i}`,
      title: it.title,
      body: it.description,
    })),
  };
}

function opportunityItem(
  opp: Pick<WorldOpportunity, "title" | "href" | "description" | "mode">,
  id: string
) {
  return {
    id,
    title: opp.title,
    href: opp.href ?? "#",
    note: opp.description,
    mode: sectionModeFrom(opp.mode),
  };
}

function nextStepsFrom(w: WorldPathContent): PathNextSteps {
  const sections: OpportunitySection[] = [];

  const featured = w.featuredOpportunity;
  if (featured) {
    sections.push({
      id: "featured",
      eyebrow: featured.label,
      title: featured.title,
      description: featured.description,
      mode: sectionModeFrom(featured.mode),
      items: [opportunityItem(featured, "featured-0")],
    });
  }

  for (const group of w.opportunityGroups ?? []) {
    sections.push({
      id: group.id,
      eyebrow: group.label,
      title: group.title,
      description: group.description,
      mode: sectionModeFrom(group.opportunities[0]?.mode ?? "local"),
      items: group.opportunities.map((opp, i) =>
        opportunityItem(opp, `${group.id}-${i}`)
      ),
    });
  }

  return { sections };
}

export function worldPathToExplorePath(w: WorldPathContent): ExplorePath {
  return {
    id: w.id,
    lane: "world",
    slug: w.slug,
    title: w.hero.title || w.card.title,

    card: w.card,

    overview: {
      eyebrow: w.hero.eyebrow,
      title: w.hero.title,
      hook: w.hero.subtitle,
      summary: w.hero.body,
      whyItPullsYouIn: [],
      traitChips: w.traitChips.map((chip, i) => ({
        id: `t${i}`,
        label: chip.label,
      })),
      fitSignals: w.fitSignals.map((signal) => ({
        id: signal.id,
        label: signal.label,
        score: signal.score,
        explanation: signal.explanation,
      })),
    },

    reality: realityFrom(w),

    trajectory: {
      outlookLabel: "",
      outlookSummary: "",
      metrics: [],
      whatIsGrowing: [],
      whatIsUnderPressure: [],
      whyExciting: [],
      whyRisky: [],
    },

    nextSteps: nextStepsFrom(w),

    contentModel: "seed",
  };
}

export function worldPathsToExplorePaths(
  paths: WorldPathContent[]
): ExplorePath[] {
  return paths.map(worldPathToExplorePath);
}
