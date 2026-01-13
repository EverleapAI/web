// src/app/main/explore/content/recommendations.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Careers
 * These are not job listings — they are identity experiments.
 * Tone: life coach talking to an older teen.
 */
const recommendations: ExploreArea = {
  id: "recommendations",
  label: "Careers",
  chip: "Everleap suggestions",
  glowClass: "from-sky-400 via-indigo-500 to-slate-400",
  href: "/main/explore/recommendations",

  headline: "Careers",
  summary: "Everleap suggestions — directions that fit your strengths, values, and vibe.",
  hint: "These are experiments, not commitments.",

  signals: [
    "impact-first",
    "needs autonomy",
    "likes fast feedback loops",
    "wants real-world relevance",
    "hates performative work",
  ],

  nextMoves: [
    {
      id: "pick-one",
      title: "Pick 1 direction to test",
      blurb: "Not decide. Test. Your reaction is the data.",
    },
    {
      id: "one-convo",
      title: "Do 1 real conversation",
      blurb: "Talk to someone doing it. Ask what’s brutal and what’s great.",
    },
    {
      id: "micro-proof",
      title: "Build 1 micro-proof",
      blurb: "A tiny artifact beats a big decision.",
    },
  ],

  cards: [
    {
      id: "productUx",
      icon: "🧩",
      title: "Product / UX",
      short:
        "You know when an app just *feels right* to use? That’s not an accident.\n\n" +
        "Product and UX is about noticing what’s confusing or annoying — and making it better for real people.\n\n" +
        "If you like building things and you care how people experience them, this might be your lane.\n\n" +
        "Tiny test: pick an app you use, redesign one screen, and show it to two people. See what they say.",
    },
    {
      id: "healthHumanSupport",
      icon: "🫶",
      title: "Health + Human Support",
      short:
        "Some people are just good at being there when things get real.\n\n" +
        "This path is about helping people through physical, mental, or emotional stuff — and actually making their day better.\n\n" +
        "If people come to you when they’re struggling, that’s not random.\n\n" +
        "Tiny test: talk to someone who works in a helping role and ask what makes the job feel worth it.",
    },
    {
      id: "educationCommunityPrograms",
      icon: "🏫",
      title: "Education / Community",
      short:
        "This is about creating spaces where people grow.\n\n" +
        "You might be teaching, running programs, or organizing groups so things actually work.\n\n" +
        "If you like helping people level up and hate wasted potential, this could be you.\n\n" +
        "Tiny test: help out with one group or program and notice what parts give you energy.",
    },
    {
      id: "independentBuilder",
      icon: "🚀",
      title: "Independent Builder",
      short:
        "This is for people who’d rather make their own thing than wait for permission.\n\n" +
        "You come up with ideas, try them, and learn by doing.\n\n" +
        "If freedom matters to you more than having everything planned, pay attention to that.\n\n" +
        "Tiny test: build something small this weekend and put it out into the world.",
    },
    {
      id: "dataAi",
      icon: "🧠",
      title: "Data + AI",
      short:
        "This is about turning messy information into clear decisions.\n\n" +
        "You look for patterns, test ideas, and figure out what’s actually going on.\n\n" +
        "If you like being right for the right reasons, this could be your thing.\n\n" +
        "Tiny test: track something you care about for a week and see what you learn.",
    },
    {
      id: "operationsProjects",
      icon: "🗺️",
      title: "Ops + Projects",
      short:
        "Some people are wired to make things run smoothly.\n\n" +
        "You notice what’s missing, what’s slowing things down, and how to fix it.\n\n" +
        "If you’re the quiet problem-solver in the group, this is real power.\n\n" +
        "Tiny test: take one messy process and make it 20% better.",
    },
    {
      id: "creativeStorytelling",
      icon: "🎬",
      title: "Creative Storytelling",
      short:
        "This is about making people feel something.\n\n" +
        "You use words, images, or video to get ideas to land.\n\n" +
        "If you care how a message hits, not just what it says, this might be you.\n\n" +
        "Tiny test: tell one story in three different ways and see what connects.",
    },
    {
      id: "businessPartnerships",
      icon: "🤝",
      title: "Business + Partnerships",
      short:
        "This is where conversations turn into real outcomes.\n\n" +
        "You connect people, spot opportunities, and help things move forward.\n\n" +
        "If you like talking to people and making things happen, that’s a clue.\n\n" +
        "Tiny test: ask five people about a problem they have and listen closely.",
    },
  ],
};

export default recommendations;
