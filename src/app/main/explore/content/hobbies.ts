import type { ExploreArea } from "./types";

const hobbies: ExploreArea = {
  id: "hobbies",
  label: "Hobbies",
  chip: "🎨",
  glowClass: "from-amber-400 via-orange-400 to-red-400",
  href: "/main/explore/hobbies",

  headline: "Hobbies",
  summary: "Play, experiment, and discover what actually energizes you.",
  hint: "Fun is productive too.",

  signals: ["playful", "creative", "low-pressure"],

  nextMoves: [
    {
      id: "hob-1",
      title: "Try one new hobby",
      blurb: "Spend just 15 minutes experimenting.",
    },
    {
      id: "hob-2",
      title: "Go deeper on one",
      blurb: "Pick something you enjoy and practice it.",
    },
  ],

  cards: [
    {
      id: "hob-c1",
      icon: "🎸",
      title: "Play an instrument",
      short: "Music for your brain.",
    },
    {
      id: "hob-c2",
      icon: "📷",
      title: "Photography",
      short: "Notice the world differently.",
    },
    {
      id: "hob-c3",
      icon: "🧩",
      title: "Puzzles & games",
      short: "Fun mental workouts.",
    },
  ],
};

export default hobbies;
