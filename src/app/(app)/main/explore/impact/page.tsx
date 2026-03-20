// apps/web/src/app/(app)/main/explore/impact/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  HeartHandshake,
  MapPin,
  Megaphone,
  MonitorPlay,
  Trees,
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
import { IMPACT_PATHS } from "./_data/impactPaths";
import type { ImpactPathContent } from "./_data/impactPathSchema";

type ImpactExperience = Pick<
  ImpactPathContent,
  "id" | "slug" | "theme" | "card" | "fitSignals" | "branchPreviews"
>;

type ImpactProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type ImpactTryItem = {
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

const LOCAL_PLACE_LABEL = "near you";
const MAX_VISIBLE_IMPACT_EXPERIENCES = 4;

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
    active: true,
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

function readStoredImpactSignals(): ImpactProfileSignals {
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

function getImpactAgenticOpening(firstName: string | null) {
  if (firstName) {
    return {
      title: `${firstName}, impact does not have to be huge to be real.`,
      bodyA:
        "A lot of meaningful change starts small: helping one group, one cause, one neighborhood, one team, one place. This lane is about finding the kind of contribution that actually feels like you.",
      bodyB:
        "The goal here is to make service, leadership, stewardship, mentorship, and civic action feel tangible — not preachy, not abstract, and not like a brochure. Just real ways to matter.",
    };
  }

  return {
    title: "Impact does not have to be huge to be real.",
    bodyA:
      "A lot of meaningful change starts small: helping one group, one cause, one neighborhood, one team, one place. This lane is about finding the kind of contribution that actually feels like you.",
    bodyB:
      "The goal here is to make service, leadership, stewardship, mentorship, and civic action feel tangible — not preachy, not abstract, and not like a brochure. Just real ways to matter.",
  };
}

function extractCardField(
  experience: ImpactExperience,
  field: "title" | "hook" | "description"
): string {
  const card = asRecord(experience.card);
  return asString(card?.[field]) ?? "";
}

function pathAccent(experience: ImpactExperience): Rgb {
  const theme = asRecord(experience.theme);
  const accent = asRecord(theme?.accent);

  if (
    typeof accent?.r === "number" &&
    typeof accent?.g === "number" &&
    typeof accent?.b === "number"
  ) {
    return { r: accent.r, g: accent.g, b: accent.b };
  }

  return { r: 110, g: 231, b: 183 };
}

function buildExperienceKeywordSet(experience: ImpactExperience): string[] {
  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const fitSignals = experience.fitSignals
    .slice(0, 6)
    .map((signal) => signal.label)
    .filter(Boolean);
  const branchTitles = experience.branchPreviews
    .slice(0, 6)
    .map((branch) => branch.title)
    .filter(Boolean);
  const slugWords = splitIntoUsefulTokens(experience.slug.replace(/_/g, " "));

  return Array.from(
    new Set(
      [
        ...splitIntoUsefulTokens(title),
        ...splitIntoUsefulTokens(hook),
        ...splitIntoUsefulTokens(description),
        ...splitIntoUsefulTokens(fitSignals.join(" ")),
        ...splitIntoUsefulTokens(branchTitles.join(" ")),
        ...slugWords,
      ].filter(Boolean)
    )
  );
}

function getSignalStrength(
  experience: ImpactExperience,
  profile: ImpactProfileSignals
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
  experience: ImpactExperience,
  accent: Rgb
): ExperienceAtmosphere {
  const title = extractCardField(experience, "title").toLowerCase();

  if (
    title.includes("leadership") ||
    title.includes("mentorship") ||
    title.includes("community")
  ) {
    return {
      border: { r: 110, g: 231, b: 183 },
      topGlow: { r: 52, g: 211, b: 153 },
      sideGlow: { r: 45, g: 181, b: 133 },
      washA: { r: 78, g: 208, b: 150 },
      washB: { r: 63, g: 179, b: 134 },
      tryGlow: { r: 120, g: 235, b: 184 },
      tryNode: { r: 209, g: 250, b: 229 },
      futureGlow: { r: 109, g: 226, b: 178 },
      futureNode: { r: 210, g: 250, b: 230 },
    };
  }

  if (
    title.includes("advocacy") ||
    title.includes("civic") ||
    title.includes("justice")
  ) {
    return {
      border: { r: 94, g: 234, b: 212 },
      topGlow: { r: 45, g: 212, b: 191 },
      sideGlow: { r: 36, g: 172, b: 156 },
      washA: { r: 72, g: 213, b: 188 },
      washB: { r: 58, g: 176, b: 160 },
      tryGlow: { r: 110, g: 239, b: 214 },
      tryNode: { r: 204, g: 251, b: 241 },
      futureGlow: { r: 100, g: 234, b: 209 },
      futureNode: { r: 204, g: 251, b: 242 },
    };
  }

  if (
    title.includes("environment") ||
    title.includes("stewardship") ||
    title.includes("climate")
  ) {
    return {
      border: { r: 134, g: 239, b: 172 },
      topGlow: { r: 74, g: 222, b: 128 },
      sideGlow: { r: 66, g: 183, b: 116 },
      washA: { r: 104, g: 221, b: 143 },
      washB: { r: 80, g: 182, b: 118 },
      tryGlow: { r: 145, g: 240, b: 181 },
      tryNode: { r: 220, g: 252, b: 231 },
      futureGlow: { r: 138, g: 236, b: 175 },
      futureNode: { r: 221, g: 252, b: 232 },
    };
  }

  return {
    border: accent,
    topGlow: accent,
    sideGlow: { r: Math.max(0, accent.r - 12), g: accent.g, b: accent.b },
    washA: accent,
    washB: { r: accent.r, g: Math.max(0, accent.g - 26), b: accent.b },
    tryGlow: accent,
    tryNode: { r: 209, g: 250, b: 229 },
    futureGlow: accent,
    futureNode: { r: 209, g: 250, b: 229 },
  };
}

function getTryImpactItem(experience: ImpactExperience): ImpactTryItem {
  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("leadership") ||
    lowerTitle.includes("mentorship") ||
    lowerTitle.includes("community")
  ) {
    return {
      title: "Try one real volunteer or mentor role",
      format: "Local",
      locationLabel: LOCAL_PLACE_LABEL,
      timing: "This month",
      whyItFits:
        hook ||
        "This helps you test whether guiding, helping, or organizing for other people feels energizing once it becomes real and relational.",
      howToTry:
        "Pick one concrete role where you help younger students, peers, or a local group, then notice whether responsibility gives you energy.",
      actionLabel: "Find local options",
      href: "https://www.volunteermatch.org/",
    };
  }

  if (
    lowerTitle.includes("advocacy") ||
    lowerTitle.includes("civic") ||
    lowerTitle.includes("justice")
  ) {
    return {
      title: "Follow one issue and take one action",
      format: "Local + Online",
      locationLabel: "State / local",
      timing: "30–60 minutes",
      whyItFits:
        hook ||
        "This is a real way to test whether speaking up, organizing, or learning how change happens in public life actually feels meaningful to you.",
      howToTry:
        "Choose one issue, learn the basics, and take one small action: attend, write, support, or share something specific.",
      actionLabel: "Explore civic actions",
      href: "https://www.dosomething.org/",
    };
  }

  if (
    lowerTitle.includes("environment") ||
    lowerTitle.includes("stewardship") ||
    lowerTitle.includes("climate")
  ) {
    return {
      title: "Join one cleanup or stewardship day",
      format: "Local",
      locationLabel: LOCAL_PLACE_LABEL,
      timing: "Weekend-friendly",
      whyItFits:
        hook ||
        "This makes impact visible fast. You get to see whether caring for land, place, or environment feels more real when your body is actually in it.",
      howToTry:
        "Pick one local cleanup, restoration, or park day and notice whether being part of the effort makes you want more.",
      actionLabel: "Search opportunities",
      href: "https://www.volunteermatch.org/",
    };
  }

  return {
    title: "Start with one small act that helps someone real",
    format: "Local + Online",
    locationLabel: LOCAL_PLACE_LABEL,
    timing: "This week",
    whyItFits:
      hook ||
      "Impact becomes easier to understand when it stops being abstract and starts touching actual people, places, or causes.",
    howToTry:
      "Choose one real opportunity to help, support, organize, or contribute, and pay attention to whether it creates momentum.",
    actionLabel: "Find an opportunity",
    href: "https://www.volunteermatch.org/",
  };
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-emerald-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-emerald-200/60 shadow-[0_0_16px_rgba(167,243,208,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-emerald-100/70 shadow-[0_0_14px_rgba(209,250,229,0.42)]" />
      <div className="absolute left-[28px] top-[32px] h-px w-[40px] bg-gradient-to-r from-emerald-300/26 to-transparent" />
      <div className="absolute left-[48px] top-[43px] h-px w-[24px] rotate-[12deg] bg-gradient-to-r from-emerald-300/20 to-transparent" />
      <div className="absolute left-[48px] top-[64px] h-px w-[26px] -rotate-[9deg] bg-gradient-to-r from-emerald-300/16 to-transparent" />

      <div className="absolute bottom-[10px] right-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/14 bg-emerald-300/[0.06] text-emerald-100/72">
        <HeartHandshake className="h-4 w-4" />
      </div>
    </div>
  );
}

function ImpactIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getImpactAgenticOpening(firstName);

  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(16,185,129,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(110,231,183,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />
      <IntroOrbitArt />

      <div className="relative max-w-4xl pr-0 sm:pr-24">
        <SectionKicker>Impact</SectionKicker>

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

function ImpactGlyph({
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

  if (title.includes("Leadership") || title.includes("Mentorship")) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Users className={`${iconClass} mr-1.5`} />
        Impact path
      </div>
    );
  }

  if (
    title.includes("Advocacy") ||
    title.includes("Civic") ||
    title.includes("Justice")
  ) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Megaphone className={`${iconClass} mr-1.5`} />
        Impact path
      </div>
    );
  }

  if (
    title.includes("Environment") ||
    title.includes("Stewardship") ||
    title.includes("Climate")
  ) {
    return (
      <div
        className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={sharedStyle}
      >
        <Trees className={`${iconClass} mr-1.5`} />
        Impact path
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={sharedStyle}
    >
      <HeartHandshake className={`${iconClass} mr-1.5`} />
      Impact path
    </div>
  );
}

function InlineTryImpactDetails({
  atmosphere,
  item,
}: {
  atmosphere: ExperienceAtmosphere;
  item: ImpactTryItem;
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

function ImpactPathForwardSection({
  experience,
  atmosphere,
}: {
  experience: ImpactExperience;
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
        href={`/main/explore/impact/${experience.slug}`}
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

function ImpactExperienceCard({
  experience,
  profile,
  onDismiss,
}: {
  experience: ImpactExperience;
  profile: ImpactProfileSignals;
  onDismiss: (experienceId: string) => void;
}) {
  const accent = pathAccent(experience);
  const atmosphere = getExperienceAtmosphere(experience, accent);

  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const signalStrength = getSignalStrength(experience, profile);
  const signalLabel = getSignalLabel(signalStrength);
  const tryItem = getTryImpactItem(experience);

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
                Impact path
              </CardSectionHeader>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <ImpactGlyph title={title} accent={atmosphere.border} />

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
            <InlineTryImpactDetails atmosphere={atmosphere} item={tryItem} />
          ) : null}
        </div>

        <ImpactPathForwardSection
          experience={experience}
          atmosphere={atmosphere}
        />
      </div>
    </article>
  );
}

export default function ImpactExplorePage() {
  const [profile, setProfile] = React.useState<ImpactProfileSignals>({
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
    setProfile(readStoredImpactSignals());
  }, []);

  const visibleExperiences = React.useMemo(() => {
    return IMPACT_PATHS.map((experience, index) => ({
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
      .slice(0, MAX_VISIBLE_IMPACT_EXPERIENCES)
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(110,231,183,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

        <div className="relative">
          <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
            Explore
          </h1>
          <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
            How I could make real impact
          </p>

          <ExploreLaneTabs
            lanes={EXPLORE_LANES}
            activeClassName="border-emerald-300/30 bg-emerald-300/[0.12] text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.06)]"
          />
        </div>
      </section>

      <ImpactIntroPanel firstName={profile.firstName} />

      <section className="mt-6 grid grid-cols-1 gap-5 sm:gap-6">
        {visibleExperiences.map((experience) => (
          <ImpactExperienceCard
            key={experience.id}
            experience={experience}
            profile={profile}
            onDismiss={handleDismissExperience}
          />
        ))}

        {IMPACT_PATHS.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            No impact paths are registered yet.
          </div>
        ) : null}

        {IMPACT_PATHS.length > 0 && visibleExperiences.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
            You&apos;ve cleared the current set of impact paths.
          </div>
        ) : null}
      </section>
    </div>
  );
}