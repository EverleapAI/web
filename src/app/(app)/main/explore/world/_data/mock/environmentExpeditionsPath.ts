// apps/web/src/app/(app)/main/explore/world/_data/mock/environmentExpeditionsPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const ENVIRONMENT_EXPEDITIONS_PATH: WorldPathContent = {
  id: "environment-expeditions",
  slug: "environment-expeditions",
  lane: "world",

  theme: {
    tone: "field-curiosity",
    accent: { r: 74, g: 190, b: 150 },
    accentStrong: { r: 112, g: 214, b: 176 },
    glow: { r: 46, g: 164, b: 126 },
    surfaceLabel: "Field discovery",
  },

  card: {
    title: "Environment + Expeditions",
    hook: "Explore ecosystems, climate, wild places, and the science of the living world.",
    description:
      "Some people feel most awake outside — following trails, asking how ecosystems work, and wanting to understand the forces shaping the planet. This direction blends discovery, field science, and real-world environmental curiosity.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Environment + Expeditions",
    hook: "For people pulled toward wild places, field discovery, and how the planet actually works.",
    summary:
      "This path is about more than loving nature. It is about stepping into landscapes with questions. Why does this ecosystem work this way? What is changing? How do climate, water, soil, animals, and people all affect each other? Environment + Expeditions turns outdoor curiosity into deeper investigation.",
    whyItPullsYouIn: [
      "You feel energized by being outside and exploring places directly.",
      "You are curious how ecosystems, weather, and climate actually work.",
      "You like discovery that feels physical, real, and connected to the world.",
      "You want your curiosity to lead somewhere bigger than just scrolling facts online.",
    ],
  },

  traitChips: [
    { id: "outdoor-energy", label: "Outdoor energy" },
    { id: "field-observer", label: "Field observer" },
    { id: "earth-curiosity", label: "Earth curiosity" },
    { id: "systems-thinker", label: "Systems thinker" },
    { id: "question-driven", label: "Question driven" },
  ],

  fitSignals: [
    {
      id: "outside-focus",
      label: "You feel more alive when learning connects to real places",
      score: 92,
      explanation:
        "You are drawn to learning that happens through observation, movement, and being in the world — not just sitting with abstract information.",
    },
    {
      id: "ecosystem-curiosity",
      label: "You wonder how nature actually works",
      score: 89,
      explanation:
        "You are interested in how weather, water, soil, plants, animals, and people affect each other.",
    },
    {
      id: "discovery-drive",
      label: "You like exploration with a purpose",
      score: 85,
      explanation:
        "It is not just about adventure. You want exploration to reveal something real.",
    },
  ],

  branchPreviews: [
    {
      id: "ecology-fieldwork",
      slug: "ecology-fieldwork",
      title: "Ecology + Fieldwork",
      oneLiner: "Study living systems by observing them directly.",
      whyItCouldFit:
        "Great if you like collecting observations, noticing patterns, and learning from real places.",
      energy: "grounded",
    },
    {
      id: "climate-exploration",
      slug: "climate-exploration",
      title: "Climate + Earth Systems",
      oneLiner: "Understand the forces shaping weather, climate, and change.",
      whyItCouldFit:
        "Strong fit if you are curious about big planetary systems and what is shifting over time.",
      energy: "builder",
    },
    {
      id: "conservation-adventure",
      slug: "conservation-adventure",
      title: "Conservation + Exploration",
      oneLiner: "Protect wild places through science, care, and real-world action.",
      whyItCouldFit:
        "Good for people who want exploration to connect to stewardship and impact.",
      energy: "adventure",
    },
  ],

  branches: [
    {
      id: "ecology-fieldwork",
      slug: "ecology-fieldwork",
      title: "Ecology + Fieldwork",
      summary:
        "This branch is about studying ecosystems by going into them — observing species, habitats, patterns, and environmental relationships directly.",
      whatYouActuallyExplore: [
        "How plants, animals, soil, and water interact",
        "Field notes, mapping, and ecological observation",
        "How ecosystems change across seasons and conditions",
      ],
      skillsThatGrowHere: [
        "Observation",
        "Data collection",
        "Pattern recognition",
        "Field documentation",
      ],
      starterProjects: [
        "Track plant or bird activity in one local spot for two weeks",
        "Create a field journal from a park, shoreline, or trail",
        "Map micro-habitats in one outdoor area near you",
      ],
      atmosphere:
        "Grounded, curious, and quietly exciting — discovery through attention.",
    },
    {
      id: "climate-exploration",
      slug: "climate-exploration",
      title: "Climate + Earth Systems",
      summary:
        "This branch focuses on the large systems shaping the planet — climate, weather, water cycles, energy flows, and environmental change.",
      whatYouActuallyExplore: [
        "Climate systems and feedback loops",
        "Weather patterns and long-term shifts",
        "How human activity affects planetary systems",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Scientific interpretation",
        "Climate literacy",
        "Cause-and-effect reasoning",
      ],
      starterProjects: [
        "Compare climate data from two very different regions",
        "Make a visual explainer of one Earth system",
        "Research how one local place may be affected by climate change",
      ],
      atmosphere:
        "Big-picture, investigative, and full of interconnected thinking.",
    },
    {
      id: "conservation-adventure",
      slug: "conservation-adventure",
      title: "Conservation + Exploration",
      summary:
        "This branch connects environmental curiosity to protecting landscapes, habitats, species, and natural systems.",
      whatYouActuallyExplore: [
        "How conservation projects protect ecosystems",
        "What puts habitats under pressure",
        "How science and public action work together in stewardship",
      ],
      skillsThatGrowHere: [
        "Environmental awareness",
        "Applied research",
        "Stewardship thinking",
        "Community action",
      ],
      starterProjects: [
        "Research one threatened habitat and what is being done to protect it",
        "Volunteer for a cleanup or restoration effort",
        "Create a short guide to one local ecosystem worth protecting",
      ],
      atmosphere:
        "Active, meaningful, and connected to places that matter.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way to explore this direction is to get outside with a question.",
    actions: [
      {
        id: "field-journal",
        title: "Create a one-day field journal",
        type: "project",
        effort: "light",
        timeEstimate: "45–75 min",
        whyThisMatters:
          "Field science starts with noticing what is actually there, not what you assume is there.",
        instructions: [
          "Go to a nearby park, trail, shoreline, or outdoor space.",
          "Write down what you observe about plants, animals, weather, and water.",
          "Sketch or photograph three details that stand out.",
        ],
      },
      {
        id: "ecosystem-comparison",
        title: "Compare two ecosystems",
        type: "research",
        effort: "medium",
        timeEstimate: "60–90 min",
        whyThisMatters:
          "Comparing systems helps you see that environments are shaped by patterns, not random facts.",
        instructions: [
          "Choose two very different ecosystems.",
          "Research climate, species, and environmental pressures in each.",
          "Summarize what is most different and why.",
        ],
      },
      {
        id: "local-environment-question",
        title: "Investigate one local environmental question",
        type: "experiment",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "Environmental learning gets stronger when it starts from a real place you know.",
        instructions: [
          "Pick one local question: drought, erosion, wildfire risk, habitat loss, water use, or trail impact.",
          "Read two or three credible sources.",
          "Write a short explanation of what is happening and why it matters.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "This path often feels expansive and grounding at the same time. You are in the world, but also trying to understand the invisible systems underneath it.",
    moments: [
      {
        id: "place-awareness",
        title: "Places start feeling more alive",
        body:
          "A hillside, creek, forest, or coastline stops being just scenery and starts feeling like a system full of signals.",
      },
      {
        id: "bigger-patterns",
        title: "You start seeing patterns everywhere",
        body:
          "Weather, species, seasons, and human activity begin to connect in ways that feel more legible.",
      },
      {
        id: "real-stakes",
        title: "The stakes become real",
        body:
          "Environmental questions stop feeling abstract when they connect to places, species, and futures you can imagine clearly.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Growth usually starts with outdoor curiosity, then becomes more structured through observation, research, and field-based questions.",
    stages: [
      {
        id: "notice",
        label: "Notice the living world differently",
        timeframe: "First few weeks",
        summary:
          "You start paying closer attention to outdoor places, habitats, and environmental patterns.",
        signalsOfProgress: [
          "You ask more specific questions about places you visit",
          "You begin observing instead of just glancing",
        ],
      },
      {
        id: "investigate",
        label: "Turn curiosity into investigation",
        timeframe: "1–3 months",
        summary:
          "You begin connecting observation with science, maps, data, and environmental explanations.",
        signalsOfProgress: [
          "You research the systems behind what you see",
          "You can explain one local environmental issue clearly",
        ],
      },
      {
        id: "engage",
        label: "Move toward real-world involvement",
        timeframe: "After repeated exploration",
        summary:
          "You start looking for field programs, conservation work, citizen science, or environmental projects.",
        signalsOfProgress: [
          "You want to participate, not just read",
          "You begin seeing possible futures connected to this interest",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Take the next step into environmental exploration",
    summary:
      "This path gets stronger when you combine outside experience, environmental science, and real opportunities to observe or help.",
    actions: [
      {
        id: "visit-nature-center",
        title: "Visit a nature center, preserve, or science site",
        type: "visit",
        effort: "light",
        timeEstimate: "2–3 hours",
        whyThisMatters:
          "Getting into a real environmental learning space makes the path feel concrete fast.",
        instructions: [
          "Find a local nature center, preserve, botanical garden, or field station.",
          "Go with one or two questions in mind.",
          "Write down what sparked your curiosity most.",
        ],
      },
      {
        id: "join-citizen-science",
        title: "Try a citizen science project",
        type: "join",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Citizen science lets you contribute to real observation and data collection.",
        instructions: [
          "Find a beginner-friendly project online.",
          "Participate once or twice.",
          "Notice whether collecting real-world observations feels energizing.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "environment-learning",
        title: "Places to go deeper",
        description:
          "These are strong starting points for environmental learning, exploration, and field-based curiosity.",
        items: [
          {
            id: "national-park-service",
            title: "National Park Service",
            mode: "virtual",
            provider: "NPS",
            summary:
              "Explore ecosystems, conservation, maps, and educational resources tied to real landscapes.",
            whyItHelps:
              "Connects environmental learning to real places, field knowledge, and public stewardship.",
            href: "https://www.nps.gov",
            formatLabel: "Parks and learning resources",
          },
          {
            id: "iNaturalist",
            title: "iNaturalist",
            mode: "hybrid",
            provider: "iNaturalist",
            summary:
              "Document plants and animals while learning from a real observation community.",
            whyItHelps:
              "A strong bridge between outdoor curiosity and real-world species observation.",
            href: "https://www.inaturalist.org",
            formatLabel: "Observation platform",
          },
        ],
      },
    ],
  },
};