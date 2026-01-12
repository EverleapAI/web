// src/app/main/explore/page.tsx
"use client";

import * as React from "react";

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

// Temporary UI aliasing (until content keys/labels are updated)
function displayLabelForSection(s: ExploreSection): string {
  if (s.key === ("forYou" as ExploreKey)) return "Recommendations";
  return s.label;
}

function isRecommendationsLane(key: ExploreKey): boolean {
  return (
    key === ("recommendations" as ExploreKey) || key === ("forYou" as ExploreKey)
  );
}

/* ========= Explore tab “pill pop” config (Insights-style) ========= */

type TabMeta = {
  dot: string; // tailwind bg-*
  subtitle: string;
};

function metaForSectionKey(key: ExploreKey): TabMeta {
  // Keep these tiny + teen-readable.
  // Colors are intentionally “poppy but minimal” like Insights pills.
  switch (key as string) {
    case "recommendations":
    case "forYou":
      return { dot: "bg-sky-400", subtitle: "Best next steps" };
    case "education":
      return { dot: "bg-amber-400", subtitle: "School + learning paths" };
    case "travel":
      return { dot: "bg-emerald-400", subtitle: "Places + adventures" };
    case "community":
      return { dot: "bg-violet-400", subtitle: "People + belonging" };
    case "hobbies":
      return { dot: "bg-rose-400", subtitle: "Fun to explore" };
    default:
      return { dot: "bg-slate-300", subtitle: "Browse ideas" };
  }
}

export default function ExplorePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);

  // ✅ Treat EXPLORE_SECTIONS as ExploreSection[]
  const sections: ExploreSection[] = EXPLORE_SECTIONS as ExploreSection[];

  // ✅ Ensure initializer returns ExploreKey (not inferred string)
  const [activeKey, setActiveKey] = React.useState<ExploreKey>(() => {
    const first = sections[0]?.key;
    return (first ?? "education") as ExploreKey;
  });

  const activeIndex = React.useMemo(() => {
    const idx = sections.findIndex((s) => s.key === activeKey);
    return idx === -1 ? 0 : idx;
  }, [activeKey, sections]);

  const activeSection: ExploreSection = sections[activeIndex] ?? sections[0];

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

  const pageTitle = "Explore";
  const pageSubtitle = "Different paths, interests, and directions you might want to try.";

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      onThemeChange={setThemeId}
      onGradientChange={setGradientLevel}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1
              className={`text-lg font-semibold ${
                dark ? "text-white" : "text-slate-900"
              }`}
            >
              {pageTitle}
            </h1>
            <p className={`text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
              {pageSubtitle}
            </p>
          </div>

          {/* Removed “Back to Home” — BottomNav already covers this */}
        </div>

        {/* Section tabs (Insights-style pills with dot + micro subtitle) */}
        <div
          className={`mb-4 flex flex-wrap gap-2 rounded-2xl border p-2 shadow-sm ${
            dark ? "border-white/10 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          {sections.map((s) => {
            const active = s.key === activeKey;
            const label = displayLabelForSection(s);
            const meta = metaForSectionKey(s.key);

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveKey(s.key)}
                className={`group rounded-2xl px-3 py-2 text-left transition active:scale-[0.99] ${
                  active
                    ? dark
                      ? "bg-white/15 text-white"
                      : "bg-slate-900 text-white"
                    : dark
                    ? "text-white/80 hover:bg-white/10"
                    : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active
                        ? meta.dot
                        : dark
                        ? `${meta.dot} opacity-80`
                        : `${meta.dot} opacity-70`
                    }`}
                    aria-hidden
                  />
                  <div className="text-xs font-semibold">{label}</div>
                </div>

                <div
                  className={`mt-0.5 text-[0.7rem] leading-4 ${
                    active
                      ? "text-white/70"
                      : dark
                      ? "text-white/55"
                      : "text-slate-600"
                  }`}
                >
                  {meta.subtitle}
                </div>
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
          <div className="mb-3">
            <div className="min-w-0">
              <h2
                className={`truncate text-base font-semibold ${
                  dark ? "text-white" : "text-slate-900"
                }`}
              >
                {renderRecommendationsLane ? "Recommendations" : activeSection.title}
              </h2>

              <p className={`text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                {renderRecommendationsLane
                  ? "Pick one direction and try it for a moment — you can always adjust."
                  : activeSection.subtitle}
              </p>
            </div>

            {/* Removed left/right arrow buttons — redundant with the top tabs */}
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
                  dark
                    ? "border-white/10 bg-white/5 text-white/80"
                    : "border-black/10 bg-white text-slate-700"
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
