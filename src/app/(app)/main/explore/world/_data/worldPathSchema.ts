// apps/web/src/app/(app)/main/explore/world/_data/worldPathSchema.ts

export type WorldPathEnergy =
  | "adventure"
  | "grounded"
  | "people"
  | "creative"
  | "reflective"
  | "builder";

export type WorldOpportunityMode =
  | "local"
  | "virtual"
  | "travel"
  | "hybrid";

export type WorldOpportunityType =
  | "program"
  | "experience"
  | "volunteer"
  | "exchange"
  | "expedition"
  | "class"
  | "event"
  | "project"
  | "trip"
  | "resource"
  | "research"
  | "conversation"
  | "visit";

export type WorldPathTheme = {
  surfaceLabel: string;
  accent: string;
  accentStrong: string;
  glow: string;
};

export type WorldPathCard = {
  title: string;
  hook: string;
  description: string;
};

export type WorldPathHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  ambientLabel: string;
  pullQuote: string;
};

export type WorldTraitChip = {
  label: string;
};

export type WorldFitSignal = {
  id: string;
  label: string;
  score: number;
  explanation: string;
};

export type WorldExploreItem = {
  title: string;
  description: string;
};

export type WorldWhatYouExplore = {
  label: string;
  title: string;
  intro: string;
  items: WorldExploreItem[];
};

export type WorldFeaturedOpportunity = {
  label: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  mode: WorldOpportunityMode;
  type: WorldOpportunityType;
};

export type WorldOpportunity = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  mode: WorldOpportunityMode;
  type: WorldOpportunityType;
  locationLabel?: string;
  ageNote?: string;
};

export type WorldOpportunityGroup = {
  id: string;
  label: string;
  title: string;
  description: string;
  opportunities: WorldOpportunity[];
};

export type WorldPathContent = {
  id: string;
  slug: string;
  energy: WorldPathEnergy;
  theme: WorldPathTheme;
  card: WorldPathCard;
  hero: WorldPathHero;
  traitChips: WorldTraitChip[];
  fitSignals: WorldFitSignal[];
  whatYouExplore: WorldWhatYouExplore;
  featuredOpportunity: WorldFeaturedOpportunity;
  opportunityGroups: WorldOpportunityGroup[];
};