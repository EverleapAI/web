// apps/web/src/app/(app)/main/explore/impact/page.tsx

"use client";

import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CircleHelp,
  HeartHandshake,
  Megaphone,
  Trees,
  Users,
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
import { IMPACT_PATHS } from "./_data/impactPaths";
import type { ImpactPathContent } from "./_data/impactPathSchema";

type ImpactExperience = ImpactPathContent;

type ImpactProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
};

type ImpactReaction = "liked" | "maybe" | "dismissed";

type ImpactReactionFeedback = {
  reaction: ImpactReaction;
  reasons: string[];
  note: string;
  savedAt: number;
};

type ImpactReactionState = {
  dismissed: string[];
  maybe: string[];
  liked: string[];
  feedbackBySlug?: Record<string, ImpactReactionFeedback>;
};

type ImpactOpportunityPreview = {
  id: string;
  title: string;
  href: string;
  note: string;
};

type ImpactAtmosphere = {
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

const MAX_VISIBLE_IMPACT_EXPERIENCES = 4;
const IMPACT_REACTIONS_STORAGE_KEY = "everleap.explore.impact.reactions.v1";

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
  "impact",
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
  return experience.theme?.accent ?? { r: 110, g: 231, b: 183 };
}

function pathAccentStrong(experience: ImpactExperience): Rgb {
  return experience.theme?.accentStrong ?? experience.theme?.accent ?? { r: 52, g: 211, b: 153 };
}

