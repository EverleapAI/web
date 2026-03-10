// apps/web/src/app/(app)/main/explore/work/_data/workPaths.ts

import { GAME_DESIGNER_PATH } from "./mock/gameDesignerPath";
import {
  getWorkPathById,
  getWorkSpecialtyBySlug,
} from "./workPathSchema";

export { GAME_DESIGNER_PATH };

export const WORK_PATHS = [GAME_DESIGNER_PATH];

export const WORK_PATH_IDS = WORK_PATHS.map((path) => path.id);

export const WORK_PATH_SLUGS = WORK_PATHS.map((path) => path.slug);

export function requireWorkPath(idOrSlug: string) {
  const path = getWorkPathById(WORK_PATHS, idOrSlug);

  if (!path) {
    throw new Error(`Unknown work path: ${idOrSlug}`);
  }

  return path;
}

export function requireWorkSpecialty(pathIdOrSlug: string, specialtySlug: string) {
  const path = requireWorkPath(pathIdOrSlug);
  const specialty = getWorkSpecialtyBySlug(path, specialtySlug);

  if (!specialty) {
    throw new Error(
      `Unknown specialty "${specialtySlug}" for work path "${pathIdOrSlug}"`
    );
  }

  return specialty;
}