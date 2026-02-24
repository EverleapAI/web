// src/app/(app)/main/insights/layout.tsx
"use client";

import * as React from "react";
import AppChrome from "@/components/site/AppChrome";
import { type SpotlightThemeId, type GradientLevel } from "@/theme/everleapVisuals";

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  const themeId: SpotlightThemeId = "nightDusk";
  const gradientLevel: GradientLevel = 3;

  return (
    <AppChrome themeId={themeId} gradientLevel={gradientLevel} brandSubtitle="Insights">
      {children}
    </AppChrome>
  );
}