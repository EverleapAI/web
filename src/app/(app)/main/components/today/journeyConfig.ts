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
      "Get oriented with Everleap. Share your first signals so Everleap can begin noticing patterns.",
    src: "/onboarding/icons/badges/1_onboard.png",
  },
  {
    id: "story",
    label: "Story",
    description:
      "Answer deeper questions about what drives you, what matters to you, and how you make choices.",
    src: "/onboarding/icons/badges/2_story.png",
  },
  {
    id: "reflection",
    label: "Reflection",
    description:
      "Review what Everleap is learning. Notice patterns, tensions, strengths, and possible blind spots.",
    src: "/onboarding/icons/badges/3_reflection.png",
  },
  {
    id: "explore",
    label: "Explore",
    description:
      "Discover possible paths, environments, careers, and experiences that may fit who you are becoming.",
    src: "/onboarding/icons/badges/4_explore.png",
  },
  {
    id: "takeoff",
    label: "Takeoff",
    description:
      "Turn insight into motion through small real-world actions, experiments, and next steps.",
    src: "/onboarding/icons/badges/5_takeoff.png",
  },
];