// apps/web/src/app/(app)/main/explore/world/_data/mock/globalCulturesPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const GLOBAL_CULTURES_PATH: WorldPathContent = {
  id: "global-cultures",
  slug: "global-cultures",
  lane: "world",

  theme: {
    tone: "global-perspective",
    accent: { r: 255, g: 148, b: 64 },
    accentStrong: { r: 255, g: 178, b: 102 },
    glow: { r: 255, g: 128, b: 52 },
    surfaceLabel: "Global curiosity",
  },

  card: {
    title: "Global Cultures",
    hook: "Understand how people live, think, and organize life across the world.",
    description:
      "Some people feel pulled to understand cultures, languages, traditions, and the ways societies organize themselves. This direction explores the human story across borders.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Global Cultures",
    hook: "For people curious about how different societies see the world.",
    summary:
      "Every culture solves the problems of life differently — family, work, celebration, conflict, meaning. Exploring cultures helps you see your own world more clearly while understanding others more deeply.",
    whyItPullsYouIn: [
      "You are curious how people live in other countries.",
      "You enjoy learning about traditions and social norms.",
      "You like understanding different perspectives.",
      "You feel energized by travel and cultural exchange.",
    ],
  },

  traitChips: [
    { id: "curious", label: "Curious about people" },
    { id: "global-mindset", label: "Global mindset" },
    { id: "observer", label: "Observer of culture" },
    { id: "story-listener", label: "Story listener" },
  ],

  fitSignals: [
    {
      id: "culture-curiosity",
      label: "You are curious about how people live in other places",
      score: 90,
      explanation:
        "You often find yourself wondering what life is like in other parts of the world.",
    },
    {
      id: "perspective-interest",
      label: "You enjoy understanding different perspectives",
      score: 86,
      explanation:
        "You are interested in how people think differently depending on where they grew up.",
    },
    {
      id: "travel-energy",
      label: "Travel and exploration sound exciting",
      score: 82,
      explanation:
        "Experiencing new environments and cultures feels energizing to you.",
    },
  ],

  branchPreviews: [
    {
      id: "cultural-anthropology",
      slug: "cultural-anthropology",
      title: "Cultural Anthropology",
      oneLiner: "Study how societies organize life and meaning.",
      whyItCouldFit:
        "Great if you enjoy studying traditions, rituals, and cultural systems.",
      energy: "reflective",
    },
    {
      id: "language-exploration",
      slug: "language-exploration",
      title: "Language Exploration",
      oneLiner: "Explore the world through language and communication.",
      whyItCouldFit:
        "Perfect for people fascinated by language and cross-cultural communication.",
      energy: "people",
    },
    {
      id: "global-travel",
      slug: "global-travel",
      title: "Global Exploration",
      oneLiner: "Experience cultures directly through travel and immersion.",
      whyItCouldFit:
        "For people energized by travel and discovering new environments.",
      energy: "adventure",
    },
  ],

  branches: [
    {
      id: "cultural-anthropology",
      slug: "cultural-anthropology",
      title: "Cultural Anthropology",
      summary:
        "This branch explores how people build meaning, traditions, rules, rituals, and identity across different cultures.",
      whatYouActuallyExplore: [
        "Customs, rituals, and daily life across societies",
        "How communities define belonging and identity",
        "How culture shapes behavior, values, and meaning",
      ],
      skillsThatGrowHere: [
        "Observation",
        "Cultural analysis",
        "Perspective taking",
        "Pattern recognition",
      ],
      starterProjects: [
        "Compare one daily ritual across three cultures",
        "Interview someone about family traditions",
        "Create a short visual explainer about one cultural practice",
      ],
      atmosphere:
        "Reflective, human-centered, and full of perspective shifts.",
    },
    {
      id: "language-exploration",
      slug: "language-exploration",
      title: "Language Exploration",
      summary:
        "This branch focuses on language as a doorway into culture, identity, and connection.",
      whatYouActuallyExplore: [
        "How language reflects culture and worldview",
        "Basic language learning and cross-cultural communication",
        "How translation changes tone, meaning, and context",
      ],
      skillsThatGrowHere: [
        "Listening",
        "Communication",
        "Language awareness",
        "Cross-cultural empathy",
      ],
      starterProjects: [
        "Learn 20 phrases in a language new to you",
        "Compare how one idea is expressed in different languages",
        "Create a simple guide to cultural greetings around the world",
      ],
      atmosphere:
        "Curious, connective, and surprisingly personal.",
    },
    {
      id: "global-travel",
      slug: "global-travel",
      title: "Global Exploration",
      summary:
        "This branch is about experiencing the world directly through place, movement, and immersion.",
      whatYouActuallyExplore: [
        "How geography shapes daily life",
        "Travel as cultural learning, not just tourism",
        "What changes when you are the outsider in a new place",
      ],
      skillsThatGrowHere: [
        "Adaptability",
        "Navigation",
        "Cultural awareness",
        "Confidence in new environments",
      ],
      starterProjects: [
        "Plan a one-week cultural trip to a country that interests you",
        "Build a map-based guide to one city you want to explore",
        "Compare daily life in your town with one city abroad",
      ],
      atmosphere:
        "Expansive, energizing, and full of discovery.",
    },
  ],

  tryNow: {
    title: "Try exploring cultures now",
    summary:
      "You do not need a plane ticket to begin exploring other cultures.",
    actions: [
      {
        id: "international-food",
        title: "Cook a dish from another culture",
        type: "experiment",
        effort: "light",
        timeEstimate: "60 min",
        whyThisMatters:
          "Food is one of the fastest ways to understand culture.",
        instructions: [
          "Choose a country you are curious about.",
          "Find a traditional recipe.",
          "Cook it and learn the story behind the dish.",
        ],
      },
      {
        id: "language-video",
        title: "Watch media from another country",
        type: "experiment",
        effort: "light",
        timeEstimate: "45 min",
        whyThisMatters:
          "Media shows how people think and communicate in daily life.",
        instructions: [
          "Pick a country.",
          "Watch a short documentary or creator from that place.",
          "Notice how life feels similar or different.",
        ],
      },
      {
        id: "cultural-comparison",
        title: "Compare one daily habit across cultures",
        type: "project",
        effort: "medium",
        timeEstimate: "45–75 min",
        whyThisMatters:
          "Comparing one everyday habit helps you see culture as something lived, not abstract.",
        instructions: [
          "Pick one topic like school, meals, greetings, or family life.",
          "Research how it works in three countries.",
          "Write or design a quick comparison you can share.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What exploring cultures feels like",
    summary:
      "You start noticing how many ways there are to live a human life.",
    moments: [
      {
        id: "perspective-shift",
        title: "Your perspective expands",
        body:
          "You begin seeing your own culture as just one version of many.",
      },
      {
        id: "human-connection",
        title: "You see similarities everywhere",
        body:
          "Even with real differences, you start recognizing shared human experiences.",
      },
      {
        id: "curiosity-deepens",
        title: "The world starts feeling bigger",
        body:
          "One country, one custom, or one conversation can open ten more questions.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this direction",
    summary:
      "Understanding cultures usually grows through curiosity, comparison, and real exposure.",
    stages: [
      {
        id: "curiosity",
        label: "Start noticing the wider world",
        timeframe: "First few weeks",
        summary:
          "You begin exploring different cultures through videos, books, music, food, and conversations.",
        signalsOfProgress: [
          "You follow global stories more closely",
          "You become curious about customs and daily life",
        ],
      },
      {
        id: "comparison",
        label: "Compare perspectives",
        timeframe: "1–3 months",
        summary:
          "You begin seeing patterns and differences in how societies think and live.",
        signalsOfProgress: [
          "You ask better questions about culture",
          "You start noticing your own assumptions more clearly",
        ],
      },
      {
        id: "immersion",
        label: "Move toward real-world exposure",
        timeframe: "After repeated exploration",
        summary:
          "You look for deeper experiences through travel, exchange, language, or community connection.",
        signalsOfProgress: [
          "You seek out direct contact with other cultures",
          "You feel more confident entering unfamiliar spaces",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Go deeper into global exploration",
    summary:
      "The next layer is moving from curiosity into real cultural contact, language, travel, and global learning.",
    actions: [
      {
        id: "local-cultural-event",
        title: "Go to a local cultural event",
        type: "visit",
        effort: "light",
        timeEstimate: "2–3 hours",
        whyThisMatters:
          "The fastest way to make this interest real is to step into a community space.",
        instructions: [
          "Look for a cultural festival, museum program, or community event nearby.",
          "Go with a few questions in mind.",
          "Write down what surprised you afterward.",
        ],
      },
      {
        id: "start-language",
        title: "Start learning one language",
        type: "project",
        effort: "medium",
        timeEstimate: "2 weeks",
        whyThisMatters:
          "Language changes how you hear culture, not just how you communicate.",
        instructions: [
          "Pick one language that connects to your curiosity.",
          "Use a beginner app or video series for 10–15 minutes a day.",
          "Track phrases, sounds, and cultural notes that stand out.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "global-learning",
        title: "Ways to explore cultures",
        description:
          "Programs and resources that introduce you to global perspectives.",
        items: [
          {
            id: "national-geographic",
            title: "National Geographic",
            mode: "virtual",
            provider: "National Geographic",
            summary: "Stories and documentaries about cultures worldwide.",
            whyItHelps:
              "Provides vivid exposure to global cultures and environments.",
            href: "https://www.nationalgeographic.com",
            formatLabel: "Articles and documentaries",
          },
          {
            id: "smithsonian-cultural-resources",
            title: "Smithsonian cultural resources",
            mode: "virtual",
            provider: "Smithsonian",
            summary:
              "Museum-based stories, exhibits, and learning resources about people and cultures.",
            whyItHelps:
              "Gives you a strong starting point for exploring cultures through real artifacts and stories.",
            href: "https://www.si.edu",
            formatLabel: "Digital exhibits",
          },
        ],
      },
    ],
  },
};