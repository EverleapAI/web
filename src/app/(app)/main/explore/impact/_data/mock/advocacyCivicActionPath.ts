// apps/web/src/app/(app)/main/explore/impact/_data/mock/advocacyCivicActionPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const ADVOCACY_CIVIC_ACTION_PATH: ImpactPathContent = {
  id: "advocacy-civic-action",
  slug: "advocacy-civic-action",
  lane: "impact",

  theme: {
    tone: "civic-energy",
    accent: { r: 92, g: 148, b: 255 },
    accentStrong: { r: 66, g: 112, b: 255 },
    glow: { r: 66, g: 112, b: 255 },
    surfaceLabel: "Civic momentum",
  },

  card: {
    title: "Advocacy & Civic Action",
    hook: "Speak up, organize people, and help shape decisions that affect your community.",
    description:
      "Advocacy is about helping ideas travel from conversations into real change. It often begins with noticing something unfair, confusing, or broken — and deciding to help people understand the issue and work together toward better solutions.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Advocacy & Civic Action",
    hook: "Helping voices become movements.",
    summary:
      "Communities change when people learn how to raise awareness, organize support, and communicate ideas clearly. Advocacy can involve research, storytelling, community organizing, and conversations with decision-makers.",
    whyItPullsYouIn: [
      "You pay attention to issues that affect people around you.",
      "You enjoy discussing ideas and helping others understand them.",
      "You feel motivated when people work together to improve systems.",
    ],
  },

  traitChips: [
    { id: "voice", label: "Strong voice" },
    { id: "curious", label: "Curious about systems" },
    { id: "people-energy", label: "People energy" },
  ],

  fitSignals: [
    {
      id: "question-systems",
      label: "You question how systems work",
      score: 4,
      explanation:
        "You often ask why things are structured the way they are and imagine better ways.",
    },
    {
      id: "speak-up",
      label: "You are comfortable speaking up",
      score: 4,
      explanation:
        "You are willing to express ideas or concerns when something feels important.",
    },
    {
      id: "organize-ideas",
      label: "You organize ideas clearly",
      score: 5,
      explanation:
        "You enjoy helping people understand complex topics or issues.",
    },
  ],

  branchPreviews: [
    {
      id: "community-advocacy",
      slug: "community-advocacy",
      title: "Community Advocacy",
      oneLiner: "Helping communities organize around local issues.",
      whyItCouldFit:
        "Local advocacy often begins with people who help others understand problems and coordinate responses.",
      energy: "people",
    },
    {
      id: "policy-awareness",
      slug: "policy-awareness",
      title: "Policy Awareness",
      oneLiner: "Understanding and explaining how decisions are made.",
      whyItCouldFit:
        "Policies shape communities, and people who can explain them clearly help others stay informed.",
      energy: "reflective",
    },
  ],

  branches: [
    {
      id: "community-advocacy",
      slug: "community-advocacy",
      title: "Community Advocacy",
      summary:
        "Advocacy often begins locally — helping neighbors understand an issue and organize around possible solutions.",
      whatYouActuallyDo: [
        "Research community issues",
        "Organize discussions or meetings",
        "Communicate ideas through writing or speaking",
      ],
      skillsThatGrowHere: [
        "Communication",
        "Research",
        "Community organizing",
      ],
      starterProjects: [
        "Create a small awareness campaign",
        "Host a conversation about a local issue",
        "Write a short article or post explaining a topic",
      ],
      atmosphere:
        "Collaborative, thoughtful, and focused on helping people understand and act.",
    },
    {
      id: "policy-awareness",
      slug: "policy-awareness",
      title: "Policy Awareness",
      summary:
        "Many people want to understand how civic decisions are made and how communities can participate.",
      whatYouActuallyDo: [
        "Study how policies affect communities",
        "Explain civic processes in clear language",
        "Encourage participation in community discussions",
      ],
      skillsThatGrowHere: [
        "Critical thinking",
        "Public communication",
        "Research",
      ],
      starterProjects: [
        "Explain a policy issue in simple terms",
        "Attend a local public meeting",
        "Interview someone involved in community decision-making",
      ],
      atmosphere:
        "Reflective, analytical, and focused on understanding how systems shape everyday life.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Advocacy begins by helping people understand issues and start conversations.",
    actions: [
      {
        id: "issue-explainer",
        title: "Create an Issue Explainer",
        type: "research",
        effort: "light",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Clear explanations help more people understand and participate in discussions.",
        instructions: [
          "Choose a local issue you care about.",
          "Research basic facts from reliable sources.",
          "Write or record a short explanation.",
          "Share it with friends or classmates.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Advocacy combines curiosity, conversation, and the energy of people learning together.",
    moments: [
      {
        id: "discovering-issue",
        title: "Discovering an Issue",
        body:
          "You start learning about a topic and realize many people around you are curious too.",
      },
      {
        id: "conversation-spreads",
        title: "Conversations Grow",
        body:
          "Your explanation sparks discussions and people begin sharing ideas and perspectives.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Advocacy skills develop through research, communication, and real conversations.",
    stages: [
      {
        id: "early-learning",
        label: "Early Learning",
        timeframe: "Weeks–Months",
        summary:
          "You explore issues, read about them, and discuss ideas with others.",
        signalsOfProgress: [
          "You understand multiple perspectives on an issue",
          "You explain ideas clearly to others",
        ],
      },
      {
        id: "community-engagement",
        label: "Community Engagement",
        timeframe: "Months–Years",
        summary:
          "You participate in larger discussions and help organize conversations around issues.",
        signalsOfProgress: [
          "People seek your explanations or insights",
          "You help coordinate discussions or events",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next Steps",
    summary:
      "Advocacy often grows through collaboration with organizations and community groups.",
    actions: [
      {
        id: "attend-community-meeting",
        title: "Attend a Community Meeting",
        type: "visit",
        effort: "light",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Public meetings help people understand how communities discuss and decide issues.",
        instructions: [
          "Search for a local town or school meeting.",
          "Attend and observe how discussions happen.",
          "Write down questions or ideas afterward.",
        ],
      },
    ],
    opportunityGroups: [],
  },
};