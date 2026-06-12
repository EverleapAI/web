"use client";

import * as React from "react";
import Image from "next/image";

import { JOURNEY_BADGES, type JourneyBadgeId } from "./journeyConfig";

function getBadgeStatus(index: number) {
  if (index === 0) return "earned";
  if (index === 1) return "current";
  return "locked";
}

export function JourneyCard() {
  const [selectedBadgeId, setSelectedBadgeId] =
    React.useState<JourneyBadgeId>("story");

  const [hoveredBadgeId, setHoveredBadgeId] =
    React.useState<JourneyBadgeId | null>(null);

  const displayBadgeId = hoveredBadgeId ?? selectedBadgeId;

  const activeBadge =
    JOURNEY_BADGES.find((badge) => badge.id === displayBadgeId) ??
    JOURNEY_BADGES[1] ??
    JOURNEY_BADGES[0];

  return (
    <div>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {JOURNEY_BADGES.map((badge, index) => {
          const displayed = badge.id === displayBadgeId;
          const selected = badge.id === selectedBadgeId;
          const status = getBadgeStatus(index);

          const earned = status === "earned";
          const current = status === "current";

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => setSelectedBadgeId(badge.id)}
              onMouseEnter={() => setHoveredBadgeId(badge.id)}
              onMouseLeave={() => setHoveredBadgeId(null)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
              aria-label={`${badge.label}: ${badge.description}`}
            >
              <div
                className={[
                  "relative flex h-[54px] w-[54px] items-center justify-center rounded-full transition sm:h-[64px] sm:w-[64px]",
                  earned
                    ? "shadow-[0_0_22px_rgba(251,191,36,0.16)]"
                    : current
                      ? "shadow-[0_0_22px_rgba(103,232,249,0.12)]"
                      : displayed
                        ? "shadow-[0_0_18px_rgba(103,232,249,0.1)]"
                        : "opacity-62",
                  displayed || selected ? "scale-[1.04]" : "scale-100",
                ].join(" ")}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: earned
                      ? "rgba(252,211,77,0.9)"
                      : current || displayed || selected
                        ? "rgba(103,232,249,0.16)"
                        : "rgba(255,255,255,0.07)",
                  }}
                />

                <div className="absolute inset-[5px] rounded-full bg-slate-950/90" />

                <div
                  className={[
                    "relative flex h-[42px] w-[42px] items-center justify-center rounded-full border bg-white/[0.035] sm:h-[50px] sm:w-[50px]",
                    earned
                      ? "border-amber-200/55"
                      : current || displayed || selected
                        ? "border-cyan-200/55"
                        : "border-white/12",
                  ].join(" ")}
                >
                  <Image
                    src={badge.src}
                    alt={`${badge.label} badge`}
                    width={28}
                    height={28}
                    className={[
                      "h-[23px] w-[23px] object-contain transition sm:h-[27px] sm:w-[27px]",
                      earned || current || displayed || selected
                        ? "opacity-100"
                        : "opacity-52 grayscale",
                    ].join(" ")}
                  />
                </div>
              </div>

              <div
                className={[
                  "text-center text-[10px] font-medium leading-tight transition",
                  earned
                    ? "text-white/78"
                    : current || displayed || selected
                      ? "text-cyan-200"
                      : "text-white/48",
                ].join(" ")}
              >
                {badge.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-white/8 pt-4">
        <div className="text-[14px] font-semibold tracking-[-0.01em] text-white/88">
          {activeBadge.id === "story" ? "Story" : activeBadge.label}
        </div>

        <div className="mt-1.5 text-[14px] leading-6 text-white/72">
          {activeBadge.id === "story"
            ? "We'll explore what motivates you, what you're good at, and what keeps showing up in your answers."
            : activeBadge.description}
        </div>
      </div>
    </div>
  );
}