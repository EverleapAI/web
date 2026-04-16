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
      "These are not flaws. They are what a strength can look like when it is overused, stressed, or pointed at the wrong problem."
    );
  }, [intro]);

  return (
    <section
      className={[
        sectionCard(dark, "watchouts"),
        "overflow-hidden px-4 py-4 sm:px-5 sm:py-5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(255,200,120,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(255,150,120,0.05) 0%, transparent 22%)",
        }}
      />

      <div
        aria-hidden
        className={[
          "pointer-events-none absolute right-3 top-3 rounded-2xl border p-2.5",
          "sm:right-4 sm:top-4 sm:p-3",
          dark
            ? "border-amber-200/14 bg-amber-100/[0.05] text-amber-100/24"
            : "border-amber-200/70 bg-white/70 text-amber-500/45",
        ].join(" ")}
      >
        <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      <div className="relative pr-14 sm:pr-16">
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
            <p
              className={[
                "mt-3 max-w-[40rem]",
                bodyText(dark),
                "text-[14.5px] leading-6 sm:text-[15px]",
              ].join(" ")}
            >
              {introLine}
            </p>

            {safeBullets.length ? (
              <ul className="mt-4 space-y-2.5">
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
          <>
            <p
              className={[
                "mt-3 max-w-[40rem]",
                bodyText(dark),
                "text-[14.5px] leading-6 sm:text-[15px]",
              ].join(" ")}
            >
              Watchouts are the places where something good can start working
              against you.
            </p>

            <p
              className={[
                "mt-2 max-w-[38rem]",
                bodyText(dark),
                "text-[14px] leading-6 sm:text-[14.5px]",
              ].join(" ")}
            >
              As Everleap picks up more signal, this becomes a clearer read on
              where friction is most likely to show up.
            </p>
          </>
        )}
      </div>
    </section>
  );
}