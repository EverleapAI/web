// apps/web/src/app/(app)/main/explore/_components/ExplorePathDetail.tsx
//
// The SMALL career page. Deliberately spare — it answers "is this me?" in a
// breath, then hands off. Four things only: a SHORT agentic lead, the
// achievements strip, a readable "why it's good for you" (fit signals, no wall of
// bullets), and ONE door down — the specialties (each its own future
// constellation of the real deep dives). No paragraph dumps, no O*NET wall (that
// lives a level down), no duplicate CTAs. The real-world action lives inside the
// path you choose, not here.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Compass, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import { laneAccent, type ExplorePath, type Rgb } from "../_data/exploreSchema";
import { LANE_NOUN, rgba } from "./exploreUi";
import { getSectionMenu } from "./detailSections";
import { ExploreAttribution } from "./ExploreAttribution";
import type { OnetDetail } from "./OnetFacts";
import { CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";

// First sentence only — the sharpest line, not the whole read. Keeps the agentic
// card a breath, not a wall.
function leadLine(text: string): string {
  const first = text.trim().split(/(?<=[.!?])\s+/)[0] ?? text.trim();
  return first.length > 180 ? first.slice(0, 177).trimEnd() + "…" : first;
}

// The one door down: the path's specialties, each a future constellation of the
// real deep dives. Falls back to the deepest single section for paths with no
// specialties (so the door always leads somewhere real).
function PathsDown({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const accentStr = `${accent.r}, ${accent.g}, ${accent.b}`;
  const previews = path.branches?.previews ?? [];
  const label = path.branches?.label
    ? path.branches.label[0].toUpperCase() + path.branches.label.slice(1)
    : "Paths";
  const specialtiesHref = `/main/explore/${path.lane}/${path.slug}/specialties`;

  const card = (href: string, title: string, sub: string, key: string) => (
    <Link
      key={key}
      href={href}
      className="group flex items-center gap-3 rounded-2xl border px-4 py-4 transition hover:brightness-110"
      style={{ borderColor: `rgba(${accentStr},0.24)`, background: `rgba(${accentStr},0.06)` }}
    >
      <span className="min-w-0 flex-1">
        <RowTitle className="block text-body">{title}</RowTitle>
        {sub ? <RowMeta className="mt-1 block text-label leading-snug text-white/60">{sub}</RowMeta> : null}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/80" />
    </Link>
  );

  let doors: React.ReactNode;
  if (previews.length) {
    doors = previews.slice(0, 5).map((b) => card(specialtiesHref, b.title, b.oneLiner ?? "", b.id));
  } else {
    const menu = getSectionMenu(path);
    if (!menu.length) return null;
    doors = card(
      `/main/explore/${path.lane}/${path.slug}/${menu[0].key}`,
      `Go deeper into ${path.overview?.title ?? path.card.title}`,
      "The real day, where it leads, and ways to actually try it.",
      "deeper"
    );
  }

  return (
    <SectionCard tone="neutral">
      <div className="mb-1.5 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-control"
          style={{ background: rgba(accent, 0.14), color: rgba(accent, 0.98) }}
        >
          <Compass className="h-[18px] w-[18px]" />
        </span>
        <CardTitle as="h2">{previews.length ? `Explore the ${label.toLowerCase()}` : "Go deeper"}</CardTitle>
      </div>
      <p className="mb-3.5 text-label leading-read text-white/64">
        {previews.length
          ? "Pick a direction to go deep — a real day, where it leads, and real ways to try it."
          : "Go deeper — the real day, where it leads, and real ways to try it."}
      </p>
      <div className="space-y-2.5">{doors}</div>
    </SectionCard>
  );
}

export function ExplorePathDetail({
  path,
  whyYou = null,
  onet = null,
}: {
  path: ExplorePath;
  whyYou?: string | null;
  onet?: OnetDetail | null;
}) {
  void onet; // O*NET facts render one level down (the "Where it leads" section).
  const accent = laneAccent(path);
  const accentStr = `${accent.r}, ${accent.g}, ${accent.b}`;
  const ov = path.overview;
  const payMedian = path.trajectory?.salaryBand?.median;
  const laneLabel = path.lane[0].toUpperCase() + path.lane.slice(1);
  const title = ov?.title ?? path.card.title;
  const lead = leadLine(whyYou || ov?.hook || "");
  const fitSignals = (ov?.fitSignals ?? []).slice(0, 3);
  const badges = useBadgeStats();

  return (
    <div className="space-y-4 pb-24">
      <Link
        href={`/main/explore/${path.lane}`}
        className="inline-flex items-center gap-1.5 text-meta font-medium text-white/55 transition hover:text-white/85"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {laneLabel}</span>
      </Link>

      {/* Agentic entry — one sharp line, not a paragraph. */}
      <SectionCard tone="hero" voice backdrop={<ConstellationAnchor seed={path.id} accent={accent} />}>
        <div className="relative max-w-2xl">
          <AgenticHeader
            glyph={
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control"
                style={{ background: `rgba(${accentStr},0.12)`, color: `rgba(${accentStr},0.9)` }}
              >
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            }
            eyebrow={`${laneLabel} · ${ov?.eyebrow ?? LANE_NOUN[path.lane]}`}
            accentRgb={accentStr}
          />
          <h1 className="mt-1 text-title font-semibold leading-display tracking-title text-ink-strong sm:text-display">
            {title}
          </h1>
          {lead ? <p className="mt-3 text-read leading-read text-white/82">{lead}</p> : null}

          {ov?.traitChips?.length || payMedian ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(ov?.traitChips ?? []).slice(0, 3).map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-label text-white/80"
                >
                  {c.label}
                </span>
              ))}
              {payMedian ? (
                <span
                  className="rounded-full px-3 py-1 text-label font-medium"
                  style={{ backgroundColor: `rgba(${accentStr},0.14)`, color: `rgba(${accentStr},0.95)` }}
                >
                  Typically {payMedian}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </SectionCard>

      {/* Achievements — the trophies strip into Awards. */}
      <AwardsMeter stats={badges} />

      {/* Why it's good for you — the fit, readable, no wall of bullets. */}
      {fitSignals.length ? (
        <SectionCard tone="neutral">
          <CardTitle as="h2">Why it&rsquo;s good for you</CardTitle>
          <div className="mt-4 space-y-4">
            {fitSignals.map((s) => (
              <div key={s.id}>
                <div className="text-read leading-snug text-white/88">{s.label}</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(8, Math.min(100, s.score))}%`,
                      background: `linear-gradient(90deg, rgba(${accentStr},0.95), rgba(${accentStr},0.5))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {/* The one door down — the specialties (each a future constellation). */}
      <PathsDown path={path} accent={accent} />

      {/* Source citations + required O*NET/DOL attribution */}
      <ExploreAttribution path={path} />
    </div>
  );
}

export default ExplorePathDetail;
