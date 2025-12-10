// src/app/main/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mainCarouselCards,
  type SpotlightCard,
} from "@/app/main/mainCarouselData";
import { SpotlightPanel } from "@/components/main/ContentPanel";
import { BottomNav, BottomNavKey } from "@/components/navigation/BottomNav";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { AiGuideModal } from "@/components/main/AiGuideModal";

const spotlightCard = mainCarouselCards.find(
  (c) => c.id === "spotlight"
) as SpotlightCard | undefined;

// For now, hard-code the user name.
const userName = "Tom";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("you");
  const [guideOpen, setGuideOpen] = useState(false);

  if (!spotlightCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-50">
        <p className="text-sm text-slate-300">
          Spotlight data is not available yet.
        </p>
      </div>
    );
  }

  const guideSubtitle = `Hi ${userName}. We’re looking at your Spotlight right now. What would you like to talk about?`;

  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.14), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Top hero / greeting */}
        <header className="mb-4 md:mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Welcome back
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Today&apos;s Spotlight
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                This is your home base. Start with these small moves, then
                branch out to explore your strengths, motivations, and future
                paths.
              </p>
            </div>

            {/* AI guide – desktop */}
            <div className="hidden md:block">
              <AiGuideOrb
                subline={spotlightCard.summary}
                onClick={() => setGuideOpen(true)}
              />
            </div>
          </div>

          {/* Quick paths */}
          <div className="mt-4">
            <QuickPathsRow />
          </div>

          {/* AI guide – mobile */}
          <div className="mt-3 md:hidden">
            <AiGuideOrb
              subline={spotlightCard.summary}
              onClick={() => setGuideOpen(true)}
            />
          </div>
        </header>

        {/* Main spotlight */}
        <main className="flex flex-1 flex-col">
          <SpotlightPanel card={spotlightCard} />
        </main>

        <div className="mt-4 text-[0.7rem] text-slate-500 md:mt-6">
          <span>
            As we learn more about you, this Spotlight screen will update with
            smarter suggestions for what to focus on next.
          </span>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav activeKey={activeTab} onChange={setActiveTab} />

      {/* AI Guide modal */}
      {guideOpen && (
        <AiGuideModal
          onClose={() => setGuideOpen(false)}
          title="Spotlight"
          subtitle={guideSubtitle}
        />
      )}
    </div>
  );
}

/* ========= Quick paths row ========= */

function QuickPathsRow() {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-400">
        Quick paths
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <NavPill
          href="/main/questions"
          label="Tell your story"
          icon="✍️"
          tone="primary"
        />
        <NavPill href="/main/carousel" label="Explore your profile" icon="🧭" />
        <NavPill href="/main/goals" label="Goals" icon="🎯" />
        <NavPill
          href="#"
          label="Actions & habits (soon)"
          icon="📅"
          disabled
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
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-medium border shadow-sm";

  if (disabled) {
    return (
      <span
        className={`${base} cursor-default border-slate-700/70 bg-slate-900/70 text-slate-500`}
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
    <Link href={href} className={`${base} ${toneClasses}`}>
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
