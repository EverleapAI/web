"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Check,
  Mic,
  MicOff,
  Send,
  ArrowLeft,
  X,
} from "lucide-react";
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
   Questions
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
   Visual system
   ============================================================ */

function visualThemeForCategory(category: Category) {
  if (category === "motivations") {
    return {
      pageOrbA: "bg-amber-300/26",
      pageOrbB: "bg-orange-400/20",
      pageOrbC: "bg-pink-400/12",
      pageWash:
        "bg-[radial-gradient(circle_at_18%_24%,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_72%_30%,rgba(249,115,22,0.12),transparent_24%),radial-gradient(circle_at_55%_82%,rgba(244,114,182,0.08),transparent_24%)]",
      cardTintA: "from-white/[0.05] via-white/[0.02] to-transparent",
      cardTintB: "from-amber-200/[0.05] via-orange-200/[0.025] to-transparent",
      edge: "from-amber-200/24 via-white/10 to-transparent",
      cardGlow: "shadow-[0_0_90px_rgba(251,191,36,0.10)]",
      accentGlow:
        "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),rgba(251,191,36,0.06)_40%,transparent_70%)]",
      inputGlow:
        "focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_36px_rgba(251,191,36,0.10)]",
      badge: "from-amber-300/16 to-orange-200/10",
      inputBg: "bg-black/18",
      cardBg: "bg-[rgba(14,16,26,0.72)]",
    };
  }

  if (category === "strengths") {
    return {
      pageOrbA: "bg-cyan-300/24",
      pageOrbB: "bg-sky-400/18",
      pageOrbC: "bg-teal-300/12",
      pageWash:
        "bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.12),transparent_25%),radial-gradient(circle_at_74%_32%,rgba(56,189,248,0.11),transparent_24%),radial-gradient(circle_at_60%_84%,rgba(45,212,191,0.08),transparent_22%)]",
      cardTintA: "from-white/[0.05] via-white/[0.02] to-transparent",
      cardTintB: "from-cyan-200/[0.05] via-sky-200/[0.025] to-transparent",
      edge: "from-cyan-200/22 via-white/10 to-transparent",
      cardGlow: "shadow-[0_0_90px_rgba(34,211,238,0.10)]",
      accentGlow:
        "bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.20),rgba(34,211,238,0.06)_40%,transparent_70%)]",
      inputGlow:
        "focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_36px_rgba(34,211,238,0.10)]",
      badge: "from-cyan-300/16 to-sky-200/10",
      inputBg: "bg-black/18",
      cardBg: "bg-[rgba(12,16,26,0.72)]",
    };
  }

  return {
    pageOrbA: "bg-violet-300/22",
    pageOrbB: "bg-fuchsia-400/16",
    pageOrbC: "bg-indigo-300/12",
    pageWash:
      "bg-[radial-gradient(circle_at_16%_24%,rgba(167,139,250,0.12),transparent_26%),radial-gradient(circle_at_76%_28%,rgba(217,70,239,0.10),transparent_22%),radial-gradient(circle_at_58%_84%,rgba(129,140,248,0.08),transparent_24%)]",
    cardTintA: "from-white/[0.05] via-white/[0.02] to-transparent",
    cardTintB: "from-violet-200/[0.05] via-fuchsia-200/[0.025] to-transparent",
    edge: "from-violet-200/22 via-white/10 to-transparent",
    cardGlow: "shadow-[0_0_90px_rgba(167,139,250,0.10)]",
    accentGlow:
      "bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.20),rgba(192,132,252,0.06)_40%,transparent_70%)]",
    inputGlow:
      "focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_36px_rgba(167,139,250,0.10)]",
    badge: "from-violet-300/16 to-fuchsia-200/10",
    inputBg: "bg-black/18",
    cardBg: "bg-[rgba(12,14,26,0.72)]",
  };
}

/* ============================================================
   UI atoms
   ============================================================ */

