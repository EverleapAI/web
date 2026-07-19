// apps/web/src/app/(app)/main/explore/_components/DoorsLanding.tsx
//
// The World and Play landing — doors-first instead of depth-first.
//
// Work earns its constellation because a career is years away and can't be
// sampled: you need the specialties, the day-in-life, the descents. World and
// Play are the opposite. Their content is already action-shaped ("parkrun (free
// weekly 5K events)", "Go to a real cultural event near you this week"), and the
// shortest path to the real world is short. So the hero here is the thing you
// could go do, not the path it came from — the paths sit underneath to wander.
//
//   1. Agentic entry (one paragraph)
//   2. Trophies (AwardsMeter)
//   3. The doors — real opportunities pulled from across the lane, near-you first
//   4. The paths themselves, small, to browse
//
// Work stays on WorkLanding; Learning and Impact stay on ExploreLanding.

"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Globe, MapPin, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";

import { LANE_ACCENT, type ExplorePath, type Lane, type Rgb } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { rankPaths } from "../_lib/scorePath";
import { BackToExplore, LANE_ICON, rgba } from "./exploreUi";

const MAX_DOORS = 8;

const COPY: Record<string, { eyebrow: string; title: (n?: string) => string; body: string; doors: string; browse: string }> = {
  world: {
    eyebrow: "Explore · World",
    title: (n) => (n ? `${n}, the world is closer than it looks.` : "The world is closer than it looks."),
    body:
      "You don't need a plane ticket to meet a piece of the world — a conversation in another language, a dish you've never cooked, a festival two towns over all count, and each one tells you something a page about it never could. Here are real ways in that people your age actually use, and underneath them the parts of the world worth wandering into.",
    doors: "Ways in you could take this week",
    browse: "Or wander somewhere",
  },
  play: {
    eyebrow: "Explore · Play",
    title: (n) => (n ? `${n}, this one's not a plan. Go play.` : "This one's not a plan. Go play."),
    body:
      "Play is the one part of Explore that doesn't need a strategy — you can't really research your way into whether you like climbing, you just go once and find out, and the whole point is that it costs you an afternoon instead of a decade. Here are real places and groups near you and online, and underneath them the things worth trying at all.",
    doors: "Things you could actually go do",
    browse: "Or find something to try",
  },
};

type Door = {
  id: string;
  title: string;
  href: string;
  note?: string;
  local: boolean;
  fromTitle: string;
  fromHref: string;
};

// One door per path first, then a second from each, and so on — so eight doors
// come from eight different things rather than three from whichever path is first.
function collectDoors(paths: ExplorePath[]): Door[] {
  const perPath = paths.map((p) => {
    const items = (p.nextSteps?.sections ?? []).flatMap((s) =>
      (s.items ?? []).map((i) => ({
        id: `${p.slug}:${i.id}`,
        title: i.title,
        href: i.href,
        note: i.note,
        local: (i.mode ?? s.mode) === "local",
        fromTitle: p.card.title,
        fromHref: `/main/explore/${p.lane}/${p.slug}`,
      }))
    );
    return items;
  });

  const seen = new Set<string>();
  const out: Door[] = [];
  const depth = Math.max(0, ...perPath.map((l) => l.length));
  for (let round = 0; round < depth && out.length < MAX_DOORS * 2; round++) {
    for (const list of perPath) {
      const d = list[round];
      if (!d || !d.href || seen.has(d.href)) continue;
      seen.add(d.href);
      out.push(d);
    }
  }
  // Near-you leads: a place you can physically get to beats a link every time.
  return [...out.filter((d) => d.local), ...out.filter((d) => !d.local)].slice(0, MAX_DOORS);
}

function DoorRow({ door, accent }: { door: Door; accent: Rgb }) {
  const Icon = door.local ? MapPin : Globe;
  const tone = door.local ? "52, 211, 153" : "96, 176, 255";
  const external = /^https?:/i.test(door.href);

  return (
    <a
      href={door.href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-start gap-3 rounded-panel border px-4 py-3.5 transition hover:brightness-110"
      style={{ borderColor: rgba(accent, 0.22), backgroundColor: rgba(accent, 0.06) }}
    >
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-control"
        style={{ backgroundColor: `rgba(${tone},0.12)`, color: `rgba(${tone},0.92)` }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <RowTitle>{door.title}</RowTitle>
        {door.note ? <RowMeta className="mt-0.5 block">{door.note}</RowMeta> : null}
        <RowMeta className="mt-1 block text-white/40">{door.fromTitle}</RowMeta>
      </span>
      {external ? <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-white/35" /> : null}
    </a>
  );
}

export function DoorsLanding({ lane, paths }: { lane: Lane; paths: ExplorePath[] }) {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT[lane];
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;
  const copy = COPY[lane] ?? COPY.play;
  const Icon = LANE_ICON[lane];

  // Order by fit first, so the doors come from the activities most likely to
  // land with this reader rather than whichever path happens to sort first.
  // Nothing is dropped; the browse list below shows every path in the same order.
  const ordered = React.useMemo(
    () => (profile ? rankPaths(paths, profile, paths.length).map((r) => r.path) : paths),
    [paths, profile]
  );
  const doors = React.useMemo(() => collectDoors(ordered), [ordered]);
  const near = doors.filter((d) => d.local).length;

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
                style={{ backgroundColor: rgba(accent, 0.1), color: rgba(accent, 0.8) }}
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

      {/* 3) The doors — the whole point of these two lanes */}
      {doors.length > 0 ? (
        <SectionCard tone="neutral">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
              style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle as="h2">{copy.doors}</CardTitle>
              <RowMeta className="mt-1 block">
                {near > 0
                  ? `${near} of these are places you can physically get to.`
                  : "Real groups, events and classes — not more reading."}
              </RowMeta>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {doors.map((d) => (
              <DoorRow key={d.id} door={d} accent={accent} />
            ))}
          </div>
        </SectionCard>
      ) : null}

      {/* 4) The paths, small — browsing is the secondary act here */}
      {paths.length > 0 ? (
        <SectionCard tone="neutral" compact>
          <CardTitle as="h2">{copy.browse}</CardTitle>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ordered.map((p) => (
              <Link
                key={p.id}
                href={`/main/explore/${p.lane}/${p.slug}`}
                className="rounded-panel border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:bg-white/[0.06]"
              >
                <RowTitle>{p.card.title}</RowTitle>
                {p.card.hook ? <RowMeta className="mt-0.5 block line-clamp-2">{p.card.hook}</RowMeta> : null}
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default DoorsLanding;
