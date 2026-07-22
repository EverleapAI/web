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
    // view=summary: the home needs a card and enough text to score, not every
    // path's whole content. Asking for the lot shipped 3.6MB on this screen —
    // 2.5MB of it the World lane alone.
    const res = await fetch(
      `/api/explore/paths?lane=${encodeURIComponent(lane)}&view=summary`,
      {
        credentials: "include",
        signal,
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; total?: number; paths?: ExplorePath[] };
    return data?.ok && Array.isArray(data.paths) && data.paths.length > 0
      ? { paths: data.paths, total: data.total }
      : null;
  } catch {
    return null;
  }
}

/** All five decks in one call. null means "couldn't", so the caller falls back. */
async function fetchHome(
  signal: AbortSignal
): Promise<{ lane: Lane; paths: ExplorePath[]; total?: number }[] | null> {
  try {
    const res = await fetch("/api/guidance/explore-home", {
      credentials: "include",
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      lanes?: { lane: Lane; paths?: ExplorePath[]; total?: number }[];
    };
    if (!data?.ok || !Array.isArray(data.lanes)) return null;
    return data.lanes
      .filter((d) => Array.isArray(d.paths) && d.paths.length > 0)
      .map((d) => ({ lane: d.lane, paths: d.paths as ExplorePath[], total: d.total }));
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

    // ONE request for all five lanes, not five.
    //
    // This fired one call per lane in parallel. On a consumption plan five
    // simultaneous calls can wake five instances, and the worst of them
    // measured 1418ms against a ~150ms warm call — five cold starts to draw one
    // screen, on a phone. The server does the same work, in parallel, inside a
    // single invocation.
    //
    // Falls back to the per-lane path if the batch endpoint isn't there yet:
    // web and API deploy separately, so for a few minutes one can be ahead of
    // the other, and this screen must not blank in that window.
    (async () => {
      const batched = await fetchHome(controller.signal);
      if (controller.signal.aborted) return;

      const byLane = new Map(
        (batched ?? []).map((d) => [d.lane, d] as const)
      );
      const next = await Promise.all(
        fallbackLanes.map(async (l) => {
          const deck =
            byLane.get(l.lane) ??
            (batched === null ? await fetchDeck(l.lane, controller.signal) : null);
          return {
            lane: l.lane,
            paths: deck?.paths ?? l.paths,
            // How big the lane really is. Work serves a deck of matches, so its
            // returned length is not its size.
            total: deck?.total ?? (deck?.paths ?? l.paths).length,
          } as SummaryLane;
        })
      );
      if (!controller.signal.aborted) setLanes(next);
    })();

    return () => controller.abort();
    // fallbackLanes is a module constant; run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExploreSummary lanes={lanes} />;
}
