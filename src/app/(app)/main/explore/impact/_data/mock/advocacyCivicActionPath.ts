// apps/web/src/app/(app)/main/explore/impact/_data/mock/advocacyCivicActionPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const ADVOCACY_CIVIC_ACTION_PATH: ImpactPathContent = {
  id: "advocacy-civic-action",
  slug: "advocacy-civic-action",
  lane: "impact",

  theme: {
    tone: "civic-energy",
    accent: { r: 92, g: 148, b: 255 },
    accentStrong: { r: 66, g: 112, b: 255 },
    glow: { r: 66, g: 112, b: 255 },
    surfaceLabel: "Civic momentum",
  },

  card: {
    title: "Advocacy & Civic Action",
    hook:
      "You see something that does not feel right — and instead of ignoring it, you start speaking up and pulling others in.",
    description:
      "Advocacy is about helping ideas move. It starts when something feels off — unfair, confusing, or broken — and you decide to understand it, talk about it, and get others involved. That can turn into conversations, campaigns, organizing, or real pressure that leads to change.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Advocacy & Civic Action",
    hook:
      "Turning frustration, curiosity, or belief into something people can rally around.",
    summary:
      "Most people notice issues and move on. Others stay with it — asking questions, explaining things, and helping more people pay attention. Advocacy is not just about having an opinion. It is about helping ideas travel, building momentum, and creating enough clarity and pressure that something actually shifts.",
    whyItPullsYouIn: [
      "You notice when something feels unfair, confusing, or broken.",
      "You like understanding issues and explaining them to others.",
      "You feel energized when people start paying attention and engaging.",
    ],
  },

  traitChips: [
    { id: "voice", label: "Uses their voice" },
    { id: "systems", label: "Thinks about systems" },
    { id: "people", label: "Engages people" },
    { id: "curious", label: "Curious + questioning" },
  ],

  fitSignals: [
    {
      id: "question-systems",
      label: "You question how things work",
      score: 4,
      explanation:
        "You naturally ask why something exists the way it does and whether it could be better.",
    },
    {
      id: "speak-up",
      label: "You are willing to speak up",
      score: 4,
      explanation:
        "When something feels important, you are willing to share your perspective instead of staying quiet.",
    },
    {
      id: "idea-clarity",
      label: "You help people understand ideas",
      score: 5,
      explanation:
        "You can take something complex or confusing and make it clearer for others.",
    },
    {
      id: "momentum-awareness",
      label: "You notice when ideas gain traction",
      score: 4,
      explanation:
        "You can feel when something starts spreading and people begin paying attention.",
    },
  ],

  branchPreviews: [
    {
      id: "community-advocacy",
      slug: "community-advocacy",
      title: "Community Advocacy",
      oneLiner:
        "Helping people rally around a local issue and actually respond to it.",
      whyItCouldFit:
        "Local advocacy starts when someone helps others understand a problem and coordinate around it.",
      energy: "people",
    },
    {
      id: "policy-awareness",
      slug: "policy-awareness",
      title: "Policy Awareness",
      oneLiner:
        "Breaking down how decisions are made so more people can understand and participate.",
      whyItCouldFit:
        "People who can explain systems clearly help others feel less lost and more involved.",
      energy: "reflective",
    },
    {
      id: "campaign-building",
      slug: "campaign-building",
      title: "Campaign Building",
      oneLiner:
        "Turning an issue into something people can see, share, and act on.",
      whyItCouldFit:
        "Campaigns require messaging, coordination, and momentum — not just ideas.",
      energy: "organizer",
    },
  ],

  branches: [
    {
      id: "community-advocacy",
      slug: "community-advocacy",
      title: "Community Advocacy",
      summary:
        "Advocacy often starts locally when people come together around something affecting their daily lives.",
      whatYouActuallyDo: [
        "Talk with people about issues that affect them",
        "Organize discussions or small gatherings",
        "Help groups decide on next steps",
      ],
      skillsThatGrowHere: [
        "Listening",
        "Facilitation",
        "Communication",
        "Coordination",
      ],
      starterProjects: [
        "Host a small conversation about a local issue",
        "Create a simple awareness effort",
        "Help a group organize around a shared concern",
      ],
      atmosphere:
        "Social, active, and sometimes tense — you are working with real people and real opinions.",
    },
    {
      id: "policy-awareness",
      slug: "policy-awareness",
      title: "Policy Awareness",
      summary:
        "Many people want to understand how decisions are made but feel overwhelmed. This path helps make systems visible.",
      whatYouActuallyDo: [
        "Research how policies affect people",
        "Explain systems in simple terms",
        "Encourage participation in discussions",
      ],
      skillsThatGrowHere: [
        "Critical thinking",
        "Research",
        "Communication",
      ],
      starterProjects: [
        "Explain one issue in plain language",
        "Attend and break down a public meeting",
        "Share a short guide to a topic",
      ],
      atmosphere:
        "Curious, analytical, and focused on clarity.",
    },
    {
      id: "campaign-building",
      slug: "campaign-building",
      title: "Campaign Building",
      summary:
        "Campaigns take an issue and give it visibility, direction, and momentum.",
      whatYouActuallyDo: [
        "Create messaging around an issue",
        "Share content or ideas widely",
        "Coordinate people and actions",
      ],
      skillsThatGrowHere: [
        "Messaging",
        "Strategy",
        "Momentum building",
      ],
      starterProjects: [
        "Start a simple awareness campaign",
        "Launch a small digital movement",
        "Organize a coordinated action",
      ],
      atmosphere:
        "Fast-moving, visible, and momentum-driven.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Advocacy becomes real when you take one issue and help other people see it clearly.",
    actions: [
      {
        id: "issue-explainer",
        title: "Create an Issue Explainer",
        type: "research",
        effort: "light",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "Clear explanations are often what turns confusion into engagement.",
        instructions: [
          "Pick one issue you actually care about.",
          "Learn just enough to explain it clearly.",
          "Share it in a simple format.",
          "Notice how people respond.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Advocacy mixes curiosity, tension, conversation, and the energy of people starting to care.",
    moments: [
      {
        id: "discovering-issue",
        title: "Realizing Something Matters",
        body:
          "You learn about something and cannot fully ignore it anymore.",
      },
      {
        id: "conversation-starts",
        title: "Starting Conversations",
        body:
          "You bring it up and realize other people have opinions, questions, or energy around it.",
      },
      {
        id: "momentum-builds",
        title: "Momentum Builds",
        body:
          "More people start paying attention and the issue begins to feel real, not just theoretical.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Advocacy grows through clarity, confidence, and the ability to move people from awareness into action.",
    stages: [
      {
        id: "early-awareness",
        label: "Early Awareness",
        timeframe: "Weeks–Months",
        summary:
          "You explore issues and begin sharing ideas with others.",
        signalsOfProgress: [
          "You understand an issue well enough to explain it",
          "People engage with what you share",
        ],
      },
      {
        id: "active-engagement",
        label: "Active Engagement",
        timeframe: "Months–Years",
        summary:
          "You help organize conversations, content, or small efforts.",
        signalsOfProgress: [
          "You coordinate people around ideas",
          "You help move discussions toward action",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "Advocacy becomes real when you step into actual conversations, movements, or campaigns.",
    actions: [],
    opportunityGroups: [
      {
        id: "local",
        title: "Near you",
        description:
          "Ways to get involved in local discussions, decisions, and advocacy efforts.",
        items: [
          {
            id: "city-meetings",
            title: "Attend Local Government Meetings",
            mode: "local",
            provider: "Local Government",
            summary:
              "Observe or participate in real discussions where decisions are made.",
            whyItHelps:
              "You see how real conversations and decisions actually happen.",
            href: "https://www.usa.gov/local-governments",
            formatLabel: "Local",
          },
          {
            id: "youth-councils",
            title: "Youth Advisory Councils",
            mode: "local",
            provider: "City / School Programs",
            summary:
              "Join groups that represent youth voices in local decision-making.",
            whyItHelps:
              "You get a direct role in shaping conversations.",
            href: "https://www.usa.gov/local-governments",
            formatLabel: "Local",
          },
          {
            id: "school-forums",
            title: "School Forums or Committees",
            mode: "local",
            provider: "Your School",
            summary:
              "Participate in discussions about school policies or initiatives.",
            whyItHelps:
              "You learn how decisions affect real environments.",
            href: "#",
            formatLabel: "Local",
          },
          {
            id: "community-orgs",
            title: "Local Advocacy Groups",
            mode: "local",
            provider: "Local Organizations",
            summary:
              "Join groups focused on specific community issues.",
            whyItHelps:
              "You contribute to active local efforts.",
            href: "https://www.volunteermatch.org",
            formatLabel: "Local",
          },
          {
            id: "nonprofit-events",
            title: "Community Events & Panels",
            mode: "local",
            provider: "Local Nonprofits",
            summary:
              "Attend or help organize events focused on issues.",
            whyItHelps:
              "You engage with real conversations and perspectives.",
            href: "https://www.eventbrite.com",
            formatLabel: "Local",
          },
        ],
      },
      {
        id: "online",
        title: "Online",
        description:
          "Ways to learn, participate, and build momentum around issues digitally.",
        items: [
          {
            id: "change-org",
            title: "Change.org Campaigns",
            mode: "virtual",
            provider: "Change.org",
            summary:
              "Support or create petitions around real issues.",
            whyItHelps:
              "You learn how issues gain visibility.",
            href: "https://www.change.org",
            formatLabel: "Online",
          },
          {
            id: "dosomething",
            title: "DoSomething Campaigns",
            mode: "virtual",
            provider: "DoSomething.org",
            summary:
              "Join youth-led campaigns on social issues.",
            whyItHelps:
              "You take action with structured support.",
            href: "https://www.dosomething.org",
            formatLabel: "Online",
          },
          {
            id: "count-me-in",
            title: "Count Me In",
            mode: "virtual",
            provider: "Count Me In",
            summary:
              "Participate in social impact campaigns.",
            whyItHelps:
              "You engage with real movements.",
            href: "https://www.wearecountmein.com",
            formatLabel: "Online",
          },
          {
            id: "online-discussion",
            title: "Online Discussion Communities",
            mode: "virtual",
            provider: "Various",
            summary:
              "Join spaces where people discuss and organize around issues.",
            whyItHelps:
              "You learn how conversations shape momentum.",
            href: "https://reddit.com",
            formatLabel: "Online",
          },
          {
            id: "un-volunteer",
            title: "UN Online Volunteering",
            mode: "virtual",
            provider: "United Nations",
            summary:
              "Support global initiatives remotely.",
            whyItHelps:
              "You contribute to real-world impact work.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online",
          },
        ],
      },
    ],
  },
};