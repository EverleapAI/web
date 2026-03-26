// apps/web/src/app/(app)/main/explore/impact/_data/mock/healthSupportPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const HEALTH_SUPPORT_PATH: ImpactPathContent = {
  id: "health-support",
  slug: "health-support",
  lane: "impact",

  theme: {
    tone: "steady-care",
    accent: { r: 92, g: 196, b: 210 },
    accentStrong: { r: 54, g: 158, b: 184 },
    glow: { r: 54, g: 158, b: 184 },
    surfaceLabel: "Steady care",
  },

  card: {
    title: "Health & Support",
    hook: "Show up for people when care, calm, and steadiness matter most.",
    description:
      "Not all impact is loud. Some of the most important forms of service come from helping people feel supported, informed, safe, and less alone. This path fits people who bring care, steadiness, and practical help into real situations.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Health & Support",
    hook: "Helping people feel seen, supported, and safer.",
    summary:
      "Health support can begin long before someone chooses a medical career. It can look like volunteering, peer support, public health awareness, helping families navigate resources, or being the kind of person who notices when someone needs help and responds with calm, practical care.",
    whyItPullsYouIn: [
      "You notice when someone is struggling, stressed, or overwhelmed.",
      "You like being useful in ways that feel calming and real.",
      "You care about people having access to support, information, and dignity.",
    ],
  },

  traitChips: [
    { id: "steady", label: "Steady presence" },
    { id: "caring", label: "Caring energy" },
    { id: "practical", label: "Practical helper" },
  ],

  fitSignals: [
    {
      id: "notices-needs",
      label: "You notice when people need support",
      score: 5,
      explanation:
        "You tend to pick up on stress, discomfort, or needs that other people miss.",
    },
    {
      id: "calm-under-pressure",
      label: "You stay calm when things feel intense",
      score: 4,
      explanation:
        "When situations get emotional or messy, you often become more grounded and useful.",
    },
    {
      id: "care-through-action",
      label: "You care through action",
      score: 4,
      explanation:
        "You do not only feel empathy — you want to do something practical that helps.",
    },
  ],

  branchPreviews: [
    {
      id: "peer-support",
      slug: "peer-support",
      title: "Peer Support",
      oneLiner: "Helping people feel less alone and more understood.",
      whyItCouldFit:
        "Some of the most meaningful support starts with listening well and showing up consistently.",
      energy: "people",
    },
    {
      id: "community-health",
      slug: "community-health",
      title: "Community Health",
      oneLiner:
        "Helping people access information, care, and healthier routines.",
      whyItCouldFit:
        "Health impact also includes education, outreach, and helping communities navigate resources.",
      energy: "grounded",
    },
  ],

  branches: [
    {
      id: "peer-support",
      slug: "peer-support",
      title: "Peer Support",
      summary:
        "Support work often begins with being someone who listens well, notices what others are carrying, and helps create safer spaces for honest conversation.",
      whatYouActuallyDo: [
        "Listen without rushing people",
        "Offer encouragement and grounded support",
        "Help connect someone to trusted adults or resources when needed",
      ],
      skillsThatGrowHere: [
        "Active listening",
        "Empathy with boundaries",
        "Communication under stress",
      ],
      starterProjects: [
        "Help build a peer-support check-in habit in a club or team",
        "Volunteer in a school wellness or support setting",
        "Create a simple resource list for students who need help",
      ],
      atmosphere:
        "Human, steady, and centered on trust, listening, and showing up well.",
    },
    {
      id: "community-health",
      slug: "community-health",
      title: "Community Health",
      summary:
        "Health support can also mean helping people understand resources, prevention, routines, and the kinds of support that make daily life healthier.",
      whatYouActuallyDo: [
        "Share practical health or wellness information",
        "Support community outreach efforts",
        "Help people find programs, services, or safe next steps",
      ],
      skillsThatGrowHere: [
        "Clear communication",
        "Resource navigation",
        "Service-minded problem solving",
      ],
      starterProjects: [
        "Volunteer at a local food, wellness, or family support event",
        "Create a simple guide to local youth support resources",
        "Help with outreach for a school or community wellness initiative",
      ],
      atmosphere:
        "Grounded, caring, and focused on helping people feel more supported in everyday life.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Support starts small: noticing someone, checking in, and helping in a way that is actually useful.",
    actions: [
      {
        id: "build-support-list",
        title: "Build a Local Support List",
        type: "research",
        effort: "light",
        timeEstimate: "1–2 hours",
        whyThisMatters:
          "A simple, trustworthy list of local support options can make it easier for someone to take a real next step.",
        instructions: [
          "Find 3 to 5 local or school-based support resources for teens or families.",
          "Write one sentence on what each one helps with.",
          "Keep the list simple, calm, and easy to scan.",
          "Share it only in an appropriate setting where it could genuinely help.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "This path can feel quiet but deeply meaningful — less about attention, more about steadiness and usefulness.",
    moments: [
      {
        id: "someone-opens-up",
        title: "Someone Opens Up",
        body:
          "A person trusts you enough to be honest about what they are carrying, and your calm response helps them feel less alone.",
      },
      {
        id: "small-help-big-relief",
        title: "A Small Help Brings Real Relief",
        body:
          "You connect someone to information, support, or a next step that genuinely makes their situation feel more manageable.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Support skills grow through experience, boundaries, trust, and learning how to help without trying to fix everything alone.",
    stages: [
      {
        id: "showing-up",
        label: "Showing Up",
        timeframe: "Weeks–Months",
        summary:
          "You begin by being a reliable, caring presence and learning how to listen and respond well.",
        signalsOfProgress: [
          "People feel comfortable talking to you",
          "You get better at offering calm, practical support",
        ],
      },
      {
        id: "serving-with-skill",
        label: "Serving With Skill",
        timeframe: "Months–Years",
        summary:
          "You start volunteering, helping with support systems, or learning more about wellness, outreach, and community care.",
        signalsOfProgress: [
          "You know when and how to connect people to real resources",
          "You can support others while keeping healthy boundaries",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "Support becomes real when you step into environments where people actually need care, attention, and help.",

    actions: [
      {
        id: "volunteer-support-setting",
        title: "Volunteer in a Support Setting",
        type: "join",
        effort: "medium",
        timeEstimate: "2–4 weeks to begin",
        whyThisMatters:
          "Real service settings show you how support actually works with real people.",
        instructions: [
          "Find a youth-friendly volunteer role.",
          "Show up once and observe.",
          "Take on a small task.",
          "Notice what kind of support feels meaningful.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "local",
        title: "Near you",
        description:
          "Ways to support people in real-world settings.",
        items: [
          {
            id: "volunteermatch",
            title: "VolunteerMatch – Support Roles",
            mode: "local",
            provider: "VolunteerMatch",
            summary:
              "Find local opportunities supporting food, families, or wellness.",
            whyItHelps:
              "You step into real support environments.",
            href: "https://www.volunteermatch.org",
            formatLabel: "Local",
          },
          {
            id: "bgca",
            title: "Boys & Girls Club",
            mode: "local",
            provider: "BGCA",
            summary:
              "Support youth in safe, structured environments.",
            whyItHelps:
              "You build real relationships.",
            href: "https://www.bgca.org",
            formatLabel: "Local",
          },
          {
            id: "ymca",
            title: "YMCA Programs",
            mode: "local",
            provider: "YMCA",
            summary:
              "Help with youth and community programs.",
            whyItHelps:
              "You gain hands-on support experience.",
            href: "https://www.ymca.org",
            formatLabel: "Local",
          },
          {
            id: "food-bank",
            title: "Feeding America",
            mode: "local",
            provider: "Feeding America",
            summary:
              "Support food distribution programs.",
            whyItHelps:
              "Direct, meaningful impact.",
            href: "https://www.feedingamerica.org",
            formatLabel: "Local",
          },
          {
            id: "red-cross",
            title: "American Red Cross",
            mode: "local",
            provider: "Red Cross",
            summary:
              "Support emergency and community services.",
            whyItHelps:
              "Learn structured care systems.",
            href: "https://www.redcross.org",
            formatLabel: "Local",
          },
        ],
      },
      {
        id: "online",
        title: "Online",
        description:
          "Ways to support people and learn remotely.",
        items: [
          {
            id: "un",
            title: "UN Online Volunteering",
            mode: "virtual",
            provider: "UN",
            summary:
              "Support global programs remotely.",
            whyItHelps:
              "Real-world experience.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online",
          },
          {
            id: "dosomething",
            title: "DoSomething",
            mode: "virtual",
            provider: "DoSomething",
            summary:
              "Youth action campaigns.",
            whyItHelps:
              "Structured entry into impact.",
            href: "https://www.dosomething.org",
            formatLabel: "Online",
          },
          {
            id: "coursera",
            title: "Health Courses",
            mode: "virtual",
            provider: "Coursera",
            summary:
              "Learn about health systems.",
            whyItHelps:
              "Build understanding.",
            href: "https://www.coursera.org",
            formatLabel: "Online",
          },
          {
            id: "mental-health",
            title: "Mental Health Resources",
            mode: "virtual",
            provider: "NAMI",
            summary:
              "Explore mental health education.",
            whyItHelps:
              "Understand support systems.",
            href: "https://www.nami.org",
            formatLabel: "Online",
          },
          {
            id: "crisis",
            title: "988 Lifeline Info",
            mode: "virtual",
            provider: "988",
            summary:
              "Learn about crisis support systems.",
            whyItHelps:
              "Understand real support structures.",
            href: "https://988lifeline.org",
            formatLabel: "Online",
          },
        ],
      },
    ],
  },
};