// apps/web/src/app/onboarding/animation/nodeVisuals.ts

export type AnimationPreset =
  /*
    Transitional / fallback
  */
  | "idle"

  /*
    Icon-supporting symbolic marks
  */
  | "anchor"
  | "connect"
  | "nameTag"

  /*
    Signal discovery
  */
  | "scatter"
  | "networkGrow"

  /*
    Grounding / understanding
  */
  | "terrain"

  /*
    Branching / possibility
  */
  | "branching"
  | "branchExtend"

  /*
    Emotional / instinctive
  */
  | "instinctShift"

  /*
    Claude synthesis / convergence
  */
  | "finalMap";

/*
  VISUAL SYSTEM DIRECTION

  Everleap onboarding now uses icons as the primary visual language.

  Most screens should feel:
  - simple
  - symbolic
  - compact
  - readable on mobile
  - emotionally calm

  Animated line art is reserved mainly for:
  - supporting icon-like motion
  - discovery moments
  - the Claude synthesis / summary transition

  The synthesis moment is the one place where richer animated line work
  should feel intentional, because the user is waiting while Everleap
  interprets their answers.
*/

export const nodeVisuals: Record<string, AnimationPreset> = {
  /*
    PHASE 1 — Intro / explanation

    These screens are rendered primarily by semantic icon assets in page.tsx.
    Presets here are fallback/support only.
  */
  welcome: "anchor",
  how_it_works: "connect",
  what_you_get: "anchor",
  progress: "networkGrow",
  lets_get_started: "branchExtend",

  /*
    PHASE 2 — Identity / setup
  */
  permissions: "anchor",
  name: "nameTag",
  intro_name: "nameTag",

  /*
    PHASE 3 — Certainty / direction
  */
  current_situation: "terrain",
  certainty: "branching",
  certainty_response: "anchor",
  certainty_idea: "branchExtend",
  idea_response: "branchExtend",

  /*
    PHASE 4 — Plans / interests / signals
  */
  post_plans: "branching",
  post_plans_response: "terrain",
  activities: "networkGrow",
  activities_response: "connect",

  /*
    PHASE 5 — Strengths / friction / instinct
  */
  strengths: "anchor",
  challenges: "terrain",
  fun_instinct: "instinctShift",
  instinct_response: "instinctShift",

  /*
    PHASE 6 — Future / permissions / synthesis
  */
  future: "branchExtend",

  /*
    Claude-backed synthesis moment.

    This is where the richer line drawing should appear:
    scattered signals resolving into a connected map.
  */
  summary_transition: "finalMap",
  summary: "finalMap",
  regauth_transition: "finalMap",
};