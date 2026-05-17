"use client";

import * as React from "react";

type RegAuthVisualKind =
  | "code"
  | "verify"
  | "zip"
  | "welcome";

type RegAuthVisualProps = {
  kind: RegAuthVisualKind;
  className?: string;
};

const drawLine =
  "fill-none stroke-white/85 stroke-[2.25] stroke-linecap-round stroke-linejoin-round [stroke-dasharray:420] [stroke-dashoffset:420] animate-[regauthDraw_1.7s_ease-out_forwards]";

const softLine =
  "fill-none stroke-cyan-200/55 stroke-[1.5] stroke-linecap-round stroke-linejoin-round [stroke-dasharray:320] [stroke-dashoffset:320] animate-[regauthDraw_2.2s_ease-out_forwards]";

const violetLine =
  "fill-none stroke-violet-200/45 stroke-[1.4] stroke-linecap-round stroke-linejoin-round [stroke-dasharray:260] [stroke-dashoffset:260] animate-[regauthDraw_2.4s_ease-out_forwards]";

function AmbientParticles() {
  return (
    <>
      <circle
        cx="62"
        cy="82"
        r="2"
        className="fill-cyan-200/60 animate-[regauthFloat_7s_ease-in-out_infinite]"
      />

      <circle
        cx="210"
        cy="72"
        r="1.6"
        className="fill-violet-200/50 animate-[regauthFloat_9s_ease-in-out_infinite]"
      />

      <circle
        cx="224"
        cy="188"
        r="2"
        className="fill-cyan-100/45 animate-[regauthFloat_11s_ease-in-out_infinite]"
      />

      <circle
        cx="78"
        cy="210"
        r="1.8"
        className="fill-white/40 animate-[regauthFloat_8s_ease-in-out_infinite]"
      />
    </>
  );
}

function OrbitLines() {
  return (
    <>
      <ellipse
        cx="140"
        cy="145"
        rx="96"
        ry="84"
        className="fill-none stroke-cyan-200/10 stroke-[1.1] animate-[regauthPulse_6s_ease-in-out_infinite]"
      />

      <ellipse
        cx="140"
        cy="145"
        rx="72"
        ry="62"
        className="fill-none stroke-violet-200/10 stroke-[1] animate-[regauthPulse_8s_ease-in-out_infinite]"
      />
    </>
  );
}

function CodeVisual() {
  return (
    <>
      <path
        className={softLine}
        d="M54 128 C78 86, 132 70, 171 93 C209 116, 211 176, 172 198 C128 223, 72 194, 54 128Z"
      />

      <path
        className={drawLine}
        d="M93 112 H171 A12 12 0 0 1 183 124 V176 A12 12 0 0 1 171 188 H93 A12 12 0 0 1 81 176 V124 A12 12 0 0 1 93 112Z"
      />

      <path
        className={drawLine}
        d="M81 129 L132 158 L183 129"
      />

      <path
        className={violetLine}
        d="M104 92 C112 73, 151 73, 160 92"
      />

      <path
        className={softLine}
        d="M104 213 C124 224, 148 224, 168 213"
      />

      <circle
        className="fill-cyan-200/80 opacity-0 animate-[regauthFade_1s_ease-out_1s_forwards]"
        cx="132"
        cy="158"
        r="3.5"
      />
    </>
  );
}

function VerifyVisual() {
  return (
    <>
      <path
        className={softLine}
        d="M61 133 C70 91, 116 68, 157 80 C201 93, 219 143, 195 181 C170 221, 105 219, 75 182"
      />

      <path
        className={drawLine}
        d="M99 102 H165 A10 10 0 0 1 175 112 V196 A10 10 0 0 1 165 206 H99 A10 10 0 0 1 89 196 V112 A10 10 0 0 1 99 102Z"
      />

      <path className={drawLine} d="M112 122 H152" />
      <path className={drawLine} d="M112 181 H152" />

      <path
        className={softLine}
        d="M113 151 H121 M132 151 H140 M151 151 H159"
      />

      <path
        className={violetLine}
        d="M188 94 C201 82, 218 84, 229 98"
      />

      <path
        className={violetLine}
        d="M197 107 C205 100, 215 101, 222 109"
      />

      <circle
        className="fill-cyan-200/80 opacity-0 animate-[regauthFade_1s_ease-out_1s_forwards]"
        cx="132"
        cy="151"
        r="3"
      />
    </>
  );
}

