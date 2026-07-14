"use client";

import * as React from "react";

import { TimeTwinPortrait } from "./TimeTwinPortrait";

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

function heroBackground(theme: TimeTwinVisualTheme | undefined, accentRgb: RGB) {
  // A quiet, accent-biased ground behind the frame. Kept subtle so the framed
  // portrait stays the focal point.
  const soft = rgba(accentRgb, 0.14);
  const softer = rgba(accentRgb, 0.06);
  void theme;
  return `radial-gradient(circle at 50% 12%, ${soft}, transparent 42%), radial-gradient(circle at 50% 40%, ${softer}, transparent 60%), linear-gradient(180deg, rgba(10,12,24,0.9), rgba(5,6,14,0.98))`;
}

export function TimeTwinHero({
  name,
  era,
  tagline,
  mindType,
  visualTheme,
  accentRgb,
  imageUrl,
}: TimeTwinHeroProps) {
  return (
    <section className="relative w-full">
      {/* Ambient bloom above the frame */}
      <div
        className="pointer-events-none absolute left-1/2 -top-8 h-[180px] w-[80%] -translate-x-1/2 rounded-full blur-[80px]"
        aria-hidden
        style={{ background: `radial-gradient(circle, ${rgba(accentRgb, 0.22)}, transparent 70%)` }}
      />

      <div
        className="relative overflow-hidden rounded-card border px-5 pb-6 pt-7 sm:px-7 sm:pb-8 sm:pt-9"
        style={{
          borderColor: rgba(accentRgb, 0.2),
          background: heroBackground(visualTheme, accentRgb),
          boxShadow: `0 28px 72px rgba(0,0,0,0.4), 0 0 0 1px ${rgba(accentRgb, 0.08)}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Top light seam */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          aria-hidden
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 20%, ${rgba(accentRgb, 0.6)} 50%, rgba(255,255,255,0.35) 80%, transparent)`,
          }}
        />

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
