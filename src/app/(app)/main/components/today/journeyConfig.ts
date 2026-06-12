export type JourneyBadgeId =
  | "onboarding"
  | "story"
  | "reflection"
  | "explore"
  | "takeoff";

export type JourneyBadge = {
  id: JourneyBadgeId;
  label: string;
  description: string;
  src: string;
};

export const JOURNEY_BADGES: JourneyBadge[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    description:
      "Get started. Share a few signals so we can begin understanding what matters to you.",
    src: "/onboarding/icons/badges/1_onboard.png",
  },
  {
    id: "story",
    label: "Story",
    description:
      "Answer deeper questions about your motivations, strengths, skills, and experiences.",
    src: "/onboarding/icons/badges/2_story.png",
  },
  {
    id: "reflection",
    label: "Reflection",
    description:
      "See the patterns emerging from your answers and what they may reveal about you.",
    src: "/onboarding/icons/badges/3_reflection.png",
  },
  {
    id: "explore",
    label: "Explore",
    description:
      "Discover careers, environments, and opportunities that may fit who you are becoming.",
    src: "/onboarding/icons/badges/4_explore.png",
  },
  {
    id: "takeoff",
    label: "Takeoff",
    description:
      "Take real-world action through conversations, experiments, and small next steps.",
    src: "/onboarding/icons/badges/5_takeoff.png",
  },
];