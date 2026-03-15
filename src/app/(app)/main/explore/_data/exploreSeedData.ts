// apps/web/src/app/(app)/main/explore/_data/exploreSeedData.ts

import type {
  ExploreCatalog,
  ExploreLaneConfig,
  ExplorePath,
  ExploreUserProfileSnapshot,
  RecommendationDeck,
  SignalVector,
} from "./exploreTypes";

function signalVector(values: Partial<SignalVector>): SignalVector {
  return {
    creativity: values.creativity ?? 0,
    systems: values.systems ?? 0,
    people: values.people ?? 0,
    curiosity: values.curiosity ?? 0,
    analysis: values.analysis ?? 0,
    build: values.build ?? 0,
    impact: values.impact ?? 0,
    story: values.story ?? 0,
  };
}

export const EXPLORE_LANE_CONFIGS: Record<
  "work" | "learning" | "world" | "impact" | "play",
  ExploreLaneConfig
> = {
  work: {
    id: "work",
    label: "Work",
    shortLabel: "Careers",
    description:
      "Explore career directions through personality fit, real-world rhythms, and paths you can actually try.",
    pathLabel: "Career Path",
    deepDivePages: [
      "specialties",
      "day-in-the-life",
      "future",
      "next-steps",
    ],
    theme: {
      accentHex: "#8B5CF6",
      accentRgb: { r: 139, g: 92, b: 246 },
      gradientFrom: "from-violet-500/20",
      gradientTo: "to-fuchsia-400/12",
      glow: "shadow-[0_0_80px_rgba(139,92,246,0.22)]",
    },
  },

  learning: {
    id: "learning",
    label: "Learning",
    shortLabel: "Education",
    description:
      "See how different forms of study, training, and skill-building connect to who you are becoming.",
    pathLabel: "Learning Path",
    deepDivePages: [
      "specialties",
      "day-in-the-life",
      "future",
      "next-steps",
    ],
    theme: {
      accentHex: "#22C55E",
      accentRgb: { r: 34, g: 197, b: 94 },
      gradientFrom: "from-emerald-500/20",
      gradientTo: "to-lime-400/10",
      glow: "shadow-[0_0_80px_rgba(34,197,94,0.18)]",
    },
  },

  world: {
    id: "world",
    label: "World",
    shortLabel: "Global",
    description:
      "Explore travel, language, culture, and international opportunities that widen your sense of possibility.",
    pathLabel: "World Path",
    deepDivePages: [
      "specialties",
      "day-in-the-life",
      "future",
      "next-steps",
    ],
    theme: {
      accentHex: "#06B6D4",
      accentRgb: { r: 6, g: 182, b: 212 },
      gradientFrom: "from-cyan-500/20",
      gradientTo: "to-sky-400/10",
      glow: "shadow-[0_0_80px_rgba(6,182,212,0.18)]",
    },
  },

  impact: {
    id: "impact",
    label: "Impact",
    shortLabel: "Community",
    description:
      "Discover ways to contribute, organize, support people, and create change that matters.",
    pathLabel: "Impact Path",
    deepDivePages: [
      "specialties",
      "day-in-the-life",
      "future",
      "next-steps",
    ],
    theme: {
      accentHex: "#F97316",
      accentRgb: { r: 249, g: 115, b: 22 },
      gradientFrom: "from-orange-500/20",
      gradientTo: "to-amber-400/10",
      glow: "shadow-[0_0_80px_rgba(249,115,22,0.18)]",
    },
  },

  play: {
    id: "play",
    label: "Play",
    shortLabel: "Sports & Hobbies",
    description:
      "Follow interests that energize you, sharpen you, and might grow into identity, mastery, or opportunity.",
    pathLabel: "Play Path",
    deepDivePages: [
      "specialties",
      "day-in-the-life",
      "future",
      "next-steps",
    ],
    theme: {
      accentHex: "#EC4899",
      accentRgb: { r: 236, g: 72, b: 153 },
      gradientFrom: "from-pink-500/20",
      gradientTo: "to-rose-400/10",
      glow: "shadow-[0_0_80px_rgba(236,72,153,0.18)]",
    },
  },
};

export const GAME_DESIGNER_PATH: ExplorePath = {
  id: "work-game-designer",
  laneId: "work",
  slug: "game-designer",
  status: "active",

  display: {
    eyebrow: "Work Path",
    title: "Game Designer",
    shortTitle: "Game Design",
    subtitle: "Build worlds, systems, and player experiences.",
    hook:
      "This path blends creativity, systems thinking, and storytelling into something people can actually play.",
    description:
      "Game designers imagine mechanics, shape player decisions, test what feels fun, and translate ideas into experiences that come alive through art, code, sound, and story.",
  },

  theme: {
    accentHex: "#38BDF8",
    accentRgb: { r: 56, g: 189, b: 248 },
    gradientFrom: "from-sky-400/20",
    gradientTo: "to-cyan-300/10",
    glow: "shadow-[0_0_90px_rgba(56,189,248,0.22)]",
  },

  media: {
    cardImage: "/explore/work/game-designer/card.jpg",
    heroImage: "/explore/work/game-designer/hero.jpg",
    posterImage: "/explore/work/game-designer/poster.jpg",
    thumbnailImage: "/explore/work/game-designer/thumb.jpg",
  },

  signals: signalVector({
    creativity: 94,
    systems: 88,
    people: 54,
    curiosity: 86,
    analysis: 72,
    build: 73,
    impact: 49,
    story: 91,
  }),

  tags: ["creative", "technical", "strategic", "team-based"],

  quickCheckPrompt:
    "Would you rather invent how something works, shape how it feels, or both?",
  quickCheckOptions: [
    "Invent how it works",
    "Shape how it feels",
    "Both",
    "Not really me",
  ],

  keyMoments: [
    {
      id: "gm-1",
      type: "specialty",
      title: "Mechanics become meaning",
      body:
        "A small rule change can completely transform what players feel, choose, and remember.",
    },
    {
      id: "gm-2",
      type: "daily-task",
      title: "Fun is tested, not assumed",
      body:
        "Designers prototype quickly, watch players closely, and revise constantly based on friction and surprise.",
    },
    {
      id: "gm-3",
      type: "future-signal",
      title: "Interactive worlds keep expanding",
      body:
        "Game design now stretches across indie games, educational games, simulations, VR, social platforms, and creator tools.",
    },
  ],

  summaryStats: [
    {
      id: "stat-1",
      label: "Creative intensity",
      value: "High",
      supportingText: "You are constantly inventing ideas, tone, and player moments.",
    },
    {
      id: "stat-2",
      label: "Systems thinking",
      value: "High",
      supportingText:
        "Balance, progression, rules, and feedback loops are central to the work.",
    },
    {
      id: "stat-3",
      label: "Collaboration",
      value: "Medium–High",
      supportingText:
        "You work with artists, engineers, producers, writers, and QA.",
    },
  ],

  deepDive: {
    specialties: {
      intro:
        "Game design is not one thing. Some designers obsess over mechanics. Some focus on levels, economies, story, or player behavior.",
      items: [
        {
          id: "systems-designer",
          title: "Systems Designer",
          shortDescription:
            "Builds the rules, progression loops, balance, and underlying logic of the game.",
          description:
            "Systems designers shape things like combat balance, resource loops, character progression, crafting, rewards, and difficulty curves. This version of the work leans especially hard into logic, tuning, and interconnected thinking.",
          signalShift: {
            systems: 8,
            analysis: 6,
            build: 3,
          },
          tags: ["technical", "strategic"],
        },
        {
          id: "level-designer",
          title: "Level Designer",
          shortDescription:
            "Designs the spaces players move through and the decisions those spaces create.",
          description:
            "Level designers shape flow, pacing, challenge, exploration, and the feeling of moving through a world. They often work inside game engines and think about layout, timing, player guidance, and replayability.",
          signalShift: {
            creativity: 4,
            systems: 5,
            story: 2,
          },
          tags: ["creative", "technical", "hands-on"],
        },
        {
          id: "narrative-designer",
          title: "Narrative Designer",
          shortDescription:
            "Builds story structure, character arcs, dialogue flow, and meaning through play.",
          description:
            "Narrative designers connect worldbuilding and story to player choice. They think about branching, emotional payoff, mission framing, lore, and how mechanics can support the story instead of interrupting it.",
          signalShift: {
            story: 10,
            creativity: 5,
            people: 2,
          },
          tags: ["creative", "mission-driven"],
        },
        {
          id: "ux-game-designer",
          title: "UX / Player Experience Designer",
          shortDescription:
            "Focuses on clarity, onboarding, feedback, and what the player feels moment to moment.",
          description:
            "This specialty looks closely at menus, tutorials, readability, friction, flow, reward signals, and whether the experience makes sense to real people instead of just the team building it.",
          signalShift: {
            people: 5,
            analysis: 5,
            impact: 2,
          },
          tags: ["strategic", "social", "technical"],
        },
      ],
    },

    dayInTheLife: {
      intro:
        "The work usually moves between ideas, collaboration, prototyping, feedback, and revision.",
      steps: [
        {
          id: "day-1",
          timeLabel: "9:30 AM",
          title: "Review builds and notes",
          description:
            "You check what changed overnight, review bugs or feedback, and decide what needs another pass.",
        },
        {
          id: "day-2",
          timeLabel: "11:00 AM",
          title: "Design or revise a feature",
          description:
            "You map out a mechanic, progression loop, or player flow and write a clear design brief for the team.",
        },
        {
          id: "day-3",
          timeLabel: "1:30 PM",
          title: "Test the experience",
          description:
            "You play the feature, watch others interact with it, and look for confusion, boredom, exploits, or delight.",
        },
        {
          id: "day-4",
          timeLabel: "3:00 PM",
          title: "Collaborate with art and engineering",
          description:
            "You align on what is feasible, what can improve, and what tradeoffs keep the experience strong.",
        },
        {
          id: "day-5",
          timeLabel: "5:00 PM",
          title: "Tune and iterate",
          description:
            "You adjust values, pacing, challenge, or presentation until the system feels more intuitive and alive.",
        },
      ],
    },

    future: {
      intro:
        "This path keeps branching as interactive media expands beyond traditional games.",
      signals: [
        {
          id: "future-1",
          label: "Creative technology crossover",
          value: "Strong",
          direction: "up",
          supportingText:
            "Designers increasingly work across games, simulation, XR, educational experiences, and creator tools.",
        },
        {
          id: "future-2",
          label: "Player experience focus",
          value: "Growing",
          direction: "up",
          supportingText:
            "Teams care more about retention, onboarding, accessibility, and emotional design.",
        },
        {
          id: "future-3",
          label: "Portfolio importance",
          value: "Very high",
          direction: "steady",
          supportingText:
            "What you have made still matters more than just saying you are interested.",
        },
      ],
    },

    nextSteps: {
      intro:
        "The fastest way to test this path is to make tiny playable things and study what players actually do.",
      items: [
        {
          id: "next-1",
          title: "Design a paper prototype",
          description:
            "Create a small card or board game that proves you can invent rules, balance decisions, and make something playable.",
          type: "project",
          isOnline: false,
        },
        {
          id: "next-2",
          title: "Build a micro-game in a beginner-friendly engine",
          description:
            "Try a tiny playable concept in Roblox Studio, Godot, Unity, Construct, or similar tools.",
          type: "project",
          isOnline: true,
        },
        {
          id: "next-3",
          title: "Join a game jam",
          description:
            "A short challenge forces fast collaboration, creative problem-solving, and actual shipping.",
          type: "event",
          isOnline: true,
        },
        {
          id: "next-4",
          title: "Study games like a designer",
          description:
            "Keep notes on onboarding, pacing, reward loops, tension, progression, and what makes a mechanic memorable.",
          type: "creator-resource",
          isOnline: true,
        },
      ],
    },
  },

  contentSource: "editorial",
  relatedPathIds: [],
  createdAt: "2026-03-13T00:00:00.000Z",
  updatedAt: "2026-03-13T00:00:00.000Z",
};

export const WORK_PATHS: ExplorePath[] = [GAME_DESIGNER_PATH];

export const EXPLORE_CATALOG: ExploreCatalog = {
  lanes: [
    {
      config: EXPLORE_LANE_CONFIGS.work,
      paths: WORK_PATHS,
    },
    {
      config: EXPLORE_LANE_CONFIGS.learning,
      paths: [],
    },
    {
      config: EXPLORE_LANE_CONFIGS.world,
      paths: [],
    },
    {
      config: EXPLORE_LANE_CONFIGS.impact,
      paths: [],
    },
    {
      config: EXPLORE_LANE_CONFIGS.play,
      paths: [],
    },
  ],
};

export const EXPLORE_MOCK_USER: ExploreUserProfileSnapshot = {
  userId: "mock-user",
  signals: {
    current: signalVector({
      creativity: 82,
      systems: 74,
      people: 48,
      curiosity: 84,
      analysis: 63,
      build: 59,
      impact: 41,
      story: 78,
    }),
    confidence: {
      creativity: 0.84,
      systems: 0.76,
      people: 0.58,
      curiosity: 0.85,
      analysis: 0.67,
      build: 0.61,
      impact: 0.44,
      story: 0.81,
    },
    updatedAt: "2026-03-13T00:00:00.000Z",
  },
  preferences: {
    savedPathIds: [],
    dismissedPathIds: [],
    completedQuickChecks: [],
    preferredTags: ["creative", "technical", "strategic"],
    avoidedTags: [],
  },
  locationLabel: "Northern California",
  ageBand: "teen",
  updatedAt: "2026-03-13T00:00:00.000Z",
};

export const WORK_STARTER_DECK: RecommendationDeck = {
  laneId: "work",
  maxVisible: 4,
  rankedPathIds: [GAME_DESIGNER_PATH.id],
  activeRecommendationIds: ["rec-work-game-designer-1"],
  recommendations: [
    {
      recommendationId: "rec-work-game-designer-1",
      userId: EXPLORE_MOCK_USER.userId,
      laneId: "work",
      pathId: GAME_DESIGNER_PATH.id,
      rank: 1,
      score: 91,
      scoreBreakdown: {
        signalAlignment: 83,
        interestAlignment: 4,
        behaviorAlignment: 0,
        goalAlignment: 0,
        freshness: 1,
        diversity: 0,
        editorialBoost: 3,
        penalty: 0,
        total: 91,
      },
      reasons: [
        {
          type: "signal-match",
          title: "Strong creativity + systems match",
          detail:
            "This path fits users who like inventing ideas while also shaping how complex things work.",
          weight: 0.9,
        },
        {
          type: "signal-match",
          title: "Story is a real strength here",
          detail:
            "Game design rewards people who care about experience, emotion, pacing, and worldbuilding.",
          weight: 0.82,
        },
        {
          type: "editorial",
          title: "Great first anchor path",
          detail:
            "This is a high-exploration path because it branches into multiple specialties with different styles of work.",
          weight: 0.65,
        },
      ],
      dismissed: false,
      pinned: false,
      generatedBy: "mock",
      generatedAt: "2026-03-13T00:00:00.000Z",
    },
  ],
};
