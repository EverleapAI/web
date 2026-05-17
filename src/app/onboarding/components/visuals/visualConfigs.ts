export type OnboardingVisualKey =
  | "welcome"
  | "how_it_works"
  | "what_you_get"
  | "progress"
  | "lets_get_started"
  | "permissions"
  | "intro_name"
  | "name"
  | "life_stage"
  | "radar"
  | "post_school_radar"
  | "certainty"
  | "certainty_idea"
  | "activities"
  | "summary_transition";

export const visualAliases: Record<string, OnboardingVisualKey> = {
  welcome: "welcome",
  how_it_works: "how_it_works",
  what_you_get: "what_you_get",
  progress: "progress",
  lets_get_started: "lets_get_started",
  permissions: "permissions",

  intro_name: "name",
  name: "name",

  current_situation: "life_stage",
  life_stage: "life_stage",
  where_are_you: "life_stage",

  post_plans: "post_school_radar",
  post_school_radar: "post_school_radar",
  radar: "post_school_radar",
  after_school: "post_school_radar",

  certainty: "certainty",
  certainty_idea: "certainty_idea",
  idea: "certainty_idea",

  activities: "activities",
  natural_time: "activities",

  summary_transition: "summary_transition",
};

export function getVisualKey(
  nodeKey?: string | null
): OnboardingVisualKey | null {
  if (!nodeKey) return null;
  return visualAliases[nodeKey] ?? null;
}