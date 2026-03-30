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

const ONBOARDING_KEY_PRIMARY = "everleapOnboarding_v4_convo_min";
const ONBOARDING_KEY_FALLBACK = "everleapOnboarding_v1";

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

  const tryRead = (key: string): string => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { name?: string } | null;
      return (parsed?.name ?? "").trim();
    } catch {
      return "";
    }
  };

  const primary = tryRead(ONBOARDING_KEY_PRIMARY);
  if (primary) return primary;

  const fallback = tryRead(ONBOARDING_KEY_FALLBACK);
  return fallback;
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
      "This gives us a clearer read on what supports your energy, focus, and day-to-day rhythm.",
      "That helps Everleap avoid generic advice. We can look for paths that fit the way you actually move through life, not just what sounds impressive.",
      "Next, we’ll turn this into a few practical possibilities and small experiments worth trying.",
    ];
  }

  if (cat === "strengths") {
    return [
      "This gives us a better picture of how you tend to show up when you are at your best.",
      "From here, Everleap can look for roles, projects, and communities where those strengths are more likely to be used and noticed.",
      "Next, we’ll turn that into a few grounded directions you can test without pressure.",
    ];
  }

  return [
    "This gives us a more practical read on where you want to grow and what kind of growth might actually feel worth it.",
    "From here, Everleap can suggest skill paths and next steps that feel doable, not overwhelming.",
    "This is a starting point. We’ll keep refining it as we learn more about you.",
  ];
}

/* ============================================================
   UI atoms
   ============================================================ */

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/68 backdrop-blur-sm">
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
              "rounded-full transition-all duration-300",
              active
                ? "h-[8px] w-9 bg-white/72 shadow-[0_0_22px_rgba(255,255,255,0.18)]"
                : "h-[6px] w-7",
              !active && done ? "bg-white/28" : "",
              !active && !done ? "bg-white/10" : "",
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
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0.92 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-hidden="true"
      className="mt-8 origin-left"
    >
      <div className="h-px w-44 rounded-full bg-gradient-to-r from-white/24 via-white/12 to-transparent" />
    </motion.div>
  );
}

function leadInForCategory(category: Category) {
  if (category === "motivations") return "Take a second with this.";
  if (category === "strengths") return "Answer from what feels true.";
  return "No rush. Start where your mind goes first.";
}

