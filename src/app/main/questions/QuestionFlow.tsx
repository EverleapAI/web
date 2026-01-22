"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   Types
   ============================================================ */

type Category = "motivations" | "strengths" | "skills";

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

const TOTAL = 15;

const STORAGE_KEY_V1 = "everleap.story.answers.v1";
const STORAGE_KEY = "everleap.story.answers.v2";
const RESET_FLAG = "everleap.story.reset.v2.session";

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

const QUESTIONS: QA[] = [
  ...MOTIVATIONS_5.map((q, i) => ({
    id: `q_${i + 1}`,
    category: "motivations" as const,
    question: q,
  })),
  ...STRENGTHS_5.map((q, i) => ({
    id: `q_${i + 6}`,
    category: "strengths" as const,
    question: q,
  })),
  ...SKILLS_5.map((q, i) => ({
    id: `q_${i + 11}`,
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
    const raw = window.localStorage.getItem(STORAGE_KEY);
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
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

function isAnswered(saved: Saved | undefined) {
  const a = saved?.answer?.trim();
  return Boolean(a);
}

/* ============================================================
   Summary builder (final screen)
   ============================================================ */

function takeFirstMeaningful(saved: Record<string, Saved>, ids: string[], max: number) {
  const out: string[] = [];
  for (const id of ids) {
    const a = saved[id]?.answer?.trim();
    if (a) out.push(a);
    if (out.length >= max) break;
  }
  return out;
}

function buildFinalSummary(saved: Record<string, Saved>) {
  const motIds = ["q_1", "q_2", "q_3", "q_4", "q_5"];
  const strIds = ["q_6", "q_7", "q_8", "q_9", "q_10"];
  const sklIds = ["q_11", "q_12", "q_13", "q_14", "q_15"];

  const mot = takeFirstMeaningful(saved, motIds, 2);
  const str = takeFirstMeaningful(saved, strIds, 2);
  const skl = takeFirstMeaningful(saved, sklIds, 2);

  const parts: string[] = [];

  if (mot.length) parts.push(`Motivations: ${mot.length === 1 ? mot[0] : `${mot[0]} / ${mot[1]}`}.`);
  else parts.push("Motivations: you left some blanks — totally fine.");

  if (str.length) parts.push(`Strengths: ${str.length === 1 ? str[0] : `${str[0]} / ${str[1]}`}.`);
  else parts.push("Strengths: we’ll learn that with time — no problem.");

  if (skl.length) parts.push(`Skills: ${skl.length === 1 ? skl[0] : `${skl[0]} / ${skl[1]}`}.`);
  else parts.push("Skills: we can refine this later — you’re not behind.");

  parts.push("This is a starting snapshot — enough for your first Insights.");
  return parts.join(" ");
}

/* ============================================================
   UI atoms
   ============================================================ */

function ProgressNumbers({
  current,
  total,
  canJump,
  isBold,
  onJump,
}: {
  current: number;
  total: number;
  canJump: (i: number) => boolean;
  isBold: (i: number) => boolean;
  onJump: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Progress">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        const enabled = canJump(i);
        const bold = isBold(i);

        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            disabled={!enabled}
            className={`h-7 min-w-[28px] rounded-full px-2 text-xs transition ${
              active
                ? "bg-white/80 text-black"
                : enabled
                  ? "bg-white/10 text-white/75 hover:bg-white/16"
                  : "bg-white/6 text-white/25 cursor-not-allowed"
            } ${bold ? "font-extrabold" : "font-semibold"}`}
            aria-label={`Question ${i + 1}`}
            title={enabled ? `Go to question ${i + 1}` : `Question ${i + 1} (not answered yet)`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function MiniCelebrateLine() {
  return (
    <div className="mt-8 flex flex-col items-center" aria-hidden="true">
      <div className="flex items-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const on = i === 3;
          return (
            <span
              key={i}
              className={`h-[6px] w-[6px] rounded-full ${on ? "bg-white/70" : "bg-white/18"}`}
            />
          );
        })}
      </div>
      <div className="mt-6 h-px w-40 rounded-full bg-white/20" />
    </div>
  );
}

/* ============================================================
   Section helpers
   ============================================================ */

function sectionLabel(cat: Category) {
  if (cat === "motivations") return "Motivations";
  if (cat === "strengths") return "Strengths";
  return "Skills";
}

function sectionBody(cat: Category) {
  if (cat === "motivations") return "Next up: Strengths. This helps us understand what brings out your best.";
  if (cat === "strengths") return "Next up: Skills. This helps us spot where you’ll grow the fastest.";
  return "You’re done. Next we’ll show a few early insights from what you shared.";
}

/* ============================================================
   Component
   ============================================================ */

type ScreenMode = "question" | "section" | "final";

type SectionState = {
  finished: Category;
  nextIndex: number;
};

type NavIntent = "forward" | "back_or_jump";

export default function QuestionFlow() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [draft, setDraft] = React.useState("");

  const [screenMode, setScreenMode] = React.useState<ScreenMode>("question");
  const [section, setSection] = React.useState<SectionState | null>(null);

  const [savedMap, setSavedMap] = React.useState<Record<string, Saved>>({});

  const q = QUESTIONS[index] ?? QUESTIONS[0];

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // If user jumps back via progress, we remember where they came from.
  const originIndexRef = React.useRef<number | null>(null);

  // Controls whether we hydrate prior answer or force blank.
  const navIntentRef = React.useRef<NavIntent>("forward");

  // Speech
  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");

  React.useEffect(() => {
    setName(readNameFromOnboarding());
  }, []);

  // Reset local data ONCE per session
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const already = window.sessionStorage.getItem(RESET_FLAG);
      if (!already) {
        window.localStorage.removeItem(STORAGE_KEY_V1);
        window.localStorage.removeItem(STORAGE_KEY);
        window.sessionStorage.setItem(RESET_FLAG, "1");
      }
    } catch {
      // ignore
    }
  }, []);

  // Speech supported
  React.useEffect(() => {
    if (typeof window === "undefined") return;
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

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refreshSaved();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshSaved);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshSaved);
    };
  }, []);

  function stopListening() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
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

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        const t = (res?.[0]?.transcript ?? "").trim();
        if (!t) continue;
        if (res.isFinal) finalChunk += (finalChunk ? " " : "") + t;
      }

      const cleaned = finalChunk.trim();
      if (!cleaned) return;
      if (cleaned === lastFinalRef.current) return;
      lastFinalRef.current = cleaned;

      setDraft((prev) => {
        const base = prev.trim();
        return base ? `${base} ${cleaned}` : cleaned;
      });
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    return rec;
  }

  function toggleMic() {
    textareaRef.current?.focus();
    lastFinalRef.current = "";

    if (isListening) {
      stopListening();
      return;
    }

    const rec = getOrCreateRecognition();
    if (!rec) return;

    try {
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
    }
  }

  // Cleanup
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

  // When question changes and we're in question mode:
  // - forward nav forces blank
  // - back/jump hydrates saved answer
  React.useEffect(() => {
    if (screenMode !== "question") return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    lastFinalRef.current = "";

    const intent = navIntentRef.current;

    if (intent === "forward") {
      setDraft("");
    } else {
      const s = loadSaved()[q.id];
      const nextDraft = (s?.answer ?? "").trim();
      setDraft(nextDraft);
    }
  }, [q.id, screenMode]);

  function hardClearDraftForForward() {
    setDraft("");
    lastFinalRef.current = "";
  }

  function sectionForBoundary(nextIndex: number): SectionState | null {
    // Called only for main forward flow; not for jump-edit returns.
    if (nextIndex === 5) return { finished: "motivations", nextIndex };
    if (nextIndex === 10) return { finished: "strengths", nextIndex };
    if (nextIndex === 15) return { finished: "skills", nextIndex };
    return null;
  }

  function completeAndAdvance(opts: { skipped: boolean }) {
    const isEditingJump = originIndexRef.current !== null;

    const text = draft.trim();

    if (!opts.skipped) {
      if (!text) return;

      if (!isMeaningfulText(text)) {
        setDraft("");
        textareaRef.current?.focus();
        return;
      }
    }

    // Save
    if (opts.skipped) saveOne(q.id, { answer: undefined, skipped: true });
    else saveOne(q.id, { answer: text, skipped: false });

    refreshSaved();
    stopListening();

    // If they jumped back from some origin, return to origin (no congrats screens)
    if (isEditingJump) {
      const origin = originIndexRef.current!;
      originIndexRef.current = null;

      navIntentRef.current = "back_or_jump";
      setScreenMode("question");
      setSection(null);
      setIndex(origin);

      window.setTimeout(() => textareaRef.current?.focus(), 50);
      return;
    }

    // Main forward flow
    const nextIndex = index + 1;

    // Always blank on forward
    navIntentRef.current = "forward";
    hardClearDraftForForward();

    const boundary = sectionForBoundary(nextIndex);

    if (boundary) {
      setScreenMode("section");
      setSection(boundary);
      return;
    }

    if (nextIndex >= TOTAL) {
      setScreenMode("final");
      setSection(null);
      return;
    }

    setScreenMode("question");
    setSection(null);
    setIndex(nextIndex);
    window.setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function submit() {
    completeAndAdvance({ skipped: false });
  }

  function skip() {
    completeAndAdvance({ skipped: true });
  }

  function canJump(i: number) {
    const id = QUESTIONS[i]?.id;
    if (!id) return false;
    if (i === index && screenMode === "question") return true;

    const s = savedMap[id];
    return Boolean(s && (s.skipped || (s.answer && s.answer.trim())));
  }

  function isBoldIndex(i: number) {
    const id = QUESTIONS[i]?.id;
    if (!id) return false;
    return isAnswered(savedMap[id]);
  }

  function jumpTo(i: number) {
    if (!canJump(i)) return;

    // Record origin only when leaving a live question screen.
    if (screenMode === "question" && originIndexRef.current === null && i !== index) {
      originIndexRef.current = index;
    }

    stopListening();
    setIsListening(false);
    lastFinalRef.current = "";

    navIntentRef.current = "back_or_jump";
    setSection(null);
    setScreenMode("question");
    setIndex(i);

    window.setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function goBack() {
    stopListening();
    setIsListening(false);
    lastFinalRef.current = "";

    // If we're editing a jump-back question, "Back" should return to origin.
    if (originIndexRef.current !== null) {
      const origin = originIndexRef.current!;
      originIndexRef.current = null;

      navIntentRef.current = "back_or_jump";
      setSection(null);
      setScreenMode("question");
      setIndex(origin);
      return;
    }

    if (screenMode === "final") {
      navIntentRef.current = "back_or_jump";
      setScreenMode("question");
      setSection(null);
      setIndex(Math.max(0, TOTAL - 1));
      return;
    }

    if (screenMode === "section" && section) {
      const prevIndex = Math.max(0, section.nextIndex - 1);
      navIntentRef.current = "back_or_jump";
      setScreenMode("question");
      setSection(null);
      setIndex(prevIndex);
      return;
    }

    navIntentRef.current = "back_or_jump";
    setScreenMode("question");
    setSection(null);
    setIndex((prev) => Math.max(0, prev - 1));
  }

  function continueSection() {
    if (!section) return;

    stopListening();
    setIsListening(false);
    lastFinalRef.current = "";

    const finished = section.finished;

    if (finished === "skills") {
      setSection(null);
      setScreenMode("final");
      return;
    }

    navIntentRef.current = "forward";
    hardClearDraftForForward();

    setScreenMode("question");
    setIndex(section.nextIndex);
    setSection(null);

    window.setTimeout(() => textareaRef.current?.focus(), 50);
  }

  const screenKey =
    screenMode === "section"
      ? `section_${section?.finished ?? "x"}`
      : screenMode === "final"
        ? "final"
        : q.id;

  /* ============================================================
     Render
     ============================================================ */

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pt-10 pb-24">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-[120px]">
          <div className="text-sm font-semibold text-white/80">Everleap</div>
        </div>

        <div className="flex-1">
          <ProgressNumbers
            current={index}
            total={TOTAL}
            canJump={canJump}
            isBold={isBoldIndex}
            onJump={jumpTo}
          />
        </div>

        <div className="min-w-[120px] flex justify-end">
          <button
            type="button"
            onClick={goBack}
            className="text-sm font-semibold text-white/60 hover:text-white transition"
            aria-label="Back"
            title="Back"
          >
            Back
          </button>
        </div>
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
            {screenMode === "section" && section ? (
              <div className="flex min-h-[60svh] items-center">
                <div className="w-full max-w-3xl">
                  <div className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
                    Everleap · Story
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {sectionLabel(section.finished)} complete.
                  </h1>

                  <p className="mt-4 text-[15px] leading-7 text-white/65 max-w-2xl">
                    {sectionBody(section.finished)}
                  </p>

                  <MiniCelebrateLine />

                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={continueSection}
                      className="text-sm font-semibold text-white/85 hover:text-white transition"
                      aria-label="Continue"
                      title="Continue"
                    >
                      → Continue
                    </button>
                  </div>

                  <div className="mt-6 text-[11px] text-white/40">You can revise answers anytime.</div>
                </div>
              </div>
            ) : screenMode === "final" ? (
              <div className="flex min-h-[60svh] items-center">
                <div className="w-full max-w-3xl">
                  <div className="text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
                    Everleap
                  </div>

                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {firstName(name) ? `You did it, ${firstName(name)}.` : "You did it."}
                  </h1>

                  <p className="mt-6 text-[15px] leading-7 text-white/75">
                    {buildFinalSummary(savedMap)}
                  </p>

                  <MiniCelebrateLine />

                  <div className="mt-10">
                    <button
                      type="button"
                      onClick={() => router.push("/main/insights")}
                      className="text-sm font-semibold text-white/85 hover:text-white transition"
                      aria-label="See my insights"
                      title="See my insights"
                    >
                      → See my insights
                    </button>
                  </div>

                  <div className="mt-6 text-[11px] text-white/40">You can refine answers later.</div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[60svh] items-center">
                <div className="w-full">
                  <div className="max-w-3xl">
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {q.question}
                    </h1>
                  </div>

                  <div className="mt-7 w-full max-w-3xl">
                    <div className="flex items-end gap-3">
                      <div className="flex-1 border-b border-white/18 focus-within:border-white/40 transition">
                        <textarea
                          ref={textareaRef}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              submit();
                            }
                          }}
                          rows={2}
                          className="w-full resize-none bg-transparent py-3 text-[16px] leading-7 text-white/90 placeholder:text-white/30 outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={toggleMic}
                        disabled={!speechSupported}
                        className={`h-10 w-10 rounded-full border transition active:scale-95 ${
                          !speechSupported
                            ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                            : isListening
                              ? "border-white/35 bg-white/10 text-white"
                              : "border-white/18 bg-white/6 text-white/80 hover:bg-white/10"
                        }`}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                        title={
                          !speechSupported
                            ? "Voice not supported"
                            : isListening
                              ? "Listening…"
                              : "Voice input"
                        }
                      >
                        {isListening ? <MicOff className="mx-auto h-4 w-4" /> : <Mic className="mx-auto h-4 w-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={submit}
                        disabled={!draft.trim()}
                        className={`h-10 w-10 rounded-full transition active:scale-95 ${
                          draft.trim()
                            ? "bg-white/80 text-black hover:bg-white"
                            : "bg-white/10 text-white/35 cursor-not-allowed"
                        }`}
                        aria-label="Send"
                        title="Send"
                      >
                        <Send className="mx-auto h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm text-white/60">
                      <button type="button" onClick={skip} className="hover:text-white/80 transition">
                        I’m not sure
                      </button>
                      <button type="button" onClick={skip} className="hover:text-white/80 transition">
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
