"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, Compass, ListTodo, User, Trophy } from "lucide-react";

import { emitOpenAchievements } from "@/lib/actionsBus";

import {
  DEFAULT_THEME_ID,
  DEFAULT_GRADIENT_LEVEL,
  getThemeById,
  getGradientConfig,
  type SpotlightThemeId,
  type GradientLevel,
} from "@/theme/everleapVisuals";
import { useActionsCount } from "@/app/(app)/main/components/ActionsFeedback";

type NavKey = "home" | "insights" | "explore" | "actions" | "profile";

type BottomNavProps = {
  activeKey?: NavKey | string;
  themeId?: SpotlightThemeId;
  gradientLevel?: GradientLevel;
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

function deriveActiveKey(pathname: string): NavKey | undefined {
  if (pathname === "/main" || pathname.startsWith("/main/home")) return "home";
  if (pathname.startsWith("/main/insights")) return "insights";
  if (pathname.startsWith("/main/explore")) return "explore";
  if (pathname.startsWith("/main/actions")) return "actions";
  if (pathname.startsWith("/main/profile")) return "profile";

  if (pathname.startsWith("/main/questions")) return "insights";
  if (pathname.startsWith("/main/story")) return "insights";
  if (pathname.startsWith("/main/guide")) return "explore";

  return undefined;
}

function normalizeActiveKey(key?: string): NavKey | undefined {
  if (!key) return undefined;

  if (key === "main") return "home";
  if (key === "spotlight") return "home";
  if (key === "home") return "home";
  if (key === "today") return "home";

  if (key === "insights") return "insights";
  if (key === "story") return "insights";
  if (key === "questions") return "insights";
  if (key === "reflection") return "insights";
  if (key === "carousel") return "insights";

  if (key === "explore") return "explore";
  if (key === "guide") return "explore";

  if (key === "actions") return "actions";
  if (key === "takeoff") return "actions";

  if (key === "profile") return "profile";
  if (key === "me") return "profile";

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
  showGuideFab = false,
  showMoreButton = false,
  className,
}: BottomNavProps) {
  void showGuideFab;
  void showMoreButton;

  const pathname = usePathname();
  const inMainShell = pathname.startsWith("/main");
  const actionsCount = useActionsCount();

  const resolvedActiveKey =
    normalizeActiveKey(activeKey as string | undefined) ??
    deriveActiveKey(pathname);

  const theme = getThemeById(themeId);
  const grad = getGradientConfig(gradientLevel);

  const ambient = Math.min(clamp01(grad.ambientOpacity), 0.16);

  const items: NavItem[] = [
    { key: "home", href: "/main", label: "Today", Icon: Home },
    {
      key: "insights",
      href: "/main/insights",
      label: "Insights",
      Icon: Lightbulb,
    },
    {
      key: "explore",
      href: "/main/explore",
      label: "Explore",
      Icon: Compass,
    },
    {
      key: "actions",
      href: "/main/actions",
      label: "Actions",
      Icon: ListTodo,
    },
    {
      key: "profile",
      href: "/main/profile",
      label: "Me",
      Icon: User,
    },
  ];

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!inMainShell) return null;
  if (!mounted) return null;

  const chromeBg = "var(--el-chrome-bg, rgba(255,255,255,0.03))";
  const chromeHighlight = "var(--el-chrome-highlight, rgba(255,255,255,0.12))";
  const chromeShadow = "var(--el-chrome-shadow, 0 18px 60px rgba(0,0,0,0.22))";
  const chromeBlur = "var(--el-chrome-blur, 24px)";

  const LIFT_PX = 12;

  return (
    <nav
      aria-label="Bottom navigation"
      className={["fixed left-0 right-0 z-50", className ?? ""].join(" ")}
      style={{ bottom: `calc(env(safe-area-inset-bottom) + ${LIFT_PX}px)` }}
    >
      <div
        className="relative backdrop-blur-2xl"
        style={{
          background: chromeBg,
          boxShadow: chromeShadow,
          backdropFilter: `blur(${chromeBlur})`,
          WebkitBackdropFilter: `blur(${chromeBlur})`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-12 h-12"
          style={{
            background: `linear-gradient(to top, ${chromeBg}, rgba(0,0,0,0))`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${chromeHighlight}, transparent)`,
            opacity: 0.9,
          }}
          aria-hidden
        />

        {ambient > 0 ? (
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
        ) : null}

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
                <span className="relative">
                  <Icon
                    className={
                      active ? "h-5 w-5 text-white" : "h-5 w-5 text-white/55"
                    }
                  />
                  {key === "actions" && actionsCount > 0 ? (
                    <span
                      className="absolute -right-2.5 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold leading-none text-[#06210f] shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                      aria-label={`${actionsCount} actions to do`}
                    >
                      {actionsCount > 99 ? "99+" : actionsCount}
                    </span>
                  ) : null}
                </span>
                <span
                  className={
                    active
                      ? "text-[11px] text-white"
                      : "text-[11px] text-white/55"
                  }
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Achievements — opens the global pyramid modal, not a route. */}
          <button
            type="button"
            onClick={() => emitOpenAchievements()}
            aria-label="Achievements"
            className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 transition hover:bg-white/[0.04]"
          >
            <Trophy className="h-5 w-5 text-white/55" />
            <span className="text-[11px] text-white/55">Awards</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;