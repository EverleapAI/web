// apps/web/src/app/(app)/main/explore/learning/_data/mock/systemsCodePath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const SYSTEMS_CODE_PATH: LearningPathContent = {
  id: "systems-code",
  slug: "systems-code",
  lane: "learning",

  theme: {
    tone: "signal-forge",
    accent: { r: 86, g: 190, b: 255 },
    accentStrong: { r: 118, g: 122, b: 255 },
    glow: { r: 116, g: 96, b: 255 },
    surfaceLabel: "Signal forge",
  },

  card: {
    title: "Systems + Code",
    hook: "Learn how things work — then make them work better.",
    description:
      "A learning path for people drawn to logic, tools, debugging, automation, robotics, and building useful things. This is less about memorizing code and more about learning how systems behave, where they break, and how to shape them into something sharper.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Systems + Code",
    hook: "For minds that like structure, curiosity, and making ideas actually run.",
    summary:
      "Some people are pulled toward stories. Some toward motion. Some toward figuring out why a thing failed, how the parts connect, and what happens if you change one variable. Systems + Code is for that kind of brain. It moves fast toward doing: small builds, tiny automations, starter projects, and real ways to keep going.",
    whyItPullsYouIn: [
      "You get satisfaction from solving problems that annoy other people.",
      "You like patterns, structure, and hidden logic.",
      "You enjoy building step by step until something clicks.",
      "You want to make tools, not just consume them.",
    ],
  },

  traitChips: [
    { id: "pattern-spotting", label: "Pattern spotting" },
    { id: "debug-mindset", label: "Debug mindset" },
    { id: "builder-energy", label: "Builder energy" },
    { id: "logic-creativity", label: "Logic + creativity" },
    { id: "tool-maker", label: "Tool maker" },
    { id: "quiet-persistence", label: "Quiet persistence" },
  ],

  fitSignals: [
    {
      id: "how-things-work",
      label: "You like understanding how things actually work.",
      score: 95,
      explanation:
        "You are not satisfied just using an app, device, or tool. You want to understand the moving parts underneath it.",
    },
    {
      id: "solve-annoying-problems",
      label: "You want to fix clunky systems.",
      score: 91,
      explanation:
        "A repeated task, a broken workflow, a weird bug, an inefficient setup — these do not just bother you. They invite you in.",
    },
    {
      id: "step-by-step-builder",
      label: "You can build patiently, one piece at a time.",
      score: 88,
      explanation:
        "Even when a project gets frustrating, you can stay with it long enough to make the next part work.",
    },
    {
      id: "precise-freedom",
      label: "You like creativity inside structure.",
      score: 86,
      explanation:
        "Code has rules, but inside those rules you can invent almost anything. That mix tends to feel good to you.",
    },
  ],

  branchPreviews: [
    {
      id: "apps-websites",
      slug: "apps-websites",
      title: "Apps + Websites",
      oneLiner: "Build useful things people can open, tap, click, and use.",
      whyItCouldFit:
        "Great if you like turning ideas into real tools with visible results.",
      energy: "builder",
    },
    {
      id: "automation-workflows",
      slug: "automation-workflows",
      title: "Automation + Workflows",
      oneLiner: "Make repetitive tasks disappear and turn chaos into systems.",
      whyItCouldFit:
        "Strong fit if you hate inefficiency and love elegant shortcuts.",
      energy: "systems",
    },
    {
      id: "robotics-physical-computing",
      slug: "robotics-physical-computing",
      title: "Robotics + Physical Computing",
      oneLiner: "Connect code to sensors, motion, machines, and the real world.",
      whyItCouldFit:
        "Best for people who want code to do something physical, not just stay on a screen.",
      energy: "builder",
    },
    {
      id: "game-systems-simulation",
      slug: "game-systems-simulation",
      title: "Game Systems + Simulation",
      oneLiner: "Build rule sets, interactions, balancing, and responsive behavior.",
      whyItCouldFit:
        "A strong path if you like playful logic, mechanics, and system design.",
      energy: "creative",
    },
  ],

  branches: [
    {
      id: "apps-websites",
      slug: "apps-websites",
      title: "Apps + Websites",
      summary:
        "This branch is about making things people can actually use. It blends interface decisions, structure, logic, and feedback. You might build a study helper, a team schedule page, a tracker, or a tool that solves one small real problem.",
      whatYouActuallyExplore: [
        "How pages, buttons, forms, and flows work together",
        "How to turn an idea into something usable",
        "How design and code affect each other",
      ],
      skillsThatGrowHere: [
        "Front-end coding",
        "User thinking",
        "Project structuring",
        "Iteration through testing",
      ],
      starterProjects: [
        "A personal site that feels like you",
        "A club or team sign-up page",
        "A tiny productivity tool for school or practice",
      ],
      atmosphere:
        "Creative, practical, and satisfying. You get to see progress fast.",
    },
    {
      id: "automation-workflows",
      slug: "automation-workflows",
      title: "Automation + Workflows",
      summary:
        "This branch is for people who get irrationally annoyed doing the same task five times. It focuses on scripts, data flow, triggers, simple integrations, and systems that save time or reduce friction.",
      whatYouActuallyExplore: [
        "How repeated tasks can be turned into systems",
        "How information moves from one step to the next",
        "How to remove unnecessary manual work",
      ],
      skillsThatGrowHere: [
        "Workflow logic",
        "Scripting",
        "Problem decomposition",
        "Operational thinking",
      ],
      starterProjects: [
        "A file organizer or renaming script",
        "A reminder workflow for recurring tasks",
        "A lightweight dashboard for something you track often",
      ],
      atmosphere:
        "Sharp, efficient, and a little addictive once you realize how much friction you can remove.",
    },
    {
      id: "robotics-physical-computing",
      slug: "robotics-physical-computing",
      title: "Robotics + Physical Computing",
      summary:
        "This branch brings code into the physical world. Instead of only changing pixels, you change movement, light, sound, and response. It is strong for people who like experimentation, engineering energy, and real-world feedback.",
      whatYouActuallyExplore: [
        "How code interacts with sensors and devices",
        "How machines respond to instructions and inputs",
        "How physical prototypes are tested and improved",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Hardware curiosity",
        "Testing under real conditions",
        "Hands-on iteration",
      ],
      starterProjects: [
        "A sensor-based Arduino or micro:bit build",
        "A simple reaction-based robot",
        "A light, alarm, or movement prototype",
      ],
      atmosphere:
        "Experimental, tactile, and satisfying for people who want code to touch the real world.",
    },
    {
      id: "game-systems-simulation",
      slug: "game-systems-simulation",
      title: "Game Systems + Simulation",
      summary:
        "This branch leans less into art and more into rules, mechanics, interactions, progression, balancing, and feedback loops. It is excellent for people who enjoy playful design but think in systems.",
      whatYouActuallyExplore: [
        "How mechanics create tension, reward, and flow",
        "How rules shape player behavior",
        "How simulations can model changing systems",
      ],
      skillsThatGrowHere: [
        "Systems design",
        "Logic structuring",
        "Balancing and iteration",
        "Interactive thinking",
      ],
      starterProjects: [
        "A game with one strong core mechanic",
        "A points or progression system",
        "A simple simulation of a changing system",
      ],
      atmosphere:
        "Playful but technical — good for people who like both imagination and structure.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "Do not wait for the perfect class or the perfect setup. The fastest way to see whether Systems + Code fits is to make something small, useful, or interesting right away.",
    actions: [
      {
        id: "tiny-useful-tool",
        title: "Build one tiny useful tool this week",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "A tiny finished build teaches more than a giant dream project that never gets off the ground.",
        instructions: [
          "Pick one simple problem from your real life.",
          "Make the version small enough to finish in one sitting.",
          "Examples: a homework timer, quote generator, checklist, or randomizer.",
          "Save a screenshot when it works.",
        ],
      },
      {
        id: "debug-challenge",
        title: "Try a debugging challenge",
        type: "experiment",
        effort: "light",
        timeEstimate: "20–40 min",
        whyThisMatters:
          "Debugging is not a side skill. It is one of the main ways technical builders get strong.",
        instructions: [
          "Find a small broken code example or beginner bug challenge.",
          "Read the error before guessing.",
          "Change one thing at a time.",
          "Write down what the actual problem turned out to be.",
        ],
      },
      {
        id: "automate-annoying-task",
        title: "Automate one annoying task",
        type: "tiny-task",
        effort: "medium",
        timeEstimate: "30–60 min",
        whyThisMatters:
          "Automation helps you feel the real-world power of code almost immediately.",
        instructions: [
          "Choose something repetitive: renaming files, sorting links, tracking drills, or organizing notes.",
          "Map the current steps.",
          "Figure out which part could be automated first.",
          "Build the smallest possible version.",
        ],
      },
      {
        id: "marin-mini-project",
        title: "Make a Bay Area-flavored mini project",
        type: "project",
        effort: "stretch",
        timeEstimate: "60–120 min",
        whyThisMatters:
          "Projects feel more real when they connect to your actual world, not an abstract assignment.",
        instructions: [
          "Pick a local theme: Marin trails, a school event board, a fencing drill logger, a surf checker, or a weekly planner.",
          "Keep the scope tiny.",
          "Make it usable, not perfect.",
          "Show it to one real person.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "At first, Systems + Code can feel confusing in a strangely exciting way. You may spend twenty minutes on one bug and then feel absurdly proud when the fix is one character. Over time, the confusion starts turning into pattern recognition. You stop seeing random screens and devices everywhere. You start seeing structure, flow, and openings to build.",
    moments: [
      {
        id: "small-fix-big-win",
        title: "Tiny fix, huge satisfaction",
        body:
          "You change one line, reload, and suddenly the thing works. The win looks small from the outside, but internally it feels electric.",
      },
      {
        id: "frustration-turns-clarity",
        title: "Frustration that becomes clarity",
        body:
          "You hit a wall, push through, and realize the wall taught you something important about how the system actually works.",
      },
      {
        id: "seeing-hidden-logic",
        title: "You start seeing systems everywhere",
        body:
          "Apps, school workflows, devices, games, websites — they stop feeling random and start feeling legible.",
      },
      {
        id: "quiet-builder-confidence",
        title: "A quiet kind of confidence grows",
        body:
          "You begin trusting that even if you do not know the answer yet, you can test, debug, and find your way toward it.",
      },
    ],
  },

  growthPath: {
    title: "How people usually grow here",
    summary:
      "Most people do not begin by mastering theory. They begin by experimenting, then building small projects, then realizing they are starting to think differently about structure, tools, and problem solving.",
    stages: [
      {
        id: "experiments",
        label: "Start with experiments",
        timeframe: "First few weeks",
        summary:
          "You try tiny builds, short tutorials, and small challenges to get comfortable with syntax, logic, and finishing something.",
        signalsOfProgress: [
          "You can follow and modify a simple example",
          "You start recognizing patterns across projects",
          "You panic less when something breaks",
        ],
      },
      {
        id: "projects",
        label: "Move into projects",
        timeframe: "Next 1–3 months",
        summary:
          "You stop just copying and begin making tools with a real purpose: trackers, simple sites, mini systems, or playful prototypes.",
        signalsOfProgress: [
          "You can scope a project smaller",
          "You make things tied to your real life",
          "You begin debugging with more intention",
        ],
      },
      {
        id: "systems-thinking",
        label: "Learn to think in systems",
        timeframe: "After repeated building",
        summary:
          "Now you begin understanding structure, tradeoffs, architecture, and why certain solutions are cleaner or more scalable than others.",
        signalsOfProgress: [
          "You think in inputs, outputs, and flow",
          "You organize projects more clearly",
          "You start seeing better and worse solution paths",
        ],
      },
      {
        id: "real-world-building",
        label: "Build for real people",
        timeframe: "As confidence grows",
        summary:
          "This is where it gets real: school tools, community ideas, clubs, internships, freelance experiments, open-source contributions, or products people can actually use.",
        signalsOfProgress: [
          "Other people test or use what you made",
          "You care more about usefulness than just completion",
          "You can explain what your build solves",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "This path gets stronger fast when you combine small independent builds with real communities, real opportunities, and visible proof of what you make.",
    actions: [
      {
        id: "start-online-platform",
        title: "Start on one real interactive platform",
        type: "join",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "Interactive platforms let you make something immediately instead of getting stuck in passive reading.",
        instructions: [
          "Pick one: Replit, freeCodeCamp, or Khan Academy.",
          "Complete one short beginner lesson or build.",
          "Do not browse endlessly — make one thing.",
        ],
      },
      {
        id: "three-project-starter-stack",
        title: "Create a 3-project starter portfolio",
        type: "project",
        effort: "stretch",
        timeEstimate: "1–2 weeks",
        whyThisMatters:
          "Three small finished projects show momentum better than one giant unfinished idea.",
        instructions: [
          "Make one useful tool.",
          "Make one playful experiment.",
          "Make one project tied to your real life.",
          "Document each with a screenshot and short explanation.",
        ],
      },
      {
        id: "document-your-builds",
        title: "Document what you build",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "15–20 min each project",
        whyThisMatters:
          "Documentation turns random experiments into a visible growth story.",
        instructions: [
          "Take screenshots.",
          "Write what the project does.",
          "Note what went wrong.",
          "Note what you fixed or learned.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "online-start-here",
        title: "Good online places to start",
        description:
          "These are useful because they let you build right away and keep momentum high.",
        items: [
          {
            id: "replit",
            title: "Replit",
            mode: "virtual",
            provider: "Replit",
            summary:
              "A browser-based coding environment that makes it easy to start building without a heavy setup.",
            whyItHelps:
              "Fast entry, beginner-friendly, and great for tiny projects you can actually finish.",
            href: "https://replit.com",
            formatLabel: "Browser-based coding",
          },
          {
            id: "freecodecamp",
            title: "freeCodeCamp",
            mode: "virtual",
            provider: "freeCodeCamp",
            summary:
              "Hands-on coding curriculum with projects and guided practice.",
            whyItHelps:
              "Structured enough to keep you moving, but practical enough to avoid feeling like a catalog.",
            href: "https://www.freecodecamp.org",
            formatLabel: "Self-paced lessons + projects",
          },
          {
            id: "khan-academy-cs",
            title: "Khan Academy Computer Programming",
            mode: "virtual",
            provider: "Khan Academy",
            summary:
              "Friendly interactive programming lessons that feel approachable and visual.",
            whyItHelps:
              "Good for early confidence and for learning by doing instead of just reading.",
            href: "https://www.khanacademy.org/computing/computer-programming",
            formatLabel: "Interactive beginner learning",
          },
        ],
      },
      {
        id: "marin-bay-area-local",
        title: "Local directions to explore near Marin / Bay Area",
        description:
          "The exact program may change over time, but these are the kinds of places worth checking first if you want this path to feel real in person.",
        items: [
          {
            id: "library-maker-programs",
            title: "Library maker and coding programs",
            mode: "local",
            provider: "Marin libraries and nearby public libraries",
            summary:
              "Libraries sometimes offer maker sessions, coding events, robotics kits, or creative tech workshops.",
            whyItHelps:
              "Low barrier, local, and often easier to access than formal programs.",
            locationLabel: "Near 94901 / Marin County",
            distanceLabel: "Local",
            formatLabel: "Workshops or community sessions",
          },
          {
            id: "school-clubs",
            title: "School coding, robotics, or engineering clubs",
            mode: "local",
            provider: "Local middle schools and high schools",
            summary:
              "Student clubs can be one of the fastest ways to start building with other people.",
            whyItHelps:
              "Community helps consistency, and team projects make learning feel less abstract.",
            locationLabel: "Marin / North Bay",
            distanceLabel: "Local",
            formatLabel: "Student-led or faculty-supported",
          },
          {
            id: "bay-area-maker-stem",
            title: "Bay Area maker spaces and STEM youth programs",
            mode: "hybrid",
            provider: "Community colleges, outreach programs, and youth STEM organizations",
            summary:
              "Look for teen maker labs, robotics programs, hackathons, and project-based workshops across the wider Bay Area.",
            whyItHelps:
              "These spaces often move beyond worksheets and into real builds.",
            locationLabel: "Bay Area",
            distanceLabel: "Regional",
            formatLabel: "In-person + occasional virtual options",
          },
        ],
      },
      {
        id: "next-level-opportunities",
        title: "When you want to go a level deeper",
        description:
          "These are good once you have made a few small things and want stronger momentum.",
        items: [
          {
            id: "arduino-microbit",
            title: "Arduino or micro:bit starter path",
            mode: "virtual",
            provider: "Open online tutorials + kits",
            summary:
              "A way to move from screen-only coding into sensors, motion, and physical feedback.",
            whyItHelps:
              "Perfect if code feels more exciting when it controls something real.",
            formatLabel: "Hands-on hardware learning",
          },
          {
            id: "hackathons",
            title: "Teen-friendly hackathons",
            mode: "hybrid",
            provider: "Schools, youth orgs, and Bay Area tech communities",
            summary:
              "Short build events where you make something quickly with others.",
            whyItHelps:
              "Great for momentum, collaboration, and seeing how much you can build under pressure.",
            locationLabel: "Bay Area + online",
            distanceLabel: "Varies",
            formatLabel: "Weekend or day-long events",
          },
          {
            id: "summer-precollege",
            title: "Summer and pre-college tech programs",
            mode: "hybrid",
            provider: "Community colleges, university outreach, and STEM camps",
            summary:
              "Project-based programs can help you go deeper without waiting until college.",
            whyItHelps:
              "Useful when you want more structure, mentorship, and a stronger learning rhythm.",
            locationLabel: "Bay Area / online",
            distanceLabel: "Varies",
            formatLabel: "Seasonal programs",
          },
        ],
      },
    ],
  },
};