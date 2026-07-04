// apps/web/src/app/(app)/main/explore/_lib/scorePath.ts
//
// Generic client-side signal scorer over the unified ExplorePath.
// Phase A stand-in for the Phase B match layer (embedding retrieval).
// Same keyword-overlap approach the lane pages used, generalized to one function.

import type { ExplorePath } from "../_data/exploreSchema";
import {
  splitIntoUsefulTokens,
  type UserProfileSignals,
} from "./exploreProfile";

function buildPathKeywordSet(path: ExplorePath): string[] {
  const parts = [
    path.title,
    path.card.title,
    path.card.hook,
    path.card.description,
    path.overview.summary,
    path.overview.traitChips.map((c) => c.label).join(" "),
    path.overview.fitSignals.map((s) => s.label).join(" "),
  ];
  return Array.from(new Set(splitIntoUsefulTokens(parts.join(" "))));
}

/** 0–100 fit estimate for deck ordering + the signal meter. */
export function scorePath(
  path: ExplorePath,
  profile: UserProfileSignals
): number {
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

  if (!profileText.trim()) return 67;

  let score = 52;
  let matches = 0;
  for (const keyword of keywords) {
    if (profileText.includes(keyword)) matches += 1;
  }
  score += Math.min(matches * 5, 26);

  const motivationText = profile.motivations.join(" ").toLowerCase();
  const strengthText = profile.strengths.join(" ").toLowerCase();
  const skillText = profile.skills.join(" ").toLowerCase();

  if (keywords.some((k) => motivationText.includes(k))) score += 5;
  if (keywords.some((k) => strengthText.includes(k))) score += 5;
  if (keywords.some((k) => skillText.includes(k))) score += 4;

  if (profile.knowsDirection) score -= 2;

  return Math.max(48, Math.min(94, score));
}

export function signalLabel(score: number): string {
  if (score >= 82) return "Very strong";
  if (score >= 70) return "Strong";
  if (score >= 58) return "Worth exploring";
  return "Possible fit";
}

/** Rank + take the top N paths for a lane deck. */
export function rankPaths(
  paths: ExplorePath[],
  profile: UserProfileSignals,
  limit = 4
): { path: ExplorePath; score: number }[] {
  return paths
    .map((path, index) => ({ path, index, score: scorePath(path, profile) }))
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.index - b.index))
    .slice(0, limit)
    .map(({ path, score }) => ({ path, score }));
}
