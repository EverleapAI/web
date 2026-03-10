"use client";

import * as React from "react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "cultural-explorer",
    title: "Cultural Explorer",
    hook: "You are drawn to how different people live, think, speak, and make meaning.",
    description:
      "Some people feel most alive when they step into another culture and try to understand how life works there. Travel becomes perspective, not just movement.",
    testLabel: "Tiny Test",
    testMinutes: "15 minutes",
    testSteps: [
      "Pick a country or culture you know very little about.",
      "Learn one thing about daily life there.",
      "Notice whether difference energizes your curiosity.",
    ],
  },
  {
    id: "nature-wanderer",
    title: "Nature Wanderer",
    hook: "You may feel most clear when you are out in landscapes bigger than your normal routine.",
    description:
      "For some people, the world opens up most in mountains, oceans, forests, deserts, and long quiet spaces. Nature shifts perspective.",
    testLabel: "Tiny Test",
    testMinutes: "20 minutes",
    testSteps: [
      "Go somewhere outdoors with less noise than usual.",
      "Stay there without multitasking.",
      "Notice whether space and landscape change how you think.",
    ],
  },
  {
    id: "global-worker",
    title: "Global Worker",
    hook: "Some paths connect work and the wider world — across borders, languages, and places.",
    description:
      "Some people are energized by work that connects them to different regions, cultures, and global systems. Travel becomes part of the path, not just a break from it.",
    testLabel: "Tiny Test",
    testMinutes: "15 minutes",
    testSteps: [
      "Look up one job that regularly connects people across countries.",
      "Notice what part attracts you: movement, culture, mission, or problem-solving.",
      "Ask yourself whether a more global life sounds exciting or exhausting.",
    ],
  },
  {
    id: "story-collector",
    title: "Story Collector",
    hook: "You may be someone who travels to notice, document, and tell stories.",
    description:
      "Some people are less interested in checking places off a list and more interested in paying attention. They collect moments, stories, images, and meaning.",
    testLabel: "Tiny Test",
    testMinutes: "10–15 minutes",
    testSteps: [
      "Write about a place that already matters to you.",
      "Describe what makes it feel the way it does.",
      "Notice whether observing and translating experience feels natural to you.",
    ],
  },
];

export default function ExploreWorldPage() {
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);

  const [openId, setOpenId] = React.useState<string>(PATHS[0].id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
            Explore
          </div>

          <h1 className="text-3xl font-semibold">World</h1>

          <p className={dark ? "text-white/70" : "text-slate-700"}>
            Places, cultures, and experiences that can widen how you see life.
          </p>
        </div>

        <ExploreLaneRail />

        <div className="space-y-4">
          {PATHS.map((path) => (
            <ExplorePathPanel
              key={path.id}
              path={path}
              open={openId === path.id}
              onToggle={() =>
                setOpenId((prev) => (prev === path.id ? "" : path.id))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}