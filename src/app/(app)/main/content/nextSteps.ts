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
  title: "Run one small test (this week)",
  goal: "Create one tiny thing and get 1 piece of feedback.",
  steps: [
    "Pick something you can finish in one session (a sketch, a short write-up, a mini build, a playlist, a one-page idea).",
    "Show it to one person (friend, teacher, coach, online community) and ask: “What stands out?”",
    "Log what you did + what the feedback was.",
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
  id: aid("main.home.need_motivations", "finish_motivations"),
  pageId: "main.home.need_motivations",
  title: "Finish Motivations",
  goal: "Answer the remaining prompts so your map has a real foundation.",
  steps: [
    "Open Motivations from the home page.",
    "Answer the remaining questions honestly — short answers are fine.",
    "Come back to home and let Everleap point to the next best move.",
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
  id: aid("main.home.need_strengths", "finish_strengths"),
  pageId: "main.home.need_strengths",
  title: "Finish Strengths",
  goal: "Close the loop on how you naturally operate day to day.",
  steps: [
    "Open Strengths from the home page.",
    "Finish the unanswered prompts.",
    "Use that to make the advice feel more like you and less like a template.",
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
  id: aid("main.home.need_skills", "finish_skills"),
  pageId: "main.home.need_skills",
  title: "Finish Skills",
  goal: "Turn self-knowledge into something more concrete and trainable.",
  steps: [
    "Open Skills from the home page.",
    "Answer the remaining prompts.",
    "Come back once it’s complete so Everleap can point toward clearer next steps.",
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
  id: aid("main.home.complete", "go_deeper"),
  pageId: "main.home.complete",
  title: "Go deeper in Insights",
  goal: "Turn your completed map into patterns, experiments, and real next moves.",
  steps: [
    "Open Insights from home.",
    "Read the summary, then check Motivations, Strengths, and Skills.",
    "Pick one small experiment that feels real enough to try this week.",
  ],
  instanceStrategy: "reuse_latest",
};

export const NEXT_STEPS_BY_PAGE: Record<string, NextStepsDefinition> = {
  "insights.summary": {
    pageId: "insights.summary",
    tinyTask: INSIGHTS_SUMMARY_TINY,
    action: INSIGHTS_SUMMARY_ACTION,
    bridgeLine: "Tiny signal now → a real test you can actually log.",
  },

  "main.home.need_motivations": {
    pageId: "main.home.need_motivations",
    tinyTask: HOME_MOTIVATIONS_TINY,
    action: HOME_MOTIVATIONS_ACTION,
    bridgeLine: "Start with what pulls you forward, then build from there.",
  },

  "main.home.need_strengths": {
    pageId: "main.home.need_strengths",
    tinyTask: HOME_STRENGTHS_TINY,
    action: HOME_STRENGTHS_ACTION,
    bridgeLine: "You’ve started the map. Now sharpen how you actually operate.",
  },

  "main.home.need_skills": {
    pageId: "main.home.need_skills",
    tinyTask: HOME_SKILLS_TINY,
    action: HOME_SKILLS_ACTION,
    bridgeLine: "You’re close. Finish the part that turns this into something concrete.",
  },

  "main.home.complete": {
    pageId: "main.home.complete",
    tinyTask: HOME_COMPLETE_TINY,
    action: HOME_COMPLETE_ACTION,
  },
};

export function getNextStepsDefinition(pageId: NextStepsPageId) {
  return NEXT_STEPS_BY_PAGE[pageId] ?? null;
}