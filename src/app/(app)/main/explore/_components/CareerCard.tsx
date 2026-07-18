// apps/web/src/app/(app)/main/explore/_components/CareerCard.tsx
//
// A single career recommendation card — the big creative upgrade: an accent-
// tinted "gallery" surface (corner halo + accent border + gradient) with a glyph
// chip, the ~30-word mobile-first blurb, the feedback row (CareerReaction) inside,
// and a CTA into the full career screen. Each card in the deck gets its own accent
// from a curated palette so the four read as distinct without fighting the lane.

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, TrendingUp } from "lucide-react";

import type { ExplorePath } from "../_data/exploreSchema";
import { CareerReaction } from "./CareerReaction";

// Curated, harmonious accents cycled per card — distinct but all at home in the
// dark reading world (sky / violet / emerald / amber).
export const CAREER_ACCENTS = [
  "96, 176, 255", // sky
  "167, 139, 250", // violet
  "52, 211, 153", // emerald
  "245, 176, 90", // amber
];

function accentCardStyle(accent: string): React.CSSProperties {
  return {
    borderColor: `rgba(${accent}, 0.24)`,
    background: `radial-gradient(240px 160px at 92% 0%, rgba(${accent},0.16), transparent 70%), linear-gradient(180deg, rgb(14,18,31) 0%, rgb(8,12,26) 45%, rgb(4,8,20) 100%)`,
    boxShadow: `inset 0 0 0 1px rgba(${accent},0.07), 0 18px 46px rgba(0,0,0,0.42)`,
  };
}

export function CareerCard({
  path,
  accent,
  onDismiss,
}: {
  path: ExplorePath;
  accent: string;
  onDismiss: (slug: string) => void;
}) {
  const href = `/main/explore/work/${path.slug}`;

  return (
    <div
      className="relative overflow-hidden rounded-card border px-5 py-5 sm:px-6 sm:py-6"
      style={accentCardStyle(accent)}
    >
      {/* The title + blurb are the primary link into the full career screen —
          tapping anywhere in this block opens it. */}
      <Link href={href} className="group block">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control transition group-hover:brightness-125"
            style={{ backgroundColor: `rgba(${accent}, 0.16)`, color: `rgba(${accent}, 0.98)` }}
          >
            <BriefcaseBusiness className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              className="text-body font-semibold leading-snug text-white underline-offset-4 transition group-hover:underline"
              style={{ textDecorationColor: `rgba(${accent},0.6)` }}
            >
              {path.card.title}
            </h2>
            {path.brightOutlook ? (
              <span
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro font-semibold"
                style={{
                  color: "rgb(120,220,170)",
                  backgroundColor: "rgba(55,211,160,0.12)",
                  border: "1px solid rgba(55,211,160,0.4)",
                }}
              >
                <TrendingUp className="h-3 w-3" />
                Bright Outlook
              </span>
            ) : null}
          </div>
        </div>

        {path.card.hook ? (
          <p className="mt-3 text-read leading-read text-white/80">{path.card.hook}</p>
        ) : null}
      </Link>

      {/* Feedback — inside the card, self-contained. */}
      <CareerReaction slug={path.slug} title={path.card.title} onDismiss={onDismiss} />

      {/* The big, primary CTA into the full career screen — the most important
          action on the card. */}
      <Link
        href={href}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-label font-semibold transition hover:brightness-110 active:scale-[0.99]"
        style={{
          color: "#fff",
          borderColor: `rgba(${accent}, 0.65)`,
          background: `linear-gradient(180deg, rgba(${accent},0.30), rgba(${accent},0.16))`,
          boxShadow: `0 8px 24px rgba(${accent},0.18)`,
        }}
      >
        <span>Explore {path.card.title}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default CareerCard;
