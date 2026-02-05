// src/app/main/insights/domain/types.ts

export type InsightsLens =
  | "all"
  | "motivations"
  | "strengths"
  | "skills"
  | "doppelganger";

export type InsightSource = "motivations" | "strengths" | "skills" | "mixed";

export type CorePattern = {
  id: string;
  title: string;
  summary: string;
  evidence: string[]; // 1–3 lines
  source: InsightSource;
  confidence: number; // 0..1
};

export type Implication = {
  id: string;
  text: string;
  sourcePatterns: string[];
  confidence: number; // 0..1
};

export type GrowthEdge = {
  id: string;
  title: string;
  description: string;
  fix: string;
  why?: string;
  source: InsightSource;
  confidence: number; // 0..1
};

export type DirectionTile = {
  id: string;
  title: string;
  rationale: string;
  href: string;
  sourcePatterns: string[];
};

export type Doppelganger = {
  id: string;
  name: string;
  era?: string;
  framing: string;
  alignments: Array<{ title: string; text: string }>;
  differences: Array<{ title: string; text: string }>;
  borrow: Array<{ title: string; text: string }>;
};

export type NextExperiment = {
  id: string;
  title: string;
  text: string;
  href?: string;
};

export type InsightsViewModel = {
  lens: InsightsLens;
  narrative: string[];
  corePatterns: CorePattern[];
  implications: Implication[];
  edges: GrowthEdge[];
  directions: DirectionTile[];
  doppelganger?: Doppelganger;
  nextExperiments: NextExperiment[];
};
