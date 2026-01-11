// src/app/main/explore/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import type {
  ExploreKey,
  ExploreSection,
  ExploreChip,
  ExploreChipType,
} from "./content/types";
import { EXPLORE_SECTIONS } from "./content";
import { RENDERERS } from "./renderers";

/* ========= helpers ========= */

function clampIndex(i: number, n: number) {
  if (n <= 0) return 0;
  return Math.max(0, Math.min(n - 1, i));
}

// Temporary UI aliasing (until content keys/labels are updated)
function displayLabelForSection(s: ExploreSection): string {
  if (s.key === ("forYou" as ExploreKey)) return "Recommendations";
  return s.label;
}

function isRecommendationsLane(key: ExploreKey): boolean {
  return key === ("recommendations" as ExploreKey) || key === ("forYou" as ExploreKey);
}

export default function ExplorePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);

  // ✅ CRITICAL: force EXPLORE_SECTIONS to be treated as ExploreSection[]
  const sections: ExploreSection[] = EXPLORE_SECTIONS as ExploreSection[];

  // ✅ CRITICAL: ensure initializer returns ExploreKey (not inferred string)
  const [activeKey, setActiveKey] = React.useState<ExploreKey>(() => {
    const first = sections[0]?.key;
    return (first ?? "education") as ExploreKey;
  });

  const activeIndex = React.useMemo(() => {
    const idx = sections.findIndex((s) => s.key === activeKey);
    return idx === -1 ? 0 : idx;
  }, [activeKey, sections]);

  const activeSection: ExploreSection = sections[activeIndex] ?? sections[0];

  function go(delta: number) {
    const next = clampIndex(activeIndex + delta, sections.length);
    const nextKey = sections[next]?.key;
    if (nextKey) setActiveKey(nextKey);
  }

  // Special-case: Recommendations should render as a full lane (not a chip grid)
  const renderRecommendationsLane = isRecommendationsLane(activeSection.key);

  // Choose a chip to feed the renderer for the lane (prefer type "recommendations" if present)
  const recChip: ExploreChip | null = React.useMemo(() => {
    if (!renderRecommendationsLane) return null;
    const chips = activeSection.chips ?? [];
    if (chips.length === 0) return null;

    const preferred =
      chips.find((c) => (c.type as string) === "recommendations") ?? chips[0];

    return preferred;
  }, [activeSection.chips, renderRecommendationsLane]);

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      onThemeChange={setThemeId}
      onGradientChange={setGradientLevel}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
              Explore
            </h1>
            <p className={`text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
              Browse ideas by category — different chip styles per lane.
            </p>
          </div>

          <Link
            href="/main/home"
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-sm ${
              dark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-black/10 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            Back to Home <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Section tabs */}
        <div
          className={`mb-4 flex flex-wrap gap-2 rounded-2xl border p-2 shadow-sm ${
            dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          {sections.map((s) => {
            const active = s.key === activeKey;
            return (
              <button
                key={s.key}
                onClick={() => setActiveKey(s.key)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  active
                    ? dark
                      ? "bg-white/15 text-white"
                      : "bg-slate-900 text-white"
                    : dark
                      ? "text-white/75 hover:bg-white/10"
                      : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {displayLabelForSection(s)}
              </button>
            );
          })}
        </div>

        {/* Lane card */}
        <div
          className={`rounded-3xl border p-4 shadow-sm ${
            dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className={`truncate text-base font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                {renderRecommendationsLane ? "Recommendations" : activeSection.title}
              </h2>
              <p className={`text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                {renderRecommendationsLane
                  ? "What to try next — pick one lane, run a tiny test, then adjust."
                  : activeSection.subtitle}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => go(-1)}
                className={`inline-flex items-center justify-center rounded-full border p-2 ${
                  dark
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border-black/10 bg-white text-slate-800 hover:bg-slate-50"
                }`}
                aria-label="Previous section"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                className={`inline-flex items-center justify-center rounded-full border p-2 ${
                  dark
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border-black/10 bg-white text-slate-800 hover:bg-slate-50"
                }`}
                aria-label="Next section"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {renderRecommendationsLane ? (
            recChip ? (
              (() => {
                const Renderer = RENDERERS[recChip.type as ExploreChipType];
                return <Renderer key={recChip.id} chip={recChip} dark={dark} />;
              })()
            ) : (
              <div
                className={`rounded-2xl border p-5 ${
                  dark ? "border-white/10 bg-white/5 text-white/80" : "border-black/10 bg-white text-slate-700"
                }`}
              >
                No recommendations content found for this lane yet.
              </div>
            )
          ) : (
            // Chips grid — vertical-friendly on mobile
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeSection.chips.map((chip: ExploreChip) => {
                const Renderer = RENDERERS[chip.type as ExploreChipType];
                return <Renderer key={chip.id} chip={chip} dark={dark} />;
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </AppChrome>
  );
}
