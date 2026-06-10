"use client";

import * as React from "react";
import Image from "next/image";

import { JOURNEY_BADGES } from "./journeyConfig";

function getBadgeStatus(index: number) {
  if (index === 0) {
    return {
      tone: "earned",
    };
  }

  return {
    tone: "available",
  };
}

export function JourneyCard() {
  const [activeBadgeId, setActiveBadgeId] = React.useState<string>(
    JOURNEY_BADGES[0].id
  );

  const activeIndex = JOURNEY_BADGES.findIndex(
    (badge) => badge.id === activeBadgeId
  );

  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeBadge = JOURNEY_BADGES[safeActiveIndex] ?? JOURNEY_BADGES[0];

  return (
    <div>
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-white">
        Your Journey
      </h2>

      <div className="mt-7 grid grid-cols-5 gap-2">
        {JOURNEY_BADGES.map((badge, index) => {
          const selected = badge.id === activeBadgeId;
          const status = getBadgeStatus(index);
          const earned = status.tone === "earned";

          return (
            <div
              key={badge.id}
              className="relative flex flex-col items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setActiveBadgeId(badge.id)}
                onMouseEnter={() => setActiveBadgeId(badge.id)}
                className={[
                  "group flex flex-col items-center gap-2 focus:outline-none",
                  selected ? "scale-[1.08]" : "scale-100",
                  "transition-transform duration-200",
                ].join(" ")}
                aria-label={`${badge.label}: ${badge.description}`}
              >
                <div
                  className={[
                    "relative flex items-center justify-center rounded-full transition",
                    selected ? "h-[78px] w-[78px]" : "h-[70px] w-[70px]",
                    earned
                      ? "shadow-[0_0_28px_rgba(251,191,36,0.2)]"
                      : selected
                        ? "shadow-[0_0_26px_rgba(103,232,249,0.14)]"
                        : "opacity-60",
                  ].join(" ")}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: earned
                        ? "conic-gradient(rgba(252,211,77,0.95) 360deg, rgba(255,255,255,0.12) 0deg)"
                        : selected
                          ? "rgba(103,232,249,0.16)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />

                  <div className="absolute inset-[5px] rounded-full bg-slate-950/90" />

                  <div
                    className={[
                      "relative flex items-center justify-center rounded-full border bg-white/[0.035]",
                      selected ? "h-[63px] w-[63px]" : "h-[56px] w-[56px]",
                      earned
                        ? "border-amber-200/55"
                        : selected
                          ? "border-cyan-200/55"
                          : "border-white/14",
                    ].join(" ")}
                  >
                    <Image
                      src={badge.src}
                      alt={`${badge.label} badge`}
                      width={30}
                      height={30}
                      className={[
                        selected ? "h-[32px] w-[32px]" : "h-[28px] w-[28px]",
                        "object-contain transition",
                        earned || selected
                          ? "opacity-100"
                          : "opacity-42 grayscale",
                      ].join(" ")}
                    />
                  </div>
                </div>

                <div
                  className={[
                    "text-center text-[10px] font-medium leading-tight transition",
                    earned
                      ? "text-white/82"
                      : selected
                        ? "text-cyan-200"
                        : "text-white/38",
                  ].join(" ")}
                >
                  {badge.label}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 px-1">
        <div className="max-w-[560px] text-[14px] leading-6 text-white/68">
          {activeBadge.description}
        </div>
      </div>
    </div>
  );
}