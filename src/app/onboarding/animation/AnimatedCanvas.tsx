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

function isTextHeavyQuestion(state: OnboardingAnimationState) {
  return (
    state.nodeKey === "current_situation" ||
    state.nodeKey === "certainty" ||
    state.nodeKey === "post_plans" ||
    state.nodeKey === "activities" ||
    state.nodeKey === "fun_instinct"
  );
}

function getMainPath(state: OnboardingAnimationState) {
  switch (state.preset) {
    case "scatter":
      return "M82 120 C160 65, 240 148, 318 105 C405 55, 495 105, 615 58";

    case "anchor":
      return "M126 70 C185 132, 250 132, 310 88 C380 36, 462 84, 535 130 C590 165, 660 145, 720 92";

    case "connect":
      return "M95 118 C170 86, 235 146, 318 106 C402 66, 480 118, 574 86 C632 66, 690 78, 740 108";

    case "nameTag":
  return "M300 54 L500 54 C534 54, 558 78, 558 108 C558 138, 534 162, 500 162 L300 162 C266 162, 242 138, 242 108 C242 78, 266 54, 300 54 M320 102 L486 102 M320 126 L438 126";

    case "terrain":
      return "M70 122 C140 88, 205 96, 272 74 C355 46, 435 122, 508 86 C580 52, 658 66, 730 42";

    case "branching":
      return "M92 130 C175 96, 260 92, 335 78 C430 58, 545 50, 700 28";

    case "branchExtend":
      return "M82 138 C165 102, 250 98, 330 78 C425 52, 548 44, 718 18";

    case "networkGrow":
      return "M92 126 C168 70, 235 128, 316 76 C394 24, 482 112, 560 66 C620 30, 678 50, 725 18";

    case "instinctShift":
      return "M88 136 C160 42, 245 190, 330 78 C425 -12, 530 166, 706 38";

    case "finalMap":
      return "M70 145 C145 92, 222 118, 300 72 C390 18, 488 82, 578 44 C650 14, 705 26, 754 6";

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
        { x: 224, y: 108, r: 4.8, tone: "white" },
        { x: 650, y: 238, r: 3.6 },
      ];

    case "terrain":
      return [
        { x: 70, y: 122 },
        { x: 272, y: 74 },
        { x: 508, y: 86, tone: "violet" },
        { x: 730, y: 42, tone: "white" },
      ];

    case "branching":
    case "branchExtend":
      return [
        { x: 335, y: 78, r: 5 },
        { x: 500, y: 22, tone: "violet" },
        { x: 520, y: 118 },
        { x: 700, y: 28, tone: "white" },
      ];

    case "networkGrow":
      return [
        { x: 92, y: 126 },
        { x: 205, y: 104, tone: "violet" },
        { x: 316, y: 76 },
        { x: 438, y: 82, tone: "white" },
        { x: 560, y: 66 },
        { x: 650, y: 44, tone: "violet" },
        { x: 725, y: 18 },
      ];

    case "finalMap":
      return [
        { x: 70, y: 145 },
        { x: 300, y: 72 },
        { x: 430, y: 62, tone: "violet" },
        { x: 578, y: 44 },
        { x: 754, y: 6, tone: "white" },
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
  if (state.instinctStyle === "wolf") return "M120 155 L248 88 L386 76 L535 38 L710 26";
  if (state.instinctStyle === "fox") return "M105 138 C185 82, 218 126, 302 72 C370 28, 420 96, 492 48 C562 4, 620 60, 712 18";
  if (state.instinctStyle === "dolphin") return "M94 122 C174 38, 260 192, 352 112 C452 24, 525 168, 704 78";
  if (state.instinctStyle === "hawk") return "M112 162 L215 80 L308 104 L405 28 L508 58 L705 10";
  return null;
}

export default function AnimatedCanvas({ state }: Props) {
    
  const mainPath = getMainPath(state);
  const nodes = getNodes(state);
  const instinctPath = getInstinctPath(state);
  const textHeavy = isTextHeavyQuestion(state);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_72%_70%,rgba(168,85,247,0.14),transparent_36%)]" />

      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-b from-transparent via-[#040817]/70 to-[#040817]/95" />
      <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#040817]/82 via-[#040817]/42 to-transparent" />

      <svg
        viewBox="0 0 800 260"
        preserveAspectRatio="xMidYMid slice"
        className={[
          "absolute left-1/2 w-[100vw] -translate-x-1/2 opacity-95",
          textHeavy
            ? "top-[4%] h-[38vh] min-h-[250px]"
            : "top-[2%] h-[32vh] min-h-[220px]",
        ].join(" ")}
      >
        <defs>
          <filter id="everleap-glow" x="-60%" y="-60%" width="220%" height="220%">
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

          <linearGradient id="everleap-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="34%" stopColor="rgba(125,249,255,0.95)" />
            <stop offset="68%" stopColor="rgba(196,181,253,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.28)" />
          </linearGradient>
        </defs>

        <motion.path
          key={`main-${state.nodeKey}-${state.preset}`}
          d={mainPath}
          fill="none"
          stroke="url(#everleap-line)"
          strokeWidth={state.preset === "finalMap" ? 3.2 : 2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#everleap-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 1.45, ease: "easeInOut" }}
        />

        {nodes.map((node, index) => (
          <motion.circle
            key={`${state.nodeKey}-${index}`}
            cx={node.x}
            cy={node.y}
            r={node.r ?? (index % 3 === 0 ? 4.8 : 3.5)}
            fill={toneFill(node.tone)}
            filter="url(#everleap-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.35, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.5, delay: 0.15 + index * 0.09 }}
          />
        ))}
      </svg>
    </div>
  );
}