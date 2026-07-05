"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { learningPathToExplorePath } from "../_data/learningAdapter";
import { getLearningPath } from "../_data/learningPaths";

export default function LearningPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  if (!pathId) notFound();
  const learning = getLearningPath(pathId);

  return (
    <ExplorePathDetailLoader
      lane="learning"
      slug={pathId}
      fallback={learning ? learningPathToExplorePath(learning) : null}
    />
  );
}
