"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, MicOff, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Types
   ============================================================ */

type Category = "motivations" | "strengths" | "skills";
type CategoryLabel = "Motivations" | "Strengths" | "Skills";

type QA = {
  id: string;
  category: Category;
  question: string;
};

type Saved = { answer?: string; skipped?: boolean };

type SpeechRecognitionConstructor = {
  new (): SpeechRecognition;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* ============================================================
   Constants
   ============================================================ */

const STORAGE_KEY_V3 = "everleap.story.answers.v3";
const ONBOARDING_KEY = "everleapOnboarding_v1";

/* ============================================================
   Questions (5 + 5 + 5)
   ============================================================ */

const MOTIVATIONS_5 = [
  "What usually gives you energy during the day?",
  "When do you feel most focused?",
  "What drains you faster than it should?",
  "What do you naturally get curious about?",
  "What does a “good day” look like for you?",
];

const STRENGTHS_5 = [
  "What kind of people bring out your best?",
  "What’s something you’re proud of that most people don’t see?",
  "When do friends come to you for help?",
  "What do you learn faster than most people?",
  "What’s a challenge you’ve handled better than you expected?",
];

const SKILLS_5 = [
  "What’s a skill you’d like to level up this year?",
  "What do you like doing so much you lose track of time?",
  "What kind of tasks do you avoid—even when you know they matter?",
  "What’s one habit that would make your life easier if you improved it?",
  "If you could get really good at one thing, what would you pick?",
];

const QUESTIONS_ALL: QA[] = [
  ...MOTIVATIONS_5.map((q, i) => ({
    id: `motivations_${i + 1}`,
    category: "motivations" as const,
    question: q,
  })),
  ...STRENGTHS_5.map((q, i) => ({
    id: `strengths_${i + 1}`,
    category: "strengths" as const,
    question: q,
  })),
  ...SKILLS_5.map((q, i) => ({
    id: `skills_${i + 1}`,
    category: "skills" as const,
    question: q,
  })),
];

/* ============================================================
   Storage helpers
   ============================================================ */

function loadSaved(): Record<string, Saved> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_V3);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Saved>;
  } catch {
    return {};
  }
}

function saveOne(id: string, payload: Saved) {
  if (typeof window === "undefined") return;
  const current = loadSaved();
  current[id] = payload;
  try {
    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(current));
  } catch {}
}

function readNameFromOnboarding(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { name?: string } | null;
    return (parsed?.name ?? "").trim();
  } catch {
    return "";
  }
}

function isMeaningfulText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 3) return false;
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;
  const unique = new Set(lettersOnly.toLowerCase()).size;
  if (unique <= 2) return false;
  const squashed = trimmed.replace(/\s+/g, "");
  if (/^(.)\1{6,}$/i.test(squashed)) return false;
  return true;
}

function firstName(raw: string) {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

/* ============================================================
   Category helpers
   ============================================================ */

function normalizeCategory(raw: string | null): Category {
  const v = (raw ?? "").toLowerCase().trim();
  if (v === "motivations") return "motivations";
  if (v === "strengths") return "strengths";
  if (v === "skills") return "skills";
  return "motivations";
}

function labelForCategory(cat: Category): CategoryLabel {
  if (cat === "motivations") return "Motivations";
  if (cat === "strengths") return "Strengths";
  return "Skills";
}

function safeReturnTo(raw: string | null): string {
  const v = (raw ?? "").trim();
  if (!v) return "/main";
  if (!v.startsWith("/")) return "/main";
  if (v.startsWith("//")) return "/main";
  return v;
}

/* ============================================================
   Completion copy
   ============================================================ */

function completionCopy(cat: Category) {
  if (cat === "motivations") {
    return [
      "This gives us a clear starting point for how you function day to day — what supports energy and focus, and what tends to drain it.",
      "That’s how Everleap avoids generic advice. We’ll recommend options that fit your rhythm and real life, not just what sounds good on paper.",
      "Next, we’ll turn this into a few practical possibilities and small experiments to test what actually fits.",
    ];
  }

  if (cat === "strengths") {
    return [
      "This helps us understand how you tend to show up at your best, and the kinds of situations where your strengths come through naturally.",
      "From here, Everleap can focus recommendations on roles, projects, and communities where those strengths are likely to be used — not overlooked.",
      "We’ll suggest a few low-pressure ways to validate fit.",
    ];
  }

  return [
    "This gives us a practical picture of where you want to grow, and how that growth might realistically happen.",
    "From here, Everleap will recommend skill paths and next steps that are doable, not overwhelming — built around momentum, not pressure.",
    "This is a starting point, and we’ll refine as you go.",
  ];
}

/* ============================================================
   UI atoms
   ============================================================ */

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/70">
      {label}
    </span>
  );
}

