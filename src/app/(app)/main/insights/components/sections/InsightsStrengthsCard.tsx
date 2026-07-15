"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CardBody } from "@/lib/ui/card";
import {
  EYEBROW_CLASS,
  LINK_CLASS,
  LINK_SIZE,
  TEXT_SECONDARY,
} from "@/lib/ui/prose";

import {
  cardBody,
  headerCopyStack,
  headerIconWrap,
  headerMain,
  headerRow,
  sectionCard,
} from "./summaryShared";

type Props = {
  dark: boolean;
  superpowersBullets?: string[];
  watchoutsBullets?: string[];
  hasStrongSignal: boolean;
  startHref?: string;
};

// One card, one header — "Superpowers & Watchouts" — with each word tinted to its
// own bullets (mint / honey). The bullets then flow under that single header and
// the colour alone tells the two groups apart, so we drop the two sub-eyebrows the
// card used to stack. Same one-header shape as every other Insights card, and a
// good chunk of vertical space back.
const TONES = {
  superpowers: {
    label: "Superpowers",
    dark: { text: "#6FE3AE", dot: "rgba(111,227,174,0.6)" }, // bright mint
    light: { text: "#0F766E", dot: "rgba(15,118,110,0.6)" },
  },
  watchouts: {
    label: "Watchouts",
    dark: { text: "#F0C878", dot: "rgba(240,200,120,0.6)" }, // warm honey — never red
    light: { text: "#B45309", dot: "rgba(180,83,9,0.6)" },
  },
} as const;

type ToneKey = keyof typeof TONES;

function Bullets({
  tone,
  dark,
  bullets,
}: {
  tone: ToneKey;
  dark: boolean;
  bullets: string[];
}) {
  if (!bullets.length) return null;

  const c = dark ? TONES[tone].dark : TONES[tone].light;

  return (
    <>
      {bullets.map((bullet, index) => (
        <li key={`${tone}_${index}`} className="flex gap-2.5">
          <span
            aria-hidden
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: c.dot }}
          />
          <CardBody as="span" style={{ color: c.text }}>
            {bullet}
          </CardBody>
        </li>
      ))}
    </>
  );
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

  const sp = dark ? TONES.superpowers.dark : TONES.superpowers.light;
  const wo = dark ? TONES.watchouts.dark : TONES.watchouts.light;

  return (
    <section className={[sectionCard(dark, "strengths"), "px-5 py-3.5"].join(" ")}>
      <div className="relative">
        <div className={cardBody()}>
          {hasStrongSignal ? (
            <>
              <div className={headerRow()}>
                <div className={headerIconWrap(dark, "teal")}>
                  <span
                    aria-hidden
                    className="leading-none"
                    style={{ fontSize: "0.8rem", color: sp.text }}
                  >
                    ✦
                  </span>
                </div>

                <div className={headerMain()}>
                  <div className={headerCopyStack()}>
                    <div className={EYEBROW_CLASS} style={{ color: TEXT_SECONDARY }}>
                      <span style={{ color: sp.text }}>Superpowers</span>
                      <span className="opacity-50"> &amp; </span>
                      <span style={{ color: wo.text }}>Watchouts</span>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-1.5">
                <Bullets tone="superpowers" dark={dark} bullets={safeSuperpowersBullets} />
                <Bullets tone="watchouts" dark={dark} bullets={safeWatchoutsBullets} />
              </ul>
            </>
          ) : (
            <>
              <CardBody style={dark ? undefined : { color: "#475569" }}>
                This fills in once there’s a real pattern to work with — the
                strengths that help you, and where they can cost you.
              </CardBody>

              <div className="mt-4">
                <Link
                  href={startHref}
                  className={[LINK_CLASS, LINK_SIZE].join(" ")}
                  style={{ color: dark ? TEXT_SECONDARY : "#475569" }}
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
