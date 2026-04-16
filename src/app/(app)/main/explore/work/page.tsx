// apps/web/src/app/(app)/main/explore/work/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  CircleHelp,
  Clapperboard,
  Code2,
  FlaskConical,
  Gamepad2,
  Landmark,
  Megaphone,
  Music4,
  PenTool,
  Scale,
  Sparkles,
  Stethoscope,
  Wrench,
} from "lucide-react";

import {
  SignalConstellation,
  SignalMeter,
  rgb,
  type Rgb,
} from "../_components/ExploreShared";
import { WORK_PATHS } from "./_data/workPaths";
import type { WorkPathContent } from "./_data/workPathSchema";

type UserProfileSignals = {
  firstName: string | null;
  knowsDirection: boolean;
  hasSomeIdeas: boolean;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
  statedCareerGoal: string | null;
  statedCareerReason: string | null;
  hasQuestionSignal: boolean;
  postPlans: string[];
  certainty: "strong" | "kinda" | "no_clue" | null;
};

type PathAtmosphere = {
  border: Rgb;
  topGlow: Rgb;
  sideGlow: Rgb;
  washA: Rgb;
  washB: Rgb;
  futureGlow: Rgb;
  futureNode: Rgb;
};

type WorkLaneTab = {
  id: "work" | "learning" | "world" | "impact" | "play";
  label: string;
  href: string;
  active: boolean;
  dotClass: string;
  activeClasses: string;
};

const MAX_VISIBLE_WORK_PATHS = 4;
const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";

const EMPTY_PROFILE: UserProfileSignals = {
  firstName: null,
  knowsDirection: false,
  hasSomeIdeas: false,
  motivations: [],
  strengths: [],
  skills: [],
  fullText: "",
  statedCareerGoal: null,
  statedCareerReason: null,
  hasQuestionSignal: false,
  postPlans: [],
  certainty: null,
};

