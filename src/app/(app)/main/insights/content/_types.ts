// src/app/main/insights/content/_types.ts
import type { ReactNode } from "react";

/* ============================================================
   Shared Insights types (used by lane facades)
   ============================================================ */

export type InsightLayout =
  | "narrative"
  | "split"
  | "steps"
  | "signalsHero"
  | "grid";

export type InsightTone =
  | "warm"
  | "direct"
  | "analytical"
  | "reflective"
  | "playful";

export type TraitCardVariant =
  | "micro"
  | "quote"
  | "contrast"
  | "checklist"
  | "story"
  | "warning"
  | "exercise";

export type TraitCard = {
  id: string;
  title: string;
  short: string;
  long?: string;
  icon?: string;

  variant?: TraitCardVariant;
  bullets?: string[];
  quote?: string;
  prompt?: string;
  contrast?: { do: string; avoid: string };
};

export type NextMove = {
  id: string;
  title: string;
  blurb: string;
  timebox?: string;
  difficulty?: "easy" | "medium" | "spicy";
};

export type DeepDiveSection = { h: string; p: string };

export type DeepDive = {
  title: string;
  sections: DeepDiveSection[];
};

export type YouMapAreaId =
  | "motivations"
  | "strengths"
  | "skills"
  | "doppelganger"
  | "friends"
  | "family";

export type YouMapArea = {
  id: YouMapAreaId;
  label: string;
  chip: string;
  icon: ReactNode;
  glowClass: string;

  layout?: InsightLayout;
  tone?: InsightTone;

  summary: string;
  hint: string;
  coachRead: string;
  signals: string[];
  about: string;

  nextMoves: NextMove[];
  deepDive: DeepDive;

  cards: TraitCard[];
};
