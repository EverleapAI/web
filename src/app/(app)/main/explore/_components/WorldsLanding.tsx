// apps/web/src/app/(app)/main/explore/_components/WorldsLanding.tsx
//
// The Learning and Impact landing. These two sit between Work and Play: their
// paths DO open into constellations (they carry branches), but they carry no pay
// or outlook — a field of study is not a job forecast. So the landing's job is to
// make each path feel like a world worth entering, not to rank job prospects.
//
//   1. Agentic entry (one paragraph)
//   2. Trophies (AwardsMeter)
//   3. Each path as a world — own accent, constellation glyph, and an
//      anticipatory line about what opens inside
//
// Work has WorkLanding; World and Play lead with doors instead (DoorsLanding).

"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { RowMeta, RowTitle } from "@/lib/ui/card";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";

import { LANE_ACCENT, type ExplorePath, type Lane } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { BackToExplore, MiniConstellation, SPECIALTY_ACCENTS, accentCard } from "./exploreUi";
import { WORLD_REGION_BY_SLUG, WORLD_REGION_ORDER } from "../_data/worldRegions";

const COPY: Record<string, { eyebrow: string; title: (n?: string) => string; body: string }> = {
  learning: {
    eyebrow: "Explore · Learning",
    title: (n) => (n ? `${n}, subjects are bigger on the inside.` : "Subjects are bigger on the inside."),
    body:
      "A subject at school is a list of things to be tested on, which tells you almost nothing about what it's like to actually do — architecture is standing in someone's kitchen with a tape measure, not a chapter on floor plans. Each of these opens into the branches inside it and what a real day in them feels like, so you can find out whether the thing itself grabs you before you commit years to it.",
  },
  world: {
    eyebrow: "Explore · World",
    title: (n) => (n ? `${n}, the world is a set of places you can actually meet.` : "The world is a set of places you can actually meet."),
    body:
      "A country is easy to reduce to a flag and a couple of facts, which tells you nothing about what it's like to stand somewhere in it or take part in something people there still do. Each of these opens into real places and living traditions — the ones UNESCO keeps track of — and every way in works whether or not you'll ever get on a plane, because a language exchange or cooking a dish properly is a real way to meet a place too.",
  },
  impact: {
    eyebrow: "Explore · Impact",
    title: (n) => (n ? `${n}, caring about it is the easy part.` : "Caring about it is the easy part."),
    body:
      "Most people who want to make a difference get stuck at the same place — not on whether they care, but on what they'd actually do on a Tuesday, and how the first meeting being half-empty is normal rather than a sign to stop. Each of these opens into real ways of getting involved and what they honestly feel like from the inside, so you can pick one and go rather than wait to feel ready.",
  },
};

function WorldCard({ path, accent }: { path: ExplorePath; accent: string }) {
  const branches = path.branches?.previews ?? [];
  const href = `/main/explore/${path.lane}/${path.slug}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-card border px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
      style={accentCard(accent)}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-panel"
          style={{ background: `rgba(${accent},0.14)` }}
        >
          <span className="h-6 w-6">
            <MiniConstellation a={accent} />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <RowTitle className="block text-body">{path.card.title}</RowTitle>
          {path.card.hook ? (
            <RowMeta className="mt-1 block text-label leading-snug text-white/62">{path.card.hook}</RowMeta>
          ) : null}
          {branches.length > 0 ? (
            <span className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/35">Inside</span>
              {branches.slice(0, 3).map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1 text-micro font-medium"
                  style={{ color: `rgba(${accent},0.92)` }}
                >
                  <span aria-hidden>✦</span>
                  {b.title}
                </span>
              ))}
              {branches.length > 3 ? (
                <span className="text-micro font-medium text-white/40">+{branches.length - 3} more</span>
              ) : null}
            </span>
          ) : null}
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/85" />
      </div>
    </Link>
  );
}

export function WorldsLanding({ lane, paths }: { lane: Lane; paths: ExplorePath[] }) {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT[lane];
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;
  const copy = COPY[lane] ?? COPY.learning;

  // Order by fit rather than by alphabet. Nothing is dropped — every path stays
  // on the page — but the ones that match this reader lead, so Learning doesn't
  // open on "Agriculture + Animal Science" for everyone purely because A sorts
  // first. Without a profile we keep the catalog's own order.
  const ordered = React.useMemo(() => {
    if (!profile) return paths;
    return rankPaths(paths, profile, paths.length).map((r) => r.path);
  }, [paths, profile]);

  // World groups by region; the other lanes are small enough to read straight
  // through. A place with no region, or one shared across two, falls into a
  // final bucket rather than being dropped. Fit-order is preserved inside each
  // region.
  const grouped = React.useMemo(() => {
    if (lane !== "world" || ordered.length < 20) return null;
    const buckets = new Map<string, ExplorePath[]>();
    for (const p of ordered) {
      const raw = WORLD_REGION_BY_SLUG[p.slug] ?? "";
      const region = raw.split(",")[0].trim() || "Elsewhere in the world";
      if (!buckets.has(region)) buckets.set(region, []);
      buckets.get(region)!.push(p);
    }
    const regionOrder = [
      ...WORLD_REGION_ORDER.filter((r) => buckets.has(r)),
      ...[...buckets.keys()].filter((r) => !WORLD_REGION_ORDER.includes(r)),
    ];
    return regionOrder.map((region) => ({ region, items: buckets.get(region) ?? [] }));
  }, [lane, ordered]);

  if (!isReady) return null;
  const name = profile?.firstName;

  return (
    <div className="space-y-4">
      <BackToExplore />

      {/* 1) Agentic entry */}
      <SectionCard tone="hero" voice backdrop={<ReadAtmosphere seed={`lane:${lane}`} accent={accent} />}>
        <div className="relative max-w-2xl">
          <AgenticHeader
            glyph={
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control"
                style={{ backgroundColor: `rgba(${accentRgb},0.10)`, color: `rgba(${accentRgb},0.80)` }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow={copy.eyebrow}
            accentRgb={accentRgb}
          />
          <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
            {copy.title(name ?? undefined)}
          </h1>
          <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
            {copy.body}
          </p>
        </div>
      </SectionCard>

      {/* 2) Trophies */}
      <AwardsMeter stats={badges} />

      {/* 3) The paths. World carries 150+ places and the deck arrives unranked,
             so it groups by UNESCO's own regions — pick a part of the world,
             then a place in it — rather than becoming one long alphabetical
             wall. Every other lane is small enough to read straight through. */}
      {grouped ? (
        <div className="space-y-6">
          {grouped.map(({ region, items }) => (
            <div key={region}>
              <h2 className="mb-2.5 text-micro font-semibold uppercase tracking-eyebrow text-white/45">
                {region}
                <span className="ml-2 font-normal text-white/30">{items.length}</span>
              </h2>
              <div className="space-y-3">
                {items.map((p, i) => (
                  <WorldCard key={p.id} path={p} accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : ordered.length > 0 ? (
        <div className="space-y-3">
          {ordered.map((p, i) => (
            <WorldCard key={p.id} path={p} accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default WorldsLanding;