function ZipVisual() {
  return (
    <>
      <path
        className={softLine}
        d="M63 152 C63 105, 101 67, 148 67 C195 67, 233 105, 233 152 C233 199, 195 225, 148 225 C101 225, 63 199, 63 152Z"
      />

      <path
        className={drawLine}
        d="M148 83 C121 83, 99 105, 99 132 C99 170, 148 203, 148 203 C148 203, 197 170, 197 132 C197 105, 175 83, 148 83Z"
      />

      <circle
        className={drawLine}
        cx="148"
        cy="132"
        r="18"
      />

      <path
        className={violetLine}
        d="M79 211 C105 197, 190 197, 216 211"
      />

      <path
        className={softLine}
        d="M108 229 C128 236, 168 236, 188 229"
      />

      <circle
        className="fill-cyan-200/80 opacity-0 animate-[regauthFade_1s_ease-out_1s_forwards]"
        cx="148"
        cy="132"
        r="4"
      />
    </>
  );
}

function WelcomeVisual() {
  return (
    <>
      <path
        className={softLine}
        d="M54 144 C77 91, 128 61, 177 79 C219 95, 239 148, 215 189 C190 232, 120 233, 82 198"
      />

      <path
        className={drawLine}
        d="M132 212 C132 212, 89 181, 89 135 C89 107, 110 86, 138 86 C159 86, 174 97, 183 113 C193 131, 190 154, 172 176 C158 193, 132 212, 132 212Z"
      />

      <path
        className={drawLine}
        d="M114 139 L131 156 L166 120"
      />

      <path
        className={violetLine}
        d="M91 219 C117 231, 151 234, 184 221"
      />

      <path
        className={softLine}
        d="M199 87 C214 76, 230 81, 238 96"
      />

      <circle
        className="fill-cyan-200/80 opacity-0 animate-[regauthFade_1s_ease-out_1s_forwards]"
        cx="132"
        cy="156"
        r="3.5"
      />
    </>
  );
}

export default function RegAuthVisual({
  kind,
  className = "",
}: RegAuthVisualProps): React.JSX.Element {
  return (
    <div
      className={`relative mx-auto h-[136px] w-full max-w-[260px] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-[regauthGlow_7s_ease-in-out_infinite] rounded-[2rem] bg-cyan-300/5 blur-2xl" />

      <svg
        viewBox="0 0 280 280"
        className="relative h-full w-full animate-[regauthFloat_12s_ease-in-out_infinite] drop-shadow-[0_0_24px_rgba(165,243,252,0.2)]"
      >
        <defs>
          <radialGradient
            id="regauthGlow"
            cx="50%"
            cy="45%"
            r="55%"
          >
            <stop
              offset="0%"
              stopColor="rgba(255,255,255,0.18)"
            />

            <stop
              offset="58%"
              stopColor="rgba(103,232,249,0.08)"
            />

            <stop
              offset="100%"
              stopColor="rgba(255,255,255,0)"
            />
          </radialGradient>
        </defs>

        <circle
          cx="140"
          cy="145"
          r="106"
          fill="url(#regauthGlow)"
        />

        <OrbitLines />
        <AmbientParticles />

        {kind === "code" ? <CodeVisual /> : null}
        {kind === "verify" ? <VerifyVisual /> : null}
        {kind === "zip" ? <ZipVisual /> : null}
        {kind === "welcome" ? <WelcomeVisual /> : null}
      </svg>

      <style jsx>{`
        @keyframes regauthDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes regauthFade {
          to {
            opacity: 1;
          }
        }

        @keyframes regauthFloat {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-5px);
          }

          100% {
            transform: translateY(0px);
          }
        }

        @keyframes regauthGlow {
          0% {
            opacity: 0.45;
          }

          50% {
            opacity: 0.9;
          }

          100% {
            opacity: 0.45;
          }
        }

        @keyframes regauthPulse {
          0% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.55;
          }

          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}