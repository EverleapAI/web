"use client";

import * as React from "react";

export function headerRow() {
  return "mb-3 flex items-center gap-2";
}

export function headerIconWrap(
  dark: boolean,
  tone?: "neutral" | "teal" | "violet" | "amber" | "sky"
) {
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
    "flex h-4 w-4 items-center justify-center rounded-[5px]",
    toneMap[t],
  ].join(" ");
}

export function headerLabel(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.28em]",
    dark ? "text-white/44" : "text-slate-600",
  ].join(" ");
}

export function titleText(dark: boolean) {
  return dark
    ? "text-[20px] font-semibold tracking-tight text-white/84"
    : "text-[20px] font-semibold tracking-tight text-slate-950";
}

export function sectionTitle(dark: boolean) {
  return dark
    ? "text-[16px] font-semibold tracking-[-0.02em] text-white/82"
    : "text-[16px] font-semibold tracking-[-0.02em] text-slate-950";
}

export function bodyText(dark: boolean) {
  return dark
    ? "text-[15px] leading-relaxed text-white/62"
    : "text-[15px] leading-relaxed text-slate-700";
}

export function mutedText(dark: boolean) {
  return dark
    ? "text-[14px] leading-relaxed text-white/46"
    : "text-[14px] leading-relaxed text-slate-600";
}

export function bulletText(dark: boolean) {
  return dark
    ? "text-[15px] leading-relaxed text-white/64"
    : "text-[15px] leading-relaxed text-slate-700";
}

export function sectionCard(
  dark: boolean,
  tone:
    | "neutral"
    | "themes"
    | "strengths"
    | "watchouts"
    | "task"
    | "action" = "neutral"
) {
  const toneMap = {
    neutral: dark
      ? "border-amber-300/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))]"
      : "border-amber-500/14 bg-white/88",

    themes: dark
      ? "border-amber-300/16 bg-[linear-gradient(180deg,rgba(245,158,11,0.035),rgba(255,255,255,0.02))]"
      : "border-amber-500/14 bg-white/88",

    strengths: dark
      ? "border-teal-300/16 bg-[linear-gradient(180deg,rgba(45,212,191,0.04),rgba(255,255,255,0.02))]"
      : "border-teal-500/14 bg-white/88",

    watchouts: dark
      ? "border-orange-300/16 bg-[linear-gradient(180deg,rgba(251,146,60,0.04),rgba(255,255,255,0.02))]"
      : "border-orange-500/14 bg-white/88",

    task: dark
      ? "border-sky-300/16 bg-[linear-gradient(180deg,rgba(56,189,248,0.04),rgba(255,255,255,0.02))]"
      : "border-sky-500/14 bg-white/88",

    action: dark
      ? "border-violet-300/16 bg-[linear-gradient(180deg,rgba(167,139,250,0.045),rgba(255,255,255,0.02))]"
      : "border-violet-500/14 bg-white/88",
  } as const;

  return [
    "relative overflow-hidden rounded-[24px] border",
    "px-4 py-4 md:px-5 md:py-5",
    "backdrop-blur-xl",
    dark
      ? "shadow-[0_14px_40px_rgba(0,0,0,0.24)]"
      : "shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
    toneMap[tone],
  ].join(" ");
}

export function subDivider(dark: boolean) {
  return dark ? "border-white/8" : "border-black/8";
}