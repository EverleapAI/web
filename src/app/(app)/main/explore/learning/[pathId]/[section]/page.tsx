"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../../_components/ExplorePathDetailLoader";
import { isSectionKey } from "../../../_components/detailSections";
import { learningPathToExplorePath } from "../../_data/learningAdapter";
import { getLearningPath } from "../../_data/learningPaths";

function firstParam(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : "";
}

export default function LearningPathSectionPage() {
  const params = useParams();
  const pathId = firstParam(params?.pathId);
  const section = firstParam(params?.section);

  if (!pathId || !isSectionKey(section)) notFound();
  const learning = getLearningPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="learning"
      slug={pathId}
      fallback={learning ? learningPathToExplorePath(learning) : null}
      section={section}
    />
  );
}
