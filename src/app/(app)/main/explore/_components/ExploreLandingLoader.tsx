// apps/web/src/app/(app)/main/explore/_components/ExploreLandingLoader.tsx
//
// Landing-wiring counterpart to ExplorePathDetailLoader. Renders the mock deck
// instantly, then fetches the lane's deck from the DB catalog and swaps it in.
// Once wired, adding a path to a lane is a DB row — no code change. Any
// miss/error keeps the mock deck, so this can't regress the landings.

"use client";

import * as React from "react";

import { ExploreLanding } from "./ExploreLanding";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

async function fetchCatalogDeck(
  lane: Lane,
  signal: AbortSignal
): Promise<ExplorePath[] | null> {
  try {
    const res = await fetch(`/api/explore/paths?lane=${encodeURIComponent(lane)}`, {
      credentials: "include",
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; paths?: ExplorePath[] };
    return data?.ok && Array.isArray(data.paths) && data.paths.length > 0
      ? data.paths
      : null;
  } catch {
    return null;
  }
}

export function ExploreLandingLoader({
  lane,
  fallback,
}: {
  lane: Lane;
  fallback: ExplorePath[];
}) {
  const [paths, setPaths] = React.useState<ExplorePath[]>(fallback);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchCatalogDeck(lane, controller.signal).then((deck) => {
      if (deck) setPaths(deck);
    });
    return () => controller.abort();
  }, [lane]);

  return <ExploreLanding lane={lane} paths={paths} />;
}
