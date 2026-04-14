"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic } from "lucide-react";
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
   Typography
   ============================================================ */

const TYPE = {
  headline:
    "text-[1.42rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[1.68rem]",
  input: "text-[14px] font-medium leading-6 text-white",
};

/* ============================================================
   Questions
   ============================================================ */

const MOTIVATIONS_5 = [
  "What usually gives you energy during the day?",
  "When do you feel most focused?",
  "What drains you faster than it should?",
  "What do you naturally get curious about?",
  "What does a good day look like for you?",
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
  "What kind of tasks do you avoid even when you know they matter?",
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

function isAnswered(saved: Saved | undefined): boolean {
  if (!saved) return false;
  if (saved.skipped) return true;
  return typeof saved.answer === "string" && saved.answer.trim().length > 0;
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

  return tryRead(ONBOARDING_KEY_FALLBACK);
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
   Visual helpers
   ============================================================ */

function visualToneForCategory(category: Category) {
  if (category === "motivations") {
    return {
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  if (category === "strengths") {
    return {
      dotDone: "bg-cyan-300/85",
      dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
    };
  }

  return {
    dotDone: "bg-cyan-300/85",
    dotActive: "bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)]",
  };
}

/* ============================================================
   UI atoms
   ============================================================ */

function BottomLink({
  label,
  onClick,
  disabled,
  muted = false,
  priority = "secondary",
  arrow = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  muted?: boolean;
  priority?: "primary" | "secondary";
  arrow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex items-center gap-2 transition",
        priority === "primary"
          ? "text-[15px] font-semibold"
          : "text-[14px] font-semibold tracking-[0.01em]",
        disabled
          ? "cursor-not-allowed text-white/24"
          : muted
            ? "text-white/50 hover:text-white/74"
            : priority === "primary"
              ? "text-white hover:text-white"
              : "text-white/90 hover:text-white",
      ].join(" ")}
    >
      <span>{label}</span>
      {arrow ? (
        <span aria-hidden="true" className="text-[17px]">
          →
        </span>
      ) : null}
    </button>
  );
}

function TalkAction({
  active,
  onClick,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "inline-flex items-center gap-2 transition",
        disabled
          ? "cursor-not-allowed text-white/24"
          : active
            ? "text-cyan-100 drop-shadow-[0_0_16px_rgba(103,232,249,0.24)]"
            : "text-white/72 hover:text-white",
      ].join(" ")}
    >
      <span className="relative inline-flex items-center">
        {active ? (
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.65)]" />
        ) : null}
        <Mic className={["h-[18px] w-[18px] transition", active ? "scale-[1.08]" : ""].join(" ")} />
      </span>
      <span className="text-[15px] font-semibold tracking-[0.01em]">
        {active ? "Listening" : "Talk"}
      </span>
    </button>
  );
}

