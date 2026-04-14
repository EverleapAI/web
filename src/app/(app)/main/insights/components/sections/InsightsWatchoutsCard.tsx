"use client";

import * as React from "react";
import { Shield } from "lucide-react";

import {
  bodyText,
  bulletText,
  headerIconWrap,
  headerLabel,
  headerRow,
  sectionCard,
  sectionTitle,
} from "./summaryShared";

type Props = {
  dark: boolean;
  intro?: string;
  bullets?: string[];
  hasStrongSignal: boolean;
};

function bulletDotClass(dark: boolean) {
  return dark
    ? "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/55 ring-1 ring-amber-100/12"
    : "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/70 ring-1 ring-amber-600/12";
}

export default function InsightsWatchoutsCard({
  dark,
  intro,
  bullets = [],
  hasStrongSignal,
}: Props) {
  const safeBullets = React.useMemo(
    () => bullets.map((b) => (b ?? "").trim()).filter(Boolean).slice(0, 3),
    [bullets]
  );

  const introLine = React.useMemo(() => {
    return (
      intro?.trim() ||
      "These aren’t flaws — they’re what a strength can look like when it’s overused, stressed, or pointed at the wrong problem."
    );
  }, [intro]);

  return (
    <section className={sectionCard(dark, "watchouts")}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(255,200,120,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(255,150,120,0.05) 0%, transparent 22%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "amber")}>
            <Shield className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>Watchouts</div>
        </div>

        <div className={sectionTitle(dark)}>
          Where the same strengths can get expensive
        </div>

        {hasStrongSignal ? (
          <>
            {/* ONE paragraph */}
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              {introLine}
            </p>

            {/* Bullets = where it shows up */}
            {safeBullets.length ? (
              <ul className="mt-4 space-y-3">
                {safeBullets.map((bullet, index) => (
                  <li key={`${bullet}_${index}`} className="flex gap-3">
                    <span aria-hidden className={bulletDotClass(dark)} />
                    <span className={bulletText(dark)}>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <p className={["mt-3", bodyText(dark)].join(" ")}>
            Watchouts are the places where something good can start to work
            against you — when a strength is overused, stressed, or aimed at
            the wrong problem. As we gather more signal, this will sharpen into
            a clear read on where friction may show up.
          </p>
        )}
      </div>
    </section>
  );
}