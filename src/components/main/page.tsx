// src/components/main/page.tsx
"use client";

import { useState } from "react";
import { MainCarousel } from "@/components/main/MainCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import {
  mainCarouselCards,
  type MainCardId,
} from "@/app/main/mainCarouselData";

export default function MainPage() {
  const [activeCardId, setActiveCardId] = useState<MainCardId>("spotlight");

  return (
    <main className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-4 pb-20 pt-6 md:px-8 md:pb-24 md:pt-10">
        <MainCarousel
          cards={mainCarouselCards}
          activeId={activeCardId}
          onChangeActiveId={setActiveCardId}
        />
      </div>

      {/* New self-contained bottom nav */}
      <BottomNav />
    </main>
  );
}

interface PlaceholderPanelProps {
  title: string;
  subtitle: string;
  body: string;
}

function PlaceholderPanel({ title, subtitle, body }: PlaceholderPanelProps) {
  return (
    <section className="mt-4 flex-1 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:p-7">
      <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-200/85">{subtitle}</p>
      <p className="mt-4 max-w-2xl text-sm text-slate-200/80">{body}</p>
    </section>
  );
}
