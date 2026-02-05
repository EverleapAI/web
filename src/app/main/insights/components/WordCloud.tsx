// src/app/main/insights/components/WordCloudD3.tsx
"use client";

import * as React from "react";

/**
 * D3 word cloud (d3-cloud) rendered into an SVG.
 * - Client-only (dynamic import) to avoid SSR issues in Next.js App Router
 * - Responsive (recomputes on resize)
 * - Deterministic-ish layout (seeded random)
 *
 * NOTE:
 *   pnpm add d3-selection d3-cloud
 *   pnpm add -D @types/d3-selection
 */

// d3-cloud has no official TypeScript types; keep TS happy.
type D3CloudModule = { default: any };

export type WordDatum = {
  text: string;
  weight: number; // 0..1 preferred, but any >=0 works
  hint?: string; // optional hover hint
};

export type WordCloudD3Props = {
  words: WordDatum[];
  dark?: boolean;
  height?: number; // default 220
  padding?: number; // default 2
  minFont?: number; // default 12
  maxFont?: number; // default 44
  className?: string;
  ariaLabel?: string;
  onWordClick?: (w: WordDatum) => void;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** small seeded RNG so layout is stable between renders */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type PositionedWord = {
  text: string;
  size: number;
  x: number;
  y: number;
  rotate: number;
  weight: number;
  hint?: string;
};

export function WordCloudD3(props: WordCloudD3Props) {
  const {
    words,
    dark = false,
    height = 220,
    padding = 2,
    minFont = 12,
    maxFont = 44,
    className,
    ariaLabel = "Word cloud",
    onWordClick,
  } = props;

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const [width, setWidth] = React.useState(0);
  const [layoutWords, setLayoutWords] = React.useState<PositionedWord[]>([]);
  const [hovered, setHovered] = React.useState<PositionedWord | null>(null);

  // measure width
  React.useEffect(() => {
    if (!wrapRef.current) return;

    const el = wrapRef.current;

    const ro = new ResizeObserver(() => {
      const w = Math.floor(el.getBoundingClientRect().width);
      setWidth((prev) => (prev !== w ? w : prev));
    });

    ro.observe(el);

    // initial
    const w0 = Math.floor(el.getBoundingClientRect().width);
    setWidth(w0);

    return () => ro.disconnect();
  }, []);

  // compute layout
  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!width || width < 120) {
        setLayoutWords([]);
        return;
      }

      // Dynamically import to avoid SSR/tooling weirdness.
      const [{ select }, cloudMod] = await Promise.all([
        import("d3-selection"),
        import("d3-cloud") as Promise<D3CloudModule>,
      ]);

      if (cancelled) return;

      const cloud = cloudMod.default;

      // normalize weights and cap list
      const cleaned = (Array.isArray(words) ? words : [])
        .filter((w) => w && typeof w.text === "string" && w.text.trim())
        .map((w) => ({
          text: w.text.trim(),
          weight: Math.max(0, Number.isFinite(w.weight) ? w.weight : 0),
          hint: typeof w.hint === "string" ? w.hint : undefined,
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 40);

      if (!cleaned.length) {
        setLayoutWords([]);
        return;
      }

      const maxW = cleaned[0]!.weight || 1;
      const minW = cleaned[cleaned.length - 1]!.weight || 0;
      const span = Math.max(1e-6, maxW - minW);

      const seedStr = cleaned.map((w) => `${w.text}:${w.weight}`).join("|");
      const rng = mulberry32(hashSeed(seedStr));

      const layoutInput = cleaned.map((w) => {
        const norm = clamp((w.weight - minW) / span, 0, 1);
        const size = Math.round(minFont + norm * (maxFont - minFont));
        return {
          text: w.text,
          size,
          weight: w.weight,
          hint: w.hint,
        };
      });

      // clear svg
      const svg = select(svgRef.current);
      svg.selectAll("*").remove();

      // create a group centered
      svg.attr("width", width).attr("height", height);

      const g = svg
        .append("g")
        .attr("transform", `translate(${Math.floor(width / 2)},${Math.floor(height / 2)})`);

      // run layout
      const layout = cloud()
        .size([width, height])
        .words(layoutInput)
        .padding(padding)
        .rotate(() => 0) // keep readable; change later if you want some rotated
        .font("system-ui")
        .fontSize((d: any) => d.size)
        .random(rng)
        .on("end", (placed: any[]) => {
          if (cancelled) return;

          const positioned: PositionedWord[] = placed.map((d: any) => ({
            text: String(d.text),
            size: Number(d.size) || minFont,
            x: Number(d.x) || 0,
            y: Number(d.y) || 0,
            rotate: Number(d.rotate) || 0,
            weight: Number(d.weight) || 0,
            hint: typeof d.hint === "string" ? d.hint : undefined,
          }));

          setLayoutWords(positioned);

          // render into svg
          const fillBase = dark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.85)";
          const fillSoft = dark ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.65)";

          g.selectAll("text")
            .data(positioned)
            .enter()
            .append("text")
            .style("font-family", "system-ui")
            .style("font-weight", 700)
            .style("cursor", onWordClick ? "pointer" : "default")
            .style("fill", (d: any, i: number) => {
              // subtle variety without picking hard-coded colors
              // (alpha variation only)
              const alpha = 0.62 + ((i % 7) / 7) * 0.28;
              const base = dark ? 255 : 15;
              const c = dark
                ? `rgba(${base},${base},${base},${alpha.toFixed(3)})`
                : `rgba(15,23,42,${alpha.toFixed(3)})`;
              return c;
            })
            .attr("text-anchor", "middle")
            .attr("font-size", (d: any) => d.size)
            .attr("transform", (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text((d: any) => d.text)
            .on("mouseenter", (_ev: any, d: any) => {
              setHovered({
                text: d.text,
                size: d.size,
                x: d.x,
                y: d.y,
                rotate: d.rotate,
                weight: d.weight,
                hint: d.hint,
              });
              // bump alpha on hover
              select(_ev.currentTarget).style("fill", fillBase);
            })
            .on("mouseleave", (_ev: any) => {
              setHovered(null);
              select(_ev.currentTarget).style("fill", fillSoft);
            })
            .on("click", (_ev: any, d: any) => {
              if (!onWordClick) return;
              onWordClick({ text: d.text, weight: d.weight ?? 0, hint: d.hint });
            });
        });

      layout.start();
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [words, width, height, padding, minFont, maxFont, dark, onWordClick]);

  const tipBg = dark ? "bg-white/10" : "bg-white/80";
  const tipRing = dark ? "ring-1 ring-white/12" : "ring-1 ring-black/10";
  const tipText = dark ? "text-white/80" : "text-slate-800";
  const tipTitle = dark ? "text-white" : "text-slate-900";

  return (
    <div ref={wrapRef} className={["relative w-full", className ?? ""].join(" ")}>
      <svg
        ref={svgRef}
        role="img"
        aria-label={ariaLabel}
        className="block w-full overflow-visible"
      />

      {/* simple tooltip */}
      {hovered?.hint ? (
        <div
          className={[
            "pointer-events-none absolute left-3 top-3 max-w-[320px]",
            "rounded-2xl px-3 py-2 backdrop-blur-xl",
            tipBg,
            tipRing,
          ].join(" ")}
        >
          <div className={["text-sm font-semibold", tipTitle].join(" ")}>{hovered.text}</div>
          <div className={["mt-0.5 text-xs leading-relaxed", tipText].join(" ")}>
            {hovered.hint}
          </div>
        </div>
      ) : null}
    </div>
  );
}
