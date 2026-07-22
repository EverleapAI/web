// apps/web/src/app/(app)/main/explore/_components/WorldWaysLanding.tsx
//
// World's front door: six ways of going.
//
// This lane used to open on 153 countries. That is our DEEPEST content sitting
// at the shallowest level — it asks someone to already care about Nepal before
// anything underneath it can matter, which is why the lane read as an
// encyclopedia no matter how good the material behind it got.
//
// A way of going is something you can want without knowing where yet. So the
// country moves down to where it pays off: what a place is actually like, read
// at the moment you're deciding whether to go there rather than as a reading
// assignment. Browsing places survives as a second door, not the only one.
//
// The shape deliberately matches the five lane cards on the Explore home — same
// grid, same whisper-and-count — because this is the same move one level down.

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Compass,
  Globe2,
  GraduationCap,
  Languages,
  Leaf,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { ReadAtmosphere } from "../../components/ui/ReadAtmosphere";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { RowMeta, RowTitle } from "@/lib/ui/card";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import { LANE_ACCENT } from "../_data/exploreSchema";
import { useExploreProfile } from "../_lib/exploreProfile";
import { BackToExplore, SPECIALTY_ACCENTS, accentCard } from "./exploreUi";

type WayCard = {
  kind: string;
  title: string;
  line: string;
  when: string;
  count: number;
  fundedCount: number;
  whisper: string | null;
  whisperTheme: string | null;
  bestCost: "funded" | "free" | "low" | "paid" | null;
  samples: string[];
};

const BEST_COST_LABEL: Record<string, string> = {
  funded: "fully funded",
  free: "free",
  low: "low cost",
  paid: "costs money",
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  work: Plane,
  gap: Compass,
  field: Leaf,
  language: Languages,
  school: GraduationCap,
  here: Globe2,
};

function WayCardTile({ card, accent }: { card: WayCard; accent: string }) {
  const Icon = ICONS[card.kind] ?? Globe2;
  return (
    <Link
      href={`/main/explore/world/ways/${card.kind}`}
      className="group relative block overflow-hidden rounded-card border px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
      style={accentCard(accent)}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-panel"
          style={{ background: `rgba(${accent},0.14)` }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <RowTitle className="block text-body">{card.title}</RowTitle>
            <span className="shrink-0 text-micro font-medium text-white/40">{card.when}</span>
          </span>
          <RowMeta className="mt-1 block text-label leading-snug text-white/62">{card.line}</RowMeta>

          {/* A fact about this card, never a manufactured tease. When nothing here
              speaks to them yet it says nothing at all — a generic whisper reads
              as a real recommendation, which is worse than silence. */}
          {card.whisper ? (
            <span
              className="mt-2.5 flex items-center gap-1.5 text-micro font-medium"
              style={{ color: `rgba(${accent},0.92)` }}
            >
              <span aria-hidden>✦</span>
              {card.whisper}
              {card.whisperTheme ? ` — because you keep coming back to ${card.whisperTheme}` : null}
            </span>
          ) : null}

          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-white/40">
            <span>
              {card.count} {card.count === 1 ? "way" : "ways"}
            </span>
            {card.fundedCount > 0 ? (
              <span style={{ color: `rgba(${accent},0.85)` }}>
                {card.fundedCount} free or funded
              </span>
            ) : card.bestCost ? (
              // Without this "Work your way" showed a bare count and read as the
              // weakest card, when a working-holiday visa is the most reachable
              // route on the page for someone with no family money.
              <span style={{ color: `rgba(${accent},0.85)` }}>
                from {BEST_COST_LABEL[card.bestCost]}
              </span>
            ) : null}
          </span>
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/85" />
      </div>
    </Link>
  );
}

export function WorldWaysLanding() {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT.world;
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

  const [cards, setCards] = React.useState<WayCard[] | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/guidance/world-ways", { credentials: "include", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.cards)) setCards(d.cards);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!isReady) return null;
  const name = profile?.firstName;

  return (
    <div className="space-y-5">
      <BackToExplore />

      <SectionCard tone="hero" voice backdrop={<ReadAtmosphere seed="lane:world" accent={accent} />}>
        <div>
          <AgenticHeader
            glyph={
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control"
                style={{ backgroundColor: `rgba(${accentRgb},0.10)`, color: `rgba(${accentRgb},0.80)` }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow="Explore · World"
            accentRgb={accentRgb}
          />
          <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
            {name ? `${name}, going somewhere is a real option.` : "Going somewhere is a real option."}
          </h1>
          <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
            Almost nobody will tell you this at school, so here it is: after you finish, you can go
            and live somewhere else for a while, and plenty of the ways in are free or pay you to do
            it. Some of them are open to you before you even finish. These are the actual routes, what
            each one costs, and who it&rsquo;s open to — and the ones that need no plane and no money
            are just as real as the rest.
          </p>
        </div>
      </SectionCard>

      <AwardsMeter stats={badges} />

      {cards === null ? null : (
        <div className="space-y-3">
          {cards.map((c, i) => (
            <WayCardTile key={c.kind} card={c} accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]} />
          ))}
        </div>
      )}

      {/* Places stay reachable, just no longer the only door. Someone who wants to
          wander 153 countries can; nobody has to in order to find a way in. */}
      <Link
        href="/main/explore/world/places"
        className="flex w-full items-center justify-between rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-label text-white/70 transition hover:border-white/20 hover:text-white"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Browse places instead
        </span>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </Link>
    </div>
  );
}

export default WorldWaysLanding;
