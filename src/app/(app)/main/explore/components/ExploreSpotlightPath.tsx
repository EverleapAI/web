"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw } from "lucide-react";

import type { ExplorePath } from "../_data/exploreTypes";

type Props = {
  path: ExplorePath;
  whyItSurfaced: string;
  primaryHref: string;
  onShowAnotherDirection?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
};

type SignalNode = {
  id: string;
  x: number;
  y: number;
  r: number;
  delay: number;
};

type SignalLink = {
  id: string;
  from: string;
  to: string;
};

const NODES: SignalNode[] = [
  { id: "n1", x: 76, y: 72, r: 8, delay: 0.2 },
  { id: "n2", x: 182, y: 108, r: 10, delay: 1.1 },
  { id: "n3", x: 260, y: 62, r: 7, delay: 2.4 },
  { id: "n4", x: 314, y: 164, r: 9, delay: 0.7 },
  { id: "n5", x: 202, y: 206, r: 11, delay: 1.9 },
  { id: "n6", x: 108, y: 230, r: 7, delay: 2.9 },
  { id: "n7", x: 360, y: 96, r: 6, delay: 3.5 },
];

const LINKS: SignalLink[] = [
  { id: "l1", from: "n1", to: "n2" },
  { id: "l2", from: "n2", to: "n3" },
  { id: "l3", from: "n3", to: "n4" },
  { id: "l4", from: "n2", to: "n5" },
  { id: "l5", from: "n5", to: "n6" },
  { id: "l6", from: "n3", to: "n7" },
  { id: "l7", from: "n5", to: "n4" },
];

function rgb(
  value: { r: number; g: number; b: number } | undefined,
  alpha = 1,
): string {
  if (!value) return `rgba(124, 211, 252, ${alpha})`;
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${alpha})`;
}

function renderTagLabel(tag: string) {
  return tag.replace(/-/g, " ");
}

function getInterpretiveLine(path: ExplorePath) {
  if (path.display.hook) return path.display.hook;

  return "This path is rising because something in the way it thinks, builds, and moves through the world seems to echo how your mind already leans.";
}

function getSignalTone(path: ExplorePath) {
  const accent = path.theme?.accentRgb ?? { r: 125, g: 211, b: 252 };

  return {
    nodeCore: rgb(accent, 0.22),
    nodeGlow: rgb(accent, 0.18),
    nodeGlowStrong: rgb(accent, 0.28),
    line: rgb(accent, 0.11),
    lineHover: rgb(accent, 0.24),
    wash: `radial-gradient(circle at 70% 35%, ${rgb(
      accent,
      0.12,
    )} 0%, rgba(255,255,255,0) 58%)`,
    titleGlow: rgb(accent, 0.16),
  };
}

function SignalField({ path, active }: { path: ExplorePath; active: boolean }) {
  const tone = getSignalTone(path);
  const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node]));

  return (
    <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[360px]">
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl transition-opacity duration-500"
        style={{
          background: tone.wash,
          opacity: active ? 1 : 0.78,
        }}
      />

      <svg
        viewBox="0 0 440 320"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <filter id="spotlight-node-blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="spotlight-node-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {LINKS.map((link) => {
          const from = nodeMap[link.from];
          const to = nodeMap[link.to];

          return (
            <line
              key={link.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={active ? tone.lineHover : tone.line}
              strokeWidth={1}
              className="transition-all duration-500"
              style={{
                opacity: active ? 0.95 : 0.54,
              }}
            />
          );
        })}

        {NODES.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * (active ? 2.8 : 2.35)}
              fill={active ? tone.nodeGlowStrong : tone.nodeGlow}
              filter="url(#spotlight-node-blur)"
              style={{
                animation: `everleapSignalPulse ${
                  active ? 4.2 : 5.6
                }s ease-in-out ${node.delay}s infinite`,
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 1.32}
              fill={active ? tone.nodeGlowStrong : tone.nodeGlow}
              filter="url(#spotlight-node-soft)"
              style={{
                animation: `everleapSignalPulse ${
                  active ? 4.2 : 5.6
                }s ease-in-out ${node.delay + 0.2}s infinite`,
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 0.72}
              fill={tone.nodeCore}
              style={{
                opacity: active ? 1 : 0.88,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ExploreSpotlightPath({
  path,
  whyItSurfaced,
  primaryHref,
  onShowAnotherDirection,
  primaryLabel = "Step inside this path",
  secondaryLabel = "Show another direction",
}: Props) {
  const [active, setActive] = React.useState(false);
  const accent = path.theme?.accentRgb ?? { r: 125, g: 211, b: 252 };
  const interpretiveLine = getInterpretiveLine(path);

  return (
    <>
      <style jsx>{`
        @keyframes everleapSignalPulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.68;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
      `}</style>

      <section
        className="group relative"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="relative z-10 max-w-3xl">

            <h2
              className="text-[36px] font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-[44px] lg:text-[52px] xl:text-[58px]"
              style={{
                textShadow: `0 0 24px ${rgb(accent, 0.12)}`,
              }}
            >
              {path.display.title}
            </h2>

            <p className="mt-6 max-w-[30ch] text-[20px] leading-[1.28] tracking-[-0.025em] text-white/88 sm:text-[22px] lg:text-[24px]">
              {interpretiveLine}
            </p>

            <p className="mt-5 max-w-[42rem] text-[16px] leading-[1.75] text-white/68 sm:text-[17px]">
              {whyItSurfaced}
            </p>

            {path.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-[13px] font-medium tracking-[0.01em] text-white/52 sm:text-[14px]">
                {path.tags.slice(0, 4).map((tag, index, tags) => (
                  <React.Fragment key={tag}>
                    <span className="capitalize">{renderTagLabel(tag)}</span>
                    {index < tags.length - 1 ? (
                      <span className="text-white/20">•</span>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={primaryHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.075] px-5 text-[14px] font-semibold text-white transition duration-300 hover:bg-white/[0.12]"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>

              {onShowAnotherDirection ? (
                <button
                  type="button"
                  onClick={onShowAnotherDirection}
                  className="inline-flex min-h-12 items-center gap-2 px-1 text-[14px] font-medium text-white/62 transition duration-300 hover:text-white"
                >
                  <RefreshCcw className="h-4 w-4" />
                  {secondaryLabel}
                </button>
              ) : null}
            </div>

          </div>

          <div className="relative hidden lg:block">
            <SignalField path={path} active={active} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ExploreSpotlightPath;