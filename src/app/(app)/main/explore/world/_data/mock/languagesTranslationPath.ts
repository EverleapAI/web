// apps/web/src/app/(app)/main/explore/world/_data/mock/languagesTranslationPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const LANGUAGES_TRANSLATION_PATH: WorldPathContent = {
  id: "languages-translation",
  slug: "languages-translation",
  lane: "world",

  theme: {
    tone: "cross-cultural-voice",
    accent: { r: 196, g: 116, b: 255 },
    accentStrong: { r: 218, g: 152, b: 255 },
    glow: { r: 170, g: 84, b: 236 },
    surfaceLabel: "Cross-cultural voice",
  },

  card: {
    title: "Languages + Translation",
    hook: "Explore the world through language, meaning, and human connection.",
    description:
      "Some people are fascinated by how ideas shift across languages, accents, cultures, and contexts. This direction is about communication across borders — not just words, but tone, meaning, and worldview.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Languages + Translation",
    hook: "For people who feel that language is more than vocabulary — it is a way into culture, identity, and connection.",
    summary:
      "Language changes what you notice. It changes how you hear emotion, how you understand culture, and how you move through the world. This path is for people who are drawn to language learning, translation, interpretation, and the human skill of helping meaning travel from one world to another.",
    whyItPullsYouIn: [
      "You are curious about other languages, accents, and ways of speaking.",
      "You like noticing how meaning changes with tone, word choice, and context.",
      "You are interested in culture through communication, not just facts.",
      "You like the idea of helping people understand each other better.",
    ],
  },

  traitChips: [
    { id: "language-ear", label: "Language ear" },
    { id: "meaning-reader", label: "Meaning reader" },
    { id: "culture-curious", label: "Culture curious" },
    { id: "connection-builder", label: "Connection builder" },
    { id: "detail-noticer", label: "Detail noticer" },
  ],

  fitSignals: [
    {
      id: "language-curiosity",
      label: "You are naturally curious about how people speak and communicate",
      score: 91,
      explanation:
        "You notice phrases, accents, expressions, and the way language carries personality and culture.",
    },
    {
      id: "meaning-sensitivity",
      label: "You care about getting the meaning right, not just the words",
      score: 88,
      explanation:
        "You are interested in nuance, tone, and what someone is really trying to say.",
    },
    {
      id: "cross-cultural-interest",
      label: "You are energized by communication across cultures",
      score: 85,
      explanation:
        "You like the idea of helping ideas move between people who see the world differently.",
    },
  ],

  branchPreviews: [
    {
      id: "language-learning",
      slug: "language-learning",
      title: "Language Learning",
      oneLiner: "Build fluency and hear the world through another language.",
      whyItCouldFit:
        "Great if you enjoy learning how people speak, think, and express meaning differently.",
      energy: "people",
    },
    {
      id: "translation-writing",
      slug: "translation-writing",
      title: "Translation + Writing",
      oneLiner: "Move ideas across languages while preserving meaning and tone.",
      whyItCouldFit:
        "Strong fit if you care about nuance, wording, and how language lands.",
      energy: "creative",
    },
    {
      id: "interpretation-communication",
      slug: "interpretation-communication",
      title: "Interpretation + Communication",
      oneLiner: "Help people understand each other in real time and real contexts.",
      whyItCouldFit:
        "Good for people who like listening closely and communicating clearly under pressure.",
      energy: "high-energy",
    },
  ],

  branches: [
    {
      id: "language-learning",
      slug: "language-learning",
      title: "Language Learning",
      summary:
        "This branch focuses on building fluency, listening skill, and comfort moving inside another language.",
      whatYouActuallyExplore: [
        "Vocabulary, grammar, and real-world usage",
        "How tone, rhythm, and expression change across languages",
        "How language learning opens access to culture and worldview",
      ],
      skillsThatGrowHere: [
        "Listening",
        "Memory",
        "Pronunciation awareness",
        "Cross-cultural communication",
      ],
      starterProjects: [
        "Learn 25 useful phrases in a new language",
        "Track one week of short daily language practice",
        "Create a mini guide to greetings and expressions in one language",
      ],
      atmosphere:
        "Curious, connective, and full of small breakthroughs.",
    },
    {
      id: "translation-writing",
      slug: "translation-writing",
      title: "Translation + Writing",
      summary:
        "This branch is about carrying ideas across languages carefully — not just word for word, but with attention to tone, meaning, and context.",
      whatYouActuallyExplore: [
        "How translation changes when tone or audience changes",
        "Why literal translation often misses the point",
        "How writing choices shape clarity and feeling",
      ],
      skillsThatGrowHere: [
        "Nuance reading",
        "Writing precision",
        "Meaning analysis",
        "Tone control",
      ],
      starterProjects: [
        "Translate a short quote or paragraph and compare versions",
        "Explain one phrase that does not translate neatly",
        "Rewrite one idea for two different audiences",
      ],
      atmosphere:
        "Precise, thoughtful, and surprisingly creative.",
    },
    {
      id: "interpretation-communication",
      slug: "interpretation-communication",
      title: "Interpretation + Communication",
      summary:
        "This branch explores the fast, human side of communication across languages and contexts — listening, clarifying, and helping meaning land.",
      whatYouActuallyExplore: [
        "How people communicate under time pressure",
        "Why clarity matters in live conversation",
        "How context, emotion, and audience shape interpretation",
      ],
      skillsThatGrowHere: [
        "Fast listening",
        "Clarity under pressure",
        "Audience awareness",
        "Verbal confidence",
      ],
      starterProjects: [
        "Summarize a spoken clip in simpler language",
        "Practice explaining one idea clearly in two different tones",
        "Compare subtitles, dubbing, and literal translation in one short scene",
      ],
      atmosphere:
        "Human, alert, and full of real-time meaning-making.",
    },
  ],

  tryNow: {
    title: "Try this path now",
    summary:
      "The fastest way into this path is to work with real language, not just think about it.",
    actions: [
      {
        id: "learn-phrases",
        title: "Learn 15 useful phrases in a new language",
        type: "experiment",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "Language starts feeling real when it becomes usable, not just interesting.",
        instructions: [
          "Pick a language you are curious about.",
          "Learn greetings, questions, and everyday phrases.",
          "Say them out loud enough times to hear the rhythm.",
        ],
      },
      {
        id: "compare-translation",
        title: "Compare two translations of the same line",
        type: "research",
        effort: "light",
        timeEstimate: "30–45 min",
        whyThisMatters:
          "This helps you notice that translation is about choices, not just matching words.",
        instructions: [
          "Pick a quote, poem line, lyric, or short scene.",
          "Find two translated versions if possible.",
          "Notice how tone or meaning shifts between them.",
        ],
      },
      {
        id: "media-immersion",
        title: "Watch short media in another language",
        type: "experiment",
        effort: "medium",
        timeEstimate: "30–60 min",
        whyThisMatters:
          "Hearing a language in real use helps you notice rhythm, emotion, and context.",
        instructions: [
          "Choose a short clip, interview, or scene.",
          "Listen once for feeling and once for details.",
          "Write down what felt familiar, surprising, or hard to catch.",
        ],
      },
    ],
  },

  howItFeels: {
    title: "What this path tends to feel like",
    summary:
      "This path often feels like the world is gaining extra layers. Meaning stops being flat and starts feeling textured.",
    moments: [
      {
        id: "new-ears",
        title: "You start hearing more inside language",
        body:
          "You notice rhythm, formality, emotion, and hidden meaning more quickly than before.",
      },
      {
        id: "culture-through-voice",
        title: "Culture starts sounding different, not just looking different",
        body:
          "You begin to feel how ways of speaking carry values, humor, distance, and identity.",
      },
      {
        id: "connection-shift",
        title: "Communication starts feeling like a bridge",
        body:
          "Helping meaning travel between people can feel surprisingly powerful and human.",
      },
    ],
  },

  growthPath: {
    title: "How people grow in this path",
    summary:
      "Growth usually starts with curiosity about language, then deepens through listening, practice, nuance, and real-world communication.",
    stages: [
      {
        id: "notice",
        label: "Notice language differently",
        timeframe: "First few weeks",
        summary:
          "You start paying closer attention to phrasing, expression, and how people communicate across contexts.",
        signalsOfProgress: [
          "You become more aware of tone and wording",
          "You notice that translation is rarely one-to-one",
        ],
      },
      {
        id: "practice",
        label: "Build real communication skill",
        timeframe: "1–3 months",
        summary:
          "You begin practicing listening, speaking, reading, or translating in more active ways.",
        signalsOfProgress: [
          "You can understand or produce more than isolated words",
          "You become more confident working with real examples",
        ],
      },
      {
        id: "bridge",
        label: "Think like a meaning bridge",
        timeframe: "After repeated exploration",
        summary:
          "You begin seeing language as a tool for connection, culture, and interpretation.",
        signalsOfProgress: [
          "You care more about nuance and audience",
          "You begin imagining futures connected to language, writing, or communication",
        ],
      },
    ],
  },

  nextSteps: {
    title: "Take the next step into languages and translation",
    summary:
      "This path gets stronger when you mix language exposure, real communication, and cultural context.",
    actions: [
      {
        id: "daily-language-rhythm",
        title: "Build a 10-minute daily language rhythm",
        type: "plan",
        effort: "light",
        timeEstimate: "2 weeks",
        whyThisMatters:
          "Consistency changes language learning more than intensity does.",
        instructions: [
          "Choose one language.",
          "Do 10 minutes a day of listening, speaking, reading, or vocab review.",
          "Track what starts feeling easier after two weeks.",
        ],
      },
      {
        id: "talk-to-speaker",
        title: "Have one conversation with a speaker or learner",
        type: "conversation",
        effort: "medium",
        timeEstimate: "20–45 min",
        whyThisMatters:
          "Language becomes much more alive when another person is involved.",
        instructions: [
          "Find a classmate, friend, teacher, or conversation partner.",
          "Use simple phrases and ask one or two real questions.",
          "Notice what feels exciting versus intimidating.",
        ],
      },
    ],
    opportunityGroups: [
      {
        id: "language-learning-resources",
        title: "Places to go deeper",
        description:
          "These are strong starting points for language learning, listening practice, and cross-cultural communication.",
        items: [
          {
            id: "duolingo",
            title: "Duolingo",
            mode: "virtual",
            provider: "Duolingo",
            summary:
              "A beginner-friendly way to build consistency and get early exposure to a language.",
            whyItHelps:
              "Good for turning curiosity into a daily habit fast.",
            href: "https://www.duolingo.com",
            formatLabel: "Daily practice app",
          },
          {
            id: "language-transfer",
            title: "Language Transfer",
            mode: "virtual",
            provider: "Language Transfer",
            summary:
              "Free audio-based language courses that help you think through how a language works.",
            whyItHelps:
              "Useful for people who like hearing structure and meaning, not just memorizing lists.",
            href: "https://www.languagetransfer.org",
            formatLabel: "Audio lessons",
          },
        ],
      },
    ],
  },
};