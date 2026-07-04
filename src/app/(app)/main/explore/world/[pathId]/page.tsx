"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { worldPathToExplorePath } from "../_data/worldAdapter";
import { getWorldPath } from "../_data/worldPaths";

export default function WorldPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const world = pathId ? getWorldPath(pathId) : null;
  if (!world) notFound();

  return (
    <ExplorePathDetailLoader
      lane="world"
      slug={pathId}
      fallback={worldPathToExplorePath(world)}
    />
  );
}
