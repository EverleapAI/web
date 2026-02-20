// src/app/main/content/insightLenses/types.ts

export type InsightLensId = "superpowers" | "timeTwin";

export type InsightLensDefinition = {
  id: InsightLensId;

  /** small label shown in the chip */
  kicker: string;

  /** main title shown in the card header */
  title: string;

  /** 1-line tease under the title */
  subtitle?: string;

  /** short narrative */
  body: string;

  /** optional bullets */
  bullets?: string[];

  /** optional quote */
  quote?: string;
};
