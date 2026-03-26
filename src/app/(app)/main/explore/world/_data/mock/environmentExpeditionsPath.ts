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
    title: "Start documenting a real ecosystem with iNaturalist",
    description:
      "Pick one place — a trail, park, shoreline, creek, or even your backyard — and start recording what actually lives there. This turns wandering into observation fast.",
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
        "You do not need expensive gear or a giant trip. You need one real place, one real question, and the habit of paying attention.",
      opportunities: [
        {
          title: "Log your first 10 species with iNaturalist",
          description:
            "Go to one park, trail, shoreline, or backyard space and document the plants, insects, birds, or fungi you can actually find there.",
          href: "https://www.inaturalist.org",
          ctaLabel: "Start observing",
          mode: "hybrid",
          type: "project",
        },
        {
          title: "Use Globe Observer to collect real environmental data",
          description:
            "Turn your phone into a field tool by recording clouds, mosquito habitat, land cover, or trees for real science projects.",
          href: "https://observer.globe.gov/",
          ctaLabel: "Explore Globe Observer",
          mode: "hybrid",
          type: "research",
        },
        {
          title: "Create a one-day field journal",
          description:
            "Visit one location and record weather, sounds, species, ground conditions, water movement, and human impact so you start noticing systems instead of just scenery.",
          href: "https://www.nps.gov/subjects/nature/index.htm",
          ctaLabel: "Use park observation ideas",
          mode: "local",
          type: "project",
        },
        {
          title: "Track one small ecosystem over time",
          description:
            "Pick one repeatable site and revisit it weekly to notice seasonal change, species patterns, and signs of stress or recovery.",
          href: "https://www.nature.org/en-us/get-involved/how-to-help/places-we-protect/",
          ctaLabel: "Find a nearby place",
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
        "The best version of this path is not abstract. It happens in tidepools, wetlands, forests, ridgelines, creeks, and restoration sites where you can see real systems in motion.",
      opportunities: [
        {
          title: "Find a California State Park or nearby natural area",
          description:
            "Use parks, preserves, and trails as living classrooms where you can observe ecosystems, geology, weather, and habitat changes firsthand.",
          href: "https://www.parks.ca.gov/",
          ctaLabel: "Find a park",
          mode: "local",
          type: "visit",
          locationLabel: "California",
        },
        {
          title: "Explore National Park Service sites and field learning resources",
          description:
            "National parks and related sites can help you understand ecosystems, conservation, species, and environmental change through real places.",
          href: "https://www.nps.gov/subjects/nature/index.htm",
          ctaLabel: "Explore field topics",
          mode: "local",
          type: "visit",
          locationLabel: "Near you",
        },
        {
          title: "Join a local restoration or cleanup effort",
          description:
            "Work directly on a landscape and see how erosion, invasive species, waste, habitat recovery, and stewardship show up in the real world.",
          href: "https://www.volunteermatch.org",
          ctaLabel: "Find local volunteering",
          mode: "local",
          type: "volunteer",
        },
        {
          title: "Look for Sierra Club local outings and field experiences",
          description:
            "Hikes, conservation activities, and local outings can help you learn the land while being around people who care about how places work.",
          href: "https://www.sierraclub.org/outings",
          ctaLabel: "Browse outings",
          mode: "local",
          type: "event",
          locationLabel: "Regional",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Go further into the field",
      description:
        "When this starts feeling real, move from casual exploration into programs, expeditions, and structured environmental experiences.",
      opportunities: [
        {
          title: "Outward Bound environmental and wilderness programs",
          description:
            "Spend serious time in forests, mountains, rivers, or coasts while building outdoor judgment, resilience, and deeper place-based awareness.",
          href: "https://www.outwardbound.org",
          ctaLabel: "Explore programs",
          mode: "travel",
          type: "program",
        },
        {
          title: "National Geographic Expeditions",
          description:
            "See what guided expedition-style learning looks like when travel, field observation, and environmental storytelling come together.",
          href: "https://www.nationalgeographic.com/expeditions",
          ctaLabel: "View expeditions",
          mode: "travel",
          type: "expedition",
        },
        {
          title: "NOAA student opportunities",
          description:
            "Explore programs and pathways connected to oceans, weather, climate, fisheries, and environmental science careers.",
          href: "https://www.noaa.gov/education/opportunities/students",
          ctaLabel: "Explore NOAA opportunities",
          mode: "virtual",
          type: "program",
        },
        {
          title: "US Forest Service youth and conservation pathways",
          description:
            "Look at programs connected to forests, fire, land management, conservation, and environmental stewardship.",
          href: "https://www.fs.usda.gov/working-with-us/opportunities-for-young-people",
          ctaLabel: "Explore youth opportunities",
          mode: "virtual",
          type: "program",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Keep a window into the natural world",
      description:
        "Even when you are not outside, you can keep building field awareness through tools, citizen science, and real environmental reporting.",
      opportunities: [
        {
          title: "iNaturalist",
          description:
            "Document plants and animals, compare observations, and build the habit of treating places as ecosystems instead of backgrounds.",
          href: "https://www.inaturalist.org",
          ctaLabel: "Start observing",
          mode: "hybrid",
          type: "resource",
        },
        {
          title: "Globe Observer",
          description:
            "Contribute environmental observations through NASA-supported citizen science projects focused on clouds, mosquitoes, trees, and land cover.",
          href: "https://observer.globe.gov/",
          ctaLabel: "Use the app",
          mode: "hybrid",
          type: "research",
        },
        {
          title: "NASA Earth Observatory",
          description:
            "See how scientists and satellites track environmental change across the planet through images, stories, and data-rich explanations.",
          href: "https://earthobservatory.nasa.gov/",
          ctaLabel: "Explore Earth Observatory",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Zooniverse environmental citizen science projects",
          description:
            "Help classify wildlife, habitats, and environmental data in real research projects that depend on public participation.",
          href: "https://www.zooniverse.org/projects",
          ctaLabel: "Browse projects",
          mode: "virtual",
          type: "research",
        },
      ],
    },
  ],
};