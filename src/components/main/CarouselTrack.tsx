// src/components/main/CarouselTrack.tsx
"use client";

import { useCallback } from "react";
import type { MainCarouselCard } from "@/app/(app)/main/mainCarouselData";
import { CarouselCard } from "./CarouselCard";
import { useCarouselInteractions } from "./useCarouselInteractions";
import { motion, type PanInfo } from "framer-motion";

interface CarouselTrackProps {
  cards: MainCarouselCard[];
  activeIndex: number;
  onChangeActiveIndex: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CARD_SPACING = 184; // approximate width + gap of each card

// Match Framer Motion's pan handler signature so we don't need `any`
type DragHandler = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo
) => void;

export function CarouselTrack({
  cards,
  activeIndex,
  onChangeActiveIndex,
  onNext,
  onPrevious,
}: CarouselTrackProps) {
  const handleCardClick = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      onChangeActiveIndex(index);
    },
    [activeIndex, onChangeActiveIndex]
  );

  const dragHandlers = useCarouselInteractions({
    onNext,
    onPrevious,
    sensitivity: 60,
  }) as {
    onDragStart: DragHandler;
    onDragEnd: DragHandler;
  };

  // Position the track so that the active card is visually near the center.
  const xOffset = -activeIndex * CARD_SPACING;

  return (
    <div className="relative flex w-full select-none items-center justify-center py-4">
      {/* Desktop arrow controls */}
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-0 hidden h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-300 shadow hover:bg-slate-800/80 md:flex"
      >
        ←
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-0 hidden h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-300 shadow hover:bg-slate-800/80 md:flex"
      >
        →
      </button>

      {/* Track container */}
      <div className="flex w-full items-center justify-center overflow-x-hidden px-6">
        <motion.div
          className="flex items-center gap-4"
          drag="x"
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={dragHandlers.onDragStart}
          onDragEnd={dragHandlers.onDragEnd}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          {cards.map((card, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={card.id}
                className="flex-shrink-0"
                onClick={() => handleCardClick(index)}
              >
                <CarouselCard card={card} isActive={isActive} />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
