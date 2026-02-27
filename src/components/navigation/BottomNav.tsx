"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Compass, ListChecks, User, Plus } from "lucide-react";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";

import MoreMenuPopover from "@/components/navigation/MoreMenuPopover";

/* ============================================================
   Types
   ============================================================ */

type NavKey = "home" | "insights" | "explore" | "actions" | "profile";

type BottomNavProps = {
  activeKey?: NavKey | string;

  /** Optional: lets the footer match the page's theme */
  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;

  /**
   * Legacy props (kept for compatibility).
   * - showGuideFab is now a no-op (we removed the bottom-right “guide” icon)
   * - showMoreButton controls the + FAB (More menu)
   */
  showGuideFab?: boolean;
  showMoreButton?: boolean;

  className?: string;
};

type NavItem = {
  key: NavKey;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

/* ============================================================
   Helpers
   ============================================================ */

function deriveActiveKey(pathname: string): NavKey | undefined {
  if (pathname === "/main" || pathname.startsWith("/main/home")) return "home";
  if (pathname.startsWith("/main/insights")) return "insights";
  if (pathname.startsWith("/main/explore")) return "explore";
  if (pathname.startsWith("/main/actions")) return "actions";
  if (pathname.startsWith("/main/profile")) return "profile";

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
  if (key === "insights") return "insights";
  if (key === "explore") return "explore";
  if (key === "actions") return "actions";
  if (key === "profile") return "profile";

  return undefined;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/* ============================================================
   Component
   ============================================================ */

export function BottomNav({
  activeKey,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
  showGuideFab = false, // no-op now, kept for compatibility
  showMoreButton = true,
  className,
}: BottomNavProps) {
  void showGuideFab;

  const pathname = usePathname();
  const inMainShell = pathname.startsWith("/main");

  const resolvedActiveKey = normalizeActiveKey(activeKey as string | undefined) ?? deriveActiveKey(pathname);

  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);

  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.16);

  const items: NavItem[] = [
    { key: "home", href: "/main", label: "Today", Icon: Home },
    { key: "insights", href: "/main/insights", label: "Insights", Icon: Sparkles },
    { key: "explore", href: "/main/explore", label: "Explore", Icon: Compass },
    { key: "actions", href: "/main/actions", label: "Actions", Icon: ListChecks },
    { key: "profile", href: "/main/profile", label: "Me", Icon: User },
  ];

  const [mounted, setMounted] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!inMainShell) return;
    if (!mounted) return;
    setMoreOpen(false);
  }, [pathname, inMainShell, mounted]);

  if (!inMainShell) return null;
  if (!mounted) return null;

  const chromeBg = "var(--el-chrome-bg, rgba(255,255,255,0.03))";
  const chromeBorder = "var(--el-chrome-border, rgba(255,255,255,0.10))";
  const chromeHighlight = "var(--el-chrome-highlight, rgba(255,255,255,0.12))";
  const chromeShadow = "var(--el-chrome-shadow, 0 18px 60px rgba(0,0,0,0.22))";
  const chromeBlur = "var(--el-chrome-blur, 24px)";

  // Lift the nav slightly off the absolute bottom so it doesn’t feel “stuck” to the edge.
  const LIFT_PX = 12;

  return (
    <>
      <MoreMenuPopover open={moreOpen} onClose={() => setMoreOpen(false)} themeId={themeId} gradientLevel={gradientLevel} />

      {/* + FAB */}
      {showMoreButton ? (
        <button
          type="button"
          aria-label="More"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((v) => !v)}
          className={[
            "fixed z-[60]",
            "right-4",
            "h-14 w-14 rounded-full",
            "grid place-items-center",
            "transition hover:bg-white/[0.06] active:scale-95",
          ].join(" ")}
          style={{
            bottom: `calc(76px + env(safe-area-inset-bottom) + ${LIFT_PX}px)`,
            background: chromeBg,
            border: `1px solid ${chromeBorder}`,
            boxShadow: chromeShadow,
            backdropFilter: `blur(${chromeBlur})`,
            WebkitBackdropFilter: `blur(${chromeBlur})`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)", opacity: 0.9 }}
          />
          <div className="absolute inset-0 rounded-full ring-1" style={{ borderColor: chromeHighlight }} />
          <Plus className="relative h-6 w-6 text-white" />
        </button>
      ) : null}

      <nav
        aria-label="Bottom navigation"
        className={["fixed left-0 right-0 z-50", className ?? ""].join(" ")}
        style={{ bottom: `calc(env(safe-area-inset-bottom) + ${LIFT_PX}px)` }}
      >
        <div
          className="relative backdrop-blur-2xl"
          style={{
            background: chromeBg,
            // NO hard borderTop — we’ll do the same “single highlight line” as header.
            boxShadow: chromeShadow,
            backdropFilter: `blur(${chromeBlur})`,
            WebkitBackdropFilter: `blur(${chromeBlur})`,
          }}
        >
          {/* Blend INTO the page (this is the key to not looking like a separate component) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-12 h-12"
            style={{
              background: `linear-gradient(to top, ${chromeBg}, rgba(0,0,0,0))`,
            }}
          />

          {/* Single subtle highlight (matches header) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${chromeHighlight}, transparent)`, opacity: 0.9 }}
            aria-hidden
          />

          {/* Ambient tints (quiet) */}
          {ambient > 0 && (
            <>
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -left-24 -top-28 h-[260px] w-[260px] rounded-full blur-[90px]",
                  theme.ambientTopLeftClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.22 }}
              />
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -right-28 -bottom-28 h-[320px] w-[320px] rounded-full blur-[100px]",
                  theme.ambientRightClass,
                ].join(" ")}
                style={{ opacity: ambient * 0.22 }}
              />
            </>
          )}

          <div className="mx-auto flex w-full items-center justify-between px-2 py-2">
            {items.map(({ key, href, label, Icon }) => {
              const active = resolvedActiveKey === key;

              return (
                <Link
                  key={key}
                  href={href}
                  className={[
                    "flex w-full flex-col items-center justify-center gap-1 rounded-xl",
                    "px-1.5 py-2",
                    "transition hover:bg-white/[0.04]",
                    active ? "bg-white/[0.06]" : "",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={active ? "h-5 w-5 text-white" : "h-5 w-5 text-white/55"} />
                  <span className={active ? "text-[11px] text-white" : "text-[11px] text-white/55"}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export default BottomNav;