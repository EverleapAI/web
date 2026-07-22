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
import { ChevronRight, ExternalLink, Globe, MapPin, Sparkles } from "lucide-react";

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

type NearbyPlace = {
  id: string;
  title: string;
  href: string;
  note: string | null;
  fromTitle: string;
  fromHref: string;
};

export function DoorsLanding({
  lane,
  paths,
  serverRanked,
}: {
  lane: Lane;
  paths: ExplorePath[];
  serverRanked?: boolean;
}) {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT[lane];
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;
  const copy = COPY[lane] ?? COPY.play;
  const Icon = LANE_ICON[lane];

  // Order by fit first, so the doors come from the activities most likely to
  // land with this reader rather than whichever path happens to sort first.
  // Nothing is dropped; the browse list below shows every path in the same order.
  //
  // A server ranking wins: the lane matcher picked these for this person. That
  // matters more here than anywhere, because collectDoors takes them one per
  // path in order — so the order decides which real opportunities surface at all.
  const ordered = React.useMemo(
    () =>
      serverRanked || !profile
        ? paths
        : rankPaths(paths, profile, paths.length).map((r) => r.path),
    [paths, profile, serverRanked]
  );
  const doors = React.useMemo(() => collectDoors(ordered), [ordered]);
  const near = doors.filter((d) => d.local).length;

  // Real named venues near this reader, for the activities picked for them.
  // The generated doors say "board game cafés or shops" and "find a local
  // trail" — categories of place with instructions to go find one yourself.
  // These are the actual places, and they lead when we have them.
  const [nearby, setNearby] = React.useState<NearbyPlace[]>([]);
  const [needsZip, setNeedsZip] = React.useState(false);
  React.useEffect(() => {
    if (lane !== "play") return;
    const controller = new AbortController();
    fetch("/api/guidance/play-nearby", { credentials: "include", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.ok) return;
        setNeedsZip(Boolean(d.needsZip));
        if (Array.isArray(d.places)) setNearby(d.places);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [lane]);

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

      {/* 3a) Actual places, by name. Nothing renders when we have none — an
             empty section is honest, and a category standing in for a place
             reads as a real recommendation, which is worse. */}
      {nearby.length > 0 ? (
        <SectionCard tone="neutral">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
              style={{ backgroundColor: rgba(accent, 0.12), color: rgba(accent, 0.92) }}
            >
              <MapPin className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle as="h2">Real places near you</CardTitle>
              <RowMeta className="mt-1 block">
                Actual addresses you could turn up at, for the things you keep coming back to.
              </RowMeta>
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            {nearby.map((p) => (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-2.5 rounded-panel border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:bg-white/[0.06]"
              >
                <span className="min-w-0 flex-1">
                  <RowTitle>{p.title}</RowTitle>
                  <RowMeta className="mt-0.5 block">
                    {p.fromTitle}
                    {p.note ? ` · ${p.note}` : ""}
                  </RowMeta>
                </span>
                <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-white/30 transition group-hover:text-white/70" />
              </a>
            ))}
          </div>
        </SectionCard>
      ) : needsZip ? (
        <SectionCard tone="neutral" compact>
          <CardTitle as="h2">Where are you?</CardTitle>
          <RowMeta className="mt-1 block">
            Add your zip and this fills with actual places you could walk into.
          </RowMeta>
          <Link
            href="/main/profile/edit"
            className="mt-3 inline-flex items-center gap-1.5 text-label font-medium"
            style={{ color: rgba(accent, 0.95) }}
          >
            Add your zip
            <ChevronRight className="h-4 w-4" />
          </Link>
        </SectionCard>
      ) : null}

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
