// src/components/main/AiGuideModal.tsx
"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SuggestedGoal = {
  id?: string;
  title: string;
  style?: string;
  description: string;
};

type AiGuideModalProps = {
  onClose: () => void;
  title: string;
  subtitle: string;
  suggestions?: string[];
  suggestedGoals?: SuggestedGoal[];
  initialSelectedId?: string;
  activeGoalId?: string;
  onActivateGoal?: (goal: SuggestedGoal) => void;
};

export function AiGuideModal({
  onClose,
  subtitle,
  suggestions,
  suggestedGoals,
  initialSelectedId,
  activeGoalId,
  onActivateGoal,
}: AiGuideModalProps) {
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [isThinking, setIsThinking] = useState(
    !!suggestedGoals && suggestedGoals.length > 0
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId || suggestedGoals?.[0]?.id
  );

  useEffect(() => {
    if (!suggestedGoals || suggestedGoals.length === 0) {
      setIsThinking(false);
      return;
    }
    setIsThinking(true);
    const t = setTimeout(() => setIsThinking(false), 900);
    return () => clearTimeout(t);
  }, [suggestedGoals]);

  const handleSubmit = (e: FormEvent | KeyboardEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    // Later: send draft, selected goal, and context to backend
    // eslint-disable-next-line no-console
    console.log("AI Guide submit", {
      text: draft,
      selectedGoal,
    });

    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    setListening((prev) => !prev);
  };

  const goals = suggestedGoals ?? [];
  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedId) ?? goals[0],
    [goals, selectedId]
  );

  const handleTryThis = () => {
    if (!selectedGoal) return;
    if (onActivateGoal) {
      onActivateGoal(selectedGoal);
    }

    // Prefill text to keep flow going (still optional)
    setDraft("That sounds good. Help me break this into tiny steps.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >
      {/* Outer gradient frame for glass panel */}
      <div
        className="relative w-full max-w-xl rounded-[2rem] bg-gradient-to-br from-sky-500/60 via-indigo-500/40 to-pink-500/60 p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiny floating glow orbs */}
        <div className="pointer-events-none absolute -top-2 left-10 h-3 w-3 rounded-full bg-sky-400/80 blur-[2px] animate-pulse" />
        <div className="pointer-events-none absolute bottom-0 right-14 h-3 w-3 rounded-full bg-pink-400/80 blur-[2px] animate-ping" />

        {/* Inner glass panel */}
        <div className="relative rounded-[1.95rem] border border-slate-700/70 bg-slate-950/80 px-6 py-7 backdrop-blur-2xl md:px-8 md:py-8">
          {/* Close “X” */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 hover:bg-slate-800/80 hover:text-slate-100"
            aria-label="Close"
          >
            ×
          </button>

          {/* Tiny label */}
          <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Your AI guide
          </p>

          {/* Orb + mic */}
          <div className="mt-2 flex flex-col items-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500 to-pink-500 shadow-[0_0_50px_rgba(56,189,248,0.9)]" />
              <div className="absolute inset-3 rounded-full bg-slate-950/40 shadow-[0_0_26px_rgba(15,23,42,1)]" />
            </div>

            {/* Mic button + listening label */}
            <button
              type="button"
              onClick={toggleListening}
              className={`mt-5 flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all ${
                listening
                  ? "border-rose-400 bg-rose-500/20 text-rose-100 shadow-[0_0_18px_rgba(248,113,113,0.7)] scale-105"
                  : "border-slate-600 bg-slate-900/90 text-slate-100 hover:border-sky-400 hover:text-sky-100"
              }`}
              title="(Coming soon) Talk instead of typing"
            >
              🎤
            </button>
            <p className="mt-1 text-[0.65rem] text-slate-400">
              {listening
                ? "Listening… (mock for now)"
                : "Talk instead of typing (coming soon)"}
            </p>
          </div>

          {/* Friendly one-line intro */}
          <p className="mt-6 text-center text-base leading-relaxed text-slate-100 md:text-lg">
            {subtitle}
          </p>

          {/* Thinking indicator */}
          {isThinking && (
            <div className="mt-3 flex justify-center">
              <div className="flex items-center gap-2 text-[0.75rem] text-slate-300">
                <span className="inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                <span className="inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.12s]" />
                <span className="inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.24s]" />
                <span className="text-slate-400">
                  Thinking about goals for you…
                </span>
              </div>
            </div>
          )}

          {/* Suggested goal(s) */}
          {goals.length > 0 && (
            <div className="mt-6 space-y-3">
              {/* Primary selected card */}
              {selectedGoal && (
                <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.9)]">
                  <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Here’s a goal idea to start with
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">
                        {selectedGoal.title}
                        {selectedGoal.style && (
                          <span className="ml-2 text-[0.7rem] font-semibold uppercase tracking-wide text-sky-300">
                            • {selectedGoal.style}
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {selectedGoal.description}
                      </p>
                    </div>
                    {activeGoalId && selectedGoal.id === activeGoalId && (
                      <span className="mt-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-300">
                        Active
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTryThis}
                    className="mt-3 inline-flex items-center justify-center rounded-full bg-sky-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.5)] hover:bg-sky-300 active:scale-95 transition"
                  >
                    Try this goal
                  </button>
                </div>
              )}

              {/* Swipable alternatives */}
              {goals.length > 1 && (
                <div className="no-scrollbar flex gap-3 overflow-x-auto px-1 pt-1">
                  {goals.map((goal) => (
                    <button
                      key={goal.id ?? goal.title}
                      type="button"
                      onClick={() => setSelectedId(goal.id)}
                      className={`min-w-[190px] rounded-2xl border px-3 py-2 text-left text-[0.72rem] transition ${
                        goal.id === selectedGoal?.id
                          ? "border-sky-400 bg-sky-500/10 text-sky-100"
                          : "border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-semibold">{goal.title}</p>
                      {goal.style && (
                        <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">
                          {goal.style}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Optional text suggestions for the input */}
          {suggestions && suggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraft(s)}
                  className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[0.7rem] text-slate-200 hover:border-sky-400 hover:text-sky-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Single input – type + Enter */}
          <form onSubmit={handleSubmit} className="mt-8 flex justify-center">
            <input
              autoFocus
              className="w-full max-w-md border-b border-slate-600 bg-transparent pb-2 text-sm text-slate-100 outline-none placeholder-slate-500 focus:border-sky-400"
              placeholder="Say one thing that’s on your mind…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
