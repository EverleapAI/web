"use client";

import { CardBody } from "@/lib/ui/card";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import {
  useMicroTaskBatch,
  type MicroTaskBatchItem,
} from "@/lib/microTasks/useMicroTaskBatch";
// The accent cycle and glyph the Explore specialty cards use. Shared on purpose
// — an answer here should look like it comes from the same product as those.
import {
  MiniConstellation,
  SPECIALTY_ACCENTS,
} from "../../explore/_components/exploreUi";

type Props = {
  dark: boolean;
  tasks: MicroTaskBatchItem[];
  /** Insights reuses this card verbatim and only ever relabels the eyebrow. */
  eyebrow?: string;
  /**
   * Fired once when the last question in the batch is answered. The arrival
   * interstitial uses it to close itself; the card on a page ignores it and
   * just shows its closing line.
   */
  onAllAnswered?: () => void;
  /**
   * Overrides the header accent as "r, g, b". The arrival interstitial colours
   * itself by where the user just came from, so the orbit and eyebrow match the
   * section they've walked in from.
   */
  accent?: string;
  /**
   * Shows how far through the three questions you are, as a little run of
   * stars. On the page the card was ambient and needed no progress; in the
   * interstitial it's the whole screen, and three questions with no sense of
   * how many are left reads as an unbounded interrogation.
   */
  showProgress?: boolean;
  /**
   * Agentic opener, shown once under the header — a sentence spoken to the user
   * about what they were just doing, before the first question. The card on a
   * page doesn't use it; the interstitial always does, because arriving with a
   * bare question reads as a form rather than someone talking to you.
   */
  intro?: string;
};

/**
 * The 3-beat rhythm as a small constellation, not a row of dots.
 *
 * The app already says "depth is a constellation you light up" everywhere else
 * — the specialty worlds, the descents. Three questions is the smallest version
 * of that idea, so it should look like it belongs to the same sky. Stars light
 * as you pass them and the line between them fills in behind you.
 */
function ProgressConstellation({
  accent,
  index,
  total,
}: {
  accent: string;
  index: number;
  total: number;
}) {
  // Fixed, slightly irregular positions — a straight line reads as a progress
  // bar, and this is meant to read as a sky.
  const POINTS = [
    { x: 6, y: 15 },
    { x: 24, y: 6 },
    { x: 42, y: 17 },
    { x: 60, y: 8 },
    { x: 78, y: 16 },
  ];
  const points = POINTS.slice(0, Math.max(2, Math.min(total, POINTS.length)));

  return (
    <svg
      viewBox="0 0 84 24"
      className="h-6 w-[84px]"
      role="img"
      aria-label={`Question ${index + 1} of ${total}`}
    >
      {points.slice(0, -1).map((point, i) => {
        const next = points[i + 1];
        const passed = i < index;
        return (
          <line
            key={`edge-${i}`}
            x1={point.x}
            y1={point.y}
            x2={next.x}
            y2={next.y}
            stroke={passed ? `rgba(${accent},0.55)` : "rgba(255,255,255,0.12)"}
            strokeWidth="1"
            className="transition-all duration-500"
          />
        );
      })}
      {points.map((point, i) => {
        const done = i < index;
        const now = i === index;
        return (
          <circle
            key={`star-${i}`}
            cx={point.x}
            cy={point.y}
            r={now ? 3.4 : done ? 2.4 : 1.8}
            fill={
              now
                ? `rgb(${accent})`
                : done
                  ? `rgba(${accent},0.6)`
                  : "rgba(255,255,255,0.18)"
            }
            className="transition-all duration-500"
            style={
              now ? { filter: `drop-shadow(0 0 5px rgb(${accent}))` } : undefined
            }
          />
        );
      })}
    </svg>
  );
}

// One spot of color per theme: the app's "learn you" purple on dark, teal on
// light. Drives the orbit anchor, the eyebrow, the option ticks, and selection.
function accentRgb(dark: boolean) {
  return dark ? "182,160,255" : "13,148,136";
}

function backButtonClass(dark: boolean) {
  return [
    "mb-2 flex items-center gap-1 text-meta font-medium",
    dark
      ? "text-white/30 hover:text-white/50"
      : "text-slate-500 hover:text-slate-700",
  ].join(" ");
}

