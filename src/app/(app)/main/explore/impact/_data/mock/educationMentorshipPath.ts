// apps/web/src/app/(app)/main/explore/impact/_data/mock/educationMentorshipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const EDUCATION_MENTORSHIP_PATH: ImpactPathContent = {
  id: "education-mentorship",
  slug: "education-mentorship",
  lane: "impact",

  theme: {
    tone: "guiding-light",
    accent: { r: 108, g: 196, b: 164 },
    accentStrong: { r: 72, g: 168, b: 140 },
    glow: { r: 72, g: 168, b: 140 },
    surfaceLabel: "Guiding others",
  },

  card: {
    title: "Education & Mentorship",
    hook: "Help someone learn something that changes their future.",
    description:
      "Teaching and mentorship are powerful forms of impact. Sometimes a single conversation, explanation, or encouragement helps someone unlock confidence or curiosity they didn’t know they had.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Education & Mentorship",
    hook: "Helping people grow through learning.",
    summary:
      "Education isn’t limited to classrooms. Mentorship can happen anywhere — helping someone understand a subject, guiding a younger student, or sharing experience that makes someone else’s path clearer.",
    whyItPullsYouIn: [
      "You enjoy explaining ideas and helping others understand them.",
      "You feel good when someone gains confidence because of your help.",
      "You like seeing people grow over time.",
    ],
  },

  traitChips: [
    { id: "teacher-energy", label: "Teacher energy" },
    { id: "patient", label: "Patient explainer" },
    { id: "encouraging", label: "Encouraging presence" },
  ],

  fitSignals: [
    {
      id: "explains-well",
      label: "You enjoy explaining ideas",
      score: 4,
      explanation:
        "You often help classmates or friends understand topics they find confusing.",
    },
    {
      id: "patient-listener",
      label: "You are a patient listener",
      score: 4,
      explanation:
        "You take time to understand where someone is stuck before offering help.",
    },
    {
      id: "growth-focused",
      label: "You like seeing progress",
      score: 5,
      explanation:
        "Watching someone improve over time gives you a sense of purpose.",
    },
  ],

  branchPreviews: [
    {
      id: "peer-tutoring",
      slug: "peer-tutoring",
      title: "Peer Tutoring",
      oneLiner: "Helping classmates learn difficult topics.",
      whyItCouldFit:
        "Many schools need students who are willing to support others academically.",
      energy: "people",
    },
    {
      id: "youth-mentorship",
      slug: "youth-mentorship",
      title: "Youth Mentorship",
      oneLiner: "Guiding younger students and helping them grow.",
      whyItCouldFit:
        "Younger students often benefit greatly from encouragement and guidance.",
      energy: "grounded",
    },
  ],

  branches: [
    {
      id: "peer-tutoring",
      slug: "peer-tutoring",
      title: "Peer Tutoring",
      summary:
        "Peer tutoring helps students support each other academically and build confidence in learning.",
      whatYouActuallyDo: [
        "Explain concepts in simple language",
        "Help classmates review material",
        "Encourage consistent study habits",
      ],
      skillsThatGrowHere: [
        "Communication",
        "Patience",
        "Teaching skills",
      ],
      starterProjects: [
        "Tutor a friend in a subject you enjoy",
        "Help organize a study group",
        "Create simple study guides for classmates",
      ],
      atmosphere:
        "Supportive, collaborative, and focused on helping others succeed.",
    },
    {
      id: "youth-mentorship",
      slug: "youth-mentorship",
      title: "Youth Mentorship",
      summary:
        "Mentorship helps younger students build confidence and explore their interests.",
      whatYouActuallyDo: [
        "Listen to younger students’ challenges",
        "Offer encouragement and advice",
        "Share learning strategies and experiences",
      ],
      skillsThatGrowHere: [
        "Empathy",
        "Leadership",
        "Communication",
      ],
      starterProjects: [
        "Volunteer as a mentor for younger students",
        "Help lead an after-school program",
        "Support a youth club or activity group",
      ],
      atmosphere:
        "Encouraging, patient, and centered around personal growth.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Mentorship often begins with small acts of support and encouragement.",
    actions: [
      {
        id: "help-someone-learn",
        title: "Help Someone Learn Something",
        type: "conversation",
        effort: "light",
        timeEstimate: "30–60 minutes",
        whyThisMatters:
          "Even small explanations can build confidence and curiosity.",
        instructions: [
          "Ask a friend or classmate what topic they find difficult.",
          "Explain the concept step by step.",
          "Encourage them as they practice.",
          "Celebrate progress together.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Mentorship combines patience, encouragement, and the satisfaction of seeing someone grow.",
    moments: [
      {
        id: "aha-moment",
        title: "The 'Aha' Moment",
        body:
          "Someone suddenly understands something that previously confused them.",
      },
      {
        id: "confidence-growth",
        title: "Growing Confidence",
        body:
          "Over time, the person you help becomes more confident in their abilities.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Mentorship skills develop through experience and deeper relationships.",
    stages: [
      {
        id: "helping-friends",
        label: "Helping Friends",
        timeframe: "Weeks–Months",
        summary:
          "You begin by helping classmates or friends understand difficult topics.",
        signalsOfProgress: [
          "People ask you for help more often",
          "Your explanations become clearer",
        ],
      },
      {
        id: "structured-mentorship",
        label: "Structured Mentorship",
        timeframe: "Months–Years",
        summary:
          "You mentor younger students or participate in organized education programs.",
        signalsOfProgress: [
          "You guide others through longer learning journeys",
          "You design activities or lessons",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next Steps",
    summary:
      "Mentorship opportunities exist in schools, clubs, and community programs.",
    actions: [
      {
        id: "start-study-group",
        title: "Start a Study Group",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Study groups help students support each other and build collaborative learning habits.",
        instructions: [
          "Choose a subject you enjoy.",
          "Invite a few classmates who want help.",
          "Meet regularly to review and practice.",
          "Encourage everyone to contribute ideas.",
        ],
      },
    ],
    opportunityGroups: [],
  },
};