const EXPLORE_LANES: readonly WorkLaneTab[] = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    active: true,
    dotClass: "bg-cyan-300",
    activeClasses:
      "border-cyan-200/70 bg-cyan-300/[0.28] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_1px_rgba(103,232,249,0.08),0_14px_32px_rgba(34,211,238,0.18)]",
  },
  {
    id: "learning",
    label: "Learning",
    href: "/main/explore/learning",
    active: false,
    dotClass: "bg-violet-300",
    activeClasses:
      "border-violet-300/35 bg-violet-300/[0.14] text-white shadow-[0_0_0_1px_rgba(196,181,253,0.05),0_14px_32px_rgba(139,92,246,0.14)]",
  },
  {
    id: "world",
    label: "World",
    href: "/main/explore/world",
    active: false,
    dotClass: "bg-amber-300",
    activeClasses:
      "border-amber-300/35 bg-amber-300/[0.14] text-white shadow-[0_0_0_1px_rgba(253,224,71,0.05),0_14px_32px_rgba(245,158,11,0.14)]",
  },
  {
    id: "impact",
    label: "Impact",
    href: "/main/explore/impact",
    active: false,
    dotClass: "bg-emerald-300",
    activeClasses:
      "border-emerald-300/35 bg-emerald-300/[0.14] text-white shadow-[0_0_0_1px_rgba(110,231,183,0.05),0_14px_32px_rgba(16,185,129,0.14)]",
  },
  {
    id: "play",
    label: "Play",
    href: "/main/explore/play",
    active: false,
    dotClass: "bg-pink-300",
    activeClasses:
      "border-pink-300/35 bg-pink-300/[0.14] text-white shadow-[0_0_0_1px_rgba(249,168,212,0.05),0_14px_32px_rgba(236,72,153,0.14)]",
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

const SLUG_KEYWORDS: Record<string, string[]> = {
  "game-designer": [
    "game",
    "games",
    "design",
    "designer",
    "player",
    "story",
    "world",
    "worldbuilding",
    "level",
    "creative",
    "systems",
    "fun",
    "interactive",
  ],
  "software-developer": [
    "code",
    "coding",
    "build",
    "building",
    "app",
    "apps",
    "software",
    "developer",
    "logic",
    "systems",
    "tools",
    "technology",
    "problem",
    "debug",
  ],
  "film-video-producer": [
    "film",
    "video",
    "camera",
    "editing",
    "edit",
    "story",
    "visual",
    "production",
    "producer",
    "media",
    "shoot",
    "creative",
  ],
};

function pagePadding() {
  return "pb-24 pt-2 sm:pt-3 lg:pt-5";
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

function hasAnsweredQuestions(value: unknown): boolean {
  if (value == null) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasAnsweredQuestions(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.values(record).some((child) => hasAnsweredQuestions(child));
  }

  if (typeof value === "boolean") return value;
  return false;
}

function normalizePaths(input: unknown): WorkPathContent[] {
  if (Array.isArray(input)) return input as WorkPathContent[];

  const record = asRecord(input);
  if (!record) return [];

  return Object.values(record).filter(Boolean) as WorkPathContent[];
}

function extractCardField(
  path: WorkPathContent,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord((path as unknown as Record<string, unknown>).card);
  return asString(card?.[field]) ?? "";
}

function extractTextItems(input: unknown, limit: number): string[] {
  if (!Array.isArray(input)) return [];

  const results: string[] = [];

  for (const item of input) {
    if (typeof item === "string") {
      const text = item.trim();
      if (text) {
        results.push(text);
        if (results.length >= limit) break;
      }
      continue;
    }

    const record = asRecord(item);
    if (!record) continue;

    const candidate =
      asString(record.label) ??
      asString(record.title) ??
      asString(record.name) ??
      asString(record.text) ??
      asString(record.body) ??
      asString(record.description) ??
      asString(record.detail);

    if (candidate) {
      results.push(candidate);
      if (results.length >= limit) break;
    }
  }

  return results;
}

function pathAccent(path: WorkPathContent): Rgb {
  const theme = asRecord((path as unknown as Record<string, unknown>).theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 99, g: 102, b: 241 };
}

function getPathAtmosphere(path: WorkPathContent, accent: Rgb): PathAtmosphere {
  switch (path.slug) {
    case "game-designer":
      return {
        border: { r: 76, g: 174, b: 255 },
        topGlow: { r: 73, g: 146, b: 255 },
        sideGlow: { r: 115, g: 79, b: 255 },
        washA: { r: 63, g: 145, b: 255 },
        washB: { r: 120, g: 88, b: 255 },
        futureGlow: { r: 83, g: 132, b: 255 },
        futureNode: { r: 117, g: 207, b: 255 },
      };

    case "software-developer":
      return {
        border: { r: 59, g: 214, b: 255 },
        topGlow: { r: 32, g: 196, b: 255 },
        sideGlow: { r: 39, g: 126, b: 210 },
        washA: { r: 41, g: 179, b: 255 },
        washB: { r: 27, g: 116, b: 176 },
        futureGlow: { r: 53, g: 198, b: 255 },
        futureNode: { r: 162, g: 245, b: 255 },
      };

    case "film-video-producer":
      return {
        border: { r: 255, g: 177, b: 92 },
        topGlow: { r: 255, g: 163, b: 74 },
        sideGlow: { r: 255, g: 109, b: 54 },
        washA: { r: 255, g: 155, b: 77 },
        washB: { r: 255, g: 104, b: 74 },
        futureGlow: { r: 255, g: 152, b: 72 },
        futureNode: { r: 255, g: 211, b: 138 },
      };

    case "physical-therapist":
      return {
        border: { r: 52, g: 211, b: 153 },
        topGlow: { r: 34, g: 197, b: 94 },
        sideGlow: { r: 16, g: 185, b: 129 },
        washA: { r: 74, g: 222, b: 128 },
        washB: { r: 16, g: 185, b: 129 },
        futureGlow: { r: 34, g: 197, b: 94 },
        futureNode: { r: 167, g: 243, b: 208 },
      };

    default:
      return {
        border: accent,
        topGlow: accent,
        sideGlow: {
          r: Math.max(0, accent.r - 20),
          g: accent.g,
          b: accent.b,
        },
        washA: accent,
        washB: {
          r: accent.r,
          g: Math.max(0, accent.g - 30),
          b: accent.b,
        },
        futureGlow: accent,
        futureNode: {
          r: Math.min(255, accent.r + 80),
          g: Math.min(255, accent.g + 80),
          b: Math.min(255, accent.b + 80),
        },
      };
  }
}

function buildPathKeywordSet(path: WorkPathContent): string[] {
  const title = extractCardField(path, "title");
  const hook = extractCardField(path, "hook");
  const description = extractCardField(path, "description");

  const fitSignals = extractTextItems(
    (path as unknown as Record<string, unknown>).fitSignals,
    8
  );

  const traitChips = extractTextItems(
    (path as unknown as Record<string, unknown>).traitChips,
    8
  );

  const slugWords = path.slug in SLUG_KEYWORDS ? SLUG_KEYWORDS[path.slug] : [];

  return Array.from(
    new Set(
      [
        ...splitIntoUsefulTokens(title),
        ...splitIntoUsefulTokens(hook),
        ...splitIntoUsefulTokens(description),
        ...splitIntoUsefulTokens(fitSignals.join(" ")),
        ...splitIntoUsefulTokens(traitChips.join(" ")),
        ...slugWords,
      ].filter(Boolean)
    )
  );
}

function getSignalStrength(path: WorkPathContent, profile: UserProfileSignals) {
  const keywords = buildPathKeywordSet(path);
  const profileText = [
    profile.motivations.join(" "),
    profile.strengths.join(" "),
    profile.skills.join(" "),
    profile.fullText,
    profile.statedCareerGoal ?? "",
    profile.postPlans.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (!profileText.trim()) {
    return 67;
  }

  let score = 52;
  let matches = 0;

  for (const keyword of keywords) {
    if (profileText.includes(keyword)) {
      matches += 1;
    }
  }

  score += Math.min(matches * 5, 26);

  const motivationText = profile.motivations.join(" ").toLowerCase();
  const strengthText = profile.strengths.join(" ").toLowerCase();
  const skillText = profile.skills.join(" ").toLowerCase();

  if (keywords.some((keyword) => motivationText.includes(keyword))) score += 5;
  if (keywords.some((keyword) => strengthText.includes(keyword))) score += 5;
  if (keywords.some((keyword) => skillText.includes(keyword))) score += 4;

  if (profile.knowsDirection) score -= 2;

  return Math.max(48, Math.min(94, score));
}

function cleanSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function ensureSentence(value: string) {
  const trimmed = cleanSentence(value);
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildAgenticSummary(path: WorkPathContent) {
  const hook = cleanSentence(extractCardField(path, "hook"));
  const description = cleanSentence(extractCardField(path, "description"));

  if (hook && description) {
    if (/^a path for people who/i.test(description)) {
      const transformed = description.replace(
        /^a path for people who\s*/i,
        "This path could fit if you "
      );
      return `${ensureSentence(hook)} ${ensureSentence(transformed)}`;
    }

    if (/^for people who/i.test(description)) {
      const transformed = description.replace(
        /^for people who\s*/i,
        "This path could fit if you "
      );
      return `${ensureSentence(hook)} ${ensureSentence(transformed)}`;
    }

    return `${ensureSentence(hook)} ${ensureSentence(description)}`;
  }

  if (description) {
    if (/^a path for people who/i.test(description)) {
      return ensureSentence(
        description.replace(
          /^a path for people who\s*/i,
          "This path could fit if you "
        )
      );
    }

    if (/^for people who/i.test(description)) {
      return ensureSentence(
        description.replace(/^for people who\s*/i, "This path could fit if you ")
      );
    }

    return ensureSentence(description);
  }

  if (hook) {
    return ensureSentence(hook);
  }

  return "This path could be worth a closer look if the way this work feels already sounds like you.";
}

function getGoalTheme(goal: string | null, postPlans: string[] = []): string | null {
  const normalized = goal?.toLowerCase().trim() ?? "";
  const plans = postPlans.map((item) => item.toLowerCase());

  if (
    normalized.includes("military") ||
    normalized.includes("army") ||
    normalized.includes("navy") ||
    normalized.includes("air force") ||
    normalized.includes("marines") ||
    normalized.includes("marine corps") ||
    normalized.includes("coast guard") ||
    normalized.includes("space force") ||
    plans.includes("military")
  ) {
    return "military service";
  }

  if (
    normalized.includes("doctor") ||
    normalized.includes("medicine") ||
    normalized.includes("physician") ||
    normalized.includes("surgeon") ||
    normalized.includes("medical")
  ) {
    return "medicine";
  }

  if (
    normalized.includes("software") ||
    normalized.includes("developer") ||
    normalized.includes("coding") ||
    normalized.includes("programming") ||
    normalized.includes("engineer") ||
    normalized.includes("computer science")
  ) {
    return "software";
  }

  if (
    normalized.includes("game") ||
    normalized.includes("gaming") ||
    normalized.includes("game design")
  ) {
    return "games";
  }

  if (
    normalized.includes("film") ||
    normalized.includes("video") ||
    normalized.includes("media") ||
    normalized.includes("producer") ||
    normalized.includes("cinema")
  ) {
    return "film and video";
  }

  if (
    normalized.includes("design") ||
    normalized.includes("designer") ||
    normalized.includes("graphic") ||
    normalized.includes("art")
  ) {
    return "design";
  }

  if (
    normalized.includes("law") ||
    normalized.includes("lawyer") ||
    normalized.includes("attorney") ||
    normalized.includes("legal")
  ) {
    return "law";
  }

  if (
    normalized.includes("science") ||
    normalized.includes("scientist") ||
    normalized.includes("research")
  ) {
    return "science";
  }

  if (
    normalized.includes("teach") ||
    normalized.includes("teacher") ||
    normalized.includes("education")
  ) {
    return "teaching";
  }

  if (
    normalized.includes("business") ||
    normalized.includes("marketing") ||
    normalized.includes("finance") ||
    normalized.includes("entrepreneur")
  ) {
    return "business";
  }

  return null;
}

function readStoredProfileSignals(): UserProfileSignals {
  if (typeof window === "undefined") {
    return EMPTY_PROFILE;
  }

  const candidateKeys = [
    ONBOARDING_STORAGE_KEY,
    "everleap.story.answers.v3",
    "everleap.story.answers.v2",
    "everleap.onboarding.answers",
    "everleap.user.profile",
  ];

  let firstName: string | null = null;
  let knowsDirection = false;
  let hasSomeIdeas = false;
  let statedCareerGoal: string | null = null;
  let statedCareerReason: string | null = null;
  let hasQuestionSignal = false;
  let certainty: "strong" | "kinda" | "no_clue" | null = null;
  let postPlans: string[] = [];

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

      if (
        key === ONBOARDING_STORAGE_KEY ||
        key === "everleap.story.answers.v3" ||
        key === "everleap.story.answers.v2" ||
        key === "everleap.onboarding.answers"
      ) {
        if (hasAnsweredQuestions(parsed) || hasAnsweredQuestions(answers)) {
          hasQuestionSignal = true;
        }
      }

      const nameCandidates = [
        parsed.name,
        parsed.firstName,
        parsed.firstname,
        parsed.first_name,
        profile?.firstName,
        profile?.name,
        answers?.firstName,
        answers?.name,
      ];

      if (!firstName) {
        for (const value of nameCandidates) {
          const found = asString(value);
          if (found) {
            firstName = found.split(" ")[0] ?? null;
            break;
          }
        }
      }

      if (key === ONBOARDING_STORAGE_KEY) {
        const onboardingCertainty = asString(parsed.certainty);
        if (
          onboardingCertainty === "strong" ||
          onboardingCertainty === "kinda" ||
          onboardingCertainty === "no_clue"
        ) {
          certainty = onboardingCertainty;
          if (onboardingCertainty === "strong") knowsDirection = true;
          if (onboardingCertainty === "kinda") hasSomeIdeas = true;
        }

        const onboardingIdea = asString(parsed.certaintyIdea);
        if (!statedCareerGoal && onboardingIdea) {
          statedCareerGoal = onboardingIdea;
        }

        const onboardingPlans = Array.isArray(parsed.postPlans)
          ? parsed.postPlans.filter((item): item is string => typeof item === "string")
          : [];

        if (onboardingPlans.length > 0) {
          postPlans = Array.from(new Set([...postPlans, ...onboardingPlans]));
        }

        if (!statedCareerGoal && onboardingPlans.includes("military")) {
          statedCareerGoal = "military";
        }
      }

      const directionCandidates = [
        parsed.knowsWhatTheyWant,
        parsed.knowsWhatToDo,
        parsed.knowsDirection,
        parsed.alreadyKnowsPath,
        parsed.hasDirection,
        parsed.directionConfidence,
        parsed.certainty,
        profile?.knowsWhatTheyWant,
        profile?.knowsDirection,
        answers?.knowsWhatTheyWant,
        answers?.knowsDirection,
        answers?.futureDirection,
        answers?.directionConfidence,
        answers?.careerDirection,
        answers?.certainty,
      ];

      for (const candidate of directionCandidates) {
        if (candidate === true) {
          knowsDirection = true;
          continue;
        }

        const text = asString(candidate)?.toLowerCase();
        if (!text) continue;

        if (
          text === "strong" ||
          text === "yes" ||
          text.includes("i know exactly what i want") ||
          text.includes("i know what i want") ||
          text.includes("already know") ||
          text.includes("know what to do") ||
          text.includes("have a direction") ||
          text.includes("yes i do")
        ) {
          knowsDirection = true;
          continue;
        }

        if (
          text === "kinda" ||
          text === "maybe" ||
          text.includes("some ideas") ||
          text.includes("a few ideas") ||
          text.includes("kind of") ||
          text.includes("sort of") ||
          text.includes("i think so") ||
          text.includes("not fully")
        ) {
          hasSomeIdeas = true;
        }

        if (text === "no_clue") {
          certainty = "no_clue";
        }
      }

      const careerGoalCandidates = [
        parsed.certaintyIdea,
        parsed.careerGoal,
        parsed.dreamJob,
        parsed.futureJob,
        parsed.whatWantToBe,
        parsed.wantToBe,
        parsed.jobGoal,
        profile?.careerGoal,
        profile?.dreamJob,
        answers?.careerGoal,
        answers?.dreamJob,
        answers?.futureJob,
        answers?.whatWantToBe,
        answers?.wantToBe,
        answers?.oneIdea,
        answers?.someIdea,
        answers?.certaintyIdea,
      ];

      if (!statedCareerGoal) {
        for (const candidate of careerGoalCandidates) {
          const text = asString(candidate);
          if (text) {
            statedCareerGoal = text;
            break;
          }
        }
      }

      const careerReasonCandidates = [
        parsed.careerReason,
        parsed.whyThisCareer,
        parsed.whyWantToBeThat,
        parsed.reasonForCareer,
        profile?.careerReason,
        answers?.careerReason,
        answers?.whyThisCareer,
        answers?.whyWantToBeThat,
        answers?.reasonForCareer,
      ];

      if (!statedCareerReason) {
        for (const candidate of careerReasonCandidates) {
          const text = asString(candidate);
          if (text) {
            statedCareerReason = text;
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

      const rawJoined = JSON.stringify(parsed).toLowerCase();

      if (
        !knowsDirection &&
        (rawJoined.includes('"certainty":"strong"') ||
          rawJoined.includes('"yes"') ||
          rawJoined.includes("i know exactly what i want") ||
          rawJoined.includes("i know what i want") ||
          rawJoined.includes("already know what i want") ||
          rawJoined.includes("i know what i want to do"))
      ) {
        knowsDirection = true;
      }

      if (
        !hasSomeIdeas &&
        (rawJoined.includes('"certainty":"kinda"') ||
          rawJoined.includes('"maybe"') ||
          rawJoined.includes("some ideas") ||
          rawJoined.includes("a few ideas") ||
          rawJoined.includes("i have a couple ideas"))
      ) {
        hasSomeIdeas = true;
      }

      if (!certainty && rawJoined.includes('"certainty":"no_clue"')) {
        certainty = "no_clue";
      }
    } catch {}
  }

  if (knowsDirection) {
    hasSomeIdeas = false;
    if (!certainty) certainty = "strong";
  } else if (hasSomeIdeas && !certainty) {
    certainty = "kinda";
  }

  return {
    firstName,
    knowsDirection,
    hasSomeIdeas,
    motivations: Array.from(new Set(motivations)).slice(0, 24),
    strengths: Array.from(new Set(strengths)).slice(0, 24),
    skills: Array.from(new Set(skills)).slice(0, 24),
    fullText: allStrings.join(" ").toLowerCase(),
    statedCareerGoal,
    statedCareerReason,
    hasQuestionSignal,
    postPlans,
    certainty,
  };
}

function getAgenticOpening(profile: UserProfileSignals) {
  const goalTheme = getGoalTheme(profile.statedCareerGoal, profile.postPlans);

  if (profile.firstName && profile.knowsDirection) {
    return {
      title: `${profile.firstName}, having a direction already is a real advantage.`,
      bodyA: goalTheme
        ? `${capitalize(goalTheme)} is already on your mind. That gives this page a real place to start.`
        : "You came in with something specific in mind. That gives this page a real place to start.",
      bodyB:
        "The goal here is not to pull you away from that direction, but to pressure-test it and show you what else might sit right next to it.",
      bodyC: null,
    };
  }

  if (profile.firstName && profile.hasSomeIdeas) {
    return {
      title: `${profile.firstName}, you already have a few directions forming.`,
      bodyA:
        "Everleap picked up that you’re not starting from zero — you came in with some early ideas, and that matters.",
      bodyB:
        "Explore is where those instincts get tested against real paths, so you can start to see which ones keep getting stronger and which ones fade once they get more concrete.",
      bodyC: null,
    };
  }

  if (profile.firstName) {
    return {
      title: `${profile.firstName}, this is actually a great place to start.`,
      bodyA:
        "Even without a clear direction yet, Everleap is already picking up signal from what you shared — in what seems to hold your attention and where your energy already goes.",
      bodyB:
        "Explore turns that into real paths you can test and react to, so something starts to feel real enough to follow.",
      bodyC: null,
    };
  }

  return {
    title: "This is actually a great place to start.",
    bodyA:
      "Even without a clear direction yet, Everleap is already picking up signal from what you shared — in what seems to hold your attention and where your energy already goes.",
    bodyB:
      "Explore turns that into real paths you can test and react to, so something starts to feel real enough to follow.",
    bodyC: null,
  };
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-2 top-2 h-[52px] w-[52px] opacity-50 sm:right-3 sm:top-3 sm:h-[62px] sm:w-[62px] sm:opacity-56 md:h-[96px] md:w-[96px] md:opacity-80">
      <div className="absolute inset-0 rounded-full border border-cyan-300/8" />
      <div className="absolute inset-[9px] rounded-full border border-cyan-300/9 sm:inset-[11px] md:inset-[15px]" />
      <div className="absolute left-[8px] top-[9px] h-2 w-2 rounded-full bg-cyan-200/42 shadow-[0_0_8px_rgba(103,232,249,0.28)] sm:left-[10px] sm:top-[11px] md:left-[16px] md:top-[20px] md:h-2.5 md:w-2.5 md:shadow-[0_0_16px_rgba(103,232,249,0.5)]" />
      <div className="absolute left-[34px] top-[12px] h-1.5 w-1.5 rounded-full bg-white/16 sm:left-[40px] sm:top-[15px] md:left-[61px] md:top-[22px] md:h-2 md:w-2 md:bg-white/24" />
      <div className="absolute left-[19px] top-[31px] h-2 w-2 rounded-full bg-cyan-100/48 shadow-[0_0_7px_rgba(186,230,253,0.22)] sm:left-[23px] sm:top-[38px] md:left-[36px] md:top-[60px] md:h-2.5 md:w-2.5 md:shadow-[0_0_14px_rgba(186,230,253,0.42)]" />
      <div className="absolute left-[12px] top-[16px] h-px w-[17px] bg-gradient-to-r from-cyan-300/14 to-transparent sm:left-[14px] sm:top-[20px] sm:w-[21px] md:left-[25px] md:top-[31px] md:w-[34px] md:from-cyan-300/26" />
      <div className="absolute left-[21px] top-[21px] h-px w-[10px] rotate-[12deg] bg-gradient-to-r from-cyan-300/11 to-transparent sm:left-[25px] sm:top-[27px] sm:w-[12px] md:left-[42px] md:top-[40px] md:w-[20px] md:from-cyan-300/20" />
      <div className="absolute left-[21px] top-[29px] h-px w-[11px] -rotate-[9deg] bg-gradient-to-r from-cyan-300/10 to-transparent sm:left-[25px] sm:top-[37px] sm:w-[13px] md:left-[42px] md:top-[58px] md:w-[22px] md:from-cyan-300/16" />
      <div className="absolute bottom-[4px] right-[0px] flex h-5 w-5 items-center justify-center rounded-full border border-cyan-300/9 bg-cyan-300/[0.035] text-[8px] font-semibold text-cyan-100/50 sm:h-5.5 sm:w-5.5 md:bottom-[8px] md:right-[1px] md:h-8 md:w-8 md:text-[10px]">
        ◎
      </div>
    </div>
  );
}

function IntroHeader() {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-teal-300/10 text-teal-200/70">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
        Explore
      </div>
    </div>
  );
}

function SignalWord() {
  return (
    <Link
      href="/main/insights?tab=summary"
      className="font-semibold text-white/90 underline decoration-white/20 underline-offset-[3px] transition hover:text-white"
    >
      Signal
    </Link>
  );
}

function ExploreLaneRail({ lanes }: { lanes: readonly WorkLaneTab[] }) {
  return (
    <div className="relative mt-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-4 bg-gradient-to-r from-[#07131f] via-[#07131f]/85 to-transparent sm:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-7 bg-gradient-to-l from-[#07131f] via-[#07131f]/88 to-transparent sm:hidden" />

      <div className="overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 pr-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pr-0">
          {lanes.map((lane) => {
            const active = lane.active;

            return (
              <Link
                key={lane.id}
                href={lane.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative shrink-0 snap-start rounded-full border px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] transition duration-200 sm:px-4",
                  "border-white/10 bg-white/[0.045] text-white/66 hover:border-white/14 hover:bg-white/[0.06] hover:text-white/82",
                  active ? lane.activeClasses : "",
                ].join(" ")}
                style={{
                  minWidth: "fit-content",
                }}
              >
                {active ? (
                  <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/35" />
                ) : null}

                <span className="relative flex items-center gap-2">
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full transition",
                      lane.dotClass,
                      active ? "opacity-100" : "opacity-75 group-hover:opacity-90",
                    ].join(" ")}
                  />
                  <span>{lane.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPathIcon(path: WorkPathContent) {
  switch (path.slug) {
    case "software-developer":
      return Code2;
    case "film-video-producer":
      return Clapperboard;
    case "game-designer":
      return Gamepad2;
    case "doctor":
    case "physician":
    case "medical-career":
      return Stethoscope;
    case "lawyer":
    case "attorney":
      return Scale;
    case "graphic-designer":
    case "designer":
      return PenTool;
    case "scientist":
    case "researcher":
      return FlaskConical;
    case "teacher":
    case "public-policy":
      return Landmark;
    case "marketing":
    case "brand-strategist":
      return Megaphone;
    case "photographer":
      return Camera;
    case "music-producer":
    case "musician":
      return Music4;
    case "mechanic":
    case "technician":
      return Wrench;
    default:
      return BriefcaseBusiness;
  }
}

function getPathForwardCopy(path: WorkPathContent, title: string) {
  switch (path.slug) {
    case "software-developer":
      return {
        eyebrow: "See how this path gets built",
        title: "Open up the real developer path",
        body:
          "See the specialties, how the work actually feels day to day, what the pay range looks like, and where you can start building now.",
      };
    case "film-video-producer":
      return {
        eyebrow: "Step into the production world",
        title: "See how this work comes together",
        body:
          "Get the real picture on roles behind the shoot, the pace of the work, salary range, and ways to start stepping into it now.",
      };
    case "game-designer":
      return {
        eyebrow: "See how game ideas become real",
        title: "Open up the world behind the games",
        body:
          "Explore the roles, specialties, creative workflow, pay, and real ways to start testing this path for yourself now.",
      };
    default:
      return {
        eyebrow: "Get the fuller picture",
        title: `Open up ${title}`,
        body:
          "See the specialties, the real rhythm of the work, salary range, and the local or virtual opportunities that can help you start now.",
      };
  }
}

function WorkIntroPanel({
  profile,
  noSignal,
}: {
  profile: UserProfileSignals;
  noSignal: boolean;
}) {
  if (noSignal) {
    return (
      <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-6 lg:py-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(129,93,255,0.12),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
        <IntroOrbitArt />

        <div className="relative pr-0 md:max-w-4xl md:pr-20 lg:pr-24">
          <IntroHeader />

          <h2 className="mt-2.5 text-[26px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[30px] md:max-w-3xl lg:text-[34px] xl:text-[36px]">
            This is where Everleap&apos;s recommendations get real.
          </h2>

          <p className="mt-4 text-[14px] leading-[1.72] text-white/76 sm:text-[15px] md:max-w-3xl lg:mt-5 lg:text-[16px] lg:leading-[1.78]">
            Explore is designed to turn your <SignalWord /> into real paths you
            can test, compare, and move toward — but there isn&apos;t enough of
            it yet to make this page feel sharp. Answer a few quick questions,
            then come back. You&apos;ll see this change immediately.
          </p>

          <div className="mt-5">
            <Link
              href="/main/questions?cat=motivations&returnTo=/main/explore/work"
              className="group inline-flex items-center gap-1.5 text-[14.5px] font-medium text-white/80 transition hover:text-white/92"
            >
              <span>Start with a few quick questions</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const opening = getAgenticOpening(profile);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-6 lg:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(129,93,255,0.12),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative pr-0 md:max-w-4xl md:pr-20 lg:pr-24">
        <IntroHeader />

        <h2 className="mt-2.5 text-[26px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[30px] md:max-w-3xl lg:text-[34px] xl:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-4 text-[14px] leading-[1.72] text-white/76 sm:text-[15px] md:max-w-3xl lg:mt-5 lg:text-[16px] lg:leading-[1.78]">
          These recommendations come from the <SignalWord /> Everleap is already
          picking up in what you answer and lean toward — then turning that into
          paths worth testing for real. {opening.bodyA} {opening.bodyB}
          {opening.bodyC ? ` ${opening.bodyC}` : ""}
        </p>
      </div>
    </section>
  );
}

function SectionAnchor({
  label,
  color,
  lineAlpha = 0.22,
}: {
  label: string;
  color: Rgb;
  lineAlpha?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: rgb(color, 0.96),
          boxShadow: `0 0 12px ${rgb(color, 0.34)}`,
        }}
      />
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/74">
        {label}
      </p>
      <div
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            color,
            lineAlpha
          )} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

function MobilePathCornerArt({ atmosphere }: { atmosphere: PathAtmosphere }) {
  return (
    <div
      className="pointer-events-none absolute -right-1 top-0 h-16 w-16 md:hidden"
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle at 78% 24%, ${rgb(
          atmosphere.futureGlow,
          0.09
        )} 0%, transparent 36%)`,
      }}
    />
  );
}

function MobileMiniConstellation({ accent }: { accent: Rgb }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-3 top-2 h-[72px] w-[72px] opacity-82 md:hidden"
    >
      <div
        className="absolute right-[4px] top-[4px] h-[54px] w-[54px] rounded-full border"
        style={{ borderColor: rgb(accent, 0.08) }}
      />
      <div
        className="absolute left-[20px] top-[17px] h-px w-[17px] rotate-[12deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(accent, 0.16)} 0%, ${rgb(
            accent,
            0.04
          )} 100%)`,
        }}
      />
      <div
        className="absolute left-[30px] top-[31px] h-px w-[15px] -rotate-[18deg]"
        style={{
          background: `linear-gradient(90deg, ${rgb(accent, 0.14)} 0%, ${rgb(
            accent,
            0.04
          )} 100%)`,
        }}
      />
      <div
        className="absolute left-[16px] top-[14px] h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: rgb(accent, 0.84),
          boxShadow: `0 0 8px ${rgb(accent, 0.24)}`,
        }}
      />
      <div
        className="absolute left-[38px] top-[21px] h-2 w-2 rounded-full"
        style={{
          backgroundColor: rgb(accent, 0.68),
          boxShadow: `0 0 6px ${rgb(accent, 0.18)}`,
        }}
      />
      <div
        className="absolute left-[31px] top-[37px] h-2 w-2 rounded-full"
        style={{
          backgroundColor: rgb(accent, 0.62),
          boxShadow: `0 0 6px ${rgb(accent, 0.16)}`,
        }}
      />
    </div>
  );
}

