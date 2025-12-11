// src/components/navigation/BottomNav.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type BottomNavKey =
  | "spotlight"
  | "story"
  | "youmap"
  | "goals"
  | "actions"
  | "notifications";

type BottomNavProps = {
  /** Optional – if you want to control which tab is active from a page */
  activeKey?: BottomNavKey;
  /** Optional – if you want to react when the tab changes */
  onChange?: (key: BottomNavKey) => void;
};

const NAV_ITEMS: {
  key: BottomNavKey;
  label: string;
  icon: string;
  href: string;
}[] = [
  {
    key: "spotlight",
    label: "Spotlight",
    icon: "✨",
    href: "/main",
  },
  {
    key: "story",
    label: "Your Story",
    icon: "📝",
    href: "/main/questions",
  },
  {
    key: "youmap",
    label: "Insights",
    icon: "🧬",
    href: "/main/carousel",
  },
  {
    key: "goals",
    label: "Goals",
    icon: "🎯",
    href: "/main/goals",
  },
  {
    key: "actions",
    label: "Actions",
    icon: "⚡",
    href: "/main/actions",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: "🔔",
    href: "/main/notifications",
  },
];

// Helper: infer active tab from URL when BottomNav is uncontrolled
function keyFromPath(pathname: string | null): BottomNavKey {
  if (!pathname) return "spotlight";
  if (pathname.startsWith("/main/questions")) return "story";
  if (pathname.startsWith("/main/carousel")) return "youmap";
  if (pathname.startsWith("/main/goals")) return "goals";
  if (pathname.startsWith("/main/actions")) return "actions";
  if (pathname.startsWith("/main/notifications")) return "notifications";
  // default for /main and anything else under /main
  return "spotlight";
}

export function BottomNav({ activeKey, onChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // internal state for when parent does NOT control the active key
  const [internalKey, setInternalKey] = useState<BottomNavKey>(
    () => keyFromPath(pathname)
  );

  // keep internalKey in sync if the URL changes (e.g., via back/forward)
  useEffect(() => {
    setInternalKey(keyFromPath(pathname));
  }, [pathname]);

  const currentKey = activeKey ?? internalKey;

  const handleClick = (key: BottomNavKey, href: string) => {
    if (onChange) {
      onChange(key);
    } else {
      setInternalKey(key);
    }
    router.push(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-500/40 bg-slate-950/70 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-900/40 shadow-[0_-18px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2 md:px-8 md:py-3">
        <div className="flex flex-1 items-center justify-around gap-1 md:justify-between">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === currentKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleClick(item.key, item.href)}
                className={cn(
                  "inline-flex flex-col items-center rounded-full px-3 py-1.5 text-[0.7rem] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                  isActive
                    ? "text-sky-100"
                    : "text-slate-400 hover:text-slate-100"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-base md:h-9 md:w-9",
                    isActive
                      ? "border-sky-400/90 bg-sky-400/20 shadow-[0_0_18px_rgba(56,189,248,0.65)]"
                      : "border-slate-600/70 bg-slate-900/80"
                  )}
                >
                  {item.icon}
                </span>
                <span className="mt-1 hidden text-[0.7rem] md:inline">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
