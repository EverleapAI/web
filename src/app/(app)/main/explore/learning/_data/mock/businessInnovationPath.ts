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
      "A learning path for people drawn to building projects, launching ideas, solving problems, and figuring out how value gets created in the real world.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Business + Innovation",
    hook: "For people who like turning ideas into reality.",
    summary:
      "Some people constantly think about improvements — better systems, better tools, new ideas, smarter ways to solve problems. Business + Innovation is about learning how ideas become real products, services, companies, or initiatives that help people.",
    whyItPullsYouIn: [
      "You constantly think about improvements or new ideas.",
      "You like creating projects or solving real problems.",
      "You notice how businesses or organizations operate.",
      "You enjoy figuring out how something could work better.",
    ],
  },

  traitChips: [
    { id: "idea-generator", label: "Idea generator" },
    { id: "builder-mindset", label: "Builder mindset" },
    { id: "problem-solver", label: "Problem solver" },
    { id: "initiative", label: "Initiative" },
    { id: "curiosity-business", label: "Business curiosity" },
    { id: "risk-tolerance", label: "Risk tolerance" },
  ],

  fitSignals: [
    {
      id: "spot-opportunities",
      label: "You notice opportunities to improve things.",
      score: 94,
      explanation:
        "You often think about how systems, products, or processes could work better.",
    },
    {
      id: "project-energy",
      label: "You like starting projects.",
      score: 90,
      explanation:
        "Ideas feel exciting when you can actually build something from them.",
    },
    {
      id: "value-thinking",
      label: "You think about what people need.",
      score: 88,
      explanation:
        "You notice when something solves a real problem or creates value.",
    },
    {
      id: "adaptability",
      label: "You enjoy experimenting and adjusting.",
      score: 86,
      explanation:
        "Trying ideas, learning quickly, and iterating feels natural to you.",
    },
  ],

  branchPreviews: [
    {
      id: "entrepreneurship",
      slug: "entrepreneurship",
      title: "Entrepreneurship",
      oneLiner: "Launch projects, ideas, or businesses.",
      whyItCouldFit:
        "Great if you want to build something from scratch and see if people value it.",
      energy: "builder",
    },
    {
      id: "product-design",
      slug: "product-design",
      title: "Product + Service Design",
      oneLiner: "Create tools, products, and services people love.",
      whyItCouldFit:
        "Strong if you enjoy designing solutions and improving user experiences.",
      energy: "creative",
    },
    {
      id: "strategy",
      slug: "strategy",
      title: "Strategy + Problem Solving",
      oneLiner: "Understand systems, decisions, and business models.",
      whyItCouldFit:
        "Good for analytical thinkers interested in how organizations succeed.",
      energy: "analysis",
    },
    {
      id: "innovation-projects",
      slug: "innovation-projects",
      title: "Innovation Projects",
      oneLiner: "Experiment with new ideas and prototype solutions.",
      whyItCouldFit:
        "Great if you like building experiments and learning quickly.",
      energy: "exploration",
    },
  ],

  branches: [
    {
      id: "entrepreneurship",
      slug: "entrepreneurship",
      title: "Entrepreneurship",
      summary:
        "Entrepreneurship focuses on creating ideas that turn into real projects or businesses.",
      whatYouActuallyExplore: [
        "How ideas become products or services",
        "How businesses solve real problems",
        "How founders test and improve ideas",
      ],
      skillsThatGrowHere: [
        "Idea validation",
        "Project launching",
        "Customer awareness",
        "Adaptability",
      ],
      starterProjects: [
        "Launch a small online project",
        "Create a service for your community",
        "Prototype a simple business idea",
      ],
      atmosphere:
        "Creative, energetic, and experimental.",
    },
    {
      id: "product-design",
      slug: "product-design",
      title: "Product + Service Design",
      summary:
        "Product design focuses on building tools or experiences that help people accomplish something.",
      whatYouActuallyExplore: [
        "User needs and behavior",
        "How design affects usability",
        "How products evolve through feedback",
      ],
      skillsThatGrowHere: [
        "Design thinking",
        "User empathy",
        "Iteration",
        "Prototyping",
      ],
      starterProjects: [
        "Design a tool that solves a small daily problem",
        "Improve an existing product concept",
        "Prototype a digital service idea",
      ],
      atmosphere:
        "Creative and user-focused.",
    },
    {
      id: "strategy",
      slug: "strategy",
      title: "Strategy + Problem Solving",
      summary:
        "Strategy explores how organizations make decisions, allocate resources, and compete.",
      whatYouActuallyExplore: [
        "How businesses make decisions",
        "How strategy shapes outcomes",
        "How organizations adapt to change",
      ],
      skillsThatGrowHere: [
        "Analytical thinking",
        "Decision frameworks",
        "Systems thinking",
        "Research",
      ],
      starterProjects: [
        "Analyze how a company succeeds",
        "Study a failed product launch",
        "Map a simple business model",
      ],
      atmosphere:
        "Analytical and thoughtful.",
    },
    {
      id: "innovation-projects",
      slug: "innovation-projects",
      title: "Innovation Projects",
      summary:
        "Innovation projects focus on experimenting with ideas quickly and learning from real feedback.",
      whatYouActuallyExplore: [
        "Rapid prototyping",
        "Idea testing",
        "Creative experimentation",
      ],
      skillsThatGrowHere: [
        "Experimentation",
        "Creative problem solving",
        "Iteration",
        "Adaptability",
      ],
      starterProjects: [
        "Build a simple prototype",
        "Run a quick product experiment",
        "Test an idea with real users",
      ],
      atmosphere:
        "Fast-moving and creative.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to explore business and innovation is to build something small and see how people respond.",
    actions: [
      {
        id: "idea-list",
        title: "Write down 10 ideas for solving everyday problems",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20 minutes",
        whyThisMatters:
          "Innovation starts by noticing problems and imagining solutions.",
        instructions: [
          "Look at daily annoyances or inefficiencies.",
          "Write down potential improvements or tools.",
          "Choose one idea to explore further.",
        ],
      },
      {
        id: "mini-project",
        title: "Launch a small experimental project",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Real learning happens when ideas become real experiments.",
        instructions: [
          "Choose one simple idea.",
          "Build the simplest possible version.",
          "Ask people for feedback.",
        ],
      },
      {
        id: "business-study",
        title: "Study how a real company works",
        type: "read",
        effort: "light",
        timeEstimate: "30 minutes",
        whyThisMatters:
          "Understanding real businesses helps connect ideas to reality.",
        instructions: [
          "Pick a company you find interesting.",
          "Research how they make money.",
          "Write down what makes them successful.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "Business and innovation learning often feels like experimentation. You try ideas, learn quickly, adjust, and try again.",
    moments: [
      {
        id: "idea-energy",
        title: "Ideas start appearing everywhere",
        body:
          "You begin noticing opportunities to improve systems or create solutions.",
      },
      {
        id: "experiment-mindset",
        title: "You start thinking in experiments",
        body:
          "Instead of wondering if an idea works, you test it quickly.",
      },
      {
        id: "value-realization",
        title: "You understand what creates value",
        body:
          "You start recognizing why certain products or services succeed.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Innovation growth usually moves from ideas to experiments and eventually to real projects.",
    stages: [
      {
        id: "curiosity",
        label: "Idea curiosity",
        timeframe: "First weeks",
        summary:
          "You start noticing problems and imagining potential solutions.",
        signalsOfProgress: [
          "You generate new ideas regularly",
          "You see improvement opportunities everywhere",
        ],
      },
      {
        id: "experimentation",
        label: "Experiment with ideas",
        timeframe: "Next months",
        summary:
          "You start testing ideas and learning from feedback.",
        signalsOfProgress: [
          "You build simple prototypes",
          "You learn quickly from experiments",
        ],
      },
      {
        id: "creation",
        label: "Build real projects",
        timeframe: "Later exploration",
        summary:
          "You launch projects or initiatives that create value.",
        signalsOfProgress: [
          "You manage projects from idea to execution",
          "You understand the basics of value creation",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next steps",
    summary:
      "Innovation grows through building, testing ideas, and learning from real results.",
    actions: [
      {
        id: "idea-journal",
        title: "Start an idea notebook",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "5–10 minutes per idea",
        whyThisMatters:
          "Recording ideas strengthens your creative thinking.",
        instructions: [
          "Write down ideas whenever they appear.",
          "Return later and evaluate which ones have potential.",
        ],
      },
      {
        id: "small-launch",
        title: "Launch a simple project online",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Execution is the fastest way to learn business skills.",
        instructions: [
          "Create a small product or service idea.",
          "Share it with real people.",
          "Learn from their feedback.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "online-business-learning",
        title: "Online places to explore business",
        description:
          "These resources help introduce innovation and entrepreneurship concepts.",
        items: [
          {
            id: "startup-school",
            title: "Y Combinator Startup School",
            mode: "virtual",
            provider: "Y Combinator",
            summary:
              "Free startup education from experienced founders.",
            whyItHelps:
              "Teaches how startups test ideas and build products.",
            href: "https://www.startupschool.org",
            formatLabel: "Online startup course",
          },
          {
            id: "coursera-innovation",
            title: "Innovation and entrepreneurship courses",
            mode: "virtual",
            provider: "Coursera",
            summary:
              "Intro courses on entrepreneurship and innovation.",
            whyItHelps:
              "Provides structured knowledge on building projects.",
            formatLabel: "Structured online learning",
          },
        ],
      },
    ],
  },
};