// src/app/main/actions/page.tsx
"use client";

import Link from "next/link";

import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function ActionsPage() {
  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.14), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Page header */}
        <header className="mb-4 md:mb-6">
          {/* Title + AI guide (desktop) */}
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Actions & habits
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Tiny moves that keep you moving forward
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                This space will become your short list of small, realistic
                actions that match your energy and current season—not a giant
                to-do list.
              </p>
            </div>

            {/* AI guide – desktop only */}
            <div className="hidden md:block">
              <AiGuideOrb
                subline="Ask Everleap for one tiny habit you could try this week."
                source="actions_page_orb"
              />
            </div>
          </div>

          {/* Quick paths row – full width under heading */}
          <div className="mt-4">
            <QuickPathsRow />
          </div>

          {/* AI guide – mobile (under quick paths) */}
          <div className="mt-3 md:hidden">
            <AiGuideOrb
              subline="Ask Everleap for one tiny habit you could try this week."
              source="actions_page_orb"
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          <section className="mt-2 md:mt-0">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4 shadow-xl backdrop-blur md:p-6">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-300/80">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 text-[0.75rem]">
                  Coming soon
                </span>
                <span>Actions from your goals</span>
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-50 md:text-lg">
                Soon you&apos;ll see simple, repeatable actions that flow from
                your goals and profile.
              </h2>

              <p className="mt-2 text-xs text-slate-400 md:text-sm">
                Think “one weekly check-in” or “one small experiment,” not a
                giant productivity system. Everleap will help you choose just a
                few things that actually fit your life.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <PlaceholderActionCard
                  label="Weekly check-in"
                  emoji="📅"
                  description="Reflect briefly on what worked, what didn&apos;t, and what to try next."
                />
                <PlaceholderActionCard
                  label="Tiny experiment"
                  emoji="🧪"
                  description="Try one small change in how you study, work, or rest—and see how it feels."
                />
                <PlaceholderActionCard
                  label="Support cue"
                  emoji="🤝"
                  description="Add one reminder to reach out to a person or community that supports you."
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500 md:text-sm">
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                  Built from your goals and profile
                </span>
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                  Focus on a few things, not everything
                </span>
              </div>
            </div>

            <p className="mt-3 text-[0.7rem] text-slate-500 md:mt-4">
              As Everleap learns what actually works for you, this Actions space
              will help you keep going without burning out.
            </p>
          </section>
        </main>
      </div>

      {/* Bottom nav (self-contained) */}
      <BottomNav />
    </div>
  );
}

/* ========= Quick paths row (reusing pattern from main pages) ========= */

function QuickPathsRow() {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-400">
        Quick paths
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <NavPill
          href="/main"
          label="Back to Spotlight"
          icon="🏠"
          tone="default"
        />
        <NavPill href="/main/carousel" label="Explore your profile" icon="🧭" />
        <NavPill href="/main/questions" label="Tell your story" icon="✍️" />
        <NavPill href="/main/goals" label="Goals" icon="🎯" />
        <NavPill
          href="/main/actions"
          label="Actions & habits (here)"
          icon="📅"
          tone="primary"
        />
      </div>
    </div>
  );
}

/* ========= Small nav pill component ========= */

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
      ? "border-sky-500/70 bg-sky-500/15 text-sky-100 hover:bg-sky-500/25"
      : "border-slate-700/70 bg-slate-900/80 text-slate-100 hover:bg-slate-900";

  return (
    <Link href={href} className={`${baseStyles} ${toneClasses}`}>
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

/* ========= Placeholder action card ========= */

function PlaceholderActionCard({
  label,
  emoji,
  description,
}: {
  label: string;
  emoji: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-3 text-sm text-slate-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="font-medium">{label}</span>
      </div>
      <p className="mt-2 text-[0.7rem] text-slate-400">{description}</p>
    </div>
  );
}
