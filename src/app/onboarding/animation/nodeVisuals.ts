// apps/web/src/app/onboarding/animation/nodeVisuals.ts

export type AnimationPreset =
  | "idle"
  | "scatter"
  | "connect"
  | "anchor"
  | "terrain"
  | "branching"
  | "branchExtend"
  | "networkGrow"
  | "instinctShift"
  | "finalMap";

export const nodeVisuals: Record<string, AnimationPreset> = {
  // Intro
  intro_1: "scatter",
  intro_name: "anchor",

  // Pattern / system explanation
  signals_intro: "connect",
  patterns_intro: "connect",

  // Situation
  current_situation: "terrain",
  situation_response: "connect",

  // Certainty
  certainty: "branching",
  certainty_idea: "branchExtend",

  // Direction
  post_plans: "branching",

  // Signals (growth)
  activities: "networkGrow",

  // Instinct (big visual shift)
  fun_instinct: "instinctShift",

  // Final
  summary_transition: "finalMap",
};