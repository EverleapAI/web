// apps/web/src/app/(app)/main/explore/learning/_data/mock/environmentFieldSciencePath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const ENVIRONMENT_FIELD_SCIENCE_PATH: LearningPathContent = {
  id: "environment-field-science",
  slug: "environment-field-science",
  lane: "learning",

  theme: {
    tone: "earth-systems",
    accent: { r: 140, g: 205, b: 120 },
    accentStrong: { r: 95, g: 170, b: 210 },
    glow: { r: 160, g: 220, b: 150 },
    surfaceLabel: "Earth systems",
  },

  card: {
    title: "Environment + Field Science",
    hook: "Understand ecosystems, climate, and the living world outdoors.",
    description:
      "A learning path for people drawn to nature, ecosystems, climate science, wildlife, and outdoor exploration. It blends science, observation, and real-world environmental problem solving.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Environment + Field Science",
    hook: "For people curious about nature, ecosystems, and the planet.",
    summary:
      "Some people feel most curious outdoors — noticing patterns in weather, landscapes, animals, plants, or ecosystems. Environment + Field Science explores how the natural world works and how humans interact with it.",
    whyItPullsYouIn: [
      "You enjoy being outdoors and observing nature.",
      "You are curious about ecosystems and climate patterns.",
      "You like science connected to real environments.",
      "You care about environmental challenges and solutions.",
    ],
  },

  traitChips: [
    { id: "nature-curiosity", label: "Nature curiosity" },
    { id: "field-observer", label: "Field observer" },
    { id: "systems-thinking", label: "Systems thinking" },
    { id: "explorer", label: "Explorer energy" },
    { id: "climate-awareness", label: "Climate awareness" },
    { id: "science-outdoors", label: "Outdoor science" },
  ],

  fitSignals: [
    {
      id: "nature-observer",
      label: "You enjoy observing nature closely.",
      score: 94,
      explanation:
        "You naturally notice plants, animals, weather patterns, and environmental changes.",
    },
    {
      id: "ecosystem-curiosity",
      label: "You are curious about ecosystems.",
      score: 91,
      explanation:
        "You like understanding how living things interact with each other and their environment.",
    },
    {
      id: "climate-interest",
      label: "You are interested in climate and environmental systems.",
      score: 88,
      explanation:
        "You want to understand how natural systems change and adapt.",
    },
    {
      id: "outdoor-learning",
      label: "You enjoy learning through outdoor exploration.",
      score: 86,
      explanation:
        "Field observation and real environments make science more exciting.",
    },
  ],

  branchPreviews: [
    {
      id: "ecology",
      slug: "ecology",
      title: "Ecology",
      oneLiner: "Study how organisms interact with ecosystems.",
      whyItCouldFit:
        "Great if you enjoy observing plants, animals, and natural habitats.",
      energy: "exploration",
    },
    {
      id: "climate-science",
      slug: "climate-science",
      title: "Climate Science",
      oneLiner: "Understand weather patterns, climate systems, and global change.",
      whyItCouldFit:
        "Good for people curious about Earth's changing climate.",
      energy: "analysis",
    },
    {
      id: "conservation",
      slug: "conservation",
      title: "Conservation",
      oneLiner: "Protect ecosystems, wildlife, and natural resources.",
      whyItCouldFit:
        "Strong for people who care about preserving natural environments.",
      energy: "people",
    },
    {
      id: "field-research",
      slug: "field-research",
      title: "Field Research",
      oneLiner: "Study ecosystems through direct observation and investigation.",
      whyItCouldFit:
        "Ideal if you enjoy collecting data outdoors.",
      energy: "exploration",
    },
  ],

  branches: [
    {
      id: "ecology",
      slug: "ecology",
      title: "Ecology",
      summary:
        "Ecology focuses on how organisms interact with each other and their environments.",
      whatYouActuallyExplore: [
        "Food webs and ecosystems",
        "Species interactions",
        "Habitat dynamics",
      ],
      skillsThatGrowHere: [
        "Observation",
        "Environmental science basics",
        "Systems thinking",
        "Field documentation",
      ],
      starterProjects: [
        "Observe plant and insect interactions in a park",
        "Map a local ecosystem",
        "Track seasonal changes in nature",
      ],
      atmosphere:
        "Curious, exploratory, and outdoors-focused.",
    },
    {
      id: "climate-science",
      slug: "climate-science",
      title: "Climate Science",
      summary:
        "Climate science explores how weather systems and global climate patterns function.",
      whatYouActuallyExplore: [
        "Weather systems",
        "Climate data patterns",
        "Global environmental change",
      ],
      skillsThatGrowHere: [
        "Data interpretation",
        "Environmental analysis",
        "Scientific research",
        "Systems thinking",
      ],
      starterProjects: [
        "Track local weather trends",
        "Study climate change impacts in your region",
        "Analyze climate data online",
      ],
      atmosphere:
        "Analytical and global in perspective.",
    },
    {
      id: "conservation",
      slug: "conservation",
      title: "Conservation",
      summary:
        "Conservation focuses on protecting ecosystems, wildlife, and natural resources.",
      whatYouActuallyExplore: [
        "Habitat preservation",
        "Wildlife protection",
        "Environmental stewardship",
      ],
      skillsThatGrowHere: [
        "Environmental awareness",
        "Community engagement",
        "Ecological knowledge",
        "Practical conservation",
      ],
      starterProjects: [
        "Participate in a habitat restoration project",
        "Research endangered species",
        "Organize a local cleanup",
      ],
      atmosphere:
        "Purposeful and nature-focused.",
    },
    {
      id: "field-research",
      slug: "field-research",
      title: "Field Research",
      summary:
        "Field research involves studying ecosystems through direct observation and data collection.",
      whatYouActuallyExplore: [
        "Data collection in natural environments",
        "Scientific field methods",
        "Ecosystem monitoring",
      ],
      skillsThatGrowHere: [
        "Field observation",
        "Scientific documentation",
        "Research design",
        "Environmental measurement",
      ],
      starterProjects: [
        "Collect data on local biodiversity",
        "Document plant species in a park",
        "Track environmental conditions over time",
      ],
      atmosphere:
        "Exploratory and investigative.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to explore environmental science is to observe real ecosystems and ask questions about them.",
    actions: [
      {
        id: "nature-observation",
        title: "Observe a small ecosystem",
        type: "experiment",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "Observation is the foundation of field science.",
        instructions: [
          "Visit a park or natural area.",
          "Observe plants, animals, and environmental conditions.",
          "Write down patterns you notice.",
        ],
      },
      {
        id: "weather-log",
        title: "Track weather patterns for a week",
        type: "project",
        effort: "medium",
        timeEstimate: "7 days",
        whyThisMatters:
          "Weather tracking helps reveal climate patterns.",
        instructions: [
          "Record temperature and weather conditions daily.",
          "Look for patterns across the week.",
        ],
      },
      {
        id: "research-ecosystem",
        title: "Research a local ecosystem",
        type: "read",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "Understanding ecosystems deepens environmental awareness.",
        instructions: [
          "Choose a local habitat like forest or coastline.",
          "Research key species and interactions.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "Environmental science often feels like discovering hidden connections in nature.",
    moments: [
      {
        id: "nature-patterns",
        title: "You start noticing patterns in nature",
        body:
          "Weather, plants, animals, and ecosystems begin to feel interconnected.",
      },
      {
        id: "ecosystem-awareness",
        title: "You see ecosystems as systems",
        body:
          "Nature begins to look like a complex network of interactions.",
      },
      {
        id: "environmental-responsibility",
        title: "You feel more connected to environmental responsibility",
        body:
          "Understanding ecosystems often strengthens your desire to protect them.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Environmental learning often starts with curiosity about nature and grows into scientific understanding.",
    stages: [
      {
        id: "observation",
        label: "Observe nature",
        timeframe: "First weeks",
        summary:
          "You start paying attention to environmental patterns.",
        signalsOfProgress: [
          "You notice ecological patterns",
          "You ask questions about ecosystems",
        ],
      },
      {
        id: "learning",
        label: "Learn environmental science",
        timeframe: "Next months",
        summary:
          "You develop knowledge of ecosystems and environmental systems.",
        signalsOfProgress: [
          "You understand key ecological concepts",
          "You read environmental science materials",
        ],
      },
      {
        id: "action",
        label: "Apply knowledge in real contexts",
        timeframe: "Later exploration",
        summary:
          "You begin applying environmental knowledge to conservation or research projects.",
        signalsOfProgress: [
          "You participate in environmental projects",
          "You connect science to real environmental challenges",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Next steps",
    summary:
      "Environmental learning grows through observation, exploration, and scientific curiosity.",
    actions: [
      {
        id: "nature-journal",
        title: "Start a nature observation journal",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "10 min per observation",
        whyThisMatters:
          "Recording observations strengthens environmental awareness.",
        instructions: [
          "Write down what you observe outdoors.",
          "Track patterns in weather, plants, or animals.",
        ],
      },
      {
        id: "eco-learning",
        title: "Explore an online environmental science course",
        type: "join",
        effort: "medium",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Structured learning deepens scientific understanding.",
        instructions: [
          "Choose a beginner environmental science course.",
          "Explore the first lessons.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "online-environment",
        title: "Online places to explore environmental science",
        description:
          "These resources introduce environmental science and ecology.",
        items: [
          {
            id: "khan-ecology",
            title: "Khan Academy Ecology",
            mode: "virtual",
            provider: "Khan Academy",
            summary:
              "Lessons explaining ecological systems and environmental science.",
            whyItHelps:
              "Accessible introduction to environmental science concepts.",
            href: "https://www.khanacademy.org/science/ap-biology/ecology-ap",
            formatLabel: "Self-paced lessons",
          },
          {
            id: "natgeo-learning",
            title: "National Geographic Learning",
            mode: "virtual",
            provider: "National Geographic",
            summary:
              "Educational resources about ecosystems and exploration.",
            whyItHelps:
              "Connects environmental science with real-world exploration.",
            formatLabel: "Articles and videos",
          },
        ],
      },
    ],
  },
};