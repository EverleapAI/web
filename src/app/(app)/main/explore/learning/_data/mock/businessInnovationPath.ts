// apps/web/src/app/(app)/main/explore/learning/_data/mock/businessInnovationPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const BUSINESS_INNOVATION_PATH: LearningPathContent = {
  id: "business-innovation",
  slug: "business-innovation",
  lane: "learning",

  theme: {
    tone: "builder-energy",
    accent: { r: 255, g: 188, b: 92 },
    accentStrong: { r: 255, g: 132, b: 82 },
    glow: { r: 255, g: 170, b: 120 },
    surfaceLabel: "Builder mindset",
  },

  card: {
    title: "Business + Innovation",
    hook: "Turn ideas into real things people actually use.",
    description:
      "A path for people who like building, experimenting, solving problems, and creating value in the real world.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Business + Innovation",
    hook: "For people who think in ideas — and want to make them real.",
    summary:
      "This path is about building. Not just thinking, not just planning — actually testing ideas, launching projects, and seeing what works.",
    whyItPullsYouIn: [
      "You constantly think about improvements or new ideas.",
      "You like building projects, not just talking about them.",
      "You notice how systems or businesses could work better.",
      "You enjoy solving real problems.",
    ],
  },

  traitChips: [
    { id: "idea-generator", label: "Idea generator" },
    { id: "builder-mindset", label: "Builder mindset" },
    { id: "problem-solver", label: "Problem solver" },
    { id: "initiative", label: "Initiative" },
  ],

  fitSignals: [
    {
      id: "spot-opportunities",
      label: "You notice opportunities to improve things",
      score: 94,
      explanation:
        "You naturally see how things could work better.",
    },
    {
      id: "build-energy",
      label: "You like building and launching ideas",
      score: 90,
      explanation:
        "Ideas feel exciting when they become real.",
    },
    {
      id: "value-thinking",
      label: "You think about what people actually need",
      score: 88,
      explanation:
        "You notice when something solves a real problem.",
    },
  ],

  whatYouLearn: [
    {
      id: "idea-to-reality",
      title: "How ideas become real",
      description:
        "Turning concepts into projects, products, or services.",
    },
    {
      id: "testing",
      title: "How to test ideas quickly",
      description:
        "Prototypes, experiments, and feedback loops.",
    },
    {
      id: "value",
      title: "What creates real value",
      description:
        "Understanding what people actually want or need.",
    },
    {
      id: "iteration",
      title: "How to improve through iteration",
      description:
        "Learning fast, adjusting, and trying again.",
    },
    {
      id: "execution",
      title: "How to execute, not just plan",
      description:
        "Moving from thinking → building → launching.",
    },
  ],

  featuredOpportunity: {
    title: "Launch something small this week",
    provider: "Self-directed",
    summary:
      "Take one idea and turn it into something real — even if it's tiny.",
    whyStartHere:
      "This path only makes sense when you actually build something.",
    mode: "hybrid",
    formatLabel: "Real-world experiment",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      title: "Try this this week",
      description:
        "Fast ways to test whether building and innovation actually clicks for you.",
      items: [
        {
          id: "idea-list",
          title: "Generate 10 real-world problem ideas",
          provider: "Self-directed",
          summary:
            "Look for everyday problems and imagine solutions.",
          whyItFits:
            "Innovation starts by noticing what is broken or inefficient.",
          mode: "local",
          formatLabel: "Observation + ideation",
          tags: ["beginner-friendly"],
        },
        {
          id: "mini-project",
          title: "Launch a tiny project",
          provider: "Self-directed",
          summary:
            "Create something simple and share it with others.",
          whyItFits:
            "Execution teaches more than thinking.",
          mode: "hybrid",
          formatLabel: "Build + test",
          tags: ["hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real skill",
      description:
        "Ways to go deeper and learn how ideas actually become real.",
      items: [
        {
          id: "startup-school",
          title: "Y Combinator Startup School",
          provider: "Y Combinator",
          summary:
            "Free startup education from real founders.",
          whyItFits:
            "Shows how real ideas turn into real companies.",
          mode: "virtual",
          href: "https://www.startupschool.org",
          formatLabel: "Structured startup learning",
          tags: ["structured", "free"],
        },
        {
          id: "coursera-innovation",
          title: "Innovation + entrepreneurship courses",
          provider: "Coursera",
          summary:
            "Intro courses on building ideas and businesses.",
          whyItFits:
            "Gives frameworks for testing and improving ideas.",
          mode: "virtual",
          formatLabel: "Structured learning",
          tags: ["structured"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real environments where ideas turn into action.",
      items: [
        {
          id: "student-projects",
          title: "School projects or clubs",
          provider: "Schools",
          summary:
            "Create and lead real initiatives with peers.",
          whyItFits:
            "Best place to practice building with others.",
          mode: "local",
          locationLabel: "Marin / North Bay",
          tags: ["local", "hands-on"],
        },
        {
          id: "hackathons",
          title: "Bay Area hackathons",
          provider: "Various orgs",
          summary:
            "Short events where you build something quickly.",
          whyItFits:
            "Fastest way to experience real innovation cycles.",
          mode: "hybrid",
          locationLabel: "Bay Area",
          tags: ["hands-on"],
        },
        {
          id: "community-project",
          title: "Start a local initiative",
          provider: "Self-directed",
          summary:
            "Solve a small problem in your community.",
          whyItFits:
            "Real-world impact makes learning stick.",
          mode: "local",
          locationLabel: "Near 94901",
          tags: ["local"],
        },
      ],
    },
  ],
};