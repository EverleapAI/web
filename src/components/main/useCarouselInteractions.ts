// src/components/main/useCarouselInteractions.ts
"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseCarouselInteractionsProps {
  onNext: () => void;
  onPrevious: () => void;
  sensitivity?: number; // drag distance required to flip (px)
}

/**
 * Adds drag/swipe + keyboard arrow interactions for the carousel.
 * This hook does not render anything — it only exposes handlers.
 *
 * It is designed to be used inside CarouselTrack and applied to the motion.div track.
 */
export function useCarouselInteractions({
  onNext,
  onPrevious,
  sensitivity = 60,
}: UseCarouselInteractionsProps) {
  const dragStartX = useRef<number | null>(null);

  /* -------------------------
   *  KEYBOARD NAVIGATION
   * ------------------------- */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevious();
      }
    },
    [onNext, onPrevious]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* -------------------------
   *  DRAG / SWIPE HANDLERS
   * ------------------------- */

  // Called when user starts dragging
  const onDragStart = useCallback((event: PointerEvent | MouseEvent | TouchEvent, info: { point: { x: number } }) => {
    dragStartX.current = info.point.x;
  }, []);

  // Called when user finishes dragging
  const onDragEnd = useCallback(
    (event: PointerEvent | MouseEvent | TouchEvent, info: { point: { x: number } }) => {
      if (dragStartX.current === null) return;

      const deltaX = info.point.x - dragStartX.current;

      // Quick flick sensitivity threshold
      if (Math.abs(deltaX) > sensitivity) {
        if (deltaX < 0) onNext(); // swipe left → next card
        else onPrevious();        // swipe right → previous card
      }

      dragStartX.current = null;
    },
    [onNext, onPrevious, sensitivity]
  );

  return {
    onDragStart,
    onDragEnd,
  };
}
