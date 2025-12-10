// src/app/main/carousel/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  mainCarouselCards,
  type MainCarouselCard,
  type MainCardId,
} from "@/app/main/mainCarouselData";
import { MainCarousel } from "@/components/main/MainCarousel";
import { ContentPanel } from "@/components/main/ContentPanel";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav, BottomNavKey } from "@/components/navigation/BottomNav";
import { AiGuideModal } from "@/components/main/AiGuideModal";

// same mock user as Spotlight for now
const userName = "Tom";

export default function CarouselPage() {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("you");
  const [guideOpen, setGuideOpen] = useState(false);

  // Non-spotlight cards for this page
  const insightCards: MainCarouselCard[] = mainCarouselCards.filter(
    (c) => c.id !== "spotlight"
  );

  const [activeId, setActiveId] = useState<MainCardId>(
    (insightCards[0]?.id as MainCardId) ?? "strengths"
  );

  const activeCard =
    insightCards.find((card) => card.id === activeId) ?? insightCards[0];

  if (!activeCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-50">
        <p className="text-sm text-slate-300">
          Profile cards are not available yet.
        </p>
      </div>
    );
  }

  const guideSubtitle = `Hi ${userName}. We’re on your ${activeCard.title.toLowerCase()} card. Want to talk about how this fits you?`;

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
                About you
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Let&apos;s focus on {activeCard.title}
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                Swipe through the cards to explore different sides of who you
                are—motivations, strengths, skills, superpowers, friends,
                family, careers, and more.
              </p>
            </div>

            {/* AI guide – desktop only */}
            <div className="hidden md:block">
              <AiGuideOrb
                subline={activeCard.summary}
                onClick={() => setGuideOpen(true)}
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
              subline={activeCard.summary}
              onClick={() => setGuideOpen(true)}
            />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex flex-1 flex-col gap-6 md:flex-col md:gap-8">
          {/* Carousel row */}
          <section className="md:w-full">
            <MainCarousel
              cards={insightCards}
              activeId={activeId}
              onChangeActiveId={(id) => setActiveId(id)}
            />
          </section>

          {/* Panel for active card */}
          <section className="md:flex-1">
            <ContentPanel card={activeCard} />
          </section>
        </main>
      </div>

      <BottomNav activeKey={activeTab} onChange={setActiveTab} />

      {guideOpen && (
        <AiGuideModal
          onClose={() => setGuideOpen(false)}
          title="Profile cards"
          subtitle={guideSubtitle}
        />
      )}
    </div>
  );
}

/* ========= Quick paths row (reusing pattern from Spotlight) ========= */

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
          tone="primary"
        />
        <NavPill href="/main/questions" label="Tell your story" icon="✍️" />
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
