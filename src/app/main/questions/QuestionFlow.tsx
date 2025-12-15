// src/app/main/questions/QuestionFlow.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mic, Send } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";

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
const TRANSITION_MS = 180;

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

  // ✅ transition state
  const [transitioning, setTransitioning] = React.useState(false);

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const transitionTimerRef = React.useRef<number | null>(null);

  const q = PLACEHOLDER_QUESTIONS[index] ?? PLACEHOLDER_QUESTIONS[0];

  const autosize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const clearComposer = React.useCallback(() => {
    // ✅ key fix: wipe the input immediately so next answer starts fresh
    setDraft("");
    setSpeechInterim("");
    requestAnimationFrame(autosize);
  }, [autosize]);

  const goToNextWithAnimation = React.useCallback(
    (nextIndex: number) => {
      if (transitioning) return;

      // fade out current screen
      setTransitioning(true);

      // clear any pending timers
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }

      transitionTimerRef.current = window.setTimeout(() => {
        // if finished, exit funnel
        if (nextIndex >= TOTAL) {
          router.push("/main");
          return;
        }

        setIndex(nextIndex);

        // fade back in on next frame (so transition applies)
        requestAnimationFrame(() => {
          setTransitioning(false);
        });
      }, TRANSITION_MS);
    },
    [router, transitioning]
  );

  React.useEffect(() => {
    // hydrate draft from localStorage if present
    const saved = loadSaved()[q.id];
    if (saved?.answer) setDraft(saved.answer);
    else setDraft("");
    setSpeechInterim("");

    requestAnimationFrame(autosize);
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
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const submit = React.useCallback(() => {
    if (transitioning) return;

    const text = (draft + (speechInterim ? ` ${speechInterim}` : "")).trim();
    if (!text) return;

    saveOne(q.id, { answer: text, skipped: false });

    // ✅ blank out immediately so we never append into the next question
    clearComposer();

    goToNextWithAnimation(index + 1);
  }, [transitioning, draft, speechInterim, q.id, clearComposer, goToNextWithAnimation, index]);

  const skip = React.useCallback(() => {
    if (transitioning) return;

    saveOne(q.id, { answer: undefined, skipped: true });

    clearComposer();

    goToNextWithAnimation(index + 1);
  }, [transitioning, q.id, clearComposer, goToNextWithAnimation, index]);

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

      if (interimChunk) setSpeechInterim(interimChunk);

      if (finalChunk) {
        setDraft((prev) => {
          const base = prev.trim();
          return base ? `${base} ${finalChunk}` : finalChunk;
        });
        setSpeechInterim("");
      }

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
    if (transitioning) return;

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

  const sendEnabled = Boolean(draft.trim() || speechInterim.trim());

  return (
    <div className="relative min-h-[100svh]">
      {/* Subtle funnel fade layer (keeps AppChrome behind it) */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

      {/* Centered panel */}
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10 pb-28">
        <div className="w-full max-w-4xl">
          <div
            className={`
              relative rounded-[44px] border border-white/10 bg-slate-950/35 p-[1px]
              shadow-[0_45px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl
              transition-all duration-200 ease-out
              ${transitioning ? "opacity-0 translate-y-2 scale-[0.99]" : "opacity-100 translate-y-0 scale-100"}
            `}
          >
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
                        className={`h-1.5 w-1.5 rounded-full ${on ? "bg-sky-300" : "bg-white/10"}`}
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
                          disabled={transitioning}
                          className={`
                            inline-flex h-11 w-11 items-center justify-center rounded-full border
                            transition active:scale-95 disabled:opacity-60
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
                          disabled={!sendEnabled || transitioning}
                          className={`
                            inline-flex h-11 w-11 items-center justify-center rounded-full
                            transition active:scale-95 disabled:opacity-60
                            ${
                              sendEnabled
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
                          Listening:{" "}
                          <span className="text-slate-100/70">{speechInterim}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-center gap-8 text-sm text-slate-200/60">
                    <button type="button" onClick={skip} className="hover:text-slate-100">
                      I’m not sure
                    </button>
                    <button type="button" onClick={skip} className="hover:text-slate-100">
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

      {/* ✅ Use footer nav for exiting/going elsewhere */}
      <BottomNav />
    </div>
  );
}
