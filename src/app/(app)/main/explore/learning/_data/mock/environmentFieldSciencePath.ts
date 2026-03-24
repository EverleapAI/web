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
      "A learning path for people drawn to nature, ecosystems, climate, wildlife, and real-world environmental problem solving.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Environment + Field Science",
    hook: "For people who learn best by being outside and paying attention.",
    summary:
      "This path starts outside. You observe patterns in nature, ask questions, and slowly build understanding of ecosystems, climate, and how everything connects.",
    whyItPullsYouIn: [
      "You enjoy being outdoors and observing nature.",
      "You notice patterns in weather, plants, or animals.",
      "You like science connected to real environments.",
      "You care about environmental challenges and solutions.",
    ],
  },

  traitChips: [
    { id: "nature-curiosity", label: "Nature curiosity" },
    { id: "field-observer", label: "Field observer" },
    { id: "systems-thinking", label: "Systems thinking" },
    { id: "explorer", label: "Explorer energy" },
  ],

  fitSignals: [
    {
      id: "observe-nature",
      label: "You naturally observe nature closely",
      score: 94,
      explanation:
        "You notice patterns in plants, animals, and environments.",
    },
    {
      id: "ecosystem-thinking",
      label: "You think about how systems connect",
      score: 91,
      explanation:
        "You see relationships between living things and environments.",
    },
    {
      id: "outdoor-learning",
      label: "You learn best through real environments",
      score: 88,
      explanation:
        "Being outside makes ideas more real and interesting.",
    },
  ],

  whatYouLearn: [
    {
      id: "ecosystems",
      title: "How ecosystems actually work",
      description:
        "Food webs, habitats, and how living things interact.",
    },
    {
      id: "climate",
      title: "How climate and weather systems behave",
      description:
        "Patterns, changes, and environmental forces over time.",
    },
    {
      id: "field-skills",
      title: "How to observe and document nature",
      description:
        "Field notes, pattern recognition, and data collection.",
    },
    {
      id: "human-impact",
      title: "How humans affect environments",
      description:
        "Conservation, sustainability, and environmental change.",
    },
    {
      id: "real-world-science",
      title: "How science connects to real environments",
      description:
        "Turning observation into understanding and action.",
    },
  ],

  featuredOpportunity: {
    title: "Use your environment as your classroom",
    provider: "Real world",
    summary:
      "Pick a local outdoor space and observe it like a scientist.",
    whyStartHere:
      "This path only makes sense when you are actually in the environment.",
    mode: "local",
    formatLabel: "Outdoor observation",
    locationLabel: "Near 94901",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      title: "Try this this week",
      description:
        "Simple ways to test if this path feels real to you.",
      items: [
        {
          id: "ecosystem-observation",
          title: "Observe a local ecosystem",
          provider: "Self-directed",
          summary:
            "Spend time in a park, trail, or coastline observing patterns.",
          whyItFits:
            "You will quickly feel whether this kind of learning clicks.",
          mode: "local",
          locationLabel: "Near 94901",
          formatLabel: "Field observation",
          tags: ["beginner-friendly", "hands-on", "local"],
        },
        {
          id: "weather-tracking",
          title: "Track weather patterns for a week",
          provider: "Self-directed",
          summary:
            "Record daily weather and look for patterns.",
          whyItFits:
            "Builds awareness of environmental systems quickly.",
          mode: "local",
          formatLabel: "Daily tracking",
          tags: ["hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real understanding",
      description:
        "Ways to deepen your knowledge of environmental systems.",
      items: [
        {
          id: "khan-ecology",
          title: "Khan Academy Ecology",
          provider: "Khan Academy",
          summary:
            "Learn core concepts of ecosystems and environmental science.",
          whyItFits:
            "Gives structure to what you observe in real life.",
          mode: "virtual",
          href: "https://www.khanacademy.org/science/ap-biology/ecology-ap",
          formatLabel: "Self-paced learning",
          tags: ["free", "structured"],
        },
        {
          id: "natgeo",
          title: "National Geographic Learning",
          provider: "National Geographic",
          summary:
            "Explore real-world environmental science and ecosystems.",
          whyItFits:
            "Connects science to real exploration and discovery.",
          mode: "virtual",
          formatLabel: "Articles + video",
          tags: ["self-paced"],
        },
      ],
    },

    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real environments where environmental science comes alive.",
      items: [
        {
          id: "state-parks",
          title: "California State Parks exploration",
          provider: "California State Parks",
          summary:
            "Explore ecosystems like forests, coastlines, and wetlands.",
          whyItFits:
            "You experience ecosystems directly instead of reading about them.",
          mode: "local",
          locationLabel: "Marin / North Bay",
          tags: ["local", "hands-on"],
        },
        {
          id: "conservation",
          title: "Local conservation or cleanup projects",
          provider: "Community orgs",
          summary:
            "Participate in real environmental efforts.",
          whyItFits:
            "Connects knowledge to real-world impact.",
          mode: "local",
          locationLabel: "Near 94901",
          tags: ["local"],
        },
        {
          id: "nature-groups",
          title: "Nature or environmental groups",
          provider: "Local organizations",
          summary:
            "Join guided outdoor learning or citizen science.",
          whyItFits:
            "Learn faster with others who share the same curiosity.",
          mode: "local",
          locationLabel: "Bay Area",
          tags: ["local", "hands-on"],
        },
      ],
    },
  ],
};