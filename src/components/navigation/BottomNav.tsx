// src/components/navigation/BottomNav.tsx
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

/**
 * Best-effort auth gate (client-only).
 * We hide the /main nav unless we see evidence of an authenticated session.
 *
 * These keys match your dev auth stub:
 * - everleap.verified
 * - everleap.userId
 * - everleap.session
 */
function detectClientAuthed(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const verified = window.localStorage.getItem("everleap.verified");
    const userId = window.localStorage.getItem("everleap.userId");
    const session = window.localStorage.getItem("everleap.session");

    if (verified && verified !== "0" && verified !== "false") return true;
    if (userId && userId.trim().length > 0) return true;
    if (session && session.trim().length > 0) return true;
  } catch {
    // ignore
  }

  return false;
}

/* ============================================================
   Component
   ============================================================ */

export function BottomNav({
  activeKey,
  themeId = DEFAULT_THEME_ID,
  gradientLevel = DEFAULT_GRADIENT_LEVEL,
  // legacy:
  showGuideFab = false, // no-op now, kept for compatibility
  showMoreButton = true, // controls the + FAB
  className,
}: BottomNavProps) {
  void showGuideFab; // explicitly mark as intentionally unused (prevents lint warning)

  const pathname = usePathname();

  // Compute gating booleans without early returns before hooks.
  const inMainShell = pathname.startsWith("/main");

  const resolvedActiveKey =
    normalizeActiveKey(activeKey as string | undefined) ?? deriveActiveKey(pathname);

  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);

  // Footer ambience: intentionally quieter than the page.
  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.18);

  const items: NavItem[] = [
    { key: "home", href: "/main", label: "Today", Icon: Home },
    { key: "insights", href: "/main/insights", label: "Insights", Icon: Sparkles },
    { key: "explore", href: "/main/explore", label: "Explore", Icon: Compass },
    { key: "actions", href: "/main/actions", label: "Actions", Icon: ListChecks },
    { key: "profile", href: "/main/profile", label: "Me", Icon: User },
  ];

  // Hooks must always run in the same order.
  const [authed, setAuthed] = React.useState<boolean>(() => {
    // Avoid layout flicker on first paint in /main by seeding from storage.
    if (typeof window === "undefined") return false;
    return detectClientAuthed();
  });

  const [moreOpen, setMoreOpen] = React.useState(false);

  React.useEffect(() => {
    // Only attach listeners on /main pages; safe no-op elsewhere.
    if (!inMainShell) return;

    const refresh = () => setAuthed(detectClientAuthed());

    refresh();

    // If another tab logs in/out, update here too.
    window.addEventListener("storage", refresh);

    // When returning to the tab, re-check.
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [inMainShell]);

  // Close on navigation
  React.useEffect(() => {
    if (!inMainShell) return;
    setMoreOpen(false);
  }, [pathname, inMainShell]);

  // Now that hooks are stable, we can gate rendering.
  if (!inMainShell) return null;
  if (!authed) return null;

  return (
    <>
      {/* More menu popover (anchored near the + FAB) */}
      <MoreMenuPopover
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        themeId={themeId}
        gradientLevel={gradientLevel}
      />

      {/* + FAB (BOTTOM RIGHT) */}
      {showMoreButton ? (
        <button
          type="button"
          aria-label="More"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((v) => !v)}
          className={[
            "fixed z-[60]",
            "right-4",
            "bottom-[76px]", // sits above the nav bar
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
      ) : null}

      <nav
        aria-label="Bottom navigation"
        className={["fixed bottom-0 left-0 right-0 z-50", className ?? ""].join(" ")}
      >
        <div className="relative border-t border-white/10 bg-black/45 backdrop-blur-md">
          {/* Ambient tints */}
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

          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          {/* Slightly tighter for 5 items */}
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
                    "transition hover:bg-white/5",
                    active ? "bg-white/[0.06]" : "",
                  ].join(" ")}
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
