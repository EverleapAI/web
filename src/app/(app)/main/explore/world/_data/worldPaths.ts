// apps/web/src/app/(app)/main/explore/world/_data/worldPaths.ts

import type { WorldPathContent } from "./worldPathSchema";

import { GLOBAL_CULTURES_PATH } from "./mock/globalCulturesPath";
import { LANGUAGES_TRANSLATION_PATH } from "./mock/languagesTranslationPath";
import { GLOBAL_HEALTH_PATH } from "./mock/globalHealthPath";
import { SUSTAINABLE_DEVELOPMENT_PATH } from "./mock/sustainableDevelopmentPath";
import { ENVIRONMENT_EXPEDITIONS_PATH } from "./mock/environmentExpeditionsPath";
import { INTERNATIONAL_POLICY_PATH } from "./mock/internationalPolicyPath";

/**
 * Ordered intentionally for a better "explore" feel:
 * - start broad / human
 * - move into communication
 * - then impact + systems
 * - then environment + policy
 */
export const WORLD_PATHS: WorldPathContent[] = [
  GLOBAL_CULTURES_PATH,
  LANGUAGES_TRANSLATION_PATH,
  GLOBAL_HEALTH_PATH,
  SUSTAINABLE_DEVELOPMENT_PATH,
  ENVIRONMENT_EXPEDITIONS_PATH,
  INTERNATIONAL_POLICY_PATH,
];

export function getWorldPath(pathId: string): WorldPathContent | undefined {
  return WORLD_PATHS.find(
    (path) => path.id === pathId || path.slug === pathId
  );
}

export function requireWorldPath(pathId: string): WorldPathContent {
  const path = getWorldPath(pathId);

  if (!path) {
    throw new Error(`World path not found for pathId: ${pathId}`);
  }

  return path;
}