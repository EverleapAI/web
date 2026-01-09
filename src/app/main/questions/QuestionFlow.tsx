"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";

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

const TOTAL = 15;

// Bump key so we can ignore/clear old data.
const STORAGE_KEY_V1 = "everleap.story.answers.v1";
const STORAGE_KEY = "everleap.story.answers.v2";
const RESET_FLAG = "everleap.story.reset.v2.session";

const ONBOARDING_KEY = "everleapOnboarding_v1"; // for name (if present)
const TYPE_SPEED_MS = 28;

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

/** same heuristic you used elsewhere */
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
   Typing hook
   ============================================================ */

function useTypewriter(text: string, speedMs: number, enabled: boolean) {
  const [out, setOut] = React.useState("");

  React.useEffect(() => {
    if (!enabled) {
      setOut(text);
      return;
    }

    let cancelled = false;
    let i = 0;
    setOut("");

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setOut(text.slice(0, i));
      if (i < text.length) window.setTimeout(tick, speedMs);
    };

    const t = window.setTimeout(tick, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [text, speedMs, enabled]);

  const done = out.length >= text.length;
  return { typed: out, done };
}

/* ============================================================
   Copy helpers
   ============================================================ */

function buildRetryBranchPrompt(name?: string) {
  const n = (name ?? "").trim();
  return n
    ? `Hmm, ${n} — I didn’t quite catch that.\n\nTry one real sentence (even short). What’s a true answer for you?`
    : "Hmm — I didn’t quite catch that.\n\nTry one real sentence (even short). What’s a true answer for you?";
}

function buildSkipBranchPrefix(name?: string) {
  const n = (name ?? "").trim();
  return n ? `All good, ${n}. Next one:` : "All good. Next one:";
}

function sectionTitle(cat: Category) {
  if (cat === "motivations") return "Motivations";
  if (cat === "strengths") return "Strengths";
  return "Skills";
}

function nextSectionTitle(finished: Category) {
  if (finished === "motivations") return "Strengths";
  if (finished === "strengths") return "Skills";
  return "Insights";
}

function sectionCongratsHeadline(finished: Category, name?: string) {
  const n = (name ?? "").trim();
  const base =
    finished === "motivations"
      ? "Motivations complete"
      : finished === "strengths"
        ? "Strengths complete"
        : "Skills complete";
  return n ? `Nice work, ${n}. ${base}.` : `Nice work. ${base}.`;
}

function sectionCongratsBody(finished: Category) {
  if (finished === "motivations") return "Next up: Strengths. This helps us understand what pulls you forward.";
  if (finished === "strengths") return "Next up: Skills. This helps us spot where you’ll grow the fastest.";
  return "You’re done. Next we’ll show a few early insights from what you shared.";
}

/* ============================================================
   Badge UI helpers
   ============================================================ */

const BADGES: Array<{
  id: Category;
  label: string;
  imgSrc: string;
  startIdx: number; // 0-based
  endIdx: number; // 0-based
}> = [
  { id: "motivations", label: "Motivations", imgSrc: "/motivations.png", startIdx: 0, endIdx: 4 },
  { id: "strengths", label: "Strengths", imgSrc: "/strengths.png", startIdx: 5, endIdx: 9 },
  { id: "skills", label: "Skills", imgSrc: "/skills.png", startIdx: 10, endIdx: 14 },
];

function countAnswered(saved: Record<string, Saved>, startIdx: number, endIdx: number) {
  let c = 0;
  for (let i = startIdx; i <= endIdx; i += 1) {
    const id = `q_${i + 1}`;
    const s = saved[id];
    if (s?.answer && s.answer.trim()) c += 1;
  }
  return c;
}

function findBadge(cat: Category) {
  return BADGES.find((b) => b.id === cat) ?? BADGES[0];
}

/* ============================================================
   Component
   ============================================================ */

type PromptStyle = "normal" | "branch";
type InterstitialState =
  | null
  | {
      kind: "section";
      finished: Category; // motivations or strengths
    };

export default function QuestionFlow() {
  const router = useRouter();

  const [name, setName] = React.useState("");

  const [index, setIndex] = React.useState(0);

  // draft answer
  const [draft, setDraft] = React.useState("");

  // branch styling / prefix (comment + question)
  const [promptStyle, setPromptStyle] = React.useState<PromptStyle>("normal");
  const [branchPrefix, setBranchPrefix] = React.useState<string | null>(null);

  // a temporary “branch prompt” override (used for retry after garbage)
  const [overridePrompt, setOverridePrompt] = React.useState<string | null>(null);

  // hydration-safe localStorage state (prevents mismatch)
  const [mounted, setMounted] = React.useState(false);
  const [liveSaved, setLiveSaved] = React.useState<Record<string, Saved>>({});

  // interstitial screens between sections
  const [interstitial, setInterstitial] = React.useState<InterstitialState>(null);

  // final completion screen
  const [flowDone, setFlowDone] = React.useState(false);

  // speech
  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(true);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastFinalRef = React.useRef<string>("");

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const q = QUESTIONS[index] ?? QUESTIONS[0];

  React.useEffect(() => {
    setName(readNameFromOnboarding());
  }, []);

  // Reset local data ONCE per session (ignore old v1 + clear v2)
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

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const refresh = () => setLiveSaved(loadSaved());
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [mounted, index]);

  // hydrate draft when question changes (blank unless previously answered)
  React.useEffect(() => {
    const s = loadSaved()[q.id];
    if (s?.answer) setDraft(s.answer);
    else setDraft("");
    lastFinalRef.current = "";
  }, [q.id]);

  // speech supported
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    setSpeechSupported(Boolean(SpeechRec));
  }, []);

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

  function getOrCreateRecognition(): SpeechRecognition | null {
    if (typeof window === "undefined") return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRec =
      (window.SpeechRecognition ?? window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    if (!SpeechRec) return null;

    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      // Only commit final chunks; do not show interim text at all.
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

  function stopListening() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }

  function toggleMic() {
    textareaRef.current?.focus();
    setDraft("");
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

  function goToIndex(nextIndex: number, opts?: { branch?: boolean; prefix?: string | null }) {
    setOverridePrompt(null);

    setIndex(() => {
      if (nextIndex >= TOTAL) return TOTAL - 1;
      return Math.max(0, nextIndex);
    });

    const branch = Boolean(opts?.branch);
    setPromptStyle(branch ? "branch" : "normal");
    setBranchPrefix(branch ? opts?.prefix ?? null : null);
  }

  function submit() {
    const text = draft.trim();
    if (!text) return;

    if (!isMeaningfulText(text)) {
      setDraft("");
      stopListening();
      setPromptStyle("branch");
      setBranchPrefix(null);
      setOverridePrompt(buildRetryBranchPrompt(name));
      textareaRef.current?.focus();
      return;
    }

    saveOne(q.id, { answer: text, skipped: false });
    stopListening();

    const updatedSaved = loadSaved();
    if (mounted) setLiveSaved(updatedSaved);

    const next = index + 1;

    // Finished all 15
    if (next >= TOTAL) {
      setFlowDone(true);
      return;
    }

    // Interstitial at section boundaries: after q5 (index 4) -> next index 5; after q10 (index 9) -> next 10
    if (next === 5) {
      // Move index forward (so badges/dots reflect completion), then show interstitial.
      goToIndex(next, { branch: false, prefix: null });
      setInterstitial({ kind: "section", finished: "motivations" });
      return;
    }
    if (next === 10) {
      goToIndex(next, { branch: false, prefix: null });
      setInterstitial({ kind: "section", finished: "strengths" });
      return;
    }

    // normal next
    goToIndex(next, { branch: false, prefix: null });
    textareaRef.current?.focus();
  }

  function skip() {
    saveOne(q.id, { answer: undefined, skipped: true });
    stopListening();

    if (mounted) setLiveSaved(loadSaved());

    const next = index + 1;

    if (next >= TOTAL) {
      setFlowDone(true);
      return;
    }

    // If they skip across a boundary, still show the interstitial.
    if (next === 5) {
      goToIndex(next, { branch: true, prefix: buildSkipBranchPrefix(name) });
      setInterstitial({ kind: "section", finished: "motivations" });
      return;
    }
    if (next === 10) {
      goToIndex(next, { branch: true, prefix: buildSkipBranchPrefix(name) });
      setInterstitial({ kind: "section", finished: "strengths" });
      return;
    }

    goToIndex(next, { branch: true, prefix: buildSkipBranchPrefix(name) });
  }

  // Badge progress (hydration-safe)
  const badgeStats = BADGES.map((b) => {
    const source = mounted ? liveSaved : {};
    const answered = countAnswered(source, b.startIdx, b.endIdx);
    const total = b.endIdx - b.startIdx + 1; // always 5
    return {
      ...b,
      answered,
      total,
      done: answered >= total,
      active: q.category === b.id,
    };
  });

  // Prompt text (either retry override, or branch prefix + question, or plain question)
  const baseQuestion = q.question;
  const promptText =
    overridePrompt ?? (branchPrefix ? `${branchPrefix}\n\n${baseQuestion}` : baseQuestion);

  const { typed } = useTypewriter(promptText, TYPE_SPEED_MS, true);

  const isBranchStyled = promptStyle === "branch" || Boolean(overridePrompt);

  const questionClass = isBranchStyled
    ? "text-center text-2xl font-semibold tracking-tight text-sky-100 sm:text-3xl"
    : "text-center text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl";

  const pillClass =
    "mx-auto mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/60";

  /* =========================
     Interstitial screen
     ========================= */

  if (interstitial?.kind === "section") {
    const finished = interstitial.finished;
    const finishedBadge = findBadge(finished);

    return (
      <div className="relative min-h-[100svh]">
        <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

        <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl">
            <div className="relative rounded-[44px] border border-white/10 bg-slate-950/35 p-[1px] shadow-[0_45px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="relative rounded-[43px] bg-slate-950/35 px-6 py-10 sm:px-10 sm:py-12">
                <div className={pillClass}>{sectionTitle(finished)} Complete</div>

                {/* Badge image (styled as a "nice" badge) */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative">
                    {/* glow */}
                    <div className="pointer-events-none absolute inset-0 -z-10 scale-[1.25] rounded-[40px] bg-gradient-to-r from-sky-400/25 via-fuchsia-500/20 to-amber-300/20 blur-2xl" />
                    <div className="relative h-40 w-40 overflow-hidden rounded-[40px] border border-white/12 bg-slate-950/40 shadow-[0_0_70px_rgba(56,189,248,0.18)] backdrop-blur-xl sm:h-44 sm:w-44">
                      <Image
                        src={finishedBadge.imgSrc}
                        alt={`${finishedBadge.label} badge`}
                        fill
                        sizes="176px"
                        className="object-contain p-6"
                        priority
                      />
                      <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-400/90 px-2.5 py-1 text-[0.7rem] font-extrabold text-slate-950">
                        ✓ <span className="font-bold">DONE</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="mt-7 text-center text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  {sectionCongratsHeadline(finished, name)}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-center text-sm text-slate-200/70">
                  {sectionCongratsBody(finished)}
                </p>

                {/* subtle “what’s next” */}
                <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <Sparkles className="h-4 w-4 text-sky-200/80" />
                  <span>
                    Up next: <span className="font-semibold text-white/85">{nextSectionTitle(finished)}</span>
                  </span>
                </div>

                <div className="mt-8 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setInterstitial(null);
                      setPromptStyle("normal");
                      setBranchPrefix(null);
                      setOverridePrompt(null);
                      // focus input on next paint
                      window.setTimeout(() => textareaRef.current?.focus(), 50);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(56,189,248,0.35)] transition active:scale-[0.98] hover:bg-sky-200"
                  >
                    Continue
                  </button>
                </div>

                <div className="mt-6 text-center text-[0.7rem] text-slate-200/55">
                  You can change answers later.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Final completion screen
     ========================= */

  if (flowDone) {
    const n = name?.trim();
    return (
      <div className="relative min-h-[100svh]">
        <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

        <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl">
            <div className="relative rounded-[44px] border border-white/10 bg-slate-950/35 p-[1px] shadow-[0_45px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="relative rounded-[43px] bg-slate-950/35 px-6 py-10 sm:px-10 sm:py-12">
                <div className={pillClass}>All Set</div>

                <div className="mt-6 flex items-center justify-center">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-0 -z-10 scale-[1.35] rounded-[44px] bg-gradient-to-r from-sky-400/25 via-fuchsia-500/20 to-amber-300/20 blur-2xl" />
                    <div className="relative h-44 w-44 overflow-hidden rounded-[44px] border border-white/12 bg-slate-950/40 shadow-[0_0_80px_rgba(56,189,248,0.16)] backdrop-blur-xl">
                      <Image
                        src="/skills.png"
                        alt="Completion badge"
                        fill
                        sizes="176px"
                        className="object-contain p-7"
                        priority
                      />
                      <div className="absolute right-3 top-3 rounded-full bg-emerald-400/90 px-2.5 py-1 text-[0.7rem] font-extrabold text-slate-950">
                        ✓ DONE
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="mt-7 text-center text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  {n ? `Nice work, ${n}.` : "Nice work."} You finished your Story check-in.
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-center text-sm text-slate-200/70">
                  Next, we’ll show a few early insights we can infer from what you shared.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => router.push("/main/insights")}
                    className="inline-flex items-center justify-center rounded-2xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(56,189,248,0.35)] transition active:scale-[0.98] hover:bg-sky-200"
                  >
                    See my insights
                  </button>
                </div>

                <div className="mt-6 text-center text-[0.7rem] text-slate-200/55">
                  You can always refine answers later.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     Main question UI
     ========================= */

  return (
    <div className="relative min-h-[100svh]">
      {/* soft funnel tint */}
      <div className="pointer-events-none absolute inset-0 bg-slate-950/10" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          <div className="relative rounded-[44px] border border-white/10 bg-slate-950/35 p-[1px] shadow-[0_45px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="relative rounded-[43px] bg-slate-950/35 px-6 py-10 sm:px-10 sm:py-12">
              {/* Badges row (visual only; linear flow) */}
              <div className="mb-8 flex items-center justify-center gap-6">
                {badgeStats.map((b) => {
                  return (
                    <div
                      key={b.id}
                      className={`relative flex flex-col items-center gap-2 ${b.active ? "" : "opacity-80"}`}
                      aria-label={b.label}
                      title={b.label}
                    >
                      <div
                        className={`relative h-20 w-20 overflow-hidden rounded-2xl border shadow-sm backdrop-blur-xl ${
                          b.active
                            ? "border-sky-300/60 bg-slate-950/40 shadow-[0_0_55px_rgba(56,189,248,0.25)]"
                            : "border-white/10 bg-slate-950/35"
                        }`}
                      >
                        <Image
                          src={b.imgSrc}
                          alt={b.label}
                          fill
                          sizes="80px"
                          className="object-contain p-3"
                          priority={b.active}
                        />

                        {b.done ? (
                          <div className="absolute right-2 top-2 rounded-full bg-emerald-400/90 px-2 py-0.5 text-[0.65rem] font-bold text-slate-950">
                            ✓
                          </div>
                        ) : null}
                      </div>

                      <div className="text-xs font-medium text-white/70">{b.label}</div>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: b.total }).map((_, i) => {
                          const on = i < b.answered;
                          const current = i === Math.min(b.answered, b.total - 1);
                          return (
                            <span
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                on ? "bg-sky-300" : "bg-white/10"
                              } ${current ? "ring-2 ring-sky-300/30" : ""}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prompt */}
              <div className="flex flex-col items-center">
                <div className={pillClass}>Your Story</div>

                <h1 className={questionClass}>
                  {typed}
                  <span className="ml-1 inline-block h-[1em] w-[0.55ch] translate-y-[0.08em] animate-pulse rounded-sm bg-white/40" />
                </h1>

                {/* Mic under the prompt */}
                <div className="mt-7 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={!speechSupported}
                    className={`
                      inline-flex h-12 w-12 items-center justify-center rounded-full border
                      transition active:scale-95
                      ${
                        isListening
                          ? "border-rose-300/80 bg-rose-500/20 text-rose-100 shadow-[0_0_38px_rgba(244,63,94,0.35)]"
                          : "border-sky-300/70 bg-slate-900/40 text-slate-100 shadow-[0_0_34px_rgba(56,189,248,0.22)] hover:bg-slate-900/55"
                      }
                      ${!speechSupported ? "opacity-40 cursor-not-allowed" : ""}
                    `}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    title={!speechSupported ? "Voice not supported" : isListening ? "Listening…" : "Talk instead of typing"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>

                {/* Input bubble */}
                <div className="mt-8 w-full max-w-3xl">
                  <div className="relative rounded-[34px] bg-gradient-to-r from-sky-400/70 via-fuchsia-500/65 to-amber-300/65 p-[1px]">
                    <div className="relative flex items-end gap-3 rounded-[34px] bg-slate-950/65 px-4 py-4 sm:px-6 sm:py-5">
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
                        rows={3}
                        placeholder=""
                        className="
                          min-h-[84px] flex-1 resize-none bg-transparent
                          text-base text-slate-50 placeholder:text-slate-400/70
                          outline-none
                        "
                      />

                      <div className="flex items-center gap-2 pb-1">
                        <button
                          type="button"
                          onClick={submit}
                          disabled={!draft.trim()}
                          className={`
                            inline-flex h-11 w-11 items-center justify-center rounded-full
                            transition active:scale-95
                            ${
                              draft.trim()
                                ? "bg-sky-300 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200"
                                : "bg-white/10 text-slate-200/50 cursor-not-allowed"
                            }
                          `}
                          aria-label="Submit"
                          title="Submit"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-center gap-10 text-sm text-slate-200/60">
                    <button type="button" onClick={skip} className="hover:text-slate-100">
                      I’m not sure
                    </button>
                    <button type="button" onClick={skip} className="hover:text-slate-100">
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>

              {/* (Linear flow) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
