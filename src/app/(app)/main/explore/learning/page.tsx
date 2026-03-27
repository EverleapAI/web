// apps/web/src/app/(app)/main/explore/learning/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowRight, BookOpen, CircleHelp } from "lucide-react";

import {
  ExploreLaneTabs,
  SectionKicker,
  SignalConstellation,
  SignalMeter,
  rgb,
  type ExploreLaneTab,
  type Rgb,
} from "../_components/ExploreShared";
import { LEARNING_PATHS } from "./_data/learningPaths";
import type { LearningPathContent } from "./_data/learningPathSchema";

type LearningDirection = LearningPathContent;

type LearningProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type LearningReaction = "liked" | "maybe" | "dismissed";

type LearningReactionFeedback = {
  reaction: LearningReaction;
  reasons: string[];
  note: string;
  savedAt: number;
};

type LearningReactionState = {
  dismissed: string[];
  maybe: string[];
  liked: string[];
  feedbackBySlug?: Record<string, LearningReactionFeedback>;
};

type LearningOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
};

type DirectionAtmosphere = {
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

const MAX_VISIBLE_LEARNING_DIRECTIONS = 4;
const LEARNING_REACTIONS_STORAGE_KEY =
  "everleap.explore.learning.reactions.v1";

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
    active: true,
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

function readStoredLearningSignals(): LearningProfileSignals {
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

      const candidates = [
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
        for (const value of candidates) {
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
    } catch {}
  }

  return {
    firstName,
    motivations: Array.from(new Set(motivations)).slice(0, 24),
    strengths: Array.from(new Set(strengths)).slice(0, 24),
    skills: Array.from(new Set(skills)).slice(0, 24),
    fullText: allStrings.join(" ").toLowerCase(),
  };
}

function emptyLearningReactionState(): LearningReactionState {
  return {
    dismissed: [],
    maybe: [],
    liked: [],
    feedbackBySlug: {},
  };
}

function normalizeSlugList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  return Array.from(
    new Set(
      input
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function normalizeLearningFeedbackBySlug(
  input: unknown
): Record<string, LearningReactionFeedback> {
  if (!input || typeof input !== "object") return {};

  const result: Record<string, LearningReactionFeedback> = {};

  for (const [slug, value] of Object.entries(
    input as Record<string, unknown>
  )) {
    if (!slug.trim() || !value || typeof value !== "object") continue;

    const raw = value as Record<string, unknown>;
    const reaction =
      raw.reaction === "liked" ||
      raw.reaction === "maybe" ||
      raw.reaction === "dismissed"
        ? raw.reaction
        : null;

    if (!reaction) continue;

    const reasons = Array.isArray(raw.reasons)
      ? raw.reasons
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const note = typeof raw.note === "string" ? raw.note : "";
    const savedAt =
      typeof raw.savedAt === "number" && Number.isFinite(raw.savedAt)
        ? raw.savedAt
        : Date.now();

    result[slug] = {
      reaction,
      reasons,
      note,
      savedAt,
    };
  }

  return result;
}

function readLearningReactionState(): LearningReactionState {
  if (typeof window === "undefined") return emptyLearningReactionState();

  try {
    const raw = window.localStorage.getItem(LEARNING_REACTIONS_STORAGE_KEY);
    if (!raw) return emptyLearningReactionState();

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      dismissed: normalizeSlugList(parsed.dismissed),
      maybe: normalizeSlugList(parsed.maybe),
      liked: normalizeSlugList(parsed.liked),
      feedbackBySlug: normalizeLearningFeedbackBySlug(parsed.feedbackBySlug),
    };
  } catch {
    return emptyLearningReactionState();
  }
}

function getLearningAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, learning gets better when it starts feeling alive.`,
      bodyA:
        "This is not about forcing yourself into whatever sounds smartest on paper. It is about noticing the kinds of questions, materials, patterns, ideas, and problems that already pull you in.",
      bodyB:
        "The goal here is to help you notice where your mind has energy — then turn that energy into directions you can actually explore.",
    };
  }

  return {
    title: "Learning gets better when it starts feeling alive.",
    bodyA:
      "This is not about forcing yourself into whatever sounds smartest on paper. It is about noticing the kinds of questions, materials, patterns, ideas, and problems that already pull you in.",
    bodyB:
      "The goal here is to help you notice where your mind has energy — then turn that energy into directions you can actually explore.",
  };
}

function extractCardField(
  direction: LearningDirection,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord(direction.card);
  return asString(card?.[field]) ?? "";
}

function pathAccent(direction: LearningDirection): Rgb {
  const theme = asRecord(direction.theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 167, g: 139, b: 250 };
}

function buildDirectionKeywordSet(direction: LearningDirection): string[] {
  const title = extractCardField(direction, "title");
  const hook = extractCardField(direction, "hook");
  const description = extractCardField(direction, "description");
  const fitSignals = direction.fitSignals
    .slice(0, 6)
    .map((signal) => signal.label)
    .filter(Boolean);
  const slugWords = splitIntoUsefulTokens(direction.slug.replace(/_/g, " "));

  return Array.from(
    new Set(
      [
        ...splitIntoUsefulTokens(title),
        ...splitIntoUsefulTokens(hook),
        ...splitIntoUsefulTokens(description),
        ...splitIntoUsefulTokens(fitSignals.join(" ")),
        ...slugWords,
      ].filter(Boolean)
    )
  );
}

function getSignalStrength(
  direction: LearningDirection,
  profile: LearningProfileSignals
) {
  const keywords = buildDirectionKeywordSet(direction);
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
    for (let i = 0; i < direction.id.length; i += 1) {
      hash = (hash << 5) - hash + direction.id.charCodeAt(i);
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

function getDirectionAtmosphere(
  direction: LearningDirection,
  accent: Rgb
): DirectionAtmosphere {
  const title = extractCardField(direction, "title").toLowerCase();

  if (
    title.includes("code") ||
    title.includes("systems") ||
    title.includes("business") ||
    title.includes("innovation")
  ) {
    return {
      border: { r: 111, g: 189, b: 255 },
      topGlow: { r: 93, g: 166, b: 255 },
      sideGlow: { r: 88, g: 119, b: 255 },
      washA: { r: 96, g: 154, b: 255 },
      washB: { r: 122, g: 96, b: 255 },
      opportunityGlow: { r: 108, g: 190, b: 255 },
      opportunityNode: { r: 176, g: 228, b: 255 },
      futureGlow: { r: 110, g: 169, b: 255 },
      futureNode: { r: 182, g: 226, b: 255 },
    };
  }

  if (
    title.includes("design") ||
    title.includes("media") ||
    title.includes("story")
  ) {
    return {
      border: { r: 246, g: 142, b: 255 },
      topGlow: { r: 227, g: 120, b: 255 },
      sideGlow: { r: 181, g: 92, b: 255 },
      washA: { r: 230, g: 112, b: 255 },
      washB: { r: 168, g: 106, b: 255 },
      opportunityGlow: { r: 246, g: 142, b: 255 },
      opportunityNode: { r: 255, g: 207, b: 255 },
      futureGlow: { r: 238, g: 128, b: 255 },
      futureNode: { r: 255, g: 210, b: 255 },
    };
  }

  if (
    title.includes("bio") ||
    title.includes("health") ||
    title.includes("environment") ||
    title.includes("science")
  ) {
    return {
      border: { r: 152, g: 230, b: 168 },
      topGlow: { r: 119, g: 214, b: 154 },
      sideGlow: { r: 79, g: 187, b: 143 },
      washA: { r: 114, g: 205, b: 152 },
      washB: { r: 96, g: 182, b: 145 },
      opportunityGlow: { r: 142, g: 226, b: 162 },
      opportunityNode: { r: 203, g: 245, b: 214 },
      futureGlow: { r: 138, g: 218, b: 160 },
      futureNode: { r: 206, g: 247, b: 220 },
    };
  }

  return {
    border: accent,
    topGlow: accent,
    sideGlow: { r: Math.max(0, accent.r - 12), g: accent.g, b: accent.b },
    washA: accent,
    washB: { r: accent.r, g: Math.max(0, accent.g - 26), b: accent.b },
    opportunityGlow: accent,
    opportunityNode: { r: 234, g: 226, b: 255 },
    futureGlow: accent,
    futureNode: { r: 234, g: 226, b: 255 },
  };
}

function extractHref(value: unknown): string | null {
  const direct = asString(value);
  if (direct && /^https?:\/\//i.test(direct)) return direct;

  const record = asRecord(value);
  if (!record) return null;

  const candidates = [
    record.href,
    record.url,
    record.link,
    record.website,
    record.path,
  ];

  for (const candidate of candidates) {
    const found = asString(candidate);
    if (found && /^https?:\/\//i.test(found)) {
      return found;
    }
  }

  return null;
}

function normalizeOpportunityItem(
  value: unknown,
  fallbackId: string
): LearningOpportunityPreview | null {
  const record = asRecord(value);
  if (!record) return null;

  const href = extractHref(record);
  if (!href) return null;

  const title =
    asString(record.title) ??
    asString(record.name) ??
    asString(record.label) ??
    asString(record.headline);

  if (!title) return null;

  const note =
    asString(record.note) ??
    asString(record.description) ??
    asString(record.summary) ??
    asString(record.body) ??
    asString(record.oneLiner) ??
    asString(record.whyItFits) ??
    "";

  return {
    id: asString(record.id) ?? fallbackId,
    title,
    href,
    note,
  };
}

function collectOpportunityCandidates(
  value: unknown,
  bucket: LearningOpportunityPreview[],
  seen: Set<string>,
  depth = 0,
  maxDepth = 4
) {
  if (depth > maxDepth || value == null) return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const normalized = normalizeOpportunityItem(
        item,
        `item-${depth}-${index}`
      );
      if (normalized && !seen.has(normalized.href)) {
        seen.add(normalized.href);
        bucket.push(normalized);
      }

      collectOpportunityCandidates(item, bucket, seen, depth + 1, maxDepth);
    });
    return;
  }

  const record = asRecord(value);
  if (!record) return;

  const preferredKeys = [
    "tryNow",
    "starterExperiences",
    "opportunities",
    "opportunityGroups",
    "actions",
    "experiments",
    "resources",
    "links",
    "waysToTry",
    "tryThisForReal",
    "nextSteps",
  ];

  for (const key of preferredKeys) {
    if (key in record) {
      collectOpportunityCandidates(
        record[key],
        bucket,
        seen,
        depth + 1,
        maxDepth
      );
    }
  }

  const direct = normalizeOpportunityItem(
    record,
    `record-${depth}-${bucket.length}`
  );
  if (direct && !seen.has(direct.href)) {
    seen.add(direct.href);
    bucket.push(direct);
  }

  for (const child of Object.values(record)) {
    if (typeof child === "object" && child !== null) {
      collectOpportunityCandidates(child, bucket, seen, depth + 1, maxDepth);
    }
  }
}

function extractLearningOpportunities(
  direction: LearningDirection
): LearningOpportunityPreview[] {
  const bucket: LearningOpportunityPreview[] = [];
  const seen = new Set<string>();

  collectOpportunityCandidates(direction, bucket, seen);

  return bucket.slice(0, 2);
}

function cleanSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function ensureSentence(value: string) {
  const trimmed = cleanSentence(value);
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildAgenticSummary(direction: LearningDirection) {
  const hook = cleanSentence(extractCardField(direction, "hook"));
  const description = cleanSentence(extractCardField(direction, "description"));

  if (hook && description) {
    if (/^a path for people who/i.test(description)) {
      const transformed = description.replace(
        /^a path for people who\s*/i,
        "This direction could fit if you "
      );
      return `${ensureSentence(hook)} ${ensureSentence(transformed)}`;
    }

    if (/^for people who/i.test(description)) {
      const transformed = description.replace(
        /^for people who\s*/i,
        "This direction could fit if you "
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
          "This direction could fit if you "
        )
      );
    }

    if (/^for people who/i.test(description)) {
      return ensureSentence(
        description.replace(
          /^for people who\s*/i,
          "This direction could fit if you "
        )
      );
    }

    return ensureSentence(description);
  }

  if (hook) {
    return ensureSentence(hook);
  }

  return "This direction could be worth a closer look if the way it thinks, asks questions, and explores the world already sounds like you.";
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-violet-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-violet-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-violet-200/60 shadow-[0_0_16px_rgba(196,181,253,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-violet-100/70 shadow-[0_0_14px_rgba(221,214,254,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-violet-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-violet-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-violet-300/16 to-transparent" />

      <div className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/14 bg-violet-300/[0.06] text-violet-100/72">
        <BookOpen className="h-4 w-4" />
      </div>
    </div>
  );
}

function LearningIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getLearningAgenticOpening(firstName);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-7 lg:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(147,51,234,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(196,181,253,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-20 lg:pr-24">
        <SectionKicker>Learning</SectionKicker>

        <h2 className="mt-2.5 max-w-3xl text-[26px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:mt-3 sm:text-[30px] lg:text-[34px] xl:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-4 max-w-3xl text-[14px] leading-[1.68] text-white/74 sm:text-[15px] lg:mt-5 lg:text-[16px] lg:leading-[1.75]">
          {opening.bodyA}
        </p>

        <p className="mt-3 max-w-3xl text-[14px] leading-[1.68] text-white/78 sm:text-[15px] lg:mt-4 lg:text-[16px] lg:leading-[1.75]">
          {opening.bodyB}
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

function LearningPathForwardSection({
  direction,
  atmosphere,
}: {
  direction: LearningDirection;
  atmosphere: DirectionAtmosphere;
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
          href={`/main/explore/learning/${direction.slug}`}
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
                See what you would study, where it could lead, and how to keep
                testing whether it really fits.
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
  item: LearningOpportunityPreview;
  atmosphere: DirectionAtmosphere;
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

          {item.note ? (
            <p className="mt-1.5 max-w-[40rem] text-[13px] leading-[1.6] text-white/66 transition group-hover/opportunity:text-white/74 sm:text-[14px]">
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

function LearningDirectionCard({
  direction,
  profile,
}: {
  direction: LearningDirection;
  profile: LearningProfileSignals;
}) {
  const accent = pathAccent(direction);
  const atmosphere = getDirectionAtmosphere(direction, accent);

  const title = extractCardField(direction, "title");
  const signalStrength = getSignalStrength(direction, profile);
  const opportunities = extractLearningOpportunities(direction);
  const summary = buildAgenticSummary(direction);

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
        </div>

        <LearningPathForwardSection
          direction={direction}
          atmosphere={atmosphere}
        />
      </div>
    </article>
  );
}

export default function LearningExplorePage() {
  const [profile, setProfile] = React.useState<LearningProfileSignals>({
    firstName: null,
    motivations: [],
    strengths: [],
    skills: [],
    fullText: "",
  });
  const [reactions, setReactions] = React.useState<LearningReactionState>(
    emptyLearningReactionState()
  );

  React.useEffect(() => {
    setProfile(readStoredLearningSignals());
    setReactions(readLearningReactionState());
  }, []);

  const visibleDirections = React.useMemo(() => {
    const dismissed = new Set(reactions.dismissed);

    return LEARNING_PATHS.map((direction, index) => ({
      direction,
      score: getSignalStrength(direction, profile),
      index,
    }))
      .filter((item) => !dismissed.has(item.direction.slug))
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.index - b.index
      )
      .slice(0, MAX_VISIBLE_LEARNING_DIRECTIONS)
      .map((item) => item.direction);
  }, [profile, reactions.dismissed]);

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-7 lg:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(147,51,234,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(196,181,253,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

          <div className="relative">
            <h1 className="text-[34px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[42px] lg:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[14px] leading-[1.45] text-white/62 sm:text-[15px] lg:text-[16px]">
              What I want to understand
            </p>

            <ExploreLaneTabs
              lanes={EXPLORE_LANES}
              activeClassName="border-violet-300/30 bg-violet-300/[0.12] text-violet-50 shadow-[0_0_0_1px_rgba(196,181,253,0.06)]"
            />
          </div>
        </section>

        <LearningIntroPanel firstName={profile.firstName} />

        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          {visibleDirections.map((direction) => (
            <LearningDirectionCard
              key={direction.id}
              direction={direction}
              profile={profile}
            />
          ))}

          {LEARNING_PATHS.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              No learning paths are registered yet.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}