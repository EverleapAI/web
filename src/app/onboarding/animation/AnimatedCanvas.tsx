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
  if (tone === "violet") return "rgba(196,181,253,0.9)";
  if (tone === "white") return "rgba(255,255,255,0.82)";
  return "rgba(125,249,255,0.92)";
}

function isDenseQuestion(state: OnboardingAnimationState) {
  return (
    state.nodeKey === "current_situation" ||
    state.nodeKey === "certainty" ||
    state.nodeKey === "post_plans" ||
    state.nodeKey === "activities" ||
    state.nodeKey === "fun_instinct"
  );
}

function getSectionVisuals(state: OnboardingAnimationState) {
  if (state.isWelcome) {
    return {
      glowOpacity: 0.56,
      lineOpacity: 0.68,
      backgroundOpacity: 0.66,
      scale: 0.985,
      blur: 0,
    };
  }

  if (state.isReflection) {
    return {
      glowOpacity: 0.28,
      lineOpacity: 0.24,
      backgroundOpacity: 0.48,
      scale: 1,
      blur: 6,
    };
  }

  return {
    glowOpacity: 0.82,
    lineOpacity: 0.9,
    backgroundOpacity: 0.84,
    scale: 1,
    blur: 0,
  };
}

function getMainPath(state: OnboardingAnimationState) {
  switch (state.preset) {
    case "scatter":
      return "M82 120 C160 65, 240 148, 318 105 C405 55, 495 105, 615 58";

    case "anchor":
      return "M126 70 C185 132, 250 132, 310 88 C380 36, 462 84, 535 130 C590 165, 660 145, 720 92";

    case "connect":
      return "M95 118 C170 86, 235 146, 318 106 C402 66, 480 118, 574 86 C632 66, 690 78, 740 108";

    case "branchExtend":
      return "M82 138 C165 102, 250 98, 330 78 C425 52, 548 44, 718 18";

    case "instinctShift":
      return "M88 136 C160 42, 245 190, 330 78 C425 -12, 530 166, 706 38";

    default:
      return "M95 118 C170 86, 235 146, 318 106 C402 66, 480 118, 574 86 C632 66, 690 78, 740 108";
  }
}

function getNodes(state: OnboardingAnimationState): VisualNode[] {
  switch (state.preset) {
    case "scatter":
      return [
        { x: 120, y: 88 },
        { x: 225, y: 150, tone: "violet" },
        { x: 318, y: 104 },
        { x: 452, y: 76, tone: "white" },
        { x: 596, y: 60 },
      ];

    case "anchor":
      return [
        { x: 126, y: 70, r: 5, tone: "white" },
        { x: 310, y: 88 },
        { x: 535, y: 130, tone: "violet" },
        { x: 720, y: 92 },
      ];

    case "nameTag":
      return [
        { x: 248, y: 112, r: 5.2, tone: "white" },
        { x: 574, y: 112, r: 4.2, tone: "violet" },
        { x: 452, y: 128, r: 3.4 },
      ];

    case "terrain":
      return [
        { x: 120, y: 152 },
        { x: 302, y: 86, tone: "white" },
        { x: 508, y: 118, tone: "violet" },
        { x: 690, y: 74 },
      ];

    case "branching":
    case "branchExtend":
      return [
        { x: 292, y: 132, r: 5, tone: "white" },
        { x: 438, y: 72, tone: "violet" },
        { x: 486, y: 152 },
        { x: 640, y: 40, tone: "white" },
      ];

    case "networkGrow":
      return [
        { x: 150, y: 142 },
        { x: 238, y: 88, tone: "violet" },
        { x: 338, y: 126 },
        { x: 448, y: 72, tone: "white" },
        { x: 552, y: 118 },
        { x: 642, y: 66, tone: "violet" },
      ];

    case "finalMap":
      return [
        { x: 104, y: 150 },
        { x: 234, y: 96 },
        { x: 372, y: 132, tone: "violet" },
        { x: 518, y: 74 },
        { x: 674, y: 122, tone: "white" },
      ];

    default:
      return [
        { x: 120, y: 88 },
        { x: 318, y: 104 },
        { x: 574, y: 86, tone: "violet" },
      ];
  }
}

