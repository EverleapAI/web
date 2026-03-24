// apps/web/src/app/(app)/main/explore/world/_data/mock/globalCulturesPath.ts

import type { WorldPathContent } from "../worldPathSchema";

export const GLOBAL_CULTURES_PATH: WorldPathContent = {
  id: "global-cultures",
  slug: "global-cultures",

  energy: "people",

  theme: {
    accent: "rgba(255,148,64,1)",
    accentStrong: "rgba(255,178,102,1)",
    glow: "rgba(255,128,52,0.35)",
    surfaceLabel: "Global curiosity",
  },

  card: {
    title: "Global Cultures",
    hook:
      "Understand how people live, think, and organize life across the world.",
    description:
      "This is about stepping into other ways of living — traditions, language, family, identity, and how different cultures make sense of the world.",
  },

  hero: {
    eyebrow: "World direction",
    title: "Global Cultures",
    subtitle: "See the world through other people’s lives",
    body:
      "Every culture solves life differently — family, work, celebration, conflict, meaning. When you explore cultures, you don’t just learn about others. You start to see your own world differently too.",
    ambientLabel: "People · Perspective · Culture",
    pullQuote:
      "The moment you see how someone else lives, your idea of ‘normal’ expands.",
  },

  traitChips: [
    { label: "Curious about people" },
    { label: "Global mindset" },
    { label: "Observer of culture" },
    { label: "Story listener" },
  ],

  fitSignals: [
    {
      id: "culture-curiosity",
      label: "You wonder what life is like in other places",
      score: 90,
      explanation:
        "You naturally think about how people live outside your immediate environment.",
    },
    {
      id: "perspective-interest",
      label: "You like understanding different perspectives",
      score: 86,
      explanation:
        "You’re interested in how culture shapes how people think and act.",
    },
    {
      id: "travel-energy",
      label: "Experiencing new environments excites you",
      score: 82,
      explanation:
        "New places, people, and ways of living feel energizing rather than intimidating.",
    },
  ],

  whatYouExplore: {
    label: "What you start exploring",
    title: "How people live, connect, and make meaning",
    intro:
      "This direction isn’t about memorizing facts about countries. It’s about understanding how real people live — and how different that can be.",
    items: [
      {
        title: "Daily life across cultures",
        description:
          "How people eat, work, celebrate, communicate, and spend time — and what that says about what matters to them.",
      },
      {
        title: "Traditions, rituals, and identity",
        description:
          "The practices that shape belonging — from holidays to family roles to community expectations.",
      },
      {
        title: "Language and communication",
        description:
          "How tone, words, and expression change meaning across cultures — and how language shapes thought.",
      },
      {
        title: "Perspective and worldview",
        description:
          "How people interpret success, happiness, respect, and purpose differently depending on where they grow up.",
      },
    ],
  },

  featuredOpportunity: {
    label: "Best first move",
    title: "Experience a culture directly this week",
    description:
      "Start small but real. Step into another culture through food, language, or community — not just content.",
    href: "https://www.eventbrite.com/d/ca--marin-county/cultural-events/",
    ctaLabel: "Find a local cultural event",
    mode: "local",
    type: "event",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "You don’t need to travel far to start experiencing culture differently.",
      opportunities: [
        {
          title: "Cook a traditional dish from another culture",
          description:
            "Choose a country, cook one authentic meal, and learn the story behind it.",
          href: "https://www.youtube.com/results?search_query=traditional+recipes+by+country",
          ctaLabel: "Find a recipe",
          mode: "virtual",
          type: "project",
        },
        {
          title: "Watch media from another country",
          description:
            "Watch a documentary or creator from another culture and notice how life feels similar or different.",
          href: "https://www.youtube.com",
          ctaLabel: "Explore global content",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
    {
      id: "near-you",
      label: "Explore near you",
      title: "Step into culture locally",
      description:
        "You can experience global culture without leaving your area.",
      opportunities: [
        {
          title: "Local cultural festivals (Marin / Bay Area)",
          description:
            "Attend festivals, markets, or events representing different cultures and communities.",
          href: "https://www.eventbrite.com/d/ca--san-francisco/cultural-events/",
          ctaLabel: "Browse events",
          mode: "local",
          type: "event",
          locationLabel: "Near you",
        },
        {
          title: "Visit a cultural museum or exhibit",
          description:
            "Explore how different cultures are represented through artifacts, stories, and history.",
          href: "https://www.si.edu",
          ctaLabel: "Explore museums",
          mode: "local",
          type: "experience",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Go beyond your environment",
      description:
        "When you're ready, step into deeper or global experiences.",
      opportunities: [
        {
          title: "Student exchange programs",
          description:
            "Live in another country and experience daily life from the inside.",
          href: "https://www.afsusa.org",
          ctaLabel: "Explore exchange programs",
          mode: "travel",
          type: "exchange",
          ageNote: "Typically ages 14–18",
        },
        {
          title: "Global volunteer experiences",
          description:
            "Work alongside communities in different parts of the world.",
          href: "https://www.projects-abroad.org",
          ctaLabel: "View opportunities",
          mode: "travel",
          type: "volunteer",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Open a window to the world anytime",
      description:
        "These are always-on ways to stay connected to global cultures.",
      opportunities: [
        {
          title: "National Geographic",
          description:
            "Stories and documentaries exploring cultures and environments worldwide.",
          href: "https://www.nationalgeographic.com",
          ctaLabel: "Start exploring",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Smithsonian global culture resources",
          description:
            "Deep dives into culture, history, and human stories through digital exhibits.",
          href: "https://www.si.edu",
          ctaLabel: "Explore exhibits",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};