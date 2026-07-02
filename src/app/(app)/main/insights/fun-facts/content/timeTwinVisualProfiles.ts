// apps/web/src/app/(app)/main/insights/fun-facts/content/timeTwinVisualProfiles.ts
//
// The backend picks one of these 10 keys per generated Time Twin (mirrors
// the icon_key mechanic used for Motivators/Strengths/Skills) instead of
// choosing visualTheme/portraitArchetype/heroPattern independently, which
// would risk incoherent combinations. Each bundle here is taken directly
// from the original 10 hand-authored Time Twins, so the visuals stay
// exactly as polished as they were before generation replaced the fixed
// pool.

import type {
  AccentRgb,
  TimeTwinHeroPattern,
  TimeTwinPortraitArchetype,
  TimeTwinVisualTheme,
} from "./timeTwins";

export type TimeTwinVisualProfileKey =
  | "inventor_sketch"
  | "inventor_electric"
  | "scientist"
  | "mathematician"
  | "coder"
  | "cosmic"
  | "philosopher"
  | "futurist"
  | "artist"
  | "writer";

export type TimeTwinVisualProfile = {
  visualTheme: TimeTwinVisualTheme;
  portraitArchetype: TimeTwinPortraitArchetype;
  heroPattern: TimeTwinHeroPattern;
  accentRgb: AccentRgb;
};

export const TIME_TWIN_VISUAL_PROFILES: Record<
  TimeTwinVisualProfileKey,
  TimeTwinVisualProfile
> = {
  inventor_sketch: {
    visualTheme: "inventor-parchment",
    portraitArchetype: "inventor",
    heroPattern: "sketch",
    accentRgb: { r: 255, g: 196, b: 92 },
  },
  inventor_electric: {
    visualTheme: "inventor-electric",
    portraitArchetype: "inventor",
    heroPattern: "coil",
    accentRgb: { r: 68, g: 210, b: 255 },
  },
  mathematician: {
    visualTheme: "logic-victorian",
    portraitArchetype: "mathematician",
    heroPattern: "diagram",
    accentRgb: { r: 190, g: 110, b: 255 },
  },
  scientist: {
    visualTheme: "scientist-luminous",
    portraitArchetype: "scientist",
    heroPattern: "glass",
    accentRgb: { r: 120, g: 255, b: 210 },
  },
  coder: {
    visualTheme: "code-shadow",
    portraitArchetype: "coder",
    heroPattern: "grid",
    accentRgb: { r: 72, g: 235, b: 200 },
  },
  cosmic: {
    visualTheme: "cosmic-wonder",
    portraitArchetype: "cosmic-guide",
    heroPattern: "stars",
    accentRgb: { r: 92, g: 150, b: 255 },
  },
  philosopher: {
    visualTheme: "geometry-marble",
    portraitArchetype: "philosopher",
    heroPattern: "geometry",
    accentRgb: { r: 160, g: 215, b: 255 },
  },
  futurist: {
    visualTheme: "future-dusk",
    portraitArchetype: "futurist",
    heroPattern: "skyline",
    accentRgb: { r: 255, g: 120, b: 88 },
  },
  artist: {
    visualTheme: "painter-bloom",
    portraitArchetype: "artist",
    heroPattern: "paint",
    accentRgb: { r: 255, g: 72, b: 145 },
  },
  writer: {
    visualTheme: "ink-moon",
    portraitArchetype: "writer",
    heroPattern: "ink",
    accentRgb: { r: 210, g: 140, b: 255 },
  },
};

export function resolveTimeTwinVisualProfile(
  key: string | undefined | null
): TimeTwinVisualProfile {
  const match = key && key in TIME_TWIN_VISUAL_PROFILES
    ? TIME_TWIN_VISUAL_PROFILES[key as TimeTwinVisualProfileKey]
    : null;

  return match ?? TIME_TWIN_VISUAL_PROFILES.scientist;
}
