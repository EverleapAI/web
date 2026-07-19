// apps/everleap-app/.../explore/_components/ExploreSummaryLoader.tsx
//
// Wires the /main/explore summary entry to the DB catalog. Renders the mock
// composition instantly, then fetches every lane's deck from the catalog (in
// parallel) and swaps each lane to its DB deck. Any lane that misses/errors
// keeps its mock deck, so this can't regress the summary.

"use client";

import * as React from "react";

import { ExploreSummary, type SummaryLane } from "./ExploreSummary";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

async function fetchDeck(
  lane: Lane,
  signal: AbortSignal
): Promise<{ paths: ExplorePath[]; total?: number } | null> {
  try {
    const res = await fetch(`/api/explore/paths?lane=${encodeURIComponent(lane)}`, {
      credentials: "include",
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; total?: number; paths?: ExplorePath[] };
    return data?.ok && Array.isArray(data.paths) && data.paths.length > 0
      ? { paths: data.paths, total: data.total }
      : null;
  } catch {
    return null;
  }
}

export function ExploreSummaryLoader({
  fallbackLanes,
}: {
  fallbackLanes: SummaryLane[];
}) {
  const [lanes, setLanes] = React.useState<SummaryLane[]>(fallbackLanes);

  React.useEffect(() => {
    const controller = new AbortController();
    Promise.all(
      fallbackLanes.map(async (l) => {
        const deck = await fetchDeck(l.lane, controller.signal);
        return {
          lane: l.lane,
          paths: deck?.paths ?? l.paths,
          // How big the lane really is. Work serves a deck of matches, so its
          // returned length is not its size.
          total: deck?.total ?? (deck?.paths ?? l.paths).length,
        } as SummaryLane;
      })
    ).then((next) => {
      if (!controller.signal.aborted) setLanes(next);
    });
    return () => controller.abort();
    // fallbackLanes is a module constant; run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExploreSummary lanes={lanes} />;
}
