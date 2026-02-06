// src/app/main/insights/components/WordCloud.tsx
"use client";

import * as React from "react";

export type WordCloudItem = {
  term: string;
  weight: number; // 0..1
};

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function hashString(input: string) {
  // deterministic FNV-ish hash (stable across renders)
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wordSizePx(weight: number) {
  const w = clamp01(weight);
  return 13 + Math.round(w * 14);
}

function wordOpacity(weight: number) {
  const w = clamp01(weight);
  return 0.65 + w * 0.35;
}

function wordColorClass(dark: boolean, term: string) {
  const paletteDark = [
    "text-sky-200",
    "text-fuchsia-200",
    "text-amber-200",
    "text-emerald-200",
    "text-violet-200",
    "text-rose-200",
    "text-cyan-200",
    "text-lime-200",
  ] as const;

  const paletteLight = [
    "text-sky-700",
    "text-fuchsia-700",
    "text-amber-700",
    "text-emerald-700",
    "text-violet-700",
    "text-rose-700",
    "text-cyan-700",
    "text-lime-700",
  ] as const;

  const idx = hashString(term.toLowerCase()) % paletteDark.length;

  return [
    dark ? paletteDark[idx] : paletteLight[idx],
    dark ? "drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function wordChaosVars(term: string, weight: number): CSSVars {
  const h = hashString(term.toLowerCase());
  const w = clamp01(weight);

  // Only some words get the micro-rotation/offset; keep biggest words readable.
  const mode = h % 10;
  const allow = mode < 4 && w < 0.95;

  const rot = allow ? ((h % 5) - 2) * 1 : 0; // -2..+2 deg
  const ty = allow ? ((h % 7) - 3) * 0.6 : 0; // small px offset
  const ls = w > 0.75 ? 0.2 : 0;

  return {
    ["--el-rot"]: `${rot}deg`,
    ["--el-ty"]: `${ty}px`,
    ["--el-ls"]: `${ls}px`,
  };
}

function topTerms(items: WordCloudItem[]) {
  const sorted = [...items].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  return new Set(sorted.slice(0, 3).map((x) => x.term.toLowerCase()));
}

export function WordCloud({
  items,
  dark,
  className,
  emptyText = "Nothing to map yet — answer a few questions and this turns into a real word cloud.",
}: {
  items: WordCloudItem[];
  dark: boolean;
  className?: string;
  emptyText?: string;
}) {
  const topSet = React.useMemo(() => topTerms(items ?? []), [items]);

  return (
    <div className={className}>
      <style jsx global>{`
        .el-word {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(1);
          letter-spacing: var(--el-ls, 0px);
          will-change: transform;
          transition: transform 160ms ease;
        }
        .el-word:hover {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(1.035);
        }
        .el-word:active {
          transform: translateY(var(--el-ty, 0px)) rotate(var(--el-rot, 0deg))
            scale(0.985);
        }
      `}</style>

      {items?.length ? (
        <div className="flex flex-wrap gap-x-3 gap-y-2 leading-none">
          {items.map((w) => {
            const isTop = topSet.has(w.term.toLowerCase());
            const wrapClass = dark
              ? "bg-white/12 ring-1 ring-white/10"
              : "bg-black/5 ring-1 ring-black/8";

            return (
              <span
                key={w.term}
                className={[
                  "select-none",
                  "el-word",
                  wordColorClass(dark, w.term),
                  isTop
                    ? [
                        "rounded-full px-2.5 py-1",
                        wrapClass,
                        dark
                          ? "shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
                          : "shadow-[0_12px_34px_rgba(0,0,0,0.10)]",
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
        <div className={`text-sm ${dark ? "text-white/70" : "text-slate-700"}`}>
          {emptyText}
        </div>
      )}
    </div>
  );
}

export default WordCloud;
