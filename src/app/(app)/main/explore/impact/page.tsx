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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  return (
    experience.theme?.accentStrong ??
    experience.theme?.accent ?? { r: 52, g: 211, b: 153 }
  );
}

function pathGlow(experience: ImpactExperience): Rgb {
  return (
    experience.theme?.glow ??
    experience.theme?.accentStrong ??
    experience.theme?.accent ?? { r: 16, g: 185, b: 129 }
  );
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

function writeImpactReactionState(state: ImpactReactionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    IMPACT_REACTIONS_STORAGE_KEY,
    JSON.stringify(state)
  );
}

function saveImpactReactionFeedback(args: {
  slug: string;
  reaction: ImpactReaction;
  reasons: string[];
  note: string;
}) {
  const current = readImpactReactionState();

  const next: ImpactReactionState = {
    dismissed: current.dismissed.filter((item) => item !== args.slug),
    maybe: current.maybe.filter((item) => item !== args.slug),
    liked: current.liked.filter((item) => item !== args.slug),
    feedbackBySlug: {
      ...(current.feedbackBySlug ?? {}),
    },
  };

  next[args.reaction] = Array.from(new Set([...next[args.reaction], args.slug]));
  next.feedbackBySlug![args.slug] = {
    reaction: args.reaction,
    reasons: Array.from(
      new Set(args.reasons.map((item) => item.trim()).filter(Boolean))
    ),
    note: args.note.trim(),
    savedAt: Date.now(),
  };

  writeImpactReactionState(next);
  return next;
}

