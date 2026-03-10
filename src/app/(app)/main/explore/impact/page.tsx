"use client";

import * as React from "react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "community-builder",
    title: "Community Builder",
    hook: "You bring people together, create belonging, and make spaces feel real.",
    description:
      "Some people naturally think about groups, belonging, and how people gather. They notice what helps a group feel alive and what makes it fall flat.",
    testLabel: "Tiny Test",
    testMinutes: "10–15 minutes",
    testSteps: [
      "Think of a group or space you wish existed.",
      "Write down what it would feel like to be part of it.",
      "Notice whether designing belonging feels exciting to you.",
    ],
  },
  {
    id: "advocate",
    title: "Advocate",
    hook: "You care when something feels unfair, broken, or ignored — and you want to push back.",
    description:
      "Advocates pay attention to people, systems, and issues that need protection or change. Their energy often comes from justice, voice, and moral clarity.",
    testLabel: "Tiny Test",
    testMinutes: "15 minutes",
    testSteps: [
      "Pick one issue you actually care about.",
      "Learn one concrete thing about what is happening and who is affected.",
      "Notice whether this makes you want to look away or step in.",
    ],
  },
  {
    id: "organizer",
    title: "Organizer",
    hook: "You turn concern into action by helping people coordinate, move, and build momentum.",
    description:
      "Organizers do not just care — they mobilize. They connect people, create plans, and help energy become action.",
    testLabel: "Tiny Test",
    testMinutes: "10–15 minutes",
    testSteps: [
      "Imagine a small event, effort, or project you could bring people into.",
      "List the first three steps it would take to make it real.",
      "Notice whether coordinating people feels stressful or energizing.",
    ],
  },
  {
    id: "local-leader",
    title: "Local Leader",
    hook: "You might care less about abstract ideas and more about improving the places you actually belong to.",
    description:
      "Some people want to make schools, teams, neighborhoods, and organizations stronger from the inside. Leadership can be practical, local, and real.",
    testLabel: "Tiny Test",
    testMinutes: "10 minutes",
    testSteps: [
      "Think about one place you belong.",
      "Write down one thing you would improve if it were partly your responsibility.",
      "Notice whether responsibility feels heavy or meaningful.",
    ],
  },
];

export default function ExploreImpactPage() {
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

          <h1 className="text-3xl font-semibold">Impact</h1>

          <p className={dark ? "text-white/70" : "text-slate-700"}>
            Ways people help, lead, organize, and build belonging around them.
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