"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { worldPathToExplorePath } from "../_data/worldAdapter";
import { getWorldPath } from "../_data/worldPaths";

export default function WorldPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  if (!pathId) notFound();
  const world = getWorldPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="world"
      slug={pathId}
      fallback={world ? worldPathToExplorePath(world) : null}
    />
  );
}
