"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { workPathToExplorePath } from "../_data/workAdapter";
import { getWorkPath } from "../_data/workPaths";

export default function WorkPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const work = pathId ? getWorkPath(pathId) : null;
  if (!work) notFound();

  return (
    <ExplorePathDetailLoader
      lane="work"
      slug={pathId}
      fallback={workPathToExplorePath(work)}
    />
  );
}
