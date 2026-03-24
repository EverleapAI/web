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
    title: "Follow one global issue like a system",
    description:
      "Pick one issue and track it over time instead of jumping between headlines.",
    href: "https://www.cfr.org",
    ctaLabel: "Explore global issues",
    mode: "virtual",
    type: "research",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "Policy starts making sense when you follow one issue deeply.",
      opportunities: [
        {
          title: "Track one global issue for a week",
          description:
            "Follow coverage from multiple sources and notice patterns.",
          href: "https://www.cfr.org",
          ctaLabel: "Pick an issue",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Map the players in one situation",
          description:
            "List countries, organizations, and what each one wants.",
          href: "https://www.un.org",
          ctaLabel: "Explore UN topics",
          mode: "virtual",
          type: "project",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "See policy in real life",
      description:
        "Global systems show up locally more than you think.",
      opportunities: [
        {
          title: "Attend a local public talk or panel",
          description:
            "Universities and orgs often host discussions on global issues.",
          href: "https://www.eventbrite.com",
          ctaLabel: "Find events",
          mode: "local",
          type: "event",
          locationLabel: "Near you",
        },
        {
          title: "Talk to someone with an international perspective",
          description:
            "Learn how global issues feel from someone directly connected to them.",
          href: "https://www.meetup.com",
          ctaLabel: "Find groups",
          mode: "local",
          type: "conversation",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Step into global systems",
      description:
        "Take your understanding into more structured environments.",
      opportunities: [
        {
          title: "Model UN or debate programs",
          description:
            "Simulate global negotiation and decision-making.",
          href: "https://bestdelegate.com",
          ctaLabel: "Explore Model UN",
          mode: "hybrid",
          type: "program",
        },
        {
          title: "Global affairs or policy summer programs",
          description:
            "Structured exposure to diplomacy, global systems, and analysis.",
          href: "https://www.cfr.org",
          ctaLabel: "Explore programs",
          mode: "hybrid",
          type: "program",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Stay connected to global systems",
      description:
        "Keep a continuous window into how the world is changing.",
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
          title: "United Nations",
          description:
            "See how global institutions frame and address world problems.",
          href: "https://www.un.org",
          ctaLabel: "Explore issues",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};