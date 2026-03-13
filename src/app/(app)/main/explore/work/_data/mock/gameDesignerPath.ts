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
      "A path for people who do not just enjoy experiences — they notice how those experiences are built. Game design blends imagination, systems, pacing, psychology, and taste into something other people can actually step inside.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Game Designer",
    hook:
      "You are not only reacting to the experience. You are noticing the structure underneath it — and imagining how it could feel better, deeper, stranger, sharper, or more alive.",
    summary:
      "Game design sits where creativity meets systems thinking. It can mean shaping mechanics, levels, progression loops, interfaces, stories, economies, difficulty curves, or the emotional rhythm of a player’s experience. At its best, it is the craft of building worlds people do not just observe, but enter.",
    whyItPullsYouIn: [
      "You like making ideas interactive instead of leaving them abstract.",
      "You notice when a system feels elegant, unfair, addictive, flat, or unexpectedly satisfying.",
      "You are drawn to the combination of imagination, structure, and iteration rather than only one of those on its own.",
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
        "This path fits people who want room for invention but also care about rules, tradeoffs, balance, and how one change can reshape the whole experience.",
    },
    {
      id: "experience-judgment",
      label: "Experience judgment",
      score: 86,
      explanation:
        "A strong signal here is noticing why something feels immersive, frustrating, sticky, elegant, or emotionally flat instead of only asking whether it is fun.",
    },
    {
      id: "iteration-tolerance",
      label: "Iteration tolerance",
      score: 88,
      explanation:
        "Game design rewards people who can test, adjust, critique, and keep refining instead of needing the first version to be perfect.",
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
      note: "Solo design time mixed with review and team feedback",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Mechanics, levels, design docs",
      note: "Rules, flow, progression, balance, player feeling",
    },
  ],

  specialtyPreviews: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      oneLiner:
        "Shapes rules, progression, economies, rewards, balance, and long-term player loops.",
      whyItCouldFit:
        "Great for someone who is fascinated by invisible structure — the logic and tradeoffs underneath what keeps a game compelling.",
      energy: "systems",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      oneLiner:
        "Builds spaces, challenge curves, pacing, and the way a player moves through the world.",
      whyItCouldFit:
        "Great for someone who thinks spatially and notices how layout, tension, and discovery shape emotion and action.",
      energy: "craft",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      oneLiner:
        "Connects story, choice, dialogue, and emotional arcs to the player experience.",
      whyItCouldFit:
        "Great for someone who loves story, but wants it to feel playable, consequential, and alive inside the game rather than pasted on top.",
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
      "The work is usually a mix of concepting, iteration, feedback, and detail. It is less about one giant flash of genius and more about steadily shaping a player experience until it feels right from the inside.",
    moments: [
      {
        id: "morning-review",
        timeLabel: "9:30 AM",
        title: "Review yesterday’s build",
        body:
          "You play the latest version and notice where pacing drags, where a reward lands well, where a mechanic feels unclear, and where a player may lose momentum.",
      },
      {
        id: "midday-design",
        timeLabel: "11:30 AM",
        title: "Refine a system or level concept",
        body:
          "You sketch new ideas, revise a design doc, or tune the numbers and logic behind progression, challenge, economy, or player choice.",
      },
      {
        id: "afternoon-collab",
        timeLabel: "2:00 PM",
        title: "Talk with art, engineering, or narrative",
        body:
          "Good design usually happens in conversation. You align the intended feeling with what is possible, what the team is building, and what the game most needs right now.",
      },
      {
        id: "late-test",
        timeLabel: "4:30 PM",
        title: "Playtest and adjust",
        body:
          "A small change in timing, layout, difficulty, reward, or feedback can completely change how the experience feels. You test, notice, and refine again.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "This path often starts with prototypes, critique, and small portfolio pieces. Momentum grows when you can show how you think about player experience, not just say you love games.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You begin studying games more actively and making small experiments instead of only consuming them.",
        signalsOfProgress: [
          "You can explain why a mechanic works or fails.",
          "You start collecting references, design patterns, and ideas on purpose.",
          "You make your first tiny prototype, paper system, or level sketch.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You start building a body of work: redesigns, concepts, simple prototypes, level maps, quest flows, or balance documents that show your thinking.",
        signalsOfProgress: [
          "You can show process, not just opinions.",
          "You iterate based on feedback instead of defending the first version.",
          "Your work starts developing a recognizable point of view.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin identifying your strongest specialty and build a portfolio that shows both taste and design reasoning.",
        signalsOfProgress: [
          "You know whether systems, levels, or narrative pulls you most strongly.",
          "Your projects feel more polished, intentional, and playable.",
          "You can talk clearly about player experience, constraints, and tradeoffs.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "The best next move is usually something small but real. Build evidence. Notice what gets stronger when you move from admiration into actual design behavior.",

    actions: [
      {
        id: "game-designer-next-1",
        title: "Reverse-engineer one game loop you already love",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "This is one of the fastest ways to move from taste into design thinking. You start noticing structure, not just vibes.",
        instructions: [
          "Pick one game, mode, or mechanic you know well.",
          "Map the loop: what the player does, what feedback they get, and what keeps them going.",
          "Write one change that would make the loop more tense, more fair, or more rewarding.",
        ],
      },
      {
        id: "game-designer-next-2",
        title: "Make a tiny playable concept this week",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "A tiny prototype teaches more than another hour of scrolling. The moment an idea becomes playable, your instincts get sharper.",
        instructions: [
          "Choose one simple player action and one clear goal.",
          "Add one rule that creates pressure, timing, risk, or choice.",
          "Play it three times and write what feels flat, confusing, or unexpectedly alive.",
        ],
      },
    ],

    opportunityGroups: [
      {
        id: "near-you",
        title: "Near you",
        description:
          "Places in Marin and the Bay Area where game-making starts to feel real because other people are building too.",
        items: [
          {
            id: "marin-library-the-lab",
            title: "Try a build session at The Lab",
            mode: "local",
            provider: "Marin County Free Library",
            locationLabel: "Marin",
            distanceLabel: "Free local maker space",
            summary:
              "A creative maker space with tools, tech, and a build-first atmosphere that is good for testing small interactive ideas.",
            whyItHelps:
              "Game design gets stronger when you stop waiting for the perfect setup and start making things in a real creative environment.",
          },
          {
            id: "sfpl-the-mix",
            title: "Visit The Mix teen creative space",
            mode: "local",
            provider: "San Francisco Public Library",
            locationLabel: "San Francisco",
            distanceLabel: "Teen-focused day trip",
            summary:
              "A teen-designed media and maker space where you can explore digital creativity, technology, and gaming in a low-pressure setting.",
            whyItHelps:
              "If you are early on, this gives you a real place to experiment without needing to already feel like an expert.",
          },
          {
            id: "unity-user-group-sf",
            title: "Go to a Unity creator meetup",
            mode: "local",
            provider: "Unity User Group: San Francisco",
            locationLabel: "San Francisco",
            distanceLabel: "Builder community",
            summary:
              "Meet local creators using Unity for games, apps, and interactive projects, with talks, demos, and community connection.",
            whyItHelps:
              "You start hearing how real creators talk through tools, workflow, mistakes, and design tradeoffs.",
          },
          {
            id: "sf-bay-game-jamming",
            title: "Drop into a Bay Area game jam meetup",
            mode: "local",
            provider: "SF Bay Area Game Jamming & Game Design",
            locationLabel: "San Francisco",
            distanceLabel: "Prototype-first meetup",
            summary:
              "A welcoming community centered on co-working, making games, and learning through jam-style sessions.",
            whyItHelps:
              "This is strong for someone who learns by building alongside other people instead of studying alone forever.",
          },
        ],
      },

      {
        id: "online-now",
        title: "Online",
        description:
          "Places you can start today if you want your interest to turn into actual design momentum.",
        items: [
          {
            id: "itch-game-jams",
            title: "Join a beginner-friendly game jam",
            mode: "virtual",
            provider: "itch.io",
            formatLabel: "Online event",
            summary:
              "Short-timeline challenges where creators turn prompts into small playable ideas and share what they made.",
            whyItHelps:
              "You learn fast when you have a real prompt, a real deadline, and other people building beside you.",
            href: "https://itch.io/jams",
          },
          {
            id: "unity-learn",
            title: "Build a first prototype in Unity Learn",
            mode: "virtual",
            provider: "Unity Learn",
            formatLabel: "Interactive tutorials",
            summary:
              "Guided beginner projects that walk you through turning mechanics and scenes into something playable.",
            whyItHelps:
              "This is useful when you want structure without losing the feeling that you are building a real thing.",
            href: "https://learn.unity.com",
          },
          {
            id: "twine",
            title: "Make an interactive story in Twine",
            mode: "virtual",
            provider: "Twine",
            formatLabel: "Free tool",
            summary:
              "A simple way to build branching choices, narrative tension, and player consequence without needing a full game engine.",
            whyItHelps:
              "This is especially strong if narrative design is pulling at you and you want a fast way to make choices playable.",
            href: "https://twinery.org",
          },
          {
            id: "roblox-creator-hub",
            title: "Prototype systems in Roblox Creator Hub",
            mode: "virtual",
            provider: "Roblox Creator Hub",
            formatLabel: "Creator platform",
            summary:
              "A huge builder ecosystem with tutorials, docs, and a live culture of making playable experiences for other people.",
            whyItHelps:
              "This can make game design feel immediate because your ideas can become playable and shareable quickly.",
            href: "http::contentReference[oaicite:1]{index=1}s://create.roblox.com",
          },
        ],
      },
    ],
  },
};