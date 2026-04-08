"use client";

import * as React from "react";
import { AppChrome } from "@/components/site/AppChrome";
import { BottomNav } from "@/components/navigation/BottomNav";
import QuestionFlow from "./QuestionFlow";

import type { SpotlightThemeId, GradientLevel } from "@/theme/everleapVisuals";

export default function QuestionsPage() {
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(1);

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="questions_orb"
      ambientCap={0.22}
      hideHeader
      minimalBackground
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 flex-1">
          <QuestionFlow />
        </main>
        <BottomNav />
      </div>
    </AppChrome>
  );
}