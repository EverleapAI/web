// src/components/career/laneAliases.ts
import type { StepperLaneId } from "./stepperTypes";

/**
 * Allow old/short lane ids in URLs (product/health/social/builder)
 * while keeping canonical ids everywhere else.
 */
const ALIASES: Record<string, StepperLaneId> = {
  // legacy short ids
  product: "productUx",
  health: "healthHumanSupport",
  social: "educationCommunityPrograms",
  builder: "independentBuilder",

  // canonical ids pass through
  productUx: "productUx",
  healthHumanSupport: "healthHumanSupport",
  educationCommunityPrograms: "educationCommunityPrograms",
  independentBuilder: "independentBuilder",
};

export function resolveLaneId(raw: string | undefined | null): StepperLaneId | null {
  if (!raw) return null;
  return ALIASES[raw] ?? null;
}
