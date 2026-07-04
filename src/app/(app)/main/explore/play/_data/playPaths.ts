// apps/web/src/app/(app)/main/explore/play/_data/playPaths.ts
//
// Play lane data source. Previously the Play activities were hardcoded inside
// play/page.tsx and the detail was synthesized from the slug. This module now
// holds the activity list + opportunity resolver so the Play lane migrates onto
// the unified ExplorePath shape like every other lane.

import type { Rgb } from "../../_data/exploreSchema";

export type PlayActivity = {
  id: string;
  slug: string;
  theme: { accent: Rgb; glow?: Rgb; surfaceLabel?: string };
  card: { title: string; hook: string; description: string };
  fitSignals: string[];
  insideActivityPreviews?: string[];
};

export type PlayOpportunity = {
  id: string;
  title: string;
  href: string;
  note: string;
  mode: "local" | "remote";
};

const LOCAL_PLACE_LABEL = "94901";

export const PLAY_ACTIVITIES: PlayActivity[] = [
  {
    id: "sports-competition",
    slug: "sports-competition",
    theme: { accent: { r: 255, g: 96, b: 139 }, glow: { r: 230, g: 61, b: 108 }, surfaceLabel: "Movement + challenge" },
    card: {
      title: "Sports + Competition",
      hook: "Train, play, improve, and test yourself in something physical.",
      description:
        "This direction fits people who like movement, challenge, repetition, pressure, progression, team energy, or the feeling of getting sharper through practice.",
    },
    fitSignals: [
      "You may like goals you can train toward and feel in your body.",
      "You seem energized by challenge, progress, or real-time performance.",
      "You may enjoy the structure and momentum that sports create.",
    ],
  },
  {
    id: "creative-hobbies",
    slug: "creative-hobbies",
    theme: { accent: { r: 255, g: 139, b: 76 }, glow: { r: 230, g: 101, b: 40 }, surfaceLabel: "Expression + making for fun" },
    card: {
      title: "Creative Hobbies",
      hook: "Make things because it feels good to make them.",
      description:
        "This direction fits people who like drawing, music, photography, video editing, crafting, writing for fun, performance, or any creative outlet that helps them feel more alive.",
    },
    fitSignals: [
      "You may like turning mood, taste, or imagination into something real.",
      "You seem drawn to hobbies that let you express yourself without needing permission.",
      "You may enjoy skill-building that feels playful rather than pressured.",
    ],
  },
  {
    id: "games-strategy",
    slug: "games-strategy",
    theme: { accent: { r: 86, g: 191, b: 255 }, glow: { r: 46, g: 157, b: 232 }, surfaceLabel: "Systems + play" },
    card: {
      title: "Games + Strategy",
      hook: "Play things that reward focus, tactics, adaptation, and smart decisions.",
      description:
        "This direction fits people who like chess, esports, tabletop games, card games, tactical systems, and the kind of play where thinking is part of the fun.",
    },
    fitSignals: [
      "You may enjoy play that rewards timing, systems, and reading what is happening.",
      "You seem drawn to games with depth, not just distraction.",
      "You may like improving through pattern recognition and decision-making.",
    ],
  },
  {
    id: "calm-reset",
    slug: "calm-reset",
    theme: { accent: { r: 130, g: 112, b: 255 }, glow: { r: 97, g: 80, b: 230 }, surfaceLabel: "Recovery + inner steadiness" },
    card: {
      title: "Calm + Reset",
      hook: "Find forms of play that help your mind settle, focus, breathe, and come back to itself.",
      description:
        "This direction fits people who want practices like meditation, journaling, yoga, breathwork, nature walks, or quiet rituals that feel restorative rather than draining.",
    },
    fitSignals: [
      "You may need something that steadies you, not just stimulates you.",
      "You seem open to play that feels peaceful, grounding, or quietly rewarding.",
      "You may like practices that help you reset and feel more like yourself again.",
    ],
  },
  {
    id: "outdoor-adventure",
    slug: "outdoor-adventure",
    theme: { accent: { r: 89, g: 212, b: 128 }, glow: { r: 51, g: 181, b: 92 }, surfaceLabel: "Nature + motion" },
    card: {
      title: "Outdoor + Adventure",
      hook: "Get outside, move through real places, and let the world itself become part of the fun.",
      description:
        "This direction fits people who like hiking, climbing, cycling, surfing, trail time, camping, exploration, or any activity where fresh air and movement matter.",
    },
    fitSignals: [
      "You may feel better when fun includes movement and a change of environment.",
      "You seem drawn to challenge, freedom, and real-world experience.",
      "You may like activities that feel bigger, wilder, or less boxed in.",
    ],
  },
  {
    id: "making-tinkering",
    slug: "making-tinkering",
    theme: { accent: { r: 233, g: 215, b: 84 }, glow: { r: 205, g: 182, b: 38 }, surfaceLabel: "Hands-on fun" },
    card: {
      title: "Making + Tinkering",
      hook: "Play by building, fixing, experimenting, or making something with your hands.",
      description:
        "This direction fits people who like cooking, robotics, sewing, DIY projects, models, maker builds, tools, experiments, or hobbies where the fun comes from doing.",
    },
    fitSignals: [
      "You may think best when your hands are involved.",
      "You seem drawn to hobbies that produce something visible, useful, or surprising.",
      "You may enjoy figuring things out by trying, adjusting, and making.",
    ],
  },
];

