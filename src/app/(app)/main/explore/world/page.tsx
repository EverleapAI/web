// apps/web/src/app/(app)/main/explore/world/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  Globe,
  Languages,
  Map,
  MapPin,
  Monitor,
  MonitorPlay,
  Users,
} from "lucide-react";

import {
  CardSectionHeader,
  ExploreLaneTabs,
  OpportunityMetaPill,
  SectionKicker,
  SignalConstellation,
  SignalMeter,
  rgb,
  type ExploreLaneTab,
  type Rgb,
} from "../_components/ExploreShared";
import { WORLD_PATHS } from "./_data/worldPaths";
import type { WorldPathContent } from "./_data/worldPathSchema";

type WorldExperience = Pick<
  WorldPathContent,
  "id" | "slug" | "theme" | "card" | "fitSignals"
>;

type WorldProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type WorldTryItem = {
  title: string;
  format: "Local" | "Online" | "Local + Online";
  locationLabel: string;
  timing: string;
  whyItFits: string;
  howToTry: string;
  actionLabel: string;
  href: string;
};

type ExperienceAtmosphere = {
  border: Rgb;
  topGlow: Rgb;
  sideGlow: Rgb;
  washA: Rgb;
  washB: Rgb;
  tryGlow: Rgb;
  tryNode: Rgb;
  futureGlow: Rgb;
  futureNode: Rgb;
};

const LOCAL_PLACE_LABEL = "94901";
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

function getWorldAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, the world gets bigger when you actually step into it.`,
      bodyA:
        "This is not just about choosing a destination that looks cool. It is about noticing how you might want to experience life beyond your current bubble — through travel, language, culture, policy, environment, health, or a strong place-based curiosity.",
      bodyB:
        "The goal here is to help you find world paths that feel real for you — including options that can begin through local exploration, online momentum, and questions that keep getting bigger.",
    };
  }

  return {
    title: "The world gets bigger when you actually step into it.",
    bodyA:
      "This is not just about choosing a destination that looks cool. It is about noticing how you might want to experience life beyond your current bubble — through travel, language, culture, policy, environment, health, or a strong place-based curiosity.",
    bodyB:
      "The goal here is to help you find world paths that feel real for you — including options that can begin through local exploration, online momentum, and questions that keep getting bigger.",
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

  return { r: 244, g: 176, b: 64 };
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

function getExperienceAtmosphere(
  experience: WorldExperience,
  accent: Rgb
): ExperienceAtmosphere {
  const title = extractCardField(experience, "title").toLowerCase();

  if (
    title.includes("language") ||
    title.includes("translation") ||
    title.includes("communication")
  ) {
    return {
      border: { r: 255, g: 196, b: 98 },
      topGlow: { r: 249, g: 168, b: 37 },
      sideGlow: { r: 255, g: 190, b: 92 },
      washA: { r: 255, g: 176, b: 82 },
      washB: { r: 222, g: 132, b: 54 },
      tryGlow: { r: 255, g: 191, b: 99 },
      tryNode: { r: 255, g: 232, b: 189 },
      futureGlow: { r: 255, g: 183, b: 89 },
      futureNode: { r: 255, g: 235, b: 196 },
    };
  }

  if (
    title.includes("culture") ||
    title.includes("cultures") ||
    title.includes("global") ||
    title.includes("community")
  ) {
    return {
      border: { r: 255, g: 161, b: 92 },
      topGlow: { r: 247, g: 142, b: 62 },
      sideGlow: { r: 230, g: 126, b: 66 },
      washA: { r: 255, g: 151, b: 89 },
      washB: { r: 204, g: 110, b: 58 },
      tryGlow: { r: 255, g: 167, b: 95 },
      tryNode: { r: 255, g: 220, b: 178 },
      futureGlow: { r: 252, g: 159, b: 84 },
      futureNode: { r: 255, g: 221, b: 180 },
    };
  }

  if (
    title.includes("health") ||
    title.includes("environment") ||
    title.includes("climate") ||
    title.includes("field")
  ) {
    return {
      border: { r: 116, g: 227, b: 189 },
      topGlow: { r: 74, g: 222, b: 128 },
      sideGlow: { r: 72, g: 187, b: 146 },
      washA: { r: 89, g: 213, b: 151 },
      washB: { r: 64, g: 173, b: 143 },
      tryGlow: { r: 114, g: 224, b: 170 },
      tryNode: { r: 202, g: 247, b: 221 },
      futureGlow: { r: 105, g: 216, b: 163 },
      futureNode: { r: 202, g: 246, b: 222 },
    };
  }

  if (
    title.includes("policy") ||
    title.includes("development") ||
    title.includes("systems")
  ) {
    return {
      border: { r: 114, g: 178, b: 255 },
      topGlow: { r: 96, g: 165, b: 250 },
      sideGlow: { r: 88, g: 119, b: 255 },
      washA: { r: 100, g: 158, b: 255 },
      washB: { r: 112, g: 108, b: 255 },
      tryGlow: { r: 122, g: 186, b: 255 },
      tryNode: { r: 194, g: 226, b: 255 },
      futureGlow: { r: 118, g: 178, b: 255 },
      futureNode: { r: 196, g: 228, b: 255 },
    };
  }

  return {
    border: accent,
    topGlow: accent,
    sideGlow: { r: Math.max(0, accent.r - 12), g: accent.g, b: accent.b },
    washA: accent,
    washB: { r: accent.r, g: Math.max(0, accent.g - 26), b: accent.b },
    tryGlow: accent,
    tryNode: { r: 255, g: 230, b: 190 },
    futureGlow: accent,
    futureNode: { r: 255, g: 230, b: 190 },
  };
}

function getTryWorldItem(experience: WorldExperience): WorldTryItem {
  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("language") ||
    lowerTitle.includes("translation") ||
    lowerTitle.includes("communication")
  ) {
    return {
      title: "Try a live beginner language class",
      format: "Online",
      locationLabel: "italki",
      timing: "Flexible",
      whyItFits:
        hook ||
        "This lets you test whether hearing another language, responding in real time, and stepping into another culture feels energizing instead of just interesting.",
      howToTry:
        "Book one short lesson, learn a few phrases, and notice whether the experience makes you want to keep going afterward.",
      actionLabel: "Browse classes",
      href: "https://www.italki.com/",
    };
  }

  if (
    lowerTitle.includes("culture") ||
    lowerTitle.includes("cultures") ||
    lowerTitle.includes("global")
  ) {
    return {
      title: "Find a local cultural event this week",
      format: "Local + Online",
      locationLabel: LOCAL_PLACE_LABEL,
      timing: "This week",
      whyItFits:
        hook ||
        "A real event is one of the fastest ways to feel whether cross-cultural curiosity becomes more alive when actual people, food, music, language, or traditions are in front of you.",
      howToTry:
        "Pick one event that is slightly outside your usual routine and go with the goal of noticing what makes you more curious.",
      actionLabel: "Find events",
      href: "https://www.eventbrite.com/",
    };
  }

  if (
    lowerTitle.includes("health") ||
    lowerTitle.includes("environment") ||
    lowerTitle.includes("climate") ||
    lowerTitle.includes("field")
  ) {
    return {
      title: "Join a local environmental or community health volunteer day",
      format: "Local",
      locationLabel: LOCAL_PLACE_LABEL,
      timing: "Weekend-friendly",
      whyItFits:
        hook ||
        "This helps you test whether world issues start feeling meaningful when they become concrete, local, and connected to real people or places.",
      howToTry:
        "Choose one volunteer event and notice whether being physically present with the work makes the issue feel more compelling.",
      actionLabel: "Search volunteer options",
      href: "https://www.volunteermatch.org/",
    };
  }

  if (
    lowerTitle.includes("policy") ||
    lowerTitle.includes("development") ||
    lowerTitle.includes("systems")
  ) {
    return {
      title: "Watch one real global issue briefing",
      format: "Online",
      locationLabel: "UN / TED",
      timing: "30–60 minutes",
      whyItFits:
        hook ||
        "This is a low-friction way to test whether policy, international systems, and large-scale human questions actually hold your attention when they become more real.",
      howToTry:
        "Pick one topic, watch one briefing or talk, and write down the questions you keep thinking about afterward.",
      actionLabel: "Explore talks",
      href: "https://www.ted.com/topics/global+issues",
    };
  }

  return {
    title: "Find one world-facing experience near you",
    format: "Local + Online",
    locationLabel: LOCAL_PLACE_LABEL,
    timing: "This week",
    whyItFits:
      hook ||
      "The point is not to commit big. It is to test whether stepping toward the wider world creates more energy, curiosity, and momentum.",
    howToTry:
      "Choose one small step — event, class, conversation, or article — and see whether it makes the world feel larger in a good way.",
    actionLabel: "Start exploring",
    href: "https://www.eventbrite.com/",
  };
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

function WorldGlyph({
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

  if (title.includes("Language") || title.includes("Translation")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Languages className={`${iconClass} mr-1.5`} />
        World path
      </div>
    );
  }

  if (title.includes("Culture") || title.includes("Cultures")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Users className={`${iconClass} mr-1.5`} />
        World path
      </div>
    );
  }

  if (
    title.includes("Environment") ||
    title.includes("Climate") ||
    title.includes("Field")
  ) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Map className={`${iconClass} mr-1.5`} />
        World path
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={sharedStyle}
    >
      <Monitor className={`${iconClass} mr-1.5`} />
      World path
    </div>
  );
}

function InlineTryWorldDetails({
  atmosphere,
  item,
}: {
  atmosphere: ExperienceAtmosphere;
  item: WorldTryItem;
}) {
  return (
    <div className="relative mt-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${rgb(
            atmosphere.tryGlow,
            0.36
          )} 18%, ${rgb(atmosphere.tryGlow, 0.15)} 84%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute left-[-34px] top-4 h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(atmosphere.tryGlow, 0.12) }}
      />
      <div
        className="pointer-events-none absolute right-[-10px] top-2 h-32 w-40 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(atmosphere.tryGlow, 0.08) }}
      />

      <div className="relative px-0 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2.5">
              <OpportunityMetaPill glow={atmosphere.tryGlow}>
                <MapPin className="h-3.5 w-3.5" />
                {item.locationLabel}
              </OpportunityMetaPill>
              <OpportunityMetaPill glow={atmosphere.tryGlow}>
                <CalendarDays className="h-3.5 w-3.5" />
                {item.timing}
              </OpportunityMetaPill>
              <OpportunityMetaPill glow={atmosphere.tryGlow}>
                <MonitorPlay className="h-3.5 w-3.5" />
                {item.format}
              </OpportunityMetaPill>
            </div>

            <p className="mt-4 max-w-2xl text-[14px] leading-[1.72] text-white/82 sm:text-[15px]">
              {item.whyItFits}
            </p>

            <p className="mt-3 max-w-2xl text-[14px] leading-[1.72] text-white/64 sm:text-[15px]">
              {item.howToTry}
            </p>

            <div className="mt-4">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium text-white transition hover:translate-y-[-1px]"
                style={{
                  borderColor: rgb(atmosphere.tryGlow, 0.24),
                  background: `linear-gradient(180deg, ${rgb(
                    atmosphere.tryGlow,
                    0.18
                  )} 0%, ${rgb(atmosphere.tryGlow, 0.08)} 100%)`,
                  boxShadow: `0 10px 24px ${rgb(atmosphere.tryGlow, 0.16)}`,
                }}
              >
                {item.actionLabel}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div
            className="pointer-events-none relative hidden h-20 w-24 shrink-0 sm:block"
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-9 h-px w-16"
              style={{
                background: `linear-gradient(90deg, ${rgb(
                  atmosphere.tryGlow,
                  0.34
                )} 0%, transparent 100%)`,
              }}
            />
            <div
              className="absolute right-4 top-2 h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: rgb(atmosphere.tryNode, 0.98),
                boxShadow: `0 0 16px ${rgb(atmosphere.tryGlow, 0.5)}`,
              }}
            />
            <div
              className="absolute left-10 top-8 h-2 w-2 rounded-full"
              style={{
                backgroundColor: rgb(atmosphere.tryGlow, 0.72),
                boxShadow: `0 0 12px ${rgb(atmosphere.tryGlow, 0.36)}`,
              }}
            />
            <div
              className="absolute left-2 top-12 h-3 w-3 rounded-full border"
              style={{
                borderColor: rgb(atmosphere.tryGlow, 0.34),
                backgroundColor: rgb(atmosphere.tryGlow, 0.08),
              }}
            />
            <div
              className="absolute right-12 top-14 h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: rgb(atmosphere.tryNode, 0.82),
                boxShadow: `0 0 10px ${rgb(atmosphere.tryGlow, 0.34)}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldPathForwardSection({
  experience,
  atmosphere,
}: {
  experience: WorldExperience;
  atmosphere: ExperienceAtmosphere;
}) {
  return (
    <div className="relative mt-8">
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

            <h3 className="mt-3 text-[22px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[24px]">
              See the full path ahead
            </h3>

            <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] text-white/72 sm:text-[14px]">
              Go deeper into branches, next steps, and ways to explore this path
              in a more real way.
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
  const atmosphere = getExperienceAtmosphere(experience, accent);

  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const signalStrength = getSignalStrength(experience, profile);
  const signalLabel = getSignalLabel(signalStrength);
  const tryItem = getTryWorldItem(experience);

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);
  const [showTryDrawer, setShowTryDrawer] = React.useState(false);

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
        <div className="min-w-0 pr-14 sm:pr-28">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardSectionHeader color={atmosphere.border}>
                World path
              </CardSectionHeader>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="min-w-0">

                  <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
                    {title}
                  </h2>
                </div>

                <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-2.5 py-1.5">
                  <SignalMeter
                    score={signalStrength}
                    accent={atmosphere.border}
                  />

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
            </div>

            <button
              type="button"
              onClick={() => onDismiss(experience.id)}
              className="mt-7 hidden shrink-0 rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/[0.12] sm:inline-flex"
            >
              Not for me
            </button>
          </div>

          {hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.65] text-white/86 sm:text-[16px]">
              {hook}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-[44rem] text-[14px] leading-[1.7] text-white/68 sm:text-[14px]">
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

        <div className="relative mt-6">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${rgb(
                atmosphere.tryGlow,
                0.2
              )} 18%, ${rgb(atmosphere.tryGlow, 0.06)} 82%, transparent 100%)`,
            }}
          />
          <button
            type="button"
            onClick={() => setShowTryDrawer((current) => !current)}
            aria-expanded={showTryDrawer}
            className="relative w-full px-1 pt-3 text-left"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-full"
              style={{
                background: `radial-gradient(circle at 12% 26%, ${rgb(
                  atmosphere.tryGlow,
                  showTryDrawer ? 0.1 : 0.06
                )} 0%, transparent 34%), radial-gradient(circle at 92% 82%, ${rgb(
                  atmosphere.tryGlow,
                  showTryDrawer ? 0.08 : 0.04
                )} 0%, transparent 26%)`,
              }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardSectionHeader color={atmosphere.tryGlow}>
                  Try this for real
                </CardSectionHeader>

                <p className="mt-3 text-[16px] font-medium leading-[1.45] text-white">
                  {tryItem.title}
                </p>

                <p className="mt-1 text-[13px] leading-[1.55] text-white/68">
                  Start small. See whether the energy gets stronger when this
                  path becomes real.
                </p>
              </div>

              <span
                className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium text-white/90"
                style={{
                  borderColor: rgb(atmosphere.tryGlow, 0.16),
                  backgroundColor: rgb(atmosphere.tryGlow, 0.08),
                }}
              >
                {showTryDrawer ? "Hide details" : "See details"}
                <ChevronDown
                  className={[
                    "h-4 w-4 transition-transform duration-200",
                    showTryDrawer ? "rotate-180" : "",
                  ].join(" ")}
                />
              </span>
            </div>
          </button>

          {showTryDrawer ? (
            <InlineTryWorldDetails atmosphere={atmosphere} item={tryItem} />
          ) : null}
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
      .filter(
        (item) => !dismissedExperienceIds.includes(item.experience.id)
      )
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.index - b.index
      )
      .slice(0, MAX_VISIBLE_WORLD_EXPERIENCES)
      .map((item) => item.experience);
  }, [profile, dismissedExperienceIds]);

  function handleDismissExperience(experienceId: string) {
    setDismissedExperienceIds((current) =>
      current.includes(experienceId)
        ? current
        : [...current, experienceId]
    );
  }

  return (
    <div className={pagePadding()}>
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
  );
}