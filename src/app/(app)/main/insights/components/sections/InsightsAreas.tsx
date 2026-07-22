// apps/web/src/app/(app)/main/insights/components/sections/InsightsAreas.tsx
//
// The science-area cards on the Insights Summary tab. Each of the four areas —
// Motivations, Strengths, Skills, Fun Facts — is a card with its own light
// (accent), motif (icon), an evocative subtitle, and, when we have it, a
// whispered top item pulled from what the page already knows (no new
// generation). This is the Insights analogue of Explore's "worlds" grid: it
// replaces the horizontal tab rail as the way you navigate in from the summary.
//
// Like the Explore worlds — and unlike the "accent only in glyph+eyebrow" rule
// for reading cards — an area IS a navigation surface, so the accent carries the
// whisper, the cue, and a soft corner halo.

"use client";

import * as React from "react";
import { ChevronRight, ArrowRight, Flame, Gem, Wrench, PartyPopper } from "lucide-react";

export type InsightsAreaId = "motivations" | "strengths" | "skills" | "funFacts";

type RGB = { r: number; g: number; b: number };

function rgba({ r, g, b }: RGB, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type AreaMeta = {
  id: InsightsAreaId;
  label: string;
  sub: string;
  accent: RGB;
  Icon: React.ComponentType<{ className?: string }>;
};

// Accents mirror the tab-pill accents in the Insights page (one source of truth
// in spirit; kept local so this card is self-contained).
const AREAS: AreaMeta[] = [
  { id: "motivations", label: "Motivations", sub: "What drives you", accent: { r: 120, g: 200, b: 255 }, Icon: Flame },
  { id: "strengths", label: "Strengths", sub: "How you show up", accent: { r: 190, g: 140, b: 255 }, Icon: Gem },
  { id: "skills", label: "Skills", sub: "Tools you reach for", accent: { r: 120, g: 255, b: 190 }, Icon: Wrench },
  { id: "funFacts", label: "Fun Facts", sub: "Lighter + playful", accent: { r: 255, g: 150, b: 230 }, Icon: PartyPopper },
];

export type AreaWhispers = Partial<Record<InsightsAreaId, string | null | undefined>>;

function AreaCard({
  meta,
  whisper,
  onOpen,
}: {
  meta: AreaMeta;
  whisper?: string | null;
  onOpen: (id: InsightsAreaId) => void;
}) {
  const { id, label, sub, accent, Icon } = meta;

  const halo = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(130px 96px at 88% 0%, ${rgba(accent, 0.16)}, transparent 70%)` }}
    />
  );
  const iconChip = (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control"
      style={{ backgroundColor: rgba(accent, 0.13), color: rgba(accent, 0.92) }}
    >
      <Icon className="h-4 w-4" />
    </span>
  );

  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="group relative block w-full overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    >
      {halo}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-body font-semibold text-ink-strong">{label}</span>
        {iconChip}
      </div>
      <p className="relative mt-1.5 text-label leading-body text-white/60">{sub}</p>
      {whisper ? (
        <p
          className="relative mt-2 flex items-start gap-1.5 text-meta leading-snug"
          style={{ color: rgba(accent, 0.9) }}
        >
          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{whisper}</span>
        </p>
      ) : null}
      <div className="relative mt-2.5">
        <span
          className="inline-flex items-center gap-0.5 text-label font-semibold"
          style={{ color: rgba(accent, 0.95) }}
        >
          Look closer
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

export function InsightsAreas({
  onOpen,
  whispers,
}: {
  onOpen: (id: InsightsAreaId) => void;
  whispers?: AreaWhispers;
}) {
  // PADDING, not margin. This heading opens a new section and was sitting the
  // same distance below the awards meter as its own cards sit below it, so the
  // meter read as the first item UNDER "Where do you want to look closer?"
  // rather than as the thing before it. Space is what says a heading belongs to
  // what follows.
  // It has to be padding: the parent is a `space-y-*` stack, and Tailwind's
  // `space-y` rule outranks a child's `mt-*`, so the margin version was a no-op.
  return (
    <section aria-label="Look closer at the parts of you" className="pt-7">
      <h2 className="mb-3 px-1 text-meta font-semibold uppercase tracking-eyebrow text-white/55">
        Where do you want to look closer?
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {AREAS.map((meta) => (
          <AreaCard key={meta.id} meta={meta} whisper={whispers?.[meta.id]} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

export default InsightsAreas;
