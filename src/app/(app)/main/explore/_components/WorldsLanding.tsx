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
import { ChevronRight, ExternalLink, Search, Sparkles, X } from "lucide-react";

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

const COPY: Record<
  string,
  {
    eyebrow: string;
    title: (n?: string) => string;
    body: string;
    picksTitle: string;
    stretchTitle: string;
    stretchNote: string;
    browseLabel: (n: number) => string;
  }
> = {
  learning: {
    eyebrow: "Explore · Learning",
    picksTitle: "Where I'd start, for you",
    stretchTitle: "Further from you, on purpose",
    stretchNote: "Nothing you've said points here. That's the reason to look.",
    browseLabel: (n) => `Browse every subject (${n} more)`,
    title: (n) => (n ? `${n}, subjects are bigger on the inside.` : "Subjects are bigger on the inside."),
    body:
      "A subject at school is a list of things to be tested on, which tells you almost nothing about what it's like to actually do — architecture is standing in someone's kitchen with a tape measure, not a chapter on floor plans. Each of these opens into the branches inside it and what a real day in them feels like, so you can find out whether the thing itself grabs you before you commit years to it.",
  },
  world: {
    eyebrow: "Explore · World",
    picksTitle: "Places I'd point you at",
    stretchTitle: "Somewhere you wouldn't have looked",
    stretchNote: "Nothing you've told me points here. That's why it's on the list.",
    browseLabel: (n) => `Browse the whole world (${n} more places)`,
    title: (n) => (n ? `${n}, the world is a set of places you can actually meet.` : "The world is a set of places you can actually meet."),
    body:
      "A country is easy to reduce to a flag and a couple of facts, which tells you nothing about what it's like to stand somewhere in it or take part in something people there still do. Each of these opens into real places and living traditions — the ones UNESCO keeps track of — and every way in works whether or not you'll ever get on a plane, because a language exchange or cooking a dish properly is a real way to meet a place too.",
  },
  impact: {
    eyebrow: "Explore · Impact",
    picksTitle: "Causes I'd point you at",
    stretchTitle: "Further from you, on purpose",
    stretchNote: "Nothing you've said points here. Worth one look anyway.",
    browseLabel: (n) => `Browse every cause (${n} more)`,
    title: (n) => (n ? `${n}, caring about it is the easy part.` : "Caring about it is the easy part."),
    body:
      "Most people who want to make a difference get stuck at the same place — not on whether they care, but on what they'd actually do on a Tuesday, and how the first meeting being half-empty is normal rather than a sign to stop. Each of these opens into real ways of getting involved and what they honestly feel like from the inside, so you can pick one and go rather than wait to feel ready.",
  },
};

type CardDoor = { id: string; title: string; href: string; tag?: string };

/** "Fully funded · blurb · eligibility" — the first clause is the one that decides. */
function costTag(note?: string): string | undefined {
  if (!note) return undefined;
  if (note.startsWith("Fully funded")) return "fully funded";
  if (note.startsWith("Free")) return "free";
  return undefined;
}

/**
 * A few doors spanning the whole range of what's possible, not the first few in
 * the file.
 *
 * The content's own doors are things to do this week — cook the dish, watch the
 * film — and the ways-to-go registry holds the big ones: a funded year abroad.
 * Taking the first N would only ever show the small end, which is the version of
 * this screen that reads as homework. So the card carries both: something you
 * could do tonight, and something you could actually go and do.
 */
function topDoors(path: ExplorePath, limit: number): CardDoor[] {
  const near: CardDoor[] = [];
  const going: CardDoor[] = [];
  for (const section of path.nextSteps?.sections ?? []) {
    for (const item of section.items ?? []) {
      if (!item.href) continue;
      const door: CardDoor = {
        id: `${path.slug}:${item.id}`,
        title: item.title,
        href: item.href,
        // Only the registry's cost tags. The catalog's own `mode` can't be
        // trusted for this — "cook a Korean dish properly" is stored as local,
        // and a kitchen is not somewhere you go.
        tag: costTag(item.note),
      };
      (item.id?.startsWith("waytogo:") ? going : near).push(door);
    }
  }
  // Leave room for one way to go, so it is never crowded out by the small stuff.
  const keep = going.length > 0 ? Math.max(1, limit - 1) : limit;
  return [...near.slice(0, keep), ...going.slice(0, limit - Math.min(near.length, keep))];
}

