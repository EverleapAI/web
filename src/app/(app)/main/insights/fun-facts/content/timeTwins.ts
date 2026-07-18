// apps/web/src/app/(app)/main/insights/fun-facts/content/timeTwins.ts
//
// Rendering-oriented types shared by TimeTwinHero.tsx and the Time Twin
// page. The hardcoded 10-person pool and matching-profile types that used
// to live here were removed once Time Twin became a real AI generation
// (see timeTwinVisualProfiles.ts for the visual-token lookup, and
// apps/everleap-api's timeTwinNarrative.ts for the actual generation).

export type AccentRgb = {
  r: number;
  g: number;
  b: number;
};

export type RGB = AccentRgb;

export type TimeTwinTile = {
  title: string;
  body: string;
  icon?: string;
};

export type TimeTwinStoryBeat = {
  body: string;
};

export type TimeTwinVisualTheme =
  | "inventor-parchment"
  | "inventor-electric"
  | "scientist-luminous"
  | "logic-victorian"
  | "code-shadow"
  | "cosmic-wonder"
  | "geometry-marble"
  | "future-dusk"
  | "painter-bloom"
  | "ink-moon";

export type TimeTwinPortraitArchetype =
  | "inventor"
  | "scientist"
  | "mathematician"
  | "coder"
  | "cosmic-guide"
  | "philosopher"
  | "futurist"
  | "artist"
  | "writer";

export type TimeTwinHeroPattern =
  | "sketch"
  | "coil"
  | "glass"
  | "diagram"
  | "grid"
  | "stars"
  | "geometry"
  | "skyline"
  | "paint"
  | "ink";

export type TimeTwin = {
  id: string;

  /** Stable library slug (time_twin_figures.slug), when this twin came from the
   *  generated library — used to key reactions the same way the matcher reasons. */
  figureSlug?: string;

  name: string;
  era: string;
  tagline: string;

  /** kept temporarily for compatibility with current UI */
  heroImage: string;
  portraitImage: string;

  /** code-driven rendering tokens */
  visualTheme: TimeTwinVisualTheme;
  portraitArchetype: TimeTwinPortraitArchetype;
  heroPattern: TimeTwinHeroPattern;

  accentRgb: AccentRgb;

  mindType: string;

  whyYou: string[];

  tiles: TimeTwinTile[];

  storyBeats: TimeTwinStoryBeat[];

  superpower: string;
  watchout: string;
  tryThisWeek: string;

  learnMore: string;
};
