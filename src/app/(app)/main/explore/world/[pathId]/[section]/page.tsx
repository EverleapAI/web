"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../_components/detailSections";
import { worldPathToExplorePath } from "../../_data/worldAdapter";
import { getWorldPath } from "../../_data/worldPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

export default function WorldPathSectionPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);

  if (!pathId || !isSectionKey(section)) notFound();
  const world = getWorldPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="world"
      slug={pathId}
      fallback={world ? worldPathToExplorePath(world) : null}
      section={section}
    />
  );
}
