"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../../_components/detailSections";
import { playActivityToExplorePath } from "../../../_data/playAdapter";
import { getPlayActivity } from "../../../_data/playPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

// A single activity inside a Play category, at
// /main/explore/play/{slug}/specialties/{branchSlug}. Play paths are anchored to
// the CIP leisure taxonomy, whose categories are broad ("Art"), so the specific
// activities a person actually names ("photography") are its branches — and
// without this route every one of those cards was a dead link.
//
// Stars are content-gated, so a Play dive stays light: why / try it near you /
// try it for real, with no day-in-the-life or pay-and-outlook star.
export default function PlayBranchPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);
  const branchSlug = firstParam(params?.branchSlug);

  if (!pathId || !isSectionKey(section) || !branchSlug) notFound();
  const activity = getPlayActivity(pathId);

  return (
    <ExplorePathDetailLoader
      lane="play"
      slug={pathId}
      fallback={activity ? playActivityToExplorePath(activity) : null}
      section={section}
      branchSlug={branchSlug}
    />
  );
}
