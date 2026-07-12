"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AchievementBlock } from "@/app/(app)/main/components/achievements/AchievementBlock";
import { useBadgeStats } from "@/lib/achievements/useBadgeStats";

type Lane = {
  href: string;
  label: string;
  dotClass: string;
  exact?: boolean;
};

const LANES: Lane[] = [
  { href: "/main/explore", label: "Summary", dotClass: "bg-white/70", exact: true },
  { href: "/main/explore/work", label: "Work", dotClass: "bg-sky-300" },
  { href: "/main/explore/learning", label: "Learning", dotClass: "bg-violet-300" },
  { href: "/main/explore/world", label: "World", dotClass: "bg-amber-300" },
  { href: "/main/explore/impact", label: "Impact", dotClass: "bg-emerald-300" },
  { href: "/main/explore/play", label: "Play", dotClass: "bg-pink-300" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function railPillClass(active: boolean, dotClass: string) {
  return [
    "relative inline-flex items-center gap-2 rounded-full border",
    "px-3.5 py-2",
    "text-sm font-semibold tracking-[-0.01em]",
    "backdrop-blur-xl transition-[transform,box-shadow,background-color,border-color,color] duration-200",
    "active:scale-95",
    "whitespace-nowrap shrink-0",
    active
      ? [
          "border-white/20 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_24px_rgba(0,0,0,0.22)]",
          dotClass === "bg-sky-300" && "bg-sky-400/[0.18]",
          dotClass === "bg-violet-300" && "bg-violet-400/[0.18]",
          dotClass === "bg-amber-300" && "bg-amber-400/[0.18]",
          dotClass === "bg-emerald-300" && "bg-emerald-400/[0.18]",
          dotClass === "bg-pink-300" && "bg-pink-400/[0.18]",
        ]
      : "border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.06]",
  ]
    .flat()
    .filter(Boolean)
    .join(" ");
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const badges = useBadgeStats();

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 flex-col px-[4px] pb-24 pt-0.5">
      <div className="mb-2 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LANES.map((lane) => {
          const active = isActive(pathname ?? "", lane.href, lane.exact);

          return (
            <Link
              key={lane.href}
              href={lane.href}
              className={railPillClass(active, lane.dotClass)}
              aria-current={active ? "page" : undefined}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${lane.dotClass}`}
              />
              <span>{lane.label}</span>
            </Link>
          );
        })}
      </div>

      {/* The achievement block, under the lane rail — one mount for all six lanes.
          Explore's badges (paths opened, lanes opened, actions born here) are
          surface-wide, so it doesn't belong to any one lane. */}
      <div className="mb-3">
        <AchievementBlock
          block={badges?.surfaces?.explore?.block ?? null}
          surface="explore"
        />
      </div>

      {children}
    </div>
  );
}