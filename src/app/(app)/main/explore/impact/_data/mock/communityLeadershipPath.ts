// apps/web/src/app/(app)/main/explore/impact/_data/mock/communityLeadershipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const COMMUNITY_LEADERSHIP_PATH: ImpactPathContent = {
  id: "community-leadership",
  slug: "community-leadership",
  lane: "impact",

  theme: {
    tone: "community-builder",
    accent: { r: 255, g: 166, b: 92 },
    accentStrong: { r: 255, g: 120, b: 80 },
    glow: { r: 255, g: 120, b: 80 },
    surfaceLabel: "Local momentum",
  },

  card: {
    title: "Community Leadership",
    hook: "Notice what your community needs, then help move people into action.",
    description:
      "Some people see problems and feel stuck. Others see the same problems and start gathering people, ideas, and energy to improve things. Community leadership is about helping groups organize, collaborate, and move from conversation to real change.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Community Leadership",
    hook: "Helping people organize around real needs.",
    summary:
      "Communities constantly need people who can bring others together, listen to different perspectives, and help groups move forward. Community leadership often begins with small initiatives — improving a space, supporting neighbors, or organizing volunteers — and grows into larger projects that make real change possible.",
    whyItPullsYouIn: [
      "You often notice what could be better in a group or place.",
      "You like helping people coordinate around a shared goal.",
      "You feel energized when people come together to solve something real.",
    ],
  },

  traitChips: [
    { id: "organizer", label: "Organizer energy" },
    { id: "people-oriented", label: "People oriented" },
    { id: "initiative", label: "Takes initiative" },
  ],

  fitSignals: [
    {
      id: "group-momentum",
      label: "You help groups get moving",
      score: 4,
      explanation:
        "When a group feels stuck, you often help bring structure, encouragement, or direction.",
    },
    {
      id: "care-about-community",
      label: "You care about shared spaces",
      score: 4,
      explanation:
        "You notice how environments affect people and want communities to feel stronger and more connected.",
    },
    {
      id: "action-oriented",
      label: "You like turning ideas into action",
      score: 5,
      explanation:
        "You enjoy taking an idea and helping organize the steps that make it real.",
    },
  ],

  branchPreviews: [
    {
      id: "school-leadership",
      slug: "school-leadership",
      title: "School Leadership",
      oneLiner: "Organizing initiatives inside your school.",
      whyItCouldFit:
        "Student-led clubs, events, and programs often need people who can coordinate and motivate others.",
      energy: "people",
    },
    {
      id: "neighborhood-projects",
      slug: "neighborhood-projects",
      title: "Neighborhood Projects",
      oneLiner: "Improving spaces where people live.",
      whyItCouldFit:
        "Community improvement efforts often begin with small projects organized by motivated individuals.",
      energy: "builder",
    },
  ],

  branches: [
    {
      id: "school-leadership",
      slug: "school-leadership",
      title: "School Leadership",
      summary:
        "Many leadership journeys start inside school communities through clubs, teams, and student initiatives.",
      whatYouActuallyDo: [
        "Organize events or service projects",
        "Coordinate volunteers and student teams",
        "Work with teachers or administrators",
      ],
      skillsThatGrowHere: [
        "Communication",
        "Team coordination",
        "Decision-making",
      ],
      starterProjects: [
        "Start a small campus improvement project",
        "Organize a student-led event",
        "Coordinate volunteers for a local cause",
      ],
      atmosphere:
        "Fast-moving, collaborative, and focused on bringing people together around shared goals.",
    },
    {
      id: "neighborhood-projects",
      slug: "neighborhood-projects",
      title: "Neighborhood Projects",
      summary:
        "Local communities often improve because someone decides to start organizing people and ideas.",
      whatYouActuallyDo: [
        "Plan small improvement efforts",
        "Work with neighbors and local organizations",
        "Coordinate volunteers and resources",
      ],
      skillsThatGrowHere: [
        "Project planning",
        "Community engagement",
        "Problem solving",
      ],
      starterProjects: [
        "Organize a neighborhood clean-up",
        "Help coordinate a community event",
        "Volunteer with a local initiative",
      ],
      atmosphere:
        "Grounded, practical, and centered around helping people work together.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Leadership often begins with small experiments that help people work together.",
    actions: [
      {
        id: "organize-small-project",
        title: "Organize a Small Project",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Even small projects teach coordination, communication, and planning.",
        instructions: [
          "Choose a simple goal that helps a group or space.",
          "Invite a few people to help.",
          "Divide the work and set a timeline.",
          "Celebrate the result together.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Community leadership combines responsibility, collaboration, and visible results.",
    moments: [
      {
        id: "first-initiative",
        title: "Starting Something",
        body:
          "You decide to try improving something and begin gathering people who care about the same idea.",
      },
      {
        id: "seeing-people-engage",
        title: "People Getting Involved",
        body:
          "Others begin contributing ideas and energy, and the project gains momentum.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Leadership skills tend to grow through experience and increasingly complex projects.",
    stages: [
      {
        id: "first-steps",
        label: "First Steps",
        timeframe: "Weeks–Months",
        summary:
          "You experiment with organizing small initiatives or helping coordinate activities.",
        signalsOfProgress: [
          "People respond to your ideas",
          "You successfully organize a small project",
        ],
      },
      {
        id: "growing-impact",
        label: "Growing Impact",
        timeframe: "Months–Years",
        summary:
          "You begin organizing larger efforts and collaborating with more people.",
        signalsOfProgress: [
          "Projects become more ambitious",
          "More people trust your coordination",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next Steps",
    summary:
      "Community leadership develops through experience with real projects and organizations.",
    actions: [
      {
        id: "join-local-org",
        title: "Join a Local Organization",
        type: "join",
        effort: "light",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Community groups provide opportunities to collaborate and lead.",
        instructions: [
          "Search for local community or volunteer groups.",
          "Attend one meeting or event.",
          "Offer to help organize a small initiative.",
        ],
      },
    ],
    opportunityGroups: [],
  },
};