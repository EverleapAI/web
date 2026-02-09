// src/app/main/content/insightLenses/index.ts
import type { InsightLensDefinition, InsightLensId } from "./types";
import { SUPERPOWERS_LENS } from "./superpowers";
import { TIME_TWIN_LENS } from "./timeTwin";

export function getInsightLens(id: InsightLensId): InsightLensDefinition {
  if (id === "superpowers") return SUPERPOWERS_LENS;
  return TIME_TWIN_LENS;
}

export type { InsightLensDefinition, InsightLensId };
