// src/components/navigation/BottomNav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UserRound, Sparkles, Compass, ListChecks, Plus, Sparkle } from "lucide-react";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import MoreMenuPopover from "@/components/navigation/MoreMenuPopover";

type NavKey = "home" | "you" | "insights" | "explore" | "actions";

type BottomNavProps = {
  activeKey?: NavKey | string;

  /** Optional: lets the footer match the page's theme */
  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;

  /** Show the bottom-right Guide button */
  showGuideFab?: boolean;

  /** Show the + (More) menu trigger */
  showMoreButton?: boolean;

  className?: string;
};

type NavItem = {
  key: NavKey;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function deriveActiveKey(pathname: string): NavKey | undefined {
  if (pathname === "/main" || pathname.startsWith("/main/home")) return "home";
  if (pathname.startsWith("/main/you")) return "you";
  if (pathname.startsWith("/main/insights")) return "insights";
  if (pathname.startsWith("/main/explore")) return "explore";
  if (pathname.startsWith("/main/actions")) return "actions";
  // legacy/alias: guide highlights Explore
  if (pathname.startsWith("/main/guide")) return "explore";
  return undefined;
}

function normalizeActiveKey(key?: string): NavKey | undefined {
  if (!key) return undefined;
  if (key === "guide") return "explore";
  if (key === "carousel") return "insights";
  if (key === "main") return "home";
  if (key === "spotlight") return "home";
  if (key === "home") return "home";
  if (key === "you") return "you";
  if (key === "insights") return "insights";
  if (key === "explore") return "explore";
  if (key === "actions") return "actions";
  return undefined;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function BottomNav({
  activeKey,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
  showGuideFab = true,
  showMoreButton = true,
  className,
}: BottomNavProps) {
  const pathname = usePathname();
  const resolvedActiveKey =
    normalizeActiveKey(activeKey as string | undefined) ?? deriveActiveKey(pathname);

  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);

  // Footer ambience: intentionally quieter than the page.
  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.18);

  const items: NavItem[] = [
    { key: "home", href: "/main/home", label: "Home", Icon: Home },
    { key: "you", href: "/main/you", label: "You", Icon: UserRound },
    { key: "insights", href: "/main/insights", label: "Insights", Icon: Sparkles },
    { key: "explore", href: "/main/explore", label: "Explore", Icon: Compass },
    { key: "actions", href: "/main/actions", label: "Actions", Icon: ListChecks },
  ];

  const [moreOpen, setMoreOpen] = React.useState(false);

  // Close on navigation
  React.useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Compact + menu (anchored above the + button) */}
      <MoreMenuPopover
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        themeId={themeId}
        gradientLevel={gradientLevel}
      />

      <nav
        aria-label="Bottom navigation"
        className={["fixed bottom-0 left-0 right-0 z-50", className ?? ""].join(" ")}
      >
        {/* Bottom-right Guide button */}
        {showGuideFab && (
          <Link
            // ✅ send users to the REAL Explore page (no intro/placeholder)
            href="/main/explore"
            aria-label="Guide"
            className={[
              "fixed z-[60]",
              "right-4",
              "bottom-[76px]",
              "h-14 w-14 rounded-full",
              "border border-white/20",
              "bg-white/10 backdrop-blur-md",
              "shadow-xl shadow-black/40",
              "grid place-items-center",
              "transition hover:bg-white/14 active:scale-95",
            ].join(" ")}
          >
            <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
            <Sparkle className="h-6 w-6 text-white" />
          </Link>
        )}

        {/* + button (More menu trigger) */}
        {showMoreButton && (
          <button
            type="button"
            aria-label="More"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            className={[
              "fixed z-[60]",
              "left-4",
              "bottom-[76px]",
              "h-14 w-14 rounded-full",
              "border border-white/20",
              "bg-white/10 backdrop-blur-md",
              "shadow-xl shadow-black/40",
              "grid place-items-center",
              "transition hover:bg-white/14 active:scale-95",
            ].join(" ")}
          >
            <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
            <Plus className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Footer bar */}
        <div className="relative border-t border-white/10 bg-black/45 backdrop-blur-md">
          {/* Subtle theme tint inside the bar */}
          {ambient > 0 && (
            <>
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -left-24 -top-28 h-[260px] w-[260px] rounded-full blur-[90px]",
                  theme.ambientTopLeftClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.28 }}
              />
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -right-28 -bottom-28 h-[320px] w-[320px] rounded-full blur-[100px]",
                  theme.ambientRightClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.28 }}
              />
            </>
          )}

          {/* Soft highlight line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          <div className="mx-auto flex w-full items-center justify-between px-4 py-2">
            {items.map(({ key, href, label, Icon }) => {
              const active = resolvedActiveKey === key;
              return (
                <Link
                  key={key}
                  href={href}
                  className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 hover:bg-white/5"
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={active ? "h-5 w-5 text-white" : "h-5 w-5 text-white/55"} />
                  <span className={active ? "text-[11px] text-white" : "text-[11px] text-white/55"}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </nav>
    </>
  );
}

export default BottomNav;
