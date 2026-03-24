// apps/web/src/app/(app)/main/explore/work/_data/mock/gameDesignerPath.ts

import type { WorkPathContent } from "../workPathSchema";

export const GAME_DESIGNER_PATH: WorkPathContent = {
  id: "game-designer",
  slug: "game-designer",
  lane: "work",

  theme: {
    tone: "electric-play",
    accent: { r: 82, g: 196, b: 255 },
    accentStrong: { r: 108, g: 126, b: 255 },
    glow: { r: 141, g: 92, b: 255 },
    surfaceLabel: "Electric play",
  },

  card: {
    title: "Game Designer",
    hook: "Build worlds, systems, tension, and delight.",
    description:
      "A path for people who do not just enjoy experiences - they notice how those experiences are built. Game design blends imagination, systems, pacing, psychology, and taste into something other people can actually step inside.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Game Designer",
    hook:
      "You are not just reacting to the experience. You notice the structure underneath it and imagine how it could feel better, deeper, sharper, or more alive.",
    summary:
      "Game design sits where creativity meets systems thinking. It can mean shaping mechanics, levels, progression loops, interfaces, stories, economies, difficulty curves, or the emotional rhythm of a player experience.",
    whyItPullsYouIn: [
      "You like making ideas interactive instead of leaving them abstract.",
      "You notice when something feels elegant, unfair, addictive, or flat.",
      "You enjoy combining imagination, structure, and iteration.",
    ],
  },

  traitChips: [
    { id: "systems-thinking", label: "Systems thinking" },
    { id: "experience-judgment", label: "Experience judgment" },
    { id: "player-empathy", label: "Player empathy" },
    { id: "creative-logic", label: "Creative logic" },
  ],

  fitSignals: [
    {
      id: "systems-and-imagination",
      label: "Systems + imagination",
      score: 90,
      explanation:
        "You want room for invention but also care about rules, balance, and how one change reshapes the whole experience.",
    },
    {
      id: "experience-judgment",
      label: "Experience judgment",
      score: 86,
      explanation:
        "You notice why something feels immersive, frustrating, or flat - not just whether it is fun.",
    },
    {
      id: "iteration-tolerance",
      label: "Iteration tolerance",
      score: 88,
      explanation:
        "You are willing to test, adjust, and refine instead of needing the first version to be perfect.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Concept + iteration",
      note: "Ideas become systems through testing",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Deep work + collaboration",
      note: "Solo design mixed with feedback",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Mechanics, levels, design docs",
      note: "Rules, flow, progression, player feeling",
    },
  ],

  specialtyPreviews: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      oneLiner:
        "Shapes rules, progression, economies, rewards, and balance.",
      whyItCouldFit:
        "Strong if you are drawn to invisible structure and tradeoffs.",
      energy: "systems",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      oneLiner:
        "Builds spaces, pacing, and the way a player moves through the world.",
      whyItCouldFit:
        "Strong if you think spatially and care about tension and flow.",
      energy: "craft",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      oneLiner:
        "Connects story, choice, and emotional arcs to gameplay.",
      whyItCouldFit:
        "Strong if you want story to feel interactive and alive.",
      energy: "high-creative",
    },
  ],

  specialties: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      summary:
        "This version of game design is about shaping the invisible structure underneath the player experience - progression, rewards, balance, economies, upgrades, and the logic that keeps the whole thing engaging over time.",
      whatYouActuallyDo: [
        "Design progression systems like levels, unlocks, rewards, currencies, and upgrade loops.",
        "Balance numbers and rules so the game feels fair, challenging, and satisfying instead of chaotic or flat.",
        "Think through how one system affects another, because small rule changes can shift the entire player experience.",
        "Use testing and feedback to tune what is too easy, too punishing, too slow, or too rewarding.",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Game balance",
        "Player psychology",
        "Iterative tuning",
      ],
      starterProjects: [
        "Design a progression or reward system for a simple game concept and test whether it keeps people engaged.",
        "Take an existing game and map out how its economy, unlocks, or difficulty systems actually work.",
        "Build a tiny prototype focused on one mechanic and keep tuning the numbers until the experience changes in noticeable ways.",
      ],
      atmosphere:
        "Analytical, experimental, and structure-heavy. This is where design starts to feel like hidden architecture that players can sense even when they do not see it directly.",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      summary:
        "This version is about space, flow, pacing, and how the player physically moves through the world. You are shaping what happens next, where tension rises, where curiosity pulls forward, and how a place teaches the player without lecturing them.",
      whatYouActuallyDo: [
        "Design spaces that guide movement, discovery, difficulty, and player choices.",
        "Control pacing through layout, obstacles, encounters, checkpoints, and visual cues.",
        "Test how players actually move through a space instead of assuming they will understand it the way you intended.",
        "Work with artists and engineers so the level feels playable, readable, and emotionally right.",
      ],
      skillsThatGrowHere: [
        "Spatial thinking",
        "Pacing and flow",
        "Player guidance",
        "Level iteration",
      ],
      starterProjects: [
        "Build a small level in Unity, Roblox, Fortnite Creative, or another accessible tool and watch how real players move through it.",
        "Recreate or sketch a favorite level and analyze how it creates tension, teaches mechanics, or directs attention.",
        "Practice building one environment that changes how it feels through layout alone, not just visuals.",
      ],
      atmosphere:
        "Creative, spatial, and tactile. You are constantly thinking about movement, tension, surprise, and what the player is feeling from one moment to the next.",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      summary:
        "This version connects story to interaction. It is not just about writing lore or dialogue - it is about making the story feel alive through player choices, pacing, consequences, and the emotional rhythm of gameplay.",
      whatYouActuallyDo: [
        "Design story structures that respond to player choice, progression, and interaction instead of just moving in a straight line.",
        "Write dialogue, scenes, world details, and character beats that fit how the game is actually played.",
        "Connect narrative to mechanics so the story feels embedded in the experience, not pasted on top of it.",
        "Collaborate with designers, writers, and developers to protect emotional clarity while the game keeps evolving.",
      ],
      skillsThatGrowHere: [
        "Interactive storytelling",
        "Dialogue writing",
        "Narrative structure",
        "Choice and consequence design",
      ],
      starterProjects: [
        "Create a branching story in Twine or another simple narrative tool so you can feel how interactive story structure works.",
        "Take a favorite game moment and rewrite it with different player choices and consequences.",
        "Build a small prototype where one mechanic changes the story instead of leaving gameplay and narrative separate.",
      ],
      atmosphere:
        "Expressive, collaborative, and emotionally tuned. The work feels creative, but it still demands structure because the story has to survive contact with real gameplay.",
    },
  ],

  dayInLife: {
    title: "A day shaping how something feels",
    summary:
      "Game design is not about one big idea. It is testing, adjusting, and refining until something actually feels good to play.",

    moments: [
      {
        id: "morning-playtest",
        timeLabel: "9:30 AM",
        title: "Play it and feel what is off",
        body:
          "You start by playing the current build. Something feels slow, confusing, or flat. You cannot always explain it immediately, but you can feel it.",
      },
      {
        id: "diagnose",
        timeLabel: "10:45 AM",
        title: "Figure out why it is not working",
        body:
          "Is the mechanic unclear? Is the reward too weak? Is the pacing off? You break down the experience to understand what is actually happening.",
      },
      {
        id: "iterate",
        timeLabel: "12:15 PM",
        title: "Change one thing",
        body:
          "You adjust a number, a rule, or a sequence. Small changes can shift the entire experience. This is where design lives.",
      },
      {
        id: "midday-test",
        timeLabel: "1:30 PM",
        title: "Test it again",
        body:
          "You play it again. Sometimes it is better. Sometimes it is worse. You keep going. This loop happens over and over.",
      },
      {
        id: "collab",
        timeLabel: "2:45 PM",
        title: "Align with the team",
        body:
          "You talk with engineers, artists, or writers. What you want has to connect to what can actually be built. Good design works with constraints.",
      },
      {
        id: "breakthrough",
        timeLabel: "4:15 PM",
        title: "It finally feels right",
        body:
          "There is a moment when it clicks. The pacing works. The feedback feels satisfying. The player experience lands. That is the payoff.",
      },
      {
        id: "end",
        timeLabel: "End of day",
        title: "You are never fully done",
        body:
          "Even when it works, you see ways to improve it. Game design is constant refinement - chasing something that feels just right.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "Momentum builds when you can show how you think about player experience, not just say you love games.",
    stages: [],
  },

  /* =========================
     FORECAST V2 (ADDED)
  ========================= */

  forecastV2: {
    outlookLabel: "High potential - but extremely competitive",
    outlookSummary:
      "Game design is one of the most competitive creative fields. Many people want in, but few can show real design thinking. The opportunity is strong for those who build playable work and develop a clear point of view.",

    metrics: [
      {
        id: "competition",
        label: "Competition",
        value: "Very high",
        tone: "mixed",
        note: "Many people want to enter game design",
      },
      {
        id: "portfolio",
        label: "Portfolio importance",
        value: "Critical",
        tone: "positive",
        note: "What you have made matters more than credentials",
      },
      {
        id: "ai",
        label: "AI impact",
        value: "High",
        tone: "mixed",
        note: "AI can assist but not replace design thinking",
      },
      {
        id: "demand",
        label: "Demand",
        value: "Selective",
        tone: "mixed",
        note: "Strong for skilled designers, limited for beginners",
      },
    ],

    salaryRange: {
      low: "$60K",
      median: "$90K",
      high: "$140K+",
    },

    industry: {
      sourceLabel: "Game Industry Estimates",
      sourceUrl: "https://www.bls.gov/",
    },

    whatIsGrowing: [
      "Designers who can build playable prototypes",
      "People who understand systems and player psychology",
      "Small teams creating high-quality indie games",
    ],

    whatIsUnderPressure: [
      "People who only consume games without building",
      "Generic portfolios without clear thinking",
      "Designers who cannot explain their decisions",
    ],

    aiImpact: {
      level: "high",
      summary:
        "AI can generate assets and assist development, but it cannot replace strong design judgment or player experience thinking.",
      helpsWith: [
        "Prototyping ideas faster",
        "Generating assets and variations",
        "Reducing production friction",
      ],
      putsPressureOn: ["Basic content creation", "Low-skill production work"],
      humansStillOwn: [
        "Game feel and player experience",
        "System design and balance",
        "What makes something worth playing",
      ],
    },

    whyThisCouldFeelExciting: [
      "You can build playable ideas faster than ever",
      "Indie creators can reach large audiences",
      "You can develop a unique design voice",
    ],

    whyThisCouldFeelRisky: [
      "Very competitive entry point",
      "Hard to stand out without real projects",
      "Takes consistent building to gain traction",
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The fastest way forward is building something small and real.",
    actions: [],
    opportunityGroups: [],
  },

  nextStepsV2: {
    heroTitle: "You can make something playable this week",
    heroSummary:
      "Game design becomes real the moment something can be played. Start small and make it real.",
    heroBadge: "Build a prototype",

    sections: [
      {
        id: "local",
        eyebrow: "Near 94901",
        title: "Real-world entry points",
        description:
          "Places where building and experimentation become real.",
        mode: "local",
        items: [
          {
            id: "marin-library",
            title: "Marin County Library - The Lab",
            href: "https://marinlibrary.org/the-lab/",
            note: "Free maker space to experiment with creative tech.",
            badge: "Local",
            mode: "local",
          },
        ],
      },
      {
        id: "remote",
        eyebrow: "Online",
        title: "Start building now",
        description:
          "Tools and communities where real game design begins.",
        mode: "remote",
        items: [
          {
            id: "itch",
            title: "itch.io Game Jams",
            href: "https://itch.io/jams",
            note: "Build small playable games with real deadlines.",
            badge: "Jams",
            mode: "remote",
          },
        ],
      },
    ],
  },
};