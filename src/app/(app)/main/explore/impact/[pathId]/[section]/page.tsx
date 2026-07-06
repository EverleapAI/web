"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../_components/detailSections";
import { impactPathToExplorePath } from "../../_data/impactAdapter";
import { requireImpactPath } from "../../_data/impactPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

export default function ImpactPathSectionPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);

  if (!pathId || !isSectionKey(section)) notFound();
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
    />
  );
}
