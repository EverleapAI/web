"use client";

// One kind of playing — the activities inside it, plus real places near you.
//
// This is the level that used to be the whole lane. Splitting it in two means
// four or five things to choose between instead of twenty, and the outbound
// links now sit one step further down, on the activity itself, where they
// belong. Nothing here leaves Everleap except a real venue with an address.

import * as React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";

import { SectionCard } from "../../../../components/ui/SectionCard";
import { HEADING_CLASS, HEADING_STYLE, PROSE_CLASS, PROSE_STYLE } from "@/lib/ui/prose";
import { RowMeta, RowTitle } from "@/lib/ui/card";
import { LANE_ACCENT } from "../../../_data/exploreSchema";
import { SPECIALTY_ACCENTS, accentCard } from "../../../_components/exploreUi";

type Item = { slug: string; title: string; hook: string; forYou: boolean };
type Group = { kind: string; title: string; line: string; slugs: string[] };
type Place = {
  id: string;
  title: string;
  href: string;
  note: string | null;
  fromTitle: string;
  fromHref: string;
};

export default function PlayKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = use(params);
  const accent = LANE_ACCENT.play;
  const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

  const [group, setGroup] = React.useState<Group | null>(null);
  const [items, setItems] = React.useState<Item[] | null>(null);
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/guidance/play-kinds?kind=${encodeURIComponent(kind)}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.ok) return;
        setGroup(d.group ?? null);
        setItems(Array.isArray(d.items) ? d.items : []);
      })
      .catch(() => {});
    fetch("/api/guidance/play-nearby", { credentials: "include", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.places)) setPlaces(d.places);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [kind]);

  // Only the venues belonging to activities in THIS card. A climbing gym under
  // "tell a story" would read as noise, and a place shown against the wrong
  // activity is worse than no place at all.
  const mine = React.useMemo(() => {
    if (!group) return [];
    const slugs = new Set(group.slugs);
    return places.filter((p) => slugs.has(p.fromHref.split("/").pop() ?? ""));
  }, [places, group]);

  return (
    <div className="space-y-5">
      <Link
        href="/main/explore/play"
        className="inline-flex items-center gap-1.5 text-label font-medium transition hover:brightness-125"
        style={{ color: `rgba(${accentRgb},0.92)` }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Play
      </Link>

      {group ? (
        <SectionCard tone="hero" voice>
          <div>
            <h1 className={HEADING_CLASS} style={HEADING_STYLE}>
              {group.title}
            </h1>
            <p className={`mt-3 text-read ${PROSE_CLASS}`} style={PROSE_STYLE}>
              {group.line}
            </p>
          </div>
        </SectionCard>
      ) : null}

      {mine.length > 0 ? (
        <div className="rounded-card border px-4 py-4" style={accentCard(SPECIALTY_ACCENTS[0])}>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: `rgba(${SPECIALTY_ACCENTS[0]},0.9)` }} />
            <RowTitle className="block text-body">Real places near you</RowTitle>
          </div>
          <div className="mt-3 space-y-2">
            {mine.map((p) => (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-2.5 rounded-panel border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition hover:bg-white/[0.06]"
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
        </div>
      ) : null}

      {items === null ? null : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <Link
              key={it.slug}
              href={`/main/explore/play/${it.slug}`}
              className="group block rounded-card border px-4 py-4 transition hover:-translate-y-0.5 hover:brightness-110"
              style={accentCard(SPECIALTY_ACCENTS[(i + 1) % SPECIALTY_ACCENTS.length])}
            >
              <div className="flex items-start gap-3">
                <span className="min-w-0 flex-1">
                  <RowTitle className="block text-body">{it.title}</RowTitle>
                  {it.forYou ? (
                    <span
                      className="mt-1 flex items-center gap-1.5 text-micro font-medium"
                      style={{
                        color: `rgba(${SPECIALTY_ACCENTS[(i + 1) % SPECIALTY_ACCENTS.length]},0.92)`,
                      }}
                    >
                      <span aria-hidden>✦</span>
                      Picked for you
                    </span>
                  ) : null}
                  {it.hook ? (
                    <RowMeta className="mt-1.5 block text-label leading-snug text-white/68">
                      {it.hook}
                    </RowMeta>
                  ) : null}
                </span>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/85" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
