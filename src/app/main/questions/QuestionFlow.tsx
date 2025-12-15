// src/app/main/questions/QuestionFlow.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mic, Send } from "lucide-react";

type QA = { id: string; question: string; answer?: string; skipped?: boolean };

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const TOTAL = 30;

const PLACEHOLDER_QUESTIONS: QA[] = Array.from({ length: TOTAL }).map((_, i) => ({
  id: `q_${i + 1}`,
  question: [
    "What usually gives you energy during the day?",
    "When do you feel most focused?",
    "What drains you faster than it should?",
    "What do you naturally get curious about?",
    "If you could improve one habit, what would it be?",
    "What kind of people bring out your best?",
    "What kind of tasks do you avoid—even when you know they matter?",
    "What’s something you’re proud of that most people don’t see?",
    "What does a “good day” look like for you?",
    "What’s one thing you want more of in your life right now?",
  ][i % 10],
}));

const STORAGE_KEY = "everleap.story.answers.v1";

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function loadSaved(): Record<string, { answer?: string; skipped?: boolean }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, { answer?: string; skipped?: boolean }>;
  } catch {
    return {};
  }
}

function saveOne(id: string, payload: { answer?: string; skipped?: boolean }) {
  if (typeof window === "undefined") return;
  const current = loadSaved();
  current[id] = payload;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore storage failures
  }
}

export default function QuestionFlow() {
  const router = useRouter();

  const [index, setIndex] = React.useState(0);
  const [draft, setDraft] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [speechInterim, setSpeechInterim] = React.useState("");

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const q = PLACEHOLDER_QUESTIONS[index] ?? PLACEHOLDER_QUESTIONS[0];
  const progress = (index + 1) / TOTAL;

  React.useEffect(() => {
    // hydrate draft from localStorage if present
    const saved = loadSaved()[q.id];
    if (saved?.answer) setDraft(saved.answer);
    else setDraft("");
    setSpeechInterim("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/main");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const autosize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  };

  const goNext = React.useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= TOTAL) {
        router.push("/main");
        return prev;
      }
      return next;
    });
  }, [router]);

  const submit = React.useCallback(() => {
    const text = (draft + (speechInterim ? ` ${speechInterim}` : "")).trim();
    if (!text) return;

    saveOne(q.id, { answer: text, skipped: false });
    setSpeechInterim("");
    goNext();
  }, [draft, speechInterim, goNext, q.id]);

  const skip = React.useCallback(() => {
    saveOne(q.id, { answer: undefined, skipped: true });
    setSpeechInterim("");
    goNext();
  }, [goNext, q.id]);

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
        | SpeechRecognitionConstructor
        | undefined;

    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        const text = (res?.[0]?.transcript ?? "").trim();
        if (!text) continue;

        if (res.isFinal) finalChunk += (finalChunk ? " " : "") + text;
        else interimChunk += (interimChunk ? " " : "") + text;
      }

      // IMPORTANT: no duplication
      if (interimChunk) setSpeechInterim(interimChunk);

      if (finalChunk) {
        setDraft((prev) => {
          const base = prev.trim();
          return base ? `${base} ${finalChunk}` : finalChunk;
        });
        setSpeechInterim("");
      }

      // keep textarea sized
      requestAnimationFrame(autosize);
    };

    rec.onerror = () => {
      setListening(false);
      setSpeechInterim("");
    };

    rec.onend = () => {
      setListening(false);
      setSpeechInterim("");
    };

    recognitionRef.current = rec;
    return rec;
  }

  const toggleListening = () => {
    // stop
    if (listening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      return;
    }

    const rec = getOrCreateRecognition();
    if (!rec) return;

    try {
      setListening(true);
      setSpeechInterim("");
      rec.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="relative min-h-[100svh]">
      {/* Subtle funnel fade layer (keeps AppChrome behind it) */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

      {/* Exit + hint */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/main")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 text-slate-100 backdrop-blur-xl hover:bg-slate-950/55"
          aria-label="Back to Spotlight"
          title="Back to Spotlight"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="hidden text-xs text-slate-200/60 md:block">
          Press <span className="rounded bg-white/10 px-1.5 py-0.5">Esc</span> to exit
        </div>
      </div>

      {/* Centered panel */}
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="relative rounded-[44px] border border-white/10 bg-slate-950/35 p-[1px] shadow-[0_45px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            {/* Inner */}
            <div className="relative rounded-[43px] bg-slate-950/35 px-6 py-10 sm:px-10 sm:py-12">
              {/* Header label + dots */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-200/60">
                  Your Story
                </div>

                {/* 30-dot progress (compact) */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: TOTAL }).map((_, i) => {
                    const on = i <= index;
                    return (
                      <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${
                          on ? "bg-sky-300" : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Question */}
              <h1 className="mt-8 text-center text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                {q.question}
              </h1>

              {/* Input bubble (onboarding-style) */}
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-3xl">
                  <div className="relative rounded-[34px] bg-gradient-to-r from-sky-400/70 via-fuchsia-500/65 to-amber-300/65 p-[1px]">
                    <div className="relative flex items-end gap-3 rounded-[34px] bg-slate-950/65 px-4 py-4 sm:px-6 sm:py-5">
                      <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={(e) => {
                          setDraft(e.target.value);
                          autosize();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        }}
                        rows={3}
                        placeholder="Type here…"
                        className="
                          min-h-[84px] flex-1 resize-none bg-transparent
                          text-base text-slate-50 placeholder:text-slate-400/70
                          outline-none
                        "
                      />

                      {/* Right controls: mic + send (like onboarding) */}
                      <div className="flex items-center gap-2 pb-1">
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`
                            inline-flex h-11 w-11 items-center justify-center rounded-full border
                            transition active:scale-95
                            ${
                              listening
                                ? "border-rose-300/60 bg-rose-500/15 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.35)]"
                                : "border-white/15 bg-slate-950/35 text-slate-100 hover:border-sky-300/60 hover:bg-slate-950/50"
                            }
                          `}
                          aria-label={listening ? "Stop listening" : "Start listening"}
                          title={listening ? "Listening…" : "Talk instead of typing"}
                        >
                          <Mic className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={submit}
                          disabled={!(draft.trim() || speechInterim.trim())}
                          className={`
                            inline-flex h-11 w-11 items-center justify-center rounded-full
                            transition active:scale-95
                            ${
                              draft.trim() || speechInterim.trim()
                                ? "bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200"
                                : "bg-white/10 text-slate-200/50"
                            }
                          `}
                          aria-label="Submit"
                          title="Submit"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Interim caption (kept subtle) */}
                      {speechInterim ? (
                        <div className="pointer-events-none absolute left-6 top-3 text-[0.7rem] text-slate-200/60">
                          Listening: <span className="text-slate-100/70">{speechInterim}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-center gap-8 text-sm text-slate-200/60">
                    <button
                      type="button"
                      onClick={skip}
                      className="hover:text-slate-100"
                    >
                      I’m not sure
                    </button>
                    <button
                      type="button"
                      onClick={skip}
                      className="hover:text-slate-100"
                    >
                      Skip for now
                    </button>
                  </div>

                  {/* Tiny progress label */}
                  <div className="mt-6 text-center text-xs text-slate-200/45">
                    Question {index + 1} of {TOTAL}
                  </div>
                </div>
              </div>
              {/* /input */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
