// apps/web/src/app/(app)/main/explore/_components/PlayKindsLanding.tsx
//
// Play's front door: five kinds of playing.
//
// The lane put all twenty activities on one screen and every row left the app —
// too much to choose between, and nothing to do inside Everleap except go
// elsewhere. Same fault World had opening on 153 countries: the catalogue was
// the menu.
//
// A kind is something you can want before you know which hobby it becomes. The
// activity page underneath holds the real places near you and the outbound
// links, which is two internal steps in rather than the first thing anyone meets.

"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Dice5,
  Footprints,
  Hammer,
  MapPin,
  Sparkles,
  Sprout,
  Theater,
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

type KindCard = {
  kind: string;
  title: string;
  line: string;
  count: number;
  whisper: string | null;
  forYouCount: number;
  samples: string[];
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  make: Hammer,
  move: Footprints,
  story: Theater,
  game: Dice5,
  tend: Sprout,
};

function KindTile({ card, accent }: { card: KindCard; accent: string }) {
  const Icon = ICONS[card.kind] ?? Sparkles;
  return (
    <Link
      href={`/main/explore/play/kinds/${card.kind}`}
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
          <RowTitle className="block text-body">{card.title}</RowTitle>
          <RowMeta className="mt-1 block text-label leading-snug text-white/62">{card.line}</RowMeta>

          {card.whisper ? (
            <span
              className="mt-2.5 flex items-center gap-1.5 text-micro font-medium"
              style={{ color: `rgba(${accent},0.92)` }}
            >
              <span aria-hidden>✦</span>
              {card.whisper}
              {card.forYouCount > 1 ? ` and ${card.forYouCount - 1} more for you` : " — one for you"}
            </span>
          ) : (
            <span className="mt-2.5 block text-micro text-white/40">
              {card.samples.join(" · ")}
            </span>
          )}

          <span className="mt-2 block text-micro text-white/40">
            {card.count} {card.count === 1 ? "thing" : "things"} to try
          </span>
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/85" />
      </div>
    </Link>
  );
}

export function PlayKindsLanding() {
  const { profile, isReady } = useExploreProfile();
  const badges = useBadgeStats();
  const accent = LANE_ACCENT.play;
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

  const [cards, setCards] = React.useState<KindCard[] | null>(null);
  const [nearbyCount, setNearbyCount] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/guidance/play-kinds", { credentials: "include", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.cards)) setCards(d.cards);
      })
      .catch(() => {});
    // Only the count here — the places themselves live one level down, next to
    // the activity they belong to, where they mean something.
    fetch("/api/guidance/play-nearby", { credentials: "include", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.places)) setNearbyCount(d.places.length);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!isReady) return null;
  const name = profile?.firstName;

  return (
    <div className="space-y-5">
      <BackToExplore />

      <SectionCard tone="hero" voice backdrop={<ReadAtmosphere seed="lane:play" accent={accent} />}>
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
            eyebrow="Explore · Play"
            accentRgb={accentRgb}
          />
          <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
            {name ? `${name}, this one's not a plan. Go play.` : "This one's not a plan. Go play."}
          </h1>
          <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
            You can&rsquo;t research your way into whether you like climbing — you go once and find
            out, and it costs you an afternoon instead of a decade. Pick whichever of these sounds
            like you on a Saturday, and there are real places inside where you could actually turn
            up.
          </p>
        </div>
      </SectionCard>

      <AwardsMeter stats={badges} />

      {cards === null ? null : (
        <div className="space-y-3">
          {cards.map((c, i) => (
            <KindTile key={c.kind} card={c} accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]} />
          ))}
        </div>
      )}

      {/* Said as a fact rather than a link, so it reads as a reason to go in
          rather than another exit from the screen. */}
      {nearbyCount > 0 ? (
        <div className="flex items-center gap-2 px-1 text-micro text-white/45">
          <MapPin className="h-3.5 w-3.5" />
          {nearbyCount} real places near you sit inside these.
        </div>
      ) : null}
    </div>
  );
}

export default PlayKindsLanding;
