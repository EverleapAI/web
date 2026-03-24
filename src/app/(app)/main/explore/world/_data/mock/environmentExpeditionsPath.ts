// apps/web/src/app/(app)/main/explore/world/_data/mock/environmentExpeditionsPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const ENVIRONMENT_EXPEDITIONS_PATH: WorldPathContent = {
  id: "environment-expeditions",
  slug: "environment-expeditions",

  energy: "adventure",

  theme: {
    accent: "rgba(74,190,150,1)",
    accentStrong: "rgba(112,214,176,1)",
    glow: "rgba(46,164,126,0.35)",
    surfaceLabel: "Field discovery",
  },

  card: {
    title: "Environment + Expeditions",
    hook:
      "Step into real places and understand how the planet actually works.",
    description:
      "This is for people who feel most awake outside — exploring landscapes, asking questions, and wanting to understand the systems shaping the world.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Environment + Expeditions",
    subtitle: "Go outside. Ask better questions.",
    body:
      "This isn’t just about loving nature — it’s about stepping into real places with curiosity. Why does this ecosystem work this way? What’s changing? How do water, soil, weather, plants, animals, and people all connect? This path turns exploration into discovery.",
    ambientLabel: "Field · Systems · Exploration",
    pullQuote:
      "The more time you spend in a place, the more it starts telling you how it works.",
  },

  traitChips: [
    { label: "Outdoor energy" },
    { label: "Field observer" },
    { label: "Earth curious" },
    { label: "Systems thinker" },
    { label: "Question driven" },
  ],

  fitSignals: [
    {
      id: "outside-learning",
      label: "You learn better when it’s real and physical",
      score: 92,
      explanation:
        "You’re drawn to learning through movement, observation, and being outside — not just reading.",
    },
    {
      id: "ecosystem-curiosity",
      label: "You wonder how nature actually works",
      score: 89,
      explanation:
        "You’re curious how weather, water, plants, animals, and land connect.",
    },
    {
      id: "exploration-drive",
      label: "You like discovery with a purpose",
      score: 85,
      explanation:
        "Exploring is more exciting when it leads to understanding something real.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How real places work as living systems",
    intro:
      "This path starts when you stop seeing nature as scenery and start seeing it as a system full of signals.",
    items: [
      {
        title: "Ecosystems in motion",
        description:
          "How plants, animals, water, and soil interact — and how those relationships change over time.",
      },
      {
        title: "Climate and environmental change",
        description:
          "What’s shifting in real places — from drought to wildfire to habitat loss — and why.",
      },
      {
        title: "Field observation",
        description:
          "How to notice patterns, track changes, and ask better questions about what you’re seeing.",
      },
      {
        title: "Humans inside the system",
        description:
          "How people shape environments — and how environments shape people in return.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Go outside with one question",
    description:
      "Pick a place and observe it like a system — not just a location.",
    href: "https://www.inaturalist.org",
    ctaLabel: "Start observing",
    mode: "hybrid",
    type: "project",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "You don’t need special gear. Just go outside and start noticing.",
      opportunities: [
        {
          title: "Create a one-day field journal",
          description:
            "Go to a park, trail, or shoreline and record what you actually observe.",
          href: "https://www.inaturalist.org",
          ctaLabel: "Use iNaturalist",
          mode: "hybrid",
          type: "project",
        },
        {
          title: "Track one small ecosystem",
          description:
            "Pick one spot and revisit it to notice patterns over time.",
          href: "https://www.nps.gov",
          ctaLabel: "Explore local parks",
          mode: "local",
          type: "research",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "Step into real environments",
      description:
        "The best learning happens in actual places, not just online.",
      opportunities: [
        {
          title: "Visit a nature center or preserve",
          description:
            "Walk through an ecosystem with more awareness of what’s happening.",
          href: "https://www.nps.gov",
          ctaLabel: "Find a site",
          mode: "local",
          type: "visit",
          locationLabel: "Near you",
        },
        {
          title: "Join a local restoration or cleanup effort",
          description:
            "Work directly on a landscape and see how human action changes environments.",
          href: "https://www.volunteermatch.org",
          ctaLabel: "Find opportunities",
          mode: "local",
          type: "volunteer",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Go further into the field",
      description:
        "When you’re ready, step into bigger environments and deeper experiences.",
      opportunities: [
        {
          title: "Field science or outdoor education programs",
          description:
            "Spend time learning directly in forests, coasts, or wild landscapes.",
          href: "https://www.outwardbound.org",
          ctaLabel: "Explore programs",
          mode: "travel",
          type: "program",
        },
        {
          title: "Environmental expedition experiences",
          description:
            "Travel to ecosystems and study them with guides or researchers.",
          href: "https://www.nationalgeographic.com/expeditions",
          ctaLabel: "View expeditions",
          mode: "travel",
          type: "expedition",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Keep a window into the natural world",
      description:
        "Stay connected to real environmental systems and discoveries.",
      opportunities: [
        {
          title: "iNaturalist",
          description:
            "Document plants and animals and learn from real observations.",
          href: "https://www.inaturalist.org",
          ctaLabel: "Start observing",
          mode: "hybrid",
          type: "resource",
        },
        {
          title: "National Park Service",
          description:
            "Explore ecosystems, maps, and real-world environmental knowledge.",
          href: "https://www.nps.gov",
          ctaLabel: "Explore parks",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};