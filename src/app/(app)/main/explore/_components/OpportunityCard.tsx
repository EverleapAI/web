// apps/web/src/app/(app)/main/explore/_components/OpportunityCard.tsx
//
// A real-world door, as a card that carries its weight.
//
// These were built inline and drifted below the card ladder: the title used
// `text-label` and the note `text-meta` at 62% — one to two rungs under what the
// specialty cards use — on a flat single-accent fill with a generic icon. On a
// phone that reads as small, grey and flat, and every door looked the same
// whether it was a YouTube link or a real place three miles away.
//
// Two things this fixes beyond the styling:
//
// Colour now carries meaning. Near-you gets its own tone because getting someone
// out into the real world is the point; online and virtual sit back. Cycling
// arbitrary accents would have looked livelier and said nothing.
//
// And it uses accentCard(), the same treatment as the specialty worlds, so a
// door reads as an object you could pick up rather than a row in a list.

"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, Globe, MapPin, Video } from "lucide-react";

import { RowMeta, RowTitle } from "@/lib/ui/card";
import { accentCard } from "./exploreUi";

export type OpportunityMode = "local" | "remote" | "virtual" | "hybrid" | "travel";

// Near-you leads in green because it's the one that gets someone off the sofa.
const MODE = {
  local: { label: "Near you", Icon: MapPin, accent: "52, 211, 153" },
  travel: { label: "Worth the trip", Icon: MapPin, accent: "245, 176, 90" },
  virtual: { label: "Virtual", Icon: Video, accent: "167, 139, 250" },
  remote: { label: "Online", Icon: Globe, accent: "96, 176, 255" },
  hybrid: { label: "Hybrid", Icon: Globe, accent: "96, 176, 255" },
} as const;

export function modeOf(mode?: string): keyof typeof MODE {
  return mode && mode in MODE ? (mode as keyof typeof MODE) : "remote";
}

export function OpportunityCard({
  title,
  note,
  href,
  mode,
  provider,
  onClick,
}: {
  title: string;
  note?: string;
  href?: string;
  mode?: string;
  provider?: string;
  onClick?: () => void;
}) {
  const key = modeOf(mode);
  const m = MODE[key];
  const external = Boolean(href && /^https?:/i.test(href));

  const body = (
    <>
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-panel"
        style={{ background: `rgba(${m.accent},0.16)`, color: `rgb(${m.accent})` }}
      >
        <m.Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="text-micro font-semibold uppercase tracking-eyebrow"
          style={{ color: `rgba(${m.accent},0.95)` }}
        >
          {m.label}
        </span>
        {/* text-body, not text-label: this is the card's read, not a row inside one. */}
        <RowTitle className="mt-0.5 block text-body">{title}</RowTitle>
        {note ? (
          <RowMeta className="mt-1 block text-label leading-read text-white/70">
            {note}
            {provider ? ` · ${provider}` : ""}
          </RowMeta>
        ) : null}
      </span>
      {external ? (
        <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/40" />
      ) : (
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/40" />
      )}
    </>
  );

  const className =
    "group flex w-full items-start gap-3.5 rounded-card border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:brightness-110";

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={className}
        style={accentCard(m.accent)}
      >
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={accentCard(m.accent)}>
      {body}
    </button>
  );
}

export default OpportunityCard;
