// apps/web/src/app/(app)/main/explore/impact/_data/impactPathSchema.ts

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type ImpactPathEnergy =
  | "high-energy"
  | "grounded"
  | "reflective"
  | "builder"
  | "people"
  | "creative"
  | "organizer"
  | "support";

export type ImpactPathActionType =
  | "project"
  | "experiment"
  | "visit"
  | "join"
  | "research"
  | "conversation"
  | "plan"
  | "serve";

export type ImpactOpportunityMode =
  | "local"
  | "virtual"
  | "hybrid"
  | "field";

export type ImpactTheme = {
  tone: string;
  accent: Rgb;
  accentStrong: Rgb;
  glow: Rgb;
  surfaceLabel: string;
};

export type ImpactCard = {
  title: string;
  hook: string;
  description: string;
};

export type ImpactHero = {
  eyebrow: string;
  title: string;
  hook: string;
  summary: string;
  whyItPullsYouIn: string[];
};

export type ImpactTraitChip = {
  id: string;
  label: string;
};

export type ImpactFitSignal = {
  id: string;
  label: string;
  score: number;
  explanation: string;
};

export type ImpactBranchPreview = {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  whyItCouldFit: string;
  energy: ImpactPathEnergy;
};

export type ImpactBranch = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whatYouActuallyDo: string[];
  skillsThatGrowHere: string[];
  starterProjects: string[];
  atmosphere: string;
};

export type ImpactAction = {
  id: string;
  title: string;
  type: ImpactPathActionType;
  effort: "light" | "medium" | "stretch";
  timeEstimate: string;
  whyThisMatters: string;
  instructions: string[];
};

export type ImpactFeelingMoment = {
  id: string;
  title: string;
  body: string;
};

export type ImpactHowItFeels = {
  title: string;
  summary: string;
  moments: ImpactFeelingMoment[];
};

export type ImpactGrowthStage = {
  id: string;
  label: string;
  timeframe: string;
  summary: string;
  signalsOfProgress: string[];
};

export type ImpactGrowthPath = {
  title: string;
  summary: string;
  stages: ImpactGrowthStage[];
};

export type ImpactOpportunity = {
  id: string;
  title: string;
  mode: ImpactOpportunityMode;
  provider: string;
  summary: string;
  whyItHelps: string;
  href: string;
  formatLabel: string;
};

export type ImpactOpportunityGroup = {
  id: string;
  title: string;
  description: string;
  items: ImpactOpportunity[];
};

export type ImpactNextSteps = {
  title: string;
  summary: string;
  actions: ImpactAction[];
  opportunityGroups: ImpactOpportunityGroup[];
};

export type ImpactPathContent = {
  id: string;
  slug: string;
  lane: "impact";

  theme: ImpactTheme;
  card: ImpactCard;
  hero: ImpactHero;

  traitChips: ImpactTraitChip[];
  fitSignals: ImpactFitSignal[];

  branchPreviews: ImpactBranchPreview[];
  branches: ImpactBranch[];

  tryNow: {
    title: string;
    summary: string;
    actions: ImpactAction[];
  };

  howItFeels: ImpactHowItFeels;
  growthPath: ImpactGrowthPath;
  nextSteps: ImpactNextSteps;
};