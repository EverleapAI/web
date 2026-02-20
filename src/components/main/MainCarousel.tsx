// src/components/main/MainCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type MainCarouselCard,
  type MainCardId,
} from "@/app/(app)/main/mainCarouselData";
import { CarouselCard } from "@/components/main/CarouselCard";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type MainCarouselProps = {
  cards: MainCarouselCard[];
  activeId: MainCardId;
  onChangeActiveId: (id: MainCardId) => void;
};

/* ===== Accent styling per card (bold & colorful) ===== */

type AccentConfig = {
  halo: string;
  frame: string;
  tipBg: string;
  tipBorder: string;
  tipText: string;
  arrowBg: string;
  arrowBorder: string;
};

const defaultAccent: AccentConfig = {
  halo: "from-sky-400/20 via-fuchsia-500/20 to-emerald-400/15",
  frame:
    "border-sky-400/60 shadow-[0_0_36px_rgba(56,189,248,0.45)] shadow-sky-400/40",
  tipBg: "bg-gradient-to-r from-sky-400/20 via-fuchsia-500/25 to-emerald-400/20",
  tipBorder: "border-sky-300/70",
  tipText: "text-sky-50",
  arrowBg: "bg-sky-400/90",
  arrowBorder: "border-sky-300/90",
};

const accentMap: Partial<Record<MainCardId, AccentConfig>> = {
  motivations: {
    halo: "from-amber-400/25 via-fuchsia-500/20 to-sky-400/15",
    frame:
      "border-amber-400/70 shadow-[0_0_40px_rgba(251,191,36,0.55)] shadow-amber-400/40",
    tipBg: "bg-gradient-to-r from-amber-400/20 via-orange-500/25 to-pink-500/25",
    tipBorder: "border-amber-300/70",
    tipText: "text-amber-50",
    arrowBg: "bg-amber-400/90",
    arrowBorder: "border-amber-300/90",
  },
  strengths: {
    halo: "from-sky-400/25 via-cyan-400/20 to-emerald-400/15",
    frame:
      "border-sky-400/70 shadow-[0_0_40px_rgba(56,189,248,0.55)] shadow-sky-400/40",
    tipBg: "bg-gradient-to-r from-sky-400/20 via-cyan-500/25 to-emerald-400/25",
    tipBorder: "border-sky-300/70",
    tipText: "text-sky-50",
    arrowBg: "bg-sky-400/90",
    arrowBorder: "border-sky-300/90",
  },
  skills: {
    halo: "from-emerald-400/25 via-teal-400/20 to-sky-400/15",
    frame:
      "border-emerald-400/70 shadow-[0_0_40px_rgba(52,211,153,0.55)] shadow-emerald-400/40",
    tipBg:
      "bg-gradient-to-r from-emerald-400/20 via-teal-500/25 to-sky-400/25",
    tipBorder: "border-emerald-300/70",
    tipText: "text-emerald-50",
    arrowBg: "bg-emerald-400/90",
    arrowBorder: "border-emerald-300/90",
  },
  superpowers: {
    halo: "from-fuchsia-400/25 via-violet-500/25 to-indigo-400/15",
    frame:
      "border-fuchsia-400/70 shadow-[0_0_40px_rgba(232,121,249,0.55)] shadow-fuchsia-400/40",
    tipBg:
      "bg-gradient-to-r from-fuchsia-400/20 via-violet-500/25 to-indigo-400/25",
    tipBorder: "border-fuchsia-300/70",
    tipText: "text-fuchsia-50",
    arrowBg: "bg-fuchsia-400/90",
    arrowBorder: "border-fuchsia-300/90",
  },
  friends: {
    halo: "from-rose-400/25 via-orange-400/20 to-amber-300/15",
    frame:
      "border-rose-400/70 shadow-[0_0_40px_rgba(251,113,133,0.55)] shadow-rose-400/40",
    tipBg:
      "bg-gradient-to-r from-rose-400/20 via-orange-500/25 to-amber-300/25",
    tipBorder: "border-rose-300/70",
    tipText: "text-rose-50",
    arrowBg: "bg-rose-400/90",
    arrowBorder: "border-rose-300/90",
  },
  family: {
    halo: "from-purple-400/25 via-sky-400/20 to-emerald-300/15",
    frame:
      "border-purple-400/70 shadow-[0_0_40px_rgba(192,132,252,0.55)] shadow-purple-400/40",
    tipBg:
      "bg-gradient-to-r from-purple-400/20 via-sky-500/25 to-emerald-300/25",
    tipBorder: "border-purple-300/70",
    tipText: "text-purple-50",
    arrowBg: "bg-purple-400/90",
    arrowBorder: "border-purple-300/90",
  },
  careers: {
    halo: "from-indigo-400/25 via-sky-400/20 to-emerald-300/15",
    frame:
      "border-indigo-400/70 shadow-[0_0_40px_rgba(129,140,248,0.55)] shadow-indigo-400/40",
    tipBg:
      "bg-gradient-to-r from-indigo-400/20 via-sky-500/25 to-emerald-300/25",
    tipBorder: "border-indigo-300/70",
    tipText: "text-indigo-50",
    arrowBg: "bg-indigo-400/90",
    arrowBorder: "border-indigo-300/90",
  },
  education: {
    halo: "from-emerald-400/25 via-sky-400/20 to-violet-300/15",
    frame:
      "border-emerald-300/70 shadow-[0_0_40px_rgba(74,222,128,0.55)] shadow-emerald-300/40",
    tipBg:
      "bg-gradient-to-r from-emerald-400/20 via-sky-500/25 to-violet-300/25",
    tipBorder: "border-emerald-200/80",
    tipText: "text-emerald-50",
    arrowBg: "bg-emerald-300/90",
    arrowBorder: "border-emerald-200/90",
  },
};

