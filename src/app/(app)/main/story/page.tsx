"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import OnboardingVisual from "@/app/onboarding/components/visuals/OnboardingVisual";

type StoryQuestion = {
  id: string;
  family?: string | null;
  goal?: string | null;
  question_text?: string | null;
  text?: string | null;
  question?: string | null;
  prompt?: string | null;
  label?: string | null;
  input_type?: string | null;
  answer_type_raw?: string | null;
  options?: string[];
};

type StoryNextResponse = {
  ok: boolean;
  done: boolean;
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

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

function StoryProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const totalDots = 5;
  const progress = total > 0 ? current / total : 0;
  const activeDots = Math.max(
    1,
    Math.min(totalDots, Math.ceil(progress * totalDots))
  );

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="text-[13px] font-medium tracking-[-0.01em] text-white">
          Story
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, index) => {
            const active = index < activeDots;

            return (
              <div
                key={index}
                className={[
                  "h-[7px] w-[7px] rounded-full transition-all duration-500",
                  active
                    ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                    : "bg-white/16",
                ].join(" ")}
              />
            );
          })}
        </div>
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

  const [data, setData] = React.useState<StoryNextResponse | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [answer, setAnswer] = React.useState("");
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
      const next = await apiFetch<StoryNextResponse>("/story/next");
      setData(next);
      setSelected([]);
      setAnswer("");
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
      <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
        <main className="relative z-10 flex h-[100svh] flex-col px-5">
          <section className="mx-auto flex h-full w-full max-w-[720px] flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/34">
              My Story
            </div>

            <h1 className="max-w-[460px] text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.05em]">
              Nice. I added that to your Story.
            </h1>

            <p className="mt-5 max-w-[430px] text-[17px] leading-7 text-white/62">
              Everleap will use what you shared to make your guidance more
              personal.
            </p>

            <button
              type="button"
              onClick={returnNow}
              className="mt-8 text-[15px] font-semibold tracking-[-0.02em] text-cyan-200 hover:text-cyan-100"
            >
              Return now
            </button>
          </section>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Loading…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        {error}
      </div>
    );
  }

  if (!data || data.done || !data.question) {
    return (
      <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
        <main className="relative z-10 flex h-[100svh] flex-col px-5">
          <header className="mx-auto flex h-[40px] w-full max-w-[720px] items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => void finishStory()}
              className="text-[13px] font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Done for now
            </button>
          </header>

          <section className="mx-auto flex h-full w-full max-w-[720px] flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.05em]">
              Story complete.
            </h1>
            <p className="mt-5 max-w-[420px] text-[17px] leading-7 text-white/64">
              Nice work. You answered all available Story questions.
            </p>
          </section>
        </main>
      </div>
    );
  }

const parsed = parseQuestion(data.question);

const choices =
  data.question.options && data.question.options.length > 0
    ? data.question.options
    : parsed.choices;

const canContinue = selected.length > 0 || answer.trim().length > 0;

  return (
    <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
      <main className="relative z-10 flex h-[100svh] flex-col px-5">
        <header className="mx-auto flex h-[38px] w-full max-w-[720px] shrink-0 items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => void finishStory()}
            className="w-20 text-left text-[13px] font-semibold leading-4 text-cyan-200/80 hover:text-cyan-100"
          >
            Done for now
          </button>

          <StoryProgress
            current={data.progress.categoryCurrent}
            total={data.progress.categoryTotal}
          />

          <div className="w-20 text-right text-[12px] font-medium text-white/34">
            {data.progress.categoryCurrent}/{data.progress.categoryTotal}
          </div>
        </header>

        <section className="mx-auto flex h-full min-h-0 w-full max-w-[720px] flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <OnboardingVisual visualKey="activities" />

            <div className="flex w-full justify-center">
              <div className="w-full max-w-[400px]">
                <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/34">
                  {data.progress.categoryLabel}
                </div>

                <h1 className="text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.045em] text-white sm:text-[2.2rem]">
                  {parsed.title}
                </h1>

                {parsed.helper ? (
                  <p className="mt-3 text-[15px] leading-6 tracking-[-0.015em] text-white/58">
                    {parsed.helper}
                  </p>
                ) : null}

                {choices.length > 0 ? (
                  <div className="mt-5 space-y-1.5">
                    {choices.map((choice) => {
                      const isSelected = selected.includes(choice);

                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => toggleSelected(choice)}
                          className={[
                            "group relative block w-full overflow-hidden rounded-[20px] border px-4 py-3 text-left transition",
                            isSelected
                              ? "border-cyan-100/36 bg-cyan-300/[0.105] shadow-[0_0_24px_rgba(103,232,249,0.055)]"
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
                                "min-w-0 flex-1 text-[15px] leading-[1.35rem] tracking-[-0.015em]",
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

                <div className="mt-5">
                  <div className="mb-2 text-[11px] leading-4 tracking-[-0.01em] text-white/32">
                    Add your own words or use the microphone.
                  </div>

                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      rows={3}
                      placeholder="Write or speak your answer..."
                      className={[
                        "w-full resize-none rounded-[22px] border border-white/9 bg-white/[0.032]",
                        "px-5 py-3.5 pr-16 outline-none transition",
                        "text-[16px] leading-6 tracking-[-0.015em] text-white",
                        "placeholder:text-white/25",
                        "focus:border-cyan-100/22 focus:bg-white/[0.05]",
                      ].join(" ")}
                    />

                    <button
                      type="button"
                      onClick={toggleMic}
                      className={[
                        "absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition",
                        listening
                          ? "bg-cyan-200/14 text-cyan-50"
                          : "bg-white/[0.045] text-white/46 hover:text-white/76",
                      ].join(" ")}
                    >
                      🎙
                    </button>
                  </div>

                  {listening ? (
                    <div className="mt-2 text-[12px] text-cyan-100/56">
                      Listening…
                    </div>
                  ) : null}

                  {error ? (
                    <div className="mt-3 text-[13px] leading-5 text-red-200/80">
                      {error}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-2 sm:pb-16">
            <nav className="w-full px-5 py-4">
              <div className="mx-auto flex h-auto w-full max-w-[420px] items-center justify-between">
                <button
                  type="button"
                  onClick={() => void finishStory()}
                  className="text-[15px] font-semibold tracking-[-0.02em] text-cyan-200 hover:text-cyan-100"
                >
                  Done for now
                </button>

                <button
                  type="button"
                  onClick={() => void submitAnswer()}
                  disabled={!canContinue || saving}
                  className={[
                    "text-[15px] font-semibold tracking-[-0.02em] transition",
                    !canContinue || saving
                      ? "cursor-not-allowed text-white/24"
                      : "text-cyan-200 hover:text-cyan-100",
                  ].join(" ")}
                >
                  {saving ? "Saving…" : "Continue"}
                </button>
              </div>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}