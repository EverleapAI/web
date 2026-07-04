// apps/web/src/app/(app)/main/explore/_lib/exploreProfile.ts
//
// The single source of truth for reading the user's signal from localStorage.
// This logic was previously copy-pasted into all five lane landing pages; it now
// lives here once. In Phase B the read moves server-side (DB), but the shape it
// returns stays the same so the render engines don't change.

"use client";

import * as React from "react";

export type UserProfileSignals = {
  firstName: string | null;
  knowsDirection: boolean;
  hasSomeIdeas: boolean;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
  statedCareerGoal: string | null;
  hasQuestionSignal: boolean;
  postPlans: string[];
  certainty: "strong" | "kinda" | "no_clue" | null;
};

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";

export const EMPTY_PROFILE: UserProfileSignals = {
  firstName: null,
  knowsDirection: false,
  hasSomeIdeas: false,
  motivations: [],
  strengths: [],
  skills: [],
  fullText: "",
  statedCareerGoal: null,
  hasQuestionSignal: false,
  postPlans: [],
  certainty: null,
};

const STOP_WORDS = new Set([
  "about", "after", "also", "and", "are", "around", "because", "been", "being",
  "between", "both", "build", "could", "does", "doing", "each", "even", "feel",
  "from", "good", "have", "into", "just", "kind", "like", "make", "more", "most",
  "much", "need", "only", "over", "really", "seem", "some", "something", "still",
  "that", "their", "them", "then", "there", "these", "they", "this", "those",
  "through", "want", "with", "work", "would", "your", "you",
]);

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

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function splitIntoUsefulTokens(value: string): string[] {
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
    for (const item of value) collectStringsDeep(item, bucket, depth + 1, maxDepth);
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
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some((item) => hasAnsweredQuestions(item));
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((child) =>
      hasAnsweredQuestions(child)
    );
  }
  if (typeof value === "boolean") return value;
  return false;
}

export function readStoredProfileSignals(): UserProfileSignals {
  if (typeof window === "undefined") return EMPTY_PROFILE;

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
        parsed.name, parsed.firstName, parsed.firstname, parsed.first_name,
        profile?.firstName, profile?.name, answers?.firstName, answers?.name,
      ];
      if (!firstName) {
        for (const value of nameCandidates) {
          const found = asString(value);
          if (found) { firstName = found.split(" ")[0] ?? null; break; }
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
        if (!statedCareerGoal && onboardingIdea) statedCareerGoal = onboardingIdea;

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

      const careerGoalCandidates = [
        parsed.certaintyIdea, parsed.careerGoal, parsed.dreamJob, parsed.futureJob,
        parsed.whatWantToBe, parsed.wantToBe, parsed.jobGoal,
        profile?.careerGoal, profile?.dreamJob,
        answers?.careerGoal, answers?.dreamJob, answers?.futureJob,
        answers?.whatWantToBe, answers?.wantToBe, answers?.oneIdea,
        answers?.someIdea, answers?.certaintyIdea,
      ];
      if (!statedCareerGoal) {
        for (const candidate of careerGoalCandidates) {
          const text = asString(candidate);
          if (text) { statedCareerGoal = text; break; }
        }
      }

      const motivationSources = [parsed.motivations, parsed.motivation, profile?.motivations, answers?.motivations, answers?.motivation];
      const strengthSources = [parsed.strengths, parsed.strength, profile?.strengths, answers?.strengths, answers?.strength];
      const skillSources = [parsed.skills, parsed.skill, profile?.skills, answers?.skills, answers?.skill];

      for (const source of motivationSources) collectStringsDeep(source, motivations);
      for (const source of strengthSources) collectStringsDeep(source, strengths);
      for (const source of skillSources) collectStringsDeep(source, skills);
      collectStringsDeep(parsed, allStrings);

      const rawJoined = JSON.stringify(parsed).toLowerCase();
      if (!knowsDirection && (rawJoined.includes('"certainty":"strong"') || rawJoined.includes("i know exactly what i want") || rawJoined.includes("i know what i want to do"))) {
        knowsDirection = true;
      }
      if (!hasSomeIdeas && (rawJoined.includes('"certainty":"kinda"') || rawJoined.includes("some ideas") || rawJoined.includes("a few ideas"))) {
        hasSomeIdeas = true;
      }
      if (!certainty && rawJoined.includes('"certainty":"no_clue"')) certainty = "no_clue";
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
    hasQuestionSignal,
    postPlans,
    certainty,
  };
}

type ServerProfileSignals = {
  firstName: string | null;
  motivations: string[];
  strengths: string[];
  skills: string[];
  fullText: string;
  hasSignal: boolean;
};

/**
 * Client hook: reads the stored profile immediately (fast first paint), then
 * overlays the server's truth. Explore's signal used to come only from browser
 * localStorage, so a logout / new device / cleared storage left every path and
 * lane at a flat default score. Now, for a logged-in user, the server's own
 * story answers (name + motivations/strengths/skills) take over when present.
 */
export function useExploreProfile(): {
  profile: UserProfileSignals | null;
  isReady: boolean;
} {
  const [profile, setProfile] = React.useState<UserProfileSignals | null>(null);
  React.useEffect(() => {
    setProfile(readStoredProfileSignals());

    let active = true;
    fetch("/api/guidance/explore-profile", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active || !d?.ok || !d.profile) return;
        const s = d.profile as ServerProfileSignals;
        setProfile((prev) => {
          const base = prev ?? EMPTY_PROFILE;
          return {
            ...base,
            firstName: s.firstName ?? base.firstName,
            motivations: s.motivations?.length ? s.motivations : base.motivations,
            strengths: s.strengths?.length ? s.strengths : base.strengths,
            skills: s.skills?.length ? s.skills : base.skills,
            fullText: s.fullText || base.fullText,
            hasQuestionSignal: Boolean(s.hasSignal) || base.hasQuestionSignal,
          };
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return { profile, isReady: profile !== null };
}
