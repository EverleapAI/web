// apps/web/src/app/(app)/main/explore/impact/_data/mock/localServicePath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const LOCAL_SERVICE_PATH: ImpactPathContent = {
  id: "local-service",
  slug: "local-service",
  lane: "impact",

  theme: {
    tone: "neighbors-first",
    accent: { r: 255, g: 180, b: 102 },
    accentStrong: { r: 255, g: 140, b: 82 },
    glow: { r: 255, g: 140, b: 82 },
    surfaceLabel: "Neighbors first",
  },

  card: {
    title: "Local Service",
    hook: "Help people around you in ways that actually matter.",
    description:
      "Local service is often the most immediate way to make an impact. It focuses on helping real people in your community — through volunteering, supporting organizations, and showing up where help is needed.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Local Service",
    hook: "Helping your community thrive.",
    summary:
      "Service begins close to home. Whether supporting food programs, helping community centers, assisting families, or improving shared spaces, local service is about practical contributions that improve everyday life.",
    whyItPullsYouIn: [
      "You like helping people in ways that feel direct and useful.",
      "You enjoy being part of something bigger than yourself.",
      "You want to see real improvements in the community around you.",
    ],
  },

  traitChips: [
    { id: "service-minded", label: "Service minded" },
    { id: "reliable", label: "Reliable helper" },
    { id: "community", label: "Community focused" },
  ],

  fitSignals: [
    {
      id: "shows-up",
      label: "You show up when help is needed",
      score: 4,
      explanation:
        "You are someone people trust when a group needs support or extra hands.",
    },
    {
      id: "practical-helper",
      label: "You like practical impact",
      score: 5,
      explanation:
        "You prefer helping through real actions rather than abstract ideas.",
    },
    {
      id: "community-awareness",
      label: "You care about your local community",
      score: 4,
      explanation:
        "You notice when people or places around you need support.",
    },
  ],

  branchPreviews: [
    {
      id: "community-volunteering",
      slug: "community-volunteering",
      title: "Community Volunteering",
      oneLiner: "Helping organizations serve people better.",
      whyItCouldFit:
        "Local nonprofits and programs depend on volunteers who care and show up.",
      energy: "people",
    },
    {
      id: "service-projects",
      slug: "service-projects",
      title: "Service Projects",
      oneLiner: "Organizing projects that improve shared spaces.",
      whyItCouldFit:
        "Small projects can make visible improvements in neighborhoods and schools.",
      energy: "builder",
    },
  ],

  branches: [
    {
      id: "community-volunteering",
      slug: "community-volunteering",
      title: "Community Volunteering",
      summary:
        "Many organizations rely on volunteers to help run programs that support families, youth, and vulnerable communities.",
      whatYouActuallyDo: [
        "Assist with community programs or events",
        "Support staff and volunteers with logistics",
        "Help deliver services that support families or individuals",
      ],
      skillsThatGrowHere: [
        "Teamwork",
        "Responsibility",
        "Community awareness",
      ],
      starterProjects: [
        "Volunteer at a community event",
        "Help a nonprofit with a one-day service project",
        "Join a school or club service initiative",
      ],
      atmosphere:
        "Welcoming, purposeful, and centered on helping others succeed.",
    },
    {
      id: "service-projects",
      slug: "service-projects",
      title: "Service Projects",
      summary:
        "Service projects focus on identifying a need and organizing a team to help address it.",
      whatYouActuallyDo: [
        "Plan and coordinate small service initiatives",
        "Work with community members or organizations",
        "Help improve shared spaces or programs",
      ],
      skillsThatGrowHere: [
        "Planning",
        "Leadership",
        "Collaboration",
      ],
      starterProjects: [
        "Organize a neighborhood cleanup",
        "Help coordinate a donation drive",
        "Improve a shared community space",
      ],
      atmosphere:
        "Active, cooperative, and focused on visible results.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Service often begins with noticing one place where help would matter.",
    actions: [
      {
        id: "help-local-project",
        title: "Help a Local Project",
        type: "join",
        effort: "light",
        timeEstimate: "1–3 hours",
        whyThisMatters:
          "Joining a real service effort shows how communities collaborate to help people.",
        instructions: [
          "Look for a volunteer opportunity in your school or neighborhood.",
          "Choose something simple and practical.",
          "Participate and notice what kind of work energizes you.",
          "Reflect on how the project helped people or places.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Local service feels tangible — the kind of impact you can see and feel immediately.",
    moments: [
      {
        id: "team-effort",
        title: "Working Together",
        body:
          "A group of people works together to solve a real problem in the community.",
      },
      {
        id: "visible-change",
        title: "Seeing the Difference",
        body:
          "A space, program, or event improves because people showed up to help.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Service grows through commitment, responsibility, and increasing leadership.",
    stages: [
      {
        id: "first-volunteer",
        label: "First Volunteer Experiences",
        timeframe: "Weeks–Months",
        summary:
          "You start by participating in service events and helping with simple tasks.",
        signalsOfProgress: [
          "You begin volunteering more regularly",
          "You learn how community organizations operate",
        ],
      },
      {
        id: "service-leader",
        label: "Service Leadership",
        timeframe: "Months–Years",
        summary:
          "You begin organizing or leading service projects that bring others together.",
        signalsOfProgress: [
          "You coordinate volunteers or events",
          "You help design service initiatives",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "Service becomes real when you step into environments where people actually need help and consistency.",

    actions: [
      {
        id: "find-local-volunteer-role",
        title: "Find a Volunteer Role",
        type: "join",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Consistent service builds trust and allows you to contribute meaningfully.",
        instructions: [
          "Search for local volunteer roles.",
          "Pick something practical.",
          "Show up once.",
          "Notice what fits.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "local",
        title: "Near you",
        description:
          "Ways to help people and communities directly.",
        items: [
          {
            id: "volunteermatch",
            title: "VolunteerMatch",
            mode: "local",
            provider: "VolunteerMatch",
            summary:
              "Find local volunteer opportunities.",
            whyItHelps:
              "Direct entry into service work.",
            href: "https://www.volunteermatch.org",
            formatLabel: "Local",
          },
          {
            id: "feeding-america",
            title: "Feeding America",
            mode: "local",
            provider: "Feeding America",
            summary:
              "Support food programs.",
            whyItHelps:
              "Immediate, visible impact.",
            href: "https://www.feedingamerica.org",
            formatLabel: "Local",
          },
          {
            id: "habitat",
            title: "Habitat for Humanity",
            mode: "local",
            provider: "Habitat",
            summary:
              "Help build homes.",
            whyItHelps:
              "Physical, meaningful results.",
            href: "https://www.habitat.org",
            formatLabel: "Local",
          },
          {
            id: "bgca",
            title: "Boys & Girls Club",
            mode: "local",
            provider: "BGCA",
            summary:
              "Support youth programs.",
            whyItHelps:
              "Build relationships.",
            href: "https://www.bgca.org",
            formatLabel: "Local",
          },
          {
            id: "red-cross",
            title: "American Red Cross",
            mode: "local",
            provider: "Red Cross",
            summary:
              "Support community services.",
            whyItHelps:
              "Learn structured service.",
            href: "https://www.redcross.org",
            formatLabel: "Local",
          },
        ],
      },
      {
        id: "online",
        title: "Online",
        description:
          "Ways to contribute remotely.",
        items: [
          {
            id: "un",
            title: "UN Volunteering",
            mode: "virtual",
            provider: "UN",
            summary:
              "Remote service opportunities.",
            whyItHelps:
              "Global impact.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online",
          },
          {
            id: "dosomething",
            title: "DoSomething",
            mode: "virtual",
            provider: "DoSomething",
            summary:
              "Youth campaigns.",
            whyItHelps:
              "Easy entry.",
            href: "https://www.dosomething.org",
            formatLabel: "Online",
          },
          {
            id: "catchafire",
            title: "Catchafire",
            mode: "virtual",
            provider: "Catchafire",
            summary:
              "Skill-based volunteering.",
            whyItHelps:
              "Build experience.",
            href: "https://www.catchafire.org",
            formatLabel: "Online",
          },
          {
            id: "idealist",
            title: "Idealist",
            mode: "virtual",
            provider: "Idealist",
            summary:
              "Service opportunities.",
            whyItHelps:
              "Wide range.",
            href: "https://www.idealist.org",
            formatLabel: "Online",
          },
          {
            id: "points-of-light",
            title: "Points of Light",
            mode: "virtual",
            provider: "Points of Light",
            summary:
              "Volunteer network.",
            whyItHelps:
              "Find roles easily.",
            href: "https://www.pointsoflight.org",
            formatLabel: "Online",
          },
        ],
      },
    ],
  },
};