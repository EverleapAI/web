"use client";

import { useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";

type QuestionType = "onboarding" | "core" | "ancillary";

type StoryQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  hint?: string;
  explanation?: string;
};

const storyQuestions: StoryQuestion[] = [
  // Onboarding
  {
    id: "onboarding-1",
    type: "onboarding",
    prompt: "So, what brought you here today?",
    hint: "It can be one sentence. No pressure.",
  },
  {
    id: "onboarding-2",
    type: "onboarding",
    prompt: "What’s one thing you’re hoping Everleap might make easier?",
    hint: "School, work, choices, people, energy… anything.",
  },
  {
    id: "onboarding-3",
    type: "onboarding",
    prompt:
      "If life felt even a little better 6 months from now, what would be different?",
  },

  // Core persona seeds (examples)
  {
    id: "core-1",
    type: "core",
    prompt:
      "Think about a recent moment when you felt the most like yourself. What was happening?",
    hint: "Doesn’t have to be huge. Just honest.",
  },
  {
    id: "core-2",
    type: "core",
    prompt:
      "What kinds of situations drain your energy way faster than you expect?",
  },
  {
    id: "core-3",
    type: "core",
    prompt:
      "If you could experiment with one new direction in your life, what would you be curious to try?",
  },
];

export default function StoryPage() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const question = storyQuestions[index];

  const goToNext = useCallback(() => {
    setValue("");
    if (index + 1 < storyQuestions.length) {
      setIndex((i) => i + 1);
    } else {
      setComplete(true);
    }
  }, [index]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question || isSubmitting) return;

    const trimmed = value.trim();
    if (!trimmed) {
      // If empty and they hit submit, just ignore for now.
      // They can use "Skip for now" explicitly.
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: send to backend
      // await fetch("/api/story/answer", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ questionId: question.id, answer: trimmed }),
      // });

      goToNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (!question || isSubmitting) return;

    // TODO: optionally record a "skipped" event in backend later
    goToNext();
  };

  const handleMicClick = () => {
    // Placeholder for future voice capture integration.
    // For now we just toggle a visual state.
    setIsRecording((prev) => !prev);

    // TODO: hook up Web Speech API or native app bridge here
    // and append transcribed text into `value`.
  };

  if (complete || !question) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(56,189,248,0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.2), transparent 55%)",
        }}
      >
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-[-10%] h-64 w-64 rounded-full bg-fuchsia-500/40 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-[-20%] h-64 w-64 rounded-full bg-sky-400/30 blur-3xl animate-pulse" />
          </div>

          <div className="relative max-w-md text-center">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Story
            </div>
            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50">
              Thanks for sharing
            </h1>
            <p className="mb-6 text-sm text-slate-300">
              This already gives me a better sense of where you are. We’ll keep
              building your story over time, not all at once.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/main"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Back to Spotlight
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setValue("");
                  setComplete(false);
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800/80"
              >
                Keep answering
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOnboarding = question.type === "onboarding";

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.2), transparent 55%)",
      }}
    >
      <div className="relative flex min-h-screen flex-col px-4 pt-6 pb-8 sm:px-6 md:px-10">
        {/* Animated ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-[-10%] h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl animate-pulse" />
          <div className="absolute top-40 right-[-5%] h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-15%] left-[10%] h-80 w-80 rounded-full bg-amber-300/20 blur-3xl animate-pulse" />
        </div>

        {/* Minimal top bar */}
        <header className="relative mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Story
            </span>
            <span className="mt-1 text-xs text-slate-400">
              One question at a time. You can stop whenever.
            </span>
          </div>
          <Link
            href="/main"
            className="text-[0.7rem] text-slate-300 underline-offset-4 hover:text-slate-100 hover:underline"
          >
            Done for now
          </Link>
        </header>

        {/* Main question area */}
        <main className="relative flex flex-1 flex-col items-center justify-center">
          <div className="relative w-full max-w-2xl">
            {/* Glow behind question area */}
            <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-[-20px] rounded-[32px] bg-gradient-to-br from-fuchsia-500/35 via-orange-400/25 to-cyan-400/25 blur-3xl opacity-80" />

            <div className="relative rounded-[32px] bg-slate-950/60 border border-slate-700/70 px-5 py-6 sm:px-7 sm:py-7 shadow-[0_30px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              {isOnboarding && (
                <p className="mb-3 text-[0.8rem] text-slate-300">
                  To start, I want to understand where you are right now.
                </p>
              )}

              <h1 className="mb-3 text-xl font-semibold leading-snug text-slate-50 sm:text-2xl">
                {question.prompt}
              </h1>

              {question.hint && (
                <p className="mb-4 text-xs text-slate-300">{question.hint}</p>
              )}

              {/* Micro-hint */}
              <p className="mb-3 text-[0.7rem] text-slate-400">
                There’s no right answer here. Just talk to me like you would to
                someone who actually wants to get you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Gradient border wrapper for textarea */}
                <div className="relative rounded-3xl bg-gradient-to-br from-sky-500/60 via-fuchsia-500/60 to-amber-400/60 p-[1px]">
                  <div className="relative rounded-3xl bg-slate-950/80 backdrop-blur-xl">
                    <textarea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Type whatever comes to mind. It doesn’t have to be perfect."
                      className="w-full min-h-[150px] rounded-3xl border border-slate-700/70 bg-transparent px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-sky-300/80"
                    />

                    {/* Mic button */}
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-slate-600 text-slate-100 shadow-lg shadow-slate-950/70 hover:bg-slate-800 active:scale-95 transition"
                      aria-label="Speak your answer"
                    >
                      <Mic
                        className={`h-4 w-4 ${
                          isRecording ? "text-rose-300" : "text-slate-100"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !value.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {index + 1 === storyQuestions.length
                        ? "Finish for now"
                        : "Share this"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSkip}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      I’m not sure · Skip
                    </button>
                  </div>

                  <div className="text-[0.7rem] text-slate-400 text-left sm:text-right">
                    You’re not filling out a test. You’re giving me a clearer
                    picture of you, one answer at a time.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
