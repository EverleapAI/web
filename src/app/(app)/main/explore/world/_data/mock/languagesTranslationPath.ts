// apps/web/src/app/(app)/main/explore/world/_data/mock/languagesTranslationPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const LANGUAGES_TRANSLATION_PATH: WorldPathContent = {
  id: "languages-translation",
  slug: "languages-translation",

  energy: "people",

  theme: {
    accent: "rgba(196,116,255,1)",
    accentStrong: "rgba(218,152,255,1)",
    glow: "rgba(170,84,236,0.35)",
    surfaceLabel: "Cross-cultural voice",
  },

  card: {
    title: "Languages + Translation",
    hook: "Understand people through how they speak, not just what they say.",
    description:
      "This is about how meaning travels — across languages, cultures, tone, and context. Not just words, but what people really mean.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Languages + Translation",
    subtitle: "Hear what others miss. Say what others can’t.",
    body:
      "Language is more than vocabulary — it’s tone, identity, culture, and emotion. When you step into another language, you don’t just translate words. You start understanding how people think, feel, and connect differently.",
    ambientLabel: "Language · Meaning · Connection",
    pullQuote:
      "Fluency isn’t just speaking — it’s understanding what someone meant, not just what they said.",
  },

  traitChips: [
    { label: "Language ear" },
    { label: "Meaning reader" },
    { label: "Culture curious" },
    { label: "Connection builder" },
    { label: "Detail noticer" },
  ],

  fitSignals: [
    {
      id: "language-curiosity",
      label: "You notice how people speak, not just what they say",
      score: 91,
      explanation:
        "You pick up on tone, phrasing, accents, and how expression changes meaning.",
    },
    {
      id: "meaning-sensitivity",
      label: "You care about getting the meaning right",
      score: 88,
      explanation:
        "You’re interested in nuance — not just words, but intention and context.",
    },
    {
      id: "cross-cultural-interest",
      label: "You like connecting people across differences",
      score: 85,
      explanation:
        "Helping ideas move between cultures feels meaningful and energizing.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How language carries meaning, emotion, and culture",
    intro:
      "This isn’t about memorizing vocabulary lists. It’s about understanding how language actually works between people.",
    items: [
      {
        title: "How meaning shifts across languages",
        description:
          "Why direct translation often fails — and how tone, context, and culture reshape what something really means.",
      },
      {
        title: "Language as identity",
        description:
          "How the way people speak reflects who they are, where they come from, and how they see the world.",
      },
      {
        title: "Listening beyond words",
        description:
          "Hearing emotion, intention, and subtext — not just the literal sentence.",
      },
      {
        title: "Communication across cultures",
        description:
          "How misunderstandings happen — and how clarity, empathy, and phrasing can bridge them.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Start using a new language immediately",
    description:
      "Skip theory. Learn a few real phrases and use them out loud — that’s when language becomes real.",
    href: "https://www.duolingo.com",
    ctaLabel: "Start a language now",
    mode: "virtual",
    type: "project",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "The fastest way into this world is to work with real language right away.",
      opportunities: [
        {
          title: "Learn 15 real phrases in a new language",
          description:
            "Focus on greetings, questions, and everyday expressions — and say them out loud.",
          href: "https://www.duolingo.com",
          ctaLabel: "Pick a language",
          mode: "virtual",
          type: "project",
        },
        {
          title: "Compare two translations of the same line",
          description:
            "See how tone and meaning shift depending on how something is translated.",
          href: "https://www.youtube.com",
          ctaLabel: "Find examples",
          mode: "virtual",
          type: "research",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "Use language in real life",
      description:
        "Language becomes real when you use it with actual people.",
      opportunities: [
        {
          title: "Join a local language meetup or conversation group",
          description:
            "Practice speaking and listening in a low-pressure, real-world setting.",
          href: "https://www.meetup.com",
          ctaLabel: "Find groups near you",
          mode: "local",
          type: "event",
          locationLabel: "Near you",
        },
        {
          title: "Talk with a native speaker or learner",
          description:
            "Even a short conversation makes language feel alive instantly.",
          href: "https://www.italki.com",
          ctaLabel: "Find a conversation partner",
          mode: "virtual",
          type: "conversation",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Take it further",
      description:
        "Step into deeper or more immersive language experiences.",
      opportunities: [
        {
          title: "Language immersion programs",
          description:
            "Travel and learn a language by living inside it daily.",
          href: "https://www.gooverseas.com/language-schools-abroad",
          ctaLabel: "Explore immersion programs",
          mode: "travel",
          type: "program",
          ageNote: "Teen + adult options",
        },
        {
          title: "Volunteer as a language bridge",
          description:
            "Help translate or support communication in community or global settings.",
          href: "https://www.translatorswithoutborders.org",
          ctaLabel: "Learn how to get involved",
          mode: "hybrid",
          type: "volunteer",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Keep a window open to language",
      description:
        "Make language part of your daily environment.",
      opportunities: [
        {
          title: "Language Transfer",
          description:
            "Audio-based learning that helps you understand how language works, not just memorize it.",
          href: "https://www.languagetransfer.org",
          ctaLabel: "Start listening",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Watch shows in another language",
          description:
            "Use subtitles and repetition to train your ear naturally.",
          href: "https://www.netflix.com",
          ctaLabel: "Try it on Netflix",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};