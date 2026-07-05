"use client";

import { notFound, useParams } from "next/navigation";

import { ExplorePathDetailLoader } from "../../_components/ExplorePathDetailLoader";
import { playActivityToExplorePath } from "../_data/playAdapter";
import { getPlayActivity } from "../_data/playPaths";

export default function PlayPathDetailPage() {
  const params = useParams();
  const raw = params?.pathId;
  const pathId = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  if (!pathId) notFound();
  const activity = getPlayActivity(pathId);

  return (
    <ExplorePathDetailLoader
      lane="play"
      slug={pathId}
      fallback={activity ? playActivityToExplorePath(activity) : null}
    />
  );
}
