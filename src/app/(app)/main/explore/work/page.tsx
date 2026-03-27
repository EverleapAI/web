// apps/web/src/app/(app)/main/explore/work/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight, CircleHelp } from "lucide-react";

import {
  ExploreLaneTabs,
  SectionKicker,
  SignalConstellation,
  SignalMeter,
  rgb,
  type ExploreLaneTab,
  type Rgb,
} from "../_components/ExploreShared";
import { WORK_PATHS } from "./_data/workPaths";
import type { WorkPathContent } from "./_data/workPathSchema";

type UserProfileSignals = {
  firstName: string | null;
  knowsDirection: boolean;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
  statedCareerGoal: string | null;
  statedCareerReason: string | null;
};

type LiveOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
  badge: string | null;
  provider: string | null;
  mode: "local" | "remote";
};

type LiveOpportunityPair = {
  local: LiveOpportunityPreview | null;
  remote: LiveOpportunityPreview | null;
};

type PathAtmosphere = {
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

const MAX_VISIBLE_WORK_PATHS = 4;

const MOCK_DOCTOR_PROFILE: UserProfileSignals = {
  firstName: "Thomas",
  knowsDirection: true,
  motivations: ["success", "security", "impact"],
  strengths: ["discipline", "focus", "follow-through"],
  skills: ["science", "problem solving", "communication"],
  fullText:
    "I want to be a doctor because it pays a lot of money and I want a strong successful future.",
  statedCareerGoal: "doctor",
  statedCareerReason: "because it pays a lot of money",
};

const EXPLORE_LANES: readonly ExploreLaneTab[] = [
  {
    id: "work",
    label: "Work",
    href: "/main/explore/work",
    active: true,
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
    active: false,
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

function looksLikeMedicineGoal(value: string) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("doctor") ||
    normalized.includes("physician") ||
    normalized.includes("surgeon") ||
    normalized.includes("medicine") ||
    normalized.includes("medical")
  );
}

function humanizeCareerGoal(goal: string) {
  const trimmed = goal.trim();
  if (!trimmed) return "that path";
  if (looksLikeMedicineGoal(trimmed)) return "doctor";

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("a ") ||
    lower.startsWith("an ") ||
    lower.startsWith("the ")
  ) {
    return trimmed;
  }

  return trimmed;
}

function summarizeCareerReason(reason: string | null) {
  if (!reason) return null;

  const normalized = reason.toLowerCase();

  if (
    normalized.includes("money") ||
    normalized.includes("rich") ||
    normalized.includes("wealth") ||
    normalized.includes("salary") ||
    normalized.includes("pay")
  ) {
    return "meaningful, successful, and financially strong";
  }

  if (
    normalized.includes("help") ||
    normalized.includes("care") ||
    normalized.includes("save")
  ) {
    return "meaningful and deeply human";
  }

  if (
    normalized.includes("respect") ||
    normalized.includes("prestige") ||
    normalized.includes("status")
  ) {
    return "respected and substantial";
  }

  return null;
}