// Soft-raised pills that lift on hover — depth instead of a flat plane. Accent
// values are hard-coded per theme so the hover/selected states can live in
// classes (inline styles can't carry a hover rule).
function optionClass(dark: boolean, selected: boolean) {
  const base =
    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-label font-medium leading-5 transition-all duration-200 border hover:-translate-y-[2px] focus-visible:outline-none";
  if (dark) {
    return [
      base,
      selected
        ? "border-[rgba(182,160,255,0.55)] bg-[rgba(182,160,255,0.14)] text-white ring-1 ring-[rgba(182,160,255,0.3)] shadow-[0_8px_26px_rgba(182,160,255,0.16)]"
        : "border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] text-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.22)] hover:border-[rgba(182,160,255,0.4)] hover:bg-[linear-gradient(180deg,rgba(182,160,255,0.10),rgba(255,255,255,0.02))]",
      "focus-visible:ring-2 focus-visible:ring-[rgba(182,160,255,0.25)]",
    ].join(" ");
  }
  return [
    base,
    selected
      ? "border-emerald-500 bg-slate-200 text-slate-950 ring-1 ring-emerald-500/25 shadow-[0_8px_24px_rgba(13,148,136,0.15)]"
      : "border-black/8 bg-white text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.06)] hover:border-emerald-500/30 hover:bg-emerald-50/60",
    "focus-visible:ring-2 focus-visible:ring-emerald-500/20",
  ].join(" ");
}

// The little accent tick on the left of each option — dim at rest, lights up on
// hover, fully lit when chosen.
function tickClass(dark: boolean, selected: boolean) {
  if (dark) {
    return selected
      ? "bg-[rgb(182,160,255)] shadow-[0_0_10px_rgba(182,160,255,0.7)]"
      : "bg-[rgba(182,160,255,0.28)] group-hover:bg-[rgb(182,160,255)] group-hover:shadow-[0_0_10px_rgba(182,160,255,0.7)]";
  }
  return selected
    ? "bg-[rgb(13,148,136)] shadow-[0_0_10px_rgba(13,148,136,0.5)]"
    : "bg-[rgba(13,148,136,0.3)] group-hover:bg-[rgb(13,148,136)] group-hover:shadow-[0_0_8px_rgba(13,148,136,0.5)]";
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return "text-slate-900";
  return selected ? "text-white/88" : "text-white/56";
}

// When the card is given an accent, the options follow it too. Hover and
// selected states can't be expressed as inline styles, and the design system
// bans arbitrary Tailwind values — so the accent travels as a CSS variable and
// the states are declared once, here.
// Mirrors accentCard() from exploreUi, which is what the specialty world cards
// use — same radial bloom, same inset hairline, same lift on hover.
const ACCENT_OPTION_CSS = `
.el-accent-opt {
  border-color: rgba(var(--el-accent), 0.24);
  background:
    radial-gradient(220px 130px at 92% -10%, rgba(var(--el-accent),0.16), transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)),
    rgba(9,13,24,0.72);
  box-shadow: inset 0 0 0 1px rgba(var(--el-accent),0.06), 0 10px 26px rgba(0,0,0,0.34);
}
.el-accent-opt:hover {
  border-color: rgba(var(--el-accent), 0.46);
  background:
    radial-gradient(240px 150px at 92% -10%, rgba(var(--el-accent),0.26), transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0)),
    rgba(9,13,24,0.72);
  box-shadow: inset 0 0 0 1px rgba(var(--el-accent),0.10), 0 16px 34px rgba(0,0,0,0.40);
}
.el-accent-opt[aria-pressed="true"] {
  border-color: rgba(var(--el-accent), 0.60);
  background:
    radial-gradient(240px 150px at 92% -10%, rgba(var(--el-accent),0.30), transparent 70%),
    rgba(var(--el-accent), 0.12);
  box-shadow: inset 0 0 0 1px rgba(var(--el-accent),0.34), 0 14px 32px rgba(var(--el-accent),0.16);
}
.el-accent-opt:focus-visible {
  box-shadow: 0 0 0 2px rgba(var(--el-accent), 0.35);
}
`;

