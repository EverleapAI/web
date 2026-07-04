// apps/web/src/app/(app)/main/explore/impact/_data/impactAdapter.ts
//
// Maps the existing Impact mock content (ImpactPathContent) onto the unified
// ExplorePath. Content is preserved verbatim; only the shape changes. In Phase B
// this adapter boundary is where the source swaps from mock module to DB.

import type {
  ExplorePath,
  OpportunitySection,
  PathNextSteps,
  PathReality,
} from "../../_data/exploreSchema";
import type {
  ImpactHowItFeels,
  ImpactOpportunity,
  ImpactOpportunityGroup,
  ImpactPathContent,
} from "./impactPathSchema";

function realityFrom(x: ImpactPathContent): PathReality {
  const feels: ImpactHowItFeels | undefined = x.howItFeels;
  if (!feels) return { title: "", summary: "", moments: [] };

  return {
    title: feels.title ?? "What it's really like",
    summary: feels.summary ?? "",
    moments: feels.moments.map((m, i) => ({
      id: m.id ?? `m${i}`,
      timeLabel: undefined,
      title: m.title,
      body: m.body,
    })),
  };
}

function inferGroupMode(group: ImpactOpportunityGroup): "local" | "remote" {
  const items = group.items;
  if (items.length > 0 && items.every((it) => it.mode === "virtual")) {
    return "remote";
  }
  return "local";
}

function nextStepsFrom(x: ImpactPathContent): PathNextSteps {
  const groups = x.nextSteps?.opportunityGroups ?? [];

  const sections: OpportunitySection[] = groups.map((group) => {
    const mode = inferGroupMode(group);
    return {
      id: group.id,
      eyebrow: undefined,
      title: group.title,
      description: group.description,
      mode,
      items: group.items.map((it) => {
        // Fields beyond the strict ImpactOpportunity shape are read defensively
        // so the mapping survives richer/looser mock rows without losing content.
        const rec = it as ImpactOpportunity & {
          whyItFits?: string;
          description?: string;
          whyThisMatters?: string;
        };
        return {
          id: it.id,
          title: it.title,
          href: it.href ?? "#",
          note:
            rec.whyItFits ??
            it.summary ??
            rec.description ??
            rec.whyThisMatters,
          provider: it.provider,
          mode,
        };
      }),
    };
  });

  return { sections };
}

export function impactPathToExplorePath(x: ImpactPathContent): ExplorePath {
  const hasBranches =
    (x.branchPreviews?.length ?? 0) > 0 && (x.branches?.length ?? 0) > 0;

  return {
    id: x.id,
    lane: "impact",
    slug: x.slug,
    title: x.hero.title || x.card.title,

    card: x.card,

    overview: {
      eyebrow: x.hero.eyebrow,
      title: x.hero.title,
      hook: x.hero.hook,
      summary: x.hero.summary,
      whyItPullsYouIn: x.hero.whyItPullsYouIn ?? [],
      traitChips: x.traitChips.map((c) => ({ id: c.id, label: c.label })),
      fitSignals: x.fitSignals.map((s) => ({
        id: s.id,
        label: s.label,
        score: s.score,
        explanation: s.explanation,
      })),
    },

    reality: realityFrom(x),

    trajectory: {
      outlookLabel: "",
      outlookSummary: "",
      metrics: [],
      whatIsGrowing: [],
      whatIsUnderPressure: [],
      whyExciting: [],
      whyRisky: [],
    },

    nextSteps: nextStepsFrom(x),

    ...(hasBranches
      ? {
          branches: {
            label: "branches",
            previews: x.branchPreviews.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              oneLiner: p.oneLiner,
              whyItCouldFit: p.whyItCouldFit,
              energy: p.energy,
            })),
            detail: x.branches.map((b) => ({
              id: b.id,
              slug: b.slug,
              title: b.title,
              summary: b.summary,
              whatYouActuallyDo: b.whatYouActuallyDo,
              skillsThatGrowHere: b.skillsThatGrowHere,
              starterProjects: b.starterProjects,
            })),
          },
        }
      : {}),

    contentModel: "seed",
  };
}

export function impactPathsToExplorePaths(
  paths: ImpactPathContent[]
): ExplorePath[] {
  return paths.map(impactPathToExplorePath);
}
