// apps/web/src/app/(app)/main/explore/_components/ExplorePathSection.tsx
//
// One drill-down screen for a single deep section of an Explore path (Reality /
// Trajectory / Next steps / Specialties). Reached at
// /main/explore/{lane}/{slug}/{section}. Back link returns to the essentials
// screen. If the section key is unknown or has no content for this path, we fall
// back to the essentials screen so a bad/stale URL never dead-ends.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { laneAccent, type ExplorePath } from "../_data/exploreSchema";
import { ExplorePathDetail } from "./ExplorePathDetail";
import { ExploreAttribution } from "./ExploreAttribution";
import { OnetFacts, type OnetDetail } from "./OnetFacts";
import { SectionBody, getSectionMenu, type SectionKey } from "./detailSections";

export function ExplorePathSection({
  path,
  section,
  onet = null,
}: {
  path: ExplorePath;
  section: SectionKey;
  // Real O*NET occupation data — shown on the "Where it leads" section (it was
  // moved off the small landing page).
  onet?: OnetDetail | null;
}) {
  const accent = laneAccent(path);
  const meta = getSectionMenu(path).find((m) => m.key === section);

  // Unknown/empty section for this path → show essentials rather than a blank.
  if (!meta) return <ExplorePathDetail path={path} />;

  const title = path.overview?.title ?? path.card.title;

  return (
    <div className="space-y-3 pb-24">
      <Link
        href={`/main/explore/${path.lane}/${path.slug}`}
        className="inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {title}</span>
      </Link>

      <SectionCard tone="hero" backdrop={<ConstellationAnchor seed={`${path.id}:${section}`} accent={accent} />}>
        <div className="max-w-2xl">
          <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/44">{title}</div>
          <h1 className="mt-2 text-title font-semibold leading-display tracking-title text-ink-strong sm:text-title">
            {meta.title}
          </h1>
        </div>
      </SectionCard>

      <SectionCard tone="neutral">
        <SectionBody path={path} section={section} accent={accent} />
      </SectionCard>

      {/* Real, source-grounded O*NET occupation data lives on "Where it leads". */}
      {section === "outlook" && onet ? <OnetFacts onet={onet} accent={accent} /> : null}

      <ExploreAttribution path={path} />
    </div>
  );
}

export default ExplorePathSection;
