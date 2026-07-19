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
import { PathConstellation } from "./PathConstellation";
import { SectionCard } from "../../components/ui/SectionCard";
import type { SectionKey } from "./detailSections";
import type { OnetDetail } from "./OnetFacts";
import type { ExplorePath, Lane } from "../_data/exploreSchema";

type CatalogPath = { path: ExplorePath; whyYou: string | null; onet: OnetDetail | null };

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
      onet?: OnetDetail;
    };
    if (!data?.ok || !data.path) return null;
    return {
      path: data.path,
      whyYou: data.match?.whyYou?.trim() || null,
      onet: data.onet ?? null,
    };
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
      className="inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back to {laneLabel(lane)}</span>
    </Link>
  );
}

// When a path isn't cached yet, generating it takes a few seconds — so instead
// of a bare skeleton, we narrate what's happening (like the post-RegAuth reveal)
// so the user is never left staring at a blank screen.
const GENERATING_MESSAGES = [
  "Pulling together what this path is really like…",
  "Checking real-world data from the U.S. Department of Labor…",
  "Looking at the day-to-day, the outlook, and how people get there…",
  "Shaping it around what we already know about you…",
];

function DetailLoading({ lane }: { lane: Lane }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % GENERATING_MESSAGES.length),
      2600
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="space-y-4 pb-24">
      <BackToLane lane={lane} />
      <SectionCard tone="hero">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-eyebrow text-white/45">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-white/25 border-t-white/70" />
            Putting this together
          </div>
          <p
            key={i}
            className="mt-4 text-body font-medium leading-body text-white/85 [animation:fadeIn_.5s_ease]"
          >
            {GENERATING_MESSAGES[i]}
          </p>
          <p className="mt-2 text-meta text-white/45">
            This one&rsquo;s new, so it takes a few seconds. It&rsquo;ll be instant next time.
          </p>
          <div className="mt-5 space-y-2.5 animate-pulse">
            <div className="h-3.5 w-full rounded bg-white/[0.06]" />
            <div className="h-3.5 w-[92%] rounded bg-white/[0.06]" />
            <div className="h-3.5 w-[80%] rounded bg-white/[0.06]" />
          </div>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
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
          <h1 className="text-title font-semibold leading-display tracking-title text-white sm:text-title">
            We couldn&rsquo;t load this path.
          </h1>
          <p className="mt-3 text-label leading-read text-white/72 sm:text-label">
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
  branchSlug,
}: {
  lane: Lane;
  slug: string;
  fallback: ExplorePath | null;
  // When set, render that deep section as its own screen instead of essentials.
  section?: SectionKey;
  // When set (under the specialties section), render that specialty's constellation.
  branchSlug?: string;
}) {
  const [path, setPath] = React.useState<ExplorePath | null>(fallback);
  const [whyYou, setWhyYou] = React.useState<string | null>(null);
  const [onet, setOnet] = React.useState<OnetDetail | null>(null);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    setMissing(false);
    fetchCatalogPath(lane, slug, controller.signal).then((catalog) => {
      // A cancelled request is not a missing path. fetchCatalogPath catches
      // everything and returns null, so an AbortError — from an effect cleanup,
      // a re-render, or navigating away — looked identical to "the catalog has
      // nothing". That rendered "We couldn't load this path" for a moment before
      // the retry succeeded and replaced it: an error message for a request that
      // was never allowed to finish.
      if (controller.signal.aborted) return;
      if (catalog) {
        setPath(catalog.path);
        setWhyYou(catalog.whyYou);
        setOnet(catalog.onet);
      } else if (!fallback) {
        // No mock and the catalog returned nothing — genuinely unavailable.
        setMissing(true);
      }
    });
    return () => controller.abort();
  }, [lane, slug, fallback]);

  if (path) {
    if (branchSlug) {
      return <PathConstellation path={path} branchSlug={branchSlug} whyYou={whyYou} onet={onet} />;
    }
    return section ? (
      <ExplorePathSection path={path} section={section} onet={onet} />
    ) : (
      <ExplorePathDetail path={path} whyYou={whyYou} onet={onet} />
    );
  }
  if (missing) return <DetailMissing lane={lane} />;
  return <DetailLoading lane={lane} />;
}
