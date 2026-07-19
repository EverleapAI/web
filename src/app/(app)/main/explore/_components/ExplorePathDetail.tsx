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
import { ArrowLeft, ChevronRight, Compass, Fingerprint, Sparkles } from "lucide-react";

import { SectionCard } from "../../components/ui/SectionCard";
import { ConstellationAnchor } from "../../components/ui/ConstellationAnchor";
import { AgenticHeader } from "../../components/ui/AgenticHeader";
import { AwardsMeter } from "@/app/(app)/main/components/achievements/AwardsMeter";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";
import { laneAccent, type ExplorePath, type Rgb } from "../_data/exploreSchema";
import { LANE_NOUN, MiniConstellation, SPECIALTY_ACCENTS, accentCard, rgba } from "./exploreUi";
import { getSectionMenu } from "./detailSections";
import { ExploreAttribution } from "./ExploreAttribution";
import type { OnetDetail } from "./OnetFacts";
import { CardTitle, RowMeta, RowTitle } from "@/lib/ui/card";

// A small night-sky palette so each specialty reads as its own world, not a row
// in a list.
// The universal spine every specialty's constellation opens into — previewed on
// the card as the anticipatory "what's inside".
const INSIDE_STARS = ["A real day", "Where it leads", "Try it near you"];

// The first two sentences — enough to feel warm and personal, still far short of
// the full paragraph wall.
function leadLine(text: string): string {
  const parts = text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  let out = parts.slice(0, 2).join(" ").trim() || text.trim();
  if (out.length > 260) out = out.slice(0, 257).trimEnd() + "…";
  return out;
}

// The one door down: the path's specialties, each a future constellation of the
// real deep dives. Falls back to the deepest single section for paths with no
// specialties (so the door always leads somewhere real).
function PathsDown({ path, accent }: { path: ExplorePath; accent: Rgb }) {
  const laneAccentStr = `${accent.r}, ${accent.g}, ${accent.b}`;
  const previews = path.branches?.previews ?? [];
  const label = path.branches?.label
    ? path.branches.label[0].toUpperCase() + path.branches.label.slice(1)
    : "Paths";
  const specialtiesHref = `/main/explore/${path.lane}/${path.slug}/specialties`;

  // A specialty "world" — its own accent, a mini-constellation, and a preview of
  // the stars you'll get to light up inside.
  const worldCard = (href: string, title: string, sub: string, key: string, a: string) => (
    <Link
      key={key}
      href={href}
      className="group relative block overflow-hidden rounded-2xl border px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
      style={accentCard(a)}
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `rgba(${a},0.14)` }}>
          <span className="h-6 w-6"><MiniConstellation a={a} /></span>
        </span>
        <span className="min-w-0 flex-1">
          <RowTitle className="block text-body">{title}</RowTitle>
          {sub ? <RowMeta className="mt-1 block text-label leading-snug text-white/62">{sub}</RowMeta> : null}
          <span className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/35">Inside</span>
            {INSIDE_STARS.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 text-micro font-medium" style={{ color: `rgba(${a},0.92)` }}>
                <span aria-hidden>✦</span>
                {s}
              </span>
            ))}
          </span>
        </span>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/85" />
      </div>
    </Link>
  );

  if (!previews.length) {
    const menu = getSectionMenu(path);
    if (!menu.length) return null;
    return (
      <SectionCard tone="neutral" backdrop={<ConstellationAnchor seed={`${path.id}:paths`} accent={accent} />}>
        <SpecialtiesHeader accent={accent} label="Go deeper" subtitle="The real day, where it leads, and real ways to try it — each its own place to explore." />
        {worldCard(
          `/main/explore/${path.lane}/${path.slug}/${menu[0].key}`,
          `Go deeper into ${path.overview?.title ?? path.card.title}`,
          "",
          "deeper",
          laneAccentStr
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard tone="neutral" backdrop={<ConstellationAnchor seed={`${path.id}:paths`} accent={accent} />}>
      <SpecialtiesHeader
        accent={accent}
        label={`Explore the ${label.toLowerCase()}`}
        subtitle={`${previews.length} directions inside — tap one and it opens into its own constellation to explore.`}
      />
      <div className="space-y-3">
        {previews.slice(0, 6).map((b, i) =>
          worldCard(
            `${specialtiesHref}/${b.slug}`,
            b.title,
            b.oneLiner ?? "",
            b.id,
            SPECIALTY_ACCENTS[i % SPECIALTY_ACCENTS.length]
          )
        )}
      </div>
    </SectionCard>
  );
}

function SpecialtiesHeader({ accent, label, subtitle }: { accent: Rgb; label: string; subtitle: string }) {
  return (
    <>
      <div className="mb-1.5 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-control"
          style={{ background: rgba(accent, 0.14), color: rgba(accent, 0.98) }}
        >
          <Compass className="h-[18px] w-[18px]" />
        </span>
        <CardTitle as="h2">{label}</CardTitle>
      </div>
      <p className="mb-3.5 text-label leading-read text-white/64">{subtitle}</p>
    </>
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

      {/* Agentic entry — clean and very readable: no constellation noise behind
          the text (that motif lives on the specialties, below). */}
      <SectionCard tone="hero" voice>
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

      {/* Why it's good for you — a titled section with a creative anchor, and each
          fit signal a living card with a glowing "match strength" meter. */}
      {fitSignals.length ? (
        <SectionCard tone="neutral">
          <div className="mb-4 flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-control"
              style={{ background: `rgba(${accentStr},0.14)`, color: `rgba(${accentStr},0.98)` }}
            >
              <Fingerprint className="h-[18px] w-[18px]" />
            </span>
            <CardTitle as="h2">Why it&rsquo;s good for you</CardTitle>
          </div>
          <div className="space-y-3">
            {fitSignals.map((s) => {
              const filled = Math.max(1, Math.min(5, Math.round(s.score / 20)));
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border px-4 py-3.5"
                  style={{ borderColor: `rgba(${accentStr},0.18)`, background: `rgba(${accentStr},0.05)` }}
                >
                  <RowTitle className="block text-white/90">{s.label}</RowTitle>
                  <div
                    className="mt-2.5 flex items-center gap-1"
                    aria-label={`How strongly this fits you: ${filled} of 5`}
                  >
                    {[0, 1, 2, 3, 4].map((i) => {
                      const on = i < filled;
                      return (
                        <svg
                          key={i}
                          viewBox="0 0 24 24"
                          className="h-[15px] w-[15px]"
                          fill="currentColor"
                          aria-hidden
                          style={{
                            color: on ? `rgb(${accentStr})` : "rgba(255,255,255,0.13)",
                            filter: on ? `drop-shadow(0 0 3px rgba(${accentStr},0.65))` : "none",
                          }}
                        >
                          <path d="M12 2l2.4 6.9L21.5 9l-5.5 4.7L17.8 21 12 16.9 6.2 21l1.8-7.3L2.5 9l7.1-.1z" />
                        </svg>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
