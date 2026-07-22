// apps/web/src/app/(app)/main/guide/guideTree.ts
//
// The manual, as data.
//
// Everleap's single biggest complaint is that people arrive and don't know what
// they're supposed to do. The agentic reads help, but a paragraph explaining an
// app is still a paragraph. This is the shape of the thing instead: one star you
// feed and four it feeds, each opening into its own sky.
//
// NOTHING HERE IS PERSONALISED. It is a user's manual — the same for everybody,
// authored once, no API call, no generation, no per-user state. That is why it
// can be a static file sitting next to its component instead of a surface.
//
// The depth mirrors the app's real depth rather than inventing a tidy diagram:
// Explore genuinely opens into lanes, and World genuinely opens into six ways of
// going. Every branch bottoms out — a map with no floor is a maze, and the point
// is to make somebody feel less lost.

export type GuideNode = {
  id: string;
  label: string;
  /** Position within the 384x268 sky. Hand-placed: evenly spaced reads as a menu. */
  x: number;
  y: number;
  accent: string;
  /** What it is, in one or two plain sentences. */
  what: string;
  /**
   * How it fills. Stated about the app, never about the reader — "fills once the
   * story holds enough" rather than "you haven't answered enough". Same fact,
   * and it is the part that answers "why would I answer fifty-one questions".
   */
  fills?: string;
  /** A real scene photo from the catalogue, shown beside the star. */
  photo?: string;
  photoCaption?: string;
};

export type GuideSkyDef = {
  title: string;
  nodes: GuideNode[];
  /** The genuine dependency between parts, not decoration. */
  edges: [string, string][];
};

const STORY = "255, 214, 140";
const TODAY = "96, 176, 255";
const INSIGHTS = "167, 139, 250";
const EXPLORE = "52, 211, 153";
const ACTIONS = "245, 176, 90";
const ME = "244, 132, 176";

