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
      "A path for people who love imagination with structure — story, mechanics, player psychology, balance, and the feeling of making something others want to enter.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Game Designer",
    hook:
      "You are not just playing the experience. You are shaping the rules, the feeling, and the world around it.",
    summary:
      "Game design sits at the intersection of creativity, systems thinking, psychology, and taste. It can mean designing mechanics, levels, progression loops, interfaces, stories, economies, or the emotional rhythm of a player’s experience.",
    whyItPullsYouIn: [
      "You like making ideas interactive instead of just describing them.",
      "You notice what makes something addictive, frustrating, or satisfying.",
      "You care about both imagination and structure.",
    ],
  },

  traitChips: [
    { id: "worldbuilding", label: "Worldbuilding" },
    { id: "systems-thinking", label: "Systems thinking" },
    { id: "player-empathy", label: "Player empathy" },
    { id: "creative-logic", label: "Creative logic" },
  ],

  fitSignals: [
    {
      id: "creative-structure",
      label: "Creative + structured",
      score: 89,
      explanation:
        "This path fits people who want room for invention, but also enjoy rules, balance, and cause-and-effect.",
    },
    {
      id: "taste-and-critique",
      label: "Taste + critique",
      score: 84,
      explanation:
        "A strong signal here is noticing why certain games feel elegant, immersive, unfair, sticky, or alive.",
    },
    {
      id: "iterative-builder",
      label: "Iterative builder",
      score: 87,
      explanation:
        "Game design rewards people who like trying versions, testing, adjusting, and improving rather than getting everything perfect on the first pass.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Idea + iteration",
      note: "Imagining, testing, refining",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Solo + collaborative",
      note: "Concept work mixed with review",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Systems, levels, docs",
      note: "Mechanics, balance, player flow",
    },
  ],

  specialtyPreviews: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      oneLiner:
        "Shapes rules, progression, balance, economies, and long-term player loops.",
      whyItCouldFit:
        "Great for someone who likes invisible structure — the math, logic, and reward design underneath the experience.",
      energy: "systems",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      oneLiner:
        "Builds spaces, pacing, challenge curves, and player movement through the world.",
      whyItCouldFit:
        "Great for someone who thinks spatially and notices how environments guide emotion and action.",
      energy: "craft",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      oneLiner:
        "Connects story, choice, dialogue, and emotional arcs inside gameplay.",
      whyItCouldFit:
        "Great for someone who loves story but wants it to feel playable rather than passive.",
      energy: "high-creative",
    },
  ],

  specialties: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      summary:
        "Systems designers create the underlying logic of the game: progression, resources, rewards, difficulty curves, and the relationships between mechanics.",
      whatYouActuallyDo: [
        "Design progression loops that keep players engaged over time.",
        "Tune balance between challenge, rewards, and fairness.",
        "Prototype mechanics and test how different variables affect the experience.",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Balancing tradeoffs",
        "Spreadsheet logic",
        "Player psychology",
      ],
      starterProjects: [
        "Design a resource economy for a small survival game.",
        "Create a progression system for a school club or class game project.",
        "Rebuild the reward loop of a favorite game on paper and improve it.",
      ],
      atmosphere:
        "More logic-heavy than people expect — but still deeply creative when done well.",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      summary:
        "Level designers shape the player’s movement, discoveries, pressure, and flow through physical or digital spaces.",
      whatYouActuallyDo: [
        "Block out playable spaces and test how players move through them.",
        "Control pacing, sightlines, surprise, tension, and rest.",
        "Work closely with art, systems, and narrative to make environments feel intentional.",
      ],
      skillsThatGrowHere: [
        "Spatial thinking",
        "Pacing",
        "Encounter design",
        "Environmental storytelling",
      ],
      starterProjects: [
        "Sketch a tutorial level for a simple platformer.",
        "Map a multiplayer arena with different risk zones.",
        "Redesign a favorite level to improve flow or emotional rhythm.",
      ],
      atmosphere:
        "A blend of architecture, choreography, and emotional pacing.",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      summary:
        "Narrative designers build story into the player experience through choices, dialogue, quests, world lore, and emotional progression.",
      whatYouActuallyDo: [
        "Write dialogue, branching moments, and character-based decisions.",
        "Connect story beats to mechanics and player goals.",
        "Make story feel interactive rather than pasted on top.",
      ],
      skillsThatGrowHere: [
        "Interactive writing",
        "Character thinking",
        "Branching logic",
        "Emotional design",
      ],
      starterProjects: [
        "Write a branching scene where the player can solve a conflict in three ways.",
        "Create lore and quest structure for a tiny original world.",
        "Turn a short story idea into a playable choice map.",
      ],
      atmosphere:
        "Story-rich, but strongest when paired with player choice and systems awareness.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "The work is usually a mix of ideas, iteration, feedback, and detail. It is less about having one giant flash of genius and more about shaping a player experience over time.",
    moments: [
      {
        id: "morning-review",
        timeLabel: "9:30 AM",
        title: "Review yesterday’s build",
        body:
          "You play the latest version, notice where the pacing drags, where the reward lands well, and where players may get confused.",
      },
      {
        id: "midday-design",
        timeLabel: "11:30 AM",
        title: "Refine a system or level concept",
        body:
          "You sketch new ideas, update a design doc, or tune the numbers and logic behind progression or challenge.",
      },
      {
        id: "afternoon-collab",
        timeLabel: "2:00 PM",
        title: "Talk with art, engineering, or narrative",
        body:
          "Good design usually happens in conversation. You align the intended feeling with what is actually possible and what the team is building.",
      },
      {
        id: "late-test",
        timeLabel: "4:30 PM",
        title: "Playtest and adjust",
        body:
          "A small change in timing, difficulty, layout, or reward can completely change how the experience feels.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "This path often starts with small prototypes, critique, and portfolio samples. Momentum grows when you can show how you think, not just say you love games.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You begin studying games more actively and making small experiments instead of only consuming them.",
        signalsOfProgress: [
          "You can explain why a mechanic works.",
          "You start collecting references and design ideas.",
          "You make your first tiny prototype or paper system.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You start building a body of work: redesigns, concepts, simple prototypes, level maps, quest flows, or balance documents.",
        signalsOfProgress: [
          "You can show rather than just describe your thinking.",
          "You iterate based on feedback.",
          "Your work starts having a recognizable point of view.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin identifying your strongest specialty and develop a portfolio that shows both taste and process.",
        signalsOfProgress: [
          "You know whether systems, levels, or narrative pulls you most.",
          "Your projects feel more polished and intentional.",
          "You can talk clearly about player experience and tradeoffs.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The best next move is usually something small but concrete — not a huge dream plan. Build evidence. Show how you think.",

    actions: [
      {
        id: "game-designer-next-1",
        title: "Break down one game you love",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "This shifts you from passive fan to active observer. Designers learn by noticing structure and intent.",
        instructions: [
          "Pick one game or mode you know well.",
          "Write down what keeps the player engaged.",
          "Identify one thing you would improve and why.",
        ],
      },
      {
        id: "game-designer-next-2",
        title: "Create a tiny original mechanic",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "Even a paper prototype proves more than vague interest. It lets you start testing your ideas.",
        instructions: [
          "Invent one simple player action and one goal.",
          "Add one rule that creates tension or choice.",
          "Test whether it becomes boring, confusing, or interesting after a few rounds.",
        ],
      },
      {
        id: "game-designer-next-3",
        title: "Choose your strongest specialty signal",
        type: "conversation",
        effort: "light",
        timeEstimate: "15–20 min",
        whyThisMatters:
          "You do not need to lock yourself in, but naming your strongest pull helps the rest of Explore feel more personal and directional.",
        instructions: [
          "Compare systems, levels, and narrative.",
          "Ask which one feels most alive to you right now.",
          "Write one sentence about why that specialty stands out.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "near-you",
        title: "Near you",
        description:
          "Places nearby where people experiment with games, coding, or interactive design.",
        items: [
          {
            id: "marin-library-coding",
            title: "Coding or game club",
            mode: "local",
            provider: "Marin County Library",
            locationLabel: "San Rafael",
            distanceLabel: "≈5–10 minutes",
            summary:
              "Libraries often host beginner coding, robotics, and game development meetups.",
            whyItHelps:
              "Game design grows quickly when you can show ideas to other builders and see what they are making.",
          },
          {
            id: "sf-game-dev-meetup",
            title: "Game dev meetup or indie showcase",
            mode: "local",
            provider: "San Francisco developer community",
            locationLabel: "San Francisco",
            distanceLabel: "≈35–40 minutes",
            summary:
              "Small developer meetups often include demos, talks, and game jam announcements.",
            whyItHelps:
              "Seeing unfinished prototypes and hearing designers explain decisions is one of the fastest ways to learn.",
          },
        ],
      },

      {
        id: "online-now",
        title: "Online",
        description:
          "Places you can start experimenting with game design today from anywhere.",
        items: [
          {
            id: "itch-game-jams",
            title: "Join a beginner game jam",
            mode: "virtual",
            provider: "itch.io",
            formatLabel: "Online event",
            summary:
              "Game jams challenge you to build a small game idea in a short time window.",
            whyItHelps:
              "You learn quickly when you move from ideas to prototypes and see how other creators approach the same challenge.",
            href: "https://itch.io/jams",
          },
          {
            id: "unity-learn",
            title: "Try a Unity beginner project",
            mode: "virtual",
            provider: "Unity Learn",
            formatLabel: "Interactive tutorials",
            summary:
              "Unity offers guided beginner projects that teach core mechanics and level design basics.",
            whyItHelps:
              "You start understanding how mechanics actually become playable systems.",
            href: "https://learn.unity.com",
          },
        ],
      },
    ],
  },
};