function JobHeaderIcon({
  path,
  dark = true,
}: {
  path: WorkPathContent;
  dark?: boolean;
}) {
  const Icon = getPathIcon(path);

  return (
    <div
      className={[
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px]",
        dark
          ? "bg-cyan-300/10 text-cyan-200/72"
          : "bg-cyan-500/10 text-cyan-700/72",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

function PathForwardSection({
  path,
  atmosphere,
  title,
}: {
  path: WorkPathContent;
  atmosphere: PathAtmosphere;
  title: string;
}) {
  const copy = getPathForwardCopy(path, title);

  return (
    <div className="relative mt-5 lg:mt-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-2 h-16"
        style={{
          background: `radial-gradient(circle at 82% 34%, ${rgb(
            atmosphere.futureGlow,
            0.08
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative px-1 pt-3 lg:pt-4">
        <SectionAnchor
          label={copy.eyebrow}
          color={atmosphere.futureNode}
          lineAlpha={0.24}
        />

        <Link
          href={`/main/explore/work/${path.slug}`}
          className="group relative mt-3 block overflow-hidden rounded-[2px] px-0 py-0 transition"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${rgb(
                atmosphere.futureGlow,
                0.12
              )} 18%, ${rgb(atmosphere.futureGlow, 0.04)} 62%, transparent 100%)`,
            }}
          />

          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] md:block"
            style={{
              background: `radial-gradient(circle at 78% 50%, ${rgb(
                atmosphere.futureGlow,
                0.08
              )} 0%, transparent 54%)`,
            }}
          />

          <div className="relative flex items-center gap-3 py-3.5 sm:gap-4 sm:py-4.5">
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[20px] lg:text-[21px]">
                {copy.title}
              </h3>

              <p className="mt-1.5 max-w-[42rem] pr-10 text-[13px] leading-[1.6] text-white/72 md:pr-0 lg:text-[14px]">
                {copy.body}
              </p>
            </div>

            <div
              className="relative ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-white/90 transition-transform duration-200 group-hover:translate-x-0.5 sm:h-12 sm:w-12"
              style={{
                borderColor: rgb(atmosphere.futureGlow, 0.2),
                backgroundColor: rgb(atmosphere.futureGlow, 0.08),
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function WorkPathCard({
  path,
  profile,
}: {
  path: WorkPathContent;
  profile: UserProfileSignals;
}) {
  const accent = pathAccent(path);
  const atmosphere = getPathAtmosphere(path, accent);

  const title = extractCardField(path, "title");
  const signalStrength = getSignalStrength(path, profile);
  const summary = buildAgenticSummary(path);

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5 lg:p-6"
      style={{
        borderColor: rgb(atmosphere.border, 0.22),
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      <div className="pointer-events-none absolute right-0 top-0 hidden md:block md:opacity-100">
        <SignalConstellation accent={atmosphere.border} />
      </div>

      <MobileMiniConstellation accent={atmosphere.border} />
      <MobilePathCornerArt atmosphere={atmosphere} />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <JobHeaderIcon path={path} />
              <h2 className="min-w-0 text-[22px] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-[25px] lg:text-[27px]">
                {title}
              </h2>
            </div>

            <div className="mt-2.5 inline-flex items-center gap-2">
              <SignalMeter score={signalStrength} accent={atmosphere.border} />

              <button
                type="button"
                onClick={() => setShowSignalHelp((v) => !v)}
                className="text-white/60 transition hover:text-white/82"
                aria-label="Explain signal score"
              >
                <CircleHelp className="h-4 w-4" />
              </button>
            </div>

            {showSignalHelp ? (
              <div className="mt-1.5 text-[12px] leading-[1.5] text-white/70">
                Everleap&apos;s current read on how well this path fits you.
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-3.5 max-w-none text-[14px] leading-[1.68] text-white/76 sm:mt-4 sm:text-[15px] md:max-w-3xl lg:text-[15px]">
          {summary}
        </p>

        <PathForwardSection path={path} atmosphere={atmosphere} title={title} />
      </div>
    </article>
  );
}

export default function WorkExplorePage() {
  const [profile, setProfile] = React.useState<UserProfileSignals | null>(null);

  React.useEffect(() => {
    setProfile(readStoredProfileSignals());
  }, []);

  const allPaths = React.useMemo(() => normalizePaths(WORK_PATHS), []);
  const visiblePaths = React.useMemo(() => {
    if (!profile) return [];

    return allPaths
      .map((path, index) => ({
        path,
        index,
        score: getSignalStrength(path, profile),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.index - b.index;
      })
      .slice(0, MAX_VISIBLE_WORK_PATHS)
      .map((item) => item.path);
  }, [allPaths, profile]);

  const isReady = profile !== null;
  const showOnlyIntro = profile ? !profile.hasQuestionSignal : true;

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-2">
        <ExploreLaneRail lanes={EXPLORE_LANES} />

        {isReady ? <WorkIntroPanel profile={profile} noSignal={showOnlyIntro} /> : null}

        {isReady && !showOnlyIntro ? (
          <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
            {visiblePaths.map((path) => (
              <WorkPathCard key={path.id} path={path} profile={profile} />
            ))}

            {allPaths.length === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
                No work paths are registered yet.
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}