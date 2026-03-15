import type { WorkPathContent } from "../workPathSchema";

export const SOFTWARE_DEVELOPER_PATH: WorkPathContent = {
  id: "software-developer",
  slug: "software-developer",
  lane: "work",

  theme: {
    tone: "logic-electric",
    accent: { r: 95, g: 210, b: 255 },
    accentStrong: { r: 112, g: 132, b: 255 },
    glow: { r: 126, g: 98, b: 255 },
    surfaceLabel: "Logic & build",
  },

  card: {
    title: "Software Developer",
    hook: "Build tools, systems, products, and digital experiences people actually use.",
    description:
      "A path for people who like solving problems, improving how things work, and turning rough ideas into something real. Software development blends logic, structure, curiosity, and persistence into work that can shape apps, websites, games, AI tools, and everyday systems.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Software Developer",
    hook:
      "You are not just using technology. You are noticing what feels smooth, what feels broken, what feels missing, and how a better version might actually be built.",
    summary:
      "Software development is the craft of building digital things that do something real. That can mean designing a website, creating an app, wiring up the back-end logic behind a product, building internal tools, shaping interactive systems, or helping AI-powered experiences actually work. At its best, it is problem-solving made tangible.",
    whyItPullsYouIn: [
      "You like the feeling of turning confusion into structure and making a problem make sense.",
      "You notice when tools are clunky, awkward, slow, or missing something obvious.",
      "You are drawn to the mix of logic, creativity, experimentation, and useful output instead of wanting only one of those things.",
    ],
  },

  traitChips: [
    { id: "structured-thinking", label: "Structured thinking" },
    { id: "builder-energy", label: "Builder energy" },
    { id: "debugging-patience", label: "Debugging patience" },
    { id: "product-curiosity", label: "Product curiosity" },
  ],

  fitSignals: [
    {
      id: "logic-and-build",
      label: "Logic + build",
      score: 91,
      explanation:
        "This path fits people who do not only want to think about solutions — they want to construct them, test them, and make them usable in the real world.",
    },
    {
      id: "problem-decomposition",
      label: "Problem breakdown",
      score: 88,
      explanation:
        "A strong signal here is being able to take a messy problem, split it into parts, and work through it step by step instead of freezing at the size of it.",
    },
    {
      id: "iteration-tolerance",
      label: "Iteration tolerance",
      score: 90,
      explanation:
        "Software rewards people who can test, fail, troubleshoot, revise, and keep going without needing the first attempt to be elegant or perfect.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Deep work + problem-solving",
      note: "Long focus stretches mixed with testing and revision",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Build + debug + collaborate",
      note: "Solo concentration with team check-ins and review",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Apps, features, systems, fixes",
      note: "Interfaces, logic, tools, workflows, improvements",
    },
  ],

  specialtyPreviews: [
    {
      id: "front-end-developer",
      slug: "front-end-developer",
      title: "Front-End Developer",
      oneLiner:
        "Builds the visible product experience — layout, interaction, responsiveness, and polish.",
      whyItCouldFit:
        "Great for someone who cares how things feel in the hands of a real user and wants design plus logic to work together.",
      energy: "high-creative",
    },
    {
      id: "back-end-developer",
      slug: "back-end-developer",
      title: "Back-End Developer",
      oneLiner:
        "Builds the logic, data flow, APIs, and systems underneath what users see.",
      whyItCouldFit:
        "Great for someone who likes solving invisible problems and making the whole machine run reliably.",
      energy: "systems",
    },
    {
      id: "product-engineer",
      slug: "product-engineer",
      title: "Product Engineer",
      oneLiner:
        "Moves between user needs, interface decisions, and technical implementation to help shape the product itself.",
      whyItCouldFit:
        "Great for someone who likes building with context — not just coding features, but understanding why the feature matters.",
      energy: "craft",
    },
  ],

  specialties: [
    {
      id: "front-end-developer",
      slug: "front-end-developer",
      title: "Front-End Developer",
      summary:
        "Front-end developers build the parts of the product people actually see and interact with: pages, flows, components, motion, responsiveness, and visual behavior.",
      whatYouActuallyDo: [
        "Build interfaces that work across mobile, tablet, and desktop.",
        "Translate design ideas into real interactions and working product screens.",
        "Refine usability, accessibility, performance, and the feel of the experience.",
      ],
      skillsThatGrowHere: [
        "UI thinking",
        "Interaction logic",
        "Responsive design",
        "Detail sensitivity",
      ],
      starterProjects: [
        "Build a personal website with sections that feel polished and alive.",
        "Recreate the layout and interaction of an app screen you admire.",
        "Design and code a tiny tool that solves one real problem for students.",
      ],
      atmosphere:
        "Creative, visible, and detail-heavy — strong for people who like seeing their work immediately on screen.",
    },
    {
      id: "back-end-developer",
      slug: "back-end-developer",
      title: "Back-End Developer",
      summary:
        "Back-end developers create the systems behind the product: data, authentication, APIs, business logic, performance, reliability, and infrastructure behavior.",
      whatYouActuallyDo: [
        "Design how information moves through the system.",
        "Build APIs, logic, and data models that support the product.",
        "Improve security, speed, reliability, and how the whole thing holds together.",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Architecture basics",
        "Database logic",
        "Reliability mindset",
      ],
      starterProjects: [
        "Build a simple API for a study planner or sports tracker.",
        "Create a login flow and user data model for a tiny app.",
        "Design the logic behind a recommendation or notification system.",
      ],
      atmosphere:
        "More invisible than front-end work, but deeply satisfying if you like structure and making complex systems behave well.",
    },
    {
      id: "product-engineer",
      slug: "product-engineer",
      title: "Product Engineer",
      summary:
        "Product engineers sit close to the actual user experience and help shape what gets built, why it matters, and how it comes together technically.",
      whatYouActuallyDo: [
        "Build features that directly affect what users can do.",
        "Work across interface, logic, and product decisions instead of staying in one narrow slice.",
        "Iterate quickly based on feedback, usage, and what the product most needs next.",
      ],
      skillsThatGrowHere: [
        "Product judgment",
        "User empathy",
        "Rapid iteration",
        "Full-stack range",
      ],
      starterProjects: [
        "Build a tool for a real club, class, or team and refine it after people use it.",
        "Take one pain point in your daily life and make a tiny product around it.",
        "Create a simple dashboard that combines interface, logic, and useful output.",
      ],
      atmosphere:
        "Fast-moving and practical — strong for people who want code to stay close to real human use.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "The work is usually a mix of focused building, troubleshooting, small decisions, and ongoing refinement. It is less about one brilliant burst and more about steadily turning problems into something functional, clean, and useful.",
    moments: [
      {
        id: "morning-review",
        timeLabel: "9:15 AM",
        title: "Review priorities and pick up a feature",
        body:
          "You check what needs attention, review a ticket or product request, and re-enter the part of the system you are building or fixing.",
      },
      {
        id: "midday-build",
        timeLabel: "11:00 AM",
        title: "Build, test, and debug",
        body:
          "You write code, run into edge cases, test assumptions, trace bugs, and slowly move the work from rough idea to something stable enough to trust.",
      },
      {
        id: "afternoon-collab",
        timeLabel: "2:00 PM",
        title: "Talk through product or technical decisions",
        body:
          "You sync with designers, engineers, or product teammates to clarify tradeoffs, unblock decisions, and make sure what is being built actually solves the right problem.",
      },
      {
        id: "late-refine",
        timeLabel: "4:30 PM",
        title: "Polish, review, and clean up",
        body:
          "A lot of progress comes from refinement: naming things better, simplifying logic, improving performance, and making the code easier for future-you or the team to work with.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "This path often starts with tiny projects, tutorials, and lots of trial and error. Momentum grows when you stop only learning about code and start building things that prove how you think.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You begin moving from curiosity into action: experimenting with code, building small things, and noticing which parts of the work hold your attention.",
        signalsOfProgress: [
          "You finish tiny projects instead of only watching tutorials.",
          "You begin understanding how interface, logic, and data connect.",
          "You feel less intimidated by errors because you know they are part of the process.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You start building a visible body of work: websites, tools, mini-apps, experiments, or useful systems that show your range and persistence.",
        signalsOfProgress: [
          "You can explain what you built and why you made certain choices.",
          "You debug more calmly and rely less on perfect instructions.",
          "Your projects begin looking more intentional, not just copied.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin seeing which branch fits best — interface, systems, product, mobile, AI, games, or something else — and your work starts getting more focused.",
        signalsOfProgress: [
          "You know what kind of building gives you energy.",
          "Your projects solve clearer problems and feel more complete.",
          "You can show both technical growth and product judgment.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The best next move is usually not more passive studying. It is building something small enough to finish and useful enough to feel real.",

    actions: [
      {
        id: "software-developer-next-1",
        title: "Build one tiny tool for a real problem",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "You learn faster when the project has a purpose. Even a tiny useful build starts training real product instincts.",
        instructions: [
          "Pick one annoyance from school, sports, planning, or daily life.",
          "Make the simplest possible version of a tool that helps with it.",
          "Notice what was easy, what broke, and what you want to improve next.",
        ],
      },
      {
        id: "software-developer-next-2",
        title: "Rebuild one screen you admire",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "Recreating something good teaches structure, spacing, interaction, and technical problem-solving much faster than abstract study alone.",
        instructions: [
          "Choose one app or web screen with a clear layout and interaction pattern.",
          "Rebuild the screen from scratch as closely as you can.",
          "Then change one thing to make it better for your own taste or use case.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "near-you",
        title: "Near you",
        description:
          "Local places around Marin and the Bay Area where coding and building start to feel real because you are around other makers.",
        items: [
          {
            id: "marin-library-the-lab",
            title: "Try a build session at The Lab",
            mode: "local",
            provider: "Marin County Free Library",
            locationLabel: "Marin",
            distanceLabel: "Free local maker space",
            summary:
              "A creative maker space where tech, design, and project-building can feel more real than learning alone at home.",
            whyItHelps:
              "Software gets more interesting when you connect ideas to actual making instead of only reading about tools.",
          },
          {
            id: "sfpl-the-mix",
            title: "Visit The Mix teen creative space",
            mode: "local",
            provider: "San Francisco Public Library",
            locationLabel: "San Francisco",
            distanceLabel: "Teen-focused day trip",
            summary:
              "A teen-centered media and maker space that can support experimentation with digital creativity, design, and technology.",
            whyItHelps:
              "This is strong if you want a low-pressure place to explore building without needing to already feel advanced.",
          },
          {
            id: "code-for-san-francisco",
            title: "Sit in on a civic tech builder meetup",
            mode: "local",
            provider: "Code for San Francisco",
            locationLabel: "San Francisco",
            distanceLabel: "Builder community",
            summary:
              "A community where people collaborate on public-interest digital projects and share how real software work happens.",
            whyItHelps:
              "You start hearing how builders talk through product needs, technical tradeoffs, and useful tools in the real world.",
          },
          {
            id: "bay-area-hackathon",
            title: "Look for a Bay Area student hackathon",
            mode: "local",
            provider: "Student hackathon community",
            locationLabel: "Bay Area",
            distanceLabel: "Build-fast environment",
            summary:
              "Short event formats where students team up, prototype quickly, and turn ideas into working demos.",
            whyItHelps:
              "This is one of the fastest ways to feel what software building is actually like under real time pressure.",
          },
        ],
      },

      {
        id: "online-now",
        title: "Online",
        description:
          "Places you can start right away if you want your interest in software to become real building momentum.",
        items: [
          {
            id: "freecodecamp",
            title: "Build guided projects on freeCodeCamp",
            mode: "virtual",
            provider: "freeCodeCamp",
            formatLabel: "Project-based learning",
            summary:
              "A beginner-friendly path with coding lessons and projects that help you move from concepts into working builds.",
            whyItHelps:
              "Useful when you want structure, repetition, and visible progress without needing expensive tools.",
            href: "https://www.freecodecamp.org",
          },
          {
            id: "scrimba",
            title: "Try an interactive coding path on Scrimba",
            mode: "virtual",
            provider: "Scrimba",
            formatLabel: "Interactive tutorials",
            summary:
              "Hands-on front-end and JavaScript learning where you pause, edit, and build inside the lesson itself.",
            whyItHelps:
              "This makes coding feel less passive because you are constantly touching the code instead of only watching it.",
            href: "https://scrimba.com",
          },
          {
            id: "frontend-mentor",
            title: "Practice real interface builds on Frontend Mentor",
            mode: "virtual",
            provider: "Frontend Mentor",
            formatLabel: "Challenge platform",
            summary:
              "A challenge-based site where you build real UI projects from design prompts and compare your work with others.",
            whyItHelps:
              "Strong if you want clear practice targets and want your portfolio to start looking more intentional.",
            href: "https://www.frontendmentor.io",
          },
          {
            id: "replit",
            title: "Prototype ideas quickly in Replit",
            mode: "virtual",
            provider: "Replit",
            formatLabel: "Online coding workspace",
            summary:
              "A browser-based coding platform where you can build and test ideas quickly without needing a complicated setup.",
            whyItHelps:
              "This is great when you want lower friction between idea and execution so you build more often.",
            href: "https://replit.com",
          },
        ],
      },
    ],
  },
};