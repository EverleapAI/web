"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../../_components/detailSections";
import { learningPathToExplorePath } from "../../../_data/learningAdapter";
import { getLearningPath } from "../../../_data/learningPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

// The deep dive for a single branch of a field of study — its constellation, at
// /main/explore/learning/{slug}/specialties/{branchSlug} (the segment is always
// "specialties", whatever the lane calls its branches). Generated learning paths
// may carry branches ("`branches` optional" in the lane guidance); without this
// route those cards 404'd. Stars are content-gated, so a learning dive skips the
// pay-and-outlook star — learning paths are not job forecasts.
export default function LearningBranchConstellationPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);
  const branchSlug = firstParam(params?.branchSlug);

  if (!pathId || !isSectionKey(section) || !branchSlug) notFound();
  const learning = getLearningPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="learning"
      slug={pathId}
      fallback={learning ? learningPathToExplorePath(learning) : null}
      section={section}
      branchSlug={branchSlug}
    />
  );
}
