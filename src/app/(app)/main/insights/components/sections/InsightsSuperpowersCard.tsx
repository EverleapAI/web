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
            {/* ONE paragraph only */}
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              {(body?.trim() ||
                "These are the strengths that show up when it counts — the ways you naturally think, move, and respond that give you an edge.") +
                (strengthsLine ? ` ${strengthsLine}` : "")}
            </p>

            {/* Bullets = proof */}
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

            {/* Skills = light add-on, not heavy */}
            {skillsLine ? (
              <p className={["mt-4", mutedText(dark)].join(" ")}>
                {skillsLine}
              </p>
            ) : null}
          </>
        ) : (
          <>
            {/* ONE paragraph only (empty state) */}
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Superpowers are the strengths that naturally work in your favor —
              the ways you think and respond that help you most when something
              matters. As we gather more signal, this will sharpen into a clear
              read on what you can reliably lean on.
            </p>
          </>
        )}
      </div>
    </section>
  );
}