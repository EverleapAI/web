// apps/web/src/app/(app)/main/explore/_data/exploreTypes.ts

export const EXPLORE_SIGNALS = [
  "creativity",
  "systems",
  "people",
  "curiosity",
  "analysis",
  "build",
  "impact",
  "story",
] as const;

export type ExploreSignal = (typeof EXPLORE_SIGNALS)[number];

export type SignalVector = Record<ExploreSignal, number>;

export type ExploreLaneId =
  | "work"
  | "learning"
  | "world"
  | "impact"
  | "play";

export type ExploreDeepDivePageId =
  | "specialties"
  | "day-in-the-life"
  | "future"
  | "next-steps";

export type ExplorePathStatus = "active" | "draft" | "archived";

export type ExploreRecommendationReasonType =
  | "signal-match"
  | "interest-match"
  | "behavior-match"
  | "goal-match"
  | "location-match"
  | "freshness"
  | "diversity"
  | "agentic-inference"
  | "editorial";

export type ExploreContentSource =
  | "mock"
  | "editorial"
  | "rules"
  | "ai"
  | "user"
  | "hybrid";

export type ExploreOpportunityType =
  | "course"
  | "club"
  | "project"
  | "volunteer"
  | "job-shadow"
  | "event"
  | "internship"
  | "creator-resource"
  | "community"
  | "other";

export type ExplorePathTag =
  | "creative"
  | "technical"
  | "strategic"
  | "hands-on"
  | "social"
  | "mission-driven"
  | "outdoors"
  | "global"
  | "independent"
  | "team-based";

export type ExplorePathKeyMomentType =
  | "specialty"
  | "daily-task"
  | "milestone"
  | "future-signal"
  | "next-step";

export interface ExploreDisplayText {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  shortTitle?: string;
  hook?: string;
  description: string;
}

export interface ExploreTheme {
  accentHex?: string;
  accentRgb?: {
    r: number;
    g: number;
    b: number;
  };
  gradientFrom?: string;
  gradientTo?: string;
  glow?: string;
  image?: string;
}

export interface ExplorePathMedia {
  cardImage?: string;
  heroImage?: string;
  posterImage?: string;
  thumbnailImage?: string;
}

export interface ExplorePathKeyMoment {
  id: string;
  type: ExplorePathKeyMomentType;
  title: string;
  body: string;
}

export interface ExplorePathSummaryStat {
  id: string;
  label: string;
  value: string;
  supportingText?: string;
}

export interface ExplorePathSpecialty {
  id: string;
  title: string;
  shortDescription: string;
  description?: string;
  signalShift?: Partial<SignalVector>;
  tags?: ExplorePathTag[];
}

export interface ExplorePathDayStep {
  id: string;
  timeLabel?: string;
  title: string;
  description: string;
}

export interface ExplorePathFutureSignal {
  id: string;
  label: string;
  value: string;
  direction?: "up" | "steady" | "mixed" | "unknown";
  supportingText?: string;
}

export interface ExplorePathNextStep {
  id: string;
  title: string;
  description: string;
  type?: ExploreOpportunityType;
  url?: string;
  locationLabel?: string;
  isLocal?: boolean;
  isOnline?: boolean;
}

export interface ExploreDeepDiveContent {
  specialties?: {
    intro?: string;
    items: ExplorePathSpecialty[];
  };
  dayInTheLife?: {
    intro?: string;
    steps: ExplorePathDayStep[];
  };
  future?: {
    intro?: string;
    signals: ExplorePathFutureSignal[];
  };
  nextSteps?: {
    intro?: string;
    items: ExplorePathNextStep[];
  };
}

export interface ExplorePath {
  id: string;
  laneId: ExploreLaneId;
  slug: string;
  status: ExplorePathStatus;
  display: ExploreDisplayText;
  theme?: ExploreTheme;
  media?: ExplorePathMedia;

  signals: SignalVector;
  tags?: ExplorePathTag[];

  quickCheckPrompt?: string;
  quickCheckOptions?: string[];

  keyMoments?: ExplorePathKeyMoment[];
  summaryStats?: ExplorePathSummaryStat[];

  deepDive: ExploreDeepDiveContent;

  contentSource?: ExploreContentSource;
  sourcePathId?: string;
  relatedPathIds?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface ExploreLaneConfig {
  id: ExploreLaneId;
  label: string;
  shortLabel?: string;
  description: string;
  pathLabel: string;
  deepDivePages: ExploreDeepDivePageId[];
  theme?: ExploreTheme;
}

export interface ExploreLaneDefinition {
  config: ExploreLaneConfig;
  paths: ExplorePath[];
}

export interface RecommendationScoreBreakdown {
  signalAlignment: number;
  interestAlignment?: number;
  behaviorAlignment?: number;
  goalAlignment?: number;
  freshness?: number;
  diversity?: number;
  editorialBoost?: number;
  penalty?: number;
  total: number;
}

export interface RecommendationReason {
  type: ExploreRecommendationReasonType;
  title: string;
  detail: string;
  weight?: number;
}

export interface RecommendationReplacementState {
  wasRejected: boolean;
  rejectedAt?: string;
  replacedByPathId?: string;
  replacementRank?: number;
}

export interface PathRecommendation {
  recommendationId: string;
  userId?: string;
  laneId: ExploreLaneId;
  pathId: string;

  rank: number;
  score: number;
  scoreBreakdown?: RecommendationScoreBreakdown;
  reasons: RecommendationReason[];

  dismissed?: boolean;
  pinned?: boolean;
  replacement?: RecommendationReplacementState;

  generatedBy: ExploreContentSource;
  generatedAt: string;
  expiresAt?: string;
}

export interface RecommendationDeck {
  laneId: ExploreLaneId;
  maxVisible: number;
  rankedPathIds: string[];
  activeRecommendationIds: string[];
  recommendations: PathRecommendation[];
}

export interface ExploreUserSignals {
  current: SignalVector;
  confidence?: Partial<Record<ExploreSignal, number>>;
  updatedAt?: string;
}

export interface ExploreUserPreferenceSnapshot {
  savedPathIds?: string[];
  dismissedPathIds?: string[];
  completedQuickChecks?: string[];
  preferredTags?: ExplorePathTag[];
  avoidedTags?: ExplorePathTag[];
}

export interface ExploreUserProfileSnapshot {
  userId?: string;
  signals: ExploreUserSignals;
  preferences?: ExploreUserPreferenceSnapshot;
  locationLabel?: string;
  ageBand?: string;
  updatedAt?: string;
}

export interface RecommendationRequestContext {
  laneId: ExploreLaneId;
  availablePathIds: string[];
  maxResults: number;
  excludePathIds?: string[];
  replaceDismissed?: boolean;
}

export interface RecommendationEngineInput {
  user: ExploreUserProfileSnapshot;
  context: RecommendationRequestContext;
  paths: ExplorePath[];
}

export interface RecommendationEngineOutput {
  laneId: ExploreLaneId;
  rankedRecommendations: PathRecommendation[];
  visibleRecommendations: PathRecommendation[];
  overflowRecommendations: PathRecommendation[];
}

export interface ExploreCatalog {
  lanes: ExploreLaneDefinition[];
}

export interface ExploreMockBackendState {
  catalog: ExploreCatalog;
  user: ExploreUserProfileSnapshot;
  decks: Partial<Record<ExploreLaneId, RecommendationDeck>>;
}
