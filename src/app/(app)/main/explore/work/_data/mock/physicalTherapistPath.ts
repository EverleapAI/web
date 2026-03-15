import type { WorkPathContent } from "../workPathSchema";

export const PHYSICAL_THERAPIST_PATH: WorkPathContent = {
  id: "physical-therapist",
  slug: "physical-therapist",
  lane: "work",

  theme: {
    tone: "health-human",
    accent: { r: 94, g: 214, b: 160 },
    accentStrong: { r: 64, g: 180, b: 255 },
    glow: { r: 150, g: 240, b: 200 },
    surfaceLabel: "Human health",
  },

  card: {
    title: "Physical Therapist",
    hook: "Help people recover movement, strength, and confidence.",
    description:
      "A path for people who enjoy helping others heal, improve mobility, and regain physical strength. Physical therapy blends science, empathy, and hands-on guidance.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Physical Therapist",
    hook:
      "You care about helping people recover, move better, and feel stronger in their own bodies.",
    summary:
      "Physical therapists help people recover from injuries, surgeries, and physical challenges. They guide patients through exercises, movement therapy, and rehabilitation to rebuild strength and mobility.",
    whyItPullsYouIn: [
      "You like helping people improve their health and confidence.",
      "You enjoy understanding how the human body works.",
      "You want work that makes a visible difference in people's lives.",
    ],
  },

  traitChips: [
    { id: "empathy", label: "Empathy" },
    { id: "science-interest", label: "Science interest" },
    { id: "people-support", label: "People support" },
    { id: "patience", label: "Patience" },
  ],

  fitSignals: [
    {
      id: "helping-instinct",
      label: "Helping instinct",
      score: 90,
      explanation:
        "This path fits people who feel energized helping others improve physically.",
    },
    {
      id: "human-biology",
      label: "Human biology interest",
      score: 88,
      explanation:
        "Understanding anatomy, muscles, and movement is central to the work.",
    },
    {
      id: "patience-and-guidance",
      label: "Patience and guidance",
      score: 87,
      explanation:
        "Recovery takes time, and therapists help people stay motivated through the process.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Hands-on guidance",
      note: "Working directly with people",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Patient sessions",
      note: "Assessing progress and guiding exercises",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Recovery progress",
      note: "Strength, mobility, confidence",
    },
  ],

  specialtyPreviews: [
    {
      id: "sports-therapy",
      slug: "sports-therapy",
      title: "Sports Physical Therapy",
      oneLiner:
        "Helps athletes recover from injuries and return to performance.",
      whyItCouldFit:
        "Great for someone interested in sports and physical performance.",
      energy: "active",
    },
    {
      id: "rehabilitation-therapy",
      slug: "rehabilitation-therapy",
      title: "Rehabilitation Therapy",
      oneLiner:
        "Helps patients regain movement after surgery, illness, or injury.",
      whyItCouldFit:
        "Great for someone who wants to support long-term recovery.",
      energy: "human",
    },
  ],

  specialties: [],

  dayInLife: {
    title: "A day in the life",
    summary:
      "Physical therapists spend most of their day helping patients improve movement and strength.",
    moments: [
      {
        id: "morning-assessment",
        timeLabel: "9:00 AM",
        title: "Assess patient progress",
        body:
          "You evaluate movement, pain levels, and recovery progress.",
      },
      {
        id: "midday-session",
        timeLabel: "11:30 AM",
        title: "Guide exercises",
        body:
          "You guide patients through exercises that rebuild strength and mobility.",
      },
      {
        id: "afternoon-support",
        timeLabel: "2:00 PM",
        title: "Adjust recovery plans",
        body:
          "You refine therapy plans based on how patients are improving.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "Physical therapy is a stable healthcare career with growing demand.",
    stages: [],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "Exploring health careers often begins with learning about the body and helping others stay active.",

    actions: [
      {
        id: "pt-next-1",
        title: "Learn basic anatomy",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "30 min",
        whyThisMatters:
          "Understanding muscles and joints is the foundation of physical therapy.",
        instructions: [
          "Study a simple anatomy diagram.",
          "Learn the main muscle groups.",
          "Notice how movement connects them.",
        ],
      },
    ],

    opportunityGroups: [],
  },
};