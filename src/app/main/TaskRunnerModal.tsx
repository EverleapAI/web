// src/app/main/TaskRunnerModal.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Check } from "lucide-react";

/* =============================================================================
   Storage keys (must match main/page.tsx exactly)
   ============================================================================= */

const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

/* =============================================================================
   Types (structurally compatible with main/page.tsx)
   ============================================================================= */

type Situation = "high_school" | "young_adult" | null;
type Certainty = "strong" | "kinda" | "no_clue" | null;

type PostPlanKey =
  | "job"
  | "associates"
  | "credential"
  | "military"
  | "four_year"
  | "no_idea";

type ActivityKey =
  | "sports"
  | "visual_arts"
  | "performing_arts"
  | "volunteer"
  | "job"
  | "other";

type FunChoice = "dog" | "cat" | "bearded_dragon" | "rock" | null;

export type OnboardingSnapshot = {
  name?: string;
  situation?: Situation;
  zip?: string; // normalized zip or ""
  certainty?: Certainty;
  postPlans?: PostPlanKey[];
  activities?: ActivityKey[];
  activitiesOther?: string;
  funChoice?: FunChoice;
};

export type TinyTaskId = "weekly_focus" | "curiosity_sprint";

export type WeeklyFocusState = {
  createdAt: string; // ISO
  vibe: string;
  target: string;
  sentence?: string;
};

export type CuriositySprintState = {
  createdAt: string; // ISO
  lane: "jobs" | "majors" | "skills" | "experiments";
  prompt: string;
  takeaway: string;
};

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

/* =============================================================================
   Safe storage helpers
   ============================================================================= */

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function readWeeklyFocus(): WeeklyFocusState | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<WeeklyFocusState>(window.localStorage.getItem(WEEKLY_FOCUS_KEY));
}