export function getPlayActivity(slug: string): PlayActivity | null {
  return PLAY_ACTIVITIES.find((a) => a.slug === slug || a.id === slug) ?? null;
}

/** Two curated starter opportunities (near-you + online) per activity. */
export function getPlayOpportunities(activity: PlayActivity): PlayOpportunity[] {
  const title = activity.card.title.toLowerCase();
  const near = (id: string, t: string, href: string, note: string): PlayOpportunity => ({ id: `${activity.id}-${id}`, title: t, href, note, mode: "local" });
  const online = (id: string, t: string, href: string, note: string): PlayOpportunity => ({ id: `${activity.id}-${id}`, title: t, href, note, mode: "remote" });

  if (title.includes("sports") || title.includes("competition")) {
    return [
      near("local", "Local rec leagues or beginner training", "https://www.cityofsanrafael.org/parks-and-recreation/", `Find a class, drop-in, or rec league near ${LOCAL_PLACE_LABEL} and notice whether the challenge makes you want to come back.`),
      online("online", "At-home training or skills sessions", "https://www.nike.com/ntc-app", "Build momentum with guided workouts or skill reps before committing to a full team or club rhythm."),
    ];
  }
  if (title.includes("creative")) {
    return [
      near("local", "Community classes or local workshops", "https://marincommunityed.com/", `Try drawing, music, photography, writing, or making in a real-world space near ${LOCAL_PLACE_LABEL}.`),
      online("online", "Short online creative classes", "https://www.skillshare.com/", "Pick one medium and finish one small project instead of just browsing ideas."),
    ];
  }
  if (title.includes("games") || title.includes("strategy")) {
    return [
      near("local", "Game nights, chess clubs, or card events", "https://www.meetup.com/", `Test whether strategy feels more alive when you are playing real people near ${LOCAL_PLACE_LABEL}.`),
      online("online", "Online matches and tactical practice", "https://www.chess.com/", "Use puzzles, matches, or digital strategy games to see if depth and repetition actually energize you."),
    ];
  }
  if (title.includes("calm") || title.includes("reset")) {
    return [
      near("local", "Yoga, breathwork, or quiet reset spaces", "https://www.eventbrite.com/", "Find one restorative class or workshop nearby and see whether calm gives you energy instead of just slowing you down."),
      online("online", "Guided reset practices at home", "https://www.youtube.com/results?search_query=10+minute+guided+meditation", "Try one short breathwork, journaling, or meditation session and check how you feel an hour later."),
    ];
  }
  if (title.includes("outdoor") || title.includes("adventure")) {
    return [
      near("local", "Trails, rides, and outdoor starting points", "https://www.alltrails.com/", `Pick one hike, ride, or outdoor outing near ${LOCAL_PLACE_LABEL} and notice whether being outside changes your energy in a good way.`),
      online("online", "Outdoor planning and beginner skill guides", "https://www.rei.com/learn", "Lower the barrier by learning what to bring, where to go, and how to start small."),
    ];
  }
  return [
    near("local", "Local maker spaces or hands-on classes", "https://www.nationofmakers.us/find-a-makerspace/", `Try building, fixing, cooking, sewing, or experimenting with your hands in a real environment near ${LOCAL_PLACE_LABEL}.`),
    online("online", "DIY and guided project ideas", "https://www.instructables.com/", "Choose one small project and finish a real piece of it so the fun becomes tangible."),
  ];
}
