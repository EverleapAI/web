// apps/web/src/app/(app)/main/explore/impact/_data/mock/communityLeadershipPath.ts

import type { ImpactPathContent } from "../impactPathSchema";

export const COMMUNITY_LEADERSHIP_PATH: ImpactPathContent = {
  id: "community-leadership",
  slug: "community-leadership",
  lane: "impact",

  theme: {
    tone: "community-builder",
    accent: { r: 255, g: 166, b: 92 },
    accentStrong: { r: 255, g: 120, b: 80 },
    glow: { r: 255, g: 120, b: 80 },
    surfaceLabel: "Local momentum",
  },

  card: {
    title: "Community Leadership",
    hook:
      "You notice when something could be better — and instead of waiting, you start pulling people together to fix it.",
    description:
      "Community leadership is not about being the loudest person in the room. It is about noticing what a group, school, neighborhood, or shared space needs, then helping people move from good intentions into real action. That can look like organizing volunteers, leading a project, starting an initiative, or helping a community respond when something matters.",
  },

  hero: {
    eyebrow: "Impact Path",
    title: "Community Leadership",
    hook:
      "Bringing people together around something real, then helping that momentum turn into change.",
    summary:
      "Some people see a problem and assume someone else will handle it. Others start asking who could help, what the first step is, and how to get people moving. Community leadership often starts small: improving a campus, organizing neighbors, helping a local group run better, or turning one shared frustration into a real project. Over time, it becomes a way of helping people trust each other, work together, and actually get things done.",
    whyItPullsYouIn: [
      "You notice what could be better in a group, place, or shared system.",
      "You like helping people coordinate around a goal instead of staying stuck in talk.",
      "You get energy from seeing people come together and make something happen.",
    ],
  },

  traitChips: [
    { id: "organizer", label: "Organizer energy" },
    { id: "people-oriented", label: "People oriented" },
    { id: "initiative", label: "Takes initiative" },
    { id: "momentum", label: "Builds momentum" },
  ],

  fitSignals: [
    {
      id: "group-momentum",
      label: "You help groups get moving",
      score: 4,
      explanation:
        "When a group feels slow, scattered, or unsure, you often bring structure, encouragement, or a next step that helps people start moving again.",
    },
    {
      id: "shared-space-awareness",
      label: "You notice when a group or space is not working",
      score: 4,
      explanation:
        "You pay attention to how places and systems affect people, and you do not just shrug when something feels disorganized, disconnected, or overlooked.",
    },
    {
      id: "action-builder",
      label: "You like turning ideas into action",
      score: 5,
      explanation:
        "You enjoy helping an idea leave the talking stage and become something visible, organized, and real.",
    },
    {
      id: "people-coordination",
      label: "You can rally people around a shared goal",
      score: 4,
      explanation:
        "You are often good at helping different people see the same goal and feel like they have a role in it.",
    },
  ],

  branchPreviews: [
    {
      id: "school-leadership",
      slug: "school-leadership",
      title: "School Leadership",
      oneLiner:
        "Running clubs, events, or student projects that actually get people involved.",
      whyItCouldFit:
        "Schools constantly need students who can coordinate people, build trust, and help ideas turn into action.",
      energy: "people",
    },
    {
      id: "neighborhood-projects",
      slug: "neighborhood-projects",
      title: "Neighborhood Projects",
      oneLiner:
        "Improving the places people live through visible, practical local action.",
      whyItCouldFit:
        "A lot of community leadership starts with one person deciding a place deserves better and helping others show up for it.",
      energy: "builder",
    },
    {
      id: "community-organizing",
      slug: "community-organizing",
      title: "Community Organizing",
      oneLiner:
        "Helping people build momentum around an issue that affects their daily lives.",
      whyItCouldFit:
        "This path fits people who care about relationships, coordination, and helping groups act with purpose.",
      energy: "organizer",
    },
  ],

  branches: [
    {
      id: "school-leadership",
      slug: "school-leadership",
      title: "School Leadership",
      summary:
        "A lot of leadership starts inside school communities where students organize clubs, events, campaigns, and service projects that actually affect daily life.",
      whatYouActuallyDo: [
        "Organize events, projects, or student initiatives",
        "Coordinate volunteers and keep people on track",
        "Work with teachers, staff, or administrators to move ideas forward",
      ],
      skillsThatGrowHere: [
        "Communication",
        "Coordination",
        "Follow-through",
        "Decision-making",
      ],
      starterProjects: [
        "Start a student project that improves one part of campus life",
        "Lead a club event with a clear goal and timeline",
        "Coordinate volunteers for a school-based service effort",
      ],
      atmosphere:
        "Fast-moving, social, and often messy in a useful way. You learn to lead while people are counting on you.",
    },
    {
      id: "neighborhood-projects",
      slug: "neighborhood-projects",
      title: "Neighborhood Projects",
      summary:
        "Local places improve because someone decides to stop waiting and start organizing the people, materials, and momentum around a practical goal.",
      whatYouActuallyDo: [
        "Plan visible improvement efforts",
        "Work with neighbors, local groups, or community spaces",
        "Coordinate volunteers, supplies, and communication",
      ],
      skillsThatGrowHere: [
        "Project planning",
        "Community engagement",
        "Resourcefulness",
        "Problem solving",
      ],
      starterProjects: [
        "Organize a clean-up, donation drive, or improvement day",
        "Help run a local event that brings people together",
        "Join a neighborhood project and take ownership of one piece of it",
      ],
      atmosphere:
        "Grounded, practical, and community-facing. You see the effect of your effort in real places and with real people.",
    },
    {
      id: "community-organizing",
      slug: "community-organizing",
      title: "Community Organizing",
      summary:
        "Community organizing is about helping people move from shared frustration or hope into coordinated action around something that matters.",
      whatYouActuallyDo: [
        "Talk with people about what is affecting them",
        "Help identify a clear issue or goal",
        "Coordinate meetings, outreach, and collective action",
      ],
      skillsThatGrowHere: [
        "Listening",
        "Facilitation",
        "Strategic thinking",
        "Momentum building",
      ],
      starterProjects: [
        "Help organize a small campaign around one local issue",
        "Bring a few people together to discuss a problem and next step",
        "Support outreach or coordination for a community cause",
      ],
      atmosphere:
        "Relational, mission-driven, and energizing when people begin to believe their effort can actually matter.",
    },
  ],

  tryNow: {
    title: "Try This",
    summary:
      "Leadership gets clearer when you stop imagining it and start helping a real group move around one visible goal.",
    actions: [
      {
        id: "organize-small-project",
        title: "Organize a Small Project",
        type: "project",
        effort: "medium",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Even a small project teaches you how to coordinate people, make decisions, and keep momentum alive once something depends on you.",
        instructions: [
          "Pick something small that actually bothers you or feels worth improving.",
          "Ask 2–4 people to help instead of trying to do everything alone.",
          "Set one clear goal, one deadline, and one way to know you finished.",
          "Notice what happened when other people started relying on you.",
        ],
      },
      {
        id: "run-one-meeting",
        title: "Run One Useful Meeting",
        type: "conversation",
        effort: "light",
        timeEstimate: "30–45 minutes",
        whyThisMatters:
          "A lot of leadership is not grand speeches. It is helping a group leave a conversation with clarity and next steps.",
        instructions: [
          "Gather a few people around one issue or idea.",
          "Keep the goal simple and specific.",
          "End with one decision and one next action.",
          "Pay attention to how the group changes when someone gives structure.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "How It Often Feels",
    summary:
      "Community leadership can feel energizing, messy, visible, and deeply real because your effort affects other people directly.",
    moments: [
      {
        id: "starting-something",
        title: "Starting Something",
        body:
          "You notice a need, stop waiting for the perfect moment, and begin pulling together the first few people who care enough to do something.",
      },
      {
        id: "people-show-up",
        title: "People Start Showing Up",
        body:
          "What was just an idea begins to feel real because other people bring energy, questions, and commitment into it.",
      },
      {
        id: "you-are-responsible",
        title: "You Realize People Are Counting on You",
        body:
          "Leadership starts feeling different when your follow-through affects whether the project actually happens.",
      },
    ],
  },

  growthPath: {
    title: "How This Path Grows",
    summary:
      "Leadership usually grows through repetition: small wins, more trust, more coordination, and bigger things that people are willing to build with you.",
    stages: [
      {
        id: "first-steps",
        label: "First Steps",
        timeframe: "Weeks–Months",
        summary:
          "You start by helping with a project, organizing something small, or becoming the person who keeps a group moving.",
        signalsOfProgress: [
          "People respond to your ideas",
          "You can get a few people coordinated around one goal",
          "You finish something visible",
        ],
      },
      {
        id: "growing-trust",
        label: "Growing Trust",
        timeframe: "Months–1 year",
        summary:
          "People begin trusting you with more responsibility because you are reliable, organized, and able to keep energy from fading.",
        signalsOfProgress: [
          "Others ask you to lead or coordinate",
          "Projects become more ambitious",
          "You get better at communication and follow-through",
        ],
      },
      {
        id: "wider-impact",
        label: "Wider Impact",
        timeframe: "1+ years",
        summary:
          "You start shaping not just one project, but the way groups work together, make decisions, and sustain momentum over time.",
        signalsOfProgress: [
          "You can lead across different personalities and situations",
          "You help build systems, not just events",
          "People trust your judgment in high-stakes moments",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Try this for real",
    summary:
      "The fastest way to understand leadership is to step into something real. These are ways to start organizing, contributing, or joining active efforts right now.",
    actions: [
      {
        id: "join-local-org",
        title: "Join a Local Organization",
        type: "join",
        effort: "light",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "You learn leadership faster by stepping into real groups than by trying to simulate it alone.",
        instructions: [
          "Find a local group working on something you actually care about.",
          "Show up once before deciding whether it fits.",
          "Offer to help organize or coordinate one small piece of the work.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "local-opportunities",
        title: "Near you",
        description:
          "Ways to step into leadership in your local community and start working with real people.",
        items: [
          {
            id: "volunteermatch-local-projects",
            title: "VolunteerMatch – Local Projects",
            mode: "local",
            provider: "VolunteerMatch",
            summary:
              "Browse active volunteer opportunities nearby that often need coordination, planning, and people who can help keep things moving.",
            whyItHelps:
              "You step into real community efforts where leadership matters immediately.",
            href: "https://www.volunteermatch.org",
            formatLabel: "Local / Flexible",
          },
          {
            id: "city-youth-programs",
            title: "City Youth & Community Programs",
            mode: "local",
            provider: "Local City Programs",
            summary:
              "Many cities run youth councils, advisory groups, leadership programs, and local improvement efforts you can join.",
            whyItHelps:
              "You get responsibility inside real public-facing projects, not just practice exercises.",
            href: "https://www.usa.gov/local-governments",
            formatLabel: "Local",
          },
          {
            id: "ymca-youth-leadership",
            title: "YMCA Youth Leadership Programs",
            mode: "local",
            provider: "YMCA",
            summary:
              "Explore leadership and service opportunities through YMCA youth development and local community programs.",
            whyItHelps:
              "You practice leadership in a structured environment where teamwork and initiative both matter.",
            href: "https://www.ymca.org",
            formatLabel: "Local / Program",
          },
          {
            id: "rotary-interact-clubs",
            title: "Rotary Interact Clubs",
            mode: "local",
            provider: "Rotary",
            summary:
              "Student-led service clubs that organize local projects, fundraisers, and community initiatives.",
            whyItHelps:
              "You learn leadership by helping real projects happen, not by just talking about them.",
            href: "https://www.rotary.org/en/get-involved/interact-clubs",
            formatLabel: "Local / Club",
          },
          {
            id: "4h-youth-leadership",
            title: "4-H Youth Leadership & Community Service",
            mode: "local",
            provider: "4-H",
            summary:
              "Many local 4-H programs include youth leadership, event planning, service work, and community-based team projects.",
            whyItHelps:
              "You build leadership through practical projects with visible outcomes.",
            href: "https://4-h.org",
            formatLabel: "Local / Youth Program",
          },
        ],
      },
      {
        id: "virtual-opportunities",
        title: "Online",
        description:
          "Ways to practice leadership, organizing, and coordination in online communities and larger social-impact projects.",
        items: [
          {
            id: "count-me-in-campaigns",
            title: "Count Me In – Social Impact Campaigns",
            mode: "virtual",
            provider: "Count Me In",
            summary:
              "Join youth-led campaigns and action projects focused on civic, social, and community issues.",
            whyItHelps:
              "You contribute to active movements and learn how people organize around something that matters.",
            href: "https://www.wearecountmein.com",
            formatLabel: "Online",
          },
          {
            id: "change-org-campaign",
            title: "Change.org – Start or Support a Campaign",
            mode: "virtual",
            provider: "Change.org",
            summary:
              "Support a cause or create a petition around an issue you care about and learn how digital momentum builds.",
            whyItHelps:
              "You practice rallying people around a shared problem and a visible next step.",
            href: "https://www.change.org",
            formatLabel: "Online",
          },
          {
            id: "dosomething-youth-action",
            title: "DoSomething – Youth Action Campaigns",
            mode: "virtual",
            provider: "DoSomething.org",
            summary:
              "Take part in guided campaigns designed to help young people turn concern into action.",
            whyItHelps:
              "You get structured ways to organize, participate, and build action habits.",
            href: "https://www.dosomething.org",
            formatLabel: "Online",
          },
          {
            id: "online-community-projects",
            title: "Online Community Projects",
            mode: "virtual",
            provider: "Digital Communities",
            summary:
              "Join mission-driven Discord, Slack, or forum communities where organizers keep projects, people, and conversations moving.",
            whyItHelps:
              "Digital leadership is real leadership, especially when coordination and trust matter.",
            href: "https://discord.com",
            formatLabel: "Online / Community",
          },
          {
            id: "un-online-volunteering",
            title: "UN Online Volunteering",
            mode: "virtual",
            provider: "United Nations",
            summary:
              "Explore remote volunteer roles connected to real organizations and global social-impact work.",
            whyItHelps:
              "You gain experience contributing across teams, causes, and cultures in a real-world system.",
            href: "https://www.onlinevolunteering.org",
            formatLabel: "Online / Global",
          },
        ],
      },
    ],
  },
};