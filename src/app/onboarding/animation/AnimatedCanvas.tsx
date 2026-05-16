"use client";

import { motion } from "framer-motion";
import type { OnboardingAnimationState } from "./useAnimationState";

type Props = {
  state: OnboardingAnimationState;
};

type VisualNode = {
  x: number;
  y: number;
  r?: number;
  tone?: "cyan" | "violet" | "white";
};

function toneFill(tone: VisualNode["tone"]) {
  if (tone === "violet") return "rgba(196,181,253,0.82)";
  if (tone === "white") return "rgba(255,255,255,0.76)";
  return "rgba(125,249,255,0.88)";
}

function getSectionVisuals(state: OnboardingAnimationState) {
  if (state.isTransition) {
    return {
      glowOpacity: 0.34,
      lineOpacity: 0.32,
      backgroundOpacity: 0.34,
      blur: 4,
    };
  }

  return {
    glowOpacity: 0.72,
    lineOpacity: 0.78,
    backgroundOpacity: 0.62,
    blur: 0,
  };
}

function getNodes(state: OnboardingAnimationState): VisualNode[] {
  switch (state.preset) {
    case "nameTag":
      return [
        { x: 292, y: 128, tone: "white" },
        { x: 380, y: 98 },
        { x: 468, y: 128, tone: "violet" },
      ];

    case "terrain":
      return [
        { x: 210, y: 132, tone: "white" },
        { x: 330, y: 92 },
        { x: 462, y: 118, tone: "violet" },
        { x: 585, y: 78 },
      ];

    case "branching":
    case "branchExtend":
      return [
        { x: 275, y: 148, r: 4.8, tone: "white" },
        { x: 420, y: 88, tone: "violet" },
        { x: 505, y: 154 },
        { x: 638, y: 58, tone: "white" },
      ];

    case "networkGrow":
      return [
        { x: 170, y: 138 },
        { x: 250, y: 86, tone: "violet" },
        { x: 352, y: 132 },
        { x: 455, y: 76, tone: "white" },
        { x: 560, y: 124 },
        { x: 650, y: 72, tone: "violet" },
      ];

    case "finalMap":
      return [
        { x: 118, y: 152 },
        { x: 244, y: 98 },
        { x: 382, y: 132, tone: "violet" },
        { x: 520, y: 78 },
        { x: 675, y: 122, tone: "white" },
      ];

    default:
      return [
        { x: 150, y: 118 },
        { x: 330, y: 96 },
        { x: 560, y: 116, tone: "violet" },
      ];
  }
}

function DrawPath({
  d,
  opacity,
  delay = 0,
  duration = 1.15,
  stroke = "url(#everleap-line)",
  strokeWidth = 2.2,
  pathKey,
}: {
  d: string;
  opacity: number;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  pathKey: string;
}) {
  return (
    <motion.path
      key={pathKey}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration, delay, ease: "easeInOut" }}
    />
  );
}

