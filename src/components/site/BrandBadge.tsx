"use client";

import Link from "next/link";
import * as React from "react";

type Props = {
  /** Optional link target (defaults to home) */
  href?: string;
  /** Accessible label for the link */
  ariaLabel?: string;

  /** Top/left offset (px) for fixed positioning */
  top?: number;
  left?: number;

  /** Extra classes for the outer wrapper */
  className?: string;

  /** Inline style overrides merged with top/left */
  style?: React.CSSProperties;
};

/**
 * BrandBadge
 * - Small fixed “chip” you can park in a corner.
 * - Uses translucent glass with a white pill + EL monogram.
 * - Keeps types tight; no `any`.
 */
export default function BrandBadge({
  href = "/",
  ariaLabel = "Everleap home",
  top = 16,
  left = 16,
  className,
  style,
}: Props) {
  return (
    <div
      className={`fixed z-20 ${className ?? ""}`}
      style={{ top, left, ...style }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className="
          inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold
          text-white shadow-sm border border-white/20
          bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10
          hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
          transition-colors
        "
      >
        <span
          aria-hidden="true"
          className="
            inline-flex size-6 items-center justify-center rounded-md
            bg-white text-slate-900 text-micro font-bold
          "
        >
          EL
        </span>
        <span className="sr-only md:not-sr-only">Everleap</span>
      </Link>
    </div>
  );
}
