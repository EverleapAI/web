// apps/web/src/app/(app)/main/explore/impact/_data/mock/environmentStewardshipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const ENVIRONMENT_STEWARDSHIP_PATH: ImpactPathContent = {
  id: "environment-stewardship",
  slug: "environment-stewardship",
  lane: "impact",

  theme: {
    tone: "earth-motion",
    accent: { r: 114, g: 184, b: 108 },
    accentStrong: { r: 76, g: 148, b: 84 },
    glow: { r: 76, g: 148, b: 84 },
    surfaceLabel: "Grounded action",
  },

  card: {
    title: "Environment & Stewardship",
    hook: "Protect places, improve systems, and help care for the world people actually live in.",
    description:
      "Environmental impact is not only about loving nature in the abstract. It is about stewardship — noticing what is damaged, wasteful, fragile, or neglected, and helping restore, protect, or improve it through real action.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Environment & Stewardship",
    hook: "Turning care for the planet into practical action.",
    summary:
      "This path fits people who feel connected to places, systems, and long-term responsibility. Stewardship can look like habitat restoration, community cleanups, garden work, climate education, sustainability projects, or helping people make better choices that add up over time.",
    whyItPullsYouIn: [
      "You care about places being healthy, clean, and respected.",
      "You get frustrated by waste, neglect, or systems that feel shortsighted.",
      "You like impact that is tangible, visible, and rooted in the real world.",
    ],
  },

  traitChips: [
    { id: "earth-minded", label: "Earth minded" },
    { id: "builder", label: "Hands-on builder" },
    { id: "long-view", label: "Long-view thinker" },
  ],

  fitSignals: [
    {
      id: "protective-instinct",
      label: "You feel protective of places",
      score: 5,
      explanation:
        "You notice when environments feel neglected or harmed and want to help care for them.",
    },
    {
      id: "systems-awareness",
      label: "You think about systems and consequences",
      score: 4,
      explanation:
        "You naturally connect everyday choices to larger environmental outcomes.",
    },
    {
      id: "hands-on-impact",
      label: "You like impact you can actually see",
      score: 4,
      explanation:
        "Physical projects, restoration, and visible improvements feel motivating to you.",
    },
  ],

  branchPreviews: [
    {
      id: "restoration-projects",
      slug: "restoration-projects",
      title: "Restoration Projects",
      oneLiner: "Helping repair and care for real spaces.",
      whyItCouldFit:
        "Some of the strongest environmental learning happens through direct, physical stewardship.",
      energy: "builder",
    },
    {
      id: "sustainability-action",
      slug: "sustainability-action",
      title: "Sustainability Action",
      oneLiner: "Improving habits and systems that shape daily life.",
      whyItCouldFit:
        "Environmental change also happens through smarter systems, education, and design.",
      energy: "grounded",
    },
  ],

  branches: [
    {
      id: "restoration-projects",
      slug: "restoration-projects",
      title: "Restoration Projects",
      summary:
        "Restoration work is direct and practical: helping clean, protect, rebuild, or maintain spaces that people and ecosystems depend on.",
      whatYouActuallyDo: [
        "Join cleanup, habitat, or garden efforts",
        "Help maintain trails, open spaces, or school grounds",
        "Learn how environments recover through steady care",
      ],
      skillsThatGrowHere: [
        "Hands-on teamwork",
        "Environmental observation",
        "Project follow-through",
      ],
      starterProjects: [
        "Join a local cleanup or habitat work day",
        "Help improve a school garden or outdoor area",
        "Track one small environmental improvement project over time",
      ],
      atmosphere:
        "Grounded, physical, and satisfying in a very real-world way.",
    },
    {
      id: "sustainability-action",
      slug: "sustainability-action",
      title: "Sustainability Action",
      summary:
        "Stewardship also includes helping schools, teams, and communities reduce waste and make more sustainable choices.",
      whatYouActuallyDo: [
        "Notice wasteful patterns and propose better systems",
        "Help with awareness campaigns or sustainability projects",
        "Encourage small changes that become normal habits",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Practical communication",
        "Change-making through consistency",
      ],
      starterProjects: [
        "Audit a small space for waste or energy habits",
        "Create a simple sustainability challenge for a club or class",
        "Help improve recycling, composting, or reuse habits in one setting",
      ],
      atmosphere:
        "Practical, future-minded, and focused on real improvements rather than vague ideals.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Stewardship starts by paying attention, choosing one real place or system, and improving it in a way people can actually feel.",
    actions: [
      {
        id: "mini-stewardship-audit",
        title: "Do a Mini Stewardship Audit",
        type: "project",
        effort: "light",
        timeEstimate: "45–90 minutes",
        whyThisMatters:
          "Environmental impact gets clearer when you focus on one real setting instead of trying to solve everything at once.",
        instructions: [
          "Choose one space you know well, like a classroom, club room, park area, or shared home space.",
          "Notice where waste, neglect, or unnecessary use shows up.",
          "Write down 3 realistic improvements.",
          "Pick 1 small change you could actually test this week.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "This path can feel grounding and real — less like abstract concern, more like caring for something with your hands, habits, and attention.",
    moments: [
      {
        id: "place-looks-different",
        title: "A Place Starts Looking Different",
        body:
          "You come back to a space after a cleanup, restoration, or improvement effort and can actually see that care changed it.",
      },
      {
        id: "small-system-better",
        title: "A Small System Starts Working Better",
        body:
          "You help a group adopt a smarter routine, and the difference starts showing up in everyday behavior.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Stewardship deepens as you move from caring about environmental issues to understanding how places, systems, and long-term responsibility connect.",
    stages: [
      {
        id: "noticing-and-helping",
        label: "Noticing and Helping",
        timeframe: "Weeks–Months",
        summary:
          "You begin by joining projects, learning through observation, and taking small actions in places you already care about.",
        signalsOfProgress: [
          "You notice environmental problems faster and more clearly",
          "You start taking initiative instead of waiting for someone else to act",
        ],
      },
      {
        id: "leading-better-systems",
        label: "Leading Better Systems",
        timeframe: "Months–Years",
        summary:
          "You begin shaping projects, habits, and group norms that create more lasting environmental impact.",
        signalsOfProgress: [
          "You help others adopt better practices",
          "You can design or lead a small stewardship initiative from start to finish",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next Steps",
    summary:
      "This path gets stronger when you connect your care for the environment to real projects, local organizations, and settings where better habits can actually stick.",
    actions: [
      {
        id: "join-local-stewardship",
        title: "Join a Local Stewardship Project",
        type: "join",
        effort: "medium",
        timeEstimate: "1–3 weeks to begin",
        whyThisMatters:
          "Environmental values become much more real when you work alongside people already caring for land, spaces, and systems.",
        instructions: [
          "Look for local cleanup days, restoration groups, park programs, school garden projects, or sustainability clubs.",
          "Choose one that feels practical and welcoming.",
          "Show up once and pay attention to what kind of work gives you energy.",
          "Use that experience to decide what kind of stewardship fits you best.",
        ],
      },
    ],
    opportunityGroups: [],
  },
};