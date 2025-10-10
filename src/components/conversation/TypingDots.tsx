"use client";

import * as React from "react";

type Props = {
  /** Optional extra classes (e.g., to tweak spacing) */
  className?: string;
  /** Accessible label announced by screen readers */
  ariaLabel?: string;
  /**
   * Visual size of each dot in px (default derived from CSS = 6px).
   * We scale the whole group so it stays in sync with the animation.
   */
  size?: number;
};

/**
 * Minimal animated “typing” indicator.
 * Uses the `.typing-dots` utility from globals.css.
 */
export default function TypingDots({
  className,
  ariaLabel = "Assistant is typing",
  size,
}: Props) {
  // Base CSS uses 6px dots; scale relatively if a custom size is provided.
  const scale = size ? size / 6 : 1;

  return (
    <div
      className={`typing-dots ${className ?? ""}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
    >
      <span />
      <span />
      <span />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
