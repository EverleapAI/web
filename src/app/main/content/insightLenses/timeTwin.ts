// src/app/main/content/insightLenses/timeTwin.ts
import type { InsightLensDefinition } from "./types";

/**
 * Source inspiration: “Meet Wallace Carothers” section from the legacy Everleap report. :contentReference[oaicite:3]{index=3}
 * (We’ll rename/replace this per user when the real generator lands.)
 */
export const TIME_TWIN_LENS: InsightLensDefinition = {
  id: "timeTwin",
  kicker: "Time Twin",
  title: "Meet Wallace Carothers",
  subtitle: "A historical mirror — creative + technical + real-world impact.",
  body:
    "Wallace Carothers was a chemist who helped create nylon — one of those inventions that quietly changed everyday life. " +
    "What makes him a good “Time Twin” here is the mix: creativity, deep technical thinking, and translating ideas into something real.",
  bullets: [
    "Innovation + creativity: turning curiosity into something new.",
    "Technical skill: going deep on the “how,” not just the “what.”",
    "Impact: building things that matter outside the lab.",
  ],
  quote: "It is not simple nor easy nor quick to get from the laboratory to the factory.",
};
