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

export type LearningWhatYouLearnItem = {
  id: string;
  title: string;
  description: string;
};

export type LearningOpportunityMode = "local" | "virtual" | "hybrid";

export type LearningOpportunityTag =
  | "beginner-friendly"
  | "free"
  | "low-cost"
  | "local"
  | "online"
  | "hybrid"
  | "short-commitment"
  | "structured"
  | "hands-on"
  | "self-paced"
  | "with-mentor"
  | "portfolio-building"
  | "career-connected";

export type LearningOpportunityItem = {
  id: string;
  title: string;
  provider: string;
  summary: string;
  whyItFits: string;
  mode: LearningOpportunityMode;
  href?: string;
  locationLabel?: string;
  distanceLabel?: string;
  formatLabel?: string;
  ageLabel?: string;
  costLabel?: string;
  commitmentLabel?: string;
  tags?: LearningOpportunityTag[];
};

export type LearningOpportunityGroup = {
  id: string;
  title: string;
  description: string;
  items: LearningOpportunityItem[];
};

export type LearningFeaturedOpportunity = {
  title: string;
  summary: string;
  whyStartHere: string;
  href?: string;
  mode: LearningOpportunityMode;
  provider: string;
  locationLabel?: string;
  formatLabel?: string;
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

  whatYouLearn: LearningWhatYouLearnItem[];

  featuredOpportunity: LearningFeaturedOpportunity;
  opportunityGroups: LearningOpportunityGroup[];
};