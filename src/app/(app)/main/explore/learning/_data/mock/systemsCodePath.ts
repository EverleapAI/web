// apps/web/src/app/(app)/main/explore/learning/_data/mock/systemsCodePath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const SYSTEMS_CODE_PATH: LearningPathContent = {
  id: "systems-code",
  slug: "systems-code",
  lane: "learning",

  theme: {
    tone: "signal-forge",
    accent: { r: 86, g: 190, b: 255 },
    accentStrong: { r: 118, g: 122, b: 255 },
    glow: { r: 116, g: 96, b: 255 },
    surfaceLabel: "Signal forge",
  },

  card: {
    title: "Systems + Code",
    hook: "Learn how things work — then make them work better.",
    description:
      "A learning path for people drawn to logic, tools, debugging, automation, robotics, and building useful things.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Systems + Code",
    hook: "For minds that like structure, curiosity, and making ideas actually run.",
    summary:
      "This path is less about memorizing code and more about understanding systems, fixing what breaks, and building tools that actually do something.",
    whyItPullsYouIn: [
      "You like figuring out why something failed.",
      "You enjoy building step by step until it works.",
      "You want to make tools, not just use them.",
      "You notice inefficiency and want to fix it.",
    ],
  },

  traitChips: [
    { id: "pattern-spotting", label: "Pattern spotting" },
    { id: "debug-mindset", label: "Debug mindset" },
    { id: "builder-energy", label: "Builder energy" },
    { id: "logic-creativity", label: "Logic + creativity" },
  ],

  fitSignals: [
    {
      id: "how-things-work",
      label: "You like understanding how things actually work.",
      score: 95,
      explanation:
        "You want to understand the structure underneath tools and systems.",
    },
    {
      id: "fix-systems",
      label: "You want to fix broken or inefficient systems.",
      score: 91,
      explanation:
        "You notice friction and instinctively want to improve it.",
    },
    {
      id: "build-step-by-step",
      label: "You can build patiently, one piece at a time.",
      score: 88,
      explanation:
        "You are willing to stay with something until it works.",
    },
  ],

  whatYouLearn: [
    {
      id: "logic",
      title: "How systems actually work",
      description:
        "Inputs, outputs, flow, and how different parts connect.",
    },
    {
      id: "debugging",
      title: "How to debug and fix problems",
      description:
        "Reading errors, testing ideas, and isolating issues.",
    },
    {
      id: "building",
      title: "How to build real tools",
      description:
        "Turning ideas into working projects people can actually use.",
    },
    {
      id: "automation",
      title: "How to automate repetitive work",
      description:
        "Reducing friction by turning manual steps into systems.",
    },
    {
      id: "projects",
      title: "How to think in projects",
      description:
        "Breaking ideas into manageable builds you can actually finish.",
    },
  ],

  featuredOpportunity: {
    title: "Start building instantly with Replit",
    provider: "Replit",
    summary:
      "A browser-based coding environment where you can start building immediately.",
    whyStartHere:
      "No setup, no friction — you can go from idea to working project in minutes.",
    href: "https://replit.com",
    mode: "virtual",
    formatLabel: "Browser-based coding",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      title: "Try this this week",
      description:
        "Fast, low-friction ways to see if this actually clicks for you.",
      items: [
        {
          id: "khan-cs",
          title: "Khan Academy Programming",
          provider: "Khan Academy",
          summary: "Interactive beginner-friendly coding lessons.",
          whyItFits:
            "Great for getting early wins and confidence quickly.",
          mode: "virtual",
          href: "https://www.khanacademy.org/computing/computer-programming",
          formatLabel: "Interactive lessons",
          tags: ["beginner-friendly", "free", "self-paced"],
        },
        {
          id: "freecodecamp",
          title: "freeCodeCamp",
          provider: "freeCodeCamp",
          summary: "Hands-on coding curriculum with real projects.",
          whyItFits:
            "Keeps you moving by building instead of just reading.",
          mode: "virtual",
          href: "https://www.freecodecamp.org",
          formatLabel: "Projects + lessons",
          tags: ["structured", "free", "portfolio-building"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real skill",
      description:
        "More structured paths that help you go deeper and stay consistent.",
      items: [
        {
          id: "replit",
          title: "Replit",
          provider: "Replit",
          summary:
            "Build apps, tools, and experiments directly in your browser.",
          whyItFits:
            "Best for turning ideas into working builds quickly.",
          mode: "virtual",
          href: "https://replit.com",
          formatLabel: "Browser-based coding",
          tags: ["hands-on", "portfolio-building"],
        },
        {
          id: "arduino",
          title: "Arduino / micro:bit projects",
          provider: "Open-source ecosystem",
          summary:
            "Build code that interacts with real-world devices.",
          whyItFits:
            "Perfect if you want code to do something physical.",
          mode: "hybrid",
          formatLabel: "Hardware + code",
          tags: ["hands-on", "structured"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Ways to make this real in your actual environment.",
      items: [
        {
          id: "library",
          title: "Library maker programs",
          provider: "Marin libraries",
          summary:
            "Community workshops, coding sessions, or maker kits.",
          whyItFits:
            "Low barrier, local, and easy to try without commitment.",
          mode: "local",
          locationLabel: "Near 94901",
          formatLabel: "Workshops",
          tags: ["local", "beginner-friendly"],
        },
        {
          id: "clubs",
          title: "School coding or robotics clubs",
          provider: "Local schools",
          summary: "Build projects with other students.",
          whyItFits:
            "Learning sticks better when you're building with others.",
          mode: "local",
          locationLabel: "Marin / North Bay",
          tags: ["local", "hands-on"],
        },
        {
          id: "hackathons",
          title: "Bay Area hackathons",
          provider: "Various orgs",
          summary:
            "Short build events where you create something fast.",
          whyItFits:
            "Great for momentum and real-world experience.",
          mode: "hybrid",
          locationLabel: "Bay Area",
          tags: ["hybrid", "portfolio-building"],
        },
      ],
    },
  ],
};