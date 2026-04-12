// src/app/(app)/main/content/nextSteps.ts

import type { NextStepsDefinition } from "@/app/(app)/main/components/nextSteps/NextStepsStack";
import type { TinyTaskDefinition } from "@/app/(app)/main/domain/tinyTasks";
import type { ActionDefinition } from "@/app/(app)/main/components/nextSteps/ActionCard";

/* =============================================================================
   Registry
   ============================================================================= */

export type NextStepsPageId = string;

function tid(pageId: string, suffix: string) {
  return `tt_${pageId.replace(/\W+/g, "_")}_${suffix}`;
}

function aid(pageId: string, suffix: string) {
  return `act_${pageId.replace(/\W+/g, "_")}_${suffix}`;
}

/* =============================================================================
   INSIGHTS: Summary
   ============================================================================= */

const INSIGHTS_SUMMARY_TINY: TinyTaskDefinition = {
  id: tid("insights.summary", "clarity_mode"),
  pageId: "insights.summary",
  title: "How do you get clear fastest?",
  prompt: "Pick the one that’s most true this week.",
  kind: "choice",
  minutes: 3,
  options: [
    { id: "doing", label: "By doing something real (even small)" },
    { id: "talking", label: "By talking it out with someone" },
    { id: "examples", label: "By seeing examples / models first" },
    { id: "quiet", label: "By quiet thinking / journaling" },
  ],
  profileHint:
    "This helps Everleap recommend the right kind of next step for you.",
};

const INSIGHTS_SUMMARY_ACTION: ActionDefinition = {
  id: aid("insights.summary", "small_test"),
  pageId: "insights.summary",
  title: "Run one small test this week",
  goal: "Create something small and get one piece of real feedback.",
  steps: [
    "Pick something you can finish in one sitting.",
    "Show it to one person and ask what stands out.",
    "Notice what felt energizing, awkward, or surprisingly easy.",
  ],
  instanceStrategy: "reuse_latest",
};

/* =============================================================================
   MAIN HOME
   ============================================================================= */

const HOME_MOTIVATIONS_TINY: TinyTaskDefinition = {
  id: tid("main.home.need_motivations", "starting_pull"),
  pageId: "main.home.need_motivations",
  title: "What kind of momentum do you need right now?",
  prompt: "Pick the one that feels most true today.",
  kind: "choice",
  minutes: 2,
  options: [
    { id: "clarity", label: "I need clarity" },
    { id: "direction", label: "I need direction" },
    { id: "energy", label: "I need energy" },
    { id: "confidence", label: "I need confidence" },
  ],
  profileHint:
    "This gives Everleap a little more signal about what should come first.",
};

const HOME_MOTIVATIONS_ACTION: ActionDefinition = {
  id: aid("main.home.need_motivations", "real_signal_read"),
  pageId: "main.home.need_motivations",
  title: "Get a real read on what pulls you in",
  goal: "", // ✅ FIXED (removed instruction line)
  steps: [
    "Pay attention to one moment today where you feel engaged or interested.",
    "Notice one moment that drains your energy.",
    "Write both down in a few words.",
  ],
  instanceStrategy: "reuse_latest",
};

const HOME_STRENGTHS_TINY: TinyTaskDefinition = {
  id: tid("main.home.need_strengths", "where_you_show_up"),
  pageId: "main.home.need_strengths",
  title: "Where do you feel most like yourself?",
  prompt: "Pick the environment that feels closest this week.",
  kind: "choice",
  minutes: 2,
  options: [
    { id: "with_people", label: "When I’m with other people" },
    { id: "solving", label: "When I’m solving something" },
    { id: "building", label: "When I’m making or doing" },
    { id: "reflecting", label: "When I’ve got room to think" },
  ],
  profileHint:
    "This helps Everleap sharpen how your strengths actually show up.",
};

