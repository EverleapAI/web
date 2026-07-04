"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { impactPathToExplorePath } from "../_data/impactAdapter";
import { requireImpactPath } from "../_data/impactPaths";

export default function ImpactPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  let item = null;
  try {
    item = pathId ? requireImpactPath(pathId) : null;
  } catch {
    item = null;
  }
  if (!item) notFound();

  return (
    <ExplorePathDetailLoader
      lane="impact"
      slug={pathId}
      fallback={impactPathToExplorePath(item)}
    />
  );
}
