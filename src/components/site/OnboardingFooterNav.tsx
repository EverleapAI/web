// apps/web/src/components/site/OnboardingFooterNav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Compatibility onboarding footer nav.
 * - Uses AppChrome CSS vars if available.
 * - Fixed, safe-area aware.
 */
export type OnboardingFooterNavProps = {
  className?: string;
  /** If legacy pages pass a "backHref", we honor it; otherwise router.back() */
  backHref?: string;
  /** If legacy pages pass a "rightHref", we show it (ex: "Skip", "Sign in") */
  rightHref?: string;
  /** Right label override */
  rightLabel?: string;
  /** Hide back button */
  hideBack?: boolean;
  children?: React.ReactNode;
} & Record<string, unknown>; // allow legacy props without `any`

export function OnboardingFooterNav({
  className,
  backHref,
  rightHref,
  rightLabel = "Skip",
  hideBack,
  children,
}: OnboardingFooterNavProps) {
  const router = useRouter();

  const chromeBg = "var(--el-chrome-bg, rgba(255,255,255,0.03))";
  const chromeBorder = "var(--el-chrome-border, rgba(255,255,255,0.10))";
  const chromeHighlight = "var(--el-chrome-highlight, rgba(255,255,255,0.12))";
  const chromeShadow = "var(--el-chrome-shadow, 0 18px 60px rgba(0,0,0,0.18))";
  const chromeBlur = "var(--el-chrome-blur, 26px)";

  // Gentle lift so it doesn’t feel glued to the edge.
  const LIFT_PX = 12;

  return (
    <div
      className={cx("fixed left-0 right-0 z-50", className)}
      style={{ bottom: `calc(env(safe-area-inset-bottom) + ${LIFT_PX}px)` }}
      aria-label="Onboarding footer navigation"
    >
      <div
        className="relative"
        style={{
          background: chromeBg,
          boxShadow: chromeShadow,
          backdropFilter: `blur(${chromeBlur})`,
          WebkitBackdropFilter: `blur(${chromeBlur})`,
          borderTop: `1px solid ${chromeBorder}`,
        }}
      >
        {/* Blend INTO the page so it doesn’t look like a separate file */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 h-10"
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0), ${chromeBg})` }}
        />

        {/* Single subtle highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${chromeHighlight}, transparent)`,
            opacity: 0.9,
          }}
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          {!hideBack ? (
            backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-semibold text-white/75 transition hover:bg-white/[0.07]"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-semibold text-white/75 transition hover:bg-white/[0.07] active:scale-[0.99]"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )
          ) : (
            <div />
          )}

          {children ? <div className="min-w-0 flex-1 px-2">{children}</div> : <div className="min-w-0 flex-1" />}

          {rightHref ? (
            <Link
              href={rightHref}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[13px] font-semibold text-white/80 transition hover:bg-white/[0.09]"
            >
              {rightLabel}
            </Link>
          ) : (
            <div className="text-[12px] font-semibold text-white/35"> </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingFooterNav;