// apps/web/src/app/(app)/main/explore/impact/_data/impactPaths.ts

import type { ImpactPathContent } from "./impactPathSchema";

import { ADVOCACY_CIVIC_ACTION_PATH } from "./mock/advocacyCivicActionPath";
import { COMMUNITY_LEADERSHIP_PATH } from "./mock/communityLeadershipPath";
import { EDUCATION_MENTORSHIP_PATH } from "./mock/educationMentorshipPath";
import { ENVIRONMENT_STEWARDSHIP_PATH } from "./mock/environmentStewardshipPath";
import { HEALTH_SUPPORT_PATH } from "./mock/healthSupportPath";
import { LOCAL_SERVICE_PATH } from "./mock/localServicePath";

export const IMPACT_PATHS: ImpactPathContent[] = [
  COMMUNITY_LEADERSHIP_PATH,
  LOCAL_SERVICE_PATH,
  ADVOCACY_CIVIC_ACTION_PATH,
  EDUCATION_MENTORSHIP_PATH,
  HEALTH_SUPPORT_PATH,
  ENVIRONMENT_STEWARDSHIP_PATH,
];

export function requireImpactPath(slug: string): ImpactPathContent {
  const path = IMPACT_PATHS.find((item) => item.slug === slug);

  if (!path) {
    throw new Error(`Impact path not found for slug: ${slug}`);
  }

  return path;
}