/* ===== Coach tips (slightly more playful) ===== */

const coachTips: Partial<Record<MainCardId, string>> = {
  motivations:
    "Notice when you feel secretly energized vs. secretly drained. Those signals are more honest than what you ‘should’ care about.",
  strengths:
    "Your strengths are where you create big impact with less burnout. Aim them at problems you actually care about.",
  skills:
    "Pick one or two skills to level up at a time. Tiny consistent reps beat monster study sessions.",
  superpowers:
    "Your superpowers aren’t just talents—they’re how the room changes when you’re fully yourself.",
  friends:
    "Notice who you feel more like yourself around. That’s your real squad, even if it’s small.",
  family:
    "You can learn from your family without copying every chapter of their story. You get to remix it.",
  careers:
    "Think of careers like experiments, not a final answer. Every step is data about what fits you better.",
  education:
    "School is one track, not the whole map. The real game is finding ways to learn that actually stick.",
};

export function MainCarousel({
  cards,
  activeId,
  onChangeActiveId,
}: MainCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = useMemo(() => {
    const idx = cards.findIndex((c) => c.id === activeId);
    return idx === -1 ? 0 : idx;
  }, [cards, activeId]);

  const activeCard: MainCarouselCard = cards[activeIndex] ?? cards[0];
  const activeTip = coachTips[activeCard.id];
  const accent: AccentConfig = accentMap[activeCard.id] ?? defaultAccent;

  // Track which areas the user has visited (for a tiny progress indicator)
  const [visited, setVisited] = useState<Set<MainCardId>>(
    () => new Set<MainCardId>([activeCard.id])
  );

  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(activeCard.id)) return prev;
      const next = new Set(prev);
      next.add(activeCard.id);
      return next;
    });
  }, [activeCard.id]);

  const total = cards.length;
  const visitedCount = visited.size;
  const progress = total > 0 ? Math.max(10, (visitedCount / total) * 100) : 0; // min 10% so bar is visible

  // Smoothly center the active card whenever it changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const el = container.querySelector<HTMLElement>(
      `[data-card-id="${activeCard.id}"]`
    );
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCard.id]);

  const selectByIndex = (index: number) => {
    if (!cards.length) return;
    const safeIndex = ((index % cards.length) + cards.length) % cards.length;
    const nextCard = cards[safeIndex];
    if (nextCard && nextCard.id !== activeId) {
      onChangeActiveId(nextCard.id);
    }
  };

  const handleNext = () => selectByIndex(activeIndex + 1);
  const handlePrev = () => selectByIndex(activeIndex - 1);

  if (!cards || cards.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 text-xs text-slate-400">
        No profile cards available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-5">
      {/* Colorful framed carousel container (glass-ish) */}
      <section
        className={cn(
          "relative overflow-hidden rounded-[1.8rem] border bg-slate-950/85 px-3 py-4 md:px-4 md:py-5",
          "shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-xl",
          accent.frame
        )}
      >
        {/* Glowing color halo behind the cards */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-[-30%] top-[-40%] h-[260%] opacity-70 blur-3xl",
            "bg-gradient-to-br",
            accent.halo
          )}
        />

        {/* Foreground content */}
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          {/* Left arrow (desktop) */}
          <button
            type="button"
            onClick={handlePrev}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-full border text-slate-950 shadow-lg md:flex",
              accent.arrowBg,
              accent.arrowBorder
            )}
            aria-label="Previous section"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto pb-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex min-w-max gap-3 md:gap-4">
              {cards.map((card) => {
                const isActive = card.id === activeCard.id;

                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    onClick={() => onChangeActiveId(card.id)}
                    data-card-id={card.id}
                    className={cn(
                      "shrink-0 rounded-[1.6rem] snap-center",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    )}
                    whileHover={{ scale: 1.03 }}
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <CarouselCard card={card} isActive={isActive} />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right arrow (desktop) */}
          <button
            type="button"
            onClick={handleNext}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-full border text-slate-950 shadow-lg md:flex",
              accent.arrowBg,
              accent.arrowBorder
            )}
            aria-label="Next section"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Coach tip bubble under carousel – bigger, colorful, glassy */}
      <AnimatePresence mode="wait">
        {activeTip && (
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "inline-flex max-w-2xl items-center gap-3 rounded-2xl border px-4 py-2.5 text-xs shadow-lg backdrop-blur-xl",
              accent.tipBg,
              accent.tipBorder,
              accent.tipText
            )}
          >
            <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black/40 text-[0.8rem]">
              💡
            </span>
            <span className="leading-snug">{activeTip}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiny progress / “areas explored” strip */}
      <div className="flex items-center gap-3 text-[0.7rem] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-sky-400"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-[0.7rem] text-slate-300">
            Explored {visitedCount} / {total} areas
          </span>
        </div>
      </div>
    </div>
  );
}
