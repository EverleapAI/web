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

import type { ExploreSection } from "./content/types";
import { EXPLORE_SECTIONS } from "./content";

import { ExploreShell } from "./components/ExploreShell";

export default function ExplorePage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);
  const dark = isDarkTheme(themeId);

  const sections: ExploreSection[] = EXPLORE_SECTIONS as ExploreSection[];

  const pageWidthClass = "max-w-5xl";

  return (
    <AppChrome
      themeId={themeId}
      gradientLevel={gradientLevel}
      onThemeChange={setThemeId}
      onGradientChange={setGradientLevel}
    >
      <div className={`mx-auto w-full ${pageWidthClass} px-4 pb-24 pt-3`}>
        <ExploreShell sections={sections} dark={dark} />
      </div>

      <BottomNav />
    </AppChrome>
  );
}