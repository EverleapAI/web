// src/app/main/explore/content/education.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Education
 * Tone: life coach talking to an older teen.
 * Audio-ready: short, spoken paragraphs (use \n\n).
 *
 * Structure goal:
 * - 4 curated learning directions (like Careers)
 * - Each card includes card-specific why/hint/tags for personalized rendering
 * - Deep dive pages give tactical “real world things to do”
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
  hint: "Pick one learning direction. Run a tiny test. If it sticks, go deeper.",

  // Lane-level signals (fallback only)
  signals: ["learning", "growth", "self-directed"],

  nextMoves: [
    {
      id: "edu-1",
      title: "Pick one skill to level up",
      blurb:
        "Not five things. One. The goal is momentum — not an identity crisis.",
    },
    {
      id: "edu-2",
      title: "Make a mini plan you can actually do",
      blurb:
        "Small + consistent wins. If it’s simple enough to repeat, it works.",
    },
    {
      id: "edu-3",
      title: "Prove it with a tiny artifact",
      blurb:
        "A small output beats a big intention. Make something you can point to.",
    },
  ],

  cards: [
    {
      // ✅ stable topic slug for /education/[topic]
      id: "learn-to-code",
      href: "/main/explore/education/learn-to-code",
      icon: "💻",
      title: "Build-to-learn (coding + making)",
      short:
        "If you like puzzles *and* you like control, this is a power-up.\n\n" +
        "Coding teaches you how to turn ideas into real things — apps, websites, tools, anything.\n\n" +
        "Start tiny. Your first win is just: “I made it work.”",
      why: [
        "You like fast feedback — you do something, it runs (or breaks), you fix it.",
        "You prefer building over memorizing. Progress feels visible.",
        "Autonomy matters — you can make your own projects, your own rules.",
      ],
      hint: "Make one tiny thing you can show someone by tonight.",
      tags: ["build-to-learn", "fast-feedback", "autonomy", "projects"],
    },

    {
      id: "science-deep-dive",
      href: "/main/explore/education/science-deep-dive",
      icon: "🧪",
      title: "Go one layer deeper (science + how things work)",
      short:
        "This is for the “wait… how does that actually work?” part of your brain.\n\n" +
        "Science is basically learning to ask better questions — and not guessing.\n\n" +
        "Pick one topic and go one layer deeper than everyone else.",
      why: [
        "You hate vague answers — you want the real mechanism underneath.",
        "You like being right for the right reasons (evidence > vibes).",
        "You enjoy turning confusion into clarity.",
      ],
      hint: "Choose one question and chase it until you can explain it simply.",
      tags: ["curiosity", "evidence", "clarity", "deep-dive"],
    },

    {
      id: "public-speaking",
      href: "/main/explore/education/public-speaking",
      icon: "🗣️",
      title: "Communication reps (speaking + explaining)",
      short:
        "If you can explain things clearly, people listen.\n\n" +
        "This isn’t about being loud. It’s about being understood.\n\n" +
        "You don’t need confidence first — confidence shows up after reps.",
      why: [
        "You care how a message lands, not just what it technically says.",
        "You want influence without being fake — clear communication does that.",
        "You learn by performing and adjusting, not by waiting to feel ready.",
      ],
      hint: "Do one 60-second explanation on video — then improve it once.",
      tags: ["communication", "confidence", "reps", "influence"],
    },

    {
      id: "self-directed-micro-credentials",
      href: "/main/explore/education/self-directed-micro-credentials",
      icon: "🧭",
      title: "Self-directed skill sprints (mini-courses + proof)",
      short:
        "This is for people who want structure — without the trapped feeling.\n\n" +
        "You pick one skill, follow a short plan, and create proof you actually did it.\n\n" +
        "Think: 7–14 day sprints. Small. Real. Repeatable.",
      why: [
        "You like a plan, but you want to choose the plan.",
        "You’re motivated by visible progress (checkpoints + proof).",
        "Consistency beats intensity for you — small reps stack up.",
      ],
      hint: "Pick a 7-day sprint and decide your ‘proof’ before you start.",
      tags: ["structure", "consistency", "proof", "self-directed"],
    },
  ],
};

export default education;
