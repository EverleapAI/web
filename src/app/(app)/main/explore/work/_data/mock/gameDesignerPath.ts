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
    hook: "Build worlds people can feel, test, and return to.",
    description:
      "A path for people who love imagination with structure — systems, story, tension, reward, and the strange magic of shaping an experience someone else can step inside.",
  },

  hero: {
    eyebrow: "Work Path",
    title: "Game Designer",
    hook:
      "You are not just playing the experience. You are shaping the rules, rhythm, tension, and wonder that make someone want to stay inside it.",
    summary:
      "Game design lives where creativity meets structure. It is part worldbuilding, part psychology, part systems thinking, and part taste. You might design mechanics, levels, progression loops, interfaces, story choices, or the emotional cadence of a player’s journey — but the deeper job is always the same: create an experience that feels alive.",
    whyItPullsYouIn: [
      "You do not just enjoy games — you notice what makes them click, drag, frustrate, or become impossible to stop thinking about.",
      "You like turning ideas into something interactive, where choice, consequence, and feeling all matter.",
      "You are drawn to both imagination and structure: not just dreaming up the world, but shaping how it actually works.",
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
      id: "interactive-imagination",
      label: "Interactive imagination",
      score: 91,
      explanation:
        "A strong fit signal here is wanting ideas to become playable. You do not just want to describe a world or concept — you want people to move through it, test it, and feel it.",
    },
    {
      id: "taste-and-critique",
      label: "Taste + critique",
      score: 86,
      explanation:
        "Game design rewards people who can sense why something feels elegant, flat, unfair, addictive, generous, or unforgettable — and who can explain that instinct clearly.",
    },
    {
      id: "iteration-energy",
      label: "Iteration energy",
      score: 88,
      explanation:
        "This path fits people who can revise without losing excitement. The work gets better through testing, tuning, feedback, and trying again.",
    },
  ],

  snapshotStats: [
    {
      id: "focus-mode",
      label: "Best mode",
      value: "Concept + iteration",
      note: "Imagine it, test it, refine it",
    },
    {
      id: "daily-shape",
      label: "Work rhythm",
      value: "Solo + collaborative",
      note: "Deep design time mixed with review",
    },
    {
      id: "output",
      label: "Typical output",
      value: "Mechanics, levels, docs",
      note: "Rules, pacing, flow, player experience",
    },
  ],

  specialtyPreviews: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      oneLiner: "Designs the invisible logic beneath the experience: progression, balance, rewards, economies, and long-term loops.",
      whyItCouldFit:
        "This branch is especially strong if you like hidden structure — the math, tradeoffs, tuning, and player motivation underneath what looks simple on the surface.",
      energy: "systems",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      oneLiner: "Shapes the player's movement through space: pacing, discovery, pressure, surprise, and flow.",
      whyItCouldFit:
        "This branch fits people who think spatially and emotionally at the same time — noticing how an environment can guide action, tension, and memory.",
      energy: "craft",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      oneLiner: "Builds story into gameplay through choices, dialogue, quests, characters, and emotional arcs.",
      whyItCouldFit:
        "This branch fits people who love story but do not want it to stay passive. You want story to respond, branch, and change the player experience.",
      energy: "high-creative",
    },
  ],

  specialties: [
    {
      id: "systems-designer",
      slug: "systems-designer",
      title: "Systems Designer",
      summary:
        "Systems designers shape the underlying logic of the game: progression, resources, rewards, difficulty curves, risk, fairness, and the relationships between mechanics over time.",
      whatYouActuallyDo: [
        "Design progression loops that keep players engaged without making rewards feel random or empty.",
        "Tune balance between challenge, effort, choice, and payoff across a longer player journey.",
        "Prototype mechanics and adjust variables until the experience feels clear, fair, and compelling.",
      ],
      skillsThatGrowHere: [
        "Systems thinking",
        "Balancing tradeoffs",
        "Spreadsheet logic",
        "Player psychology",
      ],
      starterProjects: [
        "Design a resource economy for a small survival or farming game.",
        "Create a progression system for a school club challenge, classroom game, or personal project.",
        "Reverse-engineer the reward loop of a favorite game and redesign it to feel more satisfying or more fair.",
      ],
      atmosphere:
        "More logic-heavy than people expect, but deeply creative when you enjoy invisible structure and player motivation.",
    },
    {
      id: "level-designer",
      slug: "level-designer",
      title: "Level Designer",
      summary:
        "Level designers shape how a player moves, discovers, hesitates, recovers, and advances through a space. The work is part architecture, part choreography, part emotional pacing.",
      whatYouActuallyDo: [
        "Block out playable spaces and test how layout changes the way players explore, fight, learn, or get lost.",
        "Control pacing through distance, visibility, surprise, pressure, rhythm, and moments of relief.",
        "Work with art, systems, and narrative so environments do not just look good — they actively guide experience.",
      ],
      skillsThatGrowHere: [
        "Spatial thinking",
        "Pacing",
        "Encounter design",
        "Environmental storytelling",
      ],
      starterProjects: [
        "Sketch a tutorial level for a simple platformer or puzzle game.",
        "Map a multiplayer arena with zones of safety, risk, and strategic control.",
        "Redesign a favorite level to improve flow, tension, clarity, or emotional payoff.",
      ],
      atmosphere:
        "Tactile, spatial, and highly experiential — a branch for people who want to shape what the player feels through movement and place.",
    },
    {
      id: "narrative-designer",
      slug: "narrative-designer",
      title: "Narrative Designer",
      summary:
        "Narrative designers build story into the player experience through choices, dialogue, quests, world lore, and emotional progression. The goal is not just to tell a story, but to make it playable.",
      whatYouActuallyDo: [
        "Write dialogue, branching moments, and character-driven choices that feel responsive rather than decorative.",
        "Connect story beats to mechanics, stakes, and player goals so the narrative has weight inside the experience.",
        "Shape emotional arcs that change how the player sees the world, the characters, or their own decisions.",
      ],
      skillsThatGrowHere: [
        "Interactive writing",
        "Character thinking",
        "Branching logic",
        "Emotional design",
      ],
      starterProjects: [
        "Write a short branching scene where the player can resolve a conflict in three very different ways.",
        "Create a tiny original world with lore, quests, and one meaningful player choice.",
        "Turn a story idea into a playable dialogue map instead of a traditional script.",
      ],
      atmosphere:
        "Story-rich and expressive, but strongest when paired with systems awareness and a real respect for player agency.",
    },
  ],

  dayInLife: {
    title: "A day in the life",
    summary:
      "The work is rarely one giant flash of inspiration. It is more often a cycle of noticing, shaping, testing, discussing, and refining until the experience starts to feel inevitable.",
    moments: [
      {
        id: "morning-review",
        timeLabel: "9:30 AM",
        title: "Review the latest build",
        body:
          "You play what the team has now, watching for drag, confusion, friction, surprise, and payoff. Sometimes the issue is obvious. Sometimes the feeling is off before the cause is clear.",
      },
      {
        id: "midday-design",
        timeLabel: "11:30 AM",
        title: "Refine a mechanic, loop, or level idea",
        body:
          "This is where concept turns practical. You sketch, rewrite, tune values, revise a design doc, or test whether a better rule creates a better player decision.",
      },
      {
        id: "afternoon-collab",
        timeLabel: "2:00 PM",
        title: "Talk with art, engineering, or narrative",
        body:
          "Good design rarely happens in isolation. You align the intended feeling with what is buildable, readable, and strong across the wider experience.",
      },
      {
        id: "late-test",
        timeLabel: "4:30 PM",
        title: "Playtest and adjust again",
        body:
          "A small change in difficulty, timing, layout, wording, or reward can completely change how something feels. This is where the work gets sharper.",
      },
    ],
  },

  forecast: {
    title: "What growth can look like",
    summary:
      "This path usually starts with curiosity and taste, but it becomes real through evidence. Momentum grows when you can show how you think, not just say you love games.",
    stages: [
      {
        id: "stage-1",
        label: "Early signal",
        timeframe: "Now → 2 months",
        summary:
          "You start studying games more actively. You move from pure consumption into observation, critique, and tiny experiments.",
        signalsOfProgress: [
          "You can explain why a mechanic, level, or reward loop works.",
          "You start collecting references, breakdowns, and design questions.",
          "You make your first paper prototype, redesign, or tiny playable idea.",
        ],
      },
      {
        id: "stage-2",
        label: "Real traction",
        timeframe: "2 → 6 months",
        summary:
          "You begin building a body of work: redesigns, mechanic concepts, small prototypes, level maps, quest flows, or balance docs that reveal your thinking.",
        signalsOfProgress: [
          "You can show process instead of only talking about interest.",
          "You revise based on feedback instead of defending the first version.",
          "Your work starts to show a recognizable design instinct or point of view.",
        ],
      },
      {
        id: "stage-3",
        label: "Deeper commitment",
        timeframe: "6+ months",
        summary:
          "You begin seeing your strongest branch more clearly and building a portfolio that shows both taste and structure.",
        signalsOfProgress: [
          "You can tell whether systems, levels, or narrative currently feels most alive to you.",
          "Your projects feel more intentional, coherent, and specific.",
          "You can talk clearly about player experience, tradeoffs, and what you were trying to achieve.",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Real next steps",
    summary:
      "Do not start with a giant dream plan. Start with proof. The point is to build evidence that this path energizes you — and to begin showing how you think.",
    actions: [
      {
        id: "game-designer-next-1",
        title: "Break down one game you know well",
        type: "tiny-task",
        effort: "light",
        timeEstimate: "20–30 min",
        whyThisMatters:
          "This turns you from a passive fan into an active observer. Designers grow fast when they can notice structure, intention, and emotional effect.",
        instructions: [
          "Pick one game, mode, or level you know well.",
          "Write down what keeps the player engaged or emotionally hooked.",
          "Identify one part you would redesign and explain why.",
        ],
      },
      {
        id: "game-designer-next-2",
        title: "Invent one tiny playable system",
        type: "project",
        effort: "medium",
        timeEstimate: "45–90 min",
        whyThisMatters:
          "Even a paper prototype proves more than vague interest. It gives you something to test, critique, and improve.",
        instructions: [
          "Choose one player action and one clear goal.",
          "Add one rule that creates tension, strategy, or tradeoff.",
          "Test it for a few rounds and note where it becomes boring, confusing, or unexpectedly fun.",
        ],
      },
      {
        id: "game-designer-next-3",
        title: "Choose the branch that feels most alive",
        type: "conversation",
        effort: "light",
        timeEstimate: "15–20 min",
        whyThisMatters:
          "You do not need to commit forever, but naming your current pull makes the path feel more real and helps you choose what to test next.",
        instructions: [
          "Compare systems, levels, and narrative.",
          "Ask which one feels most energizing right now.",
          "Write one sentence about why that branch stands out to you.",
        ],
      },
    ],
  },
};