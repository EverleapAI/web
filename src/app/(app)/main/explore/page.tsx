// src/app/main/explore/page.tsx
"use client";

import * as React from "react";

import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import type { ExploreSection } from "./content/types";
import { EXPLORE_SECTIONS } from "./content";

import { ExploreShell } from "./components/ExploreShell";

export default function ExplorePage() {
  // AppChrome + BottomNav are handled by the /main layout.
  // This page should NOT render its own header/nav, and should just provide content spacing.
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);

  const sections: ExploreSection[] = EXPLORE_SECTIONS as ExploreSection[];

  const pageWidthClass = "max-w-5xl";

  return (
    <div className={`mx-auto w-full ${pageWidthClass} px-4 pb-28 pt-2`}>
      <ExploreShell sections={sections} dark={dark} />
    </div>
  );
}