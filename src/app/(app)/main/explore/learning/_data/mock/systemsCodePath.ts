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
      id: "build-skill",
      title: "Build real skill",
      description:
        "Online places to learn fast, practice for real, and start making working projects.",
      items: [
        {
          id: "khan-cs",
          title: "Khan Academy Programming",
          provider: "Khan Academy",
          summary:
            "Interactive beginner-friendly coding lessons that help you understand programming by doing it.",
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
          summary:
            "A hands-on coding curriculum with projects that push you to build instead of only reading.",
          whyItFits:
            "Keeps you moving by building instead of just studying theory.",
          mode: "virtual",
          href: "https://www.freecodecamp.org",
          formatLabel: "Projects + lessons",
          tags: ["structured", "free", "portfolio-building"],
        },
        {
          id: "replit",
          title: "Replit",
          provider: "Replit",
          summary:
            "Build apps, tools, games, and experiments directly in your browser with very little setup.",
          whyItFits:
            "Best for turning ideas into working builds quickly.",
          mode: "virtual",
          href: "https://replit.com",
          formatLabel: "Browser-based coding",
          tags: ["hands-on", "portfolio-building"],
        },
        {
          id: "scratch",
          title: "Scratch",
          provider: "MIT",
          summary:
            "A visual coding platform where you can make interactive projects, games, and animations.",
          whyItFits:
            "Strong if you like logic and creation but want a more visual on-ramp first.",
          mode: "virtual",
          href: "https://scratch.mit.edu",
          formatLabel: "Visual coding",
          tags: ["beginner-friendly", "free", "self-paced"],
        },
        {
          id: "arduino",
          title: "Arduino projects",
          provider: "Arduino",
          summary:
            "Learn how code interacts with sensors, lights, motors, and physical devices.",
          whyItFits:
            "Perfect if you want code to do something physical in the real world.",
          mode: "hybrid",
          href: "https://projecthub.arduino.cc",
          formatLabel: "Hardware + code",
          tags: ["hands-on", "structured"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real environments where code, robotics, and systems thinking become something you can actually build and test.",
      items: [
        {
          id: "library",
          title: "Library maker programs",
          provider: "Marin libraries",
          summary:
            "Look for community workshops, maker kits, coding sessions, and beginner-friendly technical activities.",
          whyItFits:
            "Low barrier, local, and easy to try without a huge commitment.",
          mode: "local",
          href: "https://marinlibrary.org",
          locationLabel: "Near 94901",
          formatLabel: "Workshops",
          tags: ["local", "beginner-friendly"],
        },
        {
          id: "clubs",
          title: "School coding or robotics clubs",
          provider: "Local schools",
          summary:
            "Find student groups where people build robots, apps, scripts, and small technical projects together.",
          whyItFits:
            "Learning sticks better when you are building with other people.",
          mode: "local",
          href: "https://www.google.com/search?q=Marin+County+coding+club+robotics+club",
          locationLabel: "Marin / North Bay",
          formatLabel: "Student build teams",
          tags: ["local", "hands-on"],
        },
        {
          id: "hackathons",
          title: "Bay Area hackathons",
          provider: "Eventbrite",
          summary:
            "Short build events where you create something fast, solve problems, and work through real constraints.",
          whyItFits:
            "Great for momentum and real-world experience.",
          mode: "hybrid",
          href: "https://www.eventbrite.com/d/ca--san-francisco/hackathon/",
          locationLabel: "Bay Area",
          formatLabel: "Build events",
          tags: ["hands-on", "portfolio-building"],
        },
        {
          id: "microbit",
          title: "micro:bit projects and clubs",
          provider: "micro:bit",
          summary:
            "Use beginner-friendly hardware to build projects that connect code to the physical world.",
          whyItFits:
            "A strong bridge between coding, systems thinking, and real devices.",
          mode: "hybrid",
          href: "https://microbit.org/projects/make-it-code-it/",
          locationLabel: "Local / home",
          formatLabel: "Physical computing",
          tags: ["hands-on", "beginner-friendly"],
        },
        {
          id: "makerspace-search",
          title: "Maker spaces near you",
          provider: "Local search",
          summary:
            "Find local build spaces where people work on robotics, electronics, fabrication, and technical projects.",
          whyItFits:
            "Useful if your brain works best when you can tinker, test, and build for real.",
          mode: "local",
          href: "https://www.google.com/search?q=maker+space+Marin+County",
          locationLabel: "Near 94901",
          formatLabel: "Hands-on exploration",
          tags: ["local", "hands-on"],
        },
      ],
    },
  ],
};