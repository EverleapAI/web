"use client";

import { motion } from "framer-motion";
import type { OnboardingAnimationState } from "./useAnimationState";

type Props = {
  state: OnboardingAnimationState;
};

function DrawPath({
  d,
  opacity,
  delay = 0,
  duration = 1.2,
  stroke = "rgba(150,240,255,0.72)",
  strokeWidth = 2,
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
      initial={{
        pathLength: 0,
        opacity: 0,
      }}
      animate={{
        pathLength: 1,
        opacity,
      }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function EverleapWordmark() {
  return (
    <>
      <motion.text
        x="400"
        y="146"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Snell Roundhand, Segoe Script, cursive"
        fontSize="108"
        fontWeight="400"
        fill="none"
        stroke="rgba(146,238,255,0.84)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          opacity: 0,
          strokeDasharray: 1600,
          strokeDashoffset: 1600,
        }}
        animate={{
          opacity: 1,
          strokeDashoffset: 0,
        }}
        transition={{
          opacity: {
            duration: 0.4,
          },
          strokeDashoffset: {
            duration: 5.6,
            ease: "easeInOut",
          },
        }}
      >
        Everleap
      </motion.text>

      <motion.text
        x="400"
        y="146"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Snell Roundhand, Segoe Script, cursive"
        fontSize="108"
        fontWeight="400"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 4.8,
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        Everleap
      </motion.text>

      <DrawPath
        pathKey="everleap-arrow"
        d="
          M590 154
          C650 150, 704 120, 742 76
          M742 76
          L724 82
          M742 76
          L738 96
        "
        opacity={0.72}
        delay={4.2}
        duration={1.8}
        stroke="rgba(170,150,255,0.72)"
        strokeWidth={1.8}
      />
    </>
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
    case "finalMap":
      return <EverleapWordmark />;

    case "branching":
    case "branchExtend":
      return (
        <>
          <DrawPath
            pathKey={`${key}-main`}
            d="
              M120 170
              C240 150, 320 124, 410 92
              C490 64, 560 40, 700 36
            "
            opacity={opacity}
            strokeWidth={2.8}
          />

          <DrawPath
            pathKey={`${key}-secondary`}
            d="
              M410 92
              C498 116, 580 146, 692 148
            "
            opacity={opacity * 0.32}
            delay={0.3}
            strokeWidth={1.3}
          />
        </>
      );

    case "networkGrow":
      return (
        <>
          <DrawPath
            pathKey={`${key}-orbit`}
            d="
              M188 128
              C288 58, 492 58, 592 128
              C522 196, 274 198, 188 128
            "
            opacity={opacity}
            strokeWidth={2.3}
          />

          <DrawPath
            pathKey={`${key}-thread`}
            d="
              M248 126
              C330 116, 430 114, 530 126
            "
            opacity={opacity * 0.24}
            delay={0.22}
            strokeWidth={1.1}
          />
        </>
      );

    case "instinctShift":
      return (
        <DrawPath
          pathKey={`${key}-instinct`}
          d="
            M132 172
            C220 44, 306 196, 408 90
            C500 0, 574 146, 692 64
          "
          opacity={opacity}
          strokeWidth={2.6}
        />
      );

    case "terrain":
      return (
        <>
          <DrawPath
            pathKey={`${key}-horizon`}
            d="
              M112 152
              C214 92, 312 168, 422 118
              C532 68, 614 116, 706 82
            "
            opacity={opacity}
            strokeWidth={2.2}
          />

          <DrawPath
            pathKey={`${key}-trail`}
            d="
              M344 188
              C402 150, 456 132, 530 114
            "
            opacity={opacity * 0.22}
            delay={0.2}
            strokeWidth={1}
          />
        </>
      );

    case "connect":
      return (
        <DrawPath
          pathKey={`${key}-connect`}
          d="
            M138 138
            C240 92, 336 162, 430 118
            C526 72, 608 112, 688 88
          "
          opacity={opacity}
          strokeWidth={2.2}
        />
      );

    case "nameTag":
      return (
        <>
          <DrawPath
            pathKey={`${key}-signature`}
            d="
              M204 146
              C274 78, 346 198, 432 110
              C498 44, 564 126, 640 96
            "
            opacity={opacity}
            strokeWidth={2.4}
          />

          <DrawPath
            pathKey={`${key}-echo`}
            d="
              M308 172
              C368 156, 434 150, 506 144
            "
            opacity={opacity * 0.18}
            delay={0.22}
            strokeWidth={0.9}
          />
        </>
      );

    case "anchor":
    default:
      return (
        <>
          <DrawPath
            pathKey={`${key}-anchor`}
            d="
              M96 150
              C214 96, 314 166, 424 118
              C534 70, 620 112, 716 84
            "
            opacity={opacity}
            strokeWidth={2.3}
          />

          <DrawPath
            pathKey={`${key}-horizon`}
            d="
              M248 194
              C360 164, 488 152, 640 118
            "
            opacity={opacity * 0.16}
            delay={0.2}
            strokeWidth={0.9}
          />
        </>
      );
  }
}

export default function AnimatedCanvas({ state }: Props) {
  const isWordmark = state.preset === "finalMap";

  const opacity = isWordmark
    ? 0.84
    : state.isTransition
      ? 0.36
      : 0.78;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: isWordmark ? 0.22 : 0,
        }}
        transition={{
          duration: 2,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-[3.4/1] w-full max-w-[760px] px-2">
          <svg
            viewBox="0 0 800 260"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
          >
            <PresetLines state={state} opacity={opacity} />
          </svg>
        </div>
      </div>
    </div>
  );
}