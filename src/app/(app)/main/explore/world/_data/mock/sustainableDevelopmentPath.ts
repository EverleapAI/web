// apps/web/src/app/(app)/main/explore/world/_data/mock/sustainableDevelopmentPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const SUSTAINABLE_DEVELOPMENT_PATH: WorldPathContent = {
  id: "sustainable-development",
  slug: "sustainable-development",

  energy: "builder",

  theme: {
    accent: "rgba(208,180,82,1)",
    accentStrong: "rgba(228,202,112,1)",
    glow: "rgba(184,154,52,0.35)",
    surfaceLabel: "Future building",
  },

  card: {
    title: "Sustainable Development",
    hook:
      "Understand how places grow, adapt, and actually work long term.",
    description:
      "This is about improving life without breaking the systems life depends on — cities, water, energy, housing, and the way communities evolve over time.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Sustainable Development",
    subtitle: "Build things that actually last.",
    body:
      "Every place is shaped by decisions — where people live, how they move, how resources are used, and what gets prioritized. Sustainable development is about seeing those systems clearly and asking: does this actually work long term? And if not, what would?",
    ambientLabel: "Systems · Places · Future",
    pullQuote:
      "A place isn’t just built — it’s designed through thousands of decisions over time.",
  },

  traitChips: [
    { label: "Future minded" },
    { label: "Systems builder" },
    { label: "Community aware" },
    { label: "Practical idealist" },
    { label: "Big picture thinker" },
  ],

  fitSignals: [
    {
      id: "long-term-thinking",
      label: "You think about whether things actually last",
      score: 91,
      explanation:
        "You care about whether systems hold up over time, not just whether they work today.",
    },
    {
      id: "systems-connection",
      label: "You connect environment, people, and infrastructure",
      score: 88,
      explanation:
        "You naturally see that housing, water, energy, and access are all linked.",
    },
    {
      id: "real-world-impact",
      label: "You want ideas to improve real places",
      score: 85,
      explanation:
        "You’re drawn to solutions that feel tangible, not abstract.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How places are designed — and redesigned",
    intro:
      "This path starts when you stop seeing a place as fixed and start seeing it as something shaped by decisions.",
    items: [
      {
        title: "How cities and communities function",
        description:
          "How transportation, housing, water, and public space shape daily life.",
      },
      {
        title: "Where systems break or strain",
        description:
          "How growth, climate, and inequality create pressure on infrastructure.",
      },
      {
        title: "Tradeoffs in real decisions",
        description:
          "Why improving one part of a system often affects something else.",
      },
      {
        title: "Designing better outcomes",
        description:
          "How planning, policy, and design can improve how places work.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Look at your own area like a system",
    description:
      "Start where you are — notice how your town or city actually works.",
    href: "https://www.google.com/maps",
    ctaLabel: "Explore your area",
    mode: "local",
    type: "research",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "You can start seeing systems immediately — no special tools needed.",
      opportunities: [
        {
          title: "Map one local system",
          description:
            "Pick transportation, housing, parks, or water and trace how it works.",
          href: "https://www.google.com/maps",
          ctaLabel: "Start mapping",
          mode: "local",
          type: "project",
        },
        {
          title: "Compare two places solving the same problem",
          description:
            "Look at how two cities handle transit, housing, or climate differently.",
          href: "https://ourworldindata.org",
          ctaLabel: "Explore comparisons",
          mode: "virtual",
          type: "research",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "See systems in real life",
      description:
        "Places become clearer when you observe how people actually use them.",
      opportunities: [
        {
          title: "Walk a neighborhood with a systems lens",
          description:
            "Notice movement, access, space use, and what feels efficient or broken.",
          href: "https://www.google.com/maps",
          ctaLabel: "Pick a route",
          mode: "local",
          type: "visit",
          locationLabel: "Near you",
        },
        {
          title: "Attend a local planning or community meeting",
          description:
            "Hear how decisions about housing, transit, or land use are made.",
          href: "https://www.eventbrite.com",
          ctaLabel: "Find events",
          mode: "local",
          type: "event",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Step into bigger systems",
      description:
        "See how development works across regions and countries.",
      opportunities: [
        {
          title: "Urban planning or sustainability programs",
          description:
            "Learn how cities and systems are designed at a larger scale.",
          href: "https://www.edx.org",
          ctaLabel: "Explore programs",
          mode: "virtual",
          type: "program",
        },
        {
          title: "Global development initiatives",
          description:
            "Explore projects focused on infrastructure, water, housing, and resilience.",
          href: "https://www.worldbank.org",
          ctaLabel: "Explore projects",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Keep a systems view of the world",
      description:
        "Stay connected to how places evolve and adapt.",
      opportunities: [
        {
          title: "Our World in Data",
          description:
            "Explore global data on development, infrastructure, and quality of life.",
          href: "https://ourworldindata.org",
          ctaLabel: "Explore data",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "UN Sustainable Development Goals",
          description:
            "See how global priorities connect environment, people, and systems.",
          href: "https://sdgs.un.org/goals",
          ctaLabel: "Explore goals",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};