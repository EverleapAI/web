// src/app/main/notifications/page.tsx
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Sparkles, Target, Clock } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { CoachIntroModal } from "@/components/main/CoachIntroModal";

/* ========= Types ========= */

type NotificationType = "insight" | "goal" | "checkin";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  badge: string;
};

type SpotlightThemeId =
  | "nightDusk"
  | "berrySoft"
  | "forestSoft"
  | "warmSand"
  | "coolNotebook"
  | "cleanPaper";

type GradientLevel = 0 | 1 | 2 | 3 | 4 | 5;

type NotificationsTheme = {
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

type GradientConfig = {
  level: GradientLevel;
  ambientOpacity: number;
};

/* ========= Mock data ========= */

const mockNotifications: NotificationItem[] = [
  {
    id: "insight-1",
    type: "insight",
    title: "New insight about your motivations",
    body: "You stay most engaged when you can see progress in small steps. Want to try a 3-day test built around that?",
    time: "Just now",
    badge: "New insight",
  },
  {
    id: "goal-1",
    type: "goal",
    title: "Goal nudge: Try your 3-day focus test",
    body: "You picked a tiny experiment around focus. How would doing one 20-minute no-phone block today feel?",
    time: "Today · 3:15 pm",
    badge: "Goal nudge",
  },
  {
    id: "checkin-1",
    type: "checkin",
    title: "Weekly check-in suggestion",
    body: "It might be a good night to share one win + one stress with someone you trust.",
    time: "Yesterday · 8:02 pm",
    badge: "Support check-in",
  },
];

/* ========= Themes (aligned with other pages) ========= */

const NOTIFICATION_THEMES: NotificationsTheme[] = [
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

const GRADIENT_CONFIGS: GradientConfig[] = [
  { level: 0, ambientOpacity: 0 },
  { level: 1, ambientOpacity: 0.1 },
  { level: 2, ambientOpacity: 0.18 },
  { level: 3, ambientOpacity: 0.3 },
  { level: 4, ambientOpacity: 0.45 },
  { level: 5, ambientOpacity: 0.6 },
];

/* ========= Bg helper ========= */

function getPageBackgroundImage(themeId: SpotlightThemeId): string {
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

/* ========= Toggles ========= */

type ThemeToggleProps = {
  activeId: SpotlightThemeId;
  onChange: (id: SpotlightThemeId) => void;
};

function ThemeToggle({ activeId, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {NOTIFICATION_THEMES.map((theme) => {
        const isActive = theme.id === activeId;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`h-5 w-5 rounded-full transition ${
              isActive
                ? "bg-sky-300 shadow-sm shadow-sky-300/60"
                : "bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={theme.label}
          />
        );
      })}
    </div>
  );
}

type GradientToggleProps = {
  activeLevel: GradientLevel;
  onChange: (level: GradientLevel) => void;
};

function GradientToggle({ activeLevel, onChange }: GradientToggleProps) {
  const levels: GradientLevel[] = [0, 1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 bg-slate-950/70 px-1 py-1 text-[0.65rem] shadow-sm md:bg-slate-900/70">
      {levels.map((level) => {
        const isActive = level === activeLevel;
        const isZero = level === 0;

        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex items-center justify-center rounded-full transition ${
              isZero
                ? isActive
                  ? "h-4 w-4 border border-amber-300 bg-transparent"
                  : "h-4 w-4 border border-slate-600/80 bg-transparent hover:border-slate-400"
                : isActive
                ? "h-4 w-4 bg-amber-300 shadow-sm shadow-amber-300/60"
                : "h-4 w-4 bg-slate-800/80 hover:bg-slate-700/80"
            }`}
            aria-label={
              isZero ? "No gradient" : `Gradient level ${level}`
            }
          />
        );
      })}
    </div>
  );
}

/* ========= Guide opener ========= */

function openGuide() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "notifications_header_orb" },
    })
  );
}

/* ========= Helpers ========= */

function titleTextClass(isDark: boolean) {
  return isDark ? "text-slate-50" : "text-slate-900";
}

function bodyTextClass(isDark: boolean) {
  return isDark ? "text-slate-300" : "text-slate-600";
}

