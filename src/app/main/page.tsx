// src/app/main/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";
import { TinyTasks, type TinyTaskSummary } from "./components/TinyTasks";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

import {
  TaskRunnerModal,
  type TinyTaskId,
  type OnboardingSnapshot as ModalOnboardingSnapshot,
} from "./TaskRunnerModal";

import { buildTodayViewModel } from "./app/buildTodayViewModel";
import { TodayIntro, type RecommendedNext } from "./components/TodayIntro";
import { SignalsCard } from "./components/SignalsCard";

/* =============================================================================
   Storage keys (QA reset + session gates)
   ============================================================================= */

// localStorage
const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

// sessionStorage
const QUOTE_SESSION_KEY = "everleap.main.quote.v1";
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";

// session prefix
const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

/* =============================================================================
   Completion thresholds
   ============================================================================= */

const SIGNAL_COMPLETE_COUNT = 5;

/* =============================================================================
   Types
   ============================================================================= */

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

type AgeLane = "high_school" | "young_adult" | "unknown";

type Interpretation = {
  lines: string[]; // 1–3 lines (only longer when confidence is high)
  confidence: number; // 0..1
};

/* =============================================================================
   Utils
   ============================================================================= */

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function firstName(raw: string) {
  const cleaned = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const first = cleaned.split(" ")[0] ?? "";
  return first.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function niceName(raw: string) {
  const n = firstName(raw);
  if (!n) return "";
  return n.length === 1 ? n.toUpperCase() : `${n[0]!.toUpperCase()}${n.slice(1)}`;
}

function getSnapshotName(snapshot: unknown): string {
  if (!snapshot || typeof snapshot !== "object") return "";
  const s = snapshot as { name?: unknown };
  return typeof s.name === "string" ? s.name : "";
}

/**
 * Opening line for copy:
 * - If name exists → greet.
 * - If no name → counselor welcome (never “Hey.”).
 */
function openingLine(name: string) {
  const n = (name ?? "").trim();
  return n ? `Hey ${n}.` : "Welcome — I’m your Everleap counselor.";
}

function labelForNext(next: RecommendedNext) {
  return next === "motivations"
    ? "Motivations"
    : next === "strengths"
    ? "Strengths"
    : "Skills";
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function detectAgeLaneFromOnboarding(snapshot: unknown): AgeLane {
  if (!snapshot || typeof snapshot !== "object") return "unknown";
  const s = snapshot as { situation?: unknown };
  if (s.situation === "high_school") return "high_school";
  if (s.situation === "young_adult") return "young_adult";
  return "unknown";
}

/* =============================================================================
   Story answers (for “I heard you” quote)
   ============================================================================= */

type SavedAnswer = { answer?: string; skipped?: boolean };

function isMeaningfulText(value: string): boolean {
  const trimmed = (value ?? "").trim();
  if (trimmed.length < 3) return false;

  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");
  if (!lettersOnly) return false;

  const unique = new Set(lettersOnly.toLowerCase()).size;
  if (unique <= 2) return false;

  const squashed = trimmed.replace(/\s+/g, "");
  if (/^(.)\1{6,}$/i.test(squashed)) return false;

  return true;
}

function readStoryAnswerMap(): Record<string, SavedAnswer> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORY_STORAGE_KEY_V3);
    const parsed = safeJsonParse<Record<string, SavedAnswer>>(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function pickRepresentativeAnswer(map: Record<string, SavedAnswer>): string | null {
  const entries = Object.entries(map ?? {});
  if (!entries.length) return null;

  // Prefer answered (not skipped), meaningful, and longer.
  const candidates = entries
    .map(([id, s]) => ({ id, a: (s?.answer ?? "").trim(), skipped: Boolean(s?.skipped) }))
    .filter((x) => !x.skipped && isMeaningfulText(x.a));

  if (!candidates.length) return null;

  // Favor longer, more “quote-able” lines, but cap so it doesn't become a paragraph.
  candidates.sort((x, y) => y.a.length - x.a.length);

  const best = candidates[0]!.a;
  const capped =
    best.length > 160 ? `${best.slice(0, 157).trim()}…` : best;

  return capped;
}

/* =============================================================================
   Interpretation (age-tuned + non-judgmental + confidence gating)
   ============================================================================= */

function interpretSnippet(snippetRaw: string, age: AgeLane): Interpretation {
  const snippet = (snippetRaw ?? "").trim();
  const t = snippet.toLowerCase();

  const hasEffort = /(hard[-\s]?working|work hard|effort|grind|train|practice|discipline|push myself|lock in)/.test(t);
  const hasBody = /(gym|workout|run|lift|train|sports|practice|move|movement)/.test(t);
  const hasRoutine = /(routine|schedule|structure|plan|checklist|habit|consistent|every day)/.test(t);
  const hasCalm = /(calm|quiet|peace|reset|decompress|breathe|alone|space)/.test(t);
  const hasPeople = /(friends|people|team|together|help|coach|community|talk|support)/.test(t);
  const hasCreate = /(create|build|make|design|draw|write|edit|music|art|film|code)/.test(t);
  const hasProgress = /(progress|improve|better|level up|grow|momentum|forward)/.test(t);

  const hits = [hasEffort, hasBody, hasRoutine, hasCalm, hasPeople, hasCreate, hasProgress].filter(Boolean).length;

  let score = hits >= 3 ? 0.85 : hits === 2 ? 0.7 : hits === 1 ? 0.55 : 0.4;
  if (snippet.length < 18) score -= 0.12;
  score = clamp01(score);

  const tone = {
    high_school: {
      softLead: "That tells me",
      secondLead: "And it also suggests",
      close: "So I’ll aim for options that feel real in your actual week — not just “cool on paper.”",
    },
    young_adult: {
      softLead: "That tells me",
      secondLead: "And it also suggests",
      close: "So I’ll aim for options that translate into real momentum — not just ideas.",
    },
    unknown: {
      softLead: "That tells me",
      secondLead: "And it also suggests",
      close: "So I’ll aim for options that match your real life — not just what sounds good.",
    },
  }[age];

  let line1 = `${tone.softLead} you care about days that feel real and satisfying — not just busy.`;
  let line2 = "";

  if (hasEffort && hasBody) {
    line1 = `${tone.softLead} you feel best when you’ve put real effort in — movement and “earned” progress matter to you.`;
    line2 = `${tone.secondLead} you’ll probably stick with next steps more when they’re concrete and trackable (something you can actually do).`;
  } else if (hasRoutine) {
    line1 = `${tone.softLead} you do better when there’s a bit of structure — small routines help the day feel under control.`;
    line2 = `${tone.secondLead} you’ll likely prefer next steps that are simple, repeatable, and low-friction.`;
  } else if (hasCreate) {
    line1 = `${tone.softLead} you’re energized by making things — you want hands-on progress, not just talking about it.`;
    line2 = `${tone.secondLead} you’ll probably learn fastest through projects and quick experiments.`;
  } else if (hasPeople) {
    line1 = `${tone.softLead} you get a lot of signal from people — support, teamwork, or being around the right crowd matters.`;
    line2 = `${tone.secondLead} you’ll likely do better with next steps that include other humans (a class, a club, a partner, a coach).`;
  } else if (hasCalm) {
    line1 = `${tone.softLead} you value a reset — focus and calm time help you feel like yourself.`;
    line2 = `${tone.secondLead} you’ll probably do best with options that protect your attention instead of draining it.`;
  } else if (hasProgress) {
    line1 = `${tone.softLead} you like forward motion — you want to feel yourself getting better over time.`;
    line2 = `${tone.secondLead} you’ll likely respond well to “next step” plans that show visible improvement.`;
  }

  const lines: string[] = [line1];

  const highConfidence = score >= 0.8;
  if (highConfidence && line2) lines.push(line2);
  if (highConfidence) lines.push(tone.close);

  return { lines, confidence: score };
}

/* =============================================================================
   Tiny task session state
   ============================================================================= */

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };

  const parsed = safeJsonParse<SessionTinyState>(
    window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY)
  );
  if (!parsed) return { shownIds: [], completedIds: [] };

  return {
    shownIds: parsed.shownIds ?? [],
    completedIds: parsed.completedIds ?? [],
  };
}

