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
import { BackToExplore, MiniConstellation, SPECIALTY_ACCENTS, accentCard } from "./exploreUi";

const COPY: Record<string, { eyebrow: string; title: (n?: string) => string; body: string }> = {
  learning: {
    eyebrow: "Explore · Learning",
    title: (n) => (n ? `${n}, subjects are bigger on the inside.` : "Subjects are bigger on the inside."),
    body:
      "A subject at school is a list of things to be tested on, which tells you almost nothing about what it's like to actually do — architecture is standing in someone's kitchen with a tape measure, not a chapter on floor plans. Each of these opens into the branches inside it and what a real day in them feels like, so you can find out whether the thing itself grabs you before you commit years to it.",
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

      {/* 3) The paths, each its own world */}
      {paths.length > 0 ? (
        <div className="space-y-3">
          {paths.map((p, i) => (
            <WorldCard key={p.id} path={p} accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default WorldsLanding;
