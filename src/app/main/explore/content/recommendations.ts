// src/app/main/explore/content/recommendations.ts
import type { ExploreArea } from "./types";

/**
 * Explore › Recommendations
 * Separate from Insights. This file is Explore-only data.
 *
 * IMPORTANT:
 * - card.id MUST match StepperLaneId so /main/career/[laneId] works.
 * - We encode extra fields (bestFor + starterExperiment) into the MiniCard.short
 *   for now, so we DON'T have to change types.ts yet.
 *
 * Next file (after this): src/app/main/explore/content/types.ts
 * (we'll add optional bestFor/starterExperiment to MiniCard cleanly).
 */
const recommendations: ExploreArea = {
  id: "recommendations",
  label: "Recommendations",
  chip: "What to try next",
  glowClass: "from-sky-400 via-indigo-500 to-slate-400",
  href: "/main/explore/recommendations",

  headline: "4 Everleap recommendations for you",
  summary: "Not a forever decision. Pick one lane, run a tiny test, then adjust.",
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

  /**
   * Cards = the 4 lanes.
   * - id must match StepperLaneId
   * - short currently includes why + bestFor + starterExperiment in a readable format
   *   until we extend MiniCard type in content/types.ts.
   */
  cards: [
    {
      id: "productUx",
      icon: "🧩",
      title: "Product / UX (building things people use)",
      short:
        "Visible progress + real users + fast feedback.\n" +
        "Best if: you like building + improving real things.\n" +
        "3-day test: Redesign one screen of an app you use. Show it to 2 people and ask what they’d change.",
    },
    {
      id: "healthHumanSupport",
      icon: "🫶",
      title: "Health + Human Support (coaching, wellness, patient support)",
      short:
        "Meaning is automatic. You can see impact in real humans.\n" +
        "Best if: helping people directly gives you energy.\n" +
        "3-day test: Interview someone in a helping role. Ask: what do you love and what do you hate?",
    },
    {
      id: "educationCommunityPrograms",
      icon: "🏫",
      title: "Education / Community / Programs (impact work)",
      short:
        "Purpose + people + momentum. Not theory—real outcomes.\n" +
        "Best if: you like people + momentum + organizing outcomes.\n" +
        "3-day test: Volunteer once. Track energy before/after and what felt meaningful vs draining.",
    },
    {
      id: "independentBuilder",
      icon: "🚀",
      title: "Independent Builder (creator, startup, entrepreneurship)",
      short:
        "Autonomy + momentum + output. Your wiring likes shipping.\n" +
        "Best if: you crave freedom + making things from scratch.\n" +
        "3-day test: Make one tiny thing in a weekend (guide, video, mini-tool). Ship it.",
    },
  ],
};

export default recommendations;
