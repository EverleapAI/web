// apps/web/src/app/(app)/main/explore/learning/_data/learningPaths.ts

import { SYSTEMS_CODE_PATH } from "./mock/systemsCodePath";
import { DESIGN_MEDIA_PATH } from "./mock/designMediaPath";
import { HUMAN_BEHAVIOR_LEADERSHIP_PATH } from "./mock/humanBehaviorLeadershipPath";
import { BIO_HEALTH_PATH } from "./mock/bioHealthPath";
import { BUSINESS_INNOVATION_PATH } from "./mock/businessInnovationPath";
import { ENVIRONMENT_FIELD_SCIENCE_PATH } from "./mock/environmentFieldSciencePath";

import type { LearningPathContent } from "./learningPathSchema";

export {
  SYSTEMS_CODE_PATH,
  DESIGN_MEDIA_PATH,
  HUMAN_BEHAVIOR_LEADERSHIP_PATH,
  BIO_HEALTH_PATH,
  BUSINESS_INNOVATION_PATH,
  ENVIRONMENT_FIELD_SCIENCE_PATH,
};

export const LEARNING_PATHS: LearningPathContent[] = [
  SYSTEMS_CODE_PATH,
  DESIGN_MEDIA_PATH,
  HUMAN_BEHAVIOR_LEADERSHIP_PATH,
  BIO_HEALTH_PATH,
  BUSINESS_INNOVATION_PATH,
  ENVIRONMENT_FIELD_SCIENCE_PATH,
];

const LEARNING_PATH_ALIAS_ENTRIES = [
  ["systems-code", "systems-code"],
  ["systems", "systems-code"],
  ["code", "systems-code"],
  ["coding", "systems-code"],
  ["programming", "systems-code"],
  ["software", "systems-code"],
  ["automation", "systems-code"],
  ["robotics", "systems-code"],
  ["computational-thinking", "systems-code"],

  ["design-media", "design-media"],
  ["design", "design-media"],
  ["media", "design-media"],
  ["visual-design", "design-media"],
  ["creative-media", "design-media"],

  ["human-behavior-leadership", "human-behavior-leadership"],
  ["leadership", "human-behavior-leadership"],
  ["psychology", "human-behavior-leadership"],
  ["mentorship", "human-behavior-leadership"],
  ["coaching", "human-behavior-leadership"],

  ["bio-health", "bio-health"],
  ["biology", "bio-health"],
  ["health", "bio-health"],
  ["health-science", "bio-health"],
  ["human-biology", "bio-health"],

  ["business-innovation", "business-innovation"],
  ["business", "business-innovation"],
  ["innovation", "business-innovation"],
  ["entrepreneurship", "business-innovation"],
  ["startup", "business-innovation"],

  ["environment-field-science", "environment-field-science"],
  ["environment", "environment-field-science"],
  ["ecology", "environment-field-science"],
  ["climate", "environment-field-science"],
  ["environmental-science", "environment-field-science"],
] as const;

const LEARNING_PATH_ALIAS_MAP = new Map<string, string>(
  LEARNING_PATH_ALIAS_ENTRIES
);

function normalizeLearningPathKey(value: string) {
  return value.trim().toLowerCase();
}

function canonicalizeLearningPathKey(idOrSlug: string) {
  const normalized = normalizeLearningPathKey(idOrSlug);
  return LEARNING_PATH_ALIAS_MAP.get(normalized) ?? normalized;
}

export const LEARNING_PATH_IDS = LEARNING_PATHS.map((path) => path.id);

export const LEARNING_PATH_SLUGS = LEARNING_PATHS.map((path) => path.slug);

export const LEARNING_PATH_KEYS = Array.from(
  new Set([
    ...LEARNING_PATH_IDS.map((value) => normalizeLearningPathKey(value)),
    ...LEARNING_PATH_SLUGS.map((value) => normalizeLearningPathKey(value)),
    ...Array.from(LEARNING_PATH_ALIAS_MAP.keys()),
  ])
);

export function getAllLearningPaths() {
  return LEARNING_PATHS;
}

export function getLearningPath(idOrSlug: string) {
  const canonical = canonicalizeLearningPathKey(idOrSlug);

  return LEARNING_PATHS.find(
    (path) =>
      normalizeLearningPathKey(path.id) === canonical ||
      normalizeLearningPathKey(path.slug) === canonical
  );
}

export function requireLearningPath(idOrSlug: string) {
  const path = getLearningPath(idOrSlug);

  if (!path) {
    throw new Error(`Unknown learning path: ${idOrSlug}`);
  }

  return path;
}

export function getLearningBranch(
  pathIdOrSlug: string,
  branchSlug: string
) {
  const path = requireLearningPath(pathIdOrSlug);
  const normalizedBranchSlug = branchSlug.trim().toLowerCase();

  return path.branches.find(
    (branch) => branch.slug.trim().toLowerCase() === normalizedBranchSlug
  );
}

export function requireLearningBranch(
  pathIdOrSlug: string,
  branchSlug: string
) {
  const branch = getLearningBranch(pathIdOrSlug, branchSlug);

  if (!branch) {
    throw new Error(
      `Unknown branch "${branchSlug}" for learning path "${pathIdOrSlug}"`
    );
  }

  return branch;
}