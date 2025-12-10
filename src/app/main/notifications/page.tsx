// src/app/main/notifications/page.tsx
"use client";

import { useState } from "react";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav, BottomNavKey } from "@/components/navigation/BottomNav";
import Link from "next/link";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("notifications");

  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.14), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Header */}
        <header className="mb-4 md:mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Notifications
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Your updates will appear here
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                In future versions, Everleap will surface new insights,
                helpful reminders, and updates based on your growth.
              </p>
            </div>

            <div className="hidden md:block">
              <AiGuideOrb
                subline="Soon this space will give you smart updates about your growth."
                onClick={() => {}}
              />
            </div>
          </div>

          {/* Quick Paths – glassy */}
          <div className="mt-4">
            <QuickPathsRow />
          </div>

          {/* Mobile AI Guide */}
          <div className="mt-3 md:hidden">
            <AiGuideOrb
              subline="Soon this space will give you smart updates about your growth."
              onClick={() => {}}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-5 shadow-xl backdrop-blur">
            <p className="text-sm text-slate-300">
              You don’t have any notifications yet.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              As Everleap learns more about you, this area will show updates
              such as new insights, profile changes, suggestions, and reminders.
            </p>
          </div>
        </main>
      </div>

      <BottomNav activeKey={activeTab} onChange={setActiveTab} />
    </div>
  );
}

/* ========= Quick paths row ========= */

function QuickPathsRow() {
  return (
    <div className="rounded-2xl border border-slate-500/40 bg-white/5 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-300">
        Quick paths
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <NavPill href="/main" label="Back to Spotlight" icon="🏠" tone="primary" />
        <NavPill href="/main/carousel" label="Explore your profile" icon="🧭" />
        <NavPill href="/main/questions" label="Tell your story" icon="✍️" />
        <NavPill href="/main/goals" label="Goals" icon="🎯" />
      </div>
    </div>
  );
}

/* ========= Nav pill ========= */

function NavPill({
  href,
  label,
  icon,
  disabled,
  tone = "default",
}: {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
  tone?: "default" | "primary";
}) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-medium border shadow-sm";

  if (disabled) {
    return (
      <span
        className={`${baseStyles} cursor-default border-slate-700/70 bg-slate-900/70 text-slate-500`}
      >
        <span className="text-sm">{icon}</span>
        <span>{label}</span>
      </span>
    );
  }

  const toneClasses =
    tone === "primary"
      ? "border-sky-400/80 bg-sky-500/20 text-sky-50 hover:bg-sky-500/30"
      : "border-slate-600/70 bg-slate-900/80 text-slate-100 hover:bg-slate-900";

  return (
    <Link href={href} className={`${baseStyles} ${toneClasses}`}>
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
