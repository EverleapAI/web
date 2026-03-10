"use client";

import * as React from "react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "game-designer",
    title: "Game Designer",
    hook: "You shape rules, rewards, and challenges so curiosity becomes play.",
    description:
      "Game designers create systems that make people curious, challenged, and proud. It is part psychology, part logic, part creativity.",
    testLabel: "Tiny Test",
    testMinutes: "10–20 minutes",
    testSteps: [
      "Pick a simple game you already know.",
      "Change one rule, one scoring system, or one limit.",
      "Notice whether the game becomes more interesting, harder, or more chaotic.",
    ],
  },
  {
    id: "product-builder",
    title: "Product / UX Builder",
    hook: "You make tools, apps, and systems easier and better for real people.",
    description:
      "Product builders shape experiences people use every day. They notice friction, simplify it, and make systems feel better.",
    testLabel: "Tiny Test",
    testMinutes: "10 minutes",
    testSteps: [
      "Open an app you use every day.",
      "Find one thing that feels annoying or slow.",
      "Sketch one improvement that would make it clearer or easier.",
    ],
  },
  {
    id: "health-support",
    title: "Health + Human Support",
    hook: "Some people build careers helping others recover, grow, or feel less alone.",
    description:
      "Support work is about helping people through pain, stress, change, or recovery. It requires care, steadiness, and trust.",
    testLabel: "Tiny Test",
    testMinutes: "10–15 minutes",
    testSteps: [
      "Think about a time someone helped you through something hard.",
      "Write down what they actually did that helped.",
      "Notice whether what worked was advice, calmness, listening, or action.",
    ],
  },
  {
    id: "teaching",
    title: "Teaching / Mentorship",
    hook: "You help someone else understand something they didn’t before.",
    description:
      "Teaching is not just giving information. It is helping another person grow confidence, skill, and clarity.",
    testLabel: "Tiny Test",
    testMinutes: "10 minutes",
    testSteps: [
      "Explain something you know well to someone else.",
      "Notice where they get confused or ask questions.",
      "Pay attention to whether you enjoy helping them get it.",
    ],
  },
];

export default function ExploreWorkPage() {
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);

  const [openId, setOpenId] = React.useState<string>(PATHS[0].id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4">
      <div className="space-y-6">
        {/* Page heading */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
            Explore
          </div>

          <h1 className="text-3xl font-semibold">Work</h1>

          <p className={dark ? "text-white/70" : "text-slate-700"}>
            Ways people turn curiosity into real work. Try a direction and see
            what pulls you.
          </p>
        </div>

        {/* Lane navigation */}
        <ExploreLaneRail />

        {/* Path panels */}
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