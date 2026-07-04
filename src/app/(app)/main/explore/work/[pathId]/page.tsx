"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetail } from "../../_components/ExplorePathDetail";
import { workPathToExplorePath } from "../_data/workAdapter";
import { getWorkPath } from "../_data/workPaths";

export default function WorkPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const work = pathId ? getWorkPath(pathId) : null;
  if (!work) notFound();

  return <ExplorePathDetail path={workPathToExplorePath(work)} />;
}
