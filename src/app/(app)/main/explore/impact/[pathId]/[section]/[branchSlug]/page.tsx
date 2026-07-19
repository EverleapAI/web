"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../../_components/detailSections";
import { impactPathToExplorePath } from "../../../_data/impactAdapter";
import { requireImpactPath } from "../../../_data/impactPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

// The deep dive for a single way of getting involved — its constellation, at
// /main/explore/impact/{slug}/specialties/{branchSlug} (the segment is always
// "specialties", whatever the lane calls its branches). Impact paths have been
// rendering branch cards linking here; without this route they 404'd.
// The constellation gates each star on having content, so an impact dive shows
// why / a real day / try it near you / try it for real — no pay-and-outlook star,
// which impact paths deliberately don't have.
export default function ImpactBranchConstellationPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);
  const branchSlug = firstParam(params?.branchSlug);

  if (!pathId || !isSectionKey(section) || !branchSlug) notFound();
  let item = null;
  try {
    item = requireImpactPath(pathId);
  } catch {
    item = null;
  }

  return (
    <ExplorePathDetailLoader
      lane="impact"
      slug={pathId}
      fallback={item ? impactPathToExplorePath(item) : null}
      section={section}
      branchSlug={branchSlug}
    />
  );
}
