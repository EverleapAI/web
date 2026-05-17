"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { getVisualKey } from "./visualConfigs";

type Props = {
  visualKey?: string | null;
};

type PathProps = {
  d: string;
  delay?: number;
  duration?: number;
  width?: number;
  opacity?: number;
  color?: string;
};

const WHITE = "rgba(255,255,255,0.9)";
const DIM_WHITE = "rgba(255,255,255,0.55)";
const VIOLET = "rgba(192,132,252,0.78)";
const CORAL = "rgba(249,115,82,0.78)";

export default function OnboardingVisual({ visualKey }: Props) {
  const key = getVisualKey(visualKey);

  if (!key) return null;

  switch (key) {
    case "welcome":
      return <WelcomeVisual />;
    case "how_it_works":
      return <HowItWorksVisual />;
    case "what_you_get":
      return <WhatYouGetVisual />;
    case "progress":
      return <ProgressVisual />;
    case "lets_get_started":
      return <LetsGetStartedVisual />;
    case "permissions":
      return <PermissionsVisual />;
    case "intro_name":
    case "name":
      return <NameVisual />;
    case "life_stage":
      return <LifeStageVisual />;
    case "radar":
    case "post_school_radar":
      return <RadarVisual />;
    case "certainty":
      return <CertaintyVisual />;
    case "certainty_idea":
      return <IdeaVisual />;
    case "activities":
      return <ActivitiesVisual />;
    case "summary_transition":
      return <SummaryVisual />;
    default:
      return null;
  }
}

function SvgShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none mx-auto mb-6 flex h-[164px] w-full max-w-[320px] items-center justify-center overflow-visible">
      <svg
        viewBox="0 0 340 190"
        className="h-full w-full overflow-visible"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="everleapGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0.62
                0 1 0 0 0.82
                0 0 1 0 1
                0 0 0 0.86 0
              "
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {children}
      </svg>
    </div>
  );
}

function DrawPath({
  d,
  delay = 0,
  duration = 1.25,
  width = 3,
  opacity = 0.9,
  color = WHITE,
}: PathProps) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#everleapGlow)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration, ease: "easeInOut", delay }}
    />
  );
}

function Dot({
  cx,
  cy,
  delay = 0,
  r = 2,
  color = DIM_WHITE,
}: {
  cx: number;
  cy: number;
  delay?: number;
  r?: number;
  color?: string;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      filter="url(#everleapGlow)"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.8, 0.45], scale: [0.4, 1.08, 1] }}
      transition={{ duration: 1.15, ease: "easeOut", delay }}
    />
  );
}

