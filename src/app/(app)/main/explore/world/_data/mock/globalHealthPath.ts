import type { WorldPathContent } from "../worldPathSchema";

export const GLOBAL_HEALTH_PATH: WorldPathContent = {
  id: "global-health",
  slug: "global-health",
  lane: "world",

  theme: {
    tone: "human-wellbeing",
    accent: { r: 92, g: 205, b: 158 },
    accentStrong: { r: 134, g: 228, b: 186 },
    glow: { r: 64, g: 182, b: 134 },
    surfaceLabel: "Human wellbeing",
  },

  card: {
    title: "Global Health",
    hook: "Understand how health, medicine, and environment shape human life.",
    description:
      "Some people are drawn to understanding why health outcomes differ around the world and how medicine, public health, science, and community action can improve lives.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Global Health",
    hook: "For people who care about improving human health across borders.",
    summary:
      "Health is shaped by science, environment, policy, infrastructure, culture, and economics. Global health explores how communities around the world prevent disease, improve care, and build healthier systems.",
    whyItPullsYouIn: [
      "You care about helping people live healthier lives.",
      "You are curious how healthcare works in different countries.",
      "You want to understand disease, prevention, and health systems.",
      "You are interested in science that directly helps communities.",
    ],
  },

  traitChips: [
    { id: "human-focus", label: "Human-centered" },
    { id: "science-curious", label: "Science curious" },
    { id: "problem-solver", label: "Problem solver" },
    { id: "community-minded", label: "Community minded" },
  ],

  fitSignals: [
    {
      id: "care-about-health",
      label: "You care about improving people's wellbeing",
      score: 92,
      explanation:
        "You feel motivated by the idea of helping people live healthier lives.",
    },
    {
      id: "science-health",
      label: "You are curious about science and medicine",
      score: 86,
      explanation:
        "You enjoy learning how the body works and how diseases are prevented or treated.",
    },
    {
      id: "global-problems",
      label: "You care about large human challenges",
      score: 84,
      explanation:
        "You are interested in solving problems that affect communities around the world.",
    },
  ],

  branchPreviews: [
    {
      id: "public-health",
      slug: "public-health",
      title: "Public Health",
      oneLiner: "Prevent disease and improve community health.",
      whyItCouldFit:
        "Great if you care about prevention, education, and health systems.",
      energy: "people",
    },
    {
      id: "medical-science",
      slug: "medical-science",
      title: "Medical Science",
      oneLiner: "Study the biology and science behind health and disease.",
      whyItCouldFit:
        "Perfect for people interested in medicine, biology, and research.",
      energy: "grounded",
    },
    {
      id: "health-systems",
      slug: "health-systems",
      title: "Health Systems",
      oneLiner: "Understand how healthcare systems operate and improve.",
      whyItCouldFit:
        "Good for people who like solving complex social systems problems.",
      energy: "builder",
    },
  ],

  branches: [
    {
      id: "public-health",
      slug: "public-health",
      title: "Public Health",
      summary:
        "Public health focuses on preventing disease and improving health across entire communities.",
      whatYouActuallyExplore: [
        "How diseases spread and are prevented",
        "Health education and community outreach",
        "Environmental and social health factors",
      ],
      skillsThatGrowHere: [
        "Data interpretation",
        "Community communication",
        "Health awareness",
        "Preventive thinking",
      ],
      starterProjects: [
        "Research how vaccines reduce disease spread",
        "Create a simple health awareness poster",
        "Compare health statistics across countries",
      ],
      atmosphere: "Community-focused and impact-driven.",
    },
    {
      id: "medical-science",
      slug: "medical-science",
      title: "Medical Science",
      summary:
        "Medical science explores the biological foundations of disease, treatment, and medical innovation.",
      whatYouActuallyExplore: [
        "Human biology and physiology",
        "Disease mechanisms",
        "Medical treatments and research",
      ],
      skillsThatGrowHere: [
        "Scientific thinking",
        "Research literacy",
        "Biology knowledge",
        "Evidence-based reasoning",
      ],
      starterProjects: [
        "Research how one disease affects the body",
        "Create a diagram explaining a body system",
        "Explore how a vaccine works",
      ],
      atmosphere: "Scientific, investigative, and intellectually curious.",
    },
    {
      id: "health-systems",
      slug: "health-systems",
      title: "Health Systems",
      summary:
        "Health systems study how hospitals, policies, funding, and organizations deliver care to populations.",
      whatYouActuallyExplore: [
        "How healthcare systems operate",
        "Global health policy and economics",
        "How access to care differs worldwide",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Policy understanding",
        "Research analysis",
        "Strategic thinking",
      ],
      starterProjects: [
        "Compare healthcare systems in two countries",
        "Map how hospitals coordinate care",
        "Research how insurance or funding models work",
      ],
      atmosphere: "Analytical, systemic, and problem-solving focused.",
    },
  ],

  tryNow: {
    title: "Try exploring global health",
    summary:
      "You can begin understanding global health challenges through small investigations.",
    actions: [
      {
        id: "disease-research",
        title: "Research one global disease",
        type: "project",
        effort: "light",
        timeEstimate: "45–60 min",
        whyThisMatters:
          "Understanding one disease helps you see how science and society interact.",
        instructions: [
          "Pick a disease that affects many people globally.",
          "Research how it spreads and how it is treated.",
          "Summarize what surprised you.",
        ],
      },
      {
        id: "health-comparison",
        title: "Compare health systems",
        type: "experiment",
        effort: "medium",
        timeEstimate: "60–90 min",
        whyThisMatters:
          "Health outcomes vary widely depending on policy and infrastructure.",
        instructions: [
          "Choose two countries.",
          "Compare life expectancy and healthcare access.",
          "Write a short explanation of differences.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this direction feels like",
    summary:
      "You begin seeing health as a complex system influenced by science, environment, and society.",
    moments: [
      {
        id: "systems-view",
        title: "Health becomes a system",
        body:
          "You start seeing how medicine, environment, and policy connect.",
      },
      {
        id: "human-impact",
        title: "The stakes feel real",
        body:
          "Understanding health problems often leads to thinking about real people and communities.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this direction",
    summary:
      "Global health often grows through science learning combined with real-world awareness.",
    stages: [
      {
        id: "awareness",
        label: "Understand global challenges",
        timeframe: "Early stage",
        summary:
          "You learn how health challenges vary across regions and populations.",
        signalsOfProgress: [
          "You follow health news and research",
          "You understand key global health terms",
        ],
      },
      {
        id: "study",
        label: "Study health science",
        timeframe: "Later stage",
        summary:
          "You begin learning deeper science and systems knowledge.",
        signalsOfProgress: [
          "You study biology or medicine topics",
          "You analyze health data or research",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Continue exploring global health",
    summary:
      "Real-world health understanding grows through science education and global awareness.",
    actions: [],
    opportunityGroups: [
      {
        id: "health-learning",
        title: "Global health learning resources",
        description:
          "Organizations and platforms that share global health knowledge.",
        items: [
          {
            id: "who-learning",
            title: "World Health Organization learning resources",
            mode: "virtual",
            provider: "WHO",
            summary: "Educational resources about global health challenges.",
            whyItHelps:
              "Provides authoritative information on global health topics.",
            href: "https://www.who.int",
            formatLabel: "Educational resources",
          },
        ],
      },
    ],
  },
};