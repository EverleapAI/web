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
          "Why direct translation often fails — and how tone, context, and culture reshape meaning.",
      },
      {
        title: "Language as identity",
        description:
          "How speech reflects background, culture, and worldview.",
      },
      {
        title: "Listening beyond words",
        description:
          "Hearing intention, tone, and emotion — not just literal sentences.",
      },
      {
        title: "Communication across cultures",
        description:
          "How misunderstanding happens — and how language can bridge it.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Start speaking with a real person on HelloTalk",
    description:
      "Skip passive learning. Start messaging or speaking with real people in another language — even a short exchange changes everything.",
    href: "https://www.hellotalk.com",
    ctaLabel: "Start talking",
    mode: "virtual",
    type: "conversation",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "Language becomes real when you use it — not when you study it.",
      opportunities: [
        {
          title: "Learn 15 real phrases and say them out loud",
          description:
            "Focus on useful, everyday language and practice speaking immediately.",
          href: "https://www.duolingo.com",
          ctaLabel: "Pick a language",
          mode: "virtual",
          type: "project",
        },
        {
          title: "Have a 5-minute conversation on HelloTalk or Tandem",
          description:
            "Even short exchanges build real communication faster than passive study.",
          href: "https://www.tandem.net",
          ctaLabel: "Start a conversation",
          mode: "virtual",
          type: "conversation",
        },
        {
          title: "Compare two translations of the same sentence",
          description:
            "Notice how tone and meaning shift depending on phrasing.",
          href: "https://www.reverso.net/text-translation",
          ctaLabel: "Try translation tools",
          mode: "virtual",
          type: "research",
        },
        {
          title: "Shadow native speakers",
          description:
            "Listen to short clips and repeat them out loud to match rhythm and tone.",
          href: "https://www.youtube.com",
          ctaLabel: "Find clips",
          mode: "virtual",
          type: "project",
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
          title: "Join a local language meetup",
          description:
            "Practice speaking in a low-pressure, real-world setting.",
          href: "https://www.meetup.com",
          ctaLabel: "Find groups",
          mode: "local",
          type: "event",
        },
        {
          title: "Take a conversation lesson on iTalki",
          description:
            "Speak with a native speaker and get real-time feedback.",
          href: "https://www.italki.com",
          ctaLabel: "Find a tutor",
          mode: "virtual",
          type: "conversation",
        },
        {
          title: "Attend a cultural or language event",
          description:
            "Use language in context through real experiences.",
          href: "https://www.eventbrite.com",
          ctaLabel: "Browse events",
          mode: "local",
          type: "event",
        },
      ],
    },

    {
      id: "go-broader",
      label: "Go broader",
      title: "Take it further",
      description:
        "Step into immersive or real-world language environments.",
      opportunities: [
        {
          title: "Language immersion programs",
          description:
            "Learn by living inside the language daily.",
          href: "https://www.gooverseas.com/language-schools-abroad",
          ctaLabel: "Explore programs",
          mode: "travel",
          type: "program",
        },
        {
          title: "Volunteer as a translator",
          description:
            "Help bridge communication in real-world settings.",
          href: "https://www.translatorswithoutborders.org",
          ctaLabel: "Learn more",
          mode: "hybrid",
          type: "volunteer",
        },
        {
          title: "Duolingo Events",
          description:
            "Join live sessions and practice speaking with others.",
          href: "https://events.duolingo.com",
          ctaLabel: "Join events",
          mode: "virtual",
          type: "event",
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
            "Understand how language works, not just memorize it.",
          href: "https://www.languagetransfer.org",
          ctaLabel: "Start listening",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Watch shows in another language",
          description:
            "Train your ear through repetition and immersion.",
          href: "https://www.netflix.com",
          ctaLabel: "Try it",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "LingQ",
          description:
            "Learn languages through real-world content.",
          href: "https://www.lingq.com",
          ctaLabel: "Explore LingQ",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};