import type { ExploreArea } from "./types";

const education: ExploreArea = {
  id: "education",
  label: "Education",
  chip: "🎓",
  glowClass: "from-emerald-400 via-teal-400 to-cyan-400",
  href: "/main/explore/education",

  headline: "Education",
  summary: "Skills and knowledge you can grow at your own pace.",
  hint: "Curiosity beats credentials.",

  signals: ["learning", "growth", "self-directed"],

  nextMoves: [
    {
      id: "edu-1",
      title: "Pick one topic",
      blurb: "Choose something you genuinely want to understand better.",
    },
    {
      id: "edu-2",
      title: "Start a short course",
      blurb: "Even 20 minutes a day moves you forward.",
    },
  ],

  cards: [
    {
      id: "edu-c1",
      icon: "💻",
      title: "Learn to code",
      short: "Open doors in almost any field.",
    },
    {
      id: "edu-c2",
      icon: "🧪",
      title: "Science deep-dive",
      short: "Understand how the world really works.",
    },
    {
      id: "edu-c3",
      icon: "🗣️",
      title: "Public speaking",
      short: "Communicate ideas with confidence.",
    },
  ],
};

export default education;
