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
//
// VOICE (pass done 2026-07-22 against 08_Writing/080 + 081). What that pass
// changed, so it doesn't drift back:
//   - No defining things by what they are NOT. "Not homework", "not geography
//     homework" — defending against an accusation nobody made reads defensive,
//     and it was the tic that appeared most.
//   - No writing about the machine. "This is the loop closing", "everything
//     upstream of here" is systems talk at a sixteen-year-old; 081 targets grade
//     8-10 and 080 says thoughtful before clever.
//   - Nothing accusatory in passing. "what you avoid" became "what you tend to
//     steer around" — same fact, no verdict attached to it.
//   - US spelling. "practise" and "organises" had both shipped.
//   - The `fills` lines stay statements about the APP, never about the reader.
//     That is the whole reason this file can be honest about emptiness without
//     it landing as "you haven't done enough".
//
// THE NUMBERS ARE FACTS THAT CAN DRIFT. 19/12/19 mirrors storyPool.ts, 807 the
// O*NET universe, 24 the badge set. They live in the API and cannot be imported
// here, so a change there silently makes this copy a lie. Same shape as the
// badge-target rule: check the target still exists before trusting the number.

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
  /**
   * A real scene photo from the catalogue, shown beside the star.
   *
   * EVERY node has one. The abstract ones — Today, Insights, Badges, Report
   * back — briefly had a drawn icon plate instead, and a small mark floating in
   * a large empty panel read as worse than the photo it replaced. So they
   * borrow a real scene that carries the IDEA: Insights gets an astronomer,
   * because noticing a pattern by watching carefully is what Insights does.
   * The caption always says what the picture actually is, so an illustration is
   * never mistaken for a claim about the reader.
   */
  photo?: string;
  /**
   * Required for any photo outside the Work lane.
   *
   * Work keeps one set of scene photos per career (`branch_slug = ''`); every
   * other lane keeps one set PER BRANCH, because m0..m3 collide otherwise. So
   * `cambodia` alone matches nothing — its photos live under `royal-ballet`.
   * The Guide asked for it without a branch and had been quietly showing a
   * broken image since the day it shipped. Nothing failed loudly; the picture
   * was simply never there.
   */
  photoBranch?: string;
  photoCaption?: string;
  /**
   * A Time Twin figure slug, served by guidance/time-twin-figure-image instead
   * of the scene endpoint. Fun facts is where Time Twin lives, so it shows a
   * real one rather than a stand-in for one.
   */
  portrait?: string;
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
        what: "Everything else is built out of this. I ask what moves you, what you're good at, and what you can already do.",
        photo: "self-enrichment-teachers", photoCaption: "A teaching day",
      },
      {
        id: "insights", label: "Insights", x: 182, y: 50, accent: INSIGHTS,
        what: "What I'm starting to notice about you, shown with the answers I drew it from, so you can tell me when I've got it wrong.",
        fills: "Fills once something in your answers starts repeating. One answer doesn't show much; several pointing the same way do.",
        photo: "astronomers", photoCaption: "An astronomer, watching"
      },
      {
        id: "today", label: "Today", x: 168, y: 150, accent: TODAY,
        what: "Where you land. One read on where you are right now, and one thing worth doing about it.",
        fills: "Works from your first day, and gets more specific as your story fills in.",
        photo: "bakers", photoCaption: "A baker, early on"
      },
      {
        id: "explore", label: "Explore", x: 286, y: 96, accent: EXPLORE,
        what: "Careers, fields of study, places, causes and things to try — each one opening into what a real day in it looks like.",
        fills: "Works before you've answered anything. Until you have, you're seeing what I'd show anyone.",
        photo: "chefs-and-head-cooks", photoCaption: "A chef, mid-service",
      },
      {
        id: "actions", label: "Actions", x: 262, y: 210, accent: ACTIONS,
        what: "Small things you go and do away from the screen. You try one, then tell me how it went.",
        fills: "Stays empty until something in Explore is worth trying.",
        photo: "forest-and-conservation-workers", photoCaption: "Kit by the door"
      },
      {
        id: "me", label: "Me", x: 344, y: 184, accent: ME,
        what: "Your badges, your details, and the place to correct anything I've got wrong about you.",
        photo: "photographers", photoCaption: "A photographer at work"
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
        what: "19 questions about what pulls you in and what wears you out. These are the ones Insights leans on most.",
        photo: "dancers", photoCaption: "Dancers, mid-rehearsal" },
      { id: "s-str", label: "Strengths", x: 222, y: 62, accent: STORY,
        what: "12 questions about what you're good at, and what people come to you for.",
        photo: "coaches-and-scouts", photoCaption: "A coach, watching closely" },
      { id: "s-ski", label: "Skills", x: 186, y: 188, accent: STORY,
        what: "19 questions about what you can do, and what you'd like to do better.",
        photo: "tailors-dressmakers-and-custom-sewers", photoCaption: "A tailor's bench" },
    ],
    edges: [["s-mot", "s-str"], ["s-str", "s-ski"]],
  },

  insights: {
    title: "Insights",
    nodes: [
      { id: "i-mot", label: "Motivations", x: 84, y: 84, accent: INSIGHTS,
        what: "What pulls you forward, and what drains you. Built from your own words, not a personality type.",
        photo: "dancers", photoCaption: "Dancers, mid-rehearsal" },
      { id: "i-str", label: "Strengths", x: 214, y: 54, accent: INSIGHTS,
        what: "What you're good at and what people come to you for — each with the answer it came from.",
        photo: "coaches-and-scouts", photoCaption: "A coach, watching closely" },
      { id: "i-ski", label: "Skills", x: 150, y: 178, accent: INSIGHTS,
        what: "What you can already do, what you want to get better at, and what you tend to steer around.",
        photo: "tailors-dressmakers-and-custom-sewers", photoCaption: "A tailor's bench" },
      { id: "i-fun", label: "Fun facts", x: 300, y: 150, accent: INSIGHTS,
        what: "The lighter end. Includes Time Twin — a real historical figure whose way of thinking rhymes with yours.",
        portrait: "ada-lovelace", photoCaption: "A Time Twin: Ada Lovelace" },
    ],
    edges: [["i-mot", "i-str"], ["i-str", "i-ski"], ["i-ski", "i-fun"]],
  },

  explore: {
    title: "Explore",
    nodes: [
      { id: "e-work", label: "Careers", x: 70, y: 96, accent: EXPLORE,
        what: "807 real careers, from the list the US government keeps. Open one and you get a day inside it rather than a job description.",
        photo: "registered-nurses", photoCaption: "A nurse on shift" },
      { id: "e-learn", label: "Learning", x: 180, y: 46, accent: EXPLORE,
        what: "Fields of study — what you'd actually learn, whether or not it becomes a job.",
        photo: "architects-except-landscape-and-naval", photoCaption: "An architect's desk" },
      { id: "e-world", label: "World", x: 290, y: 92, accent: EXPLORE,
        what: "Places you could actually go, and the routes that get you there without much money.",
        photo: "cambodia", photoBranch: "royal-ballet", photoCaption: "Cambodia" },
      { id: "e-imp", label: "Impact", x: 126, y: 196, accent: EXPLORE,
        what: "Causes you might give time to, and what you'd genuinely do about one on a Tuesday.",
        photo: "farmers-ranchers-and-other-agricultural-managers", photoCaption: "A working farm" },
      { id: "e-play", label: "Play", x: 262, y: 206, accent: EXPLORE,
        what: "Things worth doing for their own sake, at real named places near you.",
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
        what: "A year between school and whatever's next. Some of it is paid for, and a college place can wait.",
        photo: "travel-guides", photoCaption: "A guide, on the road" },
      { id: "w-thing", label: "Your thing", x: 310, y: 104, accent: EXPLORE,
        what: "Farms, marine work, conservation. The thing you're already into, happening somewhere else.",
        photo: "zoologists-and-wildlife-biologists", photoCaption: "Fieldwork, out in it" },
      { id: "w-lang", label: "A language", x: 100, y: 180, accent: EXPLORE,
        what: "Live where it's spoken, or find someone to practice with tonight, for free.",
        photo: "interpreters-and-translators", photoCaption: "An interpreter working" },
      { id: "w-school", label: "At school", x: 214, y: 158, accent: EXPLORE,
        what: "Chaperoned trips a teacher organizes, and the funded exchange years that open before you finish school.",
        photo: "tour-guides-and-escorts", photoCaption: "A guide with a group" },
      { id: "w-here", label: "From here", x: 318, y: 214, accent: EXPLORE,
        what: "Museums at street level, classrooms in other countries, someone to talk to. No plane, no money.",
        photo: "curators", photoCaption: "A curator, up close" },
    ],
    edges: [["w-work", "w-year"], ["w-year", "w-thing"], ["w-lang", "w-school"], ["w-school", "w-here"]],
  },

  actions: {
    title: "Actions",
    nodes: [
      { id: "a-find", label: "Find one", x: 84, y: 112, accent: ACTIONS,
        what: "Anything in Explore worth trying becomes an action you keep.",
        photo: "librarians-and-media-collections-specialists", photoCaption: "Looking something up" },
      { id: "a-do", label: "Go do it", x: 196, y: 76, accent: ACTIONS,
        what: "You go and do it, away from the screen. This is what the rest of it is for.",
        photo: "helpers-carpenters", photoCaption: "Learning it by doing it" },
      { id: "a-back", label: "Report back", x: 300, y: 166, accent: ACTIONS,
        what: "You say how it went, and that changes what I show you next. Doing something is evidence too.",
        photo: "news-analysts-reporters-and-journalists", photoCaption: "Writing it down" },
    ],
    edges: [["a-find", "a-do"], ["a-do", "a-back"]],
  },

  me: {
    title: "Me",
    nodes: [
      { id: "m-badge", label: "Badges", x: 106, y: 104, accent: ME,
        what: "24 badges, all earned from things you actually did.",
        photo: "athletes-and-sports-competitors", photoCaption: "Something earned" },
      { id: "m-cover", label: "The picture", x: 228, y: 72, accent: ME,
        what: "How much of you I can honestly see so far, including the parts I can't yet.",
        photo: "cartographers-and-photogrammetrists", photoCaption: "Mapping what's known" },
      { id: "m-prof", label: "Profile", x: 214, y: 190, accent: ME,
        what: "Your details, and the place to correct me.",
        photo: "archivists", photoCaption: "Records, kept straight" },
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
