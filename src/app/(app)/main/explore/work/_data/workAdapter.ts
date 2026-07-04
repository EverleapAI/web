// apps/web/src/app/(app)/main/explore/work/_data/workAdapter.ts
//
// Maps the existing Work mock content (WorkPathContent) onto the unified
// ExplorePath. Content is preserved verbatim; only the shape changes. In Phase B
// this adapter boundary is where the source swaps from mock module to DB.

import type {
  ExplorePath,
  OpportunitySection,
  PathTrajectory,
  PathNextSteps,
} from "../../_data/exploreSchema";
import type { WorkPathContent } from "./workPathSchema";

function trajectoryFrom(w: WorkPathContent): PathTrajectory {
  const f = w.forecastV2;
  if (!f) {
    return {
      outlookLabel: "Outlook",
      outlookSummary: w.forecast?.summary ?? "",
      metrics: [],
      whatIsGrowing: [],
      whatIsUnderPressure: [],
      whyExciting: [],
      whyRisky: [],
    };
  }
  return {
    outlookLabel: f.outlookLabel,
    outlookSummary: f.outlookSummary,
    metrics: f.metrics.map((m) => ({
      id: m.id,
      label: m.label,
      value: m.value,
      tone: m.tone,
      note: m.note,
    })),
    salaryBand: f.salaryRange,
    whatIsGrowing: f.whatIsGrowing,
    whatIsUnderPressure: f.whatIsUnderPressure,
    aiImpact: f.aiImpact,
    whyExciting: f.whyThisCouldFeelExciting,
    whyRisky: f.whyThisCouldFeelRisky,
  };
}

function nextStepsFrom(w: WorkPathContent): PathNextSteps {
  const ns = w.nextStepsV2;
  if (!ns) return { sections: [] };

  const sections: OpportunitySection[] = ns.sections.map((s) => ({
    id: s.id,
    eyebrow: s.eyebrow,
    title: s.title,
    description: s.description,
    mode: s.mode,
    items: s.items.map((it) => ({
      id: it.id,
      title: it.title,
      href: it.href,
      note: it.note,
      badge: it.badge,
      provider: it.provider,
      mode: it.mode,
    })),
  }));

  return {
    heroTitle: ns.heroTitle,
    heroSummary: ns.heroSummary,
    heroBadge: ns.heroBadge,
    sections,
  };
}

export function workPathToExplorePath(w: WorkPathContent): ExplorePath {
  return {
    id: w.id,
    lane: "work",
    slug: w.slug,
    title: w.hero.title || w.card.title,

    card: w.card,

    overview: {
      eyebrow: w.hero.eyebrow,
      title: w.hero.title,
      hook: w.hero.hook,
      summary: w.hero.summary,
      whyItPullsYouIn: w.hero.whyItPullsYouIn,
      traitChips: w.traitChips,
      fitSignals: w.fitSignals,
    },

    reality: {
      title: w.dayInLife.title,
      summary: w.dayInLife.summary,
      moments: w.dayInLife.moments.map((m) => ({
        id: m.id,
        timeLabel: m.timeLabel,
        title: m.title,
        body: m.body,
      })),
    },

    trajectory: trajectoryFrom(w),
    nextSteps: nextStepsFrom(w),

    branches: {
      label: "specialties",
      previews: w.specialtyPreviews.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        oneLiner: p.oneLiner,
        whyItCouldFit: p.whyItCouldFit,
        energy: p.energy,
      })),
      detail: w.specialties.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        whatYouActuallyDo: s.whatYouActuallyDo,
        skillsThatGrowHere: s.skillsThatGrowHere,
        starterProjects: s.starterProjects,
      })),
    },

    contentModel: "seed",
  };
}

export function workPathsToExplorePaths(paths: WorkPathContent[]): ExplorePath[] {
  return paths.map(workPathToExplorePath);
}
