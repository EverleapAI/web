// apps/web/src/app/(app)/main/explore/play/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CircleHelp,
  Dumbbell,
  Gamepad2,
  Heart,
  Mountain,
  Music4,
  Wrench,
} from "lucide-react";

import {
  ExploreLaneTabs,
  SectionKicker,
  SignalConstellation,
  SignalMeter,
  rgb,
  type ExploreLaneTab,
  type Rgb,
} from "../_components/ExploreShared";

type PlayActivity = {
  id: string;
  slug: string;
  theme: {
    accent: Rgb;
    glow?: Rgb;
    surfaceLabel?: string;
  };
  card: {
    title: string;
    hook: string;
    description: string;
  };
  fitSignals: string[];
  insideActivityPreviews?: string[];
};

type PlayProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type PlayOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
};

type ActivityAtmosphere = {
  border: Rgb;
  topGlow: Rgb;
  sideGlow: Rgb;
  washA: Rgb;
  washB: Rgb;
  opportunityGlow: Rgb;
  opportunityNode: Rgb;
  futureGlow: Rgb;
  futureNode: Rgb;
};

const LOCAL_PLACE_LABEL = "94901";
const MAX_VISIBLE_PLAY_ACTIVITIES = 4;

const EXPLORE_LANES: readonly ExploreLaneTab[] = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    active: false,
    dotClass: "bg-cyan-300",
  },
  {
    id: "learning",
    label: "Learning",
    href: "/main/explore/learning",
    active: false,
    dotClass: "bg-violet-300",
  },
  {
    id: "world",
    label: "World",
    href: "/main/explore/world",
    active: false,
    dotClass: "bg-amber-300",
  },
  {
    id: "impact",
    label: "Impact",
    href: "/main/explore/impact",
    active: false,
    dotClass: "bg-emerald-300",
  },
  {
    id: "play",
    label: "Play",
    href: "/main/explore/play",
    active: true,
    dotClass: "bg-pink-300",
  },
] as const;

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "around",
  "because",
  "been",
  "being",
  "between",
  "both",
  "build",
  "could",
  "does",
  "doing",
  "each",
  "even",
  "feel",
  "from",
  "good",
  "have",
  "into",
  "just",
  "kind",
  "like",
  "make",
  "more",
  "most",
  "much",
  "need",
  "only",
  "over",
  "really",
  "seem",
  "some",
  "something",
  "still",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "want",
  "with",
  "work",
  "would",
  "your",
  "you",
]);

const PLAY_ACTIVITIES: PlayActivity[] = [
  {
    id: "sports-competition",
    slug: "sports-competition",
    theme: {
      accent: { r: 255, g: 96, b: 139 },
      glow: { r: 230, g: 61, b: 108 },
      surfaceLabel: "Movement + challenge",
    },
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
    insideActivityPreviews: [
      "What this kind of play feels like",
      "Ways to try competition or training",
      `Local places to start near ${LOCAL_PLACE_LABEL}`,
      "How sports can become part of your identity",
    ],
  },
  {
    id: "creative-hobbies",
    slug: "creative-hobbies",
    theme: {
      accent: { r: 255, g: 139, b: 76 },
      glow: { r: 230, g: 101, b: 40 },
      surfaceLabel: "Expression + making for fun",
    },
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
    insideActivityPreviews: [
      "What creative play feels like",
      "Hobbies and mediums to explore",
      `Ways to start locally or near ${LOCAL_PLACE_LABEL}`,
      "How fun can turn into real skill",
    ],
  },
  {
    id: "games-strategy",
    slug: "games-strategy",
    theme: {
      accent: { r: 86, g: 191, b: 255 },
      glow: { r: 46, g: 157, b: 232 },
      surfaceLabel: "Systems + play",
    },
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
    insideActivityPreviews: [
      "What strategic play feels like",
      "Games and formats to explore",
      `Ways to play locally or near ${LOCAL_PLACE_LABEL}`,
      "How strategy-based play can build real confidence",
    ],
  },
  {
    id: "calm-reset",
    slug: "calm-reset",
    theme: {
      accent: { r: 130, g: 112, b: 255 },
      glow: { r: 97, g: 80, b: 230 },
      surfaceLabel: "Recovery + inner steadiness",
    },
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
    insideActivityPreviews: [
      "What restorative play feels like",
      "Practices that help you reset",
      `Ways to begin locally or near ${LOCAL_PLACE_LABEL}`,
      "How calm can become part of your rhythm",
    ],
  },
  {
    id: "outdoor-adventure",
    slug: "outdoor-adventure",
    theme: {
      accent: { r: 89, g: 212, b: 128 },
      glow: { r: 51, g: 181, b: 92 },
      surfaceLabel: "Nature + motion",
    },
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
    insideActivityPreviews: [
      "What outdoor play feels like",
      "Activities and skill paths to explore",
      `Outdoor starting points near ${LOCAL_PLACE_LABEL}`,
      "How adventure can become part of your life",
    ],
  },
  {
    id: "making-tinkering",
    slug: "making-tinkering",
    theme: {
      accent: { r: 233, g: 215, b: 84 },
      glow: { r: 205, g: 182, b: 38 },
      surfaceLabel: "Hands-on fun",
    },
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
    insideActivityPreviews: [
      "What hands-on play feels like",
      "Projects and hobbies to explore",
      `Ways to start locally or near ${LOCAL_PLACE_LABEL}`,
      "How making can turn into long-term skill",
    ],
  },
];

