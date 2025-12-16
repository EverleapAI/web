// src/app/main/notifications/page.tsx
"use client";

import * as React from "react";
import { Sparkles, Target, Clock3, Bell, ArrowRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

/* =========================
   Guide helper (shared event)
========================= */

function openGuide(detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "notifications", ...(detail ?? {}) },
    })
  );
}

/* =========================
   Types + mock data
========================= */

type NotificationType = "insight" | "goal" | "checkin";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  badge: string;
  unread?: boolean;
};

const mockNotifications: NotificationItem[] = [
  {
    id: "insight-1",
    type: "insight",
    title: "New insight about your motivations",
    body: "You stay most engaged when you can see progress in small steps. Want to try a 3-day test built around that?",
    time: "Just now",
    badge: "New insight",
    unread: true,
  },
  {
    id: "goal-1",
    type: "goal",
    title: "Goal nudge: Try your 3-day focus test",
    body: "You picked a tiny experiment around focus. How would doing one 20-minute no-phone block today feel?",
    time: "Today · 3:15 pm",
    badge: "Goal nudge",
    unread: true,
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

/* =========================
   Small style helpers (match Goals/Actions)
========================= */

function sectionLabelClass(dark: boolean) {
  return dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/70"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-500";
}

function mutedTextClass(dark: boolean) {
  return dark ? "text-slate-300/90" : "text-slate-600";
}

function badgeTone(type: NotificationType, dark: boolean) {
  // keep it subtle + consistent
  if (dark) {
    if (type === "insight")
      return "border-violet-400/70 bg-violet-500/15 text-violet-100";
    if (type === "goal")
      return "border-sky-400/70 bg-sky-500/15 text-sky-100";
    return "border-emerald-400/70 bg-emerald-500/15 text-emerald-100";
  }
  if (type === "insight")
    return "border-violet-300 bg-violet-50 text-violet-700";
  if (type === "goal") return "border-sky-300 bg-sky-50 text-sky-700";
  return "border-emerald-300 bg-emerald-50 text-emerald-700";
}

function iconForType(type: NotificationType) {
  const cls = "h-4 w-4";
  if (type === "insight") return <Sparkles className={cls} />;
  if (type === "goal") return <Target className={cls} />;
  return <Clock3 className={cls} />;
}

/* =========================
   Page
========================= */

export default function NotificationsPage() {
  // Shared AppChrome visual state (same as Goals/Actions)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // local UI state (demo)
  const [items, setItems] = React.useState<NotificationItem[]>(mockNotifications);

  // Surface styles match Goals
  const cardShadow = dark
    ? "shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
    : "shadow-[0_16px_45px_rgba(0,0,0,0.18)]";
  const surface = `${theme.cardBgClass} ${theme.cardBorderClass} ${cardShadow} backdrop-blur-xl`;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="notifications_orb"
      ambientCap={0.35}
    >
      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-5 md:px-8 md:pt-7">
          {/* =========================
              HEADER
             ========================= */}
          <section className={`relative rounded-[32px] border px-5 py-5 sm:px-7 sm:py-6 ${surface}`}>
            {gradientLevel > 0 && (
              <div
                className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
                style={{ opacity: 0.18 }}
              />
            )}

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                      dark ? "bg-white/10 text-slate-100" : "bg-slate-900/5 text-slate-900"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className={`${sectionLabelClass(dark)} opacity-90`}>Notifications</div>
                </div>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Smart updates, not spam
                </h1>

                <p className={`mt-2 max-w-2xl text-sm ${mutedTextClass(dark)}`}>
                  Everleap sends short updates that match your energy—nudges, insights, and quick check-ins.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openGuide({
                        source: "notifications_what_is_this",
                        prompt:
                          "Explain what Notifications are in Everleap in a friendly, teen-appropriate way. Keep it short and helpful.",
                      })
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                      dark
                        ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Ask the Guide <ArrowRight className="h-4 w-4 opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={markAllRead}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                      dark
                        ? "border-white/10 bg-slate-950/35 text-slate-100 hover:bg-slate-950/55"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Mark all read
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                      dark
                        ? "border-white/10 bg-slate-950/35 text-slate-100 hover:bg-slate-950/55"
                        : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              LIST
             ========================= */}
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className={`${sectionLabelClass(dark)} opacity-90`}>Updates</div>
                <div className={`mt-1 text-sm ${mutedTextClass(dark)}`}>
                  Tap one to get help turning it into a tiny next step.
                </div>
              </div>

              <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-500"}`}>
                {items.length} total
              </div>
            </div>

            {items.length === 0 ? (
              <div className={`rounded-[28px] border px-5 py-6 text-center ${surface}`}>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Bell className="h-5 w-5 opacity-80" />
                </div>
                <div className="mt-3 text-base font-semibold">You’re all caught up.</div>
                <p className={`mt-1 text-sm ${mutedTextClass(dark)}`}>
                  When Everleap learns something useful, it’ll show up here.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openGuide({
                        source: "notifications_caught_up",
                        prompt:
                          "Give me ONE tiny habit or micro-task to do right now (under 5 minutes) that helps my goals.",
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-300/35 transition hover:bg-sky-200 active:scale-95"
                  >
                    Give me a tiny move <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`overflow-hidden rounded-[28px] border ${surface}`}>
                <div className="divide-y divide-white/10">
                  {items.map((n) => (
                    <NotificationRow
                      key={n.id}
                      item={n}
                      dark={dark}
                      onOpen={() =>
                        openGuide({
                          source: "notifications_open",
                          notification: n,
                          prompt:
                            "User opened a notification. Respond like a coach: summarize it in 1 sentence, then offer ONE tiny next step and ask if they want to do it now.",
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="h-6" />
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}

/* =========================
   Row component
========================= */

function NotificationRow({
  item,
  dark,
  onOpen,
}: {
  item: NotificationItem;
  dark: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full px-4 py-4 text-left transition md:px-5 md:py-4 ${
        dark ? "hover:bg-white/5" : "hover:bg-slate-900/5"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border ${
            dark
              ? "border-white/10 bg-slate-950/35 text-slate-100"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          {iconForType(item.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${badgeTone(
                  item.type,
                  dark
                )}`}
              >
                {item.badge}
              </span>

              <span className={`text-[0.7rem] ${dark ? "text-slate-300/60" : "text-slate-500"}`}>
                {item.time}
              </span>

              {item.unread ? (
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    dark ? "bg-sky-300" : "bg-sky-500"
                  }`}
                  aria-label="Unread"
                  title="Unread"
                />
              ) : null}
            </div>
          </div>

          <div className={`mt-1 text-sm font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
            {item.title}
          </div>

          <div className={`mt-1 text-sm ${mutedTextClass(dark)}`}>{item.body}</div>

          <div className={`mt-3 text-[0.7rem] ${dark ? "text-slate-300/55" : "text-slate-500"}`}>
            Tap to turn this into a tiny next step →
          </div>
        </div>
      </div>
    </button>
  );
}
