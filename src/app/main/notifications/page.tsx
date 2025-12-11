// src/app/main/notifications/page.tsx
"use client";

import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Bell, Sparkles, Target, Clock } from "lucide-react";

type NotificationType = "insight" | "goal" | "checkin";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  badge: string;
};

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

export default function NotificationsPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.16), transparent 55%)",
      }}
    >
      <div className="relative flex min-h-screen flex-col">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-3xl" />
          <div className="absolute top-40 right-[-32px] h-72 w-72 rounded-full bg-sky-500/35 blur-3xl" />
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-24 pt-6 md:px-8 md:pt-10">
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Notifications
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                  Your updates will appear here
                </h1>
                <p className="mt-2 text-sm text-slate-200/85 md:text-base">
                  Everleap will surface small, useful updates—not spam. Think
                  new insights, gentle nudges, and check-ins that match your
                  energy.
                </p>

                {/* Mobile AI Guide */}
                <div className="mt-3 md:hidden">
                  <AiGuideOrb
                    subline="Ask Everleap how to use these updates to keep moving, not burn out."
                    source="notifications_page_orb"
                  />
                </div>
              </div>

              {/* Desktop AI Guide */}
              <div className="hidden md:block">
                <AiGuideOrb
                  subline="Ask Everleap how to use these updates to keep moving, not burn out."
                  source="notifications_page_orb"
                />
              </div>
            </div>
          </header>

          {/* Main content */}
          <section className="flex flex-1 flex-col gap-4">
            {/* Hero / empty-state panel (but still a bit glowy) */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 px-5 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.9)] backdrop-blur-xl md:px-6 md:py-5">
              <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
                <div className="absolute bottom-[-40px] left-[-20px] h-40 w-40 rounded-full bg-violet-500/25 blur-3xl" />
              </div>

              <div className="relative flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/70 bg-sky-500/10">
                  <Bell className="h-4 w-4 text-sky-300" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sky-300">
                    What this space is for
                  </p>
                  <p className="text-sm text-slate-100">
                    As Everleap learns more about you, you&apos;ll get short,
                    clear updates instead of a giant feed. You can always ignore
                    them—no pressure.
                  </p>
                  <p className="text-xs text-slate-400">
                    Below are a few sample notifications to show how this might
                    feel once your story and goals are in motion.
                  </p>
                </div>
              </div>
            </div>

            {/* Example notifications list */}
            <div className="mt-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Example notifications
                </span>
                <span className="flex items-center gap-1 text-[0.7rem] text-slate-400">
                  <Sparkles className="h-3 w-3 text-sky-300" />
                  <span>These are just mock examples for now</span>
                </span>
              </div>

              <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
                {mockNotifications.map((n) => (
                  <NotificationRow key={n.id} item={n} />
                ))}
              </div>

              <p className="mt-2 text-[0.7rem] text-slate-500">
                Later, you&apos;ll be able to control which types of updates you
                see—like only goal nudges, or only new insights.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom nav */}
        <BottomNav />
      </div>
    </div>
  );
}

/* ========= Notification row ========= */

function NotificationRow({ item }: { item: NotificationItem }) {
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
            <span className="text-[0.7rem] text-slate-400">{time}</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-50">{title}</p>
        <p className="text-xs text-slate-300">{body}</p>
      </div>
    </div>
  );
}
