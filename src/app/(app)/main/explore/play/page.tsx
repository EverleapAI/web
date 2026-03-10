"use client";

import * as React from "react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "creative-maker",
    title: "Creative Maker",
    hook: "You like turning ideas, moods, and images into something you can actually see or share.",
    description:
      "Some people need room to make things. Art, design, music, writing, visuals, and creative experiments become how they think.",
    testLabel: "Tiny Test",
    testMinutes: "20 minutes",
    testSteps: [
      "Make something small with no pressure for it to be good.",
      "Use whatever medium feels easiest right now.",
      "Notice whether creating gives you energy or drains it.",
    ],
  },
  {
    id: "competitive-player",
    title: "Competitive Player",
    hook: "You may come alive when there is challenge, strategy, performance, and a score to beat.",
    description:
      "Some people are not just playful — they are sharpened by competition. Games, sport, performance, and measurable challenge bring out their energy.",
    testLabel: "Tiny Test",
    testMinutes: "15–20 minutes",
    testSteps: [
      "Pick a game, sport, or challenge you already know.",
      "Try to improve one small part of your performance.",
      "Notice whether pressure and competition make you sharper or tense.",
    ],
  },
  {
    id: "tinkerer",
    title: "Tinkerer",
    hook: "You like experimenting, fixing, adjusting, and figuring out how things work.",
    description:
      "Tinkerers learn by touching, testing, and altering. They like systems they can manipulate and problems they can poke at.",
    testLabel: "Tiny Test",
    testMinutes: "15 minutes",
    testSteps: [
      "Take apart an idea, object, or small process in your head or in real life.",
      "Change one piece of it.",
      "Notice whether experimentation feels playful to you.",
    ],
  },
  {
    id: "deep-nerd",
    title: "Deep Nerd",
    hook: "You can get joyfully obsessed with a topic and disappear into it for hours.",
    description:
      "Some people have interests that go deep fast. They love rabbit holes, details, lore, systems, and niche fascination.",
    testLabel: "Tiny Test",
    testMinutes: "20 minutes",
    testSteps: [
      "Pick one topic you could happily talk about for a long time.",
      "Go deeper into it than you normally would.",
      "Notice whether obsession feels alive, calming, or both.",
    ],
  },
];

export default function ExplorePlayPage() {
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

          <h1 className="text-3xl font-semibold">Play</h1>

          <p className={dark ? "text-white/70" : "text-slate-700"}>
            Pure curiosity, side interests, and things worth trying just because they pull you.
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