export const GUIDE_SKIES: Record<string, GuideSkyDef> = {
  root: {
    title: "Everleap",
    nodes: [
      {
        id: "story", label: "Your story", x: 58, y: 134, accent: STORY,
        what: "Where everything else comes from. I ask you about what moves you, what you're good at, and what you can actually do.",
        photo: "self-enrichment-teachers", photoCaption: "A teaching day",
      },
      {
        id: "insights", label: "Insights", x: 182, y: 50, accent: INSIGHTS,
        what: "What I'm starting to notice about you, with the evidence I drew it from, so you can tell me I'm wrong.",
        fills: "Fills once the story holds enough for something to repeat. One answer is a fact; five is a pattern.",
      },
      {
        id: "today", label: "Today", x: 168, y: 150, accent: TODAY,
        what: "Where you land. One read on where you are right now, and one thing worth doing about it.",
        fills: "Works from day one — it just gets sharper the more the story holds.",
      },
      {
        id: "explore", label: "Explore", x: 286, y: 96, accent: EXPLORE,
        what: "Careers, learning, the world, causes and things to try — each opening into what a real day looks like.",
        fills: "Works without the story, but every path would be the one it shows anybody.",
        photo: "chefs-and-head-cooks", photoCaption: "A chef, mid-service",
      },
      {
        id: "actions", label: "Actions", x: 262, y: 210, accent: ACTIONS,
        what: "Small real-world missions. Not reading, not homework — you go and do something, then say how it went.",
        fills: "Stays empty until something in Explore is worth trying.",
      },
      {
        id: "me", label: "Me", x: 344, y: 184, accent: ME,
        what: "Your badges, your profile, and the place to correct anything I believe about you that has stopped being true.",
      },
    ],
    // Actions loops back to Story because doing something is evidence too. That
    // is what makes this a loop rather than a funnel.
    edges: [
      ["story", "insights"], ["story", "today"], ["insights", "explore"],
      ["explore", "actions"], ["actions", "story"], ["explore", "me"],
    ],
  },

  story: {
    title: "Your story",
    nodes: [
      { id: "s-mot", label: "Motivations", x: 92, y: 92, accent: STORY,
        what: "19 questions about what moves you. The ones that make Insights possible at all." },
      { id: "s-str", label: "Strengths", x: 222, y: 62, accent: STORY,
        what: "12 questions about what you're good at, and what people come to you for." },
      { id: "s-ski", label: "Skills", x: 186, y: 188, accent: STORY,
        what: "19 questions about what you can do, and what you'd like to do better." },
    ],
    edges: [["s-mot", "s-str"], ["s-str", "s-ski"]],
  },

  insights: {
    title: "Insights",
    nodes: [
      { id: "i-mot", label: "Motivations", x: 84, y: 84, accent: INSIGHTS,
        what: "What pulls you forward, and what drains you. Built from your own words, not a personality type." },
      { id: "i-str", label: "Strengths", x: 214, y: 54, accent: INSIGHTS,
        what: "What you're good at and what people come to you for — each with the answer it came from." },
      { id: "i-ski", label: "Skills", x: 150, y: 178, accent: INSIGHTS,
        what: "What you can already do, what you want to get better at, and what you avoid." },
      { id: "i-fun", label: "Fun facts", x: 300, y: 150, accent: INSIGHTS,
        what: "The lighter end. Includes Time Twin — a real historical figure whose way of thinking rhymes with yours.",
        photo: "graphic-designers", photoCaption: "A designer at work" },
    ],
    edges: [["i-mot", "i-str"], ["i-str", "i-ski"], ["i-ski", "i-fun"]],
  },

  explore: {
    title: "Explore",
    nodes: [
      { id: "e-work", label: "Careers", x: 70, y: 96, accent: EXPLORE,
        what: "807 real careers, from the same list the US government uses. Open one and you get a real day in it, not a job description.",
        photo: "registered-nurses", photoCaption: "A nurse on shift" },
      { id: "e-learn", label: "Learning", x: 180, y: 46, accent: EXPLORE,
        what: "Fields of study — what you'd actually learn, whether or not it becomes a job.",
        photo: "architects-except-landscape-and-naval", photoCaption: "An architect's desk" },
      { id: "e-world", label: "World", x: 290, y: 92, accent: EXPLORE,
        what: "Places you could actually go, and the ways to get there. Not geography homework.",
        photo: "cambodia", photoCaption: "Cambodia" },
      { id: "e-imp", label: "Impact", x: 126, y: 196, accent: EXPLORE,
        what: "Causes you might give time to, and what you'd genuinely do about one on a Tuesday.",
        photo: "farmers-ranchers-and-other-agricultural-managers", photoCaption: "A working farm" },
      { id: "e-play", label: "Play", x: 262, y: 206, accent: EXPLORE,
        what: "Things to try for the sake of it. Real places near you, not categories of place.",
        photo: "musicians-and-singers", photoCaption: "Musicians, playing" },
    ],
    edges: [["e-work", "e-learn"], ["e-learn", "e-world"], ["e-work", "e-imp"],
            ["e-imp", "e-play"], ["e-play", "e-world"]],
  },

  "e-world": {
    title: "World",
    nodes: [
      { id: "w-work", label: "Work your way", x: 74, y: 74, accent: EXPLORE,
        what: "A year somewhere with the legal right to work. You don't save up for it — you earn while you're there.",
        photo: "carpenters", photoCaption: "Carpentry abroad" },
      { id: "w-year", label: "Take a year", x: 206, y: 48, accent: EXPLORE,
        what: "A year between school and whatever's next. Some of it is paid for, and a college place can wait." },
      { id: "w-thing", label: "Your thing", x: 310, y: 104, accent: EXPLORE,
        what: "Farms, marine work, conservation. The thing you're already into, happening somewhere else.",
        photo: "marine-engineers-and-naval-architects", photoCaption: "Marine work" },
      { id: "w-lang", label: "A language", x: 100, y: 180, accent: EXPLORE,
        what: "Live where it's spoken, or find someone to practise with tonight for free." },
      { id: "w-school", label: "At school", x: 214, y: 158, accent: EXPLORE,
        what: "Chaperoned trips a teacher organises, and the funded exchange years open before you finish school." },
      { id: "w-here", label: "From here", x: 318, y: 214, accent: EXPLORE,
        what: "Museums at street level, classrooms in other countries, someone to talk to. No plane, no money." },
    ],
    edges: [["w-work", "w-year"], ["w-year", "w-thing"], ["w-lang", "w-school"], ["w-school", "w-here"]],
  },

  actions: {
    title: "Actions",
    nodes: [
      { id: "a-find", label: "Find one", x: 84, y: 112, accent: ACTIONS,
        what: "Anything in Explore worth trying becomes an action you keep." },
      { id: "a-do", label: "Go do it", x: 196, y: 76, accent: ACTIONS,
        what: "You go and do it in the real world. That is the point of everything upstream of here." },
      { id: "a-back", label: "Report back", x: 300, y: 166, accent: ACTIONS,
        what: "You say how it went, and that changes what I show you next. This is the loop closing." },
    ],
    edges: [["a-find", "a-do"], ["a-do", "a-back"]],
  },

  me: {
    title: "Me",
    nodes: [
      { id: "m-badge", label: "Badges", x: 106, y: 104, accent: ME,
        what: "24 badges, all earned from things you actually did." },
      { id: "m-cover", label: "The picture", x: 228, y: 72, accent: ME,
        what: "How much of you I can honestly see so far, including the parts I can't yet." },
      { id: "m-prof", label: "Profile", x: 214, y: 190, accent: ME,
        what: "Your details, and the place to correct me." },
    ],
    edges: [["m-badge", "m-cover"], ["m-cover", "m-prof"]],
  },
};

/** Which stars open into another sky. */
export const hasSky = (id: string): boolean => Object.hasOwn(GUIDE_SKIES, id);

export function findNode(id: string): GuideNode | null {
  for (const key of Object.keys(GUIDE_SKIES)) {
    const n = GUIDE_SKIES[key].nodes.find((n) => n.id === id);
    if (n) return n;
  }
  return null;
}