function ProgressDots({
  currentIndex,
  total,
  tone,
}: {
  currentIndex: number;
  total: number;
  tone: ReturnType<typeof visualToneForCategory>;
}) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <span
            key={index}
            className={[
              "block rounded-full transition-all duration-300",
              isActive ? "h-2.5 w-2.5" : "h-2 w-2",
              isActive
                ? tone.dotActive
                : isDone
                  ? tone.dotDone
                  : "bg-white/20",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

function QuestionTextEntry({
  value,
  onChange,
  onSubmit,
  placeholder,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        rows={3}
        placeholder={placeholder ?? ""}
        className={[
          TYPE.input,
          "w-full resize-none rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))] px-4 py-2.5 outline-none placeholder:text-white/34 shadow-[0_10px_30px_rgba(4,8,18,0.22)]",
        ].join(" ")}
      />
    </div>
  );
}

function QuestionFlat({
  title,
  children,
  currentIndex,
  total,
  categoryLabel,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  currentIndex: number;
  total: number;
  categoryLabel: string;
  tone: ReturnType<typeof visualToneForCategory>;
}) {
  return (
    <div className="w-full max-w-[720px]">
      <div className="flex items-start justify-end gap-4">
        <div className="flex items-center gap-3">
          <div className="text-[12px] leading-none text-white/54">{categoryLabel}</div>
          <ProgressDots currentIndex={currentIndex} total={total} tone={tone} />
        </div>
      </div>

      <div className="mt-5">
        <h1 className={TYPE.headline}>{title}</h1>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

/* ============================================================
   Component
   ============================================================ */

export default function QuestionFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const category = normalizeCategory(params?.get("cat"));
  const categoryLabel = labelForCategory(category);
  const returnTo = safeReturnTo(params?.get("returnTo"));
  const questionIdParam = params?.get("questionId");

  const questions = React.useMemo(
    () => QUESTIONS_ALL.filter((q) => q.category === category),
    [category]
  );

  const total = questions.length;

  const initialIndex = React.useMemo(() => {
    if (!questionIdParam) return 0;
    const found = questions.findIndex((q) => q.id === questionIdParam);
    return found >= 0 ? found : 0;
  }, [questionIdParam, questions]);

  const [name, setName] = React.useState("");
  const [index, setIndex] = React.useState(initialIndex);
  const [draft, setDraft] = React.useState("");

  const q = questions[index] ?? questions[0];
  const qId = q?.id ?? "";

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const focusAnswer = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    try {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
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

  React.useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  React.useEffect(() => {
    setName(readNameFromOnboarding());
  }, []);

  React.useEffect(() => {
    const SpeechRec = (window.SpeechRecognition ?? window.webkitSpeechRecognition) as
      | SpeechRecognitionConstructor
      | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

  React.useEffect(() => {
    if (!qId) return;
    stopListening();
    lastFinalRef.current = "";
    const s = loadSaved()[qId];
    setDraft((s?.answer ?? "").trim());
    window.setTimeout(() => focusAnswer(), 0);
  }, [qId, stopListening, focusAnswer]);

  React.useEffect(() => {
    if (total === 0) router.push(returnTo);
  }, [total, router, returnTo]);

  function exitNow() {
    stopListening();
    router.push(returnTo);
  }

  function goBackOne() {
    if (index <= 0) return;
    stopListening();
    setIndex((i) => Math.max(0, i - 1));
  }

  function findNextUnansweredIndex(startFromExclusive: number): number {
    const saved = loadSaved();

    for (let i = startFromExclusive + 1; i < questions.length; i += 1) {
      if (!isAnswered(saved[questions[i]?.id])) {
        return i;
      }
    }

    for (let i = 0; i < questions.length; i += 1) {
      if (!isAnswered(saved[questions[i]?.id])) {
        return i;
      }
    }

    return -1;
  }

  function advanceToNext() {
    const nextUnansweredIndex = findNextUnansweredIndex(index);

    if (nextUnansweredIndex >= 0) {
      setIndex(nextUnansweredIndex);
      window.setTimeout(() => focusAnswer(), 50);
      return;
    }

    stopListening();
    router.push(returnTo);
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
    stopListening();
    setDraft("");
    advanceToNext();
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

  const screenKey = qId || "q";
  const tone = visualToneForCategory(category);
  const greetingName = firstName(name);

  return (
    <div className="relative flex min-h-[calc(100svh-5.75rem)] flex-1 flex-col supports-[height:100dvh]:min-h-[calc(100dvh-5.75rem)]">
      <div className="flex flex-1 items-start justify-center px-[20px] pt-[30px] pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 20, scale: 0.992, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, scale: 0.994, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
            className="w-full max-w-[720px]"
          >
            <QuestionFlat
              title={q?.question ?? ""}
              tone={tone}
              currentIndex={index}
              total={total}
              categoryLabel={categoryLabel}
            >
              <QuestionTextEntry
                value={draft}
                onChange={setDraft}
                onSubmit={() => completeAndAdvance({ skipped: false })}
                placeholder={
                  greetingName && index === 0
                    ? `Start anywhere, ${greetingName}.`
                    : "Start anywhere."
                }
                textareaRef={textareaRef}
              />

              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3">
                  {index > 0 ? (
                    <BottomLink
                      label="Back"
                      onClick={goBackOne}
                      muted
                    />
                  ) : null}

                  <BottomLink
                    label="Skip"
                    onClick={() => completeAndAdvance({ skipped: true })}
                    muted
                  />

                  <TalkAction
                    active={isListening}
                    onClick={toggleMic}
                    disabled={!speechSupported}
                  />

                  <BottomLink
                    label="Continue"
                    onClick={() => completeAndAdvance({ skipped: false })}
                    disabled={!draft.trim()}
                    priority="primary"
                    arrow
                  />
                </div>

                <div className="mt-5">
                  <BottomLink
                    label="Exit"
                    onClick={exitNow}
                    muted
                  />
                </div>
              </div>
            </QuestionFlat>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}