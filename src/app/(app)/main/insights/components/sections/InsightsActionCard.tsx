"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import {
  bodyText,
  bulletText,
  headerIconWrap,
  headerLabel,
  headerRow,
  sectionCard,
  sectionTitle,
  subDivider,
} from "./summaryShared";

type Props = {
  dark: boolean;
  eyebrow?: string;
  title?: string;
  body?: string;
  bullets?: string[];
  hasStrongSignal: boolean;
};

export default function InsightsActionCard({
  dark,
  eyebrow = "Actions",
  title,
  body,
  bullets = [],
  hasStrongSignal,
}: Props) {
  const safeBullets = React.useMemo(
    () => bullets.map((b) => (b ?? "").trim()).filter(Boolean),
    [bullets]
  );

  return (
    <section className={sectionCard(dark, "action")}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 12% 0%, rgba(190,140,255,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(255,180,120,0.05) 0%, transparent 22%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "violet")}>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>{eyebrow}</div>
        </div>

        <div className={sectionTitle(dark)}>
          {title?.trim() || "Run one small test this week."}
        </div>

        {hasStrongSignal ? (
          <>
            {body ? (
              <p className={["mt-3", bodyText(dark)].join(" ")}>{body}</p>
            ) : null}

            {safeBullets.length ? (
              <ul
                className={[
                  "mt-4 space-y-2.5 border-t pt-4",
                  subDivider(dark),
                ].join(" ")}
              >
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
            ) : (
              <p className={["mt-3", bodyText(dark)].join(" ")}>
                Once we have a stronger signal, this section will suggest one
                concrete move you can test right away.
              </p>
            )}
          </>
        ) : (
          <>
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Actions are the concrete next moves that turn insight into
              traction. They are meant to help you test something real instead
              of just thinking about it.
            </p>

            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Once we have more signal, this section will suggest one clear next
              step based on your strongest emerging pattern.
            </p>
          </>
        )}
      </div>
    </section>
  );
}