function PresetLines({
  state,
  opacity,
}: {
  state: OnboardingAnimationState;
  opacity: number;
}) {
  const key = `${state.nodeKey}-${state.preset}`;

  switch (state.preset) {
    case "nameTag":
      return (
        <>
          <DrawPath
            pathKey={`${key}-face`}
            d="M310 152 C268 116, 286 56, 350 50 C424 44, 490 94, 470 152 C452 206, 352 210, 310 152"
            opacity={opacity}
            duration={1.25}
          />
          <DrawPath
            pathKey={`${key}-voice`}
            d="M205 128 C245 92, 282 166, 326 128 C370 90, 405 166, 452 128 C498 92, 536 154, 595 118"
            opacity={opacity * 0.72}
            delay={0.16}
            duration={1.1}
            strokeWidth={1.8}
          />
        </>
      );

    case "terrain":
      return (
        <>
          <DrawPath
            pathKey={`${key}-contour-1`}
            d="M130 150 C220 88, 302 178, 390 118 C480 56, 570 142, 690 84"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-contour-2`}
            d="M150 184 C245 126, 324 204, 422 150 C522 96, 590 170, 704 128"
            opacity={opacity * 0.58}
            delay={0.14}
            strokeWidth={1.6}
          />
          <DrawPath
            pathKey={`${key}-thought`}
            d="M312 88 C342 58, 402 58, 430 92 C456 126, 430 164, 382 166 C336 168, 286 126, 312 88"
            opacity={opacity * 0.52}
            delay={0.22}
            strokeWidth={1.7}
          />
        </>
      );

    case "connect":
      return (
        <>
          <DrawPath
            pathKey={`${key}-links`}
            d="M140 132 L255 82 L374 138 L492 86 L640 124"
            opacity={opacity}
            duration={1}
          />
          <DrawPath
            pathKey={`${key}-process`}
            d="M190 170 C282 116, 378 204, 470 138 C548 82, 610 110, 680 78"
            opacity={opacity * 0.46}
            delay={0.18}
            strokeWidth={1.6}
          />
        </>
      );

    case "branching":
      return (
        <>
          <DrawPath
            pathKey={`${key}-trunk`}
            d="M118 156 C230 126, 318 118, 402 92"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-branch-a`}
            d="M402 92 C494 42, 584 42, 704 28"
            opacity={opacity * 0.88}
            delay={0.18}
          />
          <DrawPath
            pathKey={`${key}-branch-b`}
            d="M402 92 C504 118, 560 158, 698 150"
            opacity={opacity * 0.64}
            delay={0.24}
            strokeWidth={1.8}
          />
          <DrawPath
            pathKey={`${key}-branch-c`}
            d="M402 92 C490 82, 560 96, 670 82"
            opacity={opacity * 0.5}
            delay={0.32}
            strokeWidth={1.5}
          />
        </>
      );

    case "branchExtend":
      return (
        <>
          <DrawPath
            pathKey={`${key}-single-signal`}
            d="M110 158 C220 136, 314 114, 402 92 C500 66, 590 52, 712 32"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-echo`}
            d="M194 188 C292 160, 382 144, 482 112 C570 84, 626 82, 706 68"
            opacity={opacity * 0.48}
            delay={0.18}
            strokeWidth={1.6}
          />
        </>
      );

    case "networkGrow":
      return (
        <>
          <DrawPath
            pathKey={`${key}-network-a`}
            d="M170 138 L250 86 L352 132 L455 76 L560 124 L650 72"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-network-b`}
            d="M250 86 L455 76 M352 132 L560 124 M170 138 L352 132"
            opacity={opacity * 0.5}
            delay={0.18}
            strokeWidth={1.5}
          />
          <DrawPath
            pathKey={`${key}-orbit`}
            d="M248 116 C305 54, 448 54, 510 116 C568 174, 386 204, 248 116"
            opacity={opacity * 0.32}
            delay={0.28}
            strokeWidth={1.4}
          />
        </>
      );

    case "instinctShift":
      return (
        <>
          <DrawPath
            pathKey={`${key}-instinct`}
            d="M120 170 C190 42, 270 198, 352 82 C442 -2, 520 166, 690 52"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-angle`}
            d="M352 82 L430 134 L512 72 M352 82 L302 144"
            opacity={opacity * 0.6}
            delay={0.18}
            strokeWidth={1.6}
          />
        </>
      );

    case "finalMap":
      return (
        <>
          <DrawPath
            pathKey={`${key}-map-a`}
            d="M118 152 C218 98, 300 168, 382 132 C472 92, 565 80, 675 122"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-map-b`}
            d="M244 98 C328 58, 456 58, 520 78 C596 104, 632 118, 675 122"
            opacity={opacity * 0.48}
            delay={0.18}
            strokeWidth={1.6}
          />
          <DrawPath
            pathKey={`${key}-map-c`}
            d="M118 152 C262 188, 430 182, 675 122"
            opacity={opacity * 0.36}
            delay={0.28}
            strokeWidth={1.4}
          />
        </>
      );

    case "anchor":
    default:
      return (
        <>
          <DrawPath
            pathKey={`${key}-horizon`}
            d="M96 142 C200 92, 300 178, 408 124 C520 68, 612 122, 724 82"
            opacity={opacity}
          />
          <DrawPath
            pathKey={`${key}-path`}
            d="M330 188 C374 150, 420 132, 480 116 C548 98, 620 92, 710 72"
            opacity={opacity * 0.42}
            delay={0.2}
            strokeWidth={1.7}
          />
        </>
      );
  }
}

export default function AnimatedCanvas({ state }: Props) {
  const nodes = getNodes(state);
  const sectionVisuals = getSectionVisuals(state);
  const opacity = 0.9 * sectionVisuals.glowOpacity;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_11%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(168,85,247,0.09),transparent_24%)]"
        animate={{ opacity: sectionVisuals.backgroundOpacity }}
        transition={{ duration: 1.2 }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-b from-transparent via-[#040817]/72 to-[#040817]/96" />

      <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#040817]/64 via-[#040817]/20 to-transparent" />

      <div className="absolute inset-x-0 top-[86px] flex h-[32svh] min-h-[210px] max-h-[310px] justify-center">
        <div className="relative h-full w-full max-w-[760px] px-4">
          <svg
            viewBox="0 0 800 260"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: sectionVisuals.lineOpacity,
              filter: `blur(${sectionVisuals.blur}px)`,
            }}
          >
            <defs>
              <linearGradient
                id="everleap-line"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="34%" stopColor="rgba(125,249,255,0.7)" />
                <stop offset="68%" stopColor="rgba(196,181,253,0.64)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
            </defs>

            <PresetLines state={state} opacity={opacity} />

            {nodes.map((node, index) => (
              <motion.circle
                key={`${state.nodeKey}-${index}`}
                cx={node.x}
                cy={node.y}
                r={node.r ?? (index % 3 === 0 ? 4.2 : 3.2)}
                fill={toneFill(node.tone)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.72 * sectionVisuals.glowOpacity],
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.12 + index * 0.08,
                }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}