// src/app/main/explore/content/travel.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Travel
 * Tone: life coach talking to an older teen.
 * Audio-ready: short, spoken paragraphs (use \n\n).
 */
const travel: ExploreArea = {
  id: "travel",
  label: "Travel",
  chip: "✈️",
  glowClass: "from-sky-400 via-cyan-400 to-teal-400",
  href: "/main/explore/travel",

  headline: "Travel",
  summary: "Escapes and experiences that match your tempo.",
  hint: "Think in vibes, not itineraries.",

  signals: ["weekend", "nature", "curious", "budget-aware"],

  nextMoves: [
    {
      id: "travel-1",
      title: "Pick one vibe to try first",
      blurb: "Not the perfect trip — just the next one.",
    },
    {
      id: "travel-2",
      title: "Do a tiny plan",
      blurb: "30 minutes of planning beats 3 hours of dreaming.",
    },
  ],

  cards: [
    {
      id: "coastal-weekend",
      href: "/main/explore/travel/coastal-weekend",
      icon: "🏖️",
      title: "Coastal reset",
      short:
        "Beaches, walks, and slow mornings.\n\n" +
        "If you want your brain to stop buzzing, pick a place where time moves softer.\n\n" +
        "Your goal is simple: come home calmer than you left.",
    },
    {
      id: "mountain-reset",
      href: "/main/explore/travel/mountain-reset",
      icon: "🏔️",
      title: "Mountain reset",
      short:
        "Fresh air, hikes, and cozy nights.\n\n" +
        "This vibe is for when you want space — physically and mentally.\n\n" +
        "You don’t need to summit anything. You just need to breathe different air.",
    },
    {
      id: "education-abroad",
      href: "/main/explore/travel/education-abroad",
      icon: "🎒",
      title: "Learn abroad (EF-style programs)",
      short:
        "Travel, but with structure.\n\n" +
        "Language immersion, guided programs, or a short course — you come back with a skill, not just photos.\n\n" +
        "Perfect if you want adventure *and* a plan someone else already built.",
    },
    {
      id: "work-abroad",
      href: "/main/explore/travel/work-abroad",
      icon: "🌍",
      title: "Work in another country",
      short:
        "This is travel with a purpose.\n\n" +
        "Seasonal work, internships, volunteering, or exchange programs can be the easiest way to go somewhere new.\n\n" +
        "The flex is: you build a story you can tell later — and you learn what you can handle.",
    },
    {
      id: "virtual-travel",
      href: "/main/explore/travel/virtual-travel",
      icon: "🛰️",
      title: "Virtual travel (budget mode)",
      short:
        "If money is tight, you can still explore.\n\n" +
        "Virtual museum tours, street-view city walks, food videos + playlists — it’s a real mood shift.\n\n" +
        "Use it to discover what places you actually want, before you spend.",
    },
  ],
};

export default travel;
