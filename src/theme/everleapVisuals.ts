// src/theme/everleapVisuals.ts

/* ========= Theme / gradient types ========= */

export type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

export type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type InsightsTheme = {
  id: SpotlightThemeId;
  label: string;

  pageBgBaseClass: string;
  pageTextMutedClass: string;
  sectionLabelClass: string;

  /** AppChrome ambient blobs */
  ambientTopLeftClass: string;
  ambientRightClass: string;

  /** Cards */
  cardBgClass: string;
  cardBorderClass: string;

  /** Chips / pills */
  chipBgClass: string;
  chipBorderClass: string;
};

export type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
};

/* ========= Theme presets ========= */

export const INSIGHTS_THEMES: InsightsTheme[] = [
  {
    id: "nightDusk",
    label: "Night",
    pageBgBaseClass: "bg-[#020617] text-slate-50",
    pageTextMutedClass: "text-slate-300/80",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-300/70",
    ambientTopLeftClass: "bg-indigo-400",
    ambientRightClass: "bg-cyan-300",
    cardBgClass: "bg-slate-950/85",
    cardBorderClass: "border-slate-700/60",
    chipBgClass: "bg-slate-900/60",
    chipBorderClass: "border-slate-700/55",
  },
  {
    id: "berrySoft",
    label: "Berry",
    pageBgBaseClass: "bg-[#0b0611] text-slate-50",
    pageTextMutedClass: "text-slate-300/80",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-300/70",
    ambientTopLeftClass: "bg-fuchsia-300",
    ambientRightClass: "bg-violet-300",
    cardBgClass: "bg-black/55",
    cardBorderClass: "border-white/10",
    chipBgClass: "bg-white/10",
    chipBorderClass: "border-white/10",
  },
  {
    id: "forestSoft",
    label: "Forest",
    pageBgBaseClass: "bg-[#03110e] text-slate-50",
    pageTextMutedClass: "text-slate-300/80",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-300/70",
    ambientTopLeftClass: "bg-emerald-300",
    ambientRightClass: "bg-cyan-200",
    cardBgClass: "bg-black/45",
    cardBorderClass: "border-white/10",
    chipBgClass: "bg-white/10",
    chipBorderClass: "border-white/10",
  },
  {
    id: "warmSand",
    label: "Sand",
    pageBgBaseClass: "bg-[#0f0a03] text-slate-50",
    pageTextMutedClass: "text-slate-200/80",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-200/70",
    ambientTopLeftClass: "bg-orange-200",
    ambientRightClass: "bg-amber-200",
    cardBgClass: "bg-black/45",
    cardBorderClass: "border-white/10",
    chipBgClass: "bg-white/10",
    chipBorderClass: "border-white/10",
  },
  {
    id: "coolNotebook",
    label: "Notebook",
    pageBgBaseClass: "bg-[#06101a] text-slate-50",
    pageTextMutedClass: "text-slate-200/80",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-200/70",
    ambientTopLeftClass: "bg-sky-200",
    ambientRightClass: "bg-slate-200",
    cardBgClass: "bg-black/45",
    cardBorderClass: "border-white/10",
    chipBgClass: "bg-white/10",
    chipBorderClass: "border-white/10",
  },
  {
    id: "cleanPaper",
    label: "Paper",
    pageBgBaseClass: "bg-[#f9fafb] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-eyebrow text-slate-500",
    ambientTopLeftClass: "bg-slate-200",
    ambientRightClass: "bg-amber-100",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-slate-200",
    chipBgClass: "bg-slate-50",
    chipBorderClass: "border-slate-200",
  },
];

/* ========= Gradient levels ========= */

export const GRADIENT_CONFIGS: GradientConfig[] = [
  { level: 0, ambientOpacity: 0 },
  { level: 1, ambientOpacity: 0.1 },
  { level: 2, ambientOpacity: 0.25 }, // <-- "between 1 and 2"
  { level: 3, ambientOpacity: 0.3 },
  { level: 4, ambientOpacity: 0.45 },
  { level: 5, ambientOpacity: 0.6 },
];

export const DEFAULT_THEME_ID: SpotlightThemeId = "nightDusk";
export const DEFAULT_GRADIENT_LEVEL: GradientLevel = 3;

export function getThemeById(id: SpotlightThemeId): InsightsTheme {
  return (
    INSIGHTS_THEMES.find((t) => t.id === id) ??
    INSIGHTS_THEMES.find((t) => t.id === DEFAULT_THEME_ID) ??
    INSIGHTS_THEMES[0]
  );
}

export function getGradientConfig(level: GradientLevel): GradientConfig {
  return (
    GRADIENT_CONFIGS.find((g) => g.level === level) ??
    GRADIENT_CONFIGS[DEFAULT_GRADIENT_LEVEL]
  );
}

/**
 * Background image is strength-aware.
 * We map ambientOpacity into a gentle strength scalar.
 * - 0.3 is the reference point.
 */
function strengthFromAmbientOpacity(ambientOpacity: number): number {
  if (ambientOpacity <= 0) return 0;
  const s = ambientOpacity / 0.3; // 0.3 => 1.0
  return Math.max(0, Math.min(1.4, s)); // slight lift but capped
}

function clampAlpha(a: number): number {
  return Math.max(0, Math.min(1, a));
}

export function getPageBackgroundImage(
  themeId: SpotlightThemeId,
  level: GradientLevel = DEFAULT_GRADIENT_LEVEL
): string {
  const { ambientOpacity } = getGradientConfig(level);
  const s = strengthFromAmbientOpacity(ambientOpacity);

  switch (themeId) {
    case "nightDusk": {
      /**
       * Subtle ambient background (NOT a light source).
       * Fixes corner wash by moving glow centers inward, using fixed radii,
       * and lowering peak alpha with a mid-stop.
       */
      const a1 = clampAlpha(0.10 * s); // indigo (top-left)
      const a2 = clampAlpha(0.08 * s); // cyan (right)
      const a1b = clampAlpha(a1 * 0.40);
      const a2b = clampAlpha(a2 * 0.40);

      return [
        `radial-gradient(900px 620px at 18% 12%, rgba(129,140,248,${a1}) 0%, rgba(129,140,248,${a1b}) 28%, rgba(2,6,23,0) 62%)`,
        `radial-gradient(920px 700px at 86% 42%, rgba(56,189,248,${a2}) 0%, rgba(56,189,248,${a2b}) 30%, rgba(2,6,23,0) 66%)`,
      ].join(", ");
    }

    case "berrySoft":
      return [
        "radial-gradient(circle at top left, rgba(244,219,255,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(234,222,255,0.8), transparent 55%)",
      ].join(", ");

    case "forestSoft":
      return [
        "radial-gradient(circle at top left, rgba(209,250,229,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(204,251,241,0.85), transparent 55%)",
      ].join(", ");

    case "warmSand":
      return [
        "radial-gradient(circle at top left, rgba(253,230,200,0.9), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(254,249,195,0.9), transparent 55%)",
      ].join(", ");

    case "coolNotebook":
      return [
        "radial-gradient(circle at top left, rgba(191,219,254,0.85), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(226,232,240,0.9), transparent 55%)",
      ].join(", ");

    case "cleanPaper":
    default:
      return [
        "radial-gradient(circle at top left, rgba(248,250,252,1), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(241,245,249,1), transparent 55%)",
      ].join(", ");
  }
}

/** Convenience: treat only Night as “dark theme” for now */
export function isDarkTheme(themeId: SpotlightThemeId): boolean {
  return themeId === "nightDusk";
}
