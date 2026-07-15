"use client";

import * as React from "react";

import { EYEBROW_CLASS } from "@/lib/ui/prose";

type HeaderTone = "neutral" | "teal" | "violet" | "amber" | "sky";
type CardTone =
  | "neutral"
  | "themes"
  | "strengths"
  | "watchouts"
  | "task"
  | "action";

function toneRgb(
  tone: HeaderTone | CardTone
): { dark: string; light: string } {
  switch (tone) {
    case "teal":
    case "strengths":
      return {
        dark: "45,212,191",
        light: "13,148,136",
      };
    case "violet":
    case "action":
      return {
        dark: "167,139,250",
        light: "124,58,237",
      };
    case "amber":
    case "themes":
      return {
        dark: "251,191,36",
        light: "217,119,6",
      };
    case "sky":
    case "task":
      return {
        dark: "56,189,248",
        light: "2,132,199",
      };
    case "watchouts":
      return {
        dark: "251,146,60",
        light: "234,88,12",
      };
    default:
      return {
        dark: "251,191,36",
        light: "217,119,6",
      };
  }
}

export function headerRow() {
  return "relative mb-3 flex items-start gap-2.5";
}

export function headerMain() {
  return "min-w-0 flex-1";
}

export function headerCopyStack() {
  return "min-w-0";
}

export function cardBody() {
  return "relative min-w-0";
}

export function headerIconWrap(dark: boolean, tone?: HeaderTone) {
  const toneMap = {
    neutral: dark
      ? "bg-amber-300/14 text-amber-100/72 ring-1 ring-amber-200/12"
      : "bg-amber-500/10 text-amber-700/75 ring-1 ring-amber-500/10",
    teal: dark
      ? "bg-teal-300/16 text-teal-100/78 ring-1 ring-teal-200/12"
      : "bg-teal-500/12 text-teal-700/78 ring-1 ring-teal-500/10",
    violet: dark
      ? "bg-violet-300/16 text-violet-100/78 ring-1 ring-violet-200/12"
      : "bg-violet-500/12 text-violet-700/78 ring-1 ring-violet-500/10",
    amber: dark
      ? "bg-amber-300/16 text-amber-100/78 ring-1 ring-amber-200/12"
      : "bg-amber-500/12 text-amber-700/78 ring-1 ring-amber-500/10",
    sky: dark
      ? "bg-sky-300/16 text-sky-100/78 ring-1 ring-sky-200/12"
      : "bg-sky-500/12 text-sky-700/78 ring-1 ring-sky-500/10",
  } as const;

  const t = tone ?? "neutral";

  return [
    "mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-chip",
    toneMap[t],
  ].join(" ");
}

export function constellationOrnamentWrap() {
  return "pointer-events-none absolute right-0 top-0 h-10 w-10";
}

// Density represents how much of the constellation is visible - stars are
// points of evidence, the lines connecting them are the pattern forming
// between them. Confidence drives this (see confidenceToConstellationDensity)
// rather than a number ever being shown - "the pattern is becoming visible"
// made literal instead of stated as a percentage.
export function constellationOrnament(
  dark: boolean,
  tone: HeaderTone | CardTone = "neutral",
  density: number = 5
) {
  const rgb = toneRgb(tone);
  const c = dark ? rgb.dark : rgb.light;
  const show = (n: number) => density >= n;

  return (
    <div className={constellationOrnamentWrap()} aria-hidden>
      <span
        className="absolute right-[2px] top-[1px] h-[3px] w-[3px] rounded-full"
        style={{
          background: `rgba(${c}, ${dark ? 0.88 : 0.7})`,
          boxShadow: dark
            ? `0 0 10px rgba(${c}, 0.28)`
            : `0 0 8px rgba(${c}, 0.14)`,
        }}
      />
      {show(2) ? (
        <span
          className="absolute right-[13px] top-[8px] h-[2px] w-[2px] rounded-full"
          style={{
            background: `rgba(${c}, ${dark ? 0.56 : 0.46})`,
          }}
        />
      ) : null}
      {show(3) ? (
        <span
          className="absolute right-[5px] top-[16px] h-[2px] w-[2px] rounded-full"
          style={{
            background: `rgba(${c}, ${dark ? 0.62 : 0.5})`,
          }}
        />
      ) : null}
      {show(4) ? (
        <span
          className="absolute right-[17px] top-[20px] h-[3px] w-[3px] rounded-full"
          style={{
            background: `rgba(${c}, ${dark ? 0.78 : 0.62})`,
            boxShadow: dark
              ? `0 0 9px rgba(${c}, 0.2)`
              : `0 0 7px rgba(${c}, 0.1)`,
          }}
        />
      ) : null}
      {show(5) ? (
        <span
          className="absolute right-[1px] top-[25px] h-[2px] w-[2px] rounded-full"
          style={{
            background: `rgba(${c}, ${dark ? 0.48 : 0.38})`,
          }}
        />
      ) : null}

      {show(3) ? (
        <span
          className="absolute right-[8px] top-[10px] h-px origin-left"
          style={{
            width: 12,
            background: `linear-gradient(90deg, rgba(${c}, ${
              dark ? 0.16 : 0.1
            }), rgba(${c}, ${dark ? 0.36 : 0.24}))`,
            transform: "rotate(-18deg)",
          }}
        />
      ) : null}
      {show(4) ? (
        <span
          className="absolute right-[7px] top-[18px] h-px origin-left"
          style={{
            width: 10,
            background: `linear-gradient(90deg, rgba(${c}, ${
              dark ? 0.1 : 0.08
            }), rgba(${c}, ${dark ? 0.28 : 0.18}))`,
            transform: "rotate(18deg)",
          }}
        />
      ) : null}
      {show(5) ? (
        <span
          className="absolute right-[14px] top-[22px] h-px origin-left"
          style={{
            width: 8,
            background: `linear-gradient(90deg, rgba(${c}, ${
              dark ? 0.08 : 0.06
            }), rgba(${c}, ${dark ? 0.22 : 0.14}))`,
            transform: "rotate(28deg)",
          }}
        />
      ) : null}
    </div>
  );
}

