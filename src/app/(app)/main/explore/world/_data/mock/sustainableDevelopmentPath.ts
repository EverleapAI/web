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
      "This is about improving life without breaking the systems life depends on — cities, water, energy, housing, and how communities evolve.",
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
        "You care about whether systems hold up over time, not just short-term fixes.",
    },
    {
      id: "systems-connection",
      label: "You connect environment, people, and infrastructure",
      score: 88,
      explanation:
        "You see how housing, energy, water, and access are linked.",
    },
    {
      id: "real-world-impact",
      label: "You want ideas to improve real places",
      score: 85,
      explanation:
        "You prefer solutions that are tangible and visible.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How places are designed — and redesigned",
    intro:
      "This path starts when you stop seeing a place as fixed and start seeing it as a system shaped by decisions.",
    items: [
      {
        title: "How cities function",
        description:
          "How transport, housing, water, and public space shape daily life.",
      },
      {
        title: "Where systems break",
        description:
          "How growth, climate, and inequality stress infrastructure.",
      },
      {
        title: "Tradeoffs in design",
        description:
          "Why improving one system often impacts another.",
      },
      {
        title: "Building better systems",
        description:
          "How design, planning, and policy improve outcomes.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Analyze your city using Strong Towns",
    description:
      "Start seeing how your city actually works — and where it breaks — using real urban analysis and examples.",
    href: "https://www.strongtowns.org",
    ctaLabel: "Start exploring cities",
    mode: "virtual",
    type: "research",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "Start seeing systems clearly — not just noticing them.",
      opportunities: [
        {
          title: "Map your neighborhood using Google Maps + notes",
          description:
            "Track movement, access, density, and how people actually use space.",
          href: "https://www.google.com/maps",
          ctaLabel: "Start mapping",
          mode: "local",
          type: "project",
        },
        {
          title: "Use ArcGIS to explore real urban data",
          description:
            "Look at real mapping tools used by planners and analysts.",
          href: "https://www.arcgis.com",
          ctaLabel: "Explore ArcGIS",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Watch Not Just Bikes (urban systems)",
          description:
            "Understand how city design impacts real life through clear examples.",
          href: "https://www.youtube.com/c/NotJustBikes",
          ctaLabel: "Watch breakdowns",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Compare two cities solving the same problem",
          description:
            "Look at how different places approach housing, transit, or climate.",
          href: "https://ourworldindata.org",
          ctaLabel: "Compare data",
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
          title: "Walk your city with a systems lens",
          description:
            "Notice flow, bottlenecks, inefficiencies, and what works well.",
          href: "https://www.google.com/maps",
          ctaLabel: "Pick a route",
          mode: "local",
          type: "visit",
        },
        {
          title: "Attend a planning or zoning meeting",
          description:
            "See how decisions about housing, transit, and land use are made.",
          href: "https://www.eventbrite.com",
          ctaLabel: "Find meetings",
          mode: "local",
          type: "event",
        },
        {
          title: "Visit a transit hub or development area",
          description:
            "Observe how infrastructure shapes movement and behavior.",
          href: "https://www.google.com/maps",
          ctaLabel: "Explore locations",
          mode: "local",
          type: "visit",
        },
      ],
    },

    {
      id: "go-broader",
      label: "Go broader",
      title: "Step into bigger systems",
      description:
        "Move from observation into structured understanding.",
      opportunities: [
        {
          title: "edX sustainability and urban planning courses",
          description:
            "Learn how systems are designed and improved at scale.",
          href: "https://www.edx.org",
          ctaLabel: "Explore courses",
          mode: "virtual",
          type: "program",
        },
        {
          title: "UN Habitat",
          description:
            "Explore global work on cities, housing, and sustainable development.",
          href: "https://unhabitat.org",
          ctaLabel: "Explore UN Habitat",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "World Bank development projects",
          description:
            "See real infrastructure and development projects worldwide.",
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
            "Explore global development, infrastructure, and quality of life.",
          href: "https://ourworldindata.org",
          ctaLabel: "Explore data",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "UN Sustainable Development Goals",
          description:
            "See how global priorities connect environment and systems.",
          href: "https://sdgs.un.org/goals",
          ctaLabel: "Explore goals",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "CityLab / Bloomberg",
          description:
            "Stories about how cities are evolving and solving problems.",
          href: "https://www.bloomberg.com/citylab",
          ctaLabel: "Read CityLab",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};