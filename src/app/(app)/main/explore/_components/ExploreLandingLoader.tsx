// apps/web/src/app/(app)/main/explore/_components/ExploreLandingLoader.tsx
//
// Landing-wiring counterpart to ExplorePathDetailLoader. Renders the mock deck
// instantly, then fetches the lane's deck from the DB catalog and swaps it in.
// Once wired, adding a path to a lane is a DB row — no code change. Any
// miss/error keeps the mock deck, so this can't regress the landings.

"use client";

import * as React from "react";

import { ExploreLanding } from "./ExploreLanding";
import { DoorsLanding } from "./DoorsLanding";
import { WorldsLanding } from "./WorldsLanding";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

type Deck = { paths: ExplorePath[]; serverRanked: boolean };

async function fetchCatalogDeck(
  lane: Lane,
  signal: AbortSignal
): Promise<Deck | null> {
  try {
    const res = await fetch(`/api/explore/paths?lane=${encodeURIComponent(lane)}`, {
      credentials: "include",
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      personalized?: boolean;
      paths?: ExplorePath[];
    };
    if (!data?.ok || !Array.isArray(data.paths) || data.paths.length === 0) return null;
    return { paths: data.paths, serverRanked: Boolean(data.personalized) };
  } catch {
    return null;
  }
}

export function ExploreLandingLoader({
  lane,
  fallback,
  variant = "default",
}: {
  lane: Lane;
  fallback: ExplorePath[];
  /** "doors" leads with opportunities (World, Play); "worlds" with the paths themselves (Learning, Impact). */
  variant?: "default" | "doors" | "worlds";
}) {
  const [paths, setPaths] = React.useState<ExplorePath[]>(fallback);
  const [serverRanked, setServerRanked] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchCatalogDeck(lane, controller.signal).then((deck) => {
      if (!deck) return;
      setPaths(deck.paths);
      setServerRanked(deck.serverRanked);
    });
    return () => controller.abort();
  }, [lane]);

  if (variant === "doors") return <DoorsLanding lane={lane} paths={paths} />;
  if (variant === "worlds") return <WorldsLanding lane={lane} paths={paths} />;
  return <ExploreLanding lane={lane} paths={paths} serverRanked={serverRanked} />;
}
