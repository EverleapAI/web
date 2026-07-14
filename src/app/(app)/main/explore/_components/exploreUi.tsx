// apps/web/src/app/(app)/main/explore/_components/exploreUi.tsx
//
// Small shared UI primitives for the reskinned Explore engines (landing + detail).
// Restrained, on the site's tone: one muted lane color, small monochrome art.

"use client";

import * as React from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

import type { Lane, Rgb } from "../_data/exploreSchema";
import { signalLabel } from "../_lib/scorePath";

// Defensive: AI-generated catalog content can carry enum values (e.g. a metric
// `tone`) outside the mock's palette, which resolve to an undefined color. A
// single bad field must not crash a whole detail page, so fall back to
// transparent instead of throwing.
export const rgba = (c: Rgb | undefined | null, a: number) =>
  c ? `rgba(${c.r}, ${c.g}, ${c.b}, ${a})` : "transparent";

export const LANE_ICON: Record<Lane, LucideIcon> = {
  work: BriefcaseBusiness,
  learning: GraduationCap,
  world: Globe2,
  impact: HeartHandshake,
  play: Gamepad2,
};

export const LANE_WORD: Record<Lane, string> = {
  work: "career paths",
  learning: "ways to keep learning",
  world: "ways to see the world",
  impact: "ways to make real impact",
  play: "things to get into",
};

export const LANE_NOUN: Record<Lane, string> = {
  work: "Career path",
  learning: "Learning path",
  world: "World path",
  impact: "Impact path",
  play: "Play path",
};

/** Small monochrome corner constellation — matches the Insights ornament. */
export function CornerConstellation() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-3 top-3 h-10 w-10 opacity-70 sm:h-12 sm:w-12">
      <span className="absolute left-1 top-2 h-1 w-1 rounded-full bg-white/45" />
      <span className="absolute left-6 top-1 h-[3px] w-[3px] rounded-full bg-white/25" />
      <span className="absolute left-4 top-6 h-1 w-1 rounded-full bg-white/35" />
      <span className="absolute left-1.5 top-2.5 h-px w-5 rotate-[10deg] bg-gradient-to-r from-white/20 to-transparent" />
      <span className="absolute left-4 top-3 h-px w-3 rotate-[36deg] bg-gradient-to-r from-white/16 to-transparent" />
    </div>
  );
}

/** Restrained signal chip — small lane-tinted bars + score + label. */
export function SignalChip({ score, accent }: { score: number; accent: Rgb }) {
  const active = Math.max(1, Math.round(score / 20));
  return (
    <div className="inline-flex items-center gap-2">
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full"
            style={{
              height: `${7 + i * 2.5}px`,
              backgroundColor: i < active ? rgba(accent, 0.9) : "rgba(255,255,255,0.14)",
            }}
          />
        ))}
      </span>
      <span className="text-meta font-semibold tabular-nums text-white">{score}</span>
      <span className="text-micro font-semibold uppercase tracking-eyebrow text-white/45">
        {signalLabel(score)}
      </span>
    </div>
  );
}

/** Section header: colored dot + uppercase kicker + hairline rule. */
export function SectionHeader({ children, accent }: { children: React.ReactNode; accent: Rgb }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2.5">
      <span
        className="h-[7px] w-[7px] rounded-full"
        style={{ backgroundColor: rgba(accent, 0.95), boxShadow: `0 0 12px ${rgba(accent, 0.38)}` }}
      />
      <span className="text-micro font-semibold uppercase tracking-eyebrow" style={{ color: rgba(accent, 0.9) }}>
        {children}
      </span>
      <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${rgba(accent, 0.24)} 0%, transparent 100%)` }} />
    </div>
  );
}
