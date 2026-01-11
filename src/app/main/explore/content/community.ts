import type { ExploreArea } from "./types";

const community: ExploreArea = {
  id: "community",
  label: "Community",
  chip: "🤝",
  glowClass: "from-rose-400 via-pink-400 to-orange-400",
  href: "/main/explore/community",

  headline: "Community",
  summary: "Find people, causes, and places where you belong.",
  hint: "Connection is a skill you can practice.",

  signals: ["belonging", "impact", "local"],

  nextMoves: [
    {
      id: "com-1",
      title: "Join one group",
      blurb: "Start with something small and welcoming.",
    },
    {
      id: "com-2",
      title: "Volunteer once",
      blurb: "Low commitment, real impact.",
    },
  ],

  cards: [
    {
      id: "com-c1",
      icon: "🌱",
      title: "Environmental group",
      short: "Help protect local nature.",
    },
    {
      id: "com-c2",
      icon: "📚",
      title: "Literacy volunteer",
      short: "Support kids or adults learning to read.",
    },
    {
      id: "com-c3",
      icon: "🏘️",
      title: "Neighborhood meetup",
      short: "Meet people right where you live.",
    },
  ],
};

export default community;