function pagePadding() {
  return "pb-24 pt-2 sm:pt-3";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitIntoUsefulTokens(value: string): string[] {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function collectStringsDeep(
  value: unknown,
  bucket: string[],
  depth = 0,
  maxDepth = 5
) {
  if (depth > maxDepth || value == null) return;

  if (typeof value === "string") {
    const text = normalizeWhitespace(value);
    if (text) bucket.push(text);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringsDeep(item, bucket, depth + 1, maxDepth);
    }
    return;
  }

  if (typeof value === "object") {
    for (const child of Object.values(value as Record<string, unknown>)) {
      collectStringsDeep(child, bucket, depth + 1, maxDepth);
    }
  }
}

function readStoredPlaySignals(): PlayProfileSignals {
  if (typeof window === "undefined") {
    return {
      firstName: null,
      motivations: [],
      strengths: [],
      skills: [],
      fullText: "",
    };
  }

  const candidateKeys = [
    "everleapOnboarding_v4_convo_min",
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  let firstName: string | null = null;
  const motivations: string[] = [];
  const strengths: string[] = [];
  const skills: string[] = [];
  const allStrings: string[] = [];

  for (const key of candidateKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const profile = asRecord(parsed.profile);
      const answers = asRecord(parsed.answers);

      const nameCandidates = [
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        parsed.name,
        profile?.firstName,
        profile?.name,
        answers?.firstName,
        answers?.name,
      ];

      if (!firstName) {
        for (const value of nameCandidates) {
          const found = asString(value);
          if (found) {
            firstName = found.split(" ")[0];
            break;
          }
        }
      }

      const motivationSources = [
        parsed.motivations,
        parsed.motivation,
        profile?.motivations,
        answers?.motivations,
        answers?.motivation,
      ];

      const strengthSources = [
        parsed.strengths,
        parsed.strength,
        profile?.strengths,
        answers?.strengths,
        answers?.strength,
      ];

      const skillSources = [
        parsed.skills,
        parsed.skill,
        profile?.skills,
        answers?.skills,
        answers?.skill,
      ];

      for (const source of motivationSources) {
        collectStringsDeep(source, motivations);
      }

      for (const source of strengthSources) {
        collectStringsDeep(source, strengths);
      }

      for (const source of skillSources) {
        collectStringsDeep(source, skills);
      }

      collectStringsDeep(parsed, allStrings);
    } catch {
      // ignore parse issues
    }
  }

  return {
    firstName,
    motivations: Array.from(new Set(motivations)).slice(0, 24),
    strengths: Array.from(new Set(strengths)).slice(0, 24),
    skills: Array.from(new Set(skills)).slice(0, 24),
    fullText: allStrings.join(" ").toLowerCase(),
  };
}

function getPlayAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, play matters more than people sometimes admit.`,
      bodyA:
        "This is not just about killing time. It is about noticing what kinds of fun make you feel energized, challenged, calm, connected, curious, creative, or more like yourself.",
      bodyB:
        "The goal here is to surface activities you could actually get into — whether that means sports, hobbies, strategy, outdoor adventure, hands-on making, or quieter ways to reset.",
    };
  }

  return {
    title: "Play matters more than people sometimes admit.",
    bodyA:
      "This is not just about killing time. It is about noticing what kinds of fun make you feel energized, challenged, calm, connected, curious, creative, or more like yourself.",
    bodyB:
      "The goal here is to surface activities you could actually get into — whether that means sports, hobbies, strategy, outdoor adventure, hands-on making, or quieter ways to reset.",
  };
}

function extractCardField(
  activity: PlayActivity,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord(activity.card);
  return asString(card?.[field]) ?? "";
}

function pathAccent(activity: PlayActivity): Rgb {
  const theme = asRecord(activity.theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 255, g: 96, b: 139 };
}

function buildActivityKeywordSet(activity: PlayActivity): string[] {
  const title = extractCardField(activity, "title");
  const hook = extractCardField(activity, "hook");
  const description = extractCardField(activity, "description");
  const fitSignals = activity.fitSignals.slice(0, 6).filter(Boolean);
  const previewTokens = (activity.insideActivityPreviews ?? [])
    .slice(0, 6)
    .filter(Boolean);
  const slugWords = splitIntoUsefulTokens(activity.slug.replace(/_/g, " "));

  return Array.from(
    new Set(
      [
        ...splitIntoUsefulTokens(title),
        ...splitIntoUsefulTokens(hook),
        ...splitIntoUsefulTokens(description),
        ...splitIntoUsefulTokens(fitSignals.join(" ")),
        ...splitIntoUsefulTokens(previewTokens.join(" ")),
        ...slugWords,
      ].filter(Boolean)
    )
  );
}

function getSignalStrength(
  activity: PlayActivity,
  profile: PlayProfileSignals
) {
  const keywords = buildActivityKeywordSet(activity);
  const profileText = [
    profile.motivations.join(" "),
    profile.strengths.join(" "),
    profile.skills.join(" "),
    profile.fullText,
  ]
    .join(" ")
    .toLowerCase();

  if (!profileText.trim()) {
    let hash = 0;
    for (let i = 0; i < activity.id.length; i += 1) {
      hash = (hash << 5) - hash + activity.id.charCodeAt(i);
      hash |= 0;
    }
    return 66 + Math.abs(hash % 17);
  }

  let score = 54;
  let matches = 0;

  for (const keyword of keywords) {
    if (profileText.includes(keyword)) {
      matches += 1;
    }
  }

  score += Math.min(matches * 5, 24);

  const motivationText = profile.motivations.join(" ").toLowerCase();
  const strengthText = profile.strengths.join(" ").toLowerCase();
  const skillText = profile.skills.join(" ").toLowerCase();

  if (keywords.some((keyword) => motivationText.includes(keyword))) score += 5;
  if (keywords.some((keyword) => strengthText.includes(keyword))) score += 5;
  if (keywords.some((keyword) => skillText.includes(keyword))) score += 4;

  return Math.max(50, Math.min(93, score));
}

function getSignalLabel(score: number) {
  if (score >= 84) return "Very strong";
  if (score >= 74) return "Strong";
  if (score >= 64) return "Worth exploring";
  return "Possible fit";
}

function getActivityAtmosphere(
  activity: PlayActivity,
  accent: Rgb
): ActivityAtmosphere {
  const title = extractCardField(activity, "title").toLowerCase();

  if (title.includes("sports") || title.includes("competition")) {
    return {
      border: { r: 255, g: 111, b: 151 },
      topGlow: { r: 244, g: 63, b: 94 },
      sideGlow: { r: 230, g: 61, b: 108 },
      washA: { r: 255, g: 112, b: 149 },
      washB: { r: 219, g: 59, b: 108 },
      opportunityGlow: { r: 255, g: 126, b: 164 },
      opportunityNode: { r: 251, g: 207, b: 232 },
      futureGlow: { r: 255, g: 120, b: 158 },
      futureNode: { r: 252, g: 231, b: 243 },
    };
  }

  if (title.includes("creative")) {
    return {
      border: { r: 255, g: 157, b: 94 },
      topGlow: { r: 249, g: 115, b: 22 },
      sideGlow: { r: 222, g: 101, b: 40 },
      washA: { r: 255, g: 155, b: 88 },
      washB: { r: 214, g: 109, b: 46 },
      opportunityGlow: { r: 255, g: 170, b: 107 },
      opportunityNode: { r: 254, g: 215, b: 170 },
      futureGlow: { r: 255, g: 164, b: 100 },
      futureNode: { r: 255, g: 237, b: 213 },
    };
  }

  if (title.includes("games") || title.includes("strategy")) {
    return {
      border: { r: 103, g: 195, b: 255 },
      topGlow: { r: 59, g: 130, b: 246 },
      sideGlow: { r: 46, g: 157, b: 232 },
      washA: { r: 97, g: 182, b: 255 },
      washB: { r: 78, g: 128, b: 230 },
      opportunityGlow: { r: 116, g: 203, b: 255 },
      opportunityNode: { r: 191, g: 219, b: 254 },
      futureGlow: { r: 108, g: 192, b: 255 },
      futureNode: { r: 219, g: 234, b: 254 },
    };
  }

  if (title.includes("calm") || title.includes("reset")) {
    return {
      border: { r: 151, g: 133, b: 255 },
      topGlow: { r: 139, g: 92, b: 246 },
      sideGlow: { r: 97, g: 80, b: 230 },
      washA: { r: 148, g: 121, b: 255 },
      washB: { r: 112, g: 91, b: 230 },
      opportunityGlow: { r: 165, g: 146, b: 255 },
      opportunityNode: { r: 221, g: 214, b: 254 },
      futureGlow: { r: 156, g: 138, b: 255 },
      futureNode: { r: 237, g: 233, b: 254 },
    };
  }

  if (title.includes("outdoor") || title.includes("adventure")) {
    return {
      border: { r: 106, g: 225, b: 143 },
      topGlow: { r: 34, g: 197, b: 94 },
      sideGlow: { r: 51, g: 181, b: 92 },
      washA: { r: 95, g: 214, b: 132 },
      washB: { r: 72, g: 177, b: 104 },
      opportunityGlow: { r: 120, g: 232, b: 154 },
      opportunityNode: { r: 187, g: 247, b: 208 },
      futureGlow: { r: 113, g: 228, b: 148 },
      futureNode: { r: 220, g: 252, b: 231 },
    };
  }

  if (title.includes("making") || title.includes("tinkering")) {
    return {
      border: { r: 240, g: 224, b: 111 },
      topGlow: { r: 234, g: 179, b: 8 },
      sideGlow: { r: 205, g: 182, b: 38 },
      washA: { r: 235, g: 217, b: 95 },
      washB: { r: 196, g: 171, b: 46 },
      opportunityGlow: { r: 244, g: 228, b: 118 },
      opportunityNode: { r: 254, g: 240, b: 138 },
      futureGlow: { r: 239, g: 222, b: 108 },
      futureNode: { r: 254, g: 249, b: 195 },
    };
  }

  return {
    border: accent,
    topGlow: accent,
    sideGlow: { r: Math.max(0, accent.r - 12), g: accent.g, b: accent.b },
    washA: accent,
    washB: { r: accent.r, g: Math.max(0, accent.g - 26), b: accent.b },
    opportunityGlow: accent,
    opportunityNode: { r: 251, g: 207, b: 232 },
    futureGlow: accent,
    futureNode: { r: 251, g: 207, b: 232 },
  };
}

function getPlayOpportunityPreviews(
  activity: PlayActivity
): PlayOpportunityPreview[] {
  const title = extractCardField(activity, "title").toLowerCase();

  if (title.includes("sports") || title.includes("competition")) {
    return [
      {
        id: `${activity.id}-local`,
        title: "Local rec leagues or beginner training",
        href: "https://www.cityofsanrafael.org/parks-and-recreation/",
        note: `Find a class, drop-in, or rec league near ${LOCAL_PLACE_LABEL} and notice whether the challenge makes you want to come back.`,
      },
      {
        id: `${activity.id}-online`,
        title: "At-home training or skills sessions",
        href: "https://www.nike.com/ntc-app",
        note: "Build momentum with guided workouts or skill reps before committing to a full team or club rhythm.",
      },
    ];
  }

  if (title.includes("creative")) {
    return [
      {
        id: `${activity.id}-local`,
        title: "Community classes or local workshops",
        href: "https://marincommunityed.com/",
        note: `Try drawing, music, photography, writing, or making in a real-world space near ${LOCAL_PLACE_LABEL}.`,
      },
      {
        id: `${activity.id}-online`,
        title: "Short online creative classes",
        href: "https://www.skillshare.com/",
        note: "Pick one medium and finish one small project instead of just browsing ideas.",
      },
    ];
  }

  if (title.includes("games") || title.includes("strategy")) {
    return [
      {
        id: `${activity.id}-local`,
        title: "Game nights, chess clubs, or card events",
        href: "https://www.meetup.com/",
        note: `Test whether strategy feels more alive when you are playing real people near ${LOCAL_PLACE_LABEL}.`,
      },
      {
        id: `${activity.id}-online`,
        title: "Online matches and tactical practice",
        href: "https://www.chess.com/",
        note: "Use puzzles, matches, or digital strategy games to see if depth and repetition actually energize you.",
      },
    ];
  }

  if (title.includes("calm") || title.includes("reset")) {
    return [
      {
        id: `${activity.id}-local`,
        title: "Yoga, breathwork, or quiet reset spaces",
        href: "https://www.eventbrite.com/",
        note: `Find one restorative class or workshop nearby and see whether calm gives you energy instead of just slowing you down.`,
      },
      {
        id: `${activity.id}-online`,
        title: "Guided reset practices at home",
        href: "https://www.youtube.com/results?search_query=10+minute+guided+meditation",
        note: "Try one short breathwork, journaling, or meditation session and check how you feel an hour later.",
      },
    ];
  }

  if (title.includes("outdoor") || title.includes("adventure")) {
    return [
      {
        id: `${activity.id}-local`,
        title: "Trails, rides, and outdoor starting points",
        href: "https://www.alltrails.com/",
        note: `Pick one hike, ride, or outdoor outing near ${LOCAL_PLACE_LABEL} and notice whether being outside changes your energy in a good way.`,
      },
      {
        id: `${activity.id}-online`,
        title: "Outdoor planning and beginner skill guides",
        href: "https://www.rei.com/learn",
        note: "Lower the barrier by learning what to bring, where to go, and how to start small.",
      },
    ];
  }

  return [
    {
      id: `${activity.id}-local`,
      title: "Local maker spaces or hands-on classes",
      href: "https://www.nationofmakers.us/find-a-makerspace/",
      note: `Try building, fixing, cooking, sewing, or experimenting with your hands in a real environment near ${LOCAL_PLACE_LABEL}.`,
    },
    {
      id: `${activity.id}-online`,
      title: "DIY and guided project ideas",
      href: "https://www.instructables.com/",
      note: "Choose one small project and finish a real piece of it so the fun becomes tangible.",
    },
  ];
}

function buildAgenticSummary(activity: PlayActivity) {
  const title = extractCardField(activity, "title").toLowerCase();
  const hook = extractCardField(activity, "hook");
  const description = extractCardField(activity, "description");

  if (title.includes("sports") || title.includes("competition")) {
    return "This could fit if you like fun that gives you something real to train toward — the kind where your body gets sharper, progress becomes visible, and challenge makes you want to come back for another round.";
  }

  if (title.includes("creative")) {
    return "This could fit if you like making things just because it feels good to make them — using taste, mood, imagination, or curiosity to turn a loose idea into something you can actually see, hear, share, or keep.";
  }

  if (title.includes("games") || title.includes("strategy")) {
    return "This could fit if you find yourself pulled toward games with depth — the kind where timing, systems, adaptation, and smart decisions are part of what makes the experience satisfying instead of disposable.";
  }

  if (title.includes("calm") || title.includes("reset")) {
    return "This could fit if the kind of fun you need right now is less noise and more steadiness — something that helps you reset, breathe, focus, and come back to yourself without feeling like one more thing to perform.";
  }

  if (title.includes("outdoor") || title.includes("adventure")) {
    return "This could fit if being outside changes your energy in a noticeable way — where movement, fresh air, challenge, and real places make fun feel bigger, freer, and harder to fake.";
  }

  if (title.includes("making") || title.includes("tinkering")) {
    return "This could fit if you enjoy learning by doing — building, fixing, testing, cooking, or experimenting until the fun becomes something tangible and your hands are part of how your brain figures things out.";
  }

  const merged = normalizeWhitespace(`${hook} ${description}`);
  return merged || "This could fit if this kind of play sounds like the kind you would actually want to keep coming back to.";
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-pink-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-pink-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-pink-200/60 shadow-[0_0_16px_rgba(251,207,232,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-pink-100/70 shadow-[0_0_14px_rgba(252,231,243,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-pink-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-pink-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-pink-300/16 to-transparent" />

      <div className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-pink-300/14 bg-pink-300/[0.06] text-pink-100/72">
        <Gamepad2 className="h-4 w-4" />
      </div>
    </div>
  );
}

function PlayIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getPlayAgenticOpening(firstName);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(236,72,153,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(249,168,212,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-24">
        <SectionKicker>Play</SectionKicker>

        <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.72] text-white/74 sm:text-[16px]">
          {opening.bodyA}
        </p>

        <p className="mt-3 max-w-3xl text-[15px] leading-[1.72] text-white/78 sm:text-[16px]">
          {opening.bodyB}
        </p>
      </div>
    </section>
  );
}

function PlayGlyph({
  title,
  accent,
}: {
  title: string;
  accent: Rgb;
}) {
  const iconClass = "h-[15px] w-[15px]";
  const sharedStyle = {
    borderColor: rgb(accent, 0.24),
    backgroundColor: rgb(accent, 0.1),
    color: rgb(accent, 0.94),
  };

  if (title.includes("Sports")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Dumbbell className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Creative")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Music4 className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Games")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Gamepad2 className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Calm")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Heart className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  if (title.includes("Outdoor")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Mountain className={`${iconClass} mr-1.5`} />
        Play activity
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={sharedStyle}
    >
      <Wrench className={`${iconClass} mr-1.5`} />
      Play activity
    </div>
  );
}

function SectionAnchor({
  label,
  color,
  className = "",
}: {
  label: string;
  color: Rgb;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className="relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
        style={{
          backgroundColor: rgb(color, 0.92),
          boxShadow: `0 0 14px ${rgb(color, 0.35)}`,
        }}
      >
        <span
          className="absolute inset-[-4px] rounded-full"
          style={{ backgroundColor: rgb(color, 0.12) }}
        />
      </span>

      <span
        className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: rgb(color, 0.86) }}
      >
        {label}
      </span>

      <div
        className="h-px min-w-0 flex-1"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            color,
            0.24
          )} 0%, ${rgb(color, 0.08)} 55%, transparent 100%)`,
        }}
      />
    </div>
  );
}

