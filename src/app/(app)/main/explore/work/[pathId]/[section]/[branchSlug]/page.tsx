"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../../_components/detailSections";
import { workPathToExplorePath } from "../../../_data/workAdapter";
import { getWorkPath } from "../../../_data/workPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

// The deep dive for a single specialty — its constellation. Reached at
// /main/explore/work/{slug}/specialties/{branchSlug}.
export default function WorkSpecialtyConstellationPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);
  const branchSlug = firstParam(params?.branchSlug);

  if (!pathId || !isSectionKey(section) || !branchSlug) notFound();
  const work = getWorkPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="work"
      slug={pathId}
      fallback={work ? workPathToExplorePath(work) : null}
      section={section}
      branchSlug={branchSlug}
    />
  );
}
