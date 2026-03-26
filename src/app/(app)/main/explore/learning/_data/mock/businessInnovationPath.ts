// apps/web/src/app/(app)/main/explore/learning/_data/mock/businessInnovationPath.ts

import type { LearningPathContent } from "../learningPathSchema";

export const BUSINESS_INNOVATION_PATH: LearningPathContent = {
  id: "business-innovation",
  slug: "business-innovation",
  lane: "learning",

  theme: {
    tone: "builder-energy",
    accent: { r: 255, g: 188, b: 92 },
    accentStrong: { r: 255, g: 132, b: 82 },
    glow: { r: 255, g: 170, b: 120 },
    surfaceLabel: "Builder mindset",
  },

  card: {
    title: "Business + Innovation",
    hook: "Turn ideas into real things people actually use.",
    description:
      "A path for people who like building, experimenting, solving problems, and creating value in the real world.",
  },

  hero: {
    eyebrow: "Learning path",
    title: "Business + Innovation",
    hook: "For people who think in ideas — and want to make them real.",
    summary:
      "This path is about building. Not just thinking, not just planning — actually testing ideas, launching projects, and seeing what works.",
    whyItPullsYouIn: [
      "You constantly think about improvements or new ideas.",
      "You like building projects, not just talking about them.",
      "You notice how systems or businesses could work better.",
      "You enjoy solving real problems.",
    ],
  },

  traitChips: [
    { id: "idea-generator", label: "Idea generator" },
    { id: "builder-mindset", label: "Builder mindset" },
    { id: "problem-solver", label: "Problem solver" },
    { id: "initiative", label: "Initiative" },
  ],

  fitSignals: [
    {
      id: "spot-opportunities",
      label: "You notice opportunities to improve things",
      score: 94,
      explanation: "You naturally see how things could work better.",
    },
    {
      id: "build-energy",
      label: "You like building and launching ideas",
      score: 90,
      explanation: "Ideas feel exciting when they become real.",
    },
    {
      id: "value-thinking",
      label: "You think about what people actually need",
      score: 88,
      explanation: "You notice when something solves a real problem.",
    },
  ],

  whatYouLearn: [
    {
      id: "idea-to-reality",
      title: "How ideas become real",
      description: "Turning concepts into projects, products, or services.",
    },
    {
      id: "testing",
      title: "How to test ideas quickly",
      description: "Prototypes, experiments, and feedback loops.",
    },
    {
      id: "value",
      title: "What creates real value",
      description: "Understanding what people actually want or need.",
    },
    {
      id: "iteration",
      title: "How to improve through iteration",
      description: "Learning fast, adjusting, and trying again.",
    },
    {
      id: "execution",
      title: "How to execute, not just plan",
      description: "Moving from thinking → building → launching.",
    },
  ],

  featuredOpportunity: {
    title: "Launch something small this week",
    provider: "Self-directed",
    summary:
      "Take one idea and turn it into something real — even if it is tiny.",
    whyStartHere:
      "This path only makes sense when you actually build something.",
    mode: "hybrid",
    formatLabel: "Real-world experiment",
  },

  opportunityGroups: [
    {
      id: "near-you",
      title: "Near you (Marin / Bay Area)",
      description:
        "Real environments where ideas turn into projects, products, and experiments.",
      items: [
        {
          id: "score-mentors",
          title: "SCORE mentoring and local business workshops",
          provider: "SCORE",
          summary:
            "Free small-business mentoring, events, and practical advice from experienced builders.",
          whyItFits:
            "A strong way to hear how real people take an idea and make it viable.",
          mode: "local",
          href: "https://www.score.org/find-mentor",
          locationLabel: "Bay Area",
          formatLabel: "Mentorship + events",
          tags: ["local", "structured", "hands-on"],
        },
        {
          id: "sbdc",
          title: "Small Business Development Center",
          provider: "SBA / SBDC",
          summary:
            "Local advising, workshops, and startup support for people building something real.",
          whyItFits:
            "Shows how ideas move from concept into operations, customers, and execution.",
          mode: "local",
          href: "https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers-sbdc",
          locationLabel: "Bay Area",
          formatLabel: "Workshops + advising",
          tags: ["local", "structured", "hands-on"],
        },
        {
          id: "eventbrite-hackathons",
          title: "Bay Area hackathons and startup events",
          provider: "Eventbrite",
          summary:
            "Find local build sprints, startup meetups, and innovation events where people create fast.",
          whyItFits:
            "Good if you want to feel the speed and energy of real innovation cycles.",
          mode: "hybrid",
          href: "https://www.eventbrite.com/d/ca--san-francisco/hackathon/",
          locationLabel: "Bay Area",
          formatLabel: "Events + build sprints",
          tags: ["local", "hands-on", "structured"],
        },
        {
          id: "meetup-founders",
          title: "Startup and founder meetups",
          provider: "Meetup",
          summary:
            "Browse Bay Area founder, builder, and product meetups where people test ideas and share what works.",
          whyItFits:
            "You get close to real builder conversations instead of just reading about innovation.",
          mode: "local",
          href: "https://www.meetup.com/find/?keywords=startup&source=EVENTS&location=us--ca--San%20Francisco",
          locationLabel: "Bay Area",
          formatLabel: "Community + networking",
          tags: ["local", "hands-on"],
        },
        {
          id: "marin-makerspace-search",
          title: "Maker spaces and build communities near you",
          provider: "Google Maps / local search",
          summary:
            "Look for maker spaces, fabrication labs, and community build spaces where ideas become prototypes.",
          whyItFits:
            "Great for people who think better when they are making something tangible.",
          mode: "local",
          href: "https://www.google.com/search?q=maker+space+Marin+County",
          locationLabel: "Near 94901",
          formatLabel: "Hands-on exploration",
          tags: ["local", "hands-on"],
        },
      ],
    },

    {
      id: "build-skill",
      title: "Build real skill",
      description:
        "Structured online places to learn how ideas become products, experiments, and real businesses.",
      items: [
        {
          id: "startup-school",
          title: "Y Combinator Startup School",
          provider: "Y Combinator",
          summary:
            "Free startup education from real founders on building, testing, and growing ideas.",
          whyItFits:
            "Shows how real ideas turn into real companies without making the process feel abstract.",
          mode: "virtual",
          href: "https://www.startupschool.org",
          formatLabel: "Structured startup learning",
          tags: ["structured", "free", "self-paced"],
        },
        {
          id: "coursera-innovation",
          title: "Innovation and entrepreneurship courses",
          provider: "Coursera",
          summary:
            "Intro courses on entrepreneurship, innovation, design thinking, and launching ideas.",
          whyItFits:
            "Useful when you want frameworks for testing, refining, and improving what you build.",
          mode: "virtual",
          href: "https://www.coursera.org/courses?query=innovation%20entrepreneurship",
          formatLabel: "Structured learning",
          tags: ["structured", "self-paced"],
        },
        {
          id: "stanford-ecorner",
          title: "Stanford eCorner",
          provider: "Stanford",
          summary:
            "Talks, lessons, and stories from founders, investors, and builders about what actually works.",
          whyItFits:
            "Good for hearing how people move from an idea to a real project in the real world.",
          mode: "virtual",
          href: "https://ecorner.stanford.edu",
          formatLabel: "Talks + real founder insight",
          tags: ["structured", "self-paced"],
        },
        {
          id: "indie-hackers",
          title: "Indie Hackers",
          provider: "Indie Hackers",
          summary:
            "A community of people building products, audiences, and businesses in public.",
          whyItFits:
            "Lets you see the messy, real process of launching and iterating instead of only polished success stories.",
          mode: "virtual",
          href: "https://www.indiehackers.com",
          formatLabel: "Community + case studies",
          tags: ["self-paced", "hands-on"],
        },
        {
          id: "product-hunt",
          title: "Product Hunt",
          provider: "Product Hunt",
          summary:
            "Explore newly launched products and see what people are building right now.",
          whyItFits:
            "Sharpens your sense of what gets attention, what solves a problem, and how ideas are positioned.",
          mode: "virtual",
          href: "https://www.producthunt.com",
          formatLabel: "Product discovery",
          tags: ["self-paced", "hands-on"],
        },
      ],
    },
  ],
};