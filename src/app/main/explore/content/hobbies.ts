import type { ExploreArea } from "./types";

/**
 * Explore › Hobbies
 * Tone: encouraging, playful, low-pressure.
 * Goal: help users notice what gives them energy — not mastery.
 */
const hobbies: ExploreArea = {
  id: "hobbies",
  label: "Hobbies",
  chip: "🎨",
  glowClass: "from-amber-400 via-orange-400 to-rose-400",
  href: "/main/explore/hobbies",

  headline: "Hobbies",
  summary:
    "These aren’t talents you’re supposed to already have. They’re energy experiments.",
  hint: "The only real test: do you want to do it again?",

  signals: ["playful", "creative", "low-pressure", "self-expression"],

  nextMoves: [
    {
      id: "hob-1",
      title: "Try one hobby for 15 minutes",
      blurb:
        "No prep, no gear spiral. Just start and see how it feels in your body.",
    },
    {
      id: "hob-2",
      title: "Repeat the one that gives energy",
      blurb:
        "You don’t need variety yet — you need momentum.",
    },
  ],

  cards: [
    {
      id: "creative-making",
      icon: "🎨",
      title: "Creative making",
      short:
        "This is about turning ideas into something you can see or hold.\n\n" +
        "Drawing, digital art, crafts, music, writing — it doesn’t matter what medium you choose.\n\n" +
        "If you like expressing how things *feel*, not just how they work, start here.\n\n" +
        "Tiny test: make something imperfect in 20 minutes and stop when the timer ends.",
    },
    {
      id: "movement-play",
      icon: "🕺",
      title: "Movement & play",
      short:
        "This isn’t about fitness goals or discipline.\n\n" +
        "It’s about moving your body in a way that feels fun — dancing, climbing, casual sports, long walks.\n\n" +
        "If sitting still drains you, this might quietly change everything.\n\n" +
        "Tiny test: try one movement you enjoy for 10 minutes without tracking anything.",
    },
    {
      id: "games-puzzles",
      icon: "🧩",
      title: "Games & puzzles",
      short:
        "Some people relax by thinking.\n\n" +
        "Board games, strategy games, logic puzzles, word games — these give your brain something satisfying to chew on.\n\n" +
        "If you like patterns, systems, or friendly competition, this can be deeply recharging.\n\n" +
        "Tiny test: play one game or puzzle round and notice if time disappears.",
    },
    {
      id: "collecting-curating",
      icon: "📸",
      title: "Collecting & curating",
      short:
        "This is about noticing details other people skip.\n\n" +
        "Photography, playlists, mood boards, fashion, documenting places — you’re shaping taste, not just consuming.\n\n" +
        "If you enjoy organizing meaning, this can be surprisingly fulfilling.\n\n" +
        "Tiny test: curate a small collection (photos, songs, ideas) around one theme.",
    },
  ],
};

export default hobbies;
