// apps/web/src/app/(app)/main/explore/_components/ExploreShared.tsx

"use client";

import Link from "next/link";
import * as React from "react";

/* =============================================================================
   Types
============================================================================= */

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

/* =============================================================================
   Visual Constants
============================================================================= */

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

/* =============================================================================
   Helpers
============================================================================= */

export function rgb(value: Rgb, alpha = 1) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

/* =============================================================================
   Small UI Primitives
============================================================================= */

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

/* =============================================================================
   Lane Tabs
============================================================================= */

export function ExploreLaneTabs({
  lanes,
  activeClassName,
}: {
  lanes: readonly ExploreLaneTab[];
  activeClassName: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {lanes.map((lane) => (
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
          <span className={`h-2.5 w-2.5 rounded-full ${lane.dotClass}`} />
          <span>{lane.label}</span>
        </Link>
      ))}
    </div>
  );
}

/* =============================================================================
   Constellation
============================================================================= */

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

/* =============================================================================
   Signal Meter
============================================================================= */

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

/* =============================================================================
   Opportunity Meta Pill
============================================================================= */

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

/* =============================================================================
   New Shared Page Shell
============================================================================= */

export function ExplorePageShell({
  title,
  subtitle,
  activeLane,
  children,
}: {
  title: string;
  subtitle: string;
  activeLane: "work" | "learning" | "world" | "impact" | "play" | string;
  children: React.ReactNode;
}) {
  const lanes: ExploreLaneTab[] = [
    {
      id: "work",
      label: "Work",
      href: "/main/explore/work",
      active: activeLane === "work",
      dotClass: "bg-cyan-300",
    },
    {
      id: "learning",
      label: "Learning",
      href: "/main/explore/learning",
      active: activeLane === "learning",
      dotClass: "bg-violet-300",
    },
    {
      id: "world",
      label: "World",
      href: "/main/explore/world",
      active: activeLane === "world",
      dotClass: "bg-amber-300",
    },
    {
      id: "impact",
      label: "Impact",
      href: "/main/explore/impact",
      active: activeLane === "impact",
      dotClass: "bg-emerald-300",
    },
    {
      id: "play",
      label: "Play",
      href: "/main/explore/play",
      active: activeLane === "play",
      dotClass: "bg-pink-300",
    },
  ];

  const activeClassName =
    activeLane === "world"
      ? "border-amber-300/30 bg-amber-300/[0.12] text-amber-50 shadow-[0_0_0_1px_rgba(252,211,77,0.06)]"
      : activeLane === "work"
      ? "border-cyan-300/30 bg-cyan-300/[0.12] text-cyan-50 shadow-[0_0_0_1px_rgba(103,232,249,0.06)]"
      : activeLane === "learning"
      ? "border-violet-300/30 bg-violet-300/[0.12] text-violet-50 shadow-[0_0_0_1px_rgba(196,181,253,0.06)]"
      : activeLane === "impact"
      ? "border-emerald-300/30 bg-emerald-300/[0.12] text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.06)]"
      : "border-pink-300/30 bg-pink-300/[0.12] text-pink-50 shadow-[0_0_0_1px_rgba(249,168,212,0.06)]";

  return (
    <div className="pb-24 pt-3">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.07),transparent_18%),radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_50%)]" />

        <div className="relative">
          <h1 className="text-[36px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[50px]">
            {title}
          </h1>
          <p className="mt-1 text-[15px] leading-[1.5] text-white/62 sm:text-[16px]">
            {subtitle}
          </p>

          <ExploreLaneTabs lanes={lanes} activeClassName={activeClassName} />
        </div>
      </section>

      {children}
    </div>
  );
}

/* =============================================================================
   New Shared Intro Panel
============================================================================= */

