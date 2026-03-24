// apps/web/src/app/(app)/main/explore/world/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CircleHelp,
  Globe,
} from "lucide-react";

import {
  CardSectionHeader,
  ExploreLaneTabs,
  SectionKicker,
  SignalConstellation,
  SignalMeter,
  rgb,
  type ExploreLaneTab,
  type Rgb,
} from "../_components/ExploreShared";
import { WORLD_PATHS } from "./_data/worldPaths";
import type { WorldPathContent } from "./_data/worldPathSchema";

type WorldExperience = WorldPathContent;

type WorldProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type WorldOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
};

type WorldAtmosphere = {
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

const MAX_VISIBLE_WORLD_EXPERIENCES = 4;

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
    active: true,
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
  "world",
  "would",
  "your",
  "you",
]);

function pagePadding() {
  return "pb-24 pt-3";
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

function normalizeWhitespace(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function splitIntoUsefulTokens(value: unknown): string[] {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return [];

  return normalized
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

function readStoredWorldSignals(): WorldProfileSignals {
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
      // ignore malformed local data
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

function getWorldAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, the world gets bigger when you actually step into it.`,
      bodyA:
        "This is not just about picking a place that looks cool on a screen. It is about noticing what kinds of people, cultures, systems, environments, and lived experiences pull you beyond your current bubble.",
      bodyB:
        "The goal here is to help you find world paths that feel alive for you — then connect that energy to real ways you can start exploring now.",
    };
  }

  return {
    title: "The world gets bigger when you actually step into it.",
    bodyA:
      "This is not just about picking a place that looks cool on a screen. It is about noticing what kinds of people, cultures, systems, environments, and lived experiences pull you beyond your current bubble.",
    bodyB:
      "The goal here is to help you find world paths that feel alive for you — then connect that energy to real ways you can start exploring now.",
  };
}

function extractCardField(
  experience: WorldExperience,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord(experience.card);
  return asString(card?.[field]) ?? "";
}

function pathAccent(experience: WorldExperience): Rgb {
  const theme = asRecord(experience.theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 251, g: 191, b: 36 };
}

function buildExperienceKeywordSet(experience: WorldExperience): string[] {
  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const fitSignals = experience.fitSignals
    .slice(0, 6)
    .map((signal) => signal.label)
    .filter(Boolean);
  const slugWords = splitIntoUsefulTokens(experience.slug.replace(/_/g, " "));

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
  experience: WorldExperience,
  profile: WorldProfileSignals
) {
  const keywords = buildExperienceKeywordSet(experience);
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
    for (let i = 0; i < experience.id.length; i += 1) {
      hash = (hash << 5) - hash + experience.id.charCodeAt(i);
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

function getWorldAtmosphere(
  experience: WorldExperience,
  accent: Rgb
): WorldAtmosphere {
  const title = extractCardField(experience, "title").toLowerCase();
  const description = extractCardField(experience, "description").toLowerCase();
  const combined = `${title} ${description}`;

  if (
    combined.includes("culture") ||
    combined.includes("language") ||
    combined.includes("global") ||
    combined.includes("exchange")
  ) {
    return {
      border: { r: 255, g: 190, b: 84 },
      topGlow: { r: 255, g: 178, b: 66 },
      sideGlow: { r: 255, g: 142, b: 47 },
      washA: { r: 255, g: 186, b: 78 },
      washB: { r: 255, g: 132, b: 58 },
      opportunityGlow: { r: 255, g: 190, b: 84 },
      opportunityNode: { r: 255, g: 226, b: 170 },
      futureGlow: { r: 255, g: 174, b: 76 },
      futureNode: { r: 255, g: 228, b: 176 },
    };
  }

  if (
    combined.includes("nature") ||
    combined.includes("wild") ||
    combined.includes("environment") ||
    combined.includes("field")
  ) {
    return {
      border: { r: 112, g: 212, b: 156 },
      topGlow: { r: 98, g: 198, b: 148 },
      sideGlow: { r: 68, g: 168, b: 130 },
      washA: { r: 100, g: 196, b: 146 },
      washB: { r: 72, g: 154, b: 128 },
      opportunityGlow: { r: 126, g: 224, b: 168 },
      opportunityNode: { r: 205, g: 247, b: 222 },
      futureGlow: { r: 118, g: 214, b: 160 },
      futureNode: { r: 210, g: 248, b: 224 },
    };
  }

  if (
    combined.includes("city") ||
    combined.includes("systems") ||
    combined.includes("health") ||
    combined.includes("communities")
  ) {
    return {
      border: { r: 120, g: 196, b: 255 },
      topGlow: { r: 104, g: 180, b: 255 },
      sideGlow: { r: 78, g: 142, b: 255 },
      washA: { r: 110, g: 184, b: 255 },
      washB: { r: 132, g: 126, b: 255 },
      opportunityGlow: { r: 120, g: 196, b: 255 },
      opportunityNode: { r: 190, g: 228, b: 255 },
      futureGlow: { r: 118, g: 188, b: 255 },
      futureNode: { r: 194, g: 232, b: 255 },
    };
  }

  return {
    border: accent,
    topGlow: accent,
    sideGlow: { r: Math.max(0, accent.r - 20), g: accent.g, b: accent.b },
    washA: accent,
    washB: { r: accent.r, g: Math.max(0, accent.g - 34), b: accent.b },
    opportunityGlow: accent,
    opportunityNode: { r: 255, g: 228, b: 176 },
    futureGlow: accent,
    futureNode: { r: 255, g: 228, b: 176 },
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
): WorldOpportunityPreview | null {
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
  bucket: WorldOpportunityPreview[],
  seen: Set<string>,
  depth = 0,
  maxDepth = 4
) {
  if (depth > maxDepth || value == null) return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const normalized = normalizeOpportunityItem(item, `item-${depth}-${index}`);
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
    "featuredOpportunity",
    "opportunityGroups",
    "opportunities",
    "items",
    "links",
    "resources",
    "actions",
    "waysToTry",
  ];

  for (const key of preferredKeys) {
    if (key in record) {
      collectOpportunityCandidates(record[key], bucket, seen, depth + 1, maxDepth);
    }
  }

  const direct = normalizeOpportunityItem(record, `record-${depth}-${bucket.length}`);
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

function extractWorldOpportunities(
  experience: WorldExperience
): WorldOpportunityPreview[] {
  const bucket: WorldOpportunityPreview[] = [];
  const seen = new Set<string>();

  collectOpportunityCandidates(experience, bucket, seen);

  return bucket.slice(0, 2);
}

function getWorldPayoffIntro(experience: WorldExperience) {
  const hook = extractCardField(experience, "hook");
  return hook
    ? hook
    : "Two real ways to test this world path: one nearby when possible, and one you can start from where you are.";
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-amber-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-amber-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-amber-200/60 shadow-[0_0_16px_rgba(253,230,138,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-amber-100/70 shadow-[0_0_14px_rgba(254,243,199,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-amber-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-amber-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-amber-300/16 to-transparent" />

      <div className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/14 bg-amber-300/[0.06] text-amber-100/72">
        <Globe className="h-4 w-4" />
      </div>
    </div>
  );
}

function WorldIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getWorldAgenticOpening(firstName);

  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(245,158,11,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(251,191,36,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-24">
        <SectionKicker>World</SectionKicker>

        <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
          {opening.title}
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.75] text-white/74 sm:text-[16px]">
          {opening.bodyA}
        </p>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-white/78 sm:text-[16px]">
          {opening.bodyB}
        </p>
      </div>
    </section>
  );
}

function WorldPathForwardSection({
  experience,
  atmosphere,
}: {
  experience: WorldExperience;
  atmosphere: WorldAtmosphere;
}) {
  return (
    <div className="relative mt-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${rgb(
            atmosphere.futureGlow,
            0.22
          )} 18%, ${rgb(atmosphere.futureGlow, 0.06)} 82%, transparent 100%)`,
        }}
      />
      <Link
        href={`/main/explore/world/${experience.slug}`}
        className="group relative block px-1 pt-4"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 18% 18%, ${rgb(
              atmosphere.futureGlow,
              0.12
            )} 0%, transparent 28%), radial-gradient(circle at 88% 82%, ${rgb(
              atmosphere.futureGlow,
              0.09
            )} 0%, transparent 20%)`,
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardSectionHeader color={atmosphere.futureGlow}>
              What this path could really look like
            </CardSectionHeader>

            <h3 className="mt-3 text-[20px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[22px]">
              See the full path ahead
            </h3>

            <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] text-white/72">
              Go deeper into what you would actually explore, why it may fit,
              and the grouped opportunities already inside this path.
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
              className="absolute right-0 top-4 flex h-9 w-9 items-center justify-center rounded-full border text-white/90 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{
                borderColor: rgb(atmosphere.futureGlow, 0.2),
                backgroundColor: rgb(atmosphere.futureGlow, 0.08),
              }}
            >
              <ArrowRight className="h-5 w-5" />
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
  item: WorldOpportunityPreview;
  atmosphere: WorldAtmosphere;
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

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="max-w-[38rem] text-[18px] font-semibold leading-[1.14] tracking-[-0.025em] text-white transition group-hover/opportunity:text-white/95 sm:text-[20px]">
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

function WorldExperienceCard({
  experience,
  profile,
  onDismiss,
}: {
  experience: WorldExperience;
  profile: WorldProfileSignals;
  onDismiss: (experienceId: string) => void;
}) {
  const accent = pathAccent(experience);
  const atmosphere = getWorldAtmosphere(experience, accent);

  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const signalStrength = getSignalStrength(experience, profile);
  const signalLabel = getSignalLabel(signalStrength);
  const opportunities = extractWorldOpportunities(experience);
  const payoffIntro = getWorldPayoffIntro(experience);

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);

  return (
    <article
      className="group relative mx-auto w-full max-w-5xl overflow-hidden rounded-[30px] border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5"
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
        <div className="min-w-0 pr-14 sm:pr-28">
          <CardSectionHeader color={atmosphere.border}>
            World path
          </CardSectionHeader>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
              {title}
            </h2>

            <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-2.5 py-1.5">
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
                  This is Everleap&apos;s best guess, right now, of how well
                  this path fits your profile.
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-2 text-[12px] uppercase tracking-[0.16em] text-white/42">
            {signalLabel}
          </p>

          {hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.65] text-white/86 sm:text-[16px]">
              {hook}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-[44rem] text-[13px] leading-[1.6] text-white/68">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => onDismiss(experience.id)}
            className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12]"
          >
            Not for me
          </button>
        </div>

        <div className="absolute right-0 top-0 hidden sm:block">
          <button
            type="button"
            onClick={() => onDismiss(experience.id)}
            className="mt-7 inline-flex shrink-0 rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12]"
          >
            Not for me
          </button>
        </div>

        <div className="mt-6">
          <CardSectionHeader color={atmosphere.opportunityGlow}>
            Try this for real
          </CardSectionHeader>

          <p className="mt-2 max-w-2xl text-[14px] leading-[1.65] text-white/72">
            {payoffIntro}
          </p>

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

        <WorldPathForwardSection
          experience={experience}
          atmosphere={atmosphere}
        />
      </div>
    </article>
  );
}

export default function WorldExplorePage() {
  const [profile, setProfile] = React.useState<WorldProfileSignals>({
    firstName: null,
    motivations: [],
    strengths: [],
    skills: [],
    fullText: "",
  });
  const [dismissedExperienceIds, setDismissedExperienceIds] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    setProfile(readStoredWorldSignals());
  }, []);

  const visibleExperiences = React.useMemo(() => {
    return WORLD_PATHS.map((experience, index) => ({
      experience,
      score: getSignalStrength(experience, profile),
      index,
    }))
      .filter((item) => !dismissedExperienceIds.includes(item.experience.id))
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.index - b.index
      )
      .slice(0, MAX_VISIBLE_WORLD_EXPERIENCES)
      .map((item) => item.experience);
  }, [profile, dismissedExperienceIds]);

  function handleDismissExperience(experienceId: string) {
    setDismissedExperienceIds((current) =>
      current.includes(experienceId) ? current : [...current, experienceId]
    );
  }

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(245,158,11,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(251,191,36,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

          <div className="relative">
            <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
              How I could explore the world
            </p>

            <ExploreLaneTabs
              lanes={EXPLORE_LANES}
              activeClassName="border-amber-300/30 bg-amber-300/[0.12] text-amber-50 shadow-[0_0_0_1px_rgba(252,211,77,0.06)]"
            />
          </div>
        </section>

        <WorldIntroPanel firstName={profile.firstName} />

        <section className="mt-6 grid grid-cols-1 gap-5 sm:gap-6">
          {visibleExperiences.map((experience) => (
            <WorldExperienceCard
              key={experience.id}
              experience={experience}
              profile={profile}
              onDismiss={handleDismissExperience}
            />
          ))}

          {WORLD_PATHS.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              No world paths are registered yet.
            </div>
          ) : null}

          {WORLD_PATHS.length > 0 && visibleExperiences.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              You&apos;ve cleared the current set of world paths.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}