function getInstinctPath(state: OnboardingAnimationState) {
  if (state.instinctStyle === "wolf") {
    return "M120 155 L248 88 L386 76 L535 38 L710 26";
  }

  if (state.instinctStyle === "fox") {
    return "M105 138 C185 82, 218 126, 302 72 C370 28, 420 96, 492 48 C562 4, 620 60, 712 18";
  }

  if (state.instinctStyle === "dolphin") {
    return "M94 122 C174 38, 260 192, 352 112 C452 24, 525 168, 704 78";
  }

  if (state.instinctStyle === "hawk") {
    return "M112 162 L215 80 L308 104 L405 28 L508 58 L705 10";
  }

  return null;
}

function DrawPath({
  d,
  opacity,
  delay = 0,
  duration = 1,
  stroke = "url(#everleap-line)",
  strokeWidth = 2.6,
  dash,
  pathKey,
}: {
  d: string;
  opacity: number;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number;
  dash?: string;
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
      strokeDasharray={dash}
      filter="url(#everleap-glow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function SemanticDrawing({
  state,
  opacity,
}: {
  state: OnboardingAnimationState;
  opacity: number;
}) {
  if (state.preset === "nameTag") {
    return (
      <>
        <DrawPath
          pathKey={`tag-outline-${state.nodeKey}`}
          opacity={0.92 * opacity}
          duration={1.15}
          d="M278 54 L514 54 C548 54, 574 80, 574 112 C574 144, 548 170, 514 170 L278 170 C244 170, 218 144, 218 112 C218 80, 244 54, 278 54"
        />

        <DrawPath
          pathKey={`tag-notch-${state.nodeKey}`}
          opacity={0.72 * opacity}
          delay={0.92}
          duration={0.45}
          strokeWidth={2.2}
          d="M248 84 L278 112 L248 140"
        />

        {[
          "M320 100 L500 100",
          "M320 128 L452 128",
          "M320 146 L410 146",
        ].map((path, index) => (
          <DrawPath
            key={path}
            pathKey={`tag-line-${index}-${state.nodeKey}`}
            d={path}
            opacity={0.5 * opacity}
            delay={1.18 + index * 0.12}
            duration={0.32}
            stroke="rgba(255,255,255,0.52)"
            strokeWidth={1.7}
          />
        ))}
      </>
    );
  }

  if (state.preset === "terrain") {
    return (
      <>
        <DrawPath
          pathKey={`terrain-horizon-${state.nodeKey}`}
          opacity={0.82 * opacity}
          duration={1.1}
          d="M90 156 C154 122, 210 132, 270 98 C336 58, 410 128, 472 96 C548 56, 620 78, 710 42"
        />

        <DrawPath
          pathKey={`terrain-ground-${state.nodeKey}`}
          opacity={0.34 * opacity}
          delay={0.55}
          duration={0.8}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.5}
          d="M130 184 C230 166, 320 188, 420 170 C520 152, 610 168, 700 146"
        />

        <DrawPath
          pathKey={`terrain-trail-${state.nodeKey}`}
          opacity={0.6 * opacity}
          delay={0.85}
          duration={0.85}
          stroke="rgba(125,249,255,0.64)"
          strokeWidth={1.8}
          dash="4 8"
          d="M300 188 C338 156, 386 150, 420 124 C458 96, 488 94, 520 82"
        />
      </>
    );
  }

  if (state.preset === "networkGrow") {
    const links = [
      "M150 142 L238 88",
      "M238 88 L338 126",
      "M338 126 L448 72",
      "M448 72 L552 118",
      "M552 118 L642 66",
      "M238 88 L448 72",
      "M338 126 L552 118",
    ];

    return (
      <>
        {links.map((path, index) => (
          <DrawPath
            key={path}
            pathKey={`network-link-${index}-${state.nodeKey}`}
            d={path}
            opacity={(index < 5 ? 0.52 : 0.22) * opacity}
            delay={index * 0.12}
            duration={0.55}
            stroke={
              index < 5
                ? "rgba(125,249,255,0.66)"
                : "rgba(255,255,255,0.22)"
            }
            strokeWidth={index < 5 ? 1.8 : 1.1}
          />
        ))}
      </>
    );
  }

  if (state.preset === "finalMap") {
    return (
      <>
        <DrawPath
          pathKey={`map-path-${state.nodeKey}`}
          opacity={0.58 * opacity}
          duration={1.2}
          d="M104 150 C172 112, 226 106, 292 126 C356 146, 408 132, 466 94 C536 48, 608 80, 674 122"
        />

        <DrawPath
          pathKey={`map-secondary-${state.nodeKey}`}
          opacity={0.22 * opacity}
          delay={0.58}
          duration={0.9}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.4}
          d="M234 96 C310 74, 382 82, 448 72 C524 60, 590 88, 674 122"
        />

        <DrawPath
          pathKey={`map-orbit-${state.nodeKey}`}
          opacity={0.18 * opacity}
          delay={0.86}
          duration={1}
          stroke="rgba(196,181,253,0.34)"
          strokeWidth={1.2}
          dash="5 10"
          d="M170 150 C250 44, 426 34, 574 78 C670 106, 710 160, 610 184 C470 218, 260 206, 170 150"
        />
      </>
    );
  }

  return (
    <DrawPath
      pathKey={`main-${state.nodeKey}-${state.preset}`}
      d={getMainPath(state)}
      opacity={0.92 * opacity}
      duration={1.4}
      strokeWidth={2.4}
    />
  );
}

