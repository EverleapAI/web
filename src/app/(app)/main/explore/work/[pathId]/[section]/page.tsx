"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../_components/detailSections";
import { workPathToExplorePath } from "../../_data/workAdapter";
import { getWorkPath } from "../../_data/workPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

export default function WorkPathSectionPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);

  if (!pathId || !isSectionKey(section)) notFound();
  const work = getWorkPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="work"
      slug={pathId}
      fallback={work ? workPathToExplorePath(work) : null}
      section={section}
    />
  );
}