function ProgressDashes({
  current,
  total,
  isDone,
}: {
  current: number;
  total: number;
  isDone: (i: number) => boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Progress">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const done = isDone(i);
        return (
          <span
            key={i}
            aria-hidden="true"
            className={[
              "rounded-full transition",
              active ? "h-[10px] w-8 bg-white/70" : "h-[8px] w-7",
              !active && done ? "bg-white/35" : "",
              !active && !done ? "bg-white/12" : "",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

function PauseLine({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-hidden="true"
      className="mt-8"
    >
      <div className="h-px w-44 rounded-full bg-white/18" />
    </motion.div>
  );
}

/* ============================================================
   Component
   ============================================================ */

type ScreenMode = "question" | "final";

export default function QuestionFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const category = normalizeCategory(params?.get("cat"));
  const categoryLabel = labelForCategory(category);
  const returnTo = safeReturnTo(params?.get("returnTo"));

  const questions = React.useMemo(
    () => QUESTIONS_ALL.filter((q) => q.category === category),
    [category]
  );

  const total = questions.length;

  const [name, setName] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [draft, setDraft] = React.useState("");
  const [screenMode, setScreenMode] = React.useState<ScreenMode>("question");
  const [savedMap, setSavedMap] = React.useState<Record<string, Saved>>({});

  const q = questions[index] ?? questions[0];
  const qId = q?.id ?? "";

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const focusAnswer = React.useCallback((opts?: { select?: boolean }) => {
    const el = textareaRef.current;
    if (!el) return;
    try {
      el.focus();
      if (opts?.select) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    } catch {}
  }, []);

  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");

  const stopListening = React.useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  }, []);

  const [showPauseLine, setShowPauseLine] = React.useState(false);
  const [ctaReady, setCtaReady] = React.useState(false);

  React.useEffect(() => {
    setName(readNameFromOnboarding());
  }, []);

  React.useEffect(() => {
    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  function refreshSaved() {
    const next = loadSaved();
    setSavedMap(next);
    return next;
  }

  React.useEffect(() => {
    refreshSaved();
    window.addEventListener("storage", refreshSaved);
    window.addEventListener("focus", refreshSaved);
    return () => {
      window.removeEventListener("storage", refreshSaved);
      window.removeEventListener("focus", refreshSaved);
    };
  }, []);

  React.useEffect(() => {
    setIndex(0);
    setDraft("");
    setScreenMode("question");
    setShowPauseLine(false);
    setCtaReady(false);
    window.setTimeout(() => focusAnswer(), 50);
  }, [category, focusAnswer]);

  React.useEffect(() => {
    if (!qId || screenMode !== "question") return;
    stopListening();
    lastFinalRef.current = "";
    const s = loadSaved()[qId];
    setDraft((s?.answer ?? "").trim());
    window.setTimeout(() => focusAnswer(), 0);
  }, [qId, screenMode, stopListening, focusAnswer]);

  React.useEffect(() => {
    if (total === 0) router.push(returnTo);
  }, [total, router, returnTo]);

  React.useEffect(() => {
    if (screenMode !== "final") {
      setShowPauseLine(false);
      setCtaReady(false);
      return;
    }
    const t1 = window.setTimeout(() => setShowPauseLine(true), 450);
    const t2 = window.setTimeout(() => setCtaReady(true), 3000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [screenMode, category]);

  const completionParagraphs = React.useMemo(
    () => completionCopy(category),
    [category]
  );

  function exitNow() {
    stopListening();
    router.push(returnTo);
  }

  function isDoneDash(i: number) {
    const id = questions[i]?.id;
    if (!id) return false;
    const s = savedMap[id];
    return Boolean(s && (s.skipped || (s.answer && s.answer.trim())));
  }

  function completeAndAdvance(opts: { skipped: boolean }) {
    if (!q) return;
    const text = draft.trim();

    if (!opts.skipped) {
      if (!text) return;
      if (!isMeaningfulText(text)) {
        setDraft("");
        focusAnswer();
        return;
      }
    }

    saveOne(q.id, opts.skipped ? { skipped: true } : { answer: text, skipped: false });
    refreshSaved();
    stopListening();
    setDraft("");

    if (index + 1 >= total) {
      setScreenMode("final");
      return;
    }

    setIndex((i) => i + 1);
    window.setTimeout(() => focusAnswer(), 50);
  }

  function toggleMic() {
    focusAnswer();
    lastFinalRef.current = "";
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRec =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0]?.transcript ?? "";
      }
      const cleaned = finalChunk.trim();
      if (!cleaned || cleaned === lastFinalRef.current) return;
      lastFinalRef.current = cleaned;
      setDraft((prev) => (prev ? `${prev} ${cleaned}` : cleaned));
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    recognitionRef.current = rec;
    setIsListening(true);
    try {
      rec.start();
    } catch {
      setIsListening(false);
    }
  }

  const screenKey = screenMode === "final" ? `final_${category}` : qId || "q";

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pt-10 pb-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="text-sm font-semibold text-white/80">Everleap</div>
        <div className="flex flex-col items-center gap-3">
          <ProgressDashes current={index} total={total} isDone={isDoneDash} />
          <CategoryPill label={categoryLabel} />
        </div>
        <button
          type="button"
          onClick={exitNow}
          className="text-sm font-semibold text-white/60 hover:text-white transition"
        >
          Exit
        </button>
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {screenMode === "final" ? (
              <div className="flex min-h-[60svh] items-center">
                <div className="w-full max-w-3xl">
                  <h1 className="mt-4 text-4xl font-semibold text-white">
                    {categoryLabel} done{firstName(name) ? `, ${firstName(name)}` : ""}.
                  </h1>

                  <div className="mt-6 space-y-4">
                    {completionParagraphs.map((p, i) => (
                      <p key={i} className="text-[15px] leading-7 text-white/75">
                        {p}
                      </p>
                    ))}
                  </div>

                  <PauseLine show={showPauseLine} />

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={exitNow}
                      disabled={!ctaReady}
                      className={`text-sm font-semibold ${
                        ctaReady ? "text-white/85 hover:text-white" : "text-white/35"
                      }`}
                    >
                      → Return
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[60svh] items-center">
                <div className="w-full max-w-3xl">
                  <h1 className="text-3xl font-semibold text-white">
                    {q?.question}
                  </h1>

                  <div className="mt-7 flex items-end gap-3">
                    <div className="flex-1 border-b border-white/18">
                      <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            completeAndAdvance({ skipped: false });
                          }
                        }}
                        rows={2}
                        className="w-full bg-transparent py-3 text-white/90 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={toggleMic}
                      disabled={!speechSupported}
                      className="h-10 w-10 rounded-full border border-white/18 text-white/80"
                    >
                      {isListening ? <MicOff /> : <Mic />}
                    </button>

                    <button
                      type="button"
                      onClick={() => completeAndAdvance({ skipped: false })}
                      disabled={!draft.trim()}
                      className="h-10 w-10 rounded-full bg-white/80 text-black disabled:opacity-40"
                    >
                      <Send />
                    </button>
                  </div>

                  <div className="mt-6 text-sm text-white/60">
                    <button onClick={() => completeAndAdvance({ skipped: true })}>
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
