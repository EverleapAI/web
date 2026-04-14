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

export default function InsightsWatchoutsCard({
  dark,
  intro,
  bullets = [],
  hasStrongSignal,
}: Props) {
  const safeBullets = React.useMemo(
    () => bullets.map((b) => (b ?? "").trim()).filter(Boolean),
    [bullets]
  );

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
            {intro ? (
              <p className={["mt-3", bodyText(dark)].join(" ")}>{intro}</p>
            ) : null}

            {safeBullets.length ? (
              <ul className="mt-4 space-y-2.5">
                {safeBullets.map((bullet, index) => (
                  <li key={`${bullet}_${index}`} className="flex gap-2">
                    <span
                      aria-hidden
                      className={
                        dark
                          ? "pt-[2px] text-white/28"
                          : "pt-[2px] text-slate-400"
                      }
                    >
                      •
                    </span>
                    <span className={bulletText(dark)}>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <>
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Watchouts are the places where something good can start to work
              against you. A strength can become expensive when it is overused,
              stressed, or aimed at the wrong problem.
            </p>

            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Once we have more signal, this section will show where your
              strongest patterns may quietly create friction in your decisions,
              energy, or relationships.
            </p>
          </>
        )}
      </div>
    </section>
  );
}