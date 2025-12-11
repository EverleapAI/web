// src/app/main/questions/page.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { BottomNav } from "@/components/navigation/BottomNav";

const TOTAL_QUESTIONS = 30;

type Badge = {
  threshold: number;
  title: string;
  message: string;
};

const BADGES: Badge[] = [
  {
    threshold: 5,
    title: "Curious Starter",
    message: "Nice — you’ve already shared enough for a strong first snapshot.",
  },
  {
    threshold: 10,
    title: "Momentum Builder",
    message: "You’re on a roll. Everleap is getting a clearer picture of you.",
  },
  {
    threshold: 15,
    title: "Deep Diver",
    message: "These answers are helping uncover layers most people never see.",
  },
  {
    threshold: 20,
    title: "Story Shaper",
    message: "You’re shaping a powerful map of who you are and what’s possible.",
  },
  {
    threshold: 25,
    title: "Trailblazer",
    message:
      "You’re almost there — this is the kind of effort that changes things.",
  },
  {
    threshold: 30,
    title: "Story Complete (For Now)",
    message:
      "Amazing. You’ve finished this set — Everleap can work with a rich story.",
  },
];

export default function YourStoryQuestionsPage() {
  // In your real app, these probably come from props or context.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-based
  const answeredCount = currentQuestionIndex; // simple assumption for demo

  const [answer, setAnswer] = useState("");
  const [showBadge, setShowBadge] = useState(false);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const progressPercent = useMemo(() => {
    return Math.min(100, (answeredCount / TOTAL_QUESTIONS) * 100);
  }, [answeredCount]);

  // Determine which badge should be active based on answeredCount
  useEffect(() => {
    if (answeredCount === 0) return;

    const badge = BADGES.slice()
      .reverse()
      .find((b) => answeredCount >= b.threshold);

    if (badge && badge.threshold === answeredCount) {
      setActiveBadge(badge);
      setShowBadge(true);

      // Auto-hide after a few seconds (optional)
      const t = setTimeout(() => setShowBadge(false), 5000);
      return () => clearTimeout(t);
    }
  }, [answeredCount]);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    // TODO: send answer to your API
    setAnswer("");

    // Advance to next question (simple demo)
    setCurrentQuestionIndex((prev) => Math.min(TOTAL_QUESTIONS, prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const questionText =
    "If you could experiment with one new direction in your life, what would you be curious to try?";

  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.14), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Page header */}
        <header className="mb-4 md:mb-6">
          {/* Title + AI guide (desktop) */}
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Your story
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Let&apos;s sketch out who you are (for now)
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                Answer a few questions so Everleap can start mapping how you
                think, what matters to you, and where you might go next.
              </p>
            </div>

            {/* AI guide – desktop only */}
            <div className="hidden md:block">
              <AiGuideOrb
                subline="Talk to Everleap about any answer—or ask for ideas if you feel stuck."
                source="your_story_questions_orb"
              />
            </div>
          </div>

          {/* Progress area (sits right under header, above card) */}
          <div className="mt-4 w-full max-w-3xl">
            <div className="flex items-center justify-between text-[0.7rem] text-slate-400">
              <span>Start</span>
              <span>
                Q {Math.min(currentQuestionIndex + 1, TOTAL_QUESTIONS)} of{" "}
                {TOTAL_QUESTIONS} · {answeredCount} answered
              </span>
              <span>Finish</span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              {/* Start dot */}
              <div className="h-3 w-3 rounded-full bg-slate-900 border border-slate-600" />

              {/* Bar */}
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-slate-900/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* End dot */}
              <div className="h-3 w-3 rounded-full border border-sky-400 bg-slate-900 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />
            </div>
          </div>

          {/* AI guide – mobile */}
          <div className="mt-4 md:hidden">
            <AiGuideOrb
              subline="Talk to Everleap about any answer—or ask for ideas if you feel stuck."
              source="your_story_questions_orb"
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex flex-1 flex-col">
          <section className="mt-2 md:mt-0">
            {/* Badge card (shows every 5 answered) */}
            {showBadge && activeBadge && (
              <div className="mb-4 max-w-3xl">
                <div className="rounded-2xl border border-amber-400/40 bg-slate-950/90 px-4 py-3 shadow-lg shadow-amber-400/25 backdrop-blur flex items-start gap-3">
                  <div className="mt-1 h-8 w-8 rounded-full bg-amber-400/90 flex items-center justify-center text-slate-900 text-sm font-bold">
                    ★
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-amber-300">
                      {activeBadge.title} unlocked
                    </div>
                    <p className="text-xs text-slate-200">
                      {activeBadge.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Question card */}
            <div className="max-w-3xl rounded-2xl border border-slate-700/70 bg-slate-950/85 p-5 shadow-xl backdrop-blur md:p-7">
              <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
                {questionText}
              </h2>

              {/* Answer area – styled like Everleap Guide input */}
              <div className="mt-5 rounded-[26px] bg-gradient-to-r from-fuchsia-500 via-sky-400 to-amber-300 p-[2px] shadow-[0_0_32px_rgba(56,189,248,0.25)]">
                <div className="flex items-end gap-3 rounded-[22px] bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/95 px-5 py-4">
                  <textarea
                    className="flex-1 bg-transparent outline-none resize-none text-sm md:text-base text-slate-50 placeholder:text-slate-500 min-h-[140px]"
                    placeholder="Type it here. Press Enter to send, or Shift+Enter for a new line."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex flex-col items-center gap-3 pb-1">
                    {/* Mic button placeholder */}
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full bg-slate-900/90 border border-slate-600/80 flex items-center justify-center text-slate-200 text-sm hover:bg-slate-800/90 transition-colors"
                    >
                      🎙
                    </button>
                    {/* Send button */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="h-10 w-10 rounded-full bg-sky-500 hover:bg-sky-400 transition-colors flex items-center justify-center text-slate-950 text-lg font-semibold shadow-lg shadow-sky-500/50"
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </div>

              {/* Skip button */}
              <div className="mt-4 flex">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border border-slate-700 bg-slate-950/80 text-xs md:text-sm text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  I&apos;m not sure · Skip
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Bottom nav – shared component */}
      <BottomNav />
    </div>
  );
}
