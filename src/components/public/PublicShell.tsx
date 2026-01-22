"use client";

import * as React from "react";
import type { CSSProperties } from "react";

import BrandBadge from "@/components/site/BrandBadge";

import {
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
  GRADIENT_CONFIGS,
  getPageBackgroundImage,
} from "@/theme/everleapVisuals";

type PublicShellProps = {
  themeId: SpotlightThemeId;
  gradientLevel: GradientLevel;
  children: React.ReactNode;
  footer?: React.ReactNode;

  /** Optional: pass className to the root wrapper if needed */
  className?: string;
};

export default function PublicShell({
  themeId,
  gradientLevel,
  children,
  footer,
  className,
}: PublicShellProps) {
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const gradient =
    GRADIENT_CONFIGS.find((g) => g.level === gradientLevel) ??
    GRADIENT_CONFIGS[Math.min(3, GRADIENT_CONFIGS.length - 1)];

  const pageBgImage = getPageBackgroundImage(themeId);
  const pageBgStyle: CSSProperties = pageBgImage
    ? { backgroundImage: pageBgImage }
    : {};

  return (
    <div
      className={`relative flex min-h-[100svh] flex-col ${theme.pageBgBaseClass} ${
        className ?? ""
      }`}
      style={pageBgStyle}
    >
      {/* Ambient blobs */}
      {gradientLevel > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: gradient.ambientOpacity }}
        >
          <div
            className={`absolute -top-24 -left-16 h-64 w-64 rounded-full blur-3xl ${theme.ambientTopLeftClass}`}
          />
          <div
            className={`absolute top-40 right-[-32px] h-72 w-72 rounded-full blur-3xl ${theme.ambientRightClass}`}
          />
        </div>
      )}

      <BrandBadge />

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>

      {footer ? <div className="relative z-10">{footer}</div> : null}
    </div>
  );
}
