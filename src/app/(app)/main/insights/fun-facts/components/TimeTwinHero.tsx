"use client";

import * as React from "react";

import { TimeTwinPortrait } from "./TimeTwinPortrait";
import { sectionCard } from "../../components/sections/summaryShared";

type RGB = {
  r: number;
  g: number;
  b: number;
};

type TimeTwinVisualTheme =
  | "inventor-parchment"
  | "inventor-electric"
  | "scientist-luminous"
  | "logic-victorian"
  | "code-shadow"
  | "cosmic-wonder"
  | "geometry-marble"
  | "future-dusk"
  | "painter-bloom"
  | "ink-moon";

type TimeTwinHeroProps = {
  name: string;
  era: string;
  tagline: string;
  mindType: string;
  visualTheme?: TimeTwinVisualTheme;
  accentRgb: RGB;
  /** Real library portrait; falls back to the generated cosmic badge when absent. */
  imageUrl?: string;
};

/**
 * "Planetarium meets gallery" — the twin is presented like a framed portrait
 * with a museum plate (name / era / mind-type), but the portrait itself is a
 * living cosmic badge rather than a static painting.
 */
const SERIF =
  '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';

function rgba(rgb: RGB, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function TimeTwinHero({
  name,
  era,
  tagline,
  mindType,
  accentRgb,
  imageUrl,
}: TimeTwinHeroProps) {
  return (
    <section className="relative w-full">
      {/* The plate is the same near-black card surface as every other card; the
          accent lives only in the framed portrait and the museum plate below. */}
      <div className={[sectionCard(true), "px-5 pb-6 pt-7 sm:px-7 sm:pb-8 sm:pt-9"].join(" ")}>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-5 text-micro font-semibold uppercase tracking-eyebrow text-white/48 sm:text-micro">
            Your Time Twin
          </div>

          {/* Framed portrait — the "gallery" frame with matting */}
          <div
            className="relative rounded-card p-2.5"
            style={{
              border: `1.5px solid ${rgba(accentRgb, 0.4)}`,
              background: rgba(accentRgb, 0.05),
              boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 44px ${rgba(accentRgb, 0.22)}, 0 18px 44px rgba(0,0,0,0.35)`,
            }}
          >
            <TimeTwinPortrait seed={name} accentRgb={accentRgb} size={156} rounded={18} imageUrl={imageUrl} />
            {/* inner matting hairline */}
            <div
              className="pointer-events-none absolute inset-2.5 rounded-panel"
              aria-hidden
              style={{ boxShadow: `inset 0 0 0 1px ${rgba(accentRgb, 0.28)}` }}
            />
          </div>

          {/* Museum plate */}
          <div className="mt-6 flex flex-col items-center">
            <div
              className="mb-3 h-px w-10"
              style={{ background: rgba(accentRgb, 0.5) }}
              aria-hidden
            />
            <h1
              className="text-title leading-display tracking-title text-white sm:text-display"
              style={{ fontFamily: SERIF, fontWeight: 600 }}
            >
              {name}
            </h1>
            <div
              className="mt-2.5 text-micro font-semibold uppercase tracking-eyebrow sm:text-micro"
              style={{ color: rgba(accentRgb, 0.92) }}
            >
              {era}
            </div>
            {mindType ? (
              <div
                className="mt-3 text-label text-white/72 sm:text-body"
                style={{ fontFamily: SERIF, fontStyle: "italic" }}
              >
                “{mindType}”
              </div>
            ) : null}
          </div>

          {tagline ? (
            <p className="mt-4 max-w-[440px] text-label leading-7 text-white/68 sm:text-label">
              {tagline}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
