// src/app/main/explore/content/travel.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Travel
 * Tone: life coach talking to an older teen.
 * Audio-ready: short, spoken paragraphs (use \n\n).
 *
 * Updated goal:
 * - Travel = learning + cultural exchange (not just vacations)
 * - Physical OR virtual, but always intellectually meaningful
 * - 4 curated opportunities with real links
 */
const travel: ExploreArea = {
  id: "travel",
  label: "Travel",
  chip: "✈️",
  glowClass: "from-sky-400 via-cyan-400 to-teal-400",
  href: "/main/explore/travel",

  headline: "Travel",
  summary:
    "Travel, but make it meaningful.\n\n" +
    "This lane is about learning in the real world — languages, cultures, communities, and new ways of thinking.",
  hint:
    "Pick one doorway. Aim for growth, not perfection. Your best trip is the one that changes you a little.",

  signals: ["curious", "global-minded", "culture", "learning-by-doing", "budget-aware"],

  nextMoves: [
    {
      id: "travel-1",
      title: "Choose your learning style",
      blurb:
        "Do you want structure (program), immersion (live with locals), or connection (virtual exchange)?",
    },
    {
      id: "travel-2",
      title: "Run a tiny task this week",
      blurb:
        "Do one action that moves you closer — request info, shortlist countries, or join one virtual session.",
    },
  ],

  cards: [
    {
      id: "ef-gap-year",
      href: "/main/explore/travel/ef-gap-year",
      icon: "🌍",
      title: "EF Gap Year (structured travel + language + purpose)",
      short:
        "A built-in plan for learning while you travel.\n\n" +
        "You travel with a cohort, then settle into deeper immersion — often with language learning, internships, or service learning.\n\n" +
        "If you want adventure *with scaffolding*, start here.\n\n" +
        "Explore: https://efgapyear.com/",
    },
    {
      id: "ciee-study-abroad",
      href: "/main/explore/travel/ciee-study-abroad",
      icon: "🎓",
      title: "CIEE Study Abroad (earn credit + live like a local)",
      short:
        "Academic travel that actually counts.\n\n" +
        "Choose a city, pick a program length (Jan / summer / semester), and learn through coursework + culture.\n\n" +
        "Best if you want a real ‘I did this’ credential — not just memories.\n\n" +
        "Browse programs: https://www.ciee.org/go-abroad/college-study-abroad/programs",
    },
    {
      id: "au-pair-cultural-care",
      href: "/main/explore/travel/au-pair-cultural-care",
      icon: "🏡",
      title: "Au Pair exchange (live inside another culture)",
      short:
        "Immersion mode: you live with a host family and learn a culture from the inside.\n\n" +
        "Au pair programs are structured and supported — you’re not just visiting; you’re participating in real life.\n\n" +
        "If you learn best by being ‘in it,’ this is a strong path.\n\n" +
        "Learn more: https://www.culturalcare.com/the-au-pair-program/",
    },
    {
      id: "soliya-virtual-exchange",
      href: "/main/explore/travel/soliya-virtual-exchange",
      icon: "🛰️",
      title: "Virtual cultural exchange (global friends, real dialogue)",
      short:
        "Travel without flying — still counts.\n\n" +
        "Join facilitated virtual exchange groups that build intercultural communication skills through real conversation across differences.\n\n" +
        "Perfect if budget/time is tight, or you want to ‘test’ a region before going.\n\n" +
        "Explore: https://soliya.net/",
    },
  ],
};

export default travel;
