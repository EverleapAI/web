"use client";

// One way of going, in full — the second level of World.
//
// Level one is "what could I do"; this is "here are the actual programmes, what
// each costs, who it's open to and when it closes". The place comes after,
// because where you'd go is a consequence of which route you take, not the
// question you start from.

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";

import { SectionCard } from "../../../../components/ui/SectionCard";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { RowMeta, RowTitle } from "@/lib/ui/card";
import { LANE_ACCENT } from "../../../_data/exploreSchema";
import { SPECIALTY_ACCENTS, accentCard } from "../../../_components/exploreUi";

type Way = {
  id: string;
  name: string;
  href: string;
  blurb: string;
  cost: "funded" | "free" | "low" | "paid";
  scholarship: string | null;
  ages: string;
  timing: string | null;
  eligibility: string | null;
  countries: string[] | null;
  hasDetail: boolean;
  forYou: string | null;
};

type Card = { kind: string; title: string; line: string; when: string };

const COST_LABEL: Record<Way["cost"], string> = {
  funded: "Fully funded",
  free: "Free",
  low: "Low cost",
  paid: "Costs money",
};

// Cost is the first thing that decides whether the rest is worth reading, so it
// is the loudest thing on the row — and the free end is the one that gets colour.
const COST_TONE: Record<Way["cost"], string> = {
  funded: "#6FE3AE",
  free: "#6FE3AE",
  low: "#F0C878",
  paid: "rgba(255,255,255,0.45)",
};

function prettyCountry(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function WayRow({ way, accent, kind }: { way: Way; accent: string; kind: string }) {
  return (
    <div className="rounded-card border px-4 py-4" style={accentCard(accent)}>
      <div className="flex items-baseline justify-between gap-3">
        <RowTitle className="block text-body">{way.name}</RowTitle>
        <span
          className="shrink-0 text-micro font-semibold uppercase tracking-eyebrow"
          style={{ color: COST_TONE[way.cost] }}
        >
          {COST_LABEL[way.cost]}
        </span>
      </div>

      {way.forYou ? (
        <span
          className="mt-1.5 flex items-center gap-1.5 text-micro font-medium"
          style={{ color: `rgba(${accent},0.92)` }}
        >
          <span aria-hidden>✦</span>
          Because you keep coming back to {way.forYou}
        </span>
      ) : null}

      <RowMeta className="mt-2 block text-label leading-snug text-white/70">{way.blurb}</RowMeta>

      {/* "Costs money" is a dead end on its own. The named route in follows it
          immediately, so it is never the last word on the row. */}
      {way.scholarship ? (
        <RowMeta className="mt-2 block text-label leading-snug" style={{ color: "#F0C878" }}>
          Scholarship: {way.scholarship}
        </RowMeta>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-white/45">
        <span>Ages {way.ages}</span>
        {way.timing ? <span>{way.timing}</span> : null}
        {way.eligibility ? <span>{way.eligibility}</span> : null}
      </div>

      {way.countries && way.countries.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/35">
            Where
          </span>
          {way.countries.slice(0, 6).map((c) => (
            <Link
              key={c}
              href={`/main/explore/world/${c}`}
              className="text-micro font-medium underline-offset-2 hover:underline"
              style={{ color: `rgba(${accent},0.92)` }}
            >
              {prettyCountry(c)}
            </Link>
          ))}
          {way.countries.length > 6 ? (
            <span className="text-micro text-white/40">+{way.countries.length - 6} more</span>
          ) : null}
        </div>
      ) : null}

      {/* Where we can explain the thing ourselves, go inward. Handing someone a
          government website written for adults is not depth, it's a hand-off. */}
      {way.hasDetail ? (
        <Link
          href={`/main/explore/world/ways/${kind}/${way.id}`}
          className="mt-3 inline-flex items-center gap-1.5 text-label font-medium transition hover:brightness-125"
          style={{ color: `rgba(${accent},0.95)` }}
        >
          How this works
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <a
          href={way.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-label font-medium text-white/80 transition hover:text-white"
        >
          Go to {way.name}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

export default function WorldWayPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = use(params);
  const accent = LANE_ACCENT.world;
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

  const [card, setCard] = React.useState<Card | null>(null);
  const [ways, setWays] = React.useState<Way[] | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/guidance/world-ways?kind=${encodeURIComponent(kind)}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.ok) return;
        setCard(d.card ?? null);
        setWays(Array.isArray(d.ways) ? d.ways : []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [kind]);

  return (
    <div className="space-y-5">
      <Link
        href="/main/explore/world"
        className="inline-flex items-center gap-1.5 text-label font-medium transition hover:brightness-125"
        style={{ color: `rgba(${accentRgb},0.92)` }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to World
      </Link>

      {card ? (
        <SectionCard tone="hero" voice>
          <div>
            <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/40">
              {card.when}
            </span>
            <h1 className={`mt-1 ${HEADING_CLASS}`} style={HEADING_STYLE}>
              {card.title}
            </h1>
            <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
              {card.line}
            </p>
          </div>
        </SectionCard>
      ) : null}

      {ways === null ? null : ways.length === 0 ? (
        <RowMeta className="block px-1">Nothing here yet.</RowMeta>
      ) : (
        <div className="space-y-3">
          {ways.map((w, i) => (
            <WayRow
              key={w.id}
              way={w}
              kind={kind}
              accent={SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]}
            />
          ))}
        </div>
      )}

      <Link
        href="/main/explore/world/places"
        className="flex w-full items-center justify-between rounded-control border border-white/10 bg-white/[0.03] px-4 py-3 text-label text-white/70 transition hover:border-white/20 hover:text-white"
      >
        <span>Browse places instead</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
