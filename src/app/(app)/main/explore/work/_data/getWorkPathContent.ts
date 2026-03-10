// apps/web/src/app/(app)/main/explore/work/_data/getWorkPathContent.ts

import type { WorkPathContent, WorkPathSpecialty } from "./workPathSchema";
import { requireWorkPath, requireWorkSpecialty } from "./workPaths";

/* =============================================================================
   Public resolver contract
============================================================================= */

export function getWorkPathContent(pathIdOrSlug: string): WorkPathContent {
  return requireWorkPath(pathIdOrSlug);
}

export function getWorkSpecialtyContent(
  pathIdOrSlug: string,
  specialtySlug: string
): WorkPathSpecialty {
  return requireWorkSpecialty(pathIdOrSlug, specialtySlug);
}

/* =============================================================================
   Future AI-ready notes
============================================================================= */

/**
 * This file acts as the resolver layer between route pages and the content
 * registry. Route pages should depend on this file rather than importing
 * the registry directly.
 *
 * Later this layer can:
 *
 * • fetch AI-generated path content
 * • merge AI output with local fallback data
 * • cache responses
 * • personalize by user profile
 * • validate schema
 *
 * without requiring changes to the route components.
 */