function WorldCard({
  path,
  accent,
  doors = [],
}: {
  path: ExplorePath;
  accent: string;
  doors?: CardDoor[];
}) {
  const branches = path.branches?.previews ?? [];
  const href = `/main/explore/${path.lane}/${path.slug}`;

  // A card carrying doors is a card someone can act on, so the branch names
  // step aside: two lists of things-inside compete, and only one of them
  // goes anywhere.
  const showBranches = doors.length === 0 && branches.length > 0;

  const head = (
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
          {showBranches ? (
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
  );

  if (doors.length === 0) {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-card border px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
        style={accentCard(accent)}
      >
        {head}
      </Link>
    );
  }

  // Doors are real destinations, so each one is its own link — which means the
  // card can no longer be a single anchor wrapping everything (an anchor inside
  // an anchor is invalid, and the door would never get the tap).
  return (
    <div className="relative overflow-hidden rounded-card border" style={accentCard(accent)}>
      <Link
        href={href}
        className="group block px-4 pb-3 pt-4 transition duration-200 hover:brightness-110"
      >
        {head}
      </Link>
      <div className="border-t border-white/[0.07] px-4 pb-3.5 pt-3">
        <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/35">
          Things you could do
        </span>
        <ul className="mt-2 space-y-1.5">
          {doors.map((d) => (
            <li key={d.id}>
              <a
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="group/door flex items-start gap-2 text-label leading-snug text-white/78 transition hover:text-white"
              >
                <span aria-hidden className="mt-px shrink-0" style={{ color: `rgba(${accent},0.85)` }}>
                  →
                </span>
                <span className="min-w-0 flex-1">
                  {d.title}
                  {d.tag ? (
                    <span className="ml-1.5 text-micro font-medium text-white/40">{d.tag}</span>
                  ) : null}
                </span>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25 transition group-hover/door:text-white/60" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WorldsLanding({
  lane,
  paths,
  serverRanked,
  pickedCount = 0,
}: {
  lane: Lane;
  paths: ExplorePath[];
  serverRanked?: boolean;
  pickedCount?: number;
}) {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT[lane];
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;
  const copy = COPY[lane] ?? COPY.learning;

  // At 153 places, region grouping keeps the page navigable but Europe alone is
  // 46 cards — someone looking for one thing shouldn't have to scroll for it.
  // Matches on the title and on what's inside, so "temple" finds Japan and
  // "coral" finds the countries with reefs.
  const [query, setQuery] = React.useState("");
  const searchable = paths.length >= 20;
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return paths;
    return paths.filter((p) => {
      const inTitle = p.card.title.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
      const inHook = (p.card.hook ?? "").toLowerCase().includes(q);
      const inBranches = (p.branches?.previews ?? []).some(
        (b) => b.title.toLowerCase().includes(q) || (b.oneLiner ?? "").toLowerCase().includes(q)
      );
      return inTitle || inHook || inBranches;
    });
  }, [paths, query]);

  // Order by fit rather than by alphabet. Nothing is dropped — every path stays
  // on the page — but the ones that match this reader lead, so Learning doesn't
  // open on "Agriculture + Animal Science" for everyone purely because A sorts
  // first. Without a profile we keep the catalog's own order.
  //
  // When the server ranked them, leave them alone. The lane matcher chose these
  // for this person and put its picks first, each carrying its own reason in the
  // hook. Re-sorting by keyword overlap would scatter those picks back through
  // the catalog — and it scrambles hardest for the readers with the most signal,
  // since those are the ones whose profile text makes the keyword scores diverge.
  const ordered = React.useMemo(() => {
    if (serverRanked || !profile) return filtered;
    return rankPaths(filtered, profile, filtered.length).map((r) => r.path);
  }, [filtered, profile, serverRanked]);

  // The server puts the chosen paths first and says how many. Splitting there is
  // the only way to tell a pick from a path that merely sorted well.
  const picks = React.useMemo(
    () => (serverRanked ? ordered.slice(0, pickedCount) : []),
    [ordered, serverRanked, pickedCount]
  );
  const rest = React.useMemo(
    () => (picks.length > 0 ? ordered.slice(picks.length) : ordered),
    [ordered, picks.length]
  );

  // Two named groups, in order. This is what answers "why am I looking at this"
  // before a single card is read — the heading explains the list, so the copy
  // inside the cards doesn't have to carry it alone.
  //
  // A group with nothing in it is dropped rather than shown empty: a thin
  // profile may yield no stretch pick at all, and "places that would stretch
  // you" over blank space reads as a broken screen.
  const pickGroups = React.useMemo(() => {
    const mirror = picks.filter((p) => p.matchKind !== "stretch");
    const stretch = picks.filter((p) => p.matchKind === "stretch");
    return [
      { kind: "mirror" as const, items: mirror },
      { kind: "stretch" as const, items: stretch },
    ].filter((g) => g.items.length > 0);
  }, [picks]);

  // With picks on the screen the catalog starts folded — but a search has to
  // reach the whole lane, so typing opens it regardless.
  const [browsing, setBrowsing] = React.useState(false);
  const showCatalog = picks.length === 0 || browsing || Boolean(query.trim());

  // World groups by region; the other lanes are small enough to read straight
  // through. A place with no region, or one shared across two, falls into a
  // final bucket rather than being dropped. Fit-order is preserved inside each
  // region.
  const catalog = query.trim() ? ordered : rest;

  const grouped = React.useMemo(() => {
    if (lane !== "world" || catalog.length < 20) return null;
    const buckets = new Map<string, ExplorePath[]>();
    for (const p of catalog) {
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
  }, [lane, catalog]);

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

      {/* 3) What was chosen for this person, and what they could do with it.
             A list of places answers "where"; it never answers "why am I
             looking at this". The picks lead, each carrying the reason it was
             chosen and the first things it opens onto — so the invitation is on
             the screen rather than two taps under it. */}
      {picks.length > 0 && !query
        ? pickGroups.map((group) => (
            <div key={group.kind} className="space-y-3">
              <div className="px-1">
                <h2 className="text-micro font-semibold uppercase tracking-eyebrow text-white/45">
                  {group.kind === "stretch" ? copy.stretchTitle : copy.picksTitle}
                </h2>
                {group.kind === "stretch" ? (
                  <RowMeta className="mt-1 block text-white/45">{copy.stretchNote}</RowMeta>
                ) : null}
              </div>
              {group.items.map((p, i) => (
                <WorldCard
                  key={p.id}
                  path={p}
                  accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]}
                  doors={topDoors(p, 3)}
                />
              ))}
            </div>
          ))
        : null}

      {/* 4) Everything else, behind a door of its own. The full catalog is why
             this lane needed region grouping; it is not why someone opened it. */}
      {picks.length > 0 && !query ? (
        <button
          type="button"
          onClick={() => setBrowsing((b) => !b)}
          className="flex w-full items-center justify-between rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-label text-white/70 transition hover:border-white/20 hover:text-white"
        >
          <span>{browsing ? "Hide the rest" : copy.browseLabel(rest.length)}</span>
          <ChevronRight
            className={`h-4 w-4 transition ${browsing ? "rotate-90" : ""}`}
          />
        </button>
      ) : null}

      {searchable && showCatalog ? (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lane === "world" ? "Search places, sites, traditions…" : "Search…"}
            aria-label="Search this lane"
            className="w-full rounded-control border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-9 text-label text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}

      {query && ordered.length === 0 ? (
        <RowMeta className="block px-1">
          Nothing here matches “{query}”. Try a place, a craft, or something you’d want to see.
        </RowMeta>
      ) : null}

      {/* 3) The paths. World carries 150+ places and the deck arrives unranked,
             so it groups by UNESCO's own regions — pick a part of the world,
             then a place in it — rather than becoming one long alphabetical
             wall. Every other lane is small enough to read straight through. */}
      {!showCatalog ? null : grouped ? (
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
