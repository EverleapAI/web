"use client";

// A short burst behind the welcome. SVG rather than canvas: it is on screen for
// three seconds, it never needs to be interactive, and canvas would mean a
// render loop running behind a screen whose whole job is to be read.
//
// Honours reduced motion by rendering a still starburst instead of nothing — a
// celebration that vanishes entirely for some users is a worse answer than a
// quiet one.

import * as React from "react";

const BURSTS = [
  { x: 28, y: 30, accent: "96, 176, 255", delay: 0 },
  { x: 72, y: 22, accent: "244, 132, 176", delay: 0.5 },
  { x: 50, y: 44, accent: "245, 176, 90", delay: 1.0 },
  { x: 18, y: 56, accent: "52, 211, 153", delay: 1.5 },
  { x: 82, y: 52, accent: "167, 139, 250", delay: 1.9 },
];

const SPOKES = 10;

export function Fireworks({ reduce }: { reduce: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <style>{`
        @keyframes elSpoke {
          0%   { transform: scale(0.15); opacity: 0; }
          18%  { opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .el-burst { transform-origin: center; transform-box: fill-box; }
      `}</style>

      {BURSTS.map((burst, i) => (
        <g key={i} transform={`translate(${burst.x} ${burst.y})`}>
          <g
            className={reduce ? undefined : "el-burst"}
            style={
              reduce
                ? { opacity: 0.5 }
                : {
                    animation: `elSpoke 2.4s ease-out ${burst.delay}s infinite`,
                  }
            }
          >
            {Array.from({ length: SPOKES }).map((_, s) => {
              const angle = (s / SPOKES) * Math.PI * 2;
              const x2 = Math.cos(angle) * 9;
              const y2 = Math.sin(angle) * 9;
              return (
                <line
                  key={s}
                  x1={0}
                  y1={0}
                  x2={x2}
                  y2={y2}
                  stroke={`rgba(${burst.accent},0.9)`}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
              );
            })}
            <circle r="1.2" fill={`rgb(${burst.accent})`} />
          </g>
        </g>
      ))}
    </svg>
  );
}

export default Fireworks;
