"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Shield, ArrowRight } from "lucide-react";

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
  subDivider,
} from "./summaryShared";

type Props = {
  dark: boolean;
  superpowersBullets?: string[];
  watchoutsBullets?: string[];
  hasStrongSignal: boolean;
  startHref?: string;
};

function bulletDotClass(dark: boolean, tone: "teal" | "amber") {
  if (tone === "teal") {
    return dark
      ? "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200/55 ring-1 ring-emerald-100/12"
      : "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70 ring-1 ring-emerald-600/12";
  }

  return dark
    ? "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/55 ring-1 ring-amber-100/12"
    : "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/70 ring-1 ring-amber-600/12";
}

function subHeaderRow() {
  return "flex items-center gap-2";
}

export default function InsightsStrengthsCard({
  dark,
  superpowersBullets = [],
  watchoutsBullets = [],
  hasStrongSignal,
  startHref = "/main/story?returnTo=/main/insights?tab=summary",
}: Props) {
  const safeSuperpowersBullets = React.useMemo(
    () => superpowersBullets.map((b) => (b ?? "").trim()).filter(Boolean).slice(0, 3),
    [superpowersBullets]
  );

  const safeWatchoutsBullets = React.useMemo(
    () => watchoutsBullets.map((b) => (b ?? "").trim()).filter(Boolean).slice(0, 3),
    [watchoutsBullets]
  );

  return (
    <section
      className={[
        sectionCard(dark, "strengths"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(120,255,190,0.12) 0%, transparent 28%), radial-gradient(circle at 92% 18%, rgba(255,200,120,0.05) 0%, transparent 22%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "teal")}>
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Superpowers &amp; Watchouts</div>
            </div>
          </div>

          {constellationOrnament(dark, "strengths")}
        </div>

        <div className={cardBody()}>
          {hasStrongSignal ? (
            <>
              <div className={subHeaderRow()}>
                <Sparkles
                  className={dark ? "h-3.5 w-3.5 text-teal-200/70" : "h-3.5 w-3.5 text-teal-700/70"}
                  aria-hidden
                />
                <div className={sectionTitle(dark)}>Where this may work in your favor</div>
              </div>

              {safeSuperpowersBullets.length ? (
                <ul className="mt-2 space-y-2">
                  {safeSuperpowersBullets.map((bullet, index) => (
                    <li key={`sp_${index}`} className="flex gap-2.5">
                      <span aria-hidden className={bulletDotClass(dark, "teal")} />
                      <span className={bulletText(dark)}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className={["my-4 border-t", subDivider(dark)].join(" ")} />

              <div className={subHeaderRow()}>
                <Shield
                  className={dark ? "h-3.5 w-3.5 text-amber-200/70" : "h-3.5 w-3.5 text-amber-700/70"}
                  aria-hidden
                />
                <div className={sectionTitle(dark)}>What to watch for</div>
              </div>

              {safeWatchoutsBullets.length ? (
                <ul className="mt-2 space-y-2">
                  {safeWatchoutsBullets.map((bullet, index) => (
                    <li key={`wo_${index}`} className="flex gap-2.5">
                      <span aria-hidden className={bulletDotClass(dark, "amber")} />
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
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                This fills in once there’s a real pattern to work with — the
                strengths that help you, and where they can cost you.
              </p>

              <p
                className={[
                  "mt-1.5",
                  bodyText(dark),
                  "text-[14px] leading-[1.65] sm:text-[14.5px]",
                ].join(" ")}
              >
                Answer a few more Story questions and it turns from guesswork
                into something specific.
              </p>

              <div className="mt-3">
                <Link
                  href={startHref}
                  className={[
                    "group inline-flex items-center gap-1.5 text-[14px] font-medium transition focus-visible:outline-none sm:text-[14.5px]",
                    dark
                      ? "text-white/82 hover:text-white/94"
                      : "text-slate-900 hover:text-black",
                  ].join(" ")}
                >
                  <span>Continue your Story</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
