// apps/web/src/app/(app)/main/explore/world/_data/worldPathSchema.ts

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type WorldPathEnergy =
  | "adventure"
  | "high-energy"
  | "grounded"
  | "reflective"
  | "builder"
  | "people"
  | "creative";

export type WorldPathActionType =
  | "project"
  | "experiment"
  | "visit"
  | "join"
  | "research"
  | "conversation"
  | "plan";

export type WorldOpportunityMode =
  | "local"
  | "virtual"
  | "hybrid"
  | "travel";

export type WorldTheme = {
  tone: string;
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
  surfaceLabel: string;
};

export type WorldCard = {
  title: string;
  hook: string;
  description: string;
};

export type WorldHero = {
  eyebrow: string;
  title: string;
  hook: string;
  summary: string;
  whyItPullsYouIn: string[];
};

export type WorldTraitChip = {
  id: string;
  label: string;
};

export type WorldFitSignal = {
  id: string;
  label: string;
  score: number;
  explanation: string;
};

export type WorldBranchPreview = {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  whyItCouldFit: string;
  energy: WorldPathEnergy;
};

export type WorldBranch = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whatYouActuallyExplore: string[];
  skillsThatGrowHere: string[];
  starterProjects: string[];
  atmosphere: string;
};

export type WorldAction = {
  id: string;
  title: string;
  type: WorldPathActionType;
  effort: "light" | "medium" | "stretch";
  timeEstimate: string;
  whyThisMatters: string;
  instructions: string[];
};

export type WorldFeelingMoment = {
  id: string;
  title: string;
  body: string;
};

export type WorldHowItFeels = {
  title: string;
  summary: string;
  moments: WorldFeelingMoment[];
};

export type WorldGrowthStage = {
  id: string;
  label: string;
  timeframe: string;
  summary: string;
  signalsOfProgress: string[];
};

export type WorldGrowthPath = {
  title: string;
  summary: string;
  stages: WorldGrowthStage[];
};

export type WorldOpportunity = {
  id: string;
  title: string;
  mode: WorldOpportunityMode;
  provider: string;
  summary: string;
  whyItHelps: string;
  href: string;
  formatLabel: string;
};

export type WorldOpportunityGroup = {
  id: string;
  title: string;
  description: string;
  items: WorldOpportunity[];
};

export type WorldNextSteps = {
  title: string;
  summary: string;
  actions: WorldAction[];
  opportunityGroups: WorldOpportunityGroup[];
};

export type WorldPathContent = {
  id: string;
  slug: string;
  lane: "world";

  theme: WorldTheme;
  card: WorldCard;
  hero: WorldHero;

  traitChips: WorldTraitChip[];
  fitSignals: WorldFitSignal[];

  branchPreviews: WorldBranchPreview[];
  branches: WorldBranch[];

  tryNow: {
    title: string;
    summary: string;
    actions: WorldAction[];
  };

  howItFeels: WorldHowItFeels;
  growthPath: WorldGrowthPath;
  nextSteps: WorldNextSteps;
};