function PauseLine({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0.92 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-hidden="true"
      className="mt-8 origin-left"
    >
      <div className="h-px w-44 rounded-full bg-gradient-to-r from-white/26 via-white/12 to-transparent" />
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
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

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
    setPickerOpen(false);
    window.setTimeout(() => focusAnswer(), 50);
  }, [category, focusAnswer]);

  React.useEffect(() => {
    if (!qId || screenMode !== "question") return;
    stopListening();
    lastFinalRef.current = "";
    const s = loadSaved()[qId];
    setDraft((s?.answer ?? "").trim());
    setPickerOpen(false);
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
  const theme = React.useMemo(() => visualThemeForCategory(category), [category]);

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

  function goBackOne() {
    if (screenMode !== "question") return;
    if (index <= 0) return;
    stopListening();
    setPickerOpen(false);
    setIndex((i) => Math.max(0, i - 1));
  }

  function jumpToQuestion(targetIndex: number) {
    if (screenMode !== "question") return;
    if (targetIndex < 0 || targetIndex >= total) return;
    stopListening();
    setPickerOpen(false);
    setIndex(targetIndex);
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
      setPickerOpen(false);
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
    <div className="relative mx-auto w-full max-w-[940px] px-4 pb-24 pt-1 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${theme.pageWash}`} />
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-[12%] top-[10%] h-[16rem] w-[16rem] rounded-full blur-3xl ${theme.pageOrbA}`}
        />
        <motion.div
          animate={{ x: [0, -16, 0], y: [0, 16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute right-[10%] top-[22%] h-[15rem] w-[15rem] rounded-full blur-3xl ${theme.pageOrbB}`}
        />
        <motion.div
          animate={{ x: [0, 12, 0], y: [0, 12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[14%] right-[18%] h-[12rem] w-[12rem] rounded-full blur-3xl ${theme.pageOrbC}`}
        />
        <div className="absolute inset-x-0 top-[18%] h-48 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100svh-8.25rem)] flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 16, scale: 0.992 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex flex-1 items-center justify-center"
          >
            {screenMode === "final" ? (
              <div className="w-full max-w-3xl">
                <div
                  className={[
                    "relative overflow-hidden rounded-[30px] border border-white/10",
                    theme.cardBg,
                    "px-5 py-6 sm:px-7 sm:py-8",
                    "backdrop-blur-xl",
                    theme.cardGlow,
                  ].join(" ")}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.cardTintA}`} />
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${theme.cardTintB}`} />
                  <div className={`pointer-events-none absolute -right-16 top-6 h-52 w-52 rounded-full blur-3xl ${theme.accentGlow}`} />
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${theme.edge}`} />
                  <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_52%)]" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={exitNow}
                        className="inline-flex items-center gap-2 text-[13px] font-medium text-white/62 transition hover:text-white/86"
                      >
                        <X size={14} />
                        <span>Exit</span>
                      </button>

                      <div
                        className={`rounded-full border border-white/10 bg-gradient-to-r ${theme.badge} px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/54`}
                      >
                        {categoryLabel}
                      </div>
                    </div>

                    <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-white/44">
                      Reflection complete
                    </p>

                    <h1 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-[2.5rem]">
                      That gives us something real
                      {firstName(name) ? `, ${firstName(name)}` : ""}.
                    </h1>

                    <div className="mt-5 space-y-4">
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
                            ? "text-white/88 hover:text-white"
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
              <div className="w-full max-w-3xl">
                <div
                  className={[
                    "relative overflow-hidden rounded-[30px] border border-white/10",
                    theme.cardBg,
                    "px-5 py-5 sm:px-7 sm:py-6",
                    "backdrop-blur-xl",
                    theme.cardGlow,
                  ].join(" ")}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.cardTintA}`} />
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${theme.cardTintB}`} />
                  <motion.div
                    aria-hidden="true"
                    animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className={`pointer-events-none absolute -right-20 top-2 h-52 w-52 rounded-full blur-3xl ${theme.accentGlow}`}
                  />
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${theme.edge}`} />
                  <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_52%)]" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={exitNow}
                          className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-[13px] font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white/86"
                        >
                          <X size={14} />
                          <span>Exit</span>
                        </button>

                        <button
                          type="button"
                          onClick={index > 0 ? goBackOne : undefined}
                          disabled={index <= 0}
                          className={[
                            "inline-flex items-center gap-2 rounded-full px-2 py-1 text-[13px] font-medium transition",
                            index > 0
                              ? "text-white/60 hover:bg-white/[0.05] hover:text-white/86"
                              : "cursor-not-allowed text-white/24",
                          ].join(" ")}
                        >
                          <ArrowLeft size={14} />
                          <span>Back</span>
                        </button>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setPickerOpen((v) => !v)}
                          className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-gradient-to-r ${theme.badge} px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/60 transition hover:text-white/82`}
                          aria-expanded={pickerOpen}
                          aria-haspopup="dialog"
                        >
                          <span>
                            {categoryLabel} {index + 1}/{total}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition ${pickerOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {pickerOpen ? (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.98 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              className="absolute right-0 top-[calc(100%+0.55rem)] z-20 w-[min(20rem,78vw)] overflow-hidden rounded-[22px] border border-white/10 bg-[#090d18]/95 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                            >
                              <div className="px-4 pb-2 pt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/34">
                                Jump to a question
                              </div>

                              <div className="max-h-[min(26rem,60vh)] overflow-y-auto px-2 pb-2">
                                <div className="space-y-1">
                                  {questions.map((item, i) => {
                                    const done = isDoneDash(i);
                                    const current = i === index;

                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => jumpToQuestion(i)}
                                        className={[
                                          "flex w-full items-start gap-3 rounded-[16px] px-3 py-2.5 text-left transition",
                                          current
                                            ? "bg-white/[0.09] text-white"
                                            : "text-white/70 hover:bg-white/[0.05] hover:text-white/90",
                                        ].join(" ")}
                                      >
                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[11px] font-semibold text-white/72">
                                          {done ? <Check size={12} /> : i + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="text-[13px] leading-5">
                                            {item.question}
                                          </div>
                                          <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/34">
                                            {current ? "Current" : done ? "Answered" : "Open"}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-6 max-w-[44rem]">
                      <h1 className="text-[2.05rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-[2.7rem]">
                        {q?.question}
                      </h1>
                    </div>

                    <div className="mt-6">
                      <div
                        className={[
                          "group relative overflow-hidden rounded-[24px] border border-white/8 transition",
                          theme.inputBg,
                          theme.inputGlow,
                          isFocused ? "border-white/12" : "border-white/8",
                        ].join(" ")}
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_48%)]" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/12 via-white/8 to-transparent" />
                        <textarea
                          ref={textareaRef}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              completeAndAdvance({ skipped: false });
                            }
                          }}
                          rows={4}
                          placeholder="Start anywhere."
                          className="relative min-h-[172px] w-full resize-none bg-transparent px-4 py-4 text-[17px] leading-7 text-white/92 outline-none placeholder:text-white/24 sm:px-5 sm:py-5"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={toggleMic}
                        disabled={!speechSupported}
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-sm transition",
                          speechSupported
                            ? "text-white/56 hover:bg-white/[0.05] hover:text-white/84"
                            : "cursor-not-allowed text-white/24",
                        ].join(" ")}
                        aria-label={isListening ? "Stop voice input" : "Start voice input"}
                      >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        <span>{isListening ? "Listening…" : "Speak"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => completeAndAdvance({ skipped: false })}
                        disabled={!draft.trim()}
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition",
                          draft.trim()
                            ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-white/92"
                            : "cursor-not-allowed bg-white/14 text-white/34",
                        ].join(" ")}
                      >
                        <span>Continue</span>
                        <Send size={15} />
                      </button>
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