export default function AnimatedCanvas({ state }: Props) {
  const nodes = getNodes(state);
  const instinctPath = getInstinctPath(state);
  const denseQuestion = isDenseQuestion(state);
  const sectionVisuals = getSectionVisuals(state);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(168,85,247,0.10),transparent_26%)]"
        animate={{
          opacity: sectionVisuals.backgroundOpacity,
        }}
        transition={{ duration: 1.2 }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-b from-transparent via-[#040817]/74 to-[#040817]/96" />

      <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-[#040817]/72 via-[#040817]/24 to-transparent" />

      <div className="absolute inset-x-0 top-[72px] flex justify-center">
        <div
          className={[
            "relative w-full max-w-[760px] transition-all duration-700",
            denseQuestion
              ? "h-[270px] sm:h-[300px]"
              : "h-[240px] sm:h-[270px]",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 800 260"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: sectionVisuals.lineOpacity,
              transform: `scale(${sectionVisuals.scale})`,
              filter: `blur(${sectionVisuals.blur}px)`,
            }}
          >
            <defs>
              <filter
                id="everleap-glow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />

                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.18  0 0 0 0 0.95  0 0 0 0 1  0 0 0 0.75 0"
                  result="glow"
                />

                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient
                id="everleap-line"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                <stop offset="34%" stopColor="rgba(125,249,255,0.88)" />
                <stop offset="68%" stopColor="rgba(196,181,253,0.84)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.24)" />
              </linearGradient>
            </defs>

            <SemanticDrawing
              state={state}
              opacity={sectionVisuals.glowOpacity}
            />

            {instinctPath ? (
              <DrawPath
                pathKey={`instinct-${state.nodeKey}`}
                d={instinctPath}
                opacity={0.58}
                delay={0.12}
                duration={1.6}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={1.1}
                dash="5 9"
              />
            ) : null}

            {nodes.map((node, index) => (
              <motion.circle
                key={`${state.nodeKey}-${index}`}
                cx={node.x}
                cy={node.y}
                r={node.r ?? (index % 3 === 0 ? 4.6 : 3.4)}
                fill={toneFill(node.tone)}
                filter="url(#everleap-glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.3, 1],
                  opacity: [0, 1, 0.78 * sectionVisuals.glowOpacity],
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.09,
                }}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}