function PlayPathForwardSection({
  activity,
  atmosphere,
}: {
  activity: PlayActivity;
  atmosphere: ActivityAtmosphere;
}) {
  return (
    <div className="relative mt-6 pt-1">
      <SectionAnchor label="See the full path" color={atmosphere.futureGlow} />

      <Link
        href={`/main/explore/play/${activity.slug}`}
        className="group relative mt-3 block px-1 py-1"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 18% 18%, ${rgb(
              atmosphere.futureGlow,
              0.12
            )} 0%, transparent 28%), radial-gradient(circle at 88% 82%, ${rgb(
              atmosphere.futureGlow,
              0.08
            )} 0%, transparent 20%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[19px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[21px]">
              Go deeper into this path
            </h3>

            <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] text-white/70 sm:text-[14px]">
              Explore what this kind of play can feel like over time, how people
              get started, and what makes it stick when it is a real fit.
            </p>
          </div>

          <div className="relative hidden h-10 w-10 shrink-0 sm:block">
            <div
              className="pointer-events-none absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: rgb(atmosphere.futureGlow, 0.14) }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full border text-white/90 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{
                borderColor: rgb(atmosphere.futureGlow, 0.2),
                backgroundColor: rgb(atmosphere.futureGlow, 0.08),
              }}
            >
              <ArrowRight className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function OpportunityRow({
  item,
  atmosphere,
  isFirst,
}: {
  item: PlayOpportunityPreview;
  atmosphere: ActivityAtmosphere;
  isFirst: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group/opportunity relative block px-1 py-4"
    >
      {!isFirst ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${rgb(
              atmosphere.opportunityGlow,
              0.18
            )} 18%, ${rgb(
              atmosphere.opportunityGlow,
              0.07
            )} 82%, transparent 100%)`,
          }}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 92% 20%, ${rgb(
            atmosphere.opportunityGlow,
            0.08
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="max-w-[38rem] text-[18px] font-semibold leading-[1.14] tracking-[-0.025em] text-white transition group-hover/opportunity:text-white/95 sm:text-[19px]">
            {item.title}
          </h4>

          {item.note ? (
            <p className="mt-2 max-w-[40rem] text-[13px] leading-[1.65] text-white/66 transition group-hover/opportunity:text-white/74 sm:text-[14px]">
              {item.note}
            </p>
          ) : null}
        </div>

        <div className="relative mt-1 hidden h-10 w-10 shrink-0 sm:block">
          <div
            className="pointer-events-none absolute inset-0 rounded-full blur-xl"
            style={{
              backgroundColor: rgb(atmosphere.opportunityGlow, 0.14),
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border text-white/86 transition-transform duration-200 group-hover/opportunity:translate-x-0.5"
            style={{
              borderColor: rgb(atmosphere.opportunityGlow, 0.22),
              backgroundColor: rgb(atmosphere.opportunityGlow, 0.07),
            }}
          >
            <ArrowRight className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </a>
  );
}

function PlayActivityCard({
  activity,
  profile,
  onDismiss,
}: {
  activity: PlayActivity;
  profile: PlayProfileSignals;
  onDismiss: (activityId: string) => void;
}) {
  const accent = pathAccent(activity);
  const atmosphere = getActivityAtmosphere(activity, accent);

  const title = extractCardField(activity, "title");
  const signalStrength = getSignalStrength(activity, profile);
  const signalLabel = getSignalLabel(signalStrength);
  const opportunities = getPlayOpportunityPreviews(activity);
  const summary = buildAgenticSummary(activity);

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5"
      style={{
        borderColor: rgb(atmosphere.border, 0.22),
        background: `
          radial-gradient(circle at 18% 0%, ${rgb(atmosphere.washA, 0.16)} 0%, transparent 28%),
          radial-gradient(circle at 92% 12%, ${rgb(atmosphere.washB, 0.16)} 0%, transparent 24%),
          linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)
        `,
        boxShadow: `0 24px 80px rgba(0,0,0,0.32), 0 0 0 1px ${rgb(
          atmosphere.border,
          0.08
        )}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background: `linear-gradient(180deg, ${rgb(
            atmosphere.topGlow,
            0.2
          )} 0%, ${rgb(atmosphere.topGlow, 0.06)} 42%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            atmosphere.border,
            0.5
          )} 20%, ${rgb(atmosphere.sideGlow, 0.2)} 72%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(atmosphere.washA, 0.15) }}
      />
      <div
        className="pointer-events-none absolute right-[-28px] top-[-14px] h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(atmosphere.washB, 0.14) }}
      />
      <div
        className="pointer-events-none absolute left-[22%] top-0 h-24 w-40 blur-3xl"
        style={{ backgroundColor: rgb(atmosphere.topGlow, 0.1) }}
      />

      <SignalConstellation accent={atmosphere.border} mobile />
      <SignalConstellation accent={atmosphere.border} />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 pr-2 sm:pr-8">
            <PlayGlyph title={title} accent={atmosphere.border} />

            <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
              {title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-2.5 py-1.5">
                <SignalMeter score={signalStrength} accent={atmosphere.border} />

                <span className="text-[11px] font-medium text-white/74">
                  {signalLabel}
                </span>

                <button
                  type="button"
                  aria-label="What signal means"
                  onClick={() => setShowSignalHelp((current) => !current)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/54 transition hover:bg-white/[0.1] hover:text-white/84"
                >
                  <CircleHelp className="h-3.5 w-3.5" />
                </button>

                {showSignalHelp ? (
                  <div className="absolute left-0 top-[calc(100%+10px)] z-20 w-[240px] rounded-[16px] border border-white/12 bg-[#0b1220]/96 px-3.5 py-3 text-[12px] leading-[1.55] text-white/78 shadow-[0_18px_40px_rgba(0,0,0,0.38)]">
                    This is Everleap&apos;s best guess, right now, of how well
                    this play direction fits your profile.
                  </div>
                ) : null}
              </div>
            </div>

            <p className="mt-4 max-w-[44rem] text-[14px] leading-[1.68] text-white/76 sm:text-[15px]">
              {summary}
            </p>
          </div>

          <div className="hidden sm:block">
            <button
              type="button"
              onClick={() => onDismiss(activity.id)}
              className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12]"
            >
              Not for me
            </button>
          </div>
        </div>

        <div className="mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => onDismiss(activity.id)}
            className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12]"
          >
            Not for me
          </button>
        </div>

        <div className="mt-6">
          <SectionAnchor
            label="Try this for real"
            color={atmosphere.opportunityGlow}
          />

          <div className="mt-3">
            {opportunities.map((item, index) => (
              <OpportunityRow
                key={item.id}
                item={item}
                atmosphere={atmosphere}
                isFirst={index === 0}
              />
            ))}

            {opportunities.length === 0 ? (
              <div className="px-1 py-4 text-[14px] leading-[1.6] text-white/58">
                No live opportunities are wired into this path yet.
              </div>
            ) : null}
          </div>
        </div>

        <PlayPathForwardSection activity={activity} atmosphere={atmosphere} />
      </div>
    </article>
  );
}

export default function PlayExplorePage() {
  const [profile, setProfile] = React.useState<PlayProfileSignals>({
    firstName: null,
    motivations: [],
    strengths: [],
    skills: [],
    fullText: "",
  });
  const [dismissedActivityIds, setDismissedActivityIds] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    setProfile(readStoredPlaySignals());
  }, []);

  const visibleActivities = React.useMemo(() => {
    return PLAY_ACTIVITIES.map((activity, index) => ({
      activity,
      score: getSignalStrength(activity, profile),
      index,
    }))
      .filter((item) => !dismissedActivityIds.includes(item.activity.id))
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.index - b.index
      )
      .slice(0, MAX_VISIBLE_PLAY_ACTIVITIES)
      .map((item) => item.activity);
  }, [profile, dismissedActivityIds]);

  function handleDismissActivity(activityId: string) {
    setDismissedActivityIds((current) =>
      current.includes(activityId) ? current : [...current, activityId]
    );
  }

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(249,168,212,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

          <div className="relative">
            <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
              Things I could get into
            </p>

            <ExploreLaneTabs
              lanes={EXPLORE_LANES}
              activeClassName="border-pink-300/30 bg-pink-300/[0.12] text-pink-50 shadow-[0_0_0_1px_rgba(249,168,212,0.06)]"
            />
          </div>
        </section>

        <PlayIntroPanel firstName={profile.firstName} />

        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-6">
          {visibleActivities.map((activity) => (
            <PlayActivityCard
              key={activity.id}
              activity={activity}
              profile={profile}
              onDismiss={handleDismissActivity}
            />
          ))}

          {PLAY_ACTIVITIES.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              No play activities are registered yet.
            </div>
          ) : null}

          {PLAY_ACTIVITIES.length > 0 && visibleActivities.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              You&apos;ve cleared the current set of play activities.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}