"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CardBody } from "@/lib/ui/card";
import {
  EYEBROW_CLASS,
  LINK_CLASS,
  LINK_SIZE,
  PROSE_CLASS,
  TEXT_SECONDARY,
} from "@/lib/ui/prose";

import { cardBody, sectionCard } from "./summaryShared";

type Props = {
  dark: boolean;
  superpowersBullets?: string[];
  watchoutsBullets?: string[];
  hasStrongSignal: boolean;
  startHref?: string;
};

// Two tones carry the whole card: the heading and its bullets share one colour,
// so the eye groups them without needing a sub-header to say what they are.
const TONES = {
  superpowers: {
    label: "Superpowers",
    dark: { text: "#86D9B4", dot: "rgba(134,217,180,0.55)" },
    light: { text: "#0F766E", dot: "rgba(15,118,110,0.6)" },
  },
  watchouts: {
    label: "Watchouts",
    dark: { text: "#E2B979", dot: "rgba(226,185,121,0.55)" },
    light: { text: "#B45309", dot: "rgba(180,83,9,0.6)" },
  },
} as const;

type ToneKey = keyof typeof TONES;

function BulletGroup({
  tone,
  dark,
  bullets,
}: {
  tone: ToneKey;
  dark: boolean;
  bullets: string[];
}) {
  if (!bullets.length) return null;

  const t = TONES[tone];
  const c = dark ? t.dark : t.light;

  return (
    <div>
      <div className={EYEBROW_CLASS} style={{ color: c.text }}>
        {t.label}
      </div>

      <ul className="mt-2 space-y-1.5">
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
      </ul>
    </div>
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

  return (
    <section
      className={[sectionCard(dark, "strengths"), "overflow-hidden px-5 py-3.5"].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(120,255,190,0.12) 0%, transparent 28%), radial-gradient(circle at 82% -8%, rgba(255,200,120,0.05) 0%, transparent 22%)",
          maskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
        }}
      />

      <div className="relative">
        <div className={cardBody()}>
          {hasStrongSignal ? (
            <div className="space-y-4">
              <BulletGroup tone="superpowers" dark={dark} bullets={safeSuperpowersBullets} />
              <BulletGroup tone="watchouts" dark={dark} bullets={safeWatchoutsBullets} />
            </div>
          ) : (
            <>
              <p
                className={[PROSE_CLASS, LINK_SIZE].join(" ")}
                style={{ color: dark ? TEXT_SECONDARY : "#475569", fontWeight: 500 }}
              >
                This fills in once there’s a real pattern to work with — the
                strengths that help you, and where they can cost you.
              </p>

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
