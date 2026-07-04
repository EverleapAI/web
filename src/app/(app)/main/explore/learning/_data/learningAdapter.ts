// apps/web/src/app/(app)/main/explore/learning/_data/learningAdapter.ts
//
// Maps the existing Learning mock content (LearningPathContent) onto the unified
// ExplorePath. Content is preserved verbatim; only the shape changes. In Phase B
// this adapter boundary is where the source swaps from mock module to DB.

import type {
  ExplorePath,
  Opportunity,
  OpportunitySection,
  PathNextSteps,
  PathOverview,
  PathReality,
  PathTrajectory,
  TraitChip,
} from "../../_data/exploreSchema";
import type {
  LearningFeaturedOpportunity,
  LearningOpportunityGroup,
  LearningOpportunityItem,
  LearningOpportunityMode,
  LearningPathContent,
} from "./learningPathSchema";

/** hybrid/local render as "near you"; virtual renders as "online". */
function itemIsRemote(mode: LearningOpportunityMode): boolean {
  return mode === "virtual";
}

function sectionModeFromModes(modes: LearningOpportunityMode[]): "local" | "remote" {
  const remote = modes.filter(itemIsRemote).length;
  const local = modes.length - remote;
  return remote > local ? "remote" : "local";
}

function overviewFrom(l: LearningPathContent): PathOverview {
  const traitChips: TraitChip[] = l.traitChips.map((c, i) => ({
    id: c.id ?? String(i),
    label: c.label,
  }));

  return {
    eyebrow: l.hero.eyebrow,
    title: l.hero.title,
    hook: l.hero.hook,
    summary: l.hero.summary,
    whyItPullsYouIn: l.hero.whyItPullsYouIn ?? [],
    traitChips,
    fitSignals: l.fitSignals.map((s) => ({
      id: s.id,
      label: s.label,
      score: s.score,
      explanation: s.explanation,
    })),
  };
}

function realityFrom(l: LearningPathContent): PathReality {
  if (!l.whatYouLearn || l.whatYouLearn.length === 0) {
    return { title: "", summary: "", moments: [] };
  }
  return {
    title: "What you learn",
    summary: l.hero.summary ?? "",
    moments: l.whatYouLearn.map((w) => ({
      id: w.id,
      title: w.title,
      body: w.description,
    })),
  };
}

function emptyTrajectory(): PathTrajectory {
  return {
    outlookLabel: "",
    outlookSummary: "",
    metrics: [],
    whatIsGrowing: [],
    whatIsUnderPressure: [],
    whyExciting: [],
    whyRisky: [],
  };
}

function itemFrom(it: LearningOpportunityItem): Opportunity {
  return {
    id: it.id,
    title: it.title,
    href: it.href ?? "#",
    note: it.whyItFits ?? it.summary,
    provider: it.provider,
    mode: it.mode,
  };
}

function sectionFromGroup(g: LearningOpportunityGroup): OpportunitySection {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    mode: sectionModeFromModes(g.items.map((it) => it.mode)),
    items: g.items.map(itemFrom),
  };
}

function sectionFromFeatured(
  f: LearningFeaturedOpportunity
): OpportunitySection {
  const item: Opportunity = {
    id: "featured",
    title: f.title,
    href: f.href ?? "#",
    note: f.summary,
    provider: f.provider,
    mode: f.mode,
  };
  return {
    id: "featured",
    eyebrow: "Start here",
    title: f.title,
    description: f.whyStartHere,
    mode: itemIsRemote(f.mode) ? "remote" : "local",
    items: [item],
  };
}

function nextStepsFrom(l: LearningPathContent): PathNextSteps {
  const sections: OpportunitySection[] = [];
  if (l.featuredOpportunity) {
    sections.push(sectionFromFeatured(l.featuredOpportunity));
  }
  for (const group of l.opportunityGroups ?? []) {
    sections.push(sectionFromGroup(group));
  }
  return { sections };
}

export function learningPathToExplorePath(l: LearningPathContent): ExplorePath {
  return {
    id: l.id,
    lane: "learning",
    slug: l.slug,
    title: l.hero.title || l.card.title,

    card: l.card,

    overview: overviewFrom(l),
    reality: realityFrom(l),
    trajectory: emptyTrajectory(),
    nextSteps: nextStepsFrom(l),

    contentModel: "seed",
  };
}

export function learningPathsToExplorePaths(
  paths: LearningPathContent[]
): ExplorePath[] {
  return paths.map(learningPathToExplorePath);
}
