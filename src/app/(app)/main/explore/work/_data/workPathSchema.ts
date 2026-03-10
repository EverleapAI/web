/* =============================================================================
   Core RGB type
============================================================================= */

export type RGB = {
  r: number;
  g: number;
  b: number;
};

/* =============================================================================
   Theme
============================================================================= */

export type WorkPathTheme = {
  tone: string;

  accent: RGB;
  accentStrong: RGB;
  glow: RGB;

  surfaceLabel?: string;
};

/* =============================================================================
   Card (used on Work lane grid)
============================================================================= */

export type WorkPathCard = {
  title: string;
  hook: string;
  description: string;
};

/* =============================================================================
   Hero section
============================================================================= */

export type WorkPathHero = {
  eyebrow?: string;

  title: string;
  hook: string;

  summary: string;

  whyItPullsYouIn: string[];
};

/* =============================================================================
   Trait chips
============================================================================= */

export type WorkPathTraitChip = {
  id: string;
  label: string;
};

/* =============================================================================
   Fit signals
============================================================================= */

export type WorkPathFitSignal = {
  id: string;
  label: string;

  score: number;

  explanation: string;
};

/* =============================================================================
   Snapshot stats
============================================================================= */

export type WorkPathSnapshotStat = {
  id: string;
  label: string;

  value: string;

  note?: string;
};

/* =============================================================================
   Specialty preview (shown on overview)
============================================================================= */

export type WorkPathSpecialtyPreview = {
  id: string;
  slug: string;

  title: string;

  oneLiner: string;

  whyItCouldFit: string;

  energy?: "systems" | "craft" | "high-creative" | string;
};

/* =============================================================================
   Specialty full detail
============================================================================= */

export type WorkPathSpecialty = {
  id: string;
  slug: string;

  title: string;

  summary: string;

  whatYouActuallyDo: string[];

  skillsThatGrowHere: string[];

  starterProjects: string[];

  atmosphere?: string;
};

/* =============================================================================
   Day in the life
============================================================================= */

export type WorkPathDayMoment = {
  id: string;

  timeLabel: string;

  title: string;

  body: string;
};

export type WorkPathDayInLife = {
  title: string;

  summary: string;

  moments: WorkPathDayMoment[];
};

/* =============================================================================
   Forecast
============================================================================= */

export type WorkPathForecastStage = {
  id: string;

  label: string;

  timeframe: string;

  summary: string;

  signalsOfProgress: string[];
};

export type WorkPathForecast = {
  title: string;

  summary: string;

  stages: WorkPathForecastStage[];
};

/* =============================================================================
   Next steps
============================================================================= */

export type WorkPathOpportunityMode = "local" | "virtual";

export type WorkPathOpportunity = {
  id: string;

  title: string;

  mode: WorkPathOpportunityMode;

  provider?: string;

  locationLabel?: string;
  distanceLabel?: string;

  formatLabel?: string;

  summary: string;

  whyItHelps: string;

  href?: string;
};

export type WorkPathOpportunityGroup = {
  id: string;

  title: string;

  description?: string;

  items: WorkPathOpportunity[];
};

export type WorkPathNextStep = {
  id: string;

  title: string;

  type: "tiny-task" | "project" | "conversation" | string;

  effort?: "light" | "medium" | "deep";

  timeEstimate?: string;

  whyThisMatters: string;

  instructions: string[];
};

export type WorkPathNextSteps = {
  title: string;

  summary: string;

  actions: WorkPathNextStep[];

  opportunityGroups?: WorkPathOpportunityGroup[];
};

/* =============================================================================
   MAIN CONTENT OBJECT
============================================================================= */

export type WorkPathContent = {
  id: string;

  slug: string;

  lane: "work";

  theme: WorkPathTheme;

  card: WorkPathCard;

  hero: WorkPathHero;

  traitChips: WorkPathTraitChip[];

  fitSignals: WorkPathFitSignal[];

  snapshotStats: WorkPathSnapshotStat[];

  specialtyPreviews: WorkPathSpecialtyPreview[];

  specialties: WorkPathSpecialty[];

  dayInLife: WorkPathDayInLife;

  forecast: WorkPathForecast;

  nextSteps: WorkPathNextSteps;
};

/* =============================================================================
   Helpers
============================================================================= */

export function getWorkPathById(
  paths: WorkPathContent[],
  idOrSlug: string
): WorkPathContent | undefined {
  return paths.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getWorkSpecialtyBySlug(
  path: WorkPathContent,
  slug: string
): WorkPathSpecialty | undefined {
  return path.specialties.find((s) => s.slug === slug);
}