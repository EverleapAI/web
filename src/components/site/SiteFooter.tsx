// apps/web/src/components/site/SiteFooter.tsx
"use client";

import * as React from "react";
import Link from "next/link";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Compatibility footer.
 * - Uses the same chrome CSS vars set by AppChrome when present.
 * - Falls back gracefully if rendered outside AppChrome.
 */
type SiteFooterProps = {
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>; // allow legacy props without `any`

export default function SiteFooter({ className, children }: SiteFooterProps) {
  const chromeBg = "var(--el-chrome-bg, rgba(255,255,255,0.03))";
  const chromeBorder = "var(--el-chrome-border, rgba(255,255,255,0.10))";
  const chromeHighlight = "var(--el-chrome-highlight, rgba(255,255,255,0.12))";
  const chromeShadow = "var(--el-chrome-shadow, 0 18px 60px rgba(0,0,0,0.18))";
  const chromeBlur = "var(--el-chrome-blur, 26px)";

  return (
    <footer
      className={cx("relative z-10 mt-10", className)}
      style={{
        background: chromeBg,
        boxShadow: chromeShadow,
        backdropFilter: `blur(${chromeBlur})`,
        WebkitBackdropFilter: `blur(${chromeBlur})`,
      }}
      aria-label="Site footer"
    >
      {/* Blend strip so it doesn't look like a separate component */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
        style={{ background: `linear-gradient(to top, ${chromeBg}, rgba(0,0,0,0))` }}
      />

      {/* One subtle highlight, no hard border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${chromeHighlight}, transparent)`,
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: chromeBorder, opacity: 0.35 }}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-meta leading-relaxed text-white/55">© {new Date().getFullYear()} Everleap</div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-meta font-semibold text-white/60">
          <Link className="transition hover:text-white/80" href="/privacy">
            Privacy
          </Link>
          <Link className="transition hover:text-white/80" href="/terms">
            Terms
          </Link>
          <Link className="transition hover:text-white/80" href="/support">
            Support
          </Link>
        </div>
      </div>

      {children ? <div className="mx-auto max-w-6xl px-4 pb-4">{children}</div> : null}
    </footer>
  );
}