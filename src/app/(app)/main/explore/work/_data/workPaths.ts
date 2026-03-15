// apps/web/src/app/(app)/main/explore/work/_data/workPaths.ts

import { GAME_DESIGNER_PATH } from "./mock/gameDesignerPath";
import { SOFTWARE_DEVELOPER_PATH } from "./mock/softwareDeveloperPath";
import { FILM_VIDEO_PRODUCER_PATH } from "./mock/filmVideoProducerPath";
import { TEACHER_PATH } from "./mock/teacherPath";
import { GRAPHIC_DESIGNER_PATH } from "./mock/graphicDesignerPath";
import { PHYSICAL_THERAPIST_PATH } from "./mock/physicalTherapistPath";
import type { WorkPathContent } from "./workPathSchema";
import {
  getWorkPathById,
  getWorkSpecialtyBySlug,
} from "./workPathSchema";

export {
  GAME_DESIGNER_PATH,
  SOFTWARE_DEVELOPER_PATH,
  FILM_VIDEO_PRODUCER_PATH,
  TEACHER_PATH,
  GRAPHIC_DESIGNER_PATH,
  PHYSICAL_THERAPIST_PATH,
};

export const WORK_PATHS: WorkPathContent[] = [
  GAME_DESIGNER_PATH,
  SOFTWARE_DEVELOPER_PATH,
  FILM_VIDEO_PRODUCER_PATH,
  TEACHER_PATH,
  GRAPHIC_DESIGNER_PATH,
  PHYSICAL_THERAPIST_PATH,
];

const WORK_PATH_ALIAS_ENTRIES = [
  ["game-designer", "game-designer"],

  ["software-developer", "software-developer"],
  ["software-engineer", "software-developer"],
  ["developer", "software-developer"],

  ["film-video-producer", "film-video-producer"],
  ["film-producer", "film-video-producer"],
  ["video-producer", "film-video-producer"],
  ["producer", "film-video-producer"],

  ["teacher", "teacher"],
  ["teaching", "teacher"],
  ["educator", "teacher"],

  ["graphic-designer", "graphic-designer"],
  ["designer", "graphic-designer"],
  ["visual-designer", "graphic-designer"],
  ["brand-designer", "graphic-designer"],

  ["physical-therapist", "physical-therapist"],
  ["physical-therapy", "physical-therapist"],
  ["pt", "physical-therapist"],
  ["rehab", "physical-therapist"],

  ["product-builder", "product-ux-builder"],
  ["product-ux-builder", "product-ux-builder"],
  ["health-support", "health-human-support"],
  ["health-human-support", "health-human-support"],
  ["teaching-mentorship", "teaching-mentorship"],
] as const;

const WORK_PATH_ALIAS_MAP = new Map<string, string>(WORK_PATH_ALIAS_ENTRIES);

function normalizeWorkPathKey(value: string) {
  return value.trim().toLowerCase();
}

function canonicalizeWorkPathKey(idOrSlug: string) {
  const normalized = normalizeWorkPathKey(idOrSlug);
  return WORK_PATH_ALIAS_MAP.get(normalized) ?? normalized;
}

export const WORK_PATH_IDS = WORK_PATHS.map((path) => path.id);

export const WORK_PATH_SLUGS = WORK_PATHS.map((path) => path.slug);

export const WORK_PATH_KEYS = Array.from(
  new Set([
    ...WORK_PATH_IDS.map((value) => normalizeWorkPathKey(value)),
    ...WORK_PATH_SLUGS.map((value) => normalizeWorkPathKey(value)),
    ...Array.from(WORK_PATH_ALIAS_MAP.keys()),
  ])
);

export function getAllWorkPaths() {
  return WORK_PATHS;
}

export function getWorkPath(idOrSlug: string) {
  return getWorkPathById(WORK_PATHS, canonicalizeWorkPathKey(idOrSlug));
}

export function requireWorkPath(idOrSlug: string) {
  const path = getWorkPath(idOrSlug);

  if (!path) {
    throw new Error(`Unknown work path: ${idOrSlug}`);
  }

  return path;
}

export function requireWorkSpecialty(
  pathIdOrSlug: string,
  specialtySlug: string
) {
  const path = requireWorkPath(pathIdOrSlug);
  const specialty = getWorkSpecialtyBySlug(path, specialtySlug);

  if (!specialty) {
    throw new Error(
      `Unknown specialty "${specialtySlug}" for work path "${pathIdOrSlug}"`
    );
  }

  return specialty;
}