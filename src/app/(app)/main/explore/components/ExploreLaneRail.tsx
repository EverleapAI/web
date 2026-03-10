"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lane = {
  href: string;
  label: string;
};

const LANES: Lane[] = [
  { href: "/main/explore/work", label: "Work" },
  { href: "/main/explore/learning", label: "Learning" },
  { href: "/main/explore/world", label: "World" },
  { href: "/main/explore/impact", label: "Impact" },
  { href: "/main/explore/play", label: "Play" },
];

function railWrap() {
  return [
    "relative overflow-x-auto pb-1",
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ].join(" ");
}

function railTrack() {
  return [
    "relative inline-flex min-w-full items-center gap-1.5 rounded-full border p-1",
    "backdrop-blur-2xl",
    "border-white/10 bg-white/[0.035]",
    "shadow-[0_16px_50px_rgba(0,0,0,0.18)]",
  ].join(" ");
}

function laneLink(active: boolean) {
  return [
    "relative z-10 inline-flex shrink-0 items-center justify-center",
    "whitespace-nowrap rounded-full px-4 py-2.5",
    "text-sm font-semibold tracking-[-0.01em]",
    "transition-[color,transform,opacity] duration-200",
    "active:scale-[0.985]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/18",
    active ? "text-white" : "text-white/58 hover:text-white/82",
  ].join(" ");
}

export default function ExploreLaneRail() {
  const pathname = usePathname();

  const activeIndex = React.useMemo(() => {
    const idx = LANES.findIndex((lane) => pathname === lane.href);
    return idx >= 0 ? idx : 0;
  }, [pathname]);

  return (
    <div className="relative">
      <div className={railWrap()}>
        <div className={railTrack()}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1 right-1 top-1 bottom-1"
          >
            <div
              className="absolute top-0 bottom-0 rounded-full border border-white/12 bg-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.16),0_0_30px_rgba(255,255,255,0.03)] transition-all duration-300 ease-out"
              style={{
                width: `calc((100% - ${1.5 * (LANES.length - 1)}px) / ${LANES.length})`,
                transform: `translateX(calc(${activeIndex} * (100% + 1.5px)))`,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                }}
              />
              <div
                className="absolute inset-x-6 top-0 h-px rounded-full bg-white/22"
                aria-hidden
              />
            </div>
          </div>

          {LANES.map((lane, index) => {
            const active = index === activeIndex;

            return (
              <Link
                key={lane.href}
                href={lane.href}
                className={laneLink(active)}
                aria-current={active ? "page" : undefined}
              >
                <span className="relative">
                  {lane.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-full mt-1 h-1 w-1 -translate-x-1/2 rounded-full bg-white/70"
                    />
                  ) : null}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}