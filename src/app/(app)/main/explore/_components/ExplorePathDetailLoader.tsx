// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetailLoader.tsx
//
// Detail-first Phase B wiring. Renders the local mock content IMMEDIATELY (zero
// perceived latency), then fetches the same path from the DB catalog by slug and
// swaps to it when it resolves. Seeded content === the mock, so the swap is
// invisible today — but the page is now DB-backed, and any richer/updated catalog
// content (or future DB-only edits) shows up automatically. On miss/error the
// mock simply stays.

"use client";

import * as React from "react";

import { ExplorePathDetail } from "./ExplorePathDetail";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

async function fetchCatalogPath(
  lane: Lane,
  slug: string,
  signal: AbortSignal
): Promise<ExplorePath | null> {
  try {
    const res = await fetch(
      `/api/explore/path?lane=${encodeURIComponent(lane)}&slug=${encodeURIComponent(slug)}`,
      { credentials: "include", signal }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; path?: ExplorePath };
    return data?.ok && data.path ? data.path : null;
  } catch {
    return null;
  }
}

export function ExplorePathDetailLoader({
  lane,
  slug,
  fallback,
}: {
  lane: Lane;
  slug: string;
  fallback: ExplorePath;
}) {
  const [path, setPath] = React.useState<ExplorePath>(fallback);

  React.useEffect(() => {
    const controller = new AbortController();
    fetchCatalogPath(lane, slug, controller.signal).then((catalog) => {
      if (catalog) setPath(catalog);
    });
    return () => controller.abort();
  }, [lane, slug]);

  return <ExplorePathDetail path={path} />;
}
