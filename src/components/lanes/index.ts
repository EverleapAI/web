// src/components/career/lanes/index.ts

import type { StepperLaneId } from "@/components/career/stepperTypes";
import type { StepperLane } from "./productUxLane";

import { PRODUCT_UX_LANE } from "./productUxLane";

/**
 * Central registry for all career lanes.
 * Add new lanes here as Everleap grows.
 */
export const CAREER_LANES: Record<StepperLaneId, StepperLane> = {
  productUx: PRODUCT_UX_LANE,

  // placeholders – wire these later
  healthHumanSupport: PRODUCT_UX_LANE,
  educationCommunityPrograms: PRODUCT_UX_LANE,
  independentBuilder: PRODUCT_UX_LANE,
};

/**
 * Safe accessor
 */
export function getCareerLane(laneId: StepperLaneId): StepperLane {
  return CAREER_LANES[laneId] ?? PRODUCT_UX_LANE;
}
