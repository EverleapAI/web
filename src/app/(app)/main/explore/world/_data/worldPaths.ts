// apps/web/src/app/(app)/main/explore/world/_data/worldPaths.ts

import type { WorldPathContent } from "./worldPathSchema";

import { ENVIRONMENT_EXPEDITIONS_PATH } from "./mock/environmentExpeditionsPath";
import { GLOBAL_CULTURES_PATH } from "./mock/globalCulturesPath";
import { GLOBAL_HEALTH_PATH } from "./mock/globalHealthPath";
import { INTERNATIONAL_POLICY_PATH } from "./mock/internationalPolicyPath";
import { LANGUAGES_TRANSLATION_PATH } from "./mock/languagesTranslationPath";
import { SUSTAINABLE_DEVELOPMENT_PATH } from "./mock/sustainableDevelopmentPath";

export const WORLD_PATHS: WorldPathContent[] = [
  GLOBAL_CULTURES_PATH,
  GLOBAL_HEALTH_PATH,
  ENVIRONMENT_EXPEDITIONS_PATH,
  INTERNATIONAL_POLICY_PATH,
  SUSTAINABLE_DEVELOPMENT_PATH,
  LANGUAGES_TRANSLATION_PATH,
];

export function getWorldPath(pathId: string): WorldPathContent | undefined {
  return WORLD_PATHS.find((path) => path.id === pathId || path.slug === pathId);
}

export function requireWorldPath(pathId: string): WorldPathContent {
  const path = getWorldPath(pathId);

  if (!path) {
    throw new Error(`World path not found for pathId: ${pathId}`);
  }

  return path;
}