function timeTextClass(isDark: boolean) {
  return isDark ? "text-slate-400" : "text-slate-500";
}

/* ========= Main page ========= */

export default function NotificationsPage() {
  const [themeId, setThemeId] =
    useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] =
    useState<GradientLevel>(3);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const theme =
    NOTIFICATION_THEMES.find((t) => t.id === themeId) ??
    NOTIFICATION_THEMES[0];
  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[3];

  const pageBgImage =
    gradientLevel === 0 ? undefined : getPageBackgroundImage(theme.id);

  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  const isDarkTheme = theme.id === "nightDusk";

  const listCardBase = isDarkTheme
    ? "border-slate-800/80 bg-slate-950/85 shadow-[0_18px_60px_rgba(0,0,0,0.8)]"
    : "border-slate-200 bg-white/95 shadow-sm";

  return (
    <>
      {/* Intro modal explaining Notifications */}
      <CoachIntroModal
        open={showIntro}
        onClose={() => setShowIntro(false)}
        subtitle="This is your Updates space. Everleap sends short, useful updates that match your energy."
        enableTyping
      />

      <div
        className={`min-h-screen ${theme.pageBgBaseClass}`}
        style={pageBgStyle}
      >
        <div className="relative flex min-h-screen flex-col">
          {/* Ambient blobs */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: gradient.ambientOpacity }}
          >
            <div
              className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
            />
            <div
              className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
            />
          </div>

          <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-8">
            {/* Header */}
            <header className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className={theme.sectionLabelClass}>
                  Notifications
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                  Smart updates, not spam
                </h1>
                <p
                  className={`mt-2 max-w-xl text-sm ${theme.pageTextMutedClass}`}
                >
                  Everleap sends short, useful updates that match your
                  energy.
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                <ThemeToggle
                  activeId={themeId}
                  onChange={setThemeId}
                />
                <GradientToggle
                  activeLevel={gradientLevel}
                  onChange={setGradientLevel}
                />

                {/* Simple Guide orb */}
                <button
                  type="button"
                  onClick={openGuide}
                  className="group relative mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-fuchsia-400 to-amber-300 shadow-lg shadow-sky-400/40 transition-transform duration-200 hover:scale-110 md:mt-0"
                  aria-label="Open Everleap Guide"
                >
                  <span className="absolute inset-0 rounded-full bg-sky-400/30 blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-slate-50">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </header>

            {/* Example notifications only */}
            <section className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Example notifications
                </span>
              </div>

              <div
                className={`divide-y rounded-2xl border ${listCardBase}`}
              >
                {mockNotifications.map((n) => (
                  <NotificationRow
                    key={n.id}
                    item={n}
                    isDark={isDarkTheme}
                  />
                ))}
              </div>
            </section>
          </main>

          <BottomNav />
        </div>
      </div>
    </>
  );
}

/* ========= Notification row ========= */

function NotificationRow({
  item,
  isDark,
}: {
  item: NotificationItem;
  isDark: boolean;
}) {
  const { type, title, body, time, badge } = item;

  const icon =
    type === "insight" ? (
      <Sparkles className="h-4 w-4" />
    ) : type === "goal" ? (
      <Target className="h-4 w-4" />
    ) : (
      <Clock className="h-4 w-4" />
    );

  const badgeTone =
    type === "insight"
      ? "border-violet-400/70 bg-violet-500/10 text-violet-100"
      : type === "goal"
      ? "border-sky-400/70 bg-sky-500/10 text-sky-100"
      : "border-emerald-400/70 bg-emerald-500/10 text-emerald-100";

  return (
    <div className="flex gap-3 px-4 py-4 md:px-5 md:py-4">
      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 text-slate-100">
        {icon}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${badgeTone}`}
            >
              {badge}
            </span>
            <span
              className={`text-[0.7rem] ${timeTextClass(isDark)}`}
            >
              {time}
            </span>
          </div>
        </div>

        <p className={`text-sm font-semibold ${titleTextClass(isDark)}`}>
          {title}
        </p>
        <p className={`text-xs ${bodyTextClass(isDark)}`}>{body}</p>
      </div>
    </div>
  );
}
