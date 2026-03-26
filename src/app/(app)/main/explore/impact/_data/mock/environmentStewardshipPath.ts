// apps/web/src/app/(app)/main/explore/impact/_data/mock/environmentStewardshipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const ENVIRONMENT_STEWARDSHIP_PATH: ImpactPathContent = {
  id: "environment-stewardship",
  slug: "environment-stewardship",
  lane: "impact",

  theme: {
    tone: "earth-care",
    accent: { r: 102, g: 187, b: 106 },
    accentStrong: { r: 67, g: 160, b: 71 },
    glow: { r: 67, g: 160, b: 71 },
    surfaceLabel: "Caring for places",
  },

  card: {
    title: "Environment & Stewardship",
    hook:
      "You notice the condition of the spaces around you — and feel a pull to take care of them.",
    description:
      "Environmental stewardship is about noticing, respecting, and actively caring for the places we share. It can be physical, like restoring a space, or systemic, like thinking about sustainability and long-term impact. It starts with awareness and becomes action.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Environment & Stewardship",
    hook:
      "Taking care of the spaces, systems, and environments we all depend on.",
    summary:
      "Some people move through environments without thinking much about them. Others notice — the condition of a park, the way systems work, or how human activity affects what surrounds us. Stewardship is about turning that awareness into action, whether that means restoring, maintaining, protecting, or rethinking how things are done.",
    whyItPullsYouIn: [
      "You notice details about environments others ignore.",
      "You feel connected to physical spaces and nature.",
      "You care about long-term impact, not just short-term results.",
    ],
  },

  traitChips: [
    { id: "observant", label: "Observant" },
    { id: "grounded", label: "Grounded" },
    { id: "care-driven", label: "Care driven" },
    { id: "systems", label: "Thinks long-term" },
  ],

  fitSignals: [
    {
      id: "environment-awareness",
      label: "You notice environmental details",
      score: 4,
      explanation:
        "You pick up on how spaces feel, function, and change over time.",
    },
    {
      id: "care-instinct",
      label: "You feel responsible for shared spaces",
      score: 5,
      explanation:
        "You don’t just notice issues — you feel a pull to improve or protect what’s there.",
    },
    {
      id: "long-term-thinking",
      label: "You think beyond the immediate moment",
      score: 4,
      explanation:
        "You consider how decisions affect the future, not just now.",
    },
    {
      id: "hands-on-impact",
      label: "You like visible, real-world impact",
      score: 4,
      explanation:
        "You enjoy seeing a physical or measurable result from your effort.",
    },
  ],

  branchPreviews: [
    {
      id: "local-restoration",
      slug: "local-restoration",
      title: "Local Restoration",
      oneLiner:
        "Improving parks, spaces, and environments you can physically see and touch.",
      whyItCouldFit:
        "You like hands-on work and seeing visible change in real places.",
      energy: "builder",
    },
    {
      id: "sustainability-systems",
      slug: "sustainability-systems",
      title: "Sustainability Systems",
      oneLiner:
        "Rethinking how systems work to reduce impact over time.",
      whyItCouldFit:
        "You think in systems and long-term effects.",
      energy: "reflective",
    },
    {
      id: "community-stewardship",
      slug: "community-stewardship",
      title: "Community Stewardship",
      oneLiner:
        "Helping people care for shared spaces together.",
      whyItCouldFit:
        "You care about both people and the environments they share.",
      energy: "people",
    },
  ],

  branches: [
    {
      id: "local-restoration",
      slug: "local-restoration",
      title: "Local Restoration",
      summary:
        "Hands-on environmental work focused on improving physical spaces.",
      whatYouActuallyDo: [
        "Participate in cleanups and restoration",
        "Work with tools, materials, and teams",
        "Improve visible environments",
      ],
      skillsThatGrowHere: [
        "Physical coordination",
        "Teamwork",
        "Consistency",
      ],
      starterProjects: [
        "Join a cleanup effort",
        "Help restore a shared space",
        "Organize a small improvement project",
      ],
      atmosphere:
        "Active, physical, and grounded in real environments.",
    },
    {
      id: "sustainability-systems",
      slug: "sustainability-systems",
      title: "Sustainability Systems",
      summary:
        "Understanding and improving how systems impact the environment.",
      whatYouActuallyDo: [
        "Study environmental systems",
        "Identify inefficiencies",
        "Propose improvements",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Analysis",
        "Planning",
      ],
      starterProjects: [
        "Audit a system (waste, energy)",
        "Suggest improvements",
        "Create a simple sustainability plan",
      ],
      atmosphere:
        "Analytical, thoughtful, and future-oriented.",
    },
    {
      id: "community-stewardship",
      slug: "community-stewardship",
      title: "Community Stewardship",
      summary:
        "Helping groups take responsibility for shared environments.",
      whatYouActuallyDo: [
        "Organize people around environmental goals",
        "Coordinate efforts",
        "Build shared responsibility",
      ],
      skillsThatGrowHere: [
        "Leadership",
        "Coordination",
        "Communication",
      ],
      starterProjects: [
        "Start a group effort",
        "Coordinate volunteers",
        "Lead a local initiative",
      ],
      atmosphere:
        "Social, purposeful, and community-driven.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Stewardship becomes real when you improve something you can actually see.",
    actions: [
      {
        id: "improve-space",
        title: "Improve One Space",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 days",
        whyThisMatters:
          "Small physical improvements build awareness and momentum.",
        instructions: [
          "Find a space that needs attention.",
          "Define one clear improvement.",
          "Take action.",
          "Notice the before and after.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Stewardship feels grounded, physical, and quietly meaningful.",
    moments: [
      {
        id: "notice",
        title: "You Notice",
        body:
          "You see something others ignore — a space, a system, a problem.",
      },
      {
        id: "act",
        title: "You Act",
        body:
          "You take action, even if it’s small, and change something.",
      },
      {
        id: "impact",
        title: "You See the Result",
        body:
          "The change is visible, real, and lasting.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Stewardship grows from small actions to larger systems.",
    stages: [
      {
        id: "small-actions",
        label: "Small Actions",
        timeframe: "Weeks",
        summary:
          "You start with visible improvements.",
        signalsOfProgress: [
          "You take initiative",
          "You complete projects",
        ],
      },
      {
        id: "larger-systems",
        label: "Larger Systems",
        timeframe: "Months–Years",
        summary:
          "You begin influencing broader systems.",
        signalsOfProgress: [
          "You design improvements",
          "You influence others",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "Environmental impact becomes real when you step into projects where care turns into visible change. These are ways to work with actual places, people, and systems right now.",

    actions: [
      {
        id: "join-local-stewardship",
        title: "Join a Local Stewardship Project",
        type: "join",
        effort: "medium",
        timeEstimate: "1–3 weeks to begin",
        whyThisMatters:
          "Environmental values become real when you work alongside people actively caring for land and systems.",
        instructions: [
          "Find a local cleanup or restoration effort.",
          "Show up once.",
          "Take on a small role.",
          "Notice what impact feels meaningful.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "local",
        title: "Near you",
        description:
          "Hands-on ways to improve real spaces and environments nearby.",
        items: [
          {
            id: "volunteermatch",
            title: "VolunteerMatch – Environmental Projects",
            mode: "local",
            provider: "VolunteerMatch",
            summary:
              "Find cleanup and restoration opportunities nearby.",
            whyItHelps:
              "You step into real environmental work.",
            href: "https://www.volunteermatch.org",
            formatLabel: "Local",
          },
          {
            id: "nps",
            title: "National Park Service Volunteer",
            mode: "local",
            provider: "NPS",
            summary:
              "Volunteer in parks and conservation areas.",
            whyItHelps:
              "You work directly in real ecosystems.",
            href: "https://www.nps.gov/getinvolved/volunteer.htm",
            formatLabel: "Local",
          },
          {
            id: "corps",
            title: "Conservation Corps",
            mode: "local",
            provider: "Corps Network",
            summary:
              "Youth programs focused on environmental work.",
            whyItHelps:
              "Hands-on experience with visible results.",
            href: "https://corpsnetwork.org",
            formatLabel: "Local",
          },
          {
            id: "garden",
            title: "Community Gardens",
            mode: "local",
            provider: "Community Garden",
            summary:
              "Work on local sustainability and food systems.",
            whyItHelps:
              "Connects environment to everyday life.",
            href: "https://www.communitygarden.org",
            formatLabel: "Local",
          },
          {
            id: "surfrider",
            title: "Surfrider Foundation",
            mode: "local",
            provider: "Surfrider",
            summary:
              "Join beach cleanup and protection efforts.",
            whyItHelps:
              "Visible, real-world environmental impact.",
            href: "https://www.surfrider.org",
            formatLabel: "Local",
          },
        ],
      },
      {
        id: "online",
        title: "Online",
        description:
          "Ways to engage with environmental work digitally.",
        items: [
          {
            id: "un",
            title: "UN Online Volunteering",
            mode: "virtual",
            provider: "UN",
            summary:
              "Support environmental projects globally.",
            whyItHelps:
              "Global impact from anywhere.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online",
          },
          {
            id: "earthwatch",
            title: "Earthwatch",
            mode: "virtual",
            provider: "Earthwatch",
            summary:
              "Citizen science and research opportunities.",
            whyItHelps:
              "Engage with real data and science.",
            href: "https://earthwatch.org",
            formatLabel: "Online",
          },
          {
            id: "coursera",
            title: "Environmental Courses",
            mode: "virtual",
            provider: "Coursera",
            summary:
              "Learn environmental systems.",
            whyItHelps:
              "Understand deeper impact.",
            href: "https://www.coursera.org",
            formatLabel: "Online",
          },
          {
            id: "ecosystem",
            title: "UN Ecosystem Restoration",
            mode: "virtual",
            provider: "UN",
            summary:
              "Explore global restoration efforts.",
            whyItHelps:
              "See global + local connection.",
            href: "https://www.decadeonrestoration.org",
            formatLabel: "Online",
          },
          {
            id: "climate",
            title: "UN Climate Action",
            mode: "virtual",
            provider: "UN",
            summary:
              "Engage with climate initiatives.",
            whyItHelps:
              "Join real global conversations.",
            href: "https://www.un.org/en/climatechange",
            formatLabel: "Online",
          },
        ],
      },
    ],
  },
};