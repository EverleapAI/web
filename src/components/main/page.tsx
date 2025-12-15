// src/components/main/page.tsx
"use client";

import { useState } from "react";
import { MainCarousel } from "@/components/main/MainCarousel";
import { BottomNav } from "@/components/navigation/BottomNav";
import { mainCarouselCards, type MainCardId } from "@/app/main/mainCarouselData";

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

      <BottomNav />
    </main>
  );
}