function Star({
  x,
  y,
  delay = 1.2,
  color = WHITE,
}: {
  x: number;
  y: number;
  delay?: number;
  color?: string;
}) {
  const d = `M${x} ${y - 12} L${x + 4} ${y - 4} L${x + 12} ${y} L${x + 4} ${y + 4} L${x} ${y + 12} L${x - 4} ${y + 4} L${x - 12} ${y} L${x - 4} ${y - 4} Z`;

  return (
    <motion.path
      d={d}
      fill={color}
      filter="url(#everleapGlow)"
      initial={{ scale: 0.35, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

function WelcomeVisual() {
  return (
    <SvgShell>
      <DrawPath d="M45 146 C78 128, 92 102, 124 108 C153 113, 160 78, 188 74 C217 70, 231 91, 254 67" width={3.2} duration={1.45} />
      <DrawPath d="M240 67 L240 36 L274 36 L274 91 L240 91" delay={0.65} duration={1.15} width={3} />
      <DrawPath d="M254 91 L254 50 L274 36" delay={0.95} duration={0.95} width={2.6} color={VIOLET} />
      <Star x={258} y={31} delay={1.55} />
      <Dot cx={83} cy={72} delay={0.25} />
      <Dot cx={109} cy={42} delay={0.55} />
      <Dot cx={137} cy={87} delay={0.75} />
      <Dot cx={199} cy={38} delay={0.95} />
      <Dot cx={292} cy={75} delay={1.1} />
    </SvgShell>
  );
}

function HowItWorksVisual() {
  return (
    <SvgShell>
      <DrawPath d="M61 122 C88 74, 121 92, 146 54 C172 18, 204 58, 228 43 C251 28, 269 62, 284 91" duration={1.55} />
      <DrawPath d="M98 112 C132 128, 173 101, 204 116 C234 130, 255 111, 284 91" delay={0.35} duration={1.2} width={2.4} opacity={0.62} color={DIM_WHITE} />
      {[
        [61, 122],
        [146, 54],
        [204, 116],
        [228, 43],
        [284, 91],
      ].map(([cx, cy], index) => (
        <Dot key={`${cx}-${cy}`} cx={cx} cy={cy} delay={0.45 + index * 0.16} r={3} color={index === 1 ? VIOLET : DIM_WHITE} />
      ))}
    </SvgShell>
  );
}

function WhatYouGetVisual() {
  return (
    <SvgShell>
      <DrawPath d="M94 126 C117 98, 143 118, 169 88 C195 58, 218 77, 246 48" duration={1.3} />
      <DrawPath d="M112 128 L112 82 C112 70, 122 62, 134 62 L216 62 C228 62, 238 70, 238 82 L238 128 Z" delay={0.45} duration={1.15} width={2.8} />
      <DrawPath d="M135 62 C139 42, 159 42, 170 62 C181 42, 202 42, 206 62" delay={0.85} duration={0.95} color={VIOLET} width={2.6} />
      <DrawPath d="M112 91 L238 91" delay={1.05} duration={0.55} width={2.2} opacity={0.7} color={DIM_WHITE} />
      <Dot cx={170} cy={91} delay={1.25} r={3} color={CORAL} />
    </SvgShell>
  );
}

function ProgressVisual() {
  return (
    <SvgShell>
      <DrawPath d="M72 138 C101 137, 112 119, 132 119 C153 119, 157 93, 181 93 C205 93, 210 62, 238 62 C255 62, 265 54, 278 43" duration={1.45} width={3.1} />
      <DrawPath d="M93 138 L93 118" delay={0.25} duration={0.45} width={2.5} color={DIM_WHITE} />
      <DrawPath d="M145 138 L145 105" delay={0.42} duration={0.5} width={2.5} color={DIM_WHITE} />
      <DrawPath d="M197 138 L197 82" delay={0.59} duration={0.55} width={2.5} color={DIM_WHITE} />
      <DrawPath d="M249 138 L249 58" delay={0.76} duration={0.6} width={2.5} color={DIM_WHITE} />
      <DrawPath d="M263 42 L278 43 L272 58" delay={1.05} duration={0.45} color={VIOLET} />
    </SvgShell>
  );
}

function LetsGetStartedVisual() {
  return (
    <SvgShell>
      <DrawPath d="M74 132 C112 130, 132 110, 151 91 C178 64, 207 52, 263 41" duration={1.15} width={3.2} />
      <DrawPath d="M213 50 L265 40 L230 79 Z" delay={0.55} duration={0.85} color={VIOLET} width={2.8} />
      <DrawPath d="M79 145 C110 145, 133 137, 156 123" delay={0.35} duration={0.75} opacity={0.55} color={DIM_WHITE} width={2.1} />
      <DrawPath d="M104 158 C136 157, 161 147, 185 130" delay={0.55} duration={0.75} opacity={0.45} color={DIM_WHITE} width={1.9} />
      <Dot cx={264} cy={40} delay={1.05} r={2.8} color={CORAL} />
    </SvgShell>
  );
}

function PermissionsVisual() {
  return (
    <SvgShell>
      <DrawPath d="M83 94 C111 55, 151 42, 198 49 C240 55, 264 83, 257 118 C249 156, 202 166, 169 146 C132 124, 117 97, 83 94 Z" duration={1.45} width={2.9} />
      <DrawPath d="M159 53 C143 71, 137 91, 142 111 C149 139, 174 151, 185 154" delay={0.35} duration={1.2} opacity={0.55} color={DIM_WHITE} width={2.2} />
      <DrawPath d="M154 101 L173 120 L211 82" delay={0.95} duration={0.75} color={VIOLET} width={3.2} />
      <Dot cx={83} cy={94} delay={0.25} />
      <Dot cx={257} cy={118} delay={0.5} />
    </SvgShell>
  );
}

function NameVisual() {
  return (
    <SvgShell>
      <DrawPath d="M73 104 C98 70, 126 77, 145 96 C164 116, 195 125, 221 99 C239 81, 259 78, 278 91" duration={1.4} width={3} />
      <DrawPath d="M116 121 C132 93, 164 89, 181 112 C191 126, 205 132, 222 126" delay={0.35} duration={1.05} opacity={0.65} color={DIM_WHITE} width={2.4} />
      <DrawPath d="M142 77 C154 55, 188 55, 200 77" delay={0.75} duration={0.75} color={VIOLET} width={2.6} />
      <DrawPath d="M142 77 C143 103, 199 103, 200 77" delay={0.92} duration={0.75} color={VIOLET} width={2.6} />
      <Dot cx={171} cy={76} delay={1.25} r={2.8} color={CORAL} />
    </SvgShell>
  );
}

function LifeStageVisual() {
  return (
    <SvgShell>
      <DrawPath d="M67 136 C101 117, 114 95, 139 105 C164 115, 172 86, 194 83 C219 80, 231 111, 267 91" duration={1.45} width={3} />
      <DrawPath d="M194 83 C201 61, 220 47, 247 42" delay={0.45} duration={0.9} color={DIM_WHITE} opacity={0.56} width={2.3} />
      <DrawPath d="M194 83 C205 99, 225 109, 250 111" delay={0.55} duration={0.9} color={DIM_WHITE} opacity={0.56} width={2.3} />
      <DrawPath d="M194 83 C184 105, 171 126, 150 143" delay={0.65} duration={0.95} color={VIOLET} opacity={0.8} width={2.5} />
      <Star x={267} y={91} delay={1.25} color={CORAL} />
    </SvgShell>
  );
}

function RadarVisual() {
  return (
    <SvgShell>
      <DrawPath d="M78 137 C104 104, 132 86, 169 84 C207 82, 235 99, 264 126" duration={1.3} width={2.8} />
      <DrawPath d="M108 123 C128 101, 149 94, 171 94 C196 94, 216 104, 236 124" delay={0.3} duration={1} width={2.2} opacity={0.6} color={DIM_WHITE} />
      <DrawPath d="M139 110 C151 101, 162 98, 173 99 C188 100, 199 106, 211 117" delay={0.5} duration={0.85} width={2.1} opacity={0.5} color={DIM_WHITE} />
      <DrawPath d="M170 137 L170 83 L226 51" delay={0.65} duration={0.95} color={VIOLET} width={2.7} />
      <Dot cx={226} cy={51} delay={1.2} r={3.2} color={CORAL} />
      <Dot cx={109} cy={72} delay={0.8} />
      <Dot cx={264} cy={92} delay={1.05} />
    </SvgShell>
  );
}

function CertaintyVisual() {
  return (
    <SvgShell>
      <DrawPath d="M72 130 C103 105, 122 118, 145 98 C163 82, 181 89, 197 75 C219 56, 241 57, 267 44" duration={1.5} width={3} />
      <DrawPath d="M93 143 C127 120, 156 116, 189 91 C216 70, 236 65, 259 64" delay={0.35} duration={1.1} color={DIM_WHITE} opacity={0.52} width={2.2} />
      <DrawPath d="M216 45 C233 30, 263 33, 278 52 C293 72, 289 101, 270 117 C250 134, 222 129, 207 110 C191 90, 197 62, 216 45 Z" delay={0.75} duration={1.1} color={VIOLET} width={2.5} />
      <Dot cx={243} cy={82} delay={1.35} r={3} color={CORAL} />
    </SvgShell>
  );
}

function IdeaVisual() {
  return (
    <SvgShell>
      <DrawPath d="M83 126 C116 95, 139 111, 158 85 C176 60, 205 58, 223 81 C244 108, 218 142, 184 132 C165 127, 155 113, 158 96" duration={1.55} width={3} />
      <DrawPath d="M158 96 C149 72, 169 50, 194 51 C219 52, 236 76, 226 99 C220 113, 207 122, 193 125" delay={0.5} duration={1.1} color={VIOLET} width={2.7} />
      <DrawPath d="M177 141 L207 141" delay={1.05} duration={0.35} color={DIM_WHITE} width={2.4} />
      <DrawPath d="M181 153 L203 153" delay={1.2} duration={0.35} color={DIM_WHITE} width={2.4} />
      <Star x={195} y={79} delay={1.3} color={CORAL} />
    </SvgShell>
  );
}

function ActivitiesVisual() {
  return (
    <SvgShell>
      <DrawPath d="M84 96 C113 55, 170 52, 198 91 C226 129, 191 158, 153 141 C117 124, 119 80, 155 76 C191 72, 218 106, 199 132" duration={1.65} width={3} />
      <DrawPath d="M104 126 C134 152, 191 152, 220 115 C248 79, 220 48, 184 53" delay={0.35} duration={1.35} color={DIM_WHITE} opacity={0.55} width={2.2} />
      <Dot cx={155} cy={76} delay={0.85} r={3} color={VIOLET} />
      <Dot cx={199} cy={132} delay={1.05} r={3} color={CORAL} />
      <Dot cx={184} cy={53} delay={1.25} r={2.4} />
    </SvgShell>
  );
}

function SummaryVisual() {
  return (
    <SvgShell>
      <DrawPath d="M70 125 C101 91, 127 105, 153 84 C179 62, 206 69, 230 48 C247 33, 267 36, 282 53" duration={1.45} width={3} />
      <DrawPath d="M105 138 C130 111, 159 112, 183 96 C212 77, 236 83, 263 103" delay={0.35} duration={1.2} color={DIM_WHITE} opacity={0.55} width={2.2} />
      <DrawPath d="M122 62 C151 38, 195 39, 226 64 C195 91, 153 92, 122 62 Z" delay={0.75} duration={1.15} color={VIOLET} width={2.6} />
      <DrawPath d="M145 62 C164 73, 184 73, 205 62" delay={1.05} duration={0.65} color={CORAL} width={2.3} />
      <Dot cx={174} cy={62} delay={1.25} r={3} color={WHITE} />
    </SvgShell>
  );
}