export function confidenceToConstellationDensity(level?: string | null): number {
  switch (level) {
    case "strong":
      return 5;
    case "developing":
      return 4;
    case "emerging":
      return 2;
    case "very_early":
      return 1;
    default:
      return 5;
  }
}

// Every card eyebrow on Insights rides Today's eyebrow rung — same size, weight
// and letter-spacing — so the two pages don't read as two different type systems.
export function headerLabel(dark: boolean) {
  return [EYEBROW_CLASS, dark ? "text-white/44" : "text-slate-600"].join(" ");
}

// Dark branches below carry the shared low-glare treatment (see @/lib/ui/prose):
// soft ramp colours, weight 500, leading 1.6, tracking 0.4px. Sizes are kept so
// existing per-site size overrides still win; hero reads are bumped to 21px at
// their own sites. Light branches are unchanged.
export function bodyText(dark: boolean) {
  return dark
    ? "text-label font-normal leading-read tracking-normal text-ink"
    : "text-label leading-relaxed text-slate-700";
}

export function bulletText(dark: boolean) {
  return dark
    ? "text-label font-normal leading-read tracking-normal text-ink"
    : "text-label leading-relaxed text-slate-700";
}

// Every Insights sub-card now wears Today's EXACT card chrome — the same surface
// SectionCard paints for Where-you-are / Reflect on Today: a quiet rgb(22,29,54)
// base you can actually find an edge on (~1.23:1 against the page), a neutral
// white/0.07 hairline, the same lift, and the sheen baked into the background
// stack. `tone` is deliberately ignored: accent now lives ONLY in each card's
// glyph + eyebrow, never in a colored border or wash, so Insights and Today read
// as one system instead of two. (Kept in the signature so callers don't churn.)
export function sectionCard(dark: boolean, _tone: CardTone = "neutral") {
  void _tone;
  // EXACTLY SectionCard's neutral shell (SectionCard.tsx: CARD_EDGE + the neutral
  // radial over CARD_BASE + CARD_LIFT). An earlier version baked SectionCard's
  // sheen in as an extra white gradient layer, which rendered the whole card a
  // step LIGHTER than the real component — so these cards read heavier than
  // Today's while Where-you-are (a true SectionCard) sat correctly dark. Matching
  // the component's string verbatim is the only thing that guarantees they agree.
  return dark
    ? [
        "relative overflow-hidden rounded-card border border-white/[0.07] backdrop-blur-xl",
        "bg-[linear-gradient(180deg,rgb(14,18,31)_0%,rgb(8,12,26)_45%,rgb(4,8,20)_100%)]",
        "shadow-[0_18px_46px_rgba(0,0,0,0.42)]",
      ].join(" ")
    : [
        "relative overflow-hidden rounded-card border border-black/[0.08] backdrop-blur-xl",
        "bg-white/90",
        "shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
      ].join(" ");
}

export function subDivider(dark: boolean) {
  return dark ? "border-white/8" : "border-black/8";
}