function readStoredProfileSignals(): UserProfileSignals {
  if (typeof window === "undefined") {
    return {
      firstName: null,
      knowsDirection: false,
      motivations: [],
      strengths: [],
      skills: [],
      fullText: "",
      statedCareerGoal: null,
      statedCareerReason: null,
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
  let knowsDirection = false;
  let statedCareerGoal: string | null = null;
  let statedCareerReason: string | null = null;

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

      const rawDirectionCandidates = [
        parsed.knowsWhatTheyWant,
        parsed.knowsWhatToDo,
        parsed.knowsDirection,
        parsed.alreadyKnowsPath,
        parsed.hasDirection,
        profile?.knowsWhatTheyWant,
        profile?.knowsDirection,
        answers?.knowsWhatTheyWant,
        answers?.knowsDirection,
        answers?.futureDirection,
      ];

      if (!knowsDirection) {
        for (const candidate of rawDirectionCandidates) {
          if (candidate === true) {
            knowsDirection = true;
            break;
          }

          const text = asString(candidate)?.toLowerCase();
          if (
            text &&
            (text.includes("yes") ||
              text.includes("i do") ||
              text.includes("already know") ||
              text.includes("know what") ||
              text.includes("have a direction"))
          ) {
            knowsDirection = true;
            break;
          }
        }
      }

      const careerGoalCandidates = [
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
        (rawJoined.includes("know what i want") ||
          rawJoined.includes("already know what i want") ||
          rawJoined.includes("i know what i want to do") ||
          rawJoined.includes("already know what i want to do") ||
          rawJoined.includes("know what to do in life"))
      ) {
        knowsDirection = true;
      }

      if (!statedCareerGoal && looksLikeMedicineGoal(rawJoined)) {
        statedCareerGoal = "doctor";
      }

      if (
        !statedCareerReason &&
        (rawJoined.includes("because i want to make money") ||
          rawJoined.includes("want to make money") ||
          rawJoined.includes("because money"))
      ) {
        statedCareerReason = "make money";
      }
    } catch {}
  }

  return {
    firstName,
    knowsDirection,
    motivations: Array.from(new Set(motivations)).slice(0, 24),
    strengths: Array.from(new Set(strengths)).slice(0, 24),
    skills: Array.from(new Set(skills)).slice(0, 24),
    fullText: allStrings.join(" ").toLowerCase(),
    statedCareerGoal,
    statedCareerReason,
  };
}

