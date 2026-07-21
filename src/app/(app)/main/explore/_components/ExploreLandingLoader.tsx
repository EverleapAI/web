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
import { ArrivalGate } from "../../components/interstitial/ArrivalGate";

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

  // A lane is a first-level screen under Explore, so it gets the interstitial
  // and its own budget — the same standing as an Insights tab.
  //
  // The rule across the app: a section's summary and its direct children, and
  // nothing deeper. A path (Ghana) is two levels down and a constellation is
  // three, so neither asks anything; by then someone has clicked through to one
  // specific thing and a question is in the way rather than at the door.
  //
  // Questions come from Explore's pool: no lane-specific generator exists yet,
  // so a World question is really an Explore question. Same section, so it is
  // relevant — but writing per-lane questions would make it more so.
  const inner =
    variant === "doors" ? (
      <DoorsLanding lane={lane} paths={paths} serverRanked={serverRanked} />
    ) : variant === "worlds" ? (
      <WorldsLanding lane={lane} paths={paths} serverRanked={serverRanked} />
    ) : (
      <ExploreLanding lane={lane} paths={paths} serverRanked={serverRanked} />
    );

  return (
    <ArrivalGate pageKey={`explore_${lane}`} taskSource="explore_summary">
      {inner}
    </ArrivalGate>
  );
}