const HOME_STRENGTHS_ACTION: ActionDefinition = {
  id: aid("main.home.need_strengths", "see_yourself_in_action"),
  pageId: "main.home.need_strengths",
  title: "See how you actually show up",
  goal: "Notice how you operate in a real moment, not in theory.",
  steps: [
    "Pick one thing you’re doing today — work, practice, a conversation, anything real.",
    "Notice what you naturally do well without trying too hard.",
    "Write down one thing you did that helped the situation move forward.",
  ],
  instanceStrategy: "reuse_latest",
};

const HOME_SKILLS_TINY: TinyTaskDefinition = {
  id: tid("main.home.need_skills", "train_next"),
  pageId: "main.home.need_skills",
  title: "What do you want more of right now?",
  prompt: "Choose the one that would make the biggest difference.",
  kind: "choice",
  minutes: 2,
  options: [
    { id: "follow_through", label: "Better follow-through" },
    { id: "confidence", label: "More confidence" },
    { id: "clarity", label: "Clearer direction" },
    { id: "skill_growth", label: "Something I can actually build" },
  ],
  profileHint:
    "This helps Everleap shape the first concrete experiments it suggests.",
};

const HOME_SKILLS_ACTION: ActionDefinition = {
  id: aid("main.home.need_skills", "build_something_small"),
  pageId: "main.home.need_skills",
  title: "Build something small",
  goal: "Turn direction into something real you can point to.",
  steps: [
    "Pick something you can finish in under 30 minutes.",
    "Make it — don’t overthink it.",
    "Keep it, share it, or show it to someone.",
  ],
  instanceStrategy: "reuse_latest",
};

const HOME_COMPLETE_TINY: TinyTaskDefinition = {
  id: tid("main.home.complete", "clear_next_move"),
  pageId: "main.home.complete",
  title: "What kind of next step feels right this week?",
  prompt: "Pick the one that fits your energy right now.",
  kind: "choice",
  minutes: 3,
  options: [
    { id: "explore", label: "Explore a new direction" },
    { id: "focus", label: "Focus what already feels strong" },
    { id: "test", label: "Run one small experiment" },
    { id: "reflect", label: "Slow down and make sense of it" },
  ],
  profileHint:
    "This helps Everleap shape the next layer of guidance from your finished map.",
};

const HOME_COMPLETE_ACTION: ActionDefinition = {
  id: aid("main.home.complete", "run_one_real_experiment"),
  pageId: "main.home.complete",
  title: "Run one real experiment",
  goal: "Test something small based on what you’ve learned about yourself.",
  steps: [
    "Pick one direction that feels interesting or promising.",
    "Do one small real-world step toward it — reach out, try, build, or explore.",
    "Notice what happens and how it feels.",
  ],
  instanceStrategy: "reuse_latest",
};

export const NEXT_STEPS_BY_PAGE: Record<string, NextStepsDefinition> = {
  "insights.summary": {
    pageId: "insights.summary",
    tinyTask: INSIGHTS_SUMMARY_TINY,
    action: INSIGHTS_SUMMARY_ACTION,
    bridgeLine: "Tiny signal now → a real test you can actually run.",
  },

  "main.home.need_motivations": {
    pageId: "main.home.need_motivations",
    tinyTask: HOME_MOTIVATIONS_TINY,
    action: HOME_MOTIVATIONS_ACTION,
    bridgeLine: "Start with what pulls you in, then test it in the real world.",
  },

  "main.home.need_strengths": {
    pageId: "main.home.need_strengths",
    tinyTask: HOME_STRENGTHS_TINY,
    action: HOME_STRENGTHS_ACTION,
    bridgeLine: "Notice the pattern, then catch it in action.",
  },

  "main.home.need_skills": {
    pageId: "main.home.need_skills",
    tinyTask: HOME_SKILLS_TINY,
    action: HOME_SKILLS_ACTION,
    bridgeLine: "Turn direction into something concrete.",
  },

  "main.home.complete": {
    pageId: "main.home.complete",
    tinyTask: HOME_COMPLETE_TINY,
    action: HOME_COMPLETE_ACTION,
    bridgeLine: "You’ve got the pattern. Now test it somewhere real.",
  },
};

export function getNextStepsDefinition(pageId: NextStepsPageId) {
  return NEXT_STEPS_BY_PAGE[pageId] ?? null;
}