function getAgenticOpening(profile: UserProfileSignals) {
  const goal = profile.statedCareerGoal
    ? humanizeCareerGoal(profile.statedCareerGoal)
    : null;
  const reasonSummary = summarizeCareerReason(profile.statedCareerReason);

  if (profile.firstName && goal && looksLikeMedicineGoal(goal)) {
    return {
      title: `${profile.firstName}, doctor is already on your mind - and that matters.`,
      bodyA:
        "You came in with a clear ambition, which is a big advantage. Medicine suggests you want a future that feels " +
        (reasonSummary ?? "meaningful, successful, and financially strong") +
        ".",
      bodyB:
        "That is a great place to start. I pulled a few nearby paths that seem to match that same drive - not instead of doctor, but alongside it, in case one of them surprises you.",
      bodyC:
        "Work usually gets clearer when you look past the title and notice what actually holds your attention. The goal here is to follow that instinct and give it something real to move toward.",
    };
  }

  if (profile.firstName && goal) {
    return {
      title: `${profile.firstName}, ${goal} is already on your mind - and that matters.`,
      bodyA:
        "You came in with a clear ambition, which is a big advantage. That tells me you want a future that feels " +
        (reasonSummary ?? "meaningful, substantial, and worth building") +
        ".",
      bodyB:
        "That is a great place to start. I pulled a few nearby paths that seem to match that same drive - not instead of your goal, but alongside it, in case one of them surprises you.",
      bodyC:
        "Work usually gets clearer when you look past the title and notice what actually holds your attention. The goal here is to follow that instinct and give it something real to move toward.",
    };
  }

  if (profile.firstName && profile.knowsDirection) {
    return {
      title: `${profile.firstName}, having a direction already is a great sign.`,
      bodyA:
        "You may already have a strong idea of what you want to do - and that matters. This section is here to pressure-test that instinct against a few other paths that fit how you think, build, and move through the world.",
      bodyB:
        "Sometimes the right answer stays the same. Sometimes a nearby path opens up and gives you a stronger version of what you were already reaching for.",
      bodyC: null,
    };
  }

  if (profile.firstName) {
    return {
      title: `${profile.firstName}, this is not about picking a forever answer.`,
      bodyA:
        "Work becomes easier to explore when you stop asking which title sounds impressive and start asking which kinds of problems, people, systems, or worlds keep catching your attention in a real way.",
      bodyB:
        "The goal here is to notice where your mind already leans - then give that instinct something more concrete to move toward.",
      bodyC: null,
    };
  }

  return {
    title: "This is not about picking a forever answer.",
    bodyA:
      "Work becomes easier to explore when you stop asking which title sounds impressive and start asking which kinds of problems, people, systems, or worlds keep catching your attention in a real way.",
    bodyB:
      "The goal here is to notice where your mind already leans - then give that instinct something more concrete to move toward.",
    bodyC: null,
  };
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
        opportunityGlow: { r: 72, g: 174, b: 255 },
        opportunityNode: { r: 120, g: 216, b: 255 },
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
        opportunityGlow: { r: 42, g: 203, b: 255 },
        opportunityNode: { r: 144, g: 243, b: 255 },
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
        opportunityGlow: { r: 255, g: 182, b: 94 },
        opportunityNode: { r: 255, g: 214, b: 150 },
        futureGlow: { r: 255, g: 152, b: 72 },
        futureNode: { r: 255, g: 211, b: 138 },
      };
    default:
      return {
        border: accent,
        topGlow: accent,
        sideGlow: { r: Math.max(0, accent.r - 10), g: accent.g, b: accent.b },
        washA: accent,
        washB: { r: accent.r, g: Math.max(0, accent.g - 24), b: accent.b },
        opportunityGlow: accent,
        opportunityNode: { r: 220, g: 240, b: 255 },
        futureGlow: accent,
        futureNode: { r: 220, g: 240, b: 255 },
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

function isUsableHref(href: string | null) {
  if (!href) return false;
  return href.trim() !== "#" && href.trim() !== "";
}

function extractOpportunityPair(path: WorkPathContent): LiveOpportunityPair {
  const nextStepsV2 = asRecord(
    (path as unknown as Record<string, unknown>).nextStepsV2
  );
  const rawSections = nextStepsV2?.sections;

  if (!Array.isArray(rawSections)) {
    return { local: null, remote: null };
  }

  const sections = rawSections
    .map((section) => asRecord(section))
    .filter((section): section is Record<string, unknown> => Boolean(section));

  function pickFromSection(
    mode: "local" | "remote"
  ): LiveOpportunityPreview | null {
    const section =
      sections.find((item) => asString(item.mode) === mode) ??
      sections.find((item) => asString(item.id) === mode);

    if (!section) return null;

    const rawItems = section.items;
    if (!Array.isArray(rawItems)) return null;

    for (const item of rawItems) {
      const record = asRecord(item);
      if (!record) continue;

      const title = asString(record.title);
      const href = asString(record.href);
      const note = asString(record.note);
      const itemMode = asString(record.mode);

      if (!title || !note || !isUsableHref(href)) continue;
      if (itemMode && itemMode !== mode) continue;

      return {
        id: asString(record.id) ?? `${mode}-${title}`,
        title,
        href: href!,
        note,
        badge: asString(record.badge),
        provider: asString(record.provider),
        mode,
      };
    }

    return null;
  }

  return {
    local: pickFromSection("local"),
    remote: pickFromSection("remote"),
  };
}

function cleanSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function ensureSentence(value: string) {
  const trimmed = cleanSentence(value);
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
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

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-cyan-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-cyan-200/55 shadow-[0_0_16px_rgba(103,232,249,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-cyan-100/68 shadow-[0_0_14px_rgba(186,230,253,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-cyan-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-cyan-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-cyan-300/16 to-transparent" />
      <div className="absolute bottom-[10px] right-[2px] flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/14 bg-cyan-300/[0.05] text-[11px] font-semibold text-cyan-100/68">
        ◎
      </div>
    </div>
  );
}

function WorkIntroPanel({ profile }: { profile: UserProfileSignals }) {
  const opening = getAgenticOpening(profile);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-7 lg:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(129,93,255,0.12),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-20 lg:pr-24">
        <SectionKicker>Work</SectionKicker>

        <h2 className="mt-2.5 max-w-3xl text-[26px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:mt-3 sm:text-[30px] lg:text-[34px] xl:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-4 max-w-3xl text-[14px] leading-[1.68] text-white/74 sm:text-[15px] lg:mt-5 lg:text-[16px] lg:leading-[1.75]">
          {opening.bodyA}
        </p>

        <p className="mt-3 max-w-3xl text-[14px] leading-[1.68] text-white/78 sm:text-[15px] lg:mt-4 lg:text-[16px] lg:leading-[1.75]">
          {opening.bodyB}
        </p>

        {opening.bodyC ? (
          <p className="mt-3 max-w-3xl text-[14px] leading-[1.68] text-white/72 sm:text-[15px] lg:mt-4 lg:text-[16px] lg:leading-[1.75]">
            {opening.bodyC}
          </p>
        ) : null}
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

function PathForwardSection({
  path,
  atmosphere,
}: {
  path: WorkPathContent;
  atmosphere: PathAtmosphere;
}) {
  return (
    <div className="relative mt-6 lg:mt-7">
      <div
        className="pointer-events-none absolute inset-x-0 top-3 h-20"
        style={{
          background: `radial-gradient(circle at 82% 34%, ${rgb(
            atmosphere.futureGlow,
            0.12
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative px-1 pt-4 lg:pt-5">
        <SectionAnchor
          label="See the full path"
          color={atmosphere.futureNode}
          lineAlpha={0.24}
        />

        <Link
          href={`/main/explore/work/${path.slug}`}
          className="group relative mt-3 block overflow-hidden rounded-[22px] border px-4 py-4 transition hover:bg-white/[0.02] sm:px-4 sm:py-[18px]"
          style={{
            borderColor: rgb(atmosphere.futureGlow, 0.14),
            background: `linear-gradient(90deg, ${rgb(
              atmosphere.futureGlow,
              0.05
            )} 0%, ${rgb(atmosphere.futureGlow, 0.015)} 42%, transparent 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-[38%]"
            style={{
              background: `radial-gradient(circle at 72% 50%, ${rgb(
                atmosphere.futureGlow,
                0.12
              )} 0%, transparent 48%)`,
            }}
          />

          <div className="relative flex items-start justify-between gap-4 lg:gap-5">
            <div className="min-w-0">
              <h3 className="text-[20px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[21px] lg:text-[22px]">
                Go deeper into this path
              </h3>

              <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] text-white/72 lg:text-[14px]">
                See the specialties, day-to-day rhythm, training, and where this
                path can lead next.
              </p>
            </div>

            <div className="relative hidden h-20 w-28 shrink-0 sm:block">
              <div
                className="pointer-events-none absolute right-2 top-2 h-14 w-14 rounded-full blur-2xl"
                style={{ backgroundColor: rgb(atmosphere.futureGlow, 0.16) }}
              />
              <div
                className="pointer-events-none absolute left-0 top-10 h-px w-[72px]"
                style={{
                  background: `linear-gradient(90deg, ${rgb(
                    atmosphere.futureGlow,
                    0.28
                  )} 0%, transparent 100%)`,
                }}
              />
              <div
                className="pointer-events-none absolute left-2 top-8 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: rgb(atmosphere.futureNode, 0.95),
                  boxShadow: `0 0 12px ${rgb(atmosphere.futureGlow, 0.42)}`,
                }}
              />
              <div
                className="pointer-events-none absolute left-16 top-2 h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: rgb(atmosphere.futureGlow, 0.74),
                  boxShadow: `0 0 12px ${rgb(atmosphere.futureGlow, 0.28)}`,
                }}
              />
              <div
                className="pointer-events-none absolute right-2 top-16 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: rgb(atmosphere.futureNode, 0.9),
                  boxShadow: `0 0 12px ${rgb(atmosphere.futureGlow, 0.35)}`,
                }}
              />
              <div
                className="absolute right-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border text-white/90 transition-transform duration-200 group-hover:translate-x-0.5"
                style={{
                  borderColor: rgb(atmosphere.futureGlow, 0.22),
                  backgroundColor: rgb(atmosphere.futureGlow, 0.08),
                }}
              >
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function OpportunityRow({
  item,
  atmosphere,
  isFirst,
}: {
  item: LiveOpportunityPreview;
  atmosphere: PathAtmosphere;
  isFirst: boolean;
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group/opportunity relative block px-1 py-3.5 lg:py-4"
    >
      {!isFirst ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${rgb(
              atmosphere.opportunityGlow,
              0.2
            )} 18%, ${rgb(
              atmosphere.opportunityGlow,
              0.08
            )} 82%, transparent 100%)`,
          }}
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 92% 20%, ${rgb(
            atmosphere.opportunityGlow,
            0.09
          )} 0%, transparent 24%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4 lg:gap-5">
        <div className="min-w-0">
          <h4 className="max-w-[38rem] text-[17px] font-semibold leading-[1.18] tracking-[-0.025em] text-white transition group-hover/opportunity:text-white/95 sm:text-[18px] lg:text-[20px]">
            {item.title}
          </h4>

          <p className="mt-1.5 max-w-[40rem] text-[13px] leading-[1.6] text-white/66 transition group-hover/opportunity:text-white/74 sm:text-[14px]">
            {item.note}
          </p>
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
  const opportunities = extractOpportunityPair(path);
  const summary = buildAgenticSummary(path);

  const renderedOpportunities = [
    opportunities.local,
    opportunities.remote,
  ].filter((item): item is LiveOpportunityPreview => Boolean(item));

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5 lg:p-6"
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
        <div className="min-w-0 pr-14 sm:pr-24 lg:pr-28">
          <h2 className="text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[24px] lg:text-[25px]">
            {title}
          </h2>

          <div className="relative mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-2.5 py-1.5">
            <SignalMeter score={signalStrength} accent={atmosphere.border} />

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
                This is Everleap&apos;s best guess, right now, of how well this
                path fits your profile.
              </div>
            ) : null}
          </div>

          <p className="mt-4 max-w-[44rem] text-[14px] leading-[1.72] text-white/76 sm:text-[15px] lg:text-[15px]">
            {summary}
          </p>
        </div>

        <div className="relative mt-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-3 h-20"
            style={{
              background: `radial-gradient(circle at 16% 20%, ${rgb(
                atmosphere.opportunityGlow,
                0.1
              )} 0%, transparent 24%)`,
            }}
          />

          <div className="relative px-1">
            <SectionAnchor
              label="Try this for real"
              color={atmosphere.opportunityNode}
              lineAlpha={0.22}
            />

            <div className="mt-2.5">
              {renderedOpportunities.map((item, index) => (
                <OpportunityRow
                  key={item.id}
                  item={item}
                  atmosphere={atmosphere}
                  isFirst={index === 0}
                />
              ))}

              {renderedOpportunities.length === 0 ? (
                <div className="px-1 py-4 text-[14px] leading-[1.6] text-white/58">
                  No live opportunities are wired into this path yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <PathForwardSection path={path} atmosphere={atmosphere} />
      </div>
    </article>
  );
}

export default function WorkExplorePage() {
  const [profile, setProfile] = React.useState<UserProfileSignals>(
    MOCK_DOCTOR_PROFILE
  );

  React.useEffect(() => {
    const stored = readStoredProfileSignals();
    const hasRealProfile =
      Boolean(stored.firstName) ||
      stored.knowsDirection ||
      stored.motivations.length > 0 ||
      stored.strengths.length > 0 ||
      stored.skills.length > 0 ||
      Boolean(stored.statedCareerGoal) ||
      Boolean(stored.statedCareerReason) ||
      Boolean(stored.fullText.trim());

    setProfile(hasRealProfile ? stored : MOCK_DOCTOR_PROFILE);
  }, []);

  const allPaths = React.useMemo(() => normalizePaths(WORK_PATHS), []);
  const visiblePaths = React.useMemo(() => {
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

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-7 lg:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(129,93,255,0.10),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

          <div className="relative">
            <h1 className="text-[34px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[42px] lg:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[14px] leading-[1.45] text-white/62 sm:text-[15px] lg:text-[16px]">
              Where I can go
            </p>

            <ExploreLaneTabs
              lanes={EXPLORE_LANES}
              activeClassName="border-cyan-300/30 bg-cyan-300/[0.11] text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.05)]"
            />
          </div>
        </section>

        <WorkIntroPanel profile={profile} />

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
      </div>
    </div>
  );
}