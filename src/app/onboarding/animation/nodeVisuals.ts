// apps/web/src/app/onboarding/animation/nodeVisuals.ts

export type AnimationPreset =
  | "idle"
  | "scatter"
  | "connect"
  | "anchor"
  | "nameTag"
  | "terrain"
  | "branching"
  | "branchExtend"
  | "networkGrow"
  | "instinctShift"
  | "finalMap";

export const nodeVisuals: Record<string, AnimationPreset> = {
  // Intro
  welcome: "connect",
  intro_1: "scatter",
  intro_name: "nameTag",
  name: "nameTag",

  // Pattern / system explanation
  signals_intro: "connect",
  patterns_intro: "connect",

  // Situation
  current_situation: "terrain",
  situation_response: "connect",

  // Certainty
  certainty: "branching",
  certainty_response: "connect",
  certainty_idea: "branchExtend",
  idea_response: "connect",

  // Direction
  post_plans: "branching",
  post_plans_response: "connect",

  // Signals / activities
  activities: "networkGrow",
  activities_response: "connect",

  // Instinct
  fun_instinct: "instinctShift",
  fun_instinct_response: "connect",

  // Final
  summary_transition: "finalMap",
  summary: "finalMap",
};