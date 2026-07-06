"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../_components/detailSections";
import { playActivityToExplorePath } from "../../_data/playAdapter";
import { getPlayActivity } from "../../_data/playPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

export default function PlayPathSectionPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);

  if (!pathId || !isSectionKey(section)) notFound();
  const activity = getPlayActivity(pathId);

  return (
    <ExplorePathDetailLoader
      lane="play"
      slug={pathId}
      fallback={activity ? playActivityToExplorePath(activity) : null}
      section={section}
    />
  );
}
