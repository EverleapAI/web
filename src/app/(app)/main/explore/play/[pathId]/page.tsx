"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetail } from "../../_components/ExplorePathDetail";
import { playActivityToExplorePath } from "../_data/playAdapter";
import { getPlayActivity } from "../_data/playPaths";

export default function PlayPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  const activity = pathId ? getPlayActivity(pathId) : null;
  if (!activity) notFound();

  return <ExplorePathDetail path={playActivityToExplorePath(activity)} />;
}
