"use client";

// The five sections of Everleap as a sky you light up.
//
// Deliberately NOT PathConstellation. That one derives its stars from Explore
// path content, loads lit-state by path and branch, and opens a descent per
// star — none of which applies here. It shares the visual vocabulary and
// nothing else.
//
// Two jobs, depending on who is looking:
//   First run  — all five dark, tap each to learn what it is. The tapping IS
//                the tour; you cannot leave until you have seen all five.
//   From Story — already lit by how much of each section you have actually
//                used, as a picture of how far you have come.

import * as React from "react";

export type StarLevel = "unvisited" | "dim" | "fire" | "nuclear";

export type JourneyStar = {
  section: string;
  visits: number;
  level: StarLevel;
  /** What this place is, written for this person by the server. */
  blurb?: string;
  label?: string;
  personalized?: boolean;
};

type Section = {
  id: string;
  label: string;
  accent: string;
  x: number;
  y: number;
};

// Irregular on purpose. Evenly spaced points read as a menu; a sky reads as
// somewhere to explore.
const SECTIONS: Section[] = [
  {
    id: "today",
    label: "Today",
    accent: "96, 176, 255",
    x: 62,
    y: 74,
  },
  {
    id: "insights",
    label: "Insights",
    accent: "167, 139, 250",
    x: 196,
    y: 42,
  },
  {
    id: "explore",
    label: "Explore",
    accent: "52, 211, 153",
    x: 322,
    y: 96,
  },
  {
    id: "actions",
    label: "Actions",
    accent: "245, 176, 90",
    x: 116,
    y: 196,
  },
  {
    id: "me",
    label: "Me",
    accent: "244, 132, 176",
    x: 284,
    y: 212,
  },
];

const EDGES: [string, string][] = [
  ["today", "insights"],
  ["insights", "explore"],
  ["today", "actions"],
  ["explore", "me"],
  ["actions", "me"],
];

const BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));

/** How brightly a star burns before anyone taps it. */
function baseGlow(level: StarLevel): { r: number; opacity: number; blur: number } {
  switch (level) {
    case "nuclear":
      return { r: 7.5, opacity: 1, blur: 14 };
    case "fire":
      return { r: 6, opacity: 0.85, blur: 9 };
    case "dim":
      return { r: 4.5, opacity: 0.6, blur: 4 };
    default:
      return { r: 3.5, opacity: 0.3, blur: 0 };
  }
}

export function JourneyConstellation({
  stars,
  requireAll,
  onComplete,
  reduce,
}: {
  stars: JourneyStar[];
  /** First run: every star must be opened before they can continue. */
  requireAll: boolean;
  onComplete: () => void;
  reduce: boolean;
}) {
  const levels = React.useMemo(() => {
    const map = new Map<string, StarLevel>();
    for (const star of stars) map.set(star.section, star.level);
    return map;
  }, [stars]);

  const [opened, setOpened] = React.useState<Set<string>>(new Set());
  const [active, setActive] = React.useState<string | null>(null);

  const activeSection = active ? BY_ID.get(active) : null;

  // The copy comes from the server: authored for a brand-new account, written
  // for this person once their stars have been generated. The component holds
  // the geometry and the colour, never the words.
  const copyFor = React.useCallback(
    (sectionId: string) =>
      stars.find((s) => s.section === sectionId)?.blurb ?? "",
    [stars]
  );
  const allOpened = opened.size >= SECTIONS.length;

  function tap(id: string) {
    setActive(id);
    setOpened((prev) => new Set([...prev, id]));
  }

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 384 264"
        className="w-full"
        role="group"
        aria-label="The five parts of Everleap"
      >
        {EDGES.map(([a, b]) => {
          const from = BY_ID.get(a)!;
          const to = BY_ID.get(b)!;
          const bothSeen = opened.has(a) && opened.has(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                bothSeen ? `rgba(${from.accent},0.4)` : "rgba(255,255,255,0.10)"
              }
              strokeWidth="1"
              className="transition-all duration-700"
            />
          );
        })}

        {SECTIONS.map((section) => {
          const level = levels.get(section.id) ?? "unvisited";
          const glow = baseGlow(level);
          const isOpen = opened.has(section.id);
          const isActive = active === section.id;
          const r = isActive ? glow.r + 2 : isOpen ? glow.r + 1 : glow.r;

          return (
            <g
              key={section.id}
              onClick={() => tap(section.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={section.label}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  tap(section.id);
                }
              }}
            >
              {/* A generous invisible hit area — the visible star is far too
                  small to tap accurately on a phone. */}
              <circle cx={section.x} cy={section.y} r="26" fill="transparent" />

              {!isOpen && !reduce ? (
                <circle
                  cx={section.x}
                  cy={section.y}
                  r={r + 5}
                  fill="none"
                  stroke={`rgba(${section.accent},0.35)`}
                  strokeWidth="1"
                >
                  {/* Unopened stars breathe, so it reads as "tap me" without
                      a label saying so. */}
                  <animate
                    attributeName="r"
                    values={`${r + 3};${r + 9};${r + 3}`}
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.55;0.1;0.55"
                    dur="2.6s"
                    repeatCount="indefinite"
                  />
                </circle>
              ) : null}

              <circle
                cx={section.x}
                cy={section.y}
                r={r}
                fill={`rgba(${section.accent},${isOpen ? 1 : glow.opacity})`}
                className="transition-all duration-500"
                style={{
                  filter:
                    isOpen || glow.blur
                      ? `drop-shadow(0 0 ${isOpen ? 12 : glow.blur}px rgb(${section.accent}))`
                      : undefined,
                }}
              />

              <text
                x={section.x}
                y={section.y + 26}
                textAnchor="middle"
                className="text-micro font-semibold uppercase"
                style={{
                  fill: isOpen
                    ? `rgb(${section.accent})`
                    : "rgba(255,255,255,0.45)",
                  letterSpacing: "0.08em",
                  fontSize: 10,
                }}
              >
                {section.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 min-h-[92px]">
        {activeSection ? (
          <div className="text-center">
            <p
              className="mb-1.5 text-micro font-bold uppercase tracking-eyebrow"
              style={{ color: `rgb(${activeSection.accent})` }}
            >
              {activeSection.label}
            </p>
            <p className="text-body leading-6 text-white/78">
              {copyFor(activeSection.id)}
            </p>
          </div>
        ) : (
          <p className="text-center text-body leading-6 text-white/50">
            Tap a star to see what lives there.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <p className="text-meta text-white/35">
          {opened.size} of {SECTIONS.length} explored
        </p>

        {!requireAll || allOpened ? (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-control border border-white/15 bg-white/[0.06] px-5 py-2.5 text-label font-medium text-white/85 transition hover:bg-white/[0.12]"
          >
            {allOpened ? "Take me in" : "Continue"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default JourneyConstellation;
