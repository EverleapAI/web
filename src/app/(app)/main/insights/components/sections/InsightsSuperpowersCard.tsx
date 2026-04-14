"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import {
  bodyText,
  bulletText,
  headerIconWrap,
  headerLabel,
  headerRow,
  mutedText,
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

    const strength = strengthsLine?.trim();
    return strength ? `${base} ${strength}` : base;
  }, [body, strengthsLine]);

  return (
    <section className={sectionCard(dark, "strengths")}>
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
          <div className={headerLabel(dark)}>Superpowers</div>
        </div>

        <div className={sectionTitle(dark)}>
          What tends to work in your favor
        </div>

        {hasStrongSignal ? (
          <>
            <p className={["mt-3", bodyText(dark)].join(" ")}>{intro}</p>

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

            {skillsLine ? (
              <p className={["mt-4", mutedText(dark)].join(" ")}>
                {skillsLine}
              </p>
            ) : null}
          </>
        ) : (
          <p className={["mt-3", bodyText(dark)].join(" ")}>
            Superpowers are the strengths that naturally work in your favor —
            the ways you think and respond that help you most when something
            matters. As we gather more signal, this will sharpen into a clear
            read on what you can reliably lean on.
          </p>
        )}
      </div>
    </section>
  );
}