// apps/web/src/app/(app)/main/explore/world/_data/mock/internationalPolicyPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const INTERNATIONAL_POLICY_PATH: WorldPathContent = {
  id: "international-policy",
  slug: "international-policy",
  lane: "world",

  theme: {
    tone: "global-systems",
    accent: { r: 108, g: 132, b: 255 },
    accentStrong: { r: 146, g: 166, b: 255 },
    glow: { r: 84, g: 108, b: 238 },
    surfaceLabel: "Global systems",
  },

  card: {
    title: "International Policy",
    hook: "Understand how countries cooperate, compete, negotiate, and shape the world.",
    description:
      "Some people are pulled toward the big systems behind global events — diplomacy, conflict, trade, migration, climate agreements, and the decisions that ripple across borders.",
  },

  hero: {
    eyebrow: "World direction",
    title: "International Policy",
    hook: "For people who want to understand how the world is organized — and who gets to shape it.",
    summary:
      "This path is about the systems behind headlines. Why do countries cooperate sometimes and clash other times? How do trade, diplomacy, security, climate, migration, and power all connect? International Policy turns global curiosity into structured understanding.",
    whyItPullsYouIn: [
      "You are curious about global events, conflict, and cooperation.",
      "You want to understand the decisions behind world news.",
      "You are interested in power, negotiation, strategy, and institutions.",
      "You like questions that involve people, systems, and high stakes.",
    ],
  },

  traitChips: [
    { id: "global-thinker", label: "Global thinker" },
    { id: "systems-curious", label: "Systems curious" },
    { id: "strategy-mind", label: "Strategy mind" },
    { id: "issue-driven", label: "Issue driven" },
    { id: "power-reader", label: "Power reader" },
  ],

  fitSignals: [
    {
      id: "news-curiosity",
      label: "You want to know what is really happening behind global events",
      score: 91,
      explanation:
        "You are not satisfied with surface headlines. You want the structure underneath them.",
    },
    {
      id: "systems-interest",
      label: "You are interested in large systems and how decisions ripple outward",
      score: 88,
      explanation:
        "You like seeing how one treaty, conflict, election, or policy can affect many places at once.",
    },
    {
      id: "strategy-energy",
      label: "You are drawn to negotiation, power, and competing priorities",
      score: 84,
      explanation:
        "You find it interesting when problems are complicated, political, and full of tradeoffs.",
    },
  ],

  branchPreviews: [
    {
      id: "diplomacy-negotiation",
      slug: "diplomacy-negotiation",
      title: "Diplomacy + Negotiation",
      oneLiner: "Study how countries communicate, bargain, and build agreements.",
      whyItCouldFit:
        "Strong fit if you are curious about persuasion, compromise, and global relationships.",
      energy: "people",
    },
    {
      id: "security-conflict",
      slug: "security-conflict",
      title: "Security + Conflict",
      oneLiner: "Understand war, peace, risk, and the forces behind global tension.",
      whyItCouldFit:
        "Great if you are drawn to high-stakes questions about power and stability.",
      energy: "grounded",
    },
    {
      id: "global-governance",
      slug: "global-governance",
      title: "Global Governance",
      oneLiner: "Explore institutions, treaties, and the systems meant to organize the world.",
      whyItCouldFit:
        "Good for people interested in structure, policy, and how international rules are made.",
      energy: "builder",
    },
  ],

  branches: [
    {
      id: "diplomacy-negotiation",
      slug: "diplomacy-negotiation",
      title: "Diplomacy + Negotiation",
      summary:
        "This branch focuses on how countries communicate, negotiate, build alliances, and manage disagreements without always falling into conflict.",
      whatYouActuallyExplore: [
        "How diplomacy works across cultures and interests",
        "Why negotiations succeed, stall, or break down",
        "How alliances, summits, and agreements shape world events",
      ],
      skillsThatGrowHere: [
        "Negotiation thinking",
        "Perspective taking",
        "Political awareness",
        "Clear communication",
      ],
      starterProjects: [
        "Track one current diplomatic issue for a week",
        "Write a short explainer of one major alliance or treaty",
        "Simulate a negotiation between countries with different goals",
      ],
      atmosphere:
        "Strategic, human, and full of tension beneath the surface.",
    },
    {
      id: "security-conflict",
      slug: "security-conflict",
      title: "Security + Conflict",
      summary:
        "This branch explores why conflicts happen, how security is managed, and what makes peace fragile or durable.",
      whatYouActuallyExplore: [
        "Causes of conflict and escalation",
        "Military, economic, and political dimensions of security",
        "How peacekeeping, deterrence, and pressure work",
      ],
      skillsThatGrowHere: [
        "Risk analysis",
        "Cause-and-effect reasoning",
        "Historical comparison",
        "Strategic reading",
      ],
      starterProjects: [
        "Compare two modern conflicts and what triggered them",
        "Map the interests of different actors in one global crisis",
        "Create a timeline showing how one conflict escalated",
      ],
      atmosphere:
        "Serious, analytical, and intensely connected to real-world stakes.",
    },
    {
      id: "global-governance",
      slug: "global-governance",
      title: "Global Governance",
      summary:
        "This branch is about the institutions, agreements, and rule systems that try to coordinate action across countries.",
      whatYouActuallyExplore: [
        "What international organizations actually do",
        "How treaties and agreements are built",
        "Why global rules matter — and why they often fall short",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Policy interpretation",
        "Institutional literacy",
        "Big-picture reasoning",
      ],
      starterProjects: [
        "Research what one international organization actually does",
        "Compare how two countries approach the same global issue",
        "Make a visual map of one global system like trade, migration, or climate coordination",
      ],
      atmosphere:
        "Complex, structured, and full of interconnected pressures.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way into international policy is to stop reading headlines like isolated events and start following systems.",
    actions: [
      {
        id: "follow-one-issue",
        title: "Follow one global issue for a week",
        type: "research",
        effort: "light",
        timeEstimate: "20 min a day",
        whyThisMatters:
          "Policy starts making more sense when you follow one issue across time instead of scanning random headlines.",
        instructions: [
          "Pick one issue like migration, climate agreements, conflict, trade, or public health.",
          "Follow it from multiple reputable sources for one week.",
          "Write down what actors, countries, and interests keep showing up.",
        ],
      },
      {
        id: "map-global-actors",
        title: "Map who is involved in one international issue",
        type: "project",
        effort: "medium",
        timeEstimate: "45–75 min",
        whyThisMatters:
          "Many world problems make more sense when you map the players and their incentives.",
        instructions: [
          "Choose one current international issue.",
          "List the countries, organizations, and groups involved.",
          "Write one sentence on what each actor seems to want.",
        ],
      },
      {
        id: "compare-coverage",
        title: "Compare how two sources frame the same world event",
        type: "experiment",
        effort: "medium",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "Policy understanding gets sharper when you notice framing, bias, and missing context.",
        instructions: [
          "Pick one current event.",
          "Read coverage from two reputable sources.",
          "Compare what each one emphasizes, leaves out, or explains differently.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "This path often feels like moving from confusion to structure. The world starts looking less random and more patterned.",
    moments: [
      {
        id: "headlines-connect",
        title: "Headlines stop feeling random",
        body:
          "You start seeing that trade, conflict, diplomacy, migration, and climate are often part of the same larger systems.",
      },
      {
        id: "power-becomes-visible",
        title: "Power becomes easier to spot",
        body:
          "You begin noticing who has leverage, who is exposed, and who is shaping the story behind the scenes.",
      },
      {
        id: "tradeoffs-get-real",
        title: "You start seeing the tradeoffs",
        body:
          "Many policy questions get harder, not easier, once you realize every option affects someone differently.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Growth usually starts with global curiosity, then becomes sharper through structured analysis, issue tracking, and systems thinking.",
    stages: [
      {
        id: "notice",
        label: "Move beyond headlines",
        timeframe: "First few weeks",
        summary:
          "You begin following global events with more patience and more attention to context.",
        signalsOfProgress: [
          "You ask better questions about global events",
          "You begin noticing recurring actors, institutions, and issues",
        ],
      },
      {
        id: "analyze",
        label: "Build issue fluency",
        timeframe: "1–3 months",
        summary:
          "You start understanding how specific world issues actually work across countries and systems.",
        signalsOfProgress: [
          "You can explain one international issue clearly",
          "You begin seeing how strategy and institutions interact",
        ],
      },
      {
        id: "engage",
        label: "Think like a global systems reader",
        timeframe: "After repeated exploration",
        summary:
          "You begin connecting current events to diplomacy, power, incentives, and long-term structures.",
        signalsOfProgress: [
          "You can compare multiple global perspectives",
          "You start imagining real pathways into policy, research, or international affairs",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Take the next step into global policy",
    summary:
      "This path gets stronger when you combine issue tracking, historical context, and structured global analysis.",
    actions: [
      {
        id: "watch-policy-panel",
        title: "Watch a serious policy discussion",
        type: "research",
        effort: "light",
        timeEstimate: "45–60 min",
        whyThisMatters:
          "Hearing experts disagree or analyze live issues helps policy feel more real and less abstract.",
        instructions: [
          "Find a panel or talk on a current global issue.",
          "Write down the main actors, tradeoffs, and tensions discussed.",
          "Notice what feels strategic instead of emotional.",
        ],
      },
      {
        id: "build-one-brief",
        title: "Write a one-page issue brief",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "A short brief forces you to turn scattered information into a clear picture.",
        instructions: [
          "Choose one international issue.",
          "Summarize what is happening, who is involved, and why it matters.",
          "End with two or three questions you still have.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "policy-learning",
        title: "Places to go deeper",
        description:
          "These are strong starting points for following global issues, diplomacy, and international systems.",
        items: [
          {
            id: "cfr-education",
            title: "Council on Foreign Relations",
            mode: "virtual",
            provider: "CFR",
            summary:
              "Backgrounders, explainers, and analysis on major global issues and foreign policy.",
            whyItHelps:
              "A strong bridge from curiosity to structured understanding of international affairs.",
            href: "https://www.cfr.org",
            formatLabel: "Explainers and analysis",
          },
          {
            id: "un-resources",
            title: "United Nations resources",
            mode: "virtual",
            provider: "United Nations",
            summary:
              "Issue pages, reports, and background on global cooperation and international priorities.",
            whyItHelps:
              "Helps you understand how global institutions describe and organize world issues.",
            href: "https://www.un.org",
            formatLabel: "Global issue resources",
          },
        ],
      },
    ],
  },
};