export function ExploreIntroPanel({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string[];
}) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.00)_46%)]" />

      <div className="relative max-w-4xl">
        <SectionKicker>{kicker}</SectionKicker>

        <h2 className="mt-3 max-w-3xl text-[28px] font-semibold leading-[1.07] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[36px]">
          {title}
        </h2>

        {body.map((paragraph, index) => (
          <p
            key={index}
            className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-white/76 sm:text-[16px]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

/* =============================================================================
   New Shared Explore Card
============================================================================= */

export function ExploreCard({
  accent,
  label,
  title,
  hook,
  description,
  signals,
  cta,
  tryThis,
  onDismiss,
}: {
  accent: Rgb;
  label: string;
  title: string;
  hook?: string;
  description?: string;
  signals?: string[];
  cta: { label: string; href: string };
  tryThis?: {
    label: string;
    items: { title: string; subtitle: string; href: string }[];
  };
  onDismiss?: () => void;
}) {
  return (
    <article
      className="group relative overflow-hidden rounded-[30px] border bg-white/[0.055] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-5"
      style={{
        borderColor: rgb(accent, 0.18),
        boxShadow: `0 24px 80px rgba(0,0,0,0.32), 0 0 0 1px ${rgb(
          accent,
          0.065
        )}`,
      }}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.17) }}
      />
      <div
        className="pointer-events-none absolute right-[-32px] top-[-18px] h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: rgb(accent, 0.13) }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background: `linear-gradient(180deg, ${rgb(
            accent,
            0.2
          )} 0%, ${rgb(accent, 0.08)} 44%, transparent 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${rgb(
            accent,
            0.44
          )} 24%, ${rgb(accent, 0.18)} 72%, transparent 100%)`,
        }}
      />

      <SignalConstellation accent={accent} mobile />
      <SignalConstellation accent={accent} />

      <div className="relative">
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-0 top-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/72 transition hover:bg-white/[0.1] hover:text-white"
          >
            Not for me
          </button>
        ) : null}

        <div className="min-w-0 pr-14 sm:pr-28">
          <div
            className="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              borderColor: rgb(accent, 0.24),
              backgroundColor: rgb(accent, 0.1),
              color: rgb(accent, 0.94),
            }}
          >
            {label}
          </div>

          <h2 className="mt-3 text-[23px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[25px]">
            {title}
          </h2>

          {signals && signals.length > 0 ? (
            <section className="mt-4">
              <CardSectionHeader color={accent}>
                Signals I&apos;m hearing
              </CardSectionHeader>

              <ul className="mt-3 space-y-2.5">
                {signals.map((signal, index) => (
                  <li
                    key={`${signal}-${index}`}
                    className="flex gap-3 text-[14px] leading-[1.65] text-white/80"
                  >
                    <span
                      className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: rgb(accent, 0.9) }}
                    />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hook ? (
            <p className="mt-4 text-[15px] font-medium leading-[1.65] text-white/86 sm:text-[16px]">
              {hook}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 max-w-[44rem] text-[14px] leading-[1.7] text-white/68 sm:text-[14px]">
              {description}
            </p>
          ) : null}
        </div>

        {tryThis ? (
          <section className="mt-5">
            <CardSectionHeader color={accent}>
              {tryThis.label}
            </CardSectionHeader>

            <div className="mt-3 grid grid-cols-1 gap-3">
              {tryThis.items.map((item, index) => (
                <Link
                  key={`${item.title}-${index}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[20px] border border-white/10 bg-black/18 px-4 py-3.5 transition hover:bg-white/[0.06]"
                >
                  <p className="text-[14px] font-medium leading-[1.5] text-white/88">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-white/60">
                    {item.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-5">
          <CardSectionHeader color={accent}>
            What this path could really look like
          </CardSectionHeader>

          <div className="mt-3">
            <Link
              href={cta.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border px-4 py-3 text-[14px] font-medium text-white transition hover:translate-y-[-1px]"
              style={{
                borderColor: rgb(accent, 0.26),
                background: `linear-gradient(180deg, ${rgb(
                  accent,
                  0.22
                )} 0%, ${rgb(accent, 0.12)} 100%)`,
                boxShadow: `0 10px 28px ${rgb(accent, 0.18)}`,
              }}
            >
              {cta.label}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}