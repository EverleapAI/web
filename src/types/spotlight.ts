// src/types/spotlight.ts

export type SpotlightBadgeKey =
  | "onboarding"
  | "motivations"
  | "strengths"
  | "skills";

export type SpotlightIconKey =
  | "clock"
  | "smile"
  | "sparkles"
  | "zap"
  | "heart"
  | "brain";

export type SpotlightAccentKey = "violet" | "amber" | "sky" | "emerald";

export type SpotlightPayload = {
  version: 1;
  generatedAt: string; // ISO string

  spotlight: {
    id: string;
    headline: string;
    summary: string;
    ctaLabel: string;
    ctaHref: string;

    minutes?: number; // for "2 min"
    badgeKey?: SpotlightBadgeKey;

    progress?: {
      label: string;
      value: number; // 0..1
    };

    reason?: string; // short optional explanation
  };

  tinyTasks: Array<{
    id: string;
    label: string;
    summary: string;
    minutes?: number;
    href: string;
    iconKey: SpotlightIconKey;
  }>;

  explore: Array<{
    id: string;
    title: string;
    summary: string;
    href: string;
    accentKey: SpotlightAccentKey;
  }>;
};
