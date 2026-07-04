"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetail } from "../../_components/ExplorePathDetail";
import { worldPathToExplorePath } from "../_data/worldAdapter";
import { getWorldPath } from "../_data/worldPaths";

export default function WorldPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const world = pathId ? getWorldPath(pathId) : null;
  if (!world) notFound();

  return <ExplorePathDetail path={worldPathToExplorePath(world)} />;
}
