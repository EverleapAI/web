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
      ? "bg-white/6 text-white/56"
      : "bg-black/5 text-slate-600",
    teal: dark
      ? "bg-teal-300/12 text-teal-200/70"
      : "bg-teal-500/10 text-teal-600/70",
    violet: dark
      ? "bg-violet-300/12 text-violet-200/70"
      : "bg-violet-500/10 text-violet-600/70",
    amber: dark
      ? "bg-amber-300/12 text-amber-200/70"
      : "bg-amber-500/10 text-amber-600/70",
    sky: dark
      ? "bg-sky-300/12 text-sky-200/70"
      : "bg-sky-500/10 text-sky-600/70",
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
    dark ? "text-white/42" : "text-slate-600",
  ].join(" ");
}

export function titleText(dark: boolean) {
  return dark
    ? "text-[20px] font-semibold tracking-tight text-white/74"
    : "text-[20px] font-semibold tracking-tight text-slate-900";
}

export function sectionTitle(dark: boolean) {
  return dark
    ? "text-[16px] font-semibold tracking-[-0.02em] text-white/74"
    : "text-[16px] font-semibold tracking-[-0.02em] text-slate-900";
}

export function bodyText(dark: boolean) {
  return dark
    ? "text-[15px] leading-relaxed text-white/54"
    : "text-[15px] leading-relaxed text-slate-700";
}

export function mutedText(dark: boolean) {
  return dark
    ? "text-[14px] leading-relaxed text-white/40"
    : "text-[14px] leading-relaxed text-slate-600";
}

export function bulletText(dark: boolean) {
  return dark
    ? "text-[15px] leading-relaxed text-white/56"
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
      ? "border-white/10 bg-white/[0.035]"
      : "border-black/10 bg-white/85",

    themes: dark
      ? "border-white/10 bg-white/[0.03]"
      : "border-black/10 bg-white/85",

    strengths: dark
      ? "border-emerald-300/14 bg-emerald-300/[0.035]"
      : "border-emerald-500/14 bg-white/85",

    watchouts: dark
      ? "border-amber-300/14 bg-amber-300/[0.03]"
      : "border-amber-500/14 bg-white/85",

    task: dark
      ? "border-sky-300/14 bg-sky-300/[0.03]"
      : "border-sky-500/14 bg-white/85",

    action: dark
      ? "border-violet-300/14 bg-violet-300/[0.03]"
      : "border-violet-500/14 bg-white/85",
  } as const;

  return [
    "relative overflow-hidden rounded-[24px] border",
    "px-4 py-4 md:px-5 md:py-5",
    "backdrop-blur-xl",
    "shadow-[0_14px_40px_rgba(0,0,0,0.18)]",
    toneMap[tone],
  ].join(" ");
}

export function subDivider(dark: boolean) {
  return dark ? "border-white/8" : "border-black/8";
}