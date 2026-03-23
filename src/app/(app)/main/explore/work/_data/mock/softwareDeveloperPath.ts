// apps/web/src/app/(app)/main/explore/work/_data/mock/softwareDeveloperPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const SOFTWARE_DEVELOPER_PATH: WorkPathContent = {
  id: "software-developer",
  slug: "software-developer",
  lane: "work",

  theme: {
    tone: "future-build",
    accent: { r: 56, g: 189, b: 248 },
    accentStrong: { r: 14, g: 165, b: 233 },
    glow: { r: 56, g: 189, b: 248 },
  },

  card: {
    title: "Software Developer",
    hook: "Build the systems everything runs on",
    description:
      "Design, build, and improve software that powers apps, games, tools, and entire companies.",
  },

  hero: {
    eyebrow: "Work",
    title: "Software Developer",
    hook: "Build the systems everything runs on",
    summary:
      "Software developers turn ideas into real, working systems. From apps to infrastructure, this work shapes how people live, work, and interact with the world.",
    whyItPullsYouIn: [
      "You like building things that actually work",
      "You enjoy solving complex problems",
      "You want to create tools people use every day",
    ],
  },

  traitChips: [
    { id: "logic", label: "Logic" },
    { id: "build", label: "Build" },
    { id: "systems", label: "Systems" },
  ],

  fitSignals: [
    {
      id: "problem-solving",
      label: "Problem solving",
      score: 88,
      explanation: "You enjoy breaking problems down and figuring them out step by step.",
    },
    {
      id: "focus",
      label: "Deep focus",
      score: 82,
      explanation: "You can stay with a problem for a long time until it works.",
    },
  ],

  snapshotStats: [
    {
      id: "salary",
      label: "Median salary",
      value: "$133K",
      note: "BLS (US)",
    },
  ],

  specialtyPreviews: [],
  specialties: [],

  dayInLife: {
    title: "A day building software",
    summary: "A mix of coding, debugging, and collaboration.",
    moments: [],
  },

  /* =============================================================================
     OLD FORECAST (leave intact for compatibility)
  ============================================================================= */

  forecast: {
    title: "Where this field is going",
    summary: "Software is everywhere and still expanding.",
    stages: [],
  },

  /* =============================================================================
     NEW REAL DATA FORECAST
  ============================================================================= */

  forecastV2: {
    outlookLabel: "Strong but changing",

    outlookSummary:
      "Software development is one of the fastest-growing fields, but AI is rapidly changing how work gets done — especially at the entry level.",

    metrics: [
      {
        id: "growth",
        label: "Demand",
        value: "+17%",
        tone: "positive",
        note: "Projected growth (BLS 2024–2034)",
      },
      {
        id: "salary",
        label: "Median pay",
        value: "$133K",
        tone: "positive",
        note: "U.S. median annual salary",
      },
      {
        id: "ai",
        label: "AI impact",
        value: "High",
        tone: "mixed",
        note: "AI is accelerating coding and changing entry roles",
      },
      {
        id: "stability",
        label: "Stability",
        value: "Strong",
        tone: "positive",
        note: "High demand across industries",
      },
    ],

    salaryRange: {
      low: "$75K",
      median: "$133K",
      high: "$200K+",
      note: "Varies widely by experience and company",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl:
        "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
      growthPercent: "17%",
      annualOpenings: "356,700",
      medianPay: "$133,080",
      educationTypical: "Bachelor’s degree",
    },

    whatIsGrowing: [
      "AI-assisted development workflows",
      "Full-stack and product-focused engineers",
      "Systems thinking and architecture",
      "Developer productivity and tooling",
    ],

    whatIsUnderPressure: [
      "Basic coding tasks (AI can generate these)",
      "Entry-level roles doing repetitive work",
      "Developers who rely only on syntax knowledge",
      "Outsourced or low-skill development work",
    ],

    aiImpact: {
      level: "high",
      summary:
        "AI is speeding up coding dramatically, but not replacing developers. It is raising expectations for what developers can do.",
      helpsWith: [
        "Writing boilerplate code",
        "Debugging and error fixing",
        "Learning new languages quickly",
      ],
      putsPressureOn: [
        "Simple coding tasks",
        "Junior roles without strong problem-solving",
      ],
      humansStillOwn: [
        "System design and architecture",
        "Understanding real user problems",
        "Making tradeoffs and decisions",
      ],
    },

    whyThisCouldFeelExciting: [
      "High demand and strong salaries",
      "You can build real products quickly",
      "AI makes you more powerful, not less",
    ],

    whyThisCouldFeelRisky: [
      "Entry-level roles are getting harder to land",
      "You must keep learning constantly",
      "Competition is increasing globally",
    ],
  },

  nextSteps: {
    title: "Try it out",
    summary: "Start building simple projects.",
    actions: [],
  },
};