function writeSessionTinyState(next: SessionTinyState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TINY_TASKS_SESSION_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

/* =============================================================================
   QA reset helpers
   ============================================================================= */

function clearSessionPrefix(prefix: string) {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const k = window.sessionStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}

function wipeEverleapClientStorage() {
  if (typeof window === "undefined") return;

  try {
    // localStorage
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    window.localStorage.removeItem(STORY_STORAGE_KEY_V3);
    window.localStorage.removeItem(WEEKLY_FOCUS_KEY);
    window.localStorage.removeItem(CURIOSITY_SPRINTS_KEY);

    // sessionStorage
    window.sessionStorage.removeItem(QUOTE_SESSION_KEY);
    window.sessionStorage.removeItem(TINY_TASKS_SESSION_KEY);

    // session prefix
    clearSessionPrefix(ZIP_PLACE_SESSION_PREFIX);
  } catch {
    // ignore
  }
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  const router = useRouter();

  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
      ? "bg-sky-400/25"
      : "bg-amber-300/30";

  const [presenceSoft, setPresenceSoft] = React.useState(false);

  const [vm, setVm] = React.useState(() => buildTodayViewModel());
  const [mounted, setMounted] = React.useState(false);

  const [motionEnabled, setMotionEnabled] = React.useState(true);

  const [transitioning, setTransitioning] = React.useState(false);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  // QA reset UI
  const [qaResetOpen, setQaResetOpen] = React.useState(false);

  // Show only in dev OR when explicitly enabled
  const showQaReset =
    typeof window !== "undefined" &&
    (process.env.NODE_ENV !== "production" ||
      (process.env.NEXT_PUBLIC_QA_MODE ?? "") === "1");

  /* ---------------------------------------------------------------------------
     Mount / refresh (avoid hydration mismatch)
     --------------------------------------------------------------------------- */

  React.useEffect(() => {
    setMounted(true);

    // Refresh VM after mount (prevents hydration mismatch from storage/random)
    setVm(buildTodayViewModel());

    // reduced motion
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduce = !!mq?.matches;
    setMotionEnabled(!reduce);

    const onChange = () => {
      setMotionEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    mq?.addEventListener?.("change", onChange);

    const onFocus = () => setVm(buildTodayViewModel());
    window.addEventListener("focus", onFocus);

    return () => {
      mq?.removeEventListener?.("change", onChange);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 8) setPresenceSoft(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------------------------------------------------------------------
     Completion + recommendation
     --------------------------------------------------------------------------- */

  const progress = mounted
    ? vm.progress
    : { motivationsAnswered: 0, strengthsAnswered: 0, skillsAnswered: 0 };

  const motStarted = progress.motivationsAnswered > 0;
  const strStarted = progress.strengthsAnswered > 0;
  const sklStarted = progress.skillsAnswered > 0;

  const motComplete = progress.motivationsAnswered >= SIGNAL_COMPLETE_COUNT;
  const strComplete = progress.strengthsAnswered >= SIGNAL_COMPLETE_COUNT;
  const sklComplete = progress.skillsAnswered >= SIGNAL_COMPLETE_COUNT;

  const allSignalsComplete = motComplete && strComplete && sklComplete;

  const recommendedNext: RecommendedNext =
    !motComplete ? "motivations" : !strComplete ? "strengths" : "skills";

  const nextLabel = labelForNext(recommendedNext);

  // "Returning" should be true only for real past activity (NOT just onboarding).
  const hasWeeklyFocus = mounted ? !!(vm.weeklyFocus?.vibe && vm.weeklyFocus?.target) : false;
  const hasSprints = mounted ? (vm.sprintCount ?? 0) > 0 : false;
  const hasTinyCompleted = mounted ? (vm.sessionTiny?.completedIds?.length ?? 0) > 0 : false;
  const hasAnySignalsProgress = motStarted || strStarted || sklStarted;

  const isReturning =
    mounted && (hasAnySignalsProgress || hasWeeklyFocus || hasSprints || hasTinyCompleted);

  /* ---------------------------------------------------------------------------
     Tiny Tasks
     --------------------------------------------------------------------------- */

  const sprintDoneThisSession = mounted
    ? vm.sessionTiny.completedIds.includes("curiosity_sprint")
    : false;

  const tasks: TinyTaskSummary[] = [
    {
      id: "weekly_focus",
      title: "Weekly focus",
      subtitle: "Pick a vibe + a target for this week.",
      status: vm.weeklyFocus?.vibe && vm.weeklyFocus?.target ? "set" : "start",
    },
    {
      id: "curiosity_sprint",
      title: "Curiosity sprint",
      subtitle: "10 minutes. One small experiment you can actually do.",
      count: vm.sprintCount,
      disabled: sprintDoneThisSession,
      status: sprintDoneThisSession ? "done" : "start",
    },
  ];

  /* ---------------------------------------------------------------------------
     Navigation helpers
     --------------------------------------------------------------------------- */

  const buildQuestionsHref = (cat: RecommendedNext) => {
    const params = new URLSearchParams();
    params.set("cat", cat);
    params.set("returnTo", "/main");
    return `/main/questions?${params.toString()}`;
  };

  /* ---------------------------------------------------------------------------
     Click-driven fades
     --------------------------------------------------------------------------- */

  const fadeThen = async (fn: () => void | Promise<void>) => {
    if (!motionEnabled) {
      await fn();
      return;
    }
    if (transitioning) return;

    setTransitioning(true);
    await sleep(220);
    await fn();
    await sleep(140);
    setTransitioning(false);
  };

  /* ---------------------------------------------------------------------------
     QA reset handlers
     --------------------------------------------------------------------------- */

  const doQaReset = async () => {
    // close modal immediately for snappier UX
    setQaResetOpen(false);

    await fadeThen(async () => {
      wipeEverleapClientStorage();

      // reset local state
      setVm(buildTodayViewModel());

      // ensure we start at top
      try {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }

      // optional: refresh route cache
      router.refresh();
    });
  };

  /* ---------------------------------------------------------------------------
     Agentic copy (on-page)
     --------------------------------------------------------------------------- */

  const name = mounted ? niceName(getSnapshotName(vm.snapshot)) : "";
  const open = openingLine(name);

  const introParagraphs: string[] = (() => {
    if (!mounted) return ["…"];

    const p: string[] = [open];

    // Brand new
    if (!isReturning && !hasAnySignalsProgress) {
      p.push(
        "I’ll help turn what you’re into into a clear direction — and a few next steps you can actually do."
      );

      if (recommendedNext === "motivations") {
        p.push("First: Motivations. It’s the fastest way for me to stop guessing and start matching what actually fits.");
        p.push("Two minutes — then I can start giving you real direction.");
      } else {
        p.push(`Next I’d do ${nextLabel}.`);
      }

      return p;
    }

    // Status line
    if (motComplete && !strComplete) p.push("So far you’ve locked in Motivations.");
    else if (motComplete && strComplete && !sklComplete) p.push("So far you’ve locked in Motivations and Strengths.");
    else if (allSignalsComplete) p.push("You’ve got the full set — Motivations, Strengths, and Skills.");
    else if (hasAnySignalsProgress) p.push("So far you’ve started building real signal.");
    else p.push("Picking up where we left off.");

    // Quote + interpretation (if we have one)
    const map = readStoryAnswerMap();
    const picked = pickRepresentativeAnswer(map);

    if (picked) {
      p.push("One thing you said that I’m treating as a real signal:");
      p.push(`“${picked}”`);

      const age = detectAgeLaneFromOnboarding(vm.snapshot);
      const interp = interpretSnippet(picked, age);
      interp.lines.forEach((line) => p.push(line));
    }

    // Next step framing
    if (allSignalsComplete) {
      p.push("Insights is where I translate that into real picks: patterns, next steps, and what to explore next.");
      return p;
    }

    if (recommendedNext === "motivations") {
      p.push("Next I’d do Motivations.");
      p.push("Motivations tells me what energizes you (and what drains you) — so everything I suggest gets way more you.");
      return p;
    }

    if (recommendedNext === "strengths") {
      p.push("Next I’d do Strengths.");
      p.push(
        "Strengths is how I make sure options fit how you operate day to day — not just what sounds interesting."
      );
      return p;
    }

    p.push("Next I’d do Skills.");
    p.push(
      "Skills is the practical layer — it’s how I turn “direction” into real next steps: what to try, build, or practice next."
    );
    return p;
  })();

  const primaryCtaLabel = mounted
    ? allSignalsComplete
      ? "Go to Insights"
      : `Continue to ${nextLabel}`
    : undefined;

  const onPrimary = () => {
    if (!mounted) return;

    if (allSignalsComplete) {
      void fadeThen(async () => router.push("/main/insights"));
      return;
    }

    void fadeThen(async () => router.push(buildQuestionsHref(recommendedNext)));
  };

  /* ---------------------------------------------------------------------------
     Render
     --------------------------------------------------------------------------- */

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="spotlight_orb"
      ambientCap={0.35}
    >
      {/* Scrim fade for click transitions */}
      <AnimatePresence>
        {transitioning && motionEnabled ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className={dark ? "h-full w-full bg-black" : "h-full w-full bg-white"} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* QA Reset Modal */}
      <AnimatePresence>
        {qaResetOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Reset Everleap data"
          >
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close"
              onClick={() => setQaResetOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative w-full max-w-md rounded-2xl border p-4 shadow-xl ${
                dark
                  ? "border-white/10 bg-slate-950/70 text-white backdrop-blur"
                  : "border-black/10 bg-white/80 text-slate-900 backdrop-blur"
              }`}
            >
              <div className="text-sm font-semibold">Reset this device’s Everleap data?</div>
              <div className={`mt-2 text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                This clears onboarding, signals (Motivations/Strengths/Skills), weekly focus, sprints,
                and session caches so QA can start over.
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQaResetOpen(false)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    dark
                      ? "bg-white/10 text-white hover:bg-white/14"
                      : "bg-slate-900 text-white hover:bg-slate-950"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void doQaReset()}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    dark
                      ? "bg-red-500/20 text-red-100 hover:bg-red-500/26"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {taskOpen && activeTaskId ? (
          <TaskRunnerModal
            open={taskOpen}
            onClose={() => {
              setTaskOpen(false);
              setActiveTaskId(null);
              setVm(buildTodayViewModel());
            }}
            taskId={activeTaskId}
            snapshot={vm.snapshot as unknown as ModalOnboardingSnapshot | null}
            dark={dark}
          />
        ) : null}
      </AnimatePresence>

      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pt-8">
          <section className="relative">
            {/* agent presence */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-1 top-2 h-10 w-10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: presenceSoft ? 0.08 : 0.22 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={`h-full w-full rounded-full ${orbGlowClass} blur-[1px]`}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <div className="pl-12">
              {/* QA Reset pill */}
              {mounted && showQaReset ? (
                <div className="mb-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setQaResetOpen(true)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      dark
                        ? "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white/85"
                        : "bg-slate-900/90 text-white/80 hover:bg-slate-950 hover:text-white"
                    }`}
                    aria-label="QA Reset"
                    title="QA Reset"
                  >
                    QA Reset
                  </button>
                </div>
              ) : null}

              <TodayIntro
                dark={dark}
                motionEnabled={motionEnabled}
                isTransitioning={transitioning}
                quote={mounted ? vm.quote : undefined}
                paragraphs={introParagraphs}
                primaryCtaLabel={primaryCtaLabel}
                onPrimary={onPrimary}
              />

              {/* Main page content (always on-page now) */}
              {mounted ? (
                <>
                  {!allSignalsComplete ? (
                    <SignalsCard dark={dark} progress={vm.progress} nextKey={vm.nextKey} />
                  ) : null}

                  <TinyTasks
                    tasks={tasks}
                    onOpenTask={(id) => {
                      const s = readSessionTinyState();
                      writeSessionTinyState({
                        shownIds: Array.from(new Set([...s.shownIds, id])),
                        completedIds: s.completedIds,
                      });
                      setActiveTaskId(id);
                      setTaskOpen(true);
                    }}
                    dark={dark}
                  />

                  <div className="h-3" />
                </>
              ) : (
                <div className="h-10" />
              )}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
