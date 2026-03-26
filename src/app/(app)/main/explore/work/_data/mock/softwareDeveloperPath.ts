// apps/web/src/app/(app)/main/explore/work/_data/mock/softwareDeveloperPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const SOFTWARE_DEVELOPER_PATH: WorkPathContent = {
  id: "software-developer",
  slug: "software-developer",
  lane: "work",

  theme: {
    tone: "future-build",
    accent: { r: 56, g: 189, b: 248 },
    accentStrong: { r: 14, g: 165, b: 233 },
    glow: { r: 56, g: 189, b: 248 },
  },

  card: {
    title: "Software Developer",
    hook: "Build the systems everything runs on",
    description:
      "Design, build, and improve software that powers apps, games, tools, and entire companies.",
  },

  hero: {
    eyebrow: "Work",
    title: "Software Developer",
    hook: "Build the systems everything runs on",
    summary:
      "Software developers turn ideas into real, working systems. From apps to infrastructure, this work shapes how people live and work.",
    whyItPullsYouIn: [
      "You like building things that actually work",
      "You enjoy solving complex problems",
      "You want to create tools people use every day",
    ],
  },

  traitChips: [
    { id: "logic", label: "Logic" },
    { id: "build", label: "Build" },
    { id: "systems", label: "Systems" },
  ],

  fitSignals: [
    {
      id: "problem-solving",
      label: "Problem solving",
      score: 88,
      explanation:
        "You enjoy breaking problems down and figuring them out step by step.",
    },
    {
      id: "focus",
      label: "Deep focus",
      score: 82,
      explanation: "You can stay with a problem until it works.",
    },
  ],

  snapshotStats: [
    {
      id: "salary",
      label: "Median salary",
      value: "$133K",
      note: "BLS (US)",
    },
  ],

  specialtyPreviews: [
    {
      id: "frontend",
      slug: "frontend",
      title: "Frontend Developer",
      oneLiner: "Builds what users actually see and interact with.",
      whyItCouldFit:
        "Strong if you care about visuals, responsiveness, and user experience.",
      energy: "craft",
    },
    {
      id: "backend",
      slug: "backend",
      title: "Backend Developer",
      oneLiner: "Builds the logic, APIs, and systems behind the scenes.",
      whyItCouldFit:
        "Strong if you like systems, data, and how things actually work.",
      energy: "systems",
    },
    {
      id: "fullstack",
      slug: "fullstack",
      title: "Full Stack Developer",
      oneLiner: "Builds entire products end-to-end.",
      whyItCouldFit:
        "Strong if you want to create complete working apps yourself.",
      energy: "systems",
    },
    {
      id: "mobile",
      slug: "mobile",
      title: "Mobile Developer",
      oneLiner: "Builds apps for phones and tablets.",
      whyItCouldFit:
        "Strong if you want to build things people carry every day.",
      energy: "craft",
    },
    {
      id: "ai",
      slug: "ai-engineer",
      title: "AI / ML Engineer",
      oneLiner: "Builds systems that learn, predict, and generate.",
      whyItCouldFit:
        "Strong if you are drawn to data, intelligence, and cutting-edge tools.",
      energy: "high-creative",
    },
  ],

  specialties: [
    {
      id: "frontend",
      slug: "frontend",
      title: "Frontend Developer",
      summary:
        "Frontend developers build what users actually see and interact with. They shape the interface, responsiveness, and moment-to-moment feel of the product.",
      whatYouActuallyDo: [
        "Build interfaces using React, HTML, and CSS",
        "Make apps responsive, accessible, and fast",
        "Work closely with design and product decisions",
      ],
      skillsThatGrowHere: [
        "UI development",
        "Interaction thinking",
        "Accessibility",
        "Performance optimization",
      ],
      starterProjects: [
        "Build a personal website with polished interactions",
        "Clone the UI of a simple app you admire",
        "Create a small tool with inputs, state, and live feedback",
      ],
      atmosphere:
        "Fast, visual, and detail-heavy. Strong if you like seeing your work immediately.",
    },
    {
      id: "backend",
      slug: "backend",
      title: "Backend Developer",
      summary:
        "Backend developers build the logic and infrastructure behind applications. They make data move, systems communicate, and products behave reliably at scale.",
      whatYouActuallyDo: [
        "Build APIs and server-side logic",
        "Work with databases and data flow",
        "Handle authentication, permissions, and reliability",
      ],
      skillsThatGrowHere: [
        "System design",
        "Data modeling",
        "API thinking",
        "Debugging",
      ],
      starterProjects: [
        "Build a simple API for a small app",
        "Create a login and user account system",
        "Connect a database to a project and store real data",
      ],
      atmosphere:
        "More invisible than frontend, but deeply satisfying if you care about how things really work.",
    },
    {
      id: "fullstack",
      slug: "fullstack",
      title: "Full Stack Developer",
      summary:
        "Full stack developers build entire applications from front to back. They connect interface, logic, data, and deployment into one working product.",
      whatYouActuallyDo: [
        "Build full apps end-to-end",
        "Connect frontend and backend systems",
        "Ship working products and improve them over time",
      ],
      skillsThatGrowHere: [
        "End-to-end thinking",
        "Product building",
        "Integration",
        "Prioritization",
      ],
      starterProjects: [
        "Build a full web app with login and database",
        "Create a dashboard that stores user data",
        "Launch a tiny SaaS-style project",
      ],
      atmosphere:
        "Broad, practical, and momentum-driven. Strong if you like building complete things.",
    },
    {
      id: "mobile",
      slug: "mobile",
      title: "Mobile Developer",
      summary:
        "Mobile developers build apps for phones and tablets. The work blends software logic with tight interface decisions and device-specific behavior.",
      whatYouActuallyDo: [
        "Build apps with React Native, Swift, or Kotlin",
        "Design mobile-first experiences",
        "Handle device features, gestures, and performance",
      ],
      skillsThatGrowHere: [
        "Mobile UI/UX",
        "Platform-specific development",
        "App performance",
        "User flow thinking",
      ],
      starterProjects: [
        "Build a simple mobile app for one clear use case",
        "Create a habit tracker or daily utility app",
        "Publish a basic app build and test it on a real device",
      ],
      atmosphere:
        "Tactile and product-focused. Strong if you want to build things people carry every day.",
    },
    {
      id: "ai",
      slug: "ai-engineer",
      title: "AI / ML Engineer",
      summary:
        "AI engineers build systems that learn, predict, recommend, or generate. Some of the work is model-focused, but a lot of it is product integration and real-world usefulness.",
      whatYouActuallyDo: [
        "Use models or APIs to create AI-powered features",
        "Work with data, prompts, and outputs",
        "Turn intelligence into something useful inside a product",
      ],
      skillsThatGrowHere: [
        "Data thinking",
        "Model usage",
        "AI integration",
        "Experimentation",
      ],
      starterProjects: [
        "Build a chatbot with an API",
        "Create a recommendation or tagging system",
        "Add an AI feature to a simple existing app",
      ],
      atmosphere:
        "Fast-changing and high-upside. Strong if you like tools that are still evolving in public.",
    },
  ],

  dayInLife: {
    title: "A day building software",
    summary:
      "It is not just writing code. It is solving problems, getting stuck, figuring it out, and finally seeing something work.",
    moments: [
      {
        id: "morning-start",
        timeLabel: "9:15 AM",
        title: "Pick up where things broke",
        body:
          "You open your code and immediately hit something that does not work. That is normal. The day starts with figuring out what is wrong and where to begin.",
      },
      {
        id: "deep-work",
        timeLabel: "10:30 AM",
        title: "Lock into the problem",
        body:
          "You get focused. Time disappears a bit. You test ideas, trace logic, and slowly narrow in on the issue. This is where real progress happens.",
      },
      {
        id: "breakthrough",
        timeLabel: "12:10 PM",
        title: "It finally works",
        body:
          "After trying multiple approaches, something clicks. The system behaves the way it should. That moment is a real payoff - small, but addictive.",
      },
      {
        id: "midday",
        timeLabel: "1:00 PM",
        title: "Reset and talk it through",
        body:
          "You step away or talk with someone. Explaining the problem often helps you see it differently. Software is not always solo.",
      },
      {
        id: "build",
        timeLabel: "2:15 PM",
        title: "Build something real",
        body:
          "Now you are adding features, improving structure, or connecting systems. This is where ideas turn into something people can actually use.",
      },
      {
        id: "debug",
        timeLabel: "3:45 PM",
        title: "Fix what you just built",
        body:
          "New code creates new problems. You debug, adjust, and refine. This loop is constant - build, break, fix, improve.",
      },
      {
        id: "end",
        timeLabel: "5:30 PM",
        title: "You can see the progress",
        body:
          "At the end of the day, something exists that did not exist before. That is the signal. Even small progress compounds over time.",
      },
    ],
  },

  forecast: {
    title: "Where this field is going",
    summary: "Software is everywhere and still expanding.",
    stages: [],
  },

  forecastV2: {
    outlookLabel: "Strong - but raising the bar fast",
    outlookSummary:
      "Software is not slowing down, but the definition of a valuable developer is changing quickly. AI is removing low-level work and increasing expectations. The opportunity is still huge for people who can think, build, and adapt - not just code.",

    metrics: [
      {
        id: "growth",
        label: "Demand",
        value: "+17%",
        tone: "positive",
        note: "Still one of the fastest-growing major fields",
      },
      {
        id: "salary",
        label: "Median pay",
        value: "$133K",
        tone: "positive",
        note: "High ceiling, especially in strong markets",
      },
      {
        id: "ai",
        label: "AI impact",
        value: "Very high",
        tone: "mixed",
        note: "Changing what entry-level even means",
      },
      {
        id: "stability",
        label: "Stability",
        value: "Strong",
        tone: "positive",
        note: "Every industry now depends on software",
      },
    ],

    salaryRange: {
      low: "$75K",
      median: "$133K",
      high: "$200K+",
    },

    industry: {
      sourceLabel: "Bureau of Labor Statistics",
      sourceUrl:
        "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
      growthPercent: "17%",
      annualOpenings: "356,700",
      medianPay: "$133,080",
      educationTypical: "Bachelor's degree",
    },

    whatIsGrowing: [
      "Developers who design systems, not just code screens",
      "Full-stack builders who can ship real products",
      "Developers who use AI well inside their workflow",
    ],

    whatIsUnderPressure: [
      "Basic coding tasks that AI can now generate",
      "Entry-level work built on simple implementation alone",
      "People who learn syntax without building real things",
    ],

    aiImpact: {
      level: "high",
      summary:
        "AI is compressing the bottom of the skill ladder and speeding up everyone else. What used to take a team can now be done by one strong developer using AI well.",
      helpsWith: [
        "Writing and debugging code faster",
        "Learning new frameworks quickly",
        "Reducing repetitive work",
      ],
      putsPressureOn: [
        "Beginner-level coding without deeper understanding",
        "Roles that do not involve real problem-solving",
      ],
      humansStillOwn: [
        "System design and architecture",
        "Understanding users and real-world problems",
        "Deciding what should be built - not just how",
      ],
    },

    whyThisCouldFeelExciting: [
      "You can build and launch real products faster than ever",
      "Small teams can now create surprisingly big things",
      "The ceiling is still extremely high if you get good",
    ],

    whyThisCouldFeelRisky: [
      "The gap between beginner and valuable is getting wider",
      "You cannot rely on just learning to code anymore",
      "You have to keep evolving with the tools",
    ],
  },

  nextSteps: {
    title: "Start building for real",
    summary:
      "You do not need permission to start. The fastest way to understand this path is to build something small, ship it, and keep going.",
    actions: [],
  },

  nextStepsV2: {
    heroTitle: "You can start building real software this week",
    heroSummary:
      "Do not wait until you feel ready. The signal comes from making things that actually run, break, improve, and go live. These are real entry points near you and online.",
    heroBadge: "Start now",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Get in the room with real builders",
        description:
          "Being around people who are building changes the pace of your learning. These are real places where coding stops feeling abstract.",
        mode: "local",
        items: [
          {
            id: "marin-library-lab",
            title: "Marin County Free Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note:
              "Free makerspace and tech environment where you can get close to real tools, projects, and local build energy.",
            badge: "Free / Local",
            mode: "local",
          },
          {
            id: "college-of-marin",
            title: "College of Marin coding and CS courses",
            href: "https://marin.edu/",
            note:
              "A real local college path where you can start learning programming with structure instead of guessing your way through it.",
            badge: "Real Classes",
            mode: "local",
          },
          {
            id: "codeday",
            title: "CodeDay",
            href: "https://www.codeday.org/",
            note:
              "Project-driven events where beginners and builders make something real in a short burst of momentum.",
            badge: "Build Fast",
            mode: "local",
          },
          {
            id: "bay-area-hackathons",
            title: "Bay Area hackathons",
            href: "https://www.eventbrite.com/d/ca--san-francisco/hackathon/",
            note:
              "Short, intense build events where you learn by making and shipping under real constraints.",
            badge: "Ship Something",
            mode: "local",
          },
          {
            id: "maker-space-search",
            title: "Maker spaces near Marin",
            href: "https://www.google.com/search?q=maker+space+Marin+County",
            note:
              "Good if your motivation goes up when you are around people actively building things, not just studying them.",
            badge: "Hands-On",
            mode: "local",
          },
        ],
      },
      {
        id: "remote",
        eyebrow: "Online",
        title: "Where real beginners actually start",
        description:
          "These are not just passive resources. They are places where you can code, ship, and start building a portfolio people can actually see.",
        mode: "remote",
        items: [
          {
            id: "replit",
            title: "Replit",
            href: "https://replit.com/",
            note:
              "Code instantly in your browser and turn ideas into working projects without setup friction.",
            badge: "Build Now",
            mode: "remote",
          },
          {
            id: "github",
            title: "GitHub",
            href: "https://github.com/",
            note:
              "The place where real developers publish code. Start a visible body of work here early.",
            badge: "Essential",
            mode: "remote",
          },
          {
            id: "hack-club",
            title: "Hack Club",
            href: "https://hackclub.com/",
            note:
              "A real community of teen builders making projects, joining challenges, and learning alongside each other.",
            badge: "Community",
            mode: "remote",
          },
          {
            id: "vercel",
            title: "Vercel",
            href: "https://vercel.com/",
            note:
              "Deploy a real site or app to the internet fast. This is where projects start feeling real.",
            badge: "Ship It",
            mode: "remote",
          },
          {
            id: "freecodecamp",
            title: "freeCodeCamp",
            href: "https://www.freecodecamp.org/",
            note:
              "A structured path with real projects that helps you move from beginner to builder through repetition.",
            badge: "Free",
            mode: "remote",
          },
        ],
      },
    ],
  },
};