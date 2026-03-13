"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lane = {
  href: string;
  label: string;
  dotClass: string;
  activeClass: string;
  inactiveClass: string;
};

const LANES: Lane[] = [
  {
    href: "/main/explore/work",
    label: "Work",
    dotClass: "bg-cyan-300/80 shadow-[0_0_12px_rgba(80,180,255,0.35)]",
    activeClass:
      "border-cyan-300/28 bg-cyan-300/[0.10] text-cyan-100 shadow-[0_8px_24px_rgba(80,180,255,0.12)]",
    inactiveClass: "hover:border-cyan-300/18 hover:bg-cyan-300/[0.05] hover:text-cyan-100",
  },
  {
    href: "/main/explore/learning",
    label: "Learning",
    dotClass: "bg-violet-300/80 shadow-[0_0_12px_rgba(180,140,255,0.35)]",
    activeClass:
      "border-violet-300/28 bg-violet-300/[0.10] text-violet-100 shadow-[0_8px_24px_rgba(180,140,255,0.12)]",
    inactiveClass:
      "hover:border-violet-300/18 hover:bg-violet-300/[0.05] hover:text-violet-100",
  },
  {
    href: "/main/explore/world",
    label: "World",
    dotClass: "bg-amber-300/80 shadow-[0_0_12px_rgba(255,190,120,0.35)]",
    activeClass:
      "border-amber-300/28 bg-amber-300/[0.10] text-amber-100 shadow-[0_8px_24px_rgba(255,190,120,0.12)]",
    inactiveClass: "hover:border-amber-300/18 hover:bg-amber-300/[0.05] hover:text-amber-100",
  },
  {
    href: "/main/explore/impact",
    label: "Impact",
    dotClass: "bg-emerald-300/80 shadow-[0_0_12px_rgba(70,255,200,0.35)]",
    activeClass:
      "border-emerald-300/28 bg-emerald-300/[0.10] text-emerald-100 shadow-[0_8px_24px_rgba(70,255,200,0.12)]",
    inactiveClass:
      "hover:border-emerald-300/18 hover:bg-emerald-300/[0.05] hover:text-emerald-100",
  },
  {
    href: "/main/explore/play",
    label: "Play",
    dotClass: "bg-pink-300/80 shadow-[0_0_12px_rgba(255,140,200,0.35)]",
    activeClass:
      "border-pink-300/28 bg-pink-300/[0.10] text-pink-100 shadow-[0_8px_24px_rgba(255,140,200,0.12)]",
    inactiveClass: "hover:border-pink-300/18 hover:bg-pink-300/[0.05] hover:text-pink-100",
  },
];

function railWrap() {
  return [
    "relative overflow-x-auto pb-1",
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ].join(" ");
}

function pillBase(active: boolean, inactiveClass: string) {
  return [
    "inline-flex h-11 shrink-0 items-center justify-center gap-2.5",
    "whitespace-nowrap rounded-full border px-5",
    "text-sm font-semibold tracking-[-0.01em]",
    "transition-all duration-200",
    "active:scale-[0.98]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/18",
    active
      ? ""
      : ["border-white/12 bg-transparent text-white/72", inactiveClass].join(" "),
  ].join(" ");
}

export default function ExploreLaneRail() {
  const pathname = usePathname();

  const activeIndex = React.useMemo(() => {
    const idx = LANES.findIndex((lane) => pathname === lane.href);
    return idx >= 0 ? idx : 0;
  }, [pathname]);

  return (
    <div className={railWrap()}>
      <div className="inline-flex min-w-max items-center gap-2">
        {LANES.map((lane, index) => {
          const active = index === activeIndex;

          return (
            <Link
              key={lane.href}
              href={lane.href}
              className={[
                pillBase(active, lane.inactiveClass),
                active ? lane.activeClass : "",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span className={["h-2.5 w-2.5 rounded-full", lane.dotClass].join(" ")} />
              <span>{lane.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}