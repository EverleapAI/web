// apps/web/src/app/(app)/main/explore/_components/ExploreShared.tsx

"use client";

import Link from "next/link";
import * as React from "react";

export type Rgb = {
  r: number;
  g: number;
  b: number;
};

export type SignalNode = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

export type ExploreLaneTab = {
  id: string;
  label: string;
  href: string;
  active: boolean;
  dotClass: string;
};

const CONSTELLATION_NODES: SignalNode[] = [
  { x: 18, y: 28, size: 8, alpha: 0.95 },
  { x: 68, y: 18, size: 6, alpha: 0.72 },
  { x: 108, y: 50, size: 7, alpha: 0.82 },
  { x: 54, y: 66, size: 5, alpha: 0.66 },
  { x: 26, y: 98, size: 7, alpha: 0.8 },
  { x: 94, y: 96, size: 6, alpha: 0.7 },
];

const CONSTELLATION_LINES = [
  { x1: 18, y1: 28, x2: 68, y2: 18, alpha: 0.34 },
  { x1: 68, y1: 18, x2: 108, y2: 50, alpha: 0.24 },
  { x1: 18, y1: 28, x2: 54, y2: 66, alpha: 0.28 },
  { x1: 54, y1: 66, x2: 108, y2: 50, alpha: 0.22 },
  { x1: 54, y1: 66, x2: 26, y2: 98, alpha: 0.24 },
  { x1: 54, y1: 66, x2: 94, y2: 96, alpha: 0.2 },
];

export function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

export function SectionKicker({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-white/42 sm:text-[12px]">
      {children}
    </p>
  );
}

export function CardSectionHeader({
  children,
  color,
}: {
  children: React.ReactNode;
  color: Rgb;
}) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        className="h-[7px] w-[7px] rounded-full"
        style={{
          backgroundColor: rgb(color, 0.95),
          boxShadow: `0 0 12px ${rgb(color, 0.38)}`,
        }}
      />
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.19em]"
        style={{ color: rgb(color, 0.92) }}
      >
        {children}
      </span>
      <span
        className="h-px w-8"
        style={{
          background: `linear-gradient(90deg, ${rgb(
            color,
            0.24
          )} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

export function ExploreLaneTabs({
  lanes,
  activeClassName,
}: {
  lanes: readonly ExploreLaneTab[];
  activeClassName: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {lanes.map((lane) => {
        const content = (
          <>
            <span className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`} />
            <span>{lane.label}</span>
          </>
        );

        return (
          <Link
            key={lane.id}
            href={lane.href}
            aria-current={lane.active ? "page" : undefined}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-medium tracking-[-0.01em] transition",
              lane.active
                ? activeClassName
                : "border-white/12 bg-white/[0.04] text-white/72 hover:bg-white/[0.07]",
            ].join(" ")}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

export function SignalConstellation({
  accent,
  mobile = false,
}: {
  accent: Rgb;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "pointer-events-none absolute opacity-95",
        mobile
          ? "right-2 top-10 h-[88px] w-[92px] sm:hidden"
          : "right-3 top-8 hidden h-[110px] w-[116px] sm:block",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rgb(
            accent,
            0.17
          )} 0%, ${rgb(accent, 0.055)} 42%, transparent 74%)`,
        }}
      />

      <svg
        viewBox="0 0 128 120"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {CONSTELLATION_LINES.map((line, index) => (
          <line
            key={`line-${mobile ? "m" : "d"}-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={rgb(accent, mobile ? line.alpha * 0.92 : line.alpha)}
            strokeWidth={mobile ? "1.25" : "1.15"}
            strokeLinecap="round"
          />
        ))}

        {CONSTELLATION_NODES.map((node, index) => (
          <g key={`node-${mobile ? "m" : "d"}-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size + 4 : node.size + 4.5}
              fill={rgb(accent, node.alpha * 0.1)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.9 : node.size * 0.94}
              fill={rgb(accent, mobile ? node.alpha * 0.95 : node.alpha)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={mobile ? node.size * 0.26 : node.size * 0.3}
              fill="white"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SignalMeter({
  score,
  accent,
}: {
  score: number;
  accent: Rgb;
}) {
  const normalized = Math.max(0, Math.min(100, score));
  const activeBars = Math.max(1, Math.round(normalized / 20));

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-end gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const active = index < activeBars;
          return (
            <span
              key={index}
              className="w-2 rounded-full transition-all"
              style={{
                height: `${10 + index * 4}px`,
                background: active
                  ? `linear-gradient(180deg, ${rgb(accent, 0.98)} 0%, ${rgb(
                      accent,
                      0.36
                    )} 100%)`
                  : "rgba(255,255,255,0.12)",
                boxShadow: active ? `0 0 14px ${rgb(accent, 0.2)}` : "none",
              }}
            />
          );
        })}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[20px] font-semibold tracking-[-0.03em] text-white">
          {normalized}
        </span>
        <span className="text-[12px] uppercase tracking-[0.16em] text-white/42">
          Signal
        </span>
      </div>
    </div>
  );
}

export function OpportunityMetaPill({
  children,
  glow,
}: {
  children: React.ReactNode;
  glow: Rgb;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] text-white/78"
      style={{
        borderColor: rgb(glow, 0.16),
        background: `linear-gradient(180deg, ${rgb(
          glow,
          0.11
        )} 0%, rgba(255,255,255,0.025) 100%)`,
        boxShadow: `inset 0 1px 0 ${rgb(glow, 0.06)}`,
      }}
    >
      {children}
    </span>
  );
}