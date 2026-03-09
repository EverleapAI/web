import {
  TIME_TWINS,
  type MotivationId,
  type SkillTag,
  type StrengthSignalId,
  type ThemeTag,
  type TimeTwin,
  type TimeTwinMatchProfile,
} from "../content/timeTwins";

export type TimeTwinUserProfile = {
  motivations: Partial<Record<MotivationId, number>>;
  signals: Partial<Record<StrengthSignalId, number>>;
  skills: SkillTag[];
  themes: ThemeTag[];
};

export type TimeTwinScoreBreakdown = {
  motivationScore: number;
  signalScore: number;
  skillScore: number;
  themeScore: number;
  totalScore: number;
};

export type RankedTimeTwin = {
  twin: TimeTwin;
  score: number;
  breakdown: TimeTwinScoreBreakdown;
};

const MOTIVATION_WEIGHT = 0.35;
const SIGNAL_WEIGHT = 0.25;
const SKILL_WEIGHT = 0.25;
const THEME_WEIGHT = 0.15;

const SKILL_MATCH_POINTS = 1;
const THEME_MATCH_POINTS = 1;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function normalizeTextKey(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueNormalized<T extends string>(values: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const value of values) {
    const key = normalizeTextKey(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }

  return out;
}

function scoreWeightedVector<K extends string>(
  user: Partial<Record<K, number>>,
  target: Partial<Record<K, number>>
): number {
  const entries = Object.entries(target) as Array<[K, number]>;
  if (!entries.length) return 0;

  let weightedSum = 0;
  let weightTotal = 0;

  for (const [key, targetWeightRaw] of entries) {
    const targetWeight = clamp01(targetWeightRaw);
    if (targetWeight <= 0) continue;

    const userValue = clamp01(user[key] ?? 0);
    weightedSum += userValue * targetWeight;
    weightTotal += targetWeight;
  }

  if (weightTotal <= 0) return 0;
  return clamp01(weightedSum / weightTotal);
}

function scoreTagOverlap<T extends string>(
  userTags: T[],
  targetTags: T[],
  pointsPerMatch: number
): number {
  const target = uniqueNormalized(targetTags);
  if (!target.length) return 0;

  const userSet = new Set(uniqueNormalized(userTags).map(normalizeTextKey));

  let matches = 0;
  for (const tag of target) {
    if (userSet.has(normalizeTextKey(tag))) matches += 1;
  }

  const raw = (matches * pointsPerMatch) / (target.length * pointsPerMatch);
  return clamp01(raw);
}

export function scoreOneTimeTwin(
  userProfile: TimeTwinUserProfile,
  twin: TimeTwin
): RankedTimeTwin {
  const matchProfile: TimeTwinMatchProfile = twin.matchProfile;

  const motivationScore = scoreWeightedVector(
    userProfile.motivations,
    matchProfile.motivations
  );

  const signalScore = scoreWeightedVector(
    userProfile.signals,
    matchProfile.signals
  );

  const skillScore = scoreTagOverlap(
    userProfile.skills,
    matchProfile.skills,
    SKILL_MATCH_POINTS
  );

  const themeScore = scoreTagOverlap(
    userProfile.themes,
    matchProfile.themes,
    THEME_MATCH_POINTS
  );

  const totalScore =
    motivationScore * MOTIVATION_WEIGHT +
    signalScore * SIGNAL_WEIGHT +
    skillScore * SKILL_WEIGHT +
    themeScore * THEME_WEIGHT;

  const breakdown: TimeTwinScoreBreakdown = {
    motivationScore,
    signalScore,
    skillScore,
    themeScore,
    totalScore: clamp01(totalScore),
  };

  return {
    twin,
    score: breakdown.totalScore,
    breakdown,
  };
}

export function rankTimeTwins(
  userProfile: TimeTwinUserProfile,
  twins: TimeTwin[] = TIME_TWINS
): RankedTimeTwin[] {
  return twins
    .map((twin) => scoreOneTimeTwin(userProfile, twin))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.twin.name.localeCompare(b.twin.name);
    });
}

export function getTopTimeTwin(
  userProfile: TimeTwinUserProfile,
  twins: TimeTwin[] = TIME_TWINS
): RankedTimeTwin | null {
  const ranked = rankTimeTwins(userProfile, twins);
  return ranked[0] ?? null;
}

export function getAlternateTimeTwins(
  userProfile: TimeTwinUserProfile,
  count = 3,
  twins: TimeTwin[] = TIME_TWINS
): RankedTimeTwin[] {
  const ranked = rankTimeTwins(userProfile, twins);
  return ranked.slice(1, 1 + Math.max(0, count));
}

export function getTimeTwinSelection(
  userProfile: TimeTwinUserProfile,
  alternateCount = 3,
  twins: TimeTwin[] = TIME_TWINS
): {
  primary: RankedTimeTwin | null;
  alternates: RankedTimeTwin[];
  ranked: RankedTimeTwin[];
} {
  const ranked = rankTimeTwins(userProfile, twins);

  return {
    primary: ranked[0] ?? null,
    alternates: ranked.slice(1, 1 + Math.max(0, alternateCount)),
    ranked,
  };
}