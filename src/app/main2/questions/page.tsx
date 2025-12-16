// src/app/main/questions/page.tsx
"use client";

import * as React from "react";
import { AppChrome } from "@/components/site/AppChrome";
import QuestionFlow from "./QuestionFlow";

import type { SpotlightThemeId, GradientLevel } from "@/theme/everleapVisuals";

export default function QuestionsPage() {
  // Keep consistent with Spotlight defaults
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="questions_orb"
      ambientCap={0.35}
    >
      <QuestionFlow />
    </AppChrome>
  );
}
