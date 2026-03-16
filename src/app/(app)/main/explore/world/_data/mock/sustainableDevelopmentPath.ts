// apps/web/src/app/(app)/main/explore/world/_data/mock/sustainableDevelopmentPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const SUSTAINABLE_DEVELOPMENT_PATH: WorldPathContent = {
  id: "sustainable-development",
  slug: "sustainable-development",
  lane: "world",

  theme: {
    tone: "future-building",
    accent: { r: 208, g: 180, b: 82 },
    accentStrong: { r: 228, g: 202, b: 112 },
    glow: { r: 184, g: 154, b: 52 },
    surfaceLabel: "Future building",
  },

  card: {
    title: "Sustainable Development",
    hook: "Explore how communities grow, adapt, and build a future that can actually last.",
    description:
      "Some people are drawn to the big question underneath everything: how do we improve life without wrecking the systems life depends on? This direction blends human wellbeing, infrastructure, environment, and long-term thinking.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Sustainable Development",
    hook: "For people who want progress to be real, human, and built to last.",
    summary:
      "Sustainable development is where big global questions collide: housing, energy, water, transportation, health, equity, climate, and growth. This path is for people who want to understand how places can become stronger, fairer, and more resilient over time.",
    whyItPullsYouIn: [
      "You care about improving life in a way that still works long term.",
      "You are interested in cities, infrastructure, environment, and human wellbeing together.",
      "You like problems that are practical, systemic, and connected to the future.",
      "You want ideas to turn into places, systems, and communities that function better.",
    ],
  },

  traitChips: [
    { id: "future-minded", label: "Future minded" },
    { id: "systems-builder", label: "Systems builder" },
    { id: "community-aware", label: "Community aware" },
    { id: "practical-idealism", label: "Practical idealism" },
    { id: "big-picture", label: "Big picture thinker" },
  ],

  fitSignals: [
    {
      id: "long-term-thinking",
      label: "You think about whether progress can actually last",
      score: 91,
      explanation:
        "You are not just interested in quick fixes. You want to know whether something is workable over time.",
    },
    {
      id: "systems-connection",
      label: "You naturally connect environment, people, and infrastructure",
      score: 88,
      explanation:
        "You tend to see that housing, transportation, health, water, energy, and climate are connected.",
    },
    {
      id: "practical-impact",
      label: "You like ideas that could improve real places",
      score: 85,
      explanation:
        "You are energized by solutions that feel concrete, useful, and bigger than one person.",
    },
  ],

  branchPreviews: [
    {
      id: "resilient-cities",
      slug: "resilient-cities",
      title: "Resilient Cities",
      oneLiner: "Study how cities can grow smarter, healthier, and more adaptable.",
      whyItCouldFit:
        "Great if you are curious about transportation, housing, design, and urban systems.",
      energy: "builder",
    },
    {
      id: "resource-systems",
      slug: "resource-systems",
      title: "Water + Energy Systems",
      oneLiner: "Explore the systems communities depend on every day.",
      whyItCouldFit:
        "Strong fit if you like infrastructure, environmental pressure, and practical problem-solving.",
      energy: "grounded",
    },
    {
      id: "community-development",
      slug: "community-development",
      title: "Community Development",
      oneLiner: "Focus on how people, policy, and place shape quality of life.",
      whyItCouldFit:
        "Good for people who care about fairness, access, and building stronger communities.",
      energy: "people",
    },
  ],

  branches: [
    {
      id: "resilient-cities",
      slug: "resilient-cities",
      title: "Resilient Cities",
      summary:
        "This branch looks at how cities handle growth, climate pressure, transportation, housing, and the everyday systems people rely on.",
      whatYouActuallyExplore: [
        "How cities plan for transportation, housing, and public space",
        "What makes communities more resilient to stress and change",
        "How urban design affects health, access, and daily life",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Urban awareness",
        "Planning literacy",
        "Tradeoff analysis",
      ],
      starterProjects: [
        "Map one part of your town through the lens of walkability or access",
        "Compare how two cities handle one issue like transit or housing",
        "Design a simple improvement idea for a local public space",
      ],
      atmosphere:
        "Practical, future-facing, and full of interconnected decisions.",
    },
    {
      id: "resource-systems",
      slug: "resource-systems",
      title: "Water + Energy Systems",
      summary:
        "This branch focuses on the core systems that keep communities functioning: water, power, infrastructure, and environmental resilience.",
      whatYouActuallyExplore: [
        "How water and energy systems work at a community scale",
        "Where strain, waste, and vulnerability show up",
        "How climate and growth affect basic infrastructure",
      ],
      skillsThatGrowHere: [
        "Infrastructure awareness",
        "Cause-and-effect reasoning",
        "Resource literacy",
        "Applied systems thinking",
      ],
      starterProjects: [
        "Trace where your local water or power comes from",
        "Research how drought or extreme heat affects one region",
        "Create a simple explainer on one key infrastructure system",
      ],
      atmosphere:
        "Grounded, real-world, and connected to how places actually function.",
    },
    {
      id: "community-development",
      slug: "community-development",
      title: "Community Development",
      summary:
        "This branch explores how communities become stronger through access, opportunity, planning, and long-term investment in people and place.",
      whatYouActuallyExplore: [
        "How policy and investment shape neighborhoods and towns",
        "What communities need to thrive over time",
        "Why access, equity, and local conditions matter",
      ],
      skillsThatGrowHere: [
        "Community analysis",
        "Policy awareness",
        "Human-centered thinking",
        "Problem framing",
      ],
      starterProjects: [
        "Research one challenge facing your local community",
        "Interview someone about how your town has changed over time",
        "Create a one-page idea for improving one community need",
      ],
      atmosphere:
        "Human-centered, constructive, and closely tied to real life.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way into this path is to look at one real place and ask how it could work better long term.",
    actions: [
      {
        id: "map-local-system",
        title: "Map one local system",
        type: "project",
        effort: "light",
        timeEstimate: "45–75 min",
        whyThisMatters:
          "Sustainable development starts when you stop seeing a place as random and start seeing the systems underneath it.",
        instructions: [
          "Pick one local system: transportation, water, parks, waste, housing, or energy.",
          "Write down how it seems to work now.",
          "List one pressure point and one idea for improvement.",
        ],
      },
      {
        id: "compare-two-places",
        title: "Compare how two places handle the same problem",
        type: "research",
        effort: "medium",
        timeEstimate: "60–90 min",
        whyThisMatters:
          "Comparing places helps you see that design and policy choices shape outcomes.",
        instructions: [
          "Choose one issue like drought, transit, housing, or public space.",
          "Compare how two cities or regions respond to it.",
          "Summarize what one seems to do better and why.",
        ],
      },
      {
        id: "future-neighborhood",
        title: "Design a more resilient neighborhood",
        type: "experiment",
        effort: "medium",
        timeEstimate: "60–90 min",
        whyThisMatters:
          "This path becomes more real when you imagine improvements that connect environment and daily life.",
        instructions: [
          "Pick a neighborhood you know.",
          "Think about heat, transit, green space, water, safety, or access.",
          "Sketch or describe three changes that would make it stronger long term.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "This path often feels like learning to see invisible systems. Places stop looking fixed and start looking designable.",
    moments: [
      {
        id: "systems-visible",
        title: "Places start revealing their systems",
        body:
          "A street, park, neighborhood, or utility network starts feeling like something shaped by choices, tradeoffs, and priorities.",
      },
      {
        id: "future-lens",
        title: "You begin thinking in future consequences",
        body:
          "You start asking not just whether something works now, but whether it will still work later.",
      },
      {
        id: "practical-hope",
        title: "Big problems start feeling more actionable",
        body:
          "Instead of only feeling overwhelmed, you begin spotting levers, improvements, and places where better design matters.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Growth usually starts with concern about the future, then becomes sharper through systems thinking, place-based analysis, and practical solution ideas.",
    stages: [
      {
        id: "notice",
        label: "Start seeing systems in real places",
        timeframe: "First few weeks",
        summary:
          "You begin noticing how transportation, housing, water, energy, and public space shape everyday life.",
        signalsOfProgress: [
          "You ask more specific questions about how places function",
          "You begin noticing infrastructure and access, not just scenery",
        ],
      },
      {
        id: "connect",
        label: "Connect people, place, and environment",
        timeframe: "1–3 months",
        summary:
          "You start linking environmental pressure, community needs, and built systems together.",
        signalsOfProgress: [
          "You can explain one local challenge through multiple systems at once",
          "You begin comparing solutions instead of just naming problems",
        ],
      },
      {
        id: "design",
        label: "Move toward practical solutions",
        timeframe: "After repeated exploration",
        summary:
          "You begin imagining how better planning, stronger systems, or different priorities could improve real places.",
        signalsOfProgress: [
          "You generate more concrete ideas for change",
          "You start seeing possible futures connected to planning, policy, or systems design",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Take the next step into sustainable development",
    summary:
      "This path gets stronger when you combine local observation, global examples, and real opportunities to study how communities function.",
    actions: [
      {
        id: "visit-infrastructure-site",
        title: "Visit a place where systems are visible",
        type: "visit",
        effort: "light",
        timeEstimate: "1–3 hours",
        whyThisMatters:
          "This path becomes real when you look at an actual place through the lens of design, access, and long-term resilience.",
        instructions: [
          "Visit a downtown area, transit hub, park system, shoreline, treatment site, or development area.",
          "Notice how people move, gather, access resources, and use space.",
          "Write down what seems strong, weak, or stressed.",
        ],
      },
      {
        id: "track-one-local-issue",
        title: "Track one local planning or environment issue",
        type: "research",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Following a real issue helps you see how development, politics, and community needs collide.",
        instructions: [
          "Choose one local issue like housing, transit, water, wildfire resilience, or land use.",
          "Follow it through local reporting or public information.",
          "Summarize the tradeoffs different people are arguing about.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "development-learning",
        title: "Places to go deeper",
        description:
          "These are strong starting points for understanding communities, infrastructure, resilience, and development at a bigger scale.",
        items: [
          {
            id: "world-bank-data",
            title: "World Bank data and explainers",
            mode: "virtual",
            provider: "World Bank",
            summary:
              "Explore global development indicators, maps, and issue explainers.",
            whyItHelps:
              "Useful for connecting local questions to larger global patterns in infrastructure, growth, and wellbeing.",
            href: "https://www.worldbank.org",
            formatLabel: "Data and issue resources",
          },
          {
            id: "un-sustainable-development",
            title: "UN Sustainable Development resources",
            mode: "virtual",
            provider: "United Nations",
            summary:
              "Learn how global development goals connect environment, health, equity, and economic systems.",
            whyItHelps:
              "Gives a broad framework for thinking about what communities need to thrive long term.",
            href: "https://sdgs.un.org/goals",
            formatLabel: "Global goals and resources",
          },
        ],
      },
    ],
  },
};