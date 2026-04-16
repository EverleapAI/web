"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

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
  body?: string;
  bullets?: string[];
  strengthsLine?: string;
  skillsLine?: string;
  hasStrongSignal: boolean;
};

function bulletDotClass(dark: boolean) {
  return dark
    ? "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200/55 ring-1 ring-emerald-100/12"
    : "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70 ring-1 ring-emerald-600/12";
}

export default function InsightsSuperpowersCard({
  dark,
  body,
  bullets = [],
  strengthsLine,
  skillsLine,
  hasStrongSignal,
}: Props) {
  const safeBullets = React.useMemo(
    () => bullets.map((b) => (b ?? "").trim()).filter(Boolean).slice(0, 3),
    [bullets]
  );

  const intro = React.useMemo(() => {
    const base =
      body?.trim() ||
      "These are the strengths that show up when it counts — the ways you naturally think, move, and respond that give you an edge.";

    return base;
  }, [body]);

  return (
    <section
      className={[
        sectionCard(dark, "strengths"),
        "overflow-hidden px-4 py-4 sm:px-5 sm:py-5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(120,255,190,0.12) 0%, transparent 28%), radial-gradient(circle at 92% 18%, rgba(120,200,255,0.05) 0%, transparent 22%)",
        }}
      />

      <div
        aria-hidden
        className={[
          "pointer-events-none absolute right-3 top-3 rounded-2xl border p-2.5",
          "sm:right-4 sm:top-4 sm:p-3",
          dark
            ? "border-teal-200/14 bg-teal-100/[0.05] text-teal-100/24"
            : "border-teal-200/70 bg-white/70 text-teal-500/45",
        ].join(" ")}
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      <div className="relative pr-14 sm:pr-16">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "teal")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>Superpowers</div>
        </div>

        <div className={sectionTitle(dark)}>
          What tends to work in your favor
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
              {intro}
            </p>

            {strengthsLine ? (
              <p
                className={[
                  "mt-2 max-w-[38rem]",
                  bodyText(dark),
                  "text-[14px] leading-6 sm:text-[14.5px]",
                ].join(" ")}
              >
                {strengthsLine}
              </p>
            ) : null}

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

            {skillsLine ? (
              <p
                className={[
                  "mt-4 max-w-[38rem]",
                  bodyText(dark),
                  "text-[14px] leading-6 sm:text-[14.5px]",
                ].join(" ")}
              >
                {skillsLine}
              </p>
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
              Superpowers are the strengths that naturally help you when
              something matters.
            </p>

            <p
              className={[
                "mt-2 max-w-[38rem]",
                bodyText(dark),
                "text-[14px] leading-6 sm:text-[14.5px]",
              ].join(" ")}
            >
              As Everleap picks up more signal, this becomes a clearer read on
              what you can reliably lean on.
            </p>
          </>
        )}
      </div>
    </section>
  );
}