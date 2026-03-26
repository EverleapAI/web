// apps/web/src/app/(app)/main/explore/world/_data/mock/internationalPolicyPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const INTERNATIONAL_POLICY_PATH: WorldPathContent = {
  id: "international-policy",
  slug: "international-policy",

  energy: "builder",

  theme: {
    accent: "rgba(108,132,255,1)",
    accentStrong: "rgba(146,166,255,1)",
    glow: "rgba(84,108,238,0.35)",
    surfaceLabel: "Global systems",
  },

  card: {
    title: "International Policy",
    hook:
      "Understand how decisions between countries shape what happens in the world.",
    description:
      "This is about the systems behind global events — diplomacy, conflict, trade, climate, and the decisions that ripple across borders.",
  },

  hero: {
    eyebrow: "World direction",
    title: "International Policy",
    subtitle: "The world runs on decisions most people never see.",
    body:
      "Behind every headline is a set of choices — who has power, what they want, and what they’re willing to trade off. International policy is about understanding those decisions. Why do countries cooperate sometimes and clash other times? How do agreements, pressure, and strategy shape what happens next?",
    ambientLabel: "Power · Strategy · Systems",
    pullQuote:
      "The real story isn’t the headline — it’s who made the decision and why.",
  },

  traitChips: [
    { label: "Global thinker" },
    { label: "Systems curious" },
    { label: "Strategy minded" },
    { label: "Issue driven" },
    { label: "Power aware" },
  ],

  fitSignals: [
    {
      id: "news-depth",
      label: "You want to understand what’s behind global events",
      score: 91,
      explanation:
        "You’re not satisfied with headlines — you want structure and cause underneath them.",
    },
    {
      id: "systems-interest",
      label: "You notice how decisions affect multiple places",
      score: 88,
      explanation:
        "You’re drawn to how one action can ripple across countries and systems.",
    },
    {
      id: "strategy-curiosity",
      label: "You’re interested in power, negotiation, and tradeoffs",
      score: 84,
      explanation:
        "You find complex, high-stakes decisions more interesting than simple answers.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How global decisions actually get made",
    intro:
      "This path starts when you stop seeing world events as isolated stories and start seeing the systems behind them.",
    items: [
      {
        title: "Who has power",
        description:
          "How countries, organizations, and leaders influence decisions — and what leverage actually looks like.",
      },
      {
        title: "Why countries cooperate or clash",
        description:
          "How interests, resources, security, and values shape alliances and conflict.",
      },
      {
        title: "Tradeoffs and unintended effects",
        description:
          "Why every decision helps some groups and hurts others — often at the same time.",
      },
      {
        title: "Global systems in motion",
        description:
          "How trade, climate agreements, migration, and security systems connect.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Follow one global issue using real policy trackers",
    description:
      "Pick one issue (climate, conflict, trade, migration) and follow it using real analysis instead of jumping between headlines.",
    href: "https://www.cfr.org/global-conflict-tracker",
    ctaLabel: "Start tracking",
    mode: "virtual",
    type: "research",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "Policy starts making sense when you slow down and follow one system instead of many headlines.",
      opportunities: [
        {
          title: "Track one global issue with CFR Conflict Tracker",
          description:
            "Follow one issue and watch how it evolves instead of jumping across news topics.",
          href: "https://www.cfr.org/global-conflict-tracker",
          ctaLabel: "Start tracking",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Map stakeholders in one global situation",
          description:
            "List countries, organizations, and what each one wants from a conflict or agreement.",
          href: "https://www.un.org/en/global-issues",
          ctaLabel: "Explore UN issues",
          mode: "virtual",
          type: "project",
        },
        {
          title: "Compare coverage from 3 different countries",
          description:
            "Read the same event from multiple international sources and compare perspectives.",
          href: "https://www.bbc.com/news/world",
          ctaLabel: "Start with BBC",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Break down one policy decision",
          description:
            "Take one major decision and identify the tradeoffs and consequences.",
          href: "https://www.foreignpolicy.com",
          ctaLabel: "Explore analysis",
          mode: "virtual",
          type: "research",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "See policy in real life",
      description:
        "Global systems show up locally more than you think — through communities, education, and events.",
      opportunities: [
        {
          title: "Attend a global affairs talk or panel",
          description:
            "Universities and organizations often host discussions on global issues and policy.",
          href: "https://www.eventbrite.com",
          ctaLabel: "Find events",
          mode: "local",
          type: "event",
          locationLabel: "Near you",
        },
        {
          title: "Join an international discussion group",
          description:
            "Meet people who follow global issues and discuss how events impact different regions.",
          href: "https://www.meetup.com",
          ctaLabel: "Find groups",
          mode: "local",
          type: "conversation",
        },
        {
          title: "Visit a university global studies event",
          description:
            "Colleges often host lectures and panels on international relations and policy.",
          href: "https://www.stanford.edu/events/",
          ctaLabel: "Browse events",
          mode: "local",
          type: "event",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Step into global systems",
      description:
        "Move from understanding to participating in structured policy environments.",
      opportunities: [
        {
          title: "Model United Nations",
          description:
            "Simulate diplomacy, negotiation, and global decision-making in a structured setting.",
          href: "https://bestdelegate.com",
          ctaLabel: "Explore Model UN",
          mode: "hybrid",
          type: "program",
        },
        {
          title: "Policy and global affairs summer programs",
          description:
            "Structured exposure to diplomacy, international relations, and global systems.",
          href: "https://www.cfr.org",
          ctaLabel: "Explore programs",
          mode: "hybrid",
          type: "program",
        },
        {
          title: "Follow think tanks like Brookings or CSIS",
          description:
            "See how policy experts analyze and propose solutions to global challenges.",
          href: "https://www.brookings.edu",
          ctaLabel: "Explore Brookings",
          mode: "virtual",
          type: "research",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Stay connected to global systems",
      description:
        "Keep a constant window into how the world is changing and why.",
      opportunities: [
        {
          title: "Council on Foreign Relations",
          description:
            "Clear explainers and breakdowns of major global issues.",
          href: "https://www.cfr.org",
          ctaLabel: "Start exploring",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "BBC World News",
          description:
            "Global coverage with a broad international perspective.",
          href: "https://www.bbc.com/news/world",
          ctaLabel: "Read global news",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Foreign Policy",
          description:
            "Deeper analysis of international decisions and global strategy.",
          href: "https://foreignpolicy.com",
          ctaLabel: "Explore analysis",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};