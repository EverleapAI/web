// src/app/main/content/nextSteps.ts

import type { NextStepsDefinition } from "@/app/main/components/nextSteps/NextStepsStack";
import type { TinyTaskDefinition } from "@/app/main/domain/tinyTasks";
import type { ActionDefinition } from "@/app/main/components/nextSteps/ActionCard";

/* =============================================================================
   Registry
   - Each major page can register ONE Tiny Task + ONE Action
   - Later: swap these placeholders with AI-generated definitions
   ============================================================================= */

/**
 * We intentionally keep this a plain string.
 * When you use `Record<NextStepsPageId, ...>` and NextStepsPageId includes “any string”,
 * TypeScript will require infinite keys and throw errors.
 *
 * Later, if you want strictness, switch to a literal union like:
 *   export type NextStepsPageId = "insights.summary" | "today.home"
 */
export type NextStepsPageId = string;

/**
 * Helper to keep ids stable and readable.
 */
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
  profileHint: "This helps Everleap recommend the right kind of next step for you.",
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

export const NEXT_STEPS_BY_PAGE: Record<string, NextStepsDefinition> = {
  "insights.summary": {
    pageId: "insights.summary",
    tinyTask: INSIGHTS_SUMMARY_TINY,
    action: INSIGHTS_SUMMARY_ACTION,
    bridgeLine: "Tiny signal now → a real test you can actually log.",
  },
};

/* =============================================================================
   Accessor
   ============================================================================= */

export function getNextStepsDefinition(pageId: NextStepsPageId) {
  return NEXT_STEPS_BY_PAGE[pageId] ?? null;
}
