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
      id: "near-you",
      title: "Near you (real environments)",
      description:
        "Places where environmental science becomes physical and immediate.",
      items: [
        {
          id: "state-parks",
          title: "California State Parks",
          provider: "State Parks",
          summary:
            "Explore forests, coastlines, wetlands, and real ecosystems.",
          whyItFits:
            "Direct exposure to ecosystems — not theory.",
          mode: "local",
          href: "https://www.parks.ca.gov/",
        },
        {
          id: "marin-headlands",
          title: "Marin Headlands Field Exploration",
          provider: "Golden Gate National Parks",
          summary:
            "Coastal ecosystems, wildlife, and geology in one place.",
          whyItFits:
            "High-density learning environment outdoors.",
          mode: "local",
          href: "https://www.nps.gov/goga/marin-headlands.htm",
        },
        {
          id: "point-reyes",
          title: "Point Reyes National Seashore",
          provider: "National Park Service",
          summary:
            "Wildlife, migration patterns, and coastal ecosystems.",
          whyItFits:
            "You see real environmental systems in motion.",
          mode: "local",
          href: "https://www.nps.gov/pore/index.htm",
        },
        {
          id: "audubon",
          title: "Audubon Canyon Ranch",
          provider: "Audubon Society",
          summary:
            "Bird conservation, habitats, and field science programs.",
          whyItFits:
            "Guided real-world environmental observation.",
          mode: "local",
          href: "https://egret.org/",
        },
        {
          id: "cleanup",
          title: "Bay Area Coastal Cleanup",
          provider: "California Coastal Commission",
          summary:
            "Participate in real environmental restoration efforts.",
          whyItFits:
            "You connect learning with real impact.",
          mode: "local",
          href: "https://www.coastal.ca.gov/publiced/ccd/ccd.html",
        },
      ],
    },

    {
      id: "online",
      title: "Online (build understanding fast)",
      description:
        "Use these to understand what you're seeing in the real world.",
      items: [
        {
          id: "khan-ecology",
          title: "Khan Academy Ecology",
          provider: "Khan Academy",
          summary:
            "Core ecosystem and environmental science concepts.",
          whyItFits:
            "Gives structure to what you observe outside.",
          mode: "virtual",
          href: "https://www.khanacademy.org/science/ap-biology/ecology-ap",
        },
        {
          id: "natgeo",
          title: "National Geographic",
          provider: "National Geographic",
          summary:
            "Real-world environmental science stories and visuals.",
          whyItFits:
            "Connects science to exploration and discovery.",
          mode: "virtual",
          href: "https://www.nationalgeographic.com/environment",
        },
        {
          id: "nasa-climate",
          title: "NASA Climate Science",
          provider: "NASA",
          summary:
            "Understand climate systems and global environmental data.",
          whyItFits:
            "Big-picture systems thinking.",
          mode: "virtual",
          href: "https://climate.nasa.gov/",
        },
        {
          id: "coursera-env",
          title: "Intro to Environmental Science",
          provider: "Coursera",
          summary:
            "Structured courses on ecosystems and sustainability.",
          whyItFits:
            "Deeper learning once you're hooked.",
          mode: "virtual",
          href: "https://www.coursera.org/courses?query=environmental%20science",
        },
        {
          id: "citizen-science",
          title: "iNaturalist",
          provider: "Citizen Science",
          summary:
            "Log real observations of plants and animals worldwide.",
          whyItFits:
            "Turns observation into real scientific contribution.",
          mode: "virtual",
          href: "https://www.inaturalist.org/",
        },
      ],
    },
  ],
};