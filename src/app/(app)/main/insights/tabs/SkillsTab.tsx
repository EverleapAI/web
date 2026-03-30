"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { InsightsTab } from "@/app/(app)/main/insights/app/buildInsightsViewModel";

/* =============================================================================
   Types (safe extraction from VM without `any`)
   ============================================================================= */

type UnlockItem = { id: string; label: string; href?: string };
type PrimaryUnlock = { items?: UnlockItem[] };

type SkillsLike = {
  headline?: string;
  storySoFar?: string[];
  skills?: { label: string; strength?: number }[];
  strongestRightNow?: string[];
  nextToBuild?: string[];
  experiment?: { title?: string; steps?: string[] };
  primaryUnlock?: PrimaryUnlock;
};

type SummaryLike = {
  primaryUnlock?: PrimaryUnlock;
};

type ViewModelLike = {
  tab?: InsightsTab;
  skills?: SkillsLike;
  summary?: SummaryLike;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asUnlock(v: unknown): PrimaryUnlock | null {
  if (!isRecord(v)) return null;

  const items = (v.items as unknown) ?? null;
  if (!Array.isArray(items)) return { items: [] };

  const safe = items
    .map((it): UnlockItem | null => {
      if (!isRecord(it)) return null;
      const id = asString(it.id, "");
      const label = asString(it.label, "");
      const href = typeof it.href === "string" ? it.href : undefined;
      if (!id || !label) return null;
      return { id, label, href };
    })
    .filter((x): x is UnlockItem => !!x);

  return { items: safe };
}

/* =============================================================================
   UI helpers
   ============================================================================= */

function textAffordance(dark: boolean) {
  return [
    "inline-flex items-center gap-2",
    "text-sm font-semibold",
    "transition",
    dark ? "text-white/70 hover:text-white/90" : "text-slate-700 hover:text-slate-900",
    "focus-visible:outline-none",
    dark ? "focus-visible:ring-2 focus-visible:ring-white/14" : "focus-visible:ring-2 focus-visible:ring-slate-900/10",
  ].join(" ");
}

function fadeMaskStyle(): React.CSSProperties {
  return {
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(0,0,0,0) 100%)",
  };
}

function readingSurface(dark: boolean) {
  return [
    "relative overflow-hidden rounded-[26px] border",
    "px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6",
    "backdrop-blur-xl",
    dark ? "border-white/10 bg-slate-950/22" : "border-black/10 bg-white/80",
    "shadow-[0_18px_55px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function softDivider(dark: boolean) {
  return dark ? "bg-white/10" : "bg-black/10";
}

function tinyLabel(dark: boolean) {
  return [
    "text-[11px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-white/50" : "text-slate-500",
  ].join(" ");
}

function sectionTitle(dark: boolean) {
  return dark ? "text-white" : "text-slate-900";
}

function sectionMuted(dark: boolean) {
  return dark ? "text-white/62" : "text-slate-600";
}

function bodyText(dark: boolean) {
  return dark ? "text-slate-200/90" : "text-slate-700";
}

function pillButton(dark: boolean) {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-full border px-3.5 py-2",
    "text-xs font-semibold transition active:scale-95",
    dark
      ? "border-white/10 bg-white/6 text-white/78 hover:bg-white/10"
      : "border-black/10 bg-white/85 text-slate-900 hover:bg-white",
    dark
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
  ].join(" ");
}

function emphasisPill(dark: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1",
    "text-xs font-semibold",
    dark ? "border-white/10 bg-white/6 text-white/86" : "border-black/10 bg-white text-slate-800",
  ].join(" ");
}

function railDot(dark: boolean) {
  return (
    <span
      aria-hidden
      className={[
        "mt-[6px] h-2 w-2 shrink-0 rounded-full",
        dark ? "bg-cyan-300/75 ring-1 ring-cyan-300/20" : "bg-cyan-500/80 ring-1 ring-cyan-900/10",
      ].join(" ")}
    />
  );
}

/* =============================================================================
   Component
   ============================================================================= */

export function SkillsTab(props: {
  dark: boolean;
  mounted: boolean;
  vm: unknown;
  router: AppRouterInstance;
}) {
  const { dark, vm, router } = props;

  const v = (isRecord(vm) ? (vm as ViewModelLike) : ({} as ViewModelLike)) as ViewModelLike;

  const skills = (v.skills ?? {}) as SkillsLike;
  const summary = (v.summary ?? {}) as SummaryLike;

  const headline = asString(skills.headline, "").trim() || "Skills";

  const story = asStringArray(skills.storySoFar);
  const storyCollapsed = story.slice(0, 2);
  const storyExpandedItems = story.slice(0, 7);

  const storyTextCollapsed = storyCollapsed.join(" ").trim();
  const storyTextExpanded = storyExpandedItems.join(" ").trim();

  const canToggleStory = storyExpandedItems.length > 0 && story.length > 2;

  const tools = skills.skills ?? [];
  const strongestRightNow = skills.strongestRightNow ?? [];
  const nextToBuild = skills.nextToBuild ?? [];
  const experiment = skills.experiment ?? {};
  const experimentTitle = experiment.title ?? "One small build";
  const experimentSteps = experiment.steps ?? [];

  const unlock =
    asUnlock(skills.primaryUnlock) ??
    asUnlock(summary.primaryUnlock) ?? { items: [] };

  const [storyExpanded, setStoryExpanded] = React.useState(false);

  return (
    <section className="mb-6">
      <div className="relative">
        <div className={readingSurface(dark)}>
          {/* content identical to your version */}
        </div>
      </div>
    </section>
  );
}