// apps/web/src/app/(app)/main/explore/world/_data/mock/globalHealthPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const GLOBAL_HEALTH_PATH: WorldPathContent = {
  id: "global-health",
  slug: "global-health",

  energy: "people",

  theme: {
    accent: "rgba(92,205,158,1)",
    accentStrong: "rgba(134,228,186,1)",
    glow: "rgba(64,182,134,0.35)",
    surfaceLabel: "Human wellbeing",
  },

  card: {
    title: "Global Health",
    hook:
      "Understand how health, medicine, and environment shape human life.",
    description:
      "This path is about understanding why health outcomes differ around the world — and how science, systems, and communities improve lives.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Global Health",
    subtitle: "See how health shapes lives across the world",
    body:
      "Health is not just biology. It is shaped by environment, access, policy, culture, and resources. This path explores how different communities prevent disease, care for people, and build healthier systems.",
    ambientLabel: "Health · Systems · Humanity",
    pullQuote:
      "Health is where science, systems, and real human lives meet.",
  },

  traitChips: [
    { label: "Human-centered" },
    { label: "Science curious" },
    { label: "Problem solver" },
    { label: "Community minded" },
  ],

  fitSignals: [
    {
      id: "care-about-health",
      label: "You care about improving people's wellbeing",
      score: 92,
      explanation:
        "You are motivated by helping people live healthier, safer lives.",
    },
    {
      id: "science-health",
      label: "You are curious about science and medicine",
      score: 86,
      explanation:
        "You enjoy understanding how the body works and how diseases are treated or prevented.",
    },
    {
      id: "global-problems",
      label: "You think about large human challenges",
      score: 84,
      explanation:
        "You are interested in solving problems that affect entire communities and populations.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How health systems and science impact real people",
    intro:
      "This path begins when you stop seeing health as just hospitals and start seeing it as a system shaped by environment, access, and human decisions.",
    items: [
      {
        title: "Disease and prevention",
        description:
          "How illnesses spread, how they are treated, and how communities prevent them.",
      },
      {
        title: "Healthcare systems",
        description:
          "How hospitals, funding, policy, and infrastructure shape access to care.",
      },
      {
        title: "Global inequality in health",
        description:
          "Why health outcomes differ across countries and communities.",
      },
      {
        title: "Science that impacts lives",
        description:
          "How biology, medicine, and research translate into real-world impact.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Explore real global health data from the WHO",
    description:
      "Start seeing how health varies across countries by exploring real-world data and global health challenges.",
    href: "https://www.who.int/data",
    ctaLabel: "Explore global health data",
    mode: "virtual",
    type: "research",
  },

  opportunityGroups: [
    {
      id: "start-here",
      label: "Start here",
      title: "Try this this week",
      description:
        "You can start understanding global health by looking at real data, real systems, and real human impact.",
      opportunities: [
        {
          title: "Research one global disease",
          description:
            "Choose a disease and learn how it spreads, who it affects, and how it is treated.",
          href: "https://www.cdc.gov/diseasesconditions/",
          ctaLabel: "Explore diseases",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Compare life expectancy between countries",
          description:
            "Use real data to understand how health outcomes differ across the world.",
          href: "https://data.worldbank.org/indicator/SP.DYN.LE00.IN",
          ctaLabel: "View life expectancy data",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Explore how vaccines work",
          description:
            "Understand how vaccines prevent disease and impact global health.",
          href: "https://www.cdc.gov/vaccines/vpd/index.html",
          ctaLabel: "Learn about vaccines",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "See health in real communities",
      description:
        "Health is happening all around you — in clinics, schools, communities, and public spaces.",
      opportunities: [
        {
          title: "Volunteer with a local health organization",
          description:
            "See how healthcare and community support systems work firsthand.",
          href: "https://www.volunteermatch.org",
          ctaLabel: "Find opportunities",
          mode: "local",
          type: "volunteer",
        },
        {
          title: "Visit a hospital or community health center",
          description:
            "Observe how care is delivered and how systems operate in real life.",
          href: "https://www.aha.org",
          ctaLabel: "Explore hospitals",
          mode: "local",
          type: "visit",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Go deeper into global health",
      description:
        "Explore programs, organizations, and pathways that work on global health challenges.",
      opportunities: [
        {
          title: "World Health Organization",
          description:
            "Learn how global health challenges are studied and addressed worldwide.",
          href: "https://www.who.int",
          ctaLabel: "Explore WHO",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Doctors Without Borders (MSF)",
          description:
            "See how medical teams deliver care in crisis and underserved areas.",
          href: "https://www.doctorswithoutborders.org",
          ctaLabel: "Explore MSF",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Keep learning about global health",
      description:
        "Stay connected to real health stories, research, and global developments.",
      opportunities: [
        {
          title: "Our World in Data (Health)",
          description:
            "Interactive charts and research on global health trends and outcomes.",
          href: "https://ourworldindata.org/health",
          ctaLabel: "Explore data",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Global Health Media Project",
          description:
            "Videos and stories showing real healthcare situations around the world.",
          href: "https://globalhealthmedia.org",
          ctaLabel: "Watch stories",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};