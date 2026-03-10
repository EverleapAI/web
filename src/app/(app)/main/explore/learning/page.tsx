"use client";

import * as React from "react";
import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

import ExploreLaneRail from "../components/ExploreLaneRail";
import ExplorePathPanel from "../components/ExplorePathPanel";
import type { ExplorePathPanelData } from "../components/ExplorePathPanel";

const PATHS: ExplorePathPanelData[] = [
  {
    id: "university-scholar",
    title: "University Scholar",
    hook: "You like going deep into ideas, questions, and subjects that keep unfolding.",
    description:
      "Some people love learning by going deep for a long time. They enjoy complexity, theory, research, and slowly building real expertise.",
    testLabel: "Tiny Test",
    testMinutes: "20 minutes",
    testSteps: [
      "Pick a subject you already like.",
      "Go one layer deeper than you normally would.",
      "Notice whether depth feels energizing or draining.",
    ],
  },
  {
    id: "skill-builder",
    title: "Skill Builder",
    hook: "You learn best by practicing something real and getting a little better every time.",
    description:
      "Some people do not want endless theory first. They want reps, feedback, and visible progress. Learning feels best when it becomes a skill.",
    testLabel: "Tiny Test",
    testMinutes: "15–20 minutes",
    testSteps: [
      "Pick one skill you want to improve.",
      "Do one focused practice session.",
      "Write down one thing that got slightly better.",
    ],
  },
  {
    id: "self-directed-learner",
    title: "Self-Directed Learner",
    hook: "You like following your own curiosity instead of waiting for someone else to structure it.",
    description:
      "Some people learn best when they design the path themselves. They gather resources, test methods, and build knowledge from genuine interest.",
    testLabel: "Tiny Test",
    testMinutes: "20 minutes",
    testSteps: [
      "Choose something you have always wanted to understand better.",
      "Find one article, video, or guide on it.",
      "Notice whether self-directed learning feels freeing or overwhelming.",
    ],
  },
  {
    id: "hybrid-explorer",
    title: "Hybrid Explorer",
    hook: "You may not want one learning path — you may want a mix of school, projects, and real-world experience.",
    description:
      "A lot of people learn best through a hybrid path. They combine formal learning, self-teaching, projects, mentors, and practical experience.",
    testLabel: "Tiny Test",
    testMinutes: "10–15 minutes",
    testSteps: [
      "Sketch your ideal learning year.",
      "Mix classes, projects, mentors, and real-world experience.",
      "Notice whether the blended version feels more alive than a single path.",
    ],
  },
];

export default function ExploreLearningPage() {
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

          <h1 className="text-3xl font-semibold">Learning</h1>

          <p className={dark ? "text-white/70" : "text-slate-700"}>
            Different ways people learn deeply, build skill, and grow expertise.
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