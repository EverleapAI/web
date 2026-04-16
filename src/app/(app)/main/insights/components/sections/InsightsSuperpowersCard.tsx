"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import {
  bodyText,
  bulletText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
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

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "teal")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Superpowers</div>
            </div>
          </div>

          {constellationOrnament(dark, "strengths")}
        </div>

        <div className={cardBody()}>
          <div className={sectionTitle(dark)}>
            What tends to work in your favor
          </div>

          {hasStrongSignal ? (
            <>
              <p
                className={[
                  "mt-3",
                  bodyText(dark),
                  "text-[14.5px] leading-6 sm:text-[15px]",
                ].join(" ")}
              >
                {intro}
              </p>

              {strengthsLine ? (
                <p
                  className={[
                    "mt-2",
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
                    "mt-4",
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
                  "mt-3",
                  bodyText(dark),
                  "text-[14.5px] leading-6 sm:text-[15px]",
                ].join(" ")}
              >
                Superpowers are the strengths that naturally help you when
                something matters.
              </p>

              <p
                className={[
                  "mt-2",
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
      </div>
    </section>
  );
}