function writeWeeklyFocus(next: WeeklyFocusState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WEEKLY_FOCUS_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

function readSprints(): CuriositySprintState[] {
  if (typeof window === "undefined") return [];
  const parsed = safeJsonParse<CuriositySprintState[]>(
    window.localStorage.getItem(CURIOSITY_SPRINTS_KEY)
  );
  return Array.isArray(parsed) ? parsed : [];
}

function writeSprints(next: CuriositySprintState[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURIOSITY_SPRINTS_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };
  const parsed = safeJsonParse<SessionTinyState>(
    window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY)
  );
  if (!parsed) return { shownIds: [], completedIds: [] };

  const shownIds = Array.isArray(parsed.shownIds)
    ? (parsed.shownIds.filter(
        (v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint"
      ) as TinyTaskId[])
    : [];

  const completedIds = Array.isArray(parsed.completedIds)
    ? (parsed.completedIds.filter(
        (v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint"
      ) as TinyTaskId[])
    : [];

  return { shownIds, completedIds };
}

function writeSessionTinyState(next: SessionTinyState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TINY_TASKS_SESSION_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

/* =============================================================================
   Tiny tasks content helpers
   ============================================================================= */

function buildSprintPromptsFromOnboarding(snapshot: OnboardingSnapshot | null): string[] {
  const plans = snapshot?.postPlans ?? [];
  const activities = snapshot?.activities ?? [];

  const leansWork = plans.includes("job") || activities.includes("job");
  const leansCollege = plans.includes("four_year") || plans.includes("associates");
  const leansTrade = plans.includes("credential");
  const leansMilitary = plans.includes("military");

  if (leansWork) {
    return [
      "Find 1 thing about being a Product Manager that seems genuinely fun.",
      "Find 1 job title that surprised you — and write down why.",
      "Find 1 skill that shows up in a lot of jobs you’d actually want.",
    ];
  }
  if (leansTrade) {
    return [
      "Find 1 trade skill you didn’t realize was a real career.",
      "Find 1 local program that teaches a hands-on skill — just note the name.",
      "Find 1 tool or technique in a trade that looks satisfying to learn.",
    ];
  }
  if (leansMilitary) {
    return [
      "Find 1 role that’s not what people assume — and note what it actually does.",
      "Find 1 benefit that matters to you personally (and why).",
      "Find 1 story from someone who joined — and what you notice about it.",
    ];
  }
  if (leansCollege) {
    return [
      "Find 1 major that connects to something you already like doing.",
      "Find 1 class you’d actually enjoy taking — and why.",
      "Find 1 campus club or program that feels like “your people.”",
    ];
  }

  return [
    "Find 1 job you didn’t know existed — and why it’s interesting.",
    "Find 1 skill you’d be proud to have in 6 months.",
    "Find 1 path that feels “possible” — not perfect — and why.",
  ];
}

function laneHelper(lane: CuriositySprintState["lane"]) {
  switch (lane) {
    case "jobs":
      return "What people actually do all day.";
    case "majors":
      return "What you’d spend time learning.";
    case "skills":
      return "Things you could get good at.";
    case "experiments":
      return "Low-risk ways to try things.";
  }
}

/* =============================================================================
   Small UI atoms
   ============================================================================= */

function StepDots({
  step,
  total,
  showLabel = true,
}: {
  step: number;
  total: number;
  showLabel?: boolean;
}) {
  const filled = Math.max(1, Math.min(total, step + 1));
  return (
    <div className="flex items-center gap-3">
      {showLabel ? (
        <div className="text-[11px] font-semibold text-white/40">
          Step {filled} of {total}
        </div>
      ) : null}
      <div className="flex items-center gap-2" aria-label={`Step ${filled} of ${total}`}>
        {Array.from({ length: total }).map((_, i) => {
          const on = i < filled;
          return (
            <span
              key={i}
              className={`h-[6px] w-[14px] rounded-full transition ${
                on ? "bg-white/70" : "bg-white/18"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ChoiceChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = value === o;
        return (
          <motion.button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            whileTap={{ scale: 0.99 }}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              selected
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
            }`}
            aria-pressed={selected}
          >
            {selected ? <Check className="h-4 w-4 text-white/80" /> : null}
            <span>{o}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function MinimalLineInput({
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}) {
  return (
    <div className="mt-5 border-b border-white/18 transition focus-within:border-white/40">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter?.();
          }
        }}
        rows={2}
        placeholder={placeholder ?? ""}
        className="w-full resize-none bg-transparent py-3 text-[16px] leading-7 text-white/90 placeholder:text-white/30 outline-none"
      />
    </div>
  );
}

/* =============================================================================
   Modal
   ============================================================================= */

export function TaskRunnerModal({
  open,
  onClose,
  taskId,
  snapshot,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  taskId: TinyTaskId | null;
  snapshot: OnboardingSnapshot | null;
  dark: boolean;
}) {
  const [step, setStep] = React.useState(0);

  // Weekly focus state
  const [vibe, setVibe] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [sentence, setSentence] = React.useState("");

  // Sprint state
  const [lane, setLane] = React.useState<CuriositySprintState["lane"]>("jobs");
  const [prompt, setPrompt] = React.useState("");
  const [takeaway, setTakeaway] = React.useState("");

  const prompts = React.useMemo(() => buildSprintPromptsFromOnboarding(snapshot), [snapshot]);

  React.useEffect(() => {
    if (!open) return;

    setStep(0);

    const existingFocus = readWeeklyFocus();
    if (existingFocus) {
      setVibe(existingFocus.vibe ?? "");
      setTarget(existingFocus.target ?? "");
      setSentence(existingFocus.sentence ?? "");
    } else {
      setVibe("");
      setTarget("");
      // keep sentence empty for a “fresh” feel each open
      setSentence("");
    }

    setLane("jobs");
    setPrompt(prompts[0] ?? "");
    setTakeaway("");
  }, [open, taskId, prompts]);

  const surface = dark ? "border-white/12 bg-black/40" : "border-slate-900/10 bg-white/55";
  const overlay = dark ? "bg-black/60" : "bg-black/40";

  const primaryBtn =
    "inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99]";

  const primaryBtnClass = dark
    ? `${primaryBtn} border-white/12 bg-white/10 hover:bg-white/14 text-white`
    : `${primaryBtn} border-slate-900/10 bg-white/75 hover:bg-white text-slate-900`;

  const subtleBtnClass = dark
    ? "text-white/65 hover:text-white/90"
    : "text-slate-700 hover:text-slate-950";

  const labelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/70"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-700/60";

  const close = () => onClose();

  function completeWeeklyFocus() {
    const next: WeeklyFocusState = {
      createdAt: new Date().toISOString(),
      vibe: vibe.trim(),
      target: target.trim(),
      sentence: sentence.trim() ? sentence.trim() : undefined,
    };
    writeWeeklyFocus(next);

    const s = readSessionTinyState();
    const completedIds: TinyTaskId[] = Array.from(
      new Set<TinyTaskId>([...(s.completedIds ?? []), "weekly_focus"])
    );
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(3);
  }

  function completeSprint() {
    const t = takeaway.trim();
    if (!t) return;

    const nextItem: CuriositySprintState = {
      createdAt: new Date().toISOString(),
      lane,
      prompt: prompt.trim() || (prompts[0] ?? ""),
      takeaway: t,
    };

    const prev = readSprints();
    writeSprints([nextItem, ...prev].slice(0, 40));

    const s = readSessionTinyState();
    const completedIds: TinyTaskId[] = Array.from(
      new Set<TinyTaskId>([...(s.completedIds ?? []), "curiosity_sprint"])
    );
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(4);
  }

  function renderWeeklyFocus() {
    const total = 4;

    const vibeOptions = [
      "Calm",
      "Confident",
      "Curious",
      "Productive",
      "Social",
      "Strong",
      "Creative",
      "Reset",
    ];
    const targetOptions = ["School", "Friends", "Health", "Money", "Future", "Confidence", "Time"];

    const canNext =
      (step === 0 && vibe.trim().length > 0) ||
      (step === 1 && target.trim().length > 0) ||
      step === 2;

    const nextLabel = step === 2 ? "Save focus" : "Next";

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className={labelClass}>Tiny task · Focus</div>
          <StepDots step={step} total={total} />
        </div>

        {step === 0 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">
              How do you want this week to feel?
            </h2>
            <p className="mt-2 text-sm text-white/70">Pick a vibe.</p>
            <p className="mt-2 text-xs text-white/45">I’ll shape your suggestions around it.</p>
            <ChoiceChips options={vibeOptions} value={vibe} onChange={(v) => setVibe(v)} />
          </>
        ) : step === 1 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Where do you want that energy aimed?
            </h2>
            <p className="mt-2 text-sm text-white/70">Pick one target.</p>
            <p className="mt-2 text-xs text-white/45">This helps me keep it practical.</p>
            <ChoiceChips options={targetOptions} value={target} onChange={(v) => setTarget(v)} />
          </>
        ) : step === 2 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">One sentence (optional)</h2>
            <p className="mt-2 text-sm text-white/70">Keep it simple.</p>
            <MinimalLineInput
              value={sentence}
              onChange={setSentence}
              placeholder="This week I want…"
              onEnter={() => completeWeeklyFocus()}
            />
            <div className="mt-4 text-xs text-white/50">
              Saved locally for now (Actions hookup comes later).
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Locked.</h2>
            <p className="mt-2 text-sm text-white/75">
              Picks can lean toward{" "}
              <span className="font-semibold text-white">{vibe}</span> +
              <span className="font-semibold text-white"> {target}</span>.
            </p>
            {sentence.trim() ? (
              <p className="mt-3 text-sm text-white/70">“{sentence.trim()}”</p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={close} className={primaryBtnClass}>
                Done
              </button>
              <button
                type="button"
                onClick={close}
                className={`text-sm font-semibold ${subtleBtnClass}`}
              >
                Back
              </button>
            </div>
          </>
        )}

        {step < 3 ? (
          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              onClick={close}
              className={`text-xs font-semibold ${subtleBtnClass} opacity-70 hover:opacity-100`}
            >
              Not now
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  completeWeeklyFocus();
                  return;
                }
                if (!canNext) return;
                setStep((s) => Math.min(2, s + 1));
              }}
              disabled={!canNext}
              className={`${primaryBtnClass} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {nextLabel} <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderCuriositySprint() {
    const total = 5;

    const laneOptions: { id: CuriositySprintState["lane"]; label: string; emoji: string }[] = [
      { id: "jobs", label: "Jobs", emoji: "🔎" },
      { id: "majors", label: "Majors", emoji: "🎓" },
      { id: "skills", label: "Skills", emoji: "🛠️" },
      { id: "experiments", label: "Experiments", emoji: "🧪" },
    ];

    const suggested = prompts.slice(0, 3);

    const canNext =
      (step === 0 && Boolean(lane)) ||
      (step === 1 && Boolean((prompt ?? "").trim())) ||
      step === 2 ||
      (step === 3 && takeaway.trim().length > 0);

    const nextLabel =
      step === 3 ? "Save takeaway" : step === 2 ? "I did it" : step === 1 ? "Do it" : "See a prompt";

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className={labelClass}>Tiny task · Curiosity sprint</div>
          <StepDots step={step} total={total} />
        </div>

        {step === 0 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">
              What do you want to explore for 10 minutes?
            </h2>
            <p className="mt-2 text-sm text-white/70">Pick one. No commitment.</p>
            <p className="mt-2 text-xs text-white/45">You’re just opening a door.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {laneOptions.map((o) => {
                const selected = lane === o.id;
                return (
                  <motion.button
                    key={o.id}
                    type="button"
                    onClick={() => setLane(o.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                      selected
                        ? "border-white/30 bg-white/12 text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
                    }`}
                    aria-pressed={selected}
                  >
                    {selected ? <Check className="h-4 w-4 text-white/80" /> : null}
                    <span>{o.label}</span>
                    {selected ? <span className="opacity-80">{o.emoji}</span> : null}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {lane ? (
                <motion.div
                  key={lane}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mt-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                    What this opens
                  </div>
                  <div className="mt-2 text-sm text-white/85">{laneHelper(lane)}</div>
                  <div className="mt-2 text-xs text-white/45">
                    Not choosing a path — just gathering signal.
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Pick a prompt.</h2>
            <p className="mt-2 text-sm text-white/70">You can edit it.</p>

            <div className="mt-4 space-y-2">
              {suggested.map((p) => {
                const selected = prompt === p;
                return (
                  <motion.button
                    key={p}
                    type="button"
                    onClick={() => setPrompt(p)}
                    whileTap={{ scale: 0.995 }}
                    className={`w-full text-left text-sm transition ${
                      selected ? "text-white" : "text-white/75 hover:text-white/90"
                    }`}
                  >
                    <span className="underline decoration-white/20 underline-offset-4">{p}</span>
                  </motion.button>
                );
              })}
            </div>

            <MinimalLineInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Or write your own prompt…"
              onEnter={() => setStep(2)}
            />
          </>
        ) : step === 2 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Do it.</h2>
            <p className="mt-2 text-sm text-white/70">
              Set a 10-minute timer. Come back and save one thing you noticed.
            </p>

            <div className="mt-4 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Your prompt
              </div>
              <div className="mt-2">{prompt.trim() || suggested[0] || "Find one interesting thing."}</div>
            </div>

            <div className="mt-4 text-xs text-white/50">(No in-app timer yet — just the behavior.)</div>
          </>
        ) : step === 3 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">One takeaway.</h2>
            <p className="mt-2 text-sm text-white/70">A sentence is enough.</p>

            <MinimalLineInput
              value={takeaway}
              onChange={setTakeaway}
              placeholder="I noticed that…"
              onEnter={() => completeSprint()}
            />
            <div className="mt-4 text-xs text-white/55">Saved so Everleap can build on it later.</div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Nice.</h2>
            <p className="mt-2 text-sm text-white/75">That’s a real signal.</p>

            <div className="mt-4 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Saved takeaway
              </div>
              <div className="mt-2">{takeaway.trim()}</div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={close} className={primaryBtnClass}>
                Done
              </button>
              <button
                type="button"
                onClick={close}
                className={`text-sm font-semibold ${subtleBtnClass}`}
              >
                Back
              </button>
            </div>
          </>
        )}

        {step < 4 ? (
          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              onClick={close}
              className={`text-xs font-semibold ${subtleBtnClass} opacity-70 hover:opacity-100`}
            >
              Not now
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === 3) {
                  completeSprint();
                  return;
                }
                if (!canNext) return;
                setStep((s) => Math.min(3, s + 1));
              }}
              disabled={!canNext}
              className={`${primaryBtnClass} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {nextLabel} <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && taskId ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className={`absolute inset-0 ${overlay}`} onClick={close} aria-hidden="true" />

          <motion.div
            initial={{ y: 22, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative w-full max-w-xl overflow-hidden rounded-[28px] border ${surface} backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.75)]`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(1200px 500px at 12% 0%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 400px at 90% 10%, rgba(255,255,255,0.06), transparent 55%)",
              }}
            />

            <div className="relative flex items-center justify-between px-5 py-4">
              <div className="text-sm font-semibold text-white/90">Everleap</div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white/90"
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative px-5 pb-6">
              {taskId === "weekly_focus" ? renderWeeklyFocus() : renderCuriositySprint()}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}