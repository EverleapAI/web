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
    title: "Go to a real cultural event near you this week",
    description:
      "Step into another culture through food, music, language, celebration, or community gathering so this path becomes something you experience, not just read about.",
    href: "https://www.eventbrite.com/d/ca--san-francisco/cultural-events/",
    ctaLabel: "Find a cultural event",
    mode: "local",
    type: "event",
  },

  opportunityGroups: [
    {
      id: "try-this-week",
      label: "Start here",
      title: "Try this this week",
      description:
        "You do not need a passport to begin. Start with one real interaction, one real tradition, or one real conversation that opens your frame.",
      opportunities: [
        {
          title: "Cook a traditional dish from another culture",
          description:
            "Choose one country, make one authentic dish, and learn the story behind it so food becomes a way into family, place, and tradition.",
          href: "https://www.seriouseats.com/world-cuisines-5117984",
          ctaLabel: "Explore world cuisines",
          mode: "virtual",
          type: "project",
        },
        {
          title: "Start a language exchange on HelloTalk",
          description:
            "Talk with real people from other countries instead of only consuming content about them. Even one short exchange can change how culture feels.",
          href: "https://www.hellotalk.com/",
          ctaLabel: "Try HelloTalk",
          mode: "virtual",
          type: "conversation",
        },
        {
          title: "Interview someone about their family or cultural traditions",
          description:
            "Ask a friend, neighbor, classmate, or relative about holidays, food, migration, language, or what home means to them.",
          href: "https://storycorps.org/participate/great-questions/",
          ctaLabel: "Use conversation prompts",
          mode: "local",
          type: "conversation",
        },
        {
          title: "Watch one film from another country and take notes on daily life",
          description:
            "Do not just watch for plot. Notice family dynamics, humor, formality, public space, celebration, and what feels different or familiar.",
          href: "https://www.criterionchannel.com/world-cinema-project",
          ctaLabel: "Explore world cinema",
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
        "Global culture is not far away. It is in neighborhoods, festivals, places of worship, language communities, museums, and food spaces all around you.",
      opportunities: [
        {
          title: "Browse Bay Area cultural festivals and community events",
          description:
            "Find festivals, performances, markets, and celebrations that let you experience traditions in person instead of only hearing about them.",
          href: "https://www.eventbrite.com/d/ca--san-francisco/cultural-events/",
          ctaLabel: "Browse events",
          mode: "local",
          type: "event",
          locationLabel: "Bay Area",
        },
        {
          title: "Look for language exchange and international Meetup groups",
          description:
            "Meet people from different backgrounds through conversation groups, intercultural gatherings, and language-focused community events.",
          href: "https://www.meetup.com/find/?keywords=language%20exchange",
          ctaLabel: "Find local groups",
          mode: "local",
          type: "conversation",
          locationLabel: "Near you",
        },
        {
          title: "Visit a cultural museum or exhibit",
          description:
            "Use museums to understand how history, migration, art, identity, and storytelling shape cultures across time and place.",
          href: "https://www.si.edu/exhibitions",
          ctaLabel: "Explore exhibits",
          mode: "local",
          type: "experience",
        },
        {
          title: "Explore Japantown, Chinatown, or other cultural neighborhoods",
          description:
            "Walk through a neighborhood with the goal of noticing language, businesses, food, ritual, and how community identity is expressed in public space.",
          href: "https://www.sftravel.com/article/guide-san-franciscos-neighborhoods",
          ctaLabel: "Explore neighborhoods",
          mode: "local",
          type: "visit",
          locationLabel: "Bay Area",
        },
      ],
    },
    {
      id: "go-broader",
      label: "Go broader",
      title: "Go beyond your environment",
      description:
        "When this starts feeling real, move from curiosity into deeper international or intercultural experiences that change how you understand daily life.",
      opportunities: [
        {
          title: "AFS-USA exchange programs",
          description:
            "Live in another country and experience school, family life, and culture from the inside instead of as a visitor looking in.",
          href: "https://www.afsusa.org/",
          ctaLabel: "Explore exchange programs",
          mode: "travel",
          type: "exchange",
          ageNote: "Typically ages 14–18",
        },
        {
          title: "CIEE high school study abroad programs",
          description:
            "See what structured international learning looks like when language, host communities, and daily life all become part of the experience.",
          href: "https://www.ciee.org/go-abroad/high-school-study-abroad",
          ctaLabel: "View study abroad options",
          mode: "travel",
          type: "exchange",
          ageNote: "Teen-focused",
        },
        {
          title: "Projects Abroad cultural and service experiences",
          description:
            "Explore programs where you work with communities in other parts of the world while learning how culture and local context shape everything.",
          href: "https://www.projects-abroad.org/",
          ctaLabel: "View opportunities",
          mode: "travel",
          type: "volunteer",
        },
        {
          title: "Experiment with Workaway-style cultural immersion later on",
          description:
            "See how longer-term exchange and staying with hosts can turn travel into a more honest, day-to-day experience of another culture.",
          href: "https://www.workaway.info/",
          ctaLabel: "See how it works",
          mode: "travel",
          type: "experience",
          ageNote: "Better for later / older teens",
        },
      ],
    },
    {
      id: "always-on",
      label: "Always available",
      title: "Open a window to the world anytime",
      description:
        "Keep this path active through real voices, global stories, cultural archives, and tools that connect you to people instead of only facts.",
      opportunities: [
        {
          title: "HelloTalk",
          description:
            "Build real cross-cultural conversations with people around the world and notice how language, humor, tone, and daily life come through naturally.",
          href: "https://www.hellotalk.com/",
          ctaLabel: "Start talking",
          mode: "virtual",
          type: "conversation",
        },
        {
          title: "Tandem",
          description:
            "Practice language exchange while learning how people from different cultures actually speak, explain, and describe their lives.",
          href: "https://www.tandem.net/",
          ctaLabel: "Try Tandem",
          mode: "virtual",
          type: "conversation",
        },
        {
          title: "National Geographic",
          description:
            "Use photography, reporting, and documentaries to explore cultures and environments worldwide through strong storytelling.",
          href: "https://www.nationalgeographic.com/",
          ctaLabel: "Start exploring",
          mode: "virtual",
          type: "resource",
        },
        {
          title: "Smithsonian cultural collections and exhibits",
          description:
            "Dive into global history, migration, art, ritual, and human stories through digital exhibits that give culture more depth than surface-level content.",
          href: "https://www.si.edu/exhibitions",
          ctaLabel: "Explore exhibits",
          mode: "virtual",
          type: "resource",
        },
      ],
    },
  ],
};