function cleanSentence(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function ensureSentence(value: string) {
  const trimmed = cleanSentence(value);
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildAgenticSummary(experience: ImpactExperience) {
  const hook = cleanSentence(extractCardField(experience, "hook"));
  const description = cleanSentence(extractCardField(experience, "description"));

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

  return "This path could be worth a closer look if the kind of contribution inside it already sounds like the kind of impact you would actually want to make.";
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

function ImpactPathForwardSection({
  experience,
  atmosphere,
}: {
  experience: ImpactExperience;
  atmosphere: ImpactAtmosphere;
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
          href={`/main/explore/impact/${experience.slug}`}
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
                See the branches, next steps, and the kinds of real-world impact
                this path could open up.
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
  item: ImpactOpportunityPreview;
  atmosphere: ImpactAtmosphere;
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

function quickChipClass(isActive: boolean) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-95",
    isActive
      ? "text-white"
      : "text-white/78 hover:text-white hover:bg-white/[0.06]",
  ].join(" ");
}

function ImpactQuickCheckCard({
  accent,
  strong,
  glow,
  selectedReaction,
  initialReasons,
  initialNote,
  isSaving,
  onSubmit,
}: {
  accent: Rgb;
  strong: Rgb;
  glow: Rgb;
  selectedReaction: ImpactReaction | null;
  initialReasons: string[];
  initialNote: string;
  isSaving: boolean;
  onSubmit: (payload: {
    reaction: ImpactReaction;
    reasons: string[];
    note: string;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draftReaction, setDraftReaction] =
    React.useState<ImpactReaction | null>(selectedReaction);
  const [reasons, setReasons] = React.useState<string[]>(initialReasons);
  const [note, setNote] = React.useState(initialNote);

  React.useEffect(() => {
    setDraftReaction(selectedReaction);
    setReasons(initialReasons);
    setNote(initialNote);
  }, [selectedReaction, initialReasons, initialNote]);

  const reactionConfig = React.useMemo(() => {
    const map: Record<
      ImpactReaction,
      {
        title: string;
        helper: string;
        submitLabel: string;
        reasonOptions: string[];
      }
    > = {
      liked: {
        title: "What kind of impact here feels most real to you?",
        helper:
          "This helps Everleap notice what kinds of contribution, service, and leadership feel natural for you.",
        submitLabel: "Save",
        reasonOptions: [
          "I want to help people directly",
          "I like making change feel tangible",
          "The community side feels strong",
          "I could see myself doing this for real",
          "This feels like a strong signal",
        ],
      },
      maybe: {
        title: "What feels interesting, but not fully clear yet?",
        helper:
          "You are not locking anything in. This just sharpens what to show next.",
        submitLabel: "Save",
        reasonOptions: [
          "Some parts feel strong",
          "I need more real examples",
          "I am curious but unsure",
          "I want to compare it to other paths",
          "I am not sure how it would feel in real life",
        ],
      },
      dismissed: {
        title: "What feels off about this impact path?",
        helper:
          "Tell Everleap why this one misses, and it can step aside for a better fit.",
        submitLabel: "Remove this path",
        reasonOptions: [
          "The cause does not pull me in",
          "It feels too abstract",
          "Another path feels more natural",
          "I do not connect with this kind of impact",
          "I would rather explore something else",
        ],
      },
    };

    return draftReaction ? map[draftReaction] : null;
  }, [draftReaction]);

  function pickReaction(reaction: ImpactReaction) {
    setDraftReaction(reaction);
    setOpen(true);

    if (reaction !== selectedReaction) {
      setReasons([]);
      setNote("");
    }
  }

  function toggleReason(reason: string) {
    setReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason]
    );
  }

  function handleSubmit() {
    if (!draftReaction) return;
    onSubmit({
      reaction: draftReaction,
      reasons,
      note,
    });
    setOpen(false);
  }

  return (
    <section
      className="relative mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-[#0a121d]/72 px-4 py-4 backdrop-blur-xl"
      style={{
        boxShadow: `0 18px 48px rgba(0,0,0,0.20), 0 0 24px ${rgb(glow, 0.06)}`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 12% 0%, ${rgb(accent, 0.12)} 0%, transparent 28%),
            radial-gradient(circle at 82% 20%, ${rgb(strong, 0.1)} 0%, transparent 24%),
            radial-gradient(circle at 18% 100%, ${rgb(glow, 0.08)} 0%, transparent 30%)
          `,
        }}
      />

      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Quick check
        </div>

        <div className="mt-2 text-[15px] font-semibold tracking-[-0.02em] text-white/94 sm:text-[16px]">
          Does this kind of impact feel like your kind of contribution?
        </div>

        <p className="mt-1 text-[12px] leading-5.5 text-white/56 sm:text-[13px]">
          This is just signal, not a final answer.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("liked")}
            className={quickChipClass(draftReaction === "liked")}
            style={{
              borderColor:
                draftReaction === "liked"
                  ? rgb(accent, 0.3)
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "liked"
                  ? `linear-gradient(180deg, ${rgb(
                      accent,
                      0.14
                    )} 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.02)",
              boxShadow:
                draftReaction === "liked"
                  ? `0 0 20px ${rgb(glow, 0.12)}`
                  : "none",
            }}
          >
            <span aria-hidden>👍</span>
            <span>Yes, I want more of this</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("maybe")}
            className={quickChipClass(draftReaction === "maybe")}
            style={{
              borderColor:
                draftReaction === "maybe"
                  ? rgb(strong, 0.24)
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "maybe"
                  ? `linear-gradient(180deg, ${rgb(
                      strong,
                      0.12
                    )} 0%, rgba(255,255,255,0.03) 100%)`
                  : "rgba(255,255,255,0.02)",
            }}
          >
            <span aria-hidden>🙂</span>
            <span>Maybe</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => pickReaction("dismissed")}
            className={quickChipClass(draftReaction === "dismissed")}
            style={{
              borderColor:
                draftReaction === "dismissed"
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.10)",
              background:
                draftReaction === "dismissed"
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.02)",
            }}
          >
            <span aria-hidden>👎</span>
            <span>Not for me</span>
          </button>
        </div>

        <div
          className={cx(
            "overflow-hidden transition-[max-height,opacity,margin] duration-200 ease-out",
            open && reactionConfig
              ? "mt-4 max-h-[420px] opacity-100"
              : "mt-0 max-h-0 opacity-0"
          )}
          aria-hidden={!open}
        >
          {reactionConfig ? (
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `
                    radial-gradient(circle at 12% 0%, ${rgb(
                      accent,
                      0.09
                    )} 0%, transparent 34%),
                    radial-gradient(circle at 88% 0%, ${rgb(
                      strong,
                      0.08
                    )} 0%, transparent 30%)
                  `,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-white/92">
                      {reactionConfig.title}
                    </div>
                    <p className="mt-1 text-[12px] leading-5 text-white/56">
                      {reactionConfig.helper}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="h-9 shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[12px] font-semibold text-white/76 transition hover:bg-white/[0.07]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {reactionConfig.reasonOptions.map((reason) => {
                    const active = reasons.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => toggleReason(reason)}
                        className="rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
                        style={{
                          borderColor: active
                            ? rgb(accent, 0.24)
                            : "rgba(255,255,255,0.10)",
                          background: active
                            ? rgb(accent, 0.1)
                            : "rgba(255,255,255,0.03)",
                          color: active
                            ? "rgba(255,255,255,0.96)"
                            : "rgba(255,255,255,0.74)",
                        }}
                      >
                        {reason}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    placeholder="Anything else that feels important?"
                    className="w-full resize-none rounded-[18px] border border-white/10 bg-black/12 px-4 py-3 text-[13px] leading-5.5 text-white outline-none placeholder:text-white/28 focus:border-white/16"
                  />
                  <div className="mt-2 text-[11px] text-white/38">
                    One sentence is enough.
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="h-10 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[13px] font-semibold text-white/72 transition hover:bg-white/[0.06]"
                  >
                    Skip note
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || !draftReaction}
                    onClick={handleSubmit}
                    className="h-10 rounded-2xl px-4 text-[13px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      background: `linear-gradient(180deg, ${rgb(
                        accent,
                        0.2
                      )} 0%, ${rgb(strong, 0.1)} 100%)`,
                      border: `1px solid ${rgb(accent, 0.16)}`,
                      boxShadow: `0 12px 28px ${rgb(glow, 0.12)}`,
                    }}
                  >
                    {reactionConfig.submitLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
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

function ImpactExperienceCard({
  experience,
  profile,
  selectedReaction,
  savedReasons,
  savedNote,
  isSaving,
  onSubmitReaction,
}: {
  experience: ImpactExperience;
  profile: ImpactProfileSignals;
  selectedReaction: ImpactReaction | null;
  savedReasons: string[];
  savedNote: string;
  isSaving: boolean;
  onSubmitReaction: (payload: {
    reaction: ImpactReaction;
    reasons: string[];
    note: string;
  }) => void;
}) {
  const accent = pathAccent(experience);
  const atmosphere = getImpactAtmosphere(experience, accent);

  const title = extractCardField(experience, "title");
  const signalStrength = getSignalStrength(experience, profile);
  const opportunities = extractImpactOpportunities(experience);
  const summary = buildAgenticSummary(experience);

  const [showSignalHelp, setShowSignalHelp] = React.useState(false);

  return (
    <article
      className="group relative mx-auto w-full max-w-5xl overflow-hidden rounded-[30px] border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5 lg:p-6"
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
          <ImpactGlyph title={title} accent={atmosphere.border} />

          <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[24px] lg:text-[25px]">
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

        <ImpactQuickCheckCard
          accent={atmosphere.border}
          strong={atmosphere.topGlow}
          glow={atmosphere.futureGlow}
          selectedReaction={selectedReaction}
          initialReasons={savedReasons}
          initialNote={savedNote}
          isSaving={isSaving}
          onSubmit={onSubmitReaction}
        />

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

        <ImpactPathForwardSection
          experience={experience}
          atmosphere={atmosphere}
        />
      </div>
    </article>
  );
}

function ImpactIntroPanel({ firstName }: { firstName: string | null }) {
  const opening = getImpactAgenticOpening(firstName);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:px-5 sm:py-6 lg:mt-6 lg:px-7 lg:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(16,185,129,0.14),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(110,231,183,0.10),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />

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

      <div className="relative max-w-4xl pr-0 sm:pr-20 lg:pr-24">
        <SectionKicker>Impact</SectionKicker>

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
  const [savingSlug, setSavingSlug] = React.useState<string | null>(null);

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

  function handleSubmitReaction(
    experience: ImpactExperience,
    payload: {
      reaction: ImpactReaction;
      reasons: string[];
      note: string;
    }
  ) {
    setSavingSlug(experience.slug);

    const next = saveImpactReactionFeedback({
      slug: experience.slug,
      reaction: payload.reaction,
      reasons: payload.reasons,
      note: payload.note,
    });

    setReactions(next);
    setSavingSlug(null);
  }

  return (
    <div className={pagePadding()}>
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-5 sm:py-5 lg:px-7 lg:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(16,185,129,0.12),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(110,231,183,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

          <div className="relative">
            <h1 className="text-[34px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[42px] lg:text-[50px]">
              Explore
            </h1>
            <p className="mt-1 text-[14px] leading-[1.45] text-white/62 sm:text-[15px] lg:text-[16px]">
              How I could make real impact
            </p>

            <ExploreLaneTabs
              lanes={EXPLORE_LANES}
              activeClassName="border-emerald-300/30 bg-emerald-300/[0.12] text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.06)]"
            />
          </div>
        </section>

        <ImpactIntroPanel firstName={profile.firstName} />

        <section className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
          {visibleExperiences.map((experience) => {
            const savedFeedback = reactions.feedbackBySlug?.[experience.slug];
            const selectedReaction = reactions.dismissed.includes(experience.slug)
              ? "dismissed"
              : reactions.liked.includes(experience.slug)
              ? "liked"
              : reactions.maybe.includes(experience.slug)
              ? "maybe"
              : null;

            return (
              <ImpactExperienceCard
                key={experience.id}
                experience={experience}
                profile={profile}
                selectedReaction={selectedReaction}
                savedReasons={savedFeedback?.reasons ?? []}
                savedNote={savedFeedback?.note ?? ""}
                isSaving={savingSlug === experience.slug}
                onSubmitReaction={(payload) =>
                  handleSubmitReaction(experience, payload)
                }
              />
            );
          })}

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