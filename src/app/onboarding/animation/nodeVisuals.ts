// apps/web/src/app/onboarding/animation/nodeVisuals.ts

export type AnimationPreset =
  /*
    Transitional / fallback
  */
  | "idle"

  /*
    Arrival / orientation
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
    Map / convergence
  */
  | "finalMap";

/*
  VISUAL SYSTEM DIRECTION

  Everleap onboarding now has two visual languages:

  1. WHAT IS EVERLEAP
     - semantic icons
     - calm, symbolic, memorable
     - examples: mirror, story, compass, stars, rudder

  2. DISCOVERY
     - active line motion
     - signals, branches, terrain, networks
     - reflects the system learning about the user

  Transition / synthesis screens should stay quiet.
  They can map to finalMap for compatibility, but page-level rendering
  should avoid active animated line art when possible.
*/

export const nodeVisuals: Record<string, AnimationPreset> = {
  /*
    PHASE 1 — What is Everleap?

    These screens are primarily rendered through semantic icon assets
    in page.tsx. The presets below are fallbacks only.
  */
  welcome: "anchor",
  how_it_works: "connect",
  what_you_get: "anchor",
  progress: "networkGrow",
  lets_get_started: "connect",

  /*
    PHASE 2 — Discovery

    This is where animated line visuals belong.
  */

  // Permissions
  permissions: "scatter",

  // Identity
  name: "nameTag",

  // Grounding
  current_situation: "terrain",

  // Future horizon
  post_plans: "branching",

  // Certainty / branching
  certainty: "branching",
  certainty_idea: "branchExtend",

  // Personal signals
  activities: "networkGrow",

  // Natural pull / instinct
  fun_instinct: "instinctShift",

  /*
    PHASE 3 — Transition / synthesis

    Quiet handoff into RegAuth.
  */
  summary_transition: "finalMap",
  summary: "finalMap",
  regauth_transition: "finalMap",
};