function ambientToneForCategory(category: Category) {
  if (category === "motivations") {
    return {
      orbA: "bg-amber-300/10",
      orbB: "bg-orange-400/10",
      ring: "from-amber-200/14 via-white/8 to-transparent",
      glow: "shadow-[0_0_80px_rgba(251,191,36,0.08)]",
    };
  }

  if (category === "strengths") {
    return {
      orbA: "bg-sky-300/10",
      orbB: "bg-cyan-400/10",
      ring: "from-sky-200/14 via-white/8 to-transparent",
      glow: "shadow-[0_0_80px_rgba(56,189,248,0.08)]",
    };
  }

  return {
    orbA: "bg-violet-300/10",
    orbB: "bg-fuchsia-400/10",
    ring: "from-violet-200/14 via-white/8 to-transparent",
    glow: "shadow-[0_0_80px_rgba(167,139,250,0.08)]",
  };
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

  const refreshSaved = React.useCallback(() => {
    const next = loadSaved();
    setSavedMap(next);
    return next;
  }, []);

  React.useEffect(() => {
    refreshSaved();
    window.addEventListener("storage", refreshSaved);
    window.addEventListener("focus", refreshSaved);
    return () => {
      window.removeEventListener("storage", refreshSaved);
      window.removeEventListener("focus", refreshSaved);
    };
  }, [refreshSaved]);

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

  const completionParagraphs = React.useMemo(() => completionCopy(category), [category]);
  const tone = React.useMemo(() => ambientToneForCategory(category), [category]);

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

    const SpeechRec = window.SpeechRecognition ?? window.webkitSpeechRecognition;
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
    <div className="relative mx-auto w-full max-w-[920px] px-4 pb-24 pt-8 sm:px-5 sm:pt-10 lg:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[-6rem] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full blur-3xl ${tone.orbA}`}
        />
        <div
          className={`absolute bottom-[-5rem] right-[10%] h-[15rem] w-[15rem] rounded-full blur-3xl ${tone.orbB}`}
        />
        <div className="absolute inset-x-0 top-[24%] h-40 bg-gradient-to-b from-white/[0.02] via-white/[0.015] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={exitNow}
          className="pt-1 text-sm font-medium text-white/52 transition hover:text-white/80"
        >
          Exit
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <ProgressDashes current={index} total={total} isDone={isDoneDash} />
          <CategoryPill label={categoryLabel} />
        </div>

        <div className="w-[44px]" aria-hidden="true" />
      </div>

      <div className="mt-10 sm:mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {screenMode === "final" ? (
              <div className="flex min-h-[62svh] items-center">
                <div className="w-full max-w-3xl">
                  <div
                    className={`rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-7 backdrop-blur-sm sm:px-8 sm:py-9 ${tone.glow}`}
                  >
                    <p className="text-sm font-medium uppercase tracking-[0.12em] text-white/46">
                      Reflection complete
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                      That gives us something real
                      {firstName(name) ? `, ${firstName(name)}` : ""}.
                    </h1>

                    <div className="mt-6 space-y-4">
                      {completionParagraphs.map((p, i) => (
                        <p key={i} className="max-w-2xl text-[15px] leading-7 text-white/72">
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
                        className={[
                          "inline-flex items-center gap-2 text-sm font-medium transition",
                          ctaReady
                            ? "text-white/84 hover:text-white"
                            : "cursor-default text-white/30",
                        ].join(" ")}
                      >
                        Continue
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[62svh] items-center">
                <div className="w-full max-w-3xl">
                  <div className="max-w-2xl">
                    <p className="text-sm font-medium tracking-[0.08em] text-white/44">
                      {leadInForCategory(category)}
                    </p>

                    <h1 className="mt-4 text-[2rem] font-semibold leading-[1.16] text-white sm:text-[2.5rem]">
                      {q?.question}
                    </h1>
                  </div>

                  <div className="mt-9 max-w-2xl">
                    <div
                      className={[
                        "relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045]",
                        "px-4 py-4 sm:px-5 sm:py-5",
                        "backdrop-blur-sm",
                        tone.glow,
                      ].join(" ")}
                    >
                      <div
                        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${tone.ring}`}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_48%)]" />

                      <div className="relative">
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
                          rows={4}
                          placeholder="Write whatever feels true first."
                          className="min-h-[128px] w-full resize-none bg-transparent px-1 py-1 text-[16px] leading-7 text-white/90 outline-none placeholder:text-white/26"
                        />

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                          <button
                            type="button"
                            onClick={toggleMic}
                            disabled={!speechSupported}
                            className={[
                              "inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm transition",
                              speechSupported
                                ? "text-white/58 hover:bg-white/[0.04] hover:text-white/82"
                                : "cursor-not-allowed text-white/24",
                            ].join(" ")}
                          >
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                            <span>{isListening ? "Listening…" : "Speak"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => completeAndAdvance({ skipped: false })}
                            disabled={!draft.trim()}
                            className={[
                              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition",
                              draft.trim()
                                ? "border-white/16 bg-white/[0.08] text-white/86 hover:border-white/24 hover:bg-white/[0.12] hover:text-white"
                                : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/28",
                            ].join(" ")}
                          >
                            <span>Continue</span>
                            <Send size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-center">
                      <button
                        type="button"
                        onClick={() => completeAndAdvance({ skipped: true })}
                        className="text-sm font-medium text-white/46 transition hover:text-white/74"
                      >
                        Skip for now
                      </button>
                    </div>
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