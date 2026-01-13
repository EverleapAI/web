// src/app/main/explore/content/education.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Education
 * Tone: life coach talking to an older teen.
 * Audio-ready: short, spoken paragraphs (use \n\n).
 */
const education: ExploreArea = {
  id: "education",
  label: "Education",
  chip: "🎓",
  glowClass: "from-emerald-400 via-teal-400 to-cyan-400",
  href: "/main/explore/education",

  headline: "Education",
  summary:
    "This isn’t about perfect grades. It’s about getting stronger at stuff you actually care about.",
  hint: "Curiosity > credentials.",

  // Keep these internal / subtle. (We won’t show them as “tag words” in the UI.)
  signals: ["learning", "growth", "self-directed"],

  nextMoves: [
    {
      id: "edu-1",
      title: "Pick one skill to level up",
      blurb: "Not five things. One. The goal is momentum — not an identity crisis.",
    },
    {
      id: "edu-2",
      title: "Make a mini plan you can actually do",
      blurb: "Small + consistent wins. If it’s simple enough to repeat, it works.",
    },
  ],

  cards: [
    {
      // ✅ stable topic slug for /education/[topic]
      id: "learn-to-code",
      href: "/main/explore/education/learn-to-code",
      icon: "💻",
      title: "Learn to code",
      short:
        "If you like solving puzzles, this is a power-up.\n\n" +
        "Coding teaches you how to build ideas into real things — apps, websites, tools, anything.\n\n" +
        "Start tiny. Your first win is just: “I made it work.”",
    },
    {
      id: "science-deep-dive",
      href: "/main/explore/education/science-deep-dive",
      icon: "🧪",
      title: "Science deep-dive",
      short:
        "This is for the “wait… how does that actually work?” part of your brain.\n\n" +
        "Science is basically learning to ask better questions — and not guessing.\n\n" +
        "Pick one topic and go one layer deeper than everyone else.",
    },
    {
      id: "public-speaking",
      href: "/main/explore/education/public-speaking",
      icon: "🗣️",
      title: "Public speaking",
      short:
        "If you can explain things clearly, people listen.\n\n" +
        "This isn’t about being loud. It’s about being understood.\n\n" +
        "You don’t need confidence first — confidence shows up after reps.",
    },
  ],
};

export default education;