export function TodayTinyTaskCard({
  dark,
  tasks,
  eyebrow = "Something I’m wondering",
  onAllAnswered,
  accent: accentOverride,
  showProgress = false,
  intro,
}: Props) {
  const { current, allAnswered, canGoBack, answer, goBack, selectedIndexFor } =
    useMicroTaskBatch(tasks);

  const accent = accentOverride ?? accentRgb(dark);

  // Announce completion once per batch. Keyed on the batch so answering the
  // last question of a NEW batch fires again, but a re-render does not.
  const announcedFor = React.useRef<string | null>(null);
  const batchKey = tasks.map((task) => task.id).join(",");

  React.useEffect(() => {
    if (!allAnswered) return;
    if (announcedFor.current === batchKey) return;
    announcedFor.current = batchKey;
    onAllAnswered?.();
  }, [allAnswered, batchKey, onAllAnswered]);

  return (
    <div
      className="space-y-3"
      style={
        accentOverride
          ? ({ "--el-accent": accentOverride } as React.CSSProperties)
          : undefined
      }
    >
      {accentOverride ? <style>{ACCENT_OPTION_CSS}</style> : null}
      {/* Header: a tiny orbiting star as the "wondering" anchor + an accent
          eyebrow. The creative anchor that keeps the card from reading flat. */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-[30px] w-[30px] shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid rgba(${accent},0.35)` }}
          />
          <div
            className="absolute inset-[6px] rounded-full"
            style={{ border: `1px solid rgba(${accent},0.18)` }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `rgb(${accent})`,
              boxShadow: `0 0 10px rgba(${accent},0.9)`,
            }}
          />
          <div
            className="absolute left-1/2 top-[-1px] -ml-[1.75px] h-[3.5px] w-[3.5px] rounded-full [transform-origin:1.75px_16px] motion-safe:animate-[spin_7s_linear_infinite]"
            style={{ background: "#dfe0ff" }}
          />
        </div>
        <span
          className="text-micro font-bold uppercase tracking-eyebrow"
          style={{ color: `rgb(${accent})` }}
        >
          {eyebrow}
        </span>

        {showProgress && current ? (
          <div className="ml-auto">
            <ProgressConstellation
              accent={accent}
              index={Math.max(
                0,
                tasks.findIndex((task) => task.id === current.id)
              )}
              total={tasks.length}
            />
          </div>
        ) : null}
      </div>

      {/* The entry takes the SAME treatment as the question below it — the card
          BODY style, not a dimmer secondary one. It's the agent talking, and
          the question is the agent talking; rendering them at two different
          weights made one look like a caption for the other. */}
      {intro ? (
        <CardBody
          as="p"
          className="mb-6 w-full"
          style={dark ? undefined : { color: "#1e293b" }}
        >
          {intro}
        </CardBody>
      ) : null}

      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {canGoBack ? (
              <button
                type="button"
                onClick={goBack}
                className={backButtonClass(dark)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : null}

            {/* On Today every card leads with prose, not a bold heading — the
                "Where you are" card sets the pattern (eyebrow → body), and it is
                the one that reads right. So the question takes the card BODY
                treatment (17px, regular, bright), the same as the read, rather
                than a bold title one rung under the agent. */}
            <CardBody
              as="div"
              className="mb-4 w-full"
              style={dark ? undefined : { color: "#1e293b" }}
            >
              {current.question}
            </CardBody>

            <div className="space-y-2.5">
              {current.options.map((label, index) => {
                const selected = selectedIndexFor(current) === index;

                // In the interstitial each answer is its own small world, the
                // way the Explore specialty cards are: its own accent, its own
                // constellation glyph, its own halo. An answer is a choice
                // about you, and a row of identical grey pills says otherwise.
                if (accentOverride) {
                  const optAccent =
                    SPECIALTY_ACCENTS[index % SPECIALTY_ACCENTS.length];
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => answer(index)}
                      aria-pressed={selected}
                      style={
                        { "--el-accent": optAccent } as React.CSSProperties
                      }
                      className="el-accent-opt group flex w-full items-center gap-3.5 rounded-card border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-[2px] focus-visible:outline-none"
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-control border p-1.5 transition-all duration-200"
                        style={{
                          borderColor: `rgba(${optAccent},0.28)`,
                          background: `rgba(${optAccent},0.10)`,
                        }}
                      >
                        <MiniConstellation a={optAccent} />
                      </span>

                      <span
                        className={`text-label font-medium leading-5 ${
                          selected ? "text-white/90" : "text-white/70"
                        }`}
                      >
                        {label}
                      </span>

                      {selected ? (
                        <span
                          className="ml-auto shrink-0 text-micro font-semibold uppercase tracking-eyebrow"
                          style={{ color: `rgba(${optAccent},0.9)` }}
                        >
                          Helps
                        </span>
                      ) : null}
                    </button>
                  );
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => answer(index)}
                    className={optionClass(dark, selected)}
                    aria-pressed={selected}
                  >
                    <span
                      className={`h-5 w-[3px] shrink-0 rounded-full transition-all duration-200 ${tickClass(dark, selected)}`}
                    />
                    <span className={labelClass(dark, selected)}>{label}</span>

                    {selected ? (
                      <span
                        className={
                          dark
                            ? "ml-auto shrink-0 text-micro font-semibold uppercase tracking-eyebrow text-[rgba(182,160,255,0.85)]"
                            : "ml-auto shrink-0 text-micro font-semibold uppercase tracking-eyebrow text-emerald-700/80"
                        }
                      >
                        Helps
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="closing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={
              dark
                ? "text-meta leading-5 text-white/32"
                : "text-meta leading-5 text-slate-500"
            }
          >
            {allAnswered ? "That's all for now." : ""}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
