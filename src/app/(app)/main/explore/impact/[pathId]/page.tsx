"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetail } from "../../_components/ExplorePathDetail";
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

  return <ExplorePathDetail path={impactPathToExplorePath(item)} />;
}
