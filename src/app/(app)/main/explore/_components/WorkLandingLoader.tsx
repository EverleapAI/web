// apps/web/src/app/(app)/main/explore/_components/WorkLandingLoader.tsx
//
// Fetches the user's personalized, server-ranked career deck (explore_path_matches
// → card_why) and hands it to WorkLanding. Renders immediately (empty deck +
// loading skeletons) so the hero / trophies / gate show right away; the cards
// swap in when the deck arrives. A miss keeps an empty deck rather than the mock,
// since the careers experience is only meaningful with real matches.

"use client";

import * as React from "react";

import { WorkLanding } from "./WorkLanding";
import type { ExplorePath } from "../_data/exploreSchema";

export function WorkLandingLoader() {
  const [paths, setPaths] = React.useState<ExplorePath[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/explore/paths?lane=work", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { ok?: boolean; paths?: ExplorePath[] } | null) => {
        if (data?.ok && Array.isArray(data.paths)) setPaths(data.paths);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return <WorkLanding paths={paths} deckLoading={loading} />;
}

export default WorkLandingLoader;
