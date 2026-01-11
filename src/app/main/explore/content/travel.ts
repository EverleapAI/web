// src/app/main/explore/content/travel.ts

import type { ExploreArea } from "./types";

const travel: ExploreArea = {
  id: "travel",
  label: "Travel",
  chip: "✈️",
  glowClass: "from-sky-400 via-cyan-400 to-teal-400",
  href: "/main/explore/travel",

  headline: "Travel",
  summary: "Escapes and destinations that match your tempo.",
  hint: "Think in moods, not itineraries.",

  signals: ["weekend", "nature", "flexible"],

  nextMoves: [
    {
      id: "travel-1",
      title: "Plan a 2–3 day escape",
      blurb: "Pick a place within a short flight or drive.",
    },
    {
      id: "travel-2",
      title: "Save 3 dream trips",
      blurb: "Collect places you’d love to visit someday.",
    },
  ],

  cards: [
    {
      id: "travel-c1",
      icon: "🏖️",
      title: "Coastal weekend",
      short: "Beaches, walks, and slow mornings.",
    },
    {
      id: "travel-c2",
      icon: "🏔️",
      title: "Mountain reset",
      short: "Fresh air, hikes, and cozy cabins.",
    },
  ],
};

export default travel;
