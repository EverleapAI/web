"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { impactPathToExplorePath } from "../_data/impactAdapter";
import { requireImpactPath } from "../_data/impactPaths";

export default function ImpactPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  if (!pathId) notFound();
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
    />
  );
}
