"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../../_components/detailSections";
import { worldPathToExplorePath } from "../../../_data/worldAdapter";
import { getWorldPath } from "../../../_data/worldPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

// One way into a place — a heritage site you could stand in, or a living
// practice you could take part in — at
// /main/explore/world/{slug}/specialties/{branchSlug}.
//
// World paths are anchored to UNESCO's World Heritage and Intangible Cultural
// Heritage lists, so these branches are real entries rather than invented ones.
// Adding branches to a lane creates links that need somewhere to land: Play
// shipped without this route and every one of its branch cards 404'd, so this
// one goes in alongside the content rather than after someone reports it.
export default function WorldBranchPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);
  const branchSlug = firstParam(params?.branchSlug);

  if (!pathId || !isSectionKey(section) || !branchSlug) notFound();
  const world = getWorldPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="world"
      slug={pathId}
      fallback={world ? worldPathToExplorePath(world) : null}
      section={section}
      branchSlug={branchSlug}
    />
  );
}