function pathGlow(experience: ImpactExperience): Rgb {
  return experience.theme?.glow ?? experience.theme?.accentStrong ?? experience.theme?.accent ?? { r: 16, g: 185, b: 129 };
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

function getImpactAtmosphere(
  experience: ImpactExperience,
  accent: Rgb
): ImpactAtmosphere {
  const strong = pathAccentStrong(experience);
  const glow = pathGlow(experience);
  const title = extractCardField(experience, "title").toLowerCase();
  const description = extractCardField(experience, "description").toLowerCase();
  const combined = `${title} ${description}`;

  if (
    combined.includes("leadership") ||
    combined.includes("mentorship") ||
    combined.includes("community")
  ) {
    return {
      border: accent,
      topGlow: strong,
      sideGlow: glow,
      washA: accent,
      washB: strong,
      opportunityGlow: accent,
      opportunityNode: { r: 209, g: 250, b: 229 },
      futureGlow: strong,
      futureNode: { r: 210, g: 250, b: 230 },
    };
  }

  if (
    combined.includes("advocacy") ||
    combined.includes("civic") ||
    combined.includes("justice")
  ) {
    return {
      border: accent,
      topGlow: strong,
      sideGlow: glow,
      washA: accent,
      washB: strong,
      opportunityGlow: accent,
      opportunityNode: { r: 204, g: 251, b: 241 },
      futureGlow: strong,
      futureNode: { r: 204, g: 251, b: 242 },
    };
  }

  if (
    combined.includes("environment") ||
    combined.includes("stewardship") ||
    combined.includes("climate")
  ) {
    return {
      border: accent,
      topGlow: strong,
      sideGlow: glow,
      washA: accent,
      washB: strong,
      opportunityGlow: accent,
      opportunityNode: { r: 221, g: 252, b: 232 },
      futureGlow: strong,
      futureNode: { r: 221, g: 252, b: 232 },
    };
  }

  return {
    border: accent,
    topGlow: strong,
    sideGlow: glow,
    washA: accent,
    washB: strong,
    opportunityGlow: accent,
    opportunityNode: { r: 209, g: 250, b: 229 },
    futureGlow: strong,
    futureNode: { r: 210, g: 250, b: 230 },
  };
}

function extractImpactOpportunities(
  experience: ImpactExperience
): ImpactOpportunityPreview[] {
  const previews: ImpactOpportunityPreview[] = [];
  const seen = new Set<string>();

  for (const group of experience.nextSteps.opportunityGroups) {
    for (const item of group.items) {
      if (!item.href || seen.has(item.href)) continue;
      seen.add(item.href);

      previews.push({
        id: `${group.id}-${item.id}`,
        title: item.title,
        href: item.href,
        note: item.summary || item.whyItHelps || item.provider || "",
      });

      if (previews.length >= 2) return previews;
    }
  }

  return previews.slice(0, 2);
}

function emptyImpactReactionState(): ImpactReactionState {
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

function normalizeFeedbackBySlug(
  input: unknown
): Record<string, ImpactReactionFeedback> {
  if (!input || typeof input !== "object") return {};

  const result: Record<string, ImpactReactionFeedback> = {};

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

function readImpactReactionState(): ImpactReactionState {
  if (typeof window === "undefined") return emptyImpactReactionState();

  try {
    const raw = window.localStorage.getItem(IMPACT_REACTIONS_STORAGE_KEY);
    if (!raw) return emptyImpactReactionState();

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      dismissed: normalizeSlugList(parsed.dismissed),
      maybe: normalizeSlugList(parsed.maybe),
      liked: normalizeSlugList(parsed.liked),
      feedbackBySlug: normalizeFeedbackBySlug(parsed.feedbackBySlug),
    };
  } catch {
    return emptyImpactReactionState();
  }
}

function IntroOrbitArt() {
  return (
    <div className="pointer-events-none absolute right-3 top-3 hidden h-[112px] w-[112px] sm:block">
      <div className="absolute inset-0 rounded-full border border-emerald-300/10" />
      <div className="absolute inset-[15px] rounded-full border border-emerald-300/11" />
      <div className="absolute left-[16px] top-[20px] h-2.5 w-2.5 rounded-full bg-emerald-200/60 shadow-[0_0_16px_rgba(167,243,208,0.5)]" />
      <div className="absolute left-[72px] top-[26px] h-2 w-2 rounded-full bg-white/24" />
      <div className="absolute left-[40px] top-[72px] h-2.5 w-2.5 rounded-full bg-emerald-100/70 shadow-[0_0_14px_rgba(254,243,199,0.42)]" />
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

function ImpactPathForwardSection({
  experience,
  atmosphere,
}: {
  experience: ImpactExperience;
  atmosphere: ImpactAtmosphere;
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

            <h3 className="mt-3 text-[20px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[22px]">
              See the full path ahead
            </h3>

            <p className="mt-2 max-w-2xl text-[13px] leading-[1.65] text-white/72">
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

function OpportunityRow({
  item,
  atmosphere,
  isFirst,
}: {
  item: ImpactOpportunityPreview;
  atmosphere: ImpactAtmosphere;
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

function ImpactExperienceCard({
  experience,
  profile,
}: {
  experience: ImpactExperience;
  profile: ImpactProfileSignals;
}) {
  const accent = pathAccent(experience);
  const atmosphere = getImpactAtmosphere(experience, accent);

  const title = extractCardField(experience, "title");
  const hook = extractCardField(experience, "hook");
  const description = extractCardField(experience, "description");
  const signalStrength = getSignalStrength(experience, profile);
  const signalLabel = getSignalLabel(signalStrength);
  const opportunities = extractImpactOpportunities(experience);

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
          <ImpactGlyph title={title} accent={atmosphere.border} />

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

        <div className="mt-6">
          <CardSectionHeader color={atmosphere.opportunityGlow}>
            Try this for real
          </CardSectionHeader>

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
  const [reactions, setReactions] = React.useState<ImpactReactionState>(
    emptyImpactReactionState()
  );

  React.useEffect(() => {
    setProfile(readStoredImpactSignals());
    setReactions(readImpactReactionState());
  }, []);

  const visibleExperiences = React.useMemo(() => {
    const dismissed = new Set(reactions.dismissed);

    return IMPACT_PATHS.map((experience, index) => ({
      experience,
      score: getSignalStrength(experience, profile),
      index,
    }))
      .filter((item) => !dismissed.has(item.experience.slug))
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.index - b.index
      )
      .slice(0, MAX_VISIBLE_IMPACT_EXPERIENCES)
      .map((item) => item.experience);
  }, [profile, reactions.dismissed]);

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
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
            />
          ))}

          {IMPACT_PATHS.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-[15px] leading-relaxed text-white/72">
              No impact paths are registered yet.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}