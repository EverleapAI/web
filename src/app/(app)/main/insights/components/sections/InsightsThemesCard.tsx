"use client";

import * as React from "react";
import { Radar } from "lucide-react";

import type { WordCloudItem } from "../../app/buildInsightsViewModel";
import {
  bodyText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
  mutedText,
  sectionCard,
  sectionTitle,
} from "./summaryShared";

type Props = {
  dark: boolean;
  items: WordCloudItem[];
  hasStrongSignal: boolean;
  motivatorsLine?: string;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wordSizePx(weight: number) {
  const w = clamp01(weight);
  return 14 + Math.round(w * 8);
}

function wordOpacity(weight: number) {
  const w = clamp01(weight);
  return 0.46 + w * 0.18;
}

function topTerms(items: WordCloudItem[]) {
  const sorted = [...items].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return new Set(sorted.slice(0, 3).map((x) => x.term.toLowerCase()));
}

function wordColorClasses(dark: boolean, term: string) {
  const paletteDark = [
    "text-sky-200/50",
    "text-fuchsia-200/48",
    "text-amber-200/50",
    "text-emerald-200/48",
    "text-violet-200/48",
  ] as const;

  const i = hashString(term.toLowerCase()) % paletteDark.length;
  return dark ? paletteDark[i] : "text-slate-800";
}

function wordChaosVars(
  term: string,
  weight: number
): React.CSSProperties & { [key: `--${string}`]: string | number } {
  const h = hashString((term ?? "").toLowerCase());
  const w = clamp01(weight);
  const allow = w < 0.92 && (h % 10) < 3;

  const rot = allow ? ((h % 5) - 2) * 0.35 : 0;
  const ty = allow ? ((h % 7) - 3) * 0.25 : 0;

  return {
    "--el-rot": `${rot}deg`,
    "--el-ty": `${ty}px`,
  };
}

function highlightWrap(dark: boolean) {
  return dark
    ? "bg-white/6 ring-1 ring-white/8"
    : "bg-black/5 ring-1 ring-black/10";
}

export default function InsightsThemesCard({
  dark,
  items,
  hasStrongSignal,
  motivatorsLine,
}: Props) {
  const topSet = React.useMemo(() => topTerms(items ?? []), [items]);

  return (
    <section
      className={[
        sectionCard(dark, "themes"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg));
          transition: transform 160ms ease;
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(255,180,120,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(120,200,255,0.06) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        {/* HEADER */}
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "amber")}>
            <Radar className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>Signals</div>
            </div>
          </div>

          {constellationOrnament(dark, "themes")}
        </div>

        {/* BODY */}
        <div className={cardBody()}>
          <div className={sectionTitle(dark)}>
            Your signals are patterns in what you choose and follow through on.
          </div>

          {hasStrongSignal ? (
            <>
              <div className="mt-2.5">
                {items.length ? (
                  <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 leading-none">
                    {items.map((w) => {
                      const isTop = topSet.has(w.term.toLowerCase());
                      return (
                        <span
                          key={w.term}
                          className={[
                            "select-none el-word",
                            wordColorClasses(dark, w.term),
                            isTop
                              ? [
                                  "rounded-full px-2 py-[3px]",
                                  highlightWrap(dark),
                                ].join(" ")
                              : "",
                          ].join(" ")}
                          style={{
                            fontSize: `${wordSizePx(w.weight)}px`,
                            opacity: wordOpacity(w.weight),
                            ...wordChaosVars(w.term, w.weight),
                          }}
                        >
                          {w.term}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={[
                      bodyText(dark),
                      "text-[14px] leading-[1.65]",
                    ].join(" ")}
                  >
                    Nothing to map yet — give me 1–2 real examples.
                  </div>
                )}
              </div>

              {motivatorsLine ? (
                <p
                  className={[
                    "mt-2.5",
                    mutedText(dark),
                    "text-[13px] leading-[1.55] sm:text-[13.5px]",
                  ].join(" ")}
                >
                  {motivatorsLine}
                </p>
              ) : null}
            </>
          ) : (
            <p
              className={[
                "mt-2.5",
                bodyText(dark),
                "text-[14px] leading-[1.65] sm:text-[14.5px]",
              ].join(" ")}
            >
              Once you answer a few questions, this will start mapping what
              actually gives you energy and where your patterns show up.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}