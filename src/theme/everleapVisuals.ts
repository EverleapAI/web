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
  ambientTopLeftClass: string;
  ambientRightClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  chipBgClass: string;
  chipBorderClass: string;
};

export type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
};

/* ========= Theme presets (copied from Insights/Carousel) ========= */

export const INSIGHTS_THEMES: InsightsTheme[] = [
  {
    id: "nightDusk",
    label: "Night",
    pageBgBaseClass: "bg-[#020617] text-slate-50",
    pageTextMutedClass: "text-slate-300/90",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-400",
    ambientTopLeftClass: "bg-indigo-400",
    ambientRightClass: "bg-sky-400",
    cardBgClass: "bg-slate-950/85",
    cardBorderClass: "border-slate-800/80",
    chipBgClass: "bg-slate-900/80",
    chipBorderClass: "border-slate-700/80",
  },
  {
    id: "berrySoft",
    label: "Berry",
    pageBgBaseClass: "bg-[#f7ecff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-violet-500",
    ambientTopLeftClass: "bg-fuchsia-200",
    ambientRightClass: "bg-violet-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-fuchsia-100",
    chipBgClass: "bg-fuchsia-50",
    chipBorderClass: "border-fuchsia-100",
  },
  {
    id: "forestSoft",
    label: "Teal",
    pageBgBaseClass: "bg-[#e7f5f1] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-emerald-500",
    ambientTopLeftClass: "bg-emerald-200",
    ambientRightClass: "bg-teal-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-emerald-100",
    chipBgClass: "bg-emerald-50",
    chipBorderClass: "border-emerald-100",
  },
  {
    id: "warmSand",
    label: "Sand",
    pageBgBaseClass: "bg-[#f5ebe0] text-stone-900",
    pageTextMutedClass: "text-stone-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500",
    ambientTopLeftClass: "bg-amber-200",
    ambientRightClass: "bg-orange-200",
    cardBgClass: "bg-[#fdf7ef]/95",
    cardBorderClass: "border-amber-200",
    chipBgClass: "bg-amber-50",
    chipBorderClass: "border-amber-100",
  },
  {
    id: "coolNotebook",
    label: "Cool",
    pageBgBaseClass: "bg-[#e5f0ff] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-sky-200",
    ambientRightClass: "bg-indigo-200",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-slate-200",
    chipBgClass: "bg-slate-50",
    chipBorderClass: "border-slate-200",
  },
  {
    id: "cleanPaper",
    label: "Paper",
    pageBgBaseClass: "bg-[#f9fafb] text-slate-900",
    pageTextMutedClass: "text-slate-600",
    sectionLabelClass:
      "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500",
    ambientTopLeftClass: "bg-slate-200",
    ambientRightClass: "bg-amber-100",
    cardBgClass: "bg-white/95",
    cardBorderClass: "border-slate-200",
    chipBgClass: "bg-slate-50",
    chipBorderClass: "border-slate-200",
  },
];

export const GRADIENT_CONFIGS: GradientConfig[] = [
  { level: 0, ambientOpacity: 0 },
  { level: 1, ambientOpacity: 0.1 },
  { level: 2, ambientOpacity: 0.18 },
  { level: 3, ambientOpacity: 0.3 },
  { level: 4, ambientOpacity: 0.45 },
  { level: 5, ambientOpacity: 0.6 },
];

/* ========= Defaults ========= */

export const DEFAULT_THEME_ID: SpotlightThemeId = "nightDusk";
export const DEFAULT_GRADIENT_LEVEL: GradientLevel = 3;

/* ========= Helpers ========= */

export function getThemeById(
  id: SpotlightThemeId
): InsightsTheme {
  return INSIGHTS_THEMES.find((t) => t.id === id) ?? INSIGHTS_THEMES[0];
}

export function getGradientConfig(
  level: GradientLevel
): GradientConfig {
  return (
    GRADIENT_CONFIGS.find((g) => g.level === level) ??
    GRADIENT_CONFIGS[DEFAULT_GRADIENT_LEVEL]
  );
}

export function getPageBackgroundImage(themeId: SpotlightThemeId): string {
  switch (themeId) {
    case "nightDusk":
      return [
        "radial-gradient(circle at top left, rgba(129,140,248,0.22), transparent 55%)",
        "radial-gradient(circle at bottom right, rgba(56,189,248,0.18), transparent 55%)",
      ].join(", ");
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
