"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Lane = {
  href: string;
  label: string;
  color: string;
};

const LANES: Lane[] = [
  {
    href: "/main/explore/work",
    label: "Work",
    color:
      "border-cyan-300/20 bg-cyan-300/12 text-cyan-100 shadow-[0_0_30px_rgba(80,180,255,0.25)]",
  },
  {
    href: "/main/explore/learning",
    label: "Learning",
    color:
      "border-emerald-300/20 bg-emerald-300/12 text-emerald-100 shadow-[0_0_30px_rgba(70,255,200,0.25)]",
  },
  {
    href: "/main/explore/world",
    label: "World",
    color:
      "border-amber-300/20 bg-amber-300/12 text-amber-100 shadow-[0_0_30px_rgba(255,190,120,0.25)]",
  },
  {
    href: "/main/explore/impact",
    label: "Impact",
    color:
      "border-violet-300/20 bg-violet-300/12 text-violet-100 shadow-[0_0_30px_rgba(180,140,255,0.25)]",
  },
  {
    href: "/main/explore/play",
    label: "Play",
    color:
      "border-pink-300/20 bg-pink-300/12 text-pink-100 shadow-[0_0_30px_rgba(255,140,200,0.25)]",
  },
];

function railWrap() {
  return [
    "relative overflow-x-auto pb-1",
    "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ].join(" ");
}

function railTrack() {
  return [
    "relative inline-flex min-w-max items-center gap-2 rounded-full border p-1.5",
    "border-white/10 bg-white/[0.035]",
    "backdrop-blur-2xl",
    "shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
  ].join(" ");
}

function laneBase(active: boolean) {
  return [
    "relative inline-flex h-11 shrink-0 items-center justify-center",
    "whitespace-nowrap rounded-full px-5",
    "text-sm font-semibold tracking-[-0.01em]",
    "transition-all duration-200",
    "active:scale-[0.97]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/18",
    active ? "" : "text-white/65 hover:text-white/85",
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
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            <motion.div
              className="absolute inset-y-0 w-[34%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.00) 10%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.00) 90%, transparent 100%)",
                filter: "blur(12px)",
              }}
              animate={{ x: ["-140%", "340%"] }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="relative z-10 flex items-center gap-2">
            {LANES.map((lane, index) => {
              const active = index === activeIndex;

              return (
                <Link
                  key={lane.href}
                  href={lane.href}
                  className={[
                    laneBase(active),
                    active
                      ? [
                          "border",
                          lane.color,
                          "bg-white/[0.06]",
                          "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
                        ].join(" ")
                      : "border border-transparent",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="relative">
                    {lane.label}
                    {active ? (
                      <span className="absolute left-1/2 top-full mt-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}