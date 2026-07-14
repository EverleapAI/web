"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type StoryQuestion = {
  id: string;
  family?: string | null;
  question_text?: string | null;
  text?: string | null;
  question?: string | null;
  prompt?: string | null;
  label?: string | null;
  input_type?: string | null;
  answer_type_raw?: string | null;
  options?: string[];
};

type StoryCategoryProgress = {
  key: string;
  label: string;
  answered: number;
  total: number;
  percent: number;
  isCurrent: boolean;
};

type StoryNextResponse = {
  ok: boolean;
  done: boolean;
  categories?: StoryCategoryProgress[];
  progress: {
    answered: number;
    total: number;
    current: number;
    category: string | null;
    categoryLabel: string;
    categoryAnswered: number;
    categoryTotal: number;
    categoryCurrent: number;
  };
  question: StoryQuestion | null;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

function sanitizeReturnTo(value: string | null): string {
  if (!value) return "/main";
  if (!value.startsWith("/")) return "/main";
  if (value.startsWith("//")) return "/main";
  return value;
}

function getQuestionText(question: StoryQuestion): string {
  return (
    question.question_text ??
    question.text ??
    question.question ??
    question.prompt ??
    question.label ??
    ""
  );
}

function parseQuestion(question: StoryQuestion): {
  title: string;
  helper: string | null;
  choices: string[];
} {
  const raw = getQuestionText(question);
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    return {
      title: lines[0],
      helper: lines[1] ?? null,
      choices: lines.slice(2),
    };
  }

  return {
    title: raw,
    helper: null,
    choices: [],
  };
}

function StoryProgressLine({
  categories,
}: {
  categories?: StoryCategoryProgress[];
}) {
  const safeCategories = categories ?? [];
  if (safeCategories.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold tracking-[-0.01em] sm:text-[12px]">
        {safeCategories.map((category, index) => (
          <React.Fragment key={category.key}>
            <span
              className={[
                "whitespace-nowrap",
                category.isCurrent ? "text-cyan-200" : "text-white/36",
              ].join(" ")}
            >
              {category.label} {category.percent}%
            </span>

            {index < safeCategories.length - 1 ? (
              <span className="text-white/16">•</span>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function StoryPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnTo = React.useMemo(
    () => sanitizeReturnTo(searchParams.get("returnTo")),
    [searchParams]
  );

  const family = React.useMemo(() => {
    const value = searchParams.get("family");
    return value && ["motivations", "strengths", "skills", "misc"].includes(value)
      ? value
      : null;
  }, [searchParams]);

  const [data, setData] = React.useState<StoryNextResponse | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [answer, setAnswer] = React.useState("");
  const [showTextAnswer, setShowTextAnswer] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [finishing, setFinishing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [listening, setListening] = React.useState(false);

  const recognitionRef = React.useRef<any>(null);
  const finishTimerRef = React.useRef<number | null>(null);

  async function loadNext(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const query = family ? `?family=${encodeURIComponent(family)}` : "";
      const next = await apiFetch<StoryNextResponse>(`/story/next${query}`);
      setData(next);
      setSelected([]);
      setAnswer("");
      setShowTextAnswer(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load story.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void loadNext();

    return () => {
      recognitionRef.current?.stop?.();

      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  async function finishStory(): Promise<void> {
    setFinishing(true);
    setError(null);

    try {
      await apiFetch<{ ok: boolean; status?: string }>("/story/complete", {
        method: "POST",
      });
    } catch {
      // Do not block return flow.
    }

    finishTimerRef.current = window.setTimeout(() => {
      router.push(returnTo);
    }, 5500);
  }

  function returnNow(): void {
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
    }

    router.push(returnTo);
  }

  function toggleSelected(choice: string): void {
    const single =
      data?.question?.input_type === "single_select" ||
      data?.question?.answer_type_raw === "Multiple Choice";

    setSelected((current) => {
      if (single) {
        return current.includes(choice) ? [] : [choice];
      }

      return current.includes(choice)
        ? current.filter((item) => item !== choice)
        : [...current, choice];
    });
  }

  function toggleMic(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Microphone dictation is not supported in this browser.");
      return;
    }

    setShowTextAnswer(true);

    if (listening) {
      recognitionRef.current?.stop?.();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setAnswer((current) => `${current}${current ? " " : ""}${transcript}`);
      }
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  async function submitAnswer(): Promise<void> {
    if (!data?.question) return;

    const finalAnswer = [...selected, answer.trim()].filter(Boolean).join("; ");
    if (!finalAnswer) return;

    setSaving(true);
    setError(null);

    try {
      await apiFetch<{ ok: boolean }>("/story/answer", {
        method: "POST",
        body: JSON.stringify({
          question_id: data.question.id,
          answer_text: finalAnswer,
        }),
      });

      await loadNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save answer.");
    } finally {
      setSaving(false);
    }
  }

  if (finishing) {
    return (
      <div className="min-h-[100svh] bg-slate-950 text-white">
        <main className="flex min-h-[100svh] flex-col px-5">
          <section className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 text-[10px] uppercase tracking-[0.18em] text-white/34">
              My Story
            </div>

            <h1 className="animate-[storyEnter_280ms_ease-out_both] text-[2rem] font-semibold leading-[1.04] tracking-[-0.05em]">
              Nice. I added that to your Story.
            </h1>

            <p className="mt-5 text-[15px] leading-6 text-white/62">
              Everleap will use what you shared to make your guidance more
              personal.
            </p>

            <button
              type="button"
              onClick={returnNow}
              className="mt-8 text-[14px] font-semibold tracking-[-0.02em] text-cyan-200 hover:text-cyan-100"
            >
              Return now
            </button>
          </section>
        </main>

        <style jsx global>{`
          @keyframes storyEnter {
            from {
              opacity: 0;
              transform: translateY(6px);
              filter: blur(2px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
        `}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-8 text-white">
        Loading…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-8 text-white">
        {error}
      </div>
    );
  }

  if (!data || data.done || !data.question) {
    return (
      <div className="min-h-[100svh] bg-slate-950 text-white">
        <main className="flex min-h-[100svh] flex-col px-5">
          <section className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center text-center">
            <h1 className="animate-[storyEnter_280ms_ease-out_both] text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em]">
              Story complete.
            </h1>

            <p className="mt-5 text-[15px] leading-6 text-white/64">
              Nice work. You answered all available Story questions.
            </p>

            <button
              type="button"
              onClick={() => void finishStory()}
              className="mt-8 text-[14px] font-semibold tracking-[-0.02em] text-cyan-200 hover:text-cyan-100"
            >
              Done for now
            </button>
          </section>
        </main>

        <style jsx global>{`
          @keyframes storyEnter {
            from {
              opacity: 0;
              transform: translateY(6px);
              filter: blur(2px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
        `}</style>
      </div>
    );
  }

  const parsed = parseQuestion(data.question);

  const choices =
    data.question.options && data.question.options.length > 0
      ? data.question.options
      : parsed.choices;

  const hasChoices = choices.length > 0;
  const canContinue = selected.length > 0 || answer.trim().length > 0;

  return (
    <div className="min-h-[100svh] bg-slate-950 text-white">
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[640px] flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pt-4">
        <header className="shrink-0 animate-[storyProgressEnter_220ms_ease-out_both]">
          <StoryProgressLine categories={data.categories} />
        </header>

        <section className="flex flex-1 flex-col pt-8 sm:pt-10">
          <div
            key={data.question.id}
            className={[
              "w-full animate-[storyEnter_280ms_ease-out_both] transition-opacity duration-200",
              saving ? "pointer-events-none opacity-45" : "opacity-100",
            ].join(" ")}
          >
            <h1 className="text-balance text-[1.72rem] font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-[2rem]">
              {parsed.title}
            </h1>

            {parsed.helper ? (
              <p className="mt-3 animate-[answerEnter_220ms_ease-out_70ms_both] text-[14px] leading-5 tracking-[-0.015em] text-white/54 sm:text-[15px] sm:leading-6">
                {parsed.helper}
              </p>
            ) : null}

            {hasChoices ? (
              <div className="mt-5 space-y-1.5">
                {choices.map((choice, index) => {
                  const isSelected = selected.includes(choice);

                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => toggleSelected(choice)}
                      style={{ animationDelay: `${90 + index * 35}ms` }}
                      className={[
                        "block w-full animate-[answerEnter_220ms_ease-out_both] rounded-[17px] border px-3.5 py-2.5 text-left transition",
                        isSelected
                          ? "border-cyan-100/36 bg-cyan-300/[0.105]"
                          : "border-white/8 bg-white/[0.026] hover:border-white/15 hover:bg-white/[0.045]",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                            isSelected
                              ? "border-cyan-50/70 bg-cyan-50/12"
                              : "border-white/18 bg-white/[0.02]",
                          ].join(" ")}
                        >
                          {isSelected ? (
                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-50" />
                          ) : null}
                        </div>

                        <div
                          className={[
                            "min-w-0 flex-1 text-[13px] leading-[1.2rem] tracking-[-0.015em] sm:text-[14px]",
                            isSelected
                              ? "font-semibold text-white"
                              : "font-medium text-white/80",
                          ].join(" ")}
                        >
                          {choice}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {!showTextAnswer && hasChoices ? (
              <div className="mt-3 flex animate-[answerEnter_220ms_ease-out_240ms_both] items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowTextAnswer(true)}
                  className="text-[13px] font-semibold tracking-[-0.02em] text-white/42 hover:text-cyan-100"
                >
                  + Add your own words
                </button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className="text-[13px] font-semibold tracking-[-0.02em] text-white/34 hover:text-cyan-100"
                >
                  🎙 Speak
                </button>
              </div>
            ) : null}

            {(showTextAnswer || !hasChoices) ? (
              <div className="mt-5 animate-[storyExpand_180ms_ease-out_both]">
                <div className="relative">
                  <textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    rows={3}
                    placeholder="Write or speak your answer..."
                    className={[
                      "w-full resize-none rounded-[18px] border border-white/9 bg-white/[0.032]",
                      "px-4 py-3.5 pr-13 outline-none transition",
                      "text-[15px] leading-6 tracking-[-0.015em] text-white",
                      "placeholder:text-white/25",
                      "focus:border-cyan-100/22 focus:bg-white/[0.05]",
                    ].join(" ")}
                  />

                  <button
                    type="button"
                    onClick={toggleMic}
                    className={[
                      "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition",
                      listening
                        ? "bg-cyan-200/14 text-cyan-50"
                        : "bg-white/[0.045] text-white/46 hover:text-white/76",
                    ].join(" ")}
                    aria-label="Use microphone"
                  >
                    🎙
                  </button>
                </div>

                {listening ? (
                  <div className="mt-2 text-[12px] text-cyan-100/56">
                    Listening…
                  </div>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <div className="mt-3 text-[13px] leading-5 text-red-200/80">
                {error}
              </div>
            ) : null}

            <nav className="mt-6 flex animate-[answerEnter_220ms_ease-out_280ms_both] items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => void finishStory()}
                disabled={saving}
                className="text-[14px] font-semibold tracking-[-0.02em] text-white/45 hover:text-cyan-100 disabled:pointer-events-none disabled:opacity-45"
              >
                Done for now
              </button>

              <button
                type="button"
                onClick={() => void submitAnswer()}
                disabled={!canContinue || saving}
                className={[
                  "rounded-full px-5 py-2.5 text-[14px] font-semibold tracking-[-0.02em] transition",
                  !canContinue || saving
                    ? "cursor-not-allowed bg-white/[0.04] text-white/24"
                    : "bg-cyan-200/14 text-cyan-100 hover:bg-cyan-200/20",
                ].join(" ")}
              >
                {saving ? "Saving…" : "Continue →"}
              </button>
            </nav>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes storyEnter {
          from {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes answerEnter {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes storyExpand {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes storyProgressEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}