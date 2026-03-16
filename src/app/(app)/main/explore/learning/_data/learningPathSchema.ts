// apps/web/src/app/(app)/main/explore/learning/_data/learningPathSchema.ts

export type LearningPathTheme = {
  tone: string;
  accent: {
    r: number;
    g: number;
    b: number;
  };
  accentStrong?: {
    r: number;
    g: number;
    b: number;
  };
  glow?: {
    r: number;
    g: number;
    b: number;
  };
  surfaceLabel?: string;
};

export type LearningPathCard = {
  title: string;
  hook: string;
  description: string;
};

export type LearningPathHero = {
  eyebrow: string;
  title: string;
  hook: string;
  summary: string;
  whyItPullsYouIn: string[];
};

export type LearningTraitChip = {
  id: string;
  label: string;
};

export type LearningFitSignal = {
  id: string;
  label: string;
  score: number;
  explanation: string;
};

export type LearningBranchPreview = {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  whyItCouldFit: string;
  energy:
    | "systems"
    | "people"
    | "creative"
    | "high-creative"
    | "craft"
    | "analysis"
    | "exploration"
    | "communication"
    | "builder"
    | "calm";
};

export type LearningBranch = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  whatYouActuallyExplore: string[];
  skillsThatGrowHere: string[];
  starterProjects: string[];
  atmosphere: string;
};

export type LearningTryNowActionType =
  | "tiny-task"
  | "experiment"
  | "project"
  | "watch"
  | "read"
  | "join";

export type LearningEffort = "light" | "medium" | "stretch";

export type LearningTryNowAction = {
  id: string;
  title: string;
  type: LearningTryNowActionType;
  effort: LearningEffort;
  timeEstimate: string;
  whyThisMatters: string;
  instructions: string[];
};

export type LearningTryNow = {
  title: string;
  summary: string;
  actions: LearningTryNowAction[];
};

export type LearningFeelingMoment = {
  id: string;
  title: string;
  body: string;
};

export type LearningHowItFeels = {
  title: string;
  summary: string;
  moments: LearningFeelingMoment[];
};

export type LearningGrowthStage = {
  id: string;
  label: string;
  timeframe: string;
  summary: string;
  signalsOfProgress: string[];
};

export type LearningGrowthPath = {
  title: string;
  summary: string;
  stages: LearningGrowthStage[];
};

export type LearningOpportunityMode = "local" | "virtual" | "hybrid";

export type LearningOpportunityItem = {
  id: string;
  title: string;
  mode: LearningOpportunityMode;
  provider: string;
  summary: string;
  whyItHelps: string;
  href?: string;
  locationLabel?: string;
  distanceLabel?: string;
  formatLabel?: string;
};

export type LearningOpportunityGroup = {
  id: string;
  title: string;
  description: string;
  items: LearningOpportunityItem[];
};

export type LearningNextStepAction = {
  id: string;
  title: string;
  type: LearningTryNowActionType;
  effort: LearningEffort;
  timeEstimate: string;
  whyThisMatters: string;
  instructions: string[];
};

export type LearningNextSteps = {
  title: string;
  summary: string;
  actions: LearningNextStepAction[];
  opportunityGroups: LearningOpportunityGroup[];
};

export type LearningPathContent = {
  id: string;
  slug: string;
  lane: "learning";

  theme: LearningPathTheme;
  card: LearningPathCard;
  hero: LearningPathHero;

  traitChips: LearningTraitChip[];
  fitSignals: LearningFitSignal[];

  branchPreviews: LearningBranchPreview[];
  branches: LearningBranch[];

  tryNow: LearningTryNow;
  howItFeels: LearningHowItFeels;
  growthPath: LearningGrowthPath;
  nextSteps: LearningNextSteps;
};