// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetailLoader.tsx
//
// Detail-first Phase B wiring. When a local mock exists it renders IMMEDIATELY
// (zero perceived latency), then fetches the same path from the DB catalog by
// slug and swaps to it. When there is NO mock — i.e. a warm/DB-only catalog path
// with no frozen Phase-A mock — it shows a brief loading state, fetches the
// catalog, and renders that. Only if the catalog genuinely has nothing does it
// fall to a graceful not-found. (Previously the detail page hard-404'd whenever
// the mock was missing, so every DB-only path was unreachable even though its
// content was sitting in the catalog.)

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ExplorePathDetail } from "./ExplorePathDetail";
import { ExplorePathSection } from "./ExplorePathSection";
import { SectionCard } from "../../components/ui/SectionCard";
import type { SectionKey } from "./detailSections";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

type CatalogPath = { path: ExplorePath; whyYou: string | null };

async function fetchCatalogPath(
  lane: Lane,
  slug: string,
  signal: AbortSignal
): Promise<CatalogPath | null> {
  try {
    const res = await fetch(
      `/api/explore/path?lane=${encodeURIComponent(lane)}&slug=${encodeURIComponent(slug)}`,
      { credentials: "include", signal }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      path?: ExplorePath;
      match?: { whyYou?: string };
    };
    if (!data?.ok || !data.path) return null;
    return { path: data.path, whyYou: data.match?.whyYou?.trim() || null };
  } catch {
    return null;
  }
}

function laneLabel(lane: Lane): string {
  return lane[0].toUpperCase() + lane.slice(1);
}

function BackToLane({ lane }: { lane: Lane }) {
  return (
    <Link
      href={`/main/explore/${lane}`}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition hover:text-white/85"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back to {laneLabel(lane)}</span>
    </Link>
  );
}

function DetailLoading({ lane }: { lane: Lane }) {
  return (
    <div className="space-y-4 pb-24">
      <BackToLane lane={lane} />
      <SectionCard tone="hero">
        <div className="max-w-2xl animate-pulse">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-4 h-8 w-3/4 rounded-lg bg-white/10" />
          <div className="mt-5 space-y-2.5">
            <div className="h-3.5 w-full rounded bg-white/[0.07]" />
            <div className="h-3.5 w-[92%] rounded bg-white/[0.07]" />
            <div className="h-3.5 w-[80%] rounded bg-white/[0.07]" />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function DetailMissing({ lane }: { lane: Lane }) {
  return (
    <div className="space-y-4 pb-24">
      <BackToLane lane={lane} />
      <SectionCard tone="hero">
        <div className="max-w-2xl">
          <h1 className="text-[23px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[27px]">
            We couldn&rsquo;t load this path.
          </h1>
          <p className="mt-3 text-[14px] leading-[1.66] text-white/72 sm:text-[15px]">
            It may still be generating, or it isn&rsquo;t in the catalog yet. Head
            back and try another direction in {laneLabel(lane)}.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

export function ExplorePathDetailLoader({
  lane,
  slug,
  fallback,
  section,
}: {
  lane: Lane;
  slug: string;
  fallback: ExplorePath | null;
  // When set, render that deep section as its own screen instead of essentials.
  section?: SectionKey;
}) {
  const [path, setPath] = React.useState<ExplorePath | null>(fallback);
  const [whyYou, setWhyYou] = React.useState<string | null>(null);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    setMissing(false);
    fetchCatalogPath(lane, slug, controller.signal).then((catalog) => {
      if (catalog) {
        setPath(catalog.path);
        setWhyYou(catalog.whyYou);
      } else if (!fallback) {
        // No mock and the catalog returned nothing — genuinely unavailable.
        setMissing(true);
      }
    });
    return () => controller.abort();
  }, [lane, slug, fallback]);

  if (path) {
    return section ? (
      <ExplorePathSection path={path} section={section} />
    ) : (
      <ExplorePathDetail path={path} whyYou={whyYou} />
    );
  }
  if (missing) return <DetailMissing lane={lane} />;
  return <DetailLoading lane={lane} />;
}
