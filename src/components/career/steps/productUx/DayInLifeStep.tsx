// src/components/career/steps/productUx/DayInLifeStep.tsx
"use client";

import * as React from "react";

import type {
  StepperStep,
  StepperPersistedState,
} from "@/components/career/stepperTypes";

/**
 * Mobile-first “Day in the Life” step (more colorful + conversational)
 * - Keeps persisted keys the same:
 *    - productUx_dayMode
 *    - productUx_daySelfCheck
 */
type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
  setProgress: React.Dispatch<React.SetStateAction<StepperPersistedState>>;
};

type Mode = "student" | "junior" | "mid";

function isMode(v: unknown): v is Mode {
  return v === "student" || v === "junior" || v === "mid";
}

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function DayInLifeStep({ step, progress, setProgress }: Props) {
  // progress IS the map now
  const progressMap = progress as unknown as Record<string, unknown>;

  const initialMode = React.useMemo<Mode>(() => {
    const raw = progressMap["productUx_dayMode"];
    return isMode(raw) ? raw : "junior";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mode, setMode] = React.useState<Mode>(initialMode);

  const selectedSelfCheck = safeString(progressMap["productUx_daySelfCheck"]);

  React.useEffect(() => {
    // Persist mode
    setProgress((p) => ({
      ...(p as unknown as Record<string, unknown>),
      productUx_dayMode: mode,
    })) as unknown as void;
  }, [mode, setProgress]);

  const chipBase =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-95";
  const chipOn =
    "border-sky-300/60 bg-sky-300/12 text-slate-50 shadow-[0_0_0_1px_rgba(56,189,248,0.16)]";
  const chipOff =
    "border-white/10 bg-white/5 text-slate-200/70 hover:bg-white/10";

  const card =
    "relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 px-5 py-4 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-xl";
  const h = "text-sm font-semibold text-slate-50";
  const pClass = "mt-1 text-sm leading-relaxed text-slate-200/85";
  const micro =
    "text-xs font-semibold uppercase tracking-eyebrow text-slate-300/60";

  const day = React.useMemo(() => buildDay(mode), [mode]);

  const coachOneLiner = React.useMemo(() => {
    if (mode === "student")
      return "We’re not chasing perfection — we’re chasing a tiny loop: notice → improve → show → learn.";
    if (mode === "junior")
      return "A junior day is mostly momentum + clarity. You make the work easy to build, easy to understand.";
    return "Mid-level is about outcomes. You turn ambiguity into decisions, then ship improvements on repeat.";
  }, [mode]);

  const modeLabel =
    mode === "student"
      ? "Student / exploring"
      : mode === "junior"
        ? "Junior role"
        : "Mid-level";

  const modeEmoji = mode === "student" ? "🧪" : mode === "junior" ? "🧭" : "🎯";

  return (
    <div className="space-y-4">
      {/* Hero (more pop) */}
      <div className="relative overflow-hidden rounded-card border border-white/10 bg-slate-950/40 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-14 h-60 w-60 rounded-full bg-gradient-to-br from-sky-500/18 via-cyan-400/10 to-indigo-500/10 blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/14 via-orange-400/8 to-rose-500/10 blur-3xl opacity-60" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className={micro}>{step.title ?? "Day in the life"}</div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200/70">
              <span aria-hidden>{modeEmoji}</span>
              {modeLabel}
            </span>
          </div>

          <div className="mt-2 text-xl font-semibold tracking-tight text-slate-50">
            What a Product / UX day can actually feel like
          </div>

          <div className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200/85">
            Not “make pretty screens.” More like: figure out what’s confusing,
            make it clearer, get a reaction, and iterate.
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/85">
            <span className="font-semibold text-slate-50">Coach note:</span>{" "}
            {coachOneLiner}
          </div>

          {/* Mode chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("student")}
              className={`${chipBase} ${mode === "student" ? chipOn : chipOff}`}
            >
              Student / exploring
            </button>
            <button
              type="button"
              onClick={() => setMode("junior")}
              className={`${chipBase} ${mode === "junior" ? chipOn : chipOff}`}
            >
              Junior role
            </button>
            <button
              type="button"
              onClick={() => setMode("mid")}
              className={`${chipBase} ${mode === "mid" ? chipOn : chipOff}`}
            >
              Mid-level
            </button>
          </div>
        </div>
      </div>

      {/* Timeline blocks (mobile-friendly) */}
      <div className={card}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-sky-500/14 via-cyan-400/8 to-indigo-500/8 blur-3xl opacity-60" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className={h}>A simple timeline</div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200/70">
              {day.tag}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {day.blocks.map((b) => (
              <div
                key={b.t}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/60">
                    {b.t}
                  </div>
                  <span className="text-[0.7rem] font-semibold text-slate-300/60">
                    {b.vibe}
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-50">
                  {b.title}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-slate-200/85">
                  {b.desc}
                </div>

                {b.chips?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {b.chips.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs text-slate-200/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What you actually do */}
      <div className={card}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-14 -right-12 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-500/12 via-teal-400/8 to-sky-500/8 blur-3xl opacity-55" />
        </div>

        <div className="relative">
          <div className={h}>What you’re actually doing</div>
          <p className={pClass}>
            Think of this as translating between three worlds:{" "}
            <span className="text-slate-50 font-semibold">people</span>,{" "}
            <span className="text-slate-50 font-semibold">product</span>, and{" "}
            <span className="text-slate-50 font-semibold">engineering</span>.
            The best days end with something clearer than it started.
          </p>

          <div className="mt-4 grid gap-2">
            {day.doing.map((item) => (
              <div
                key={item.k}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-sky-300/80" />
                <div>
                  <div className="text-sm font-semibold text-slate-50">
                    {item.k}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-200/85">
                    {item.v}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The truth (micro-pop) */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-sky-400/20 via-fuchsia-400/10 to-amber-300/10 p-[1px]">
        <div className="rounded-3xl bg-slate-950/55 px-5 py-4 backdrop-blur-2xl">
          <div className={micro}>The honest truth</div>
          <div className="mt-2 text-sm leading-relaxed text-slate-200/90">
            Most days are small decisions, not movie-moment breakthroughs.
            If you like shipping, learning, and improving real things, that’s a
            good sign. If you hate ambiguity or feedback, this lane will feel
            heavy.
          </div>
        </div>
      </div>

      {/* Tiny self-check (now shows selected + persists) */}
      <div className={card}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-14 -left-14 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/12 via-orange-400/8 to-rose-500/8 blur-3xl opacity-55" />
        </div>

        <div className="relative">
          <div className={h}>Quick self-check</div>
          <p className={pClass}>
            Which statement feels most true{" "}
            <span className="text-slate-200/70">(for now)</span>?
          </p>

          <div className="mt-4 space-y-2">
            {day.selfCheck.map((s) => {
              const selected = selectedSelfCheck === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setProgress((p) => ({
                      ...(p as unknown as Record<string, unknown>),
                      productUx_daySelfCheck: selected ? "" : s.id,
                    }))
                  }
                  className={`
                    w-full rounded-2xl border px-4 py-3 text-left text-sm transition active:scale-[0.99]
                    ${
                      selected
                        ? "border-sky-300/55 bg-sky-300/12 text-slate-50 shadow-[0_0_0_1px_rgba(56,189,248,0.14)]"
                        : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    }
                  `}
                  aria-pressed={selected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">{s.text}</div>
                    <span
                      className={`
                        shrink-0 rounded-full border px-2 py-1 text-[0.7rem] font-semibold
                        ${
                          selected
                            ? "border-sky-300/40 bg-sky-300/15 text-sky-50/90"
                            : "border-white/10 bg-slate-950/35 text-slate-100/70"
                        }
                      `}
                      aria-hidden
                    >
                      {selected ? "Selected" : "Tap"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedSelfCheck ? (
            <div className="mt-3 text-xs text-slate-300/65">
              Nice. This helps Everleap tune what it suggests next.
            </div>
          ) : (
            <div className="mt-3 text-xs text-slate-300/65">
              Optional — but useful signal if you’re on the fence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Content helpers (unchanged content)
   ========================= */

function buildDay(mode: "student" | "junior" | "mid") {
  if (mode === "student") {
    return {
      tag: "Exploring / portfolio",
      blocks: [
        {
          t: "Morning",
          vibe: "curious",
          title: "Pick one screen to improve",
          desc: "You choose something real (an app you use), and you try to make one flow less confusing.",
          chips: ["identify friction", "rewrite labels", "simplify steps"],
        },
        {
          t: "Midday",
          vibe: "hands-on",
          title: "Make a tiny prototype",
          desc: "You build a quick mockup (Figma or even paper). The goal is clarity, not perfection.",
          chips: ["wireframes", "prototype link", "one key change"],
        },
        {
          t: "Afternoon",
          vibe: "feedback",
          title: "Show it to 2 people",
          desc: "You ask: “What’s confusing?” “What would you click?” Then you revise once.",
          chips: ["2 user reactions", "iterate", "document what changed"],
        },
        {
          t: "Evening",
          vibe: "confidence",
          title: "Ship an artifact",
          desc: "You post the before/after and what you learned. That’s how portfolios become convincing.",
          chips: ["case study", "1 screenshot", "1 insight"],
        },
      ],
      doing: [
        {
          k: "You’re learning to see patterns",
          v: "What people do vs what they say. Where they hesitate. What they misunderstand.",
        },
        { k: "You’re practicing clarity", v: "Better wording, fewer steps, cleaner choices." },
        { k: "You’re building proof", v: "Artifacts that show you can think and improve things." },
      ],
      selfCheck: [
        { id: "like_fixing", text: "I like fixing confusing things and making them clearer." },
        { id: "like_people", text: "I like understanding people and why they do what they do." },
        { id: "prefer_build", text: "I prefer building and iterating over studying forever." },
      ],
    };
  }

  if (mode === "mid") {
    return {
      tag: "Mid-level",
      blocks: [
        {
          t: "Morning",
          vibe: "ownership",
          title: "Align on outcomes",
          desc: "You define what success means: fewer drop-offs, faster completion, fewer support issues.",
          chips: ["metrics", "scope", "tradeoffs"],
        },
        {
          t: "Midday",
          vibe: "collab",
          title: "Work with engineering",
          desc: "You iterate on a solution that’s actually buildable, accessible, and consistent.",
          chips: ["system thinking", "constraints", "quality"],
        },
        {
          t: "Afternoon",
          vibe: "testing",
          title: "Review real user signal",
          desc: "You watch sessions, review feedback, and decide what to improve next.",
          chips: ["research", "analytics", "prioritize"],
        },
        {
          t: "Late day",
          vibe: "shipping",
          title: "Ship + learn",
          desc: "You launch improvements and track what changed. The loop matters more than the launch.",
          chips: ["release", "measure", "iterate"],
        },
      ],
      doing: [
        { k: "Decision-making", v: "Balancing user needs, business goals, and engineering constraints." },
        { k: "Reducing risk", v: "Testing assumptions early so you don’t build the wrong thing." },
        { k: "Making work visible", v: "Clear rationale, crisp artifacts, fast iteration." },
      ],
      selfCheck: [
        { id: "like_ambiguity", text: "I can handle ambiguity if the goal is clear." },
        { id: "like_feedback", text: "I can take feedback and improve without taking it personally." },
        { id: "like_iterate", text: "I like shipping improvements repeatedly, not one perfect thing." },
      ],
    };
  }

  return {
    tag: "Junior role",
    blocks: [
      {
        t: "Morning",
        vibe: "structured",
        title: "Standup + priorities",
        desc: "You sync with your team and pick one concrete problem to push forward today.",
        chips: ["one focus", "clear next step", "avoid overwhelm"],
      },
      {
        t: "Midday",
        vibe: "craft",
        title: "Design / write / prototype",
        desc: "You work on a flow, draft microcopy, or tweak UI components for clarity.",
        chips: ["Figma", "copy", "interaction"],
      },
      {
        t: "Afternoon",
        vibe: "feedback",
        title: "Review + iterate",
        desc: "You get review comments and revise. You learn fast because your work is visible.",
        chips: ["critique", "iteration", "alignment"],
      },
      {
        t: "Late day",
        vibe: "momentum",
        title: "Hand off + document",
        desc: "You create specs, notes, and examples so engineering can build it without guessing.",
        chips: ["handoff", "edge cases", "accessibility"],
      },
    ],
    doing: [
      { k: "Making things understandable", v: "Helping people know what to do next without thinking too hard." },
      { k: "Learning the system", v: "Design systems, constraints, and how real teams ship." },
      { k: "Building confidence through output", v: "Draft → feedback → improved draft. Repeat." },
    ],
    selfCheck: [
      { id: "enjoy_improve", text: "I enjoy improving a thing more than starting from nothing." },
      { id: "enjoy_feedback", text: "I can handle critique if it helps the work get better." },
      { id: "enjoy_real", text: "I like work that affects real people, not just theory." },
    ],
  };
}
