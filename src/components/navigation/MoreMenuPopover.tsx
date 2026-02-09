// src/components/navigation/MoreMenuPopover.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, FileText, Mail, Accessibility, User } from "lucide-react";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

type MoreMenuPopoverProps = {
  open: boolean;
  onClose: () => void;

  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;
};

type MenuItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function MoreMenuPopover({
  open,
  onClose,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
}: MoreMenuPopoverProps) {
  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);

  // Keep popover ambience subtle.
  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.16);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const items: MenuItem[] = [
    { label: "Privacy", href: "/privacy", Icon: Shield },
    { label: "Terms of service", href: "/terms", Icon: FileText },
    { label: "Contact", href: "/contact", Icon: Mail },
    { label: "Accessibility", href: "/accessibility", Icon: Accessibility },
    { label: "Your profile", href: "/main/profile", Icon: User },
  ];

  return (
    <div className="fixed inset-0 z-[85]">
      {/* Outside-click catcher */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-transparent"
      />

      {/* Popover anchored above the + FAB (right-4, bottom-[76px]) */}
      <div className="absolute right-4 bottom-[calc(76px+64px)]">
        <div className="relative w-[270px] overflow-hidden rounded-2xl border border-white/12 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/55">
          {/* Theme tint inside the popover (subtle) */}
          {ambient > 0 && (
            <>
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -left-14 -top-16 h-[200px] w-[200px] rounded-full blur-[70px]",
                  theme.ambientTopLeftClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.26 }}
              />
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -right-16 -bottom-16 h-[220px] w-[220px] rounded-full blur-[80px]",
                  theme.ambientRightClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.26 }}
              />
            </>
          )}

          <div className="relative p-2">
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              More
            </div>

            <div className="space-y-1">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/85 hover:bg-white/8"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5">
                    <it.Icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="text-sm font-medium">{it.label}</div>
                </Link>
              ))}
            </div>

            <div className="px-3 pt-2 pb-1 text-[11px] text-white/45">
              Tap anywhere outside to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoreMenuPopover;
