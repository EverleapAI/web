// src/app/main/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

// Modal extracted (Step 1)
import {
  TaskRunnerModal,
  type TinyTaskId,
  type OnboardingSnapshot,
  type WeeklyFocusState,
  type CuriositySprintState,
} from "./TaskRunnerModal";

// Reuse onboarding zip helpers so we can say “San Rafael, CA”
import { lookupZipPlace, stateFullName } from "../onboarding/zipLookup";

/* =============================================================================
   Storage keys (UNCHANGED)
   ============================================================================= */

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY = "everleap.story.answers.v3";

const QUOTE_SESSION_KEY = "everleap.main.quote.v1";
const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

// Tiny task storage (UI-only for now; Actions hookup later)
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

/* =============================================================================
   Types
   ============================================================================= */

type StoryAnswers = Record<string, { answer?: string; skipped?: boolean }>;

type Quote = { text: string; author: string };

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

type SignalKey = "motivations" | "strengths" | "skills";

type SignalsProgress = {
  motivationsDone: boolean;
  strengthsDone: boolean;
  skillsDone: boolean;
  motivationsAnswered: number;
  strengthsAnswered: number;
  skillsAnswered: number;
  totalPer: number;
};

type AgentState = "EMPTY" | "FOUNDATION" | "ACTIVE" | "RETURNING";

type HeroCopy = {
  line1?: string;
  line2: string; // always show a clear next step
  tag?: string; // tiny emotional hook
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

function isAnswered(v: { answer?: string; skipped?: boolean } | undefined) {
  const ans = (v?.answer ?? "").trim();
  const skipped = Boolean(v?.skipped);
  return skipped || ans.length > 0;
}

function countAnsweredForPrefix(
  answers: StoryAnswers | null,
  prefix: string,
  totalPer: number
) {
  if (!answers) return 0;
  let n = 0;
  for (let i = 1; i <= totalPer; i += 1) {
    const id = `${prefix}_${i}`;
    if (isAnswered(answers[id])) n += 1;
  }
  return n;
}

function deriveSignalsProgress(answers: StoryAnswers | null): SignalsProgress {
  const totalPer = 5;
  const motivationsAnswered = countAnsweredForPrefix(answers, "motivations", totalPer);
  const strengthsAnswered = countAnsweredForPrefix(answers, "strengths", totalPer);
  const skillsAnswered = countAnsweredForPrefix(answers, "skills", totalPer);

  return {
    motivationsDone: motivationsAnswered >= totalPer,
    strengthsDone: strengthsAnswered >= totalPer,
    skillsDone: skillsAnswered >= totalPer,
    motivationsAnswered,
    strengthsAnswered,
    skillsAnswered,
    totalPer,
  };
}

function nextSignal(progress: SignalsProgress): SignalKey {
  if (!progress.motivationsDone) return "motivations";
  if (!progress.strengthsDone) return "strengths";
  if (!progress.skillsDone) return "skills";
  return "motivations";
}

function signalLabel(k: SignalKey) {
  if (k === "motivations") return "Motivations";
  if (k === "strengths") return "Strengths";
  return "Skills";
}

function signalWhy(k: SignalKey, progress: SignalsProgress) {
  if (k === "motivations") {
    return "This gives me your baseline — what energizes you, what drains you, and what “good days” actually look like.";
  }

  if (k === "strengths") {
    if (progress.motivationsDone || progress.motivationsAnswered > 0) {
      return "Your strengths are where you naturally do your best work — so the options I suggest actually match how you operate.";
    }
    return "Your strengths are where you tend to perform at your best — so ideas fit you instead of fighting you.";
  }

  if (
    progress.motivationsDone ||
    progress.strengthsDone ||
    progress.motivationsAnswered > 0 ||
    progress.strengthsAnswered > 0
  ) {
    return "Now we turn what we know into momentum — which skills to build next, and what would actually be worth practicing.";
  }
  return "This turns insight into momentum — choosing a skill to build and a simple way to practice it.";
}

function hrefForSignal(k: SignalKey) {
  return `/main/questions?cat=${k}&returnTo=/main`;
}

function ctaText(k: SignalKey) {
  const lower = signalLabel(k).toLowerCase();
  return `Explore your ${lower}`;
}

/* =============================================================================
   Quote (stable per session)
   ============================================================================= */

const QUOTES: Quote[] = [
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  {
    text: "You don’t have to see the whole staircase. Just take the first step.",
    author: "Martin Luther King Jr.",
  },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  {
    text: "What you do makes a difference. And you have to decide what kind of difference you want to make.",
    author: "Jane Goodall",
  },
];

function pickStableSessionQuote(): Quote {
  if (typeof window === "undefined") return QUOTES[0]!;
  try {
    const existing = safeJsonParse<Quote>(window.sessionStorage.getItem(QUOTE_SESSION_KEY));
    if (existing?.text && existing?.author) return existing;

    const idx = Math.floor(Math.random() * QUOTES.length);
    const chosen = QUOTES[idx] ?? QUOTES[0]!;
    window.sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(chosen));
    return chosen;
  } catch {
    return QUOTES[0]!;
  }
}

/* =============================================================================
   Zip -> place label (cached per session)
   ============================================================================= */

function zipCacheKey(zip5: string) {
  return `${ZIP_PLACE_SESSION_PREFIX}${zip5}`;
}

async function resolveZipPlaceLabel(zip5: string): Promise<string | null> {
  if (!zip5) return null;
  if (typeof window === "undefined") return null;

  try {
    const cached = window.sessionStorage.getItem(zipCacheKey(zip5));
    if (cached) return cached;

    const place = await lookupZipPlace(zip5);
    if (!place) return null;

    const label = `${place.city}, ${stateFullName(place.state)}`;
    window.sessionStorage.setItem(zipCacheKey(zip5), label);
    return label;
  } catch {
    return null;
  }
}

/* =============================================================================
   Tiny task state (session + persisted)
   ============================================================================= */

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };

  const parsed = safeJsonParse<SessionTinyState>(
    window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY)
  );
  if (!parsed) return { shownIds: [], completedIds: [] };

  const shownIds = Array.isArray(parsed.shownIds)
    ? (parsed.shownIds.filter(
        (v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint"
      ) as TinyTaskId[])
    : [];

  const completedIds = Array.isArray(parsed.completedIds)
    ? (parsed.completedIds.filter(
        (v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint"
      ) as TinyTaskId[])
    : [];

  return { shownIds, completedIds };
}

function writeSessionTinyState(next: SessionTinyState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TINY_TASKS_SESSION_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

function readWeeklyFocus(): WeeklyFocusState | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<WeeklyFocusState>(window.localStorage.getItem(WEEKLY_FOCUS_KEY));
}

function readSprints(): CuriositySprintState[] {
  if (typeof window === "undefined") return [];
  const parsed = safeJsonParse<CuriositySprintState[]>(
    window.localStorage.getItem(CURIOSITY_SPRINTS_KEY)
  );
  return Array.isArray(parsed) ? parsed : [];
}

/* =============================================================================
   Agent state + copy
   ============================================================================= */

function deriveAgentState(args: {
  snapshot: OnboardingSnapshot | null;
  progress: SignalsProgress;
  hasAnySignal: boolean;
  hasAnyTiny: boolean;
}): AgentState {
  const { snapshot, progress, hasAnySignal, hasAnyTiny } = args;

  const onboardingDone = Boolean(snapshot?.name || snapshot?.zip || snapshot?.situation);
  if (!onboardingDone && !hasAnySignal) return "EMPTY";

  const allDone = progress.motivationsDone && progress.strengthsDone && progress.skillsDone;
  if (allDone) return hasAnyTiny ? "RETURNING" : "ACTIVE";

  return "FOUNDATION";
}

// Option A, but with more “teen rhythm”:
// - two beats (line1 + line2)
// - tiny tag line (soft emotion)
// - no location, no inventory language
function buildHeroCopy(args: {
  agentState: AgentState;
  totalAnswered: number;
  nextKey: SignalKey;
}): HeroCopy {
  const { agentState, totalAnswered, nextKey } = args;
  const nextLabel = signalLabel(nextKey);

  const hasStarted = totalAnswered > 0;

  // Keep it calm + not corny.
  const tag = agentState === "RETURNING" ? "Small steps add up." : "Small step. Big signal.";

  if (agentState === "EMPTY" && !hasStarted) {
    return {
      line2: `If you want one smart place to start: ${nextLabel}.`,
      tag,
    };
  }

  if (!hasStarted) {
    return {
      line2: `Next up: ${nextLabel}.`,
      tag,
    };
  }

  return {
    line1: "You’ve already shared a bit about yourself — that helps a lot.",
    line2: `Next up: ${nextLabel}.`,
    tag,
  };
}

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
  // Shared visual state (AppChrome)
  const [themeId, setThemeId] = React.useState<SpotlightThemeId>("nightDusk");
  const [gradientLevel, setGradientLevel] = React.useState<GradientLevel>(3);

  const dark = isDarkTheme(themeId);
  const theme = INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // Orb glow fallback (keeps this file robust if theme shape changes)
  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
      ? "bg-sky-400/25"
      : "bg-amber-300/30";

  const [presenceSoft, setPresenceSoft] = React.useState(false);

  const [snapshot, setSnapshot] = React.useState<OnboardingSnapshot | null>(null);
  const [answers, setAnswers] = React.useState<StoryAnswers | null>(null);

  const [placeLabel, setPlaceLabel] = React.useState<string | null>(null);

  // Always show quote (SSR-safe default)
  const [quote, setQuote] = React.useState<Quote>(() => QUOTES[0]!);

  // Tiny task runner
  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  const [sessionTiny, setSessionTiny] = React.useState<SessionTinyState>({
    shownIds: [],
    completedIds: [],
  });

  const [weeklyFocus, setWeeklyFocus] = React.useState<WeeklyFocusState | null>(null);
  const [sprintCount, setSprintCount] = React.useState(0);

  React.useEffect(() => {
    const snap = safeJsonParse<OnboardingSnapshot>(
      window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
    );
    const a = safeJsonParse<StoryAnswers>(window.localStorage.getItem(STORY_STORAGE_KEY));

    setSnapshot(snap);
    setAnswers(a);
    setQuote(pickStableSessionQuote());
    setSessionTiny(readSessionTinyState());

    setWeeklyFocus(readWeeklyFocus());
    setSprintCount(readSprints().length);

    const zip5 = (snap?.zip ?? "").trim();
    if (zip5) {
      void (async () => {
        const label = await resolveZipPlaceLabel(zip5);
        setPlaceLabel(label);
      })();
    } else {
      setPlaceLabel(null);
    }

    const onFocus = () => {
      const nextSnap = safeJsonParse<OnboardingSnapshot>(
        window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
      );
      const nextAnswers = safeJsonParse<StoryAnswers>(
        window.localStorage.getItem(STORY_STORAGE_KEY)
      );

      setSnapshot(nextSnap);
      setAnswers(nextAnswers);
      setSessionTiny(readSessionTinyState());

      setWeeklyFocus(readWeeklyFocus());
      setSprintCount(readSprints().length);

      const z = (nextSnap?.zip ?? "").trim();
      if (!z) {
        setPlaceLabel(null);
        return;
      }
      void (async () => {
        const label = await resolveZipPlaceLabel(z);
        setPlaceLabel(label);
      })();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  React.useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 8) setPresenceSoft(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = niceName(snapshot?.name ?? "");

  const progress = deriveSignalsProgress(answers);
  const next = nextSignal(progress);

  const totalAnswered =
    progress.motivationsAnswered + progress.strengthsAnswered + progress.skillsAnswered;

  const hasAnySignal = totalAnswered > 0;
  const focusDone = Boolean(weeklyFocus?.vibe && weeklyFocus?.target);
  const hasAnyTiny = Boolean((weeklyFocus?.vibe && weeklyFocus?.target) || sprintCount > 0);

  const agentState = deriveAgentState({
    snapshot,
    progress,
    hasAnySignal,
    hasAnyTiny,
  });

  // Signals should be open by default (user can collapse manually).
  const [signalsOpen, setSignalsOpen] = React.useState<boolean>(true);

  const hero = buildHeroCopy({
    agentState,
    totalAnswered,
    nextKey: next,
  });

  const textMuted = dark ? "text-slate-300/85" : "text-slate-700";
  const textFaint = dark ? "text-slate-400" : "text-slate-500";

  // One supportive “context” line (exactly once) after the why line.
  const memoryBits: string[] = [];
  if (focusDone) memoryBits.push("a weekly focus");
  if (sprintCount > 0) memoryBits.push(`${sprintCount} sprint${sprintCount === 1 ? "" : "s"}`);

  const supportiveContext =
    memoryBits.length > 0
      ? `You’ve got ${memoryBits.join(" and ")} saved — I’ll build from that.`
      : null;

  const openTask = (id: TinyTaskId) => {
    const s = readSessionTinyState();
    const shownIds: TinyTaskId[] = Array.from(new Set<TinyTaskId>([...(s.shownIds ?? []), id]));
    const nextState: SessionTinyState = { shownIds, completedIds: s.completedIds ?? [] };
    writeSessionTinyState(nextState);
    setSessionTiny(nextState);

    setActiveTaskId(id);
    setTaskOpen(true);
  };

  const closeTask = () => {
    setTaskOpen(false);
    setActiveTaskId(null);

    setSessionTiny(readSessionTinyState());
    setWeeklyFocus(readWeeklyFocus());
    setSprintCount(readSprints().length);
  };

  const sprintDoneThisSession = sessionTiny.completedIds.includes("curiosity_sprint");

  const nextLabel = signalLabel(next);

  const renderHeroLine2 = () => {
    const raw = hero.line2 || "";
    const idx = raw.indexOf(nextLabel);

    if (idx === -1) return <span>{raw}</span>;

    const before = raw.slice(0, idx);
    const after = raw.slice(idx + nextLabel.length);

    return (
      <>
        <span>{before}</span>
        <span className="font-semibold underline underline-offset-4 decoration-white/15">
          {nextLabel}
        </span>
        <span>{after}</span>
      </>
    );
  };

  // Use resolved location exactly once, tiny + optional.
  // This clears the eslint warning and gives a subtle “grounded” feel without getting busy.
  const locationWhisper = placeLabel ? `in ${placeLabel}` : null;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="spotlight_orb"
      ambientCap={0.35}
    >
      <TaskRunnerModal
        open={taskOpen}
        onClose={closeTask}
        taskId={activeTaskId}
        snapshot={snapshot}
        dark={dark}
      />

      <div className="relative flex min-h-[100svh] flex-col">
        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pt-8">
          <section className="relative">
            {/* subtle agent presence */}
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
              {/* TODAY marker */}
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] opacity-85">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] ${
                    dark ? "bg-amber-200/90 text-slate-950" : "bg-amber-400 text-slate-900"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                </span>
                <span>Today</span>
              </div>

              <div className="space-y-6">
                {/* Quote (always shown) */}
                <div className={`text-sm ${textFaint}`}>
                  <span className="opacity-80">“</span>
                  <span className="italic">{quote.text}</span>
                  <span className="opacity-80">”</span>
                  <span className="ml-2 opacity-70">— {quote.author}</span>
                </div>

                {/* Greeting + hero */}
                <div>
                  <div className="text-xl font-semibold sm:text-2xl">
                    {name ? `Hey ${name}.` : "Hey."}
                  </div>

                  {/* Tiny location whisper (optional, once) */}
                  {locationWhisper ? (
                    <div className={`mt-1 text-xs ${textFaint}`}>Here {locationWhisper}.</div>
                  ) : null}

                  <div className={`mt-3 space-y-1 text-sm leading-relaxed ${textMuted}`}>
                    {hero.line1 ? <div>{hero.line1}</div> : null}
                    <div>{renderHeroLine2()}</div>

                    {hero.tag ? <div className={`pt-1 text-xs italic ${textFaint}`}>{hero.tag}</div> : null}
                  </div>
                </div>

                {/* One primary suggestion */}
                <div>
                  <Link
                    href={hrefForSignal(next)}
                    onClick={() => setPresenceSoft(true)}
                    className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/90 hover:text-white transition"
                  >
                    <span className="underline underline-offset-4 decoration-white/20">
                      {ctaText(next)}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-75" />
                  </Link>

                  <div className={`mt-2 text-sm leading-relaxed ${textMuted}`}>
                    {signalWhy(next, progress)}
                  </div>

                  {/* Supportive tiny-task context: EXACTLY ONCE, only here */}
                  {supportiveContext ? (
                    <div className={`mt-2 text-sm leading-relaxed ${textMuted}`}>{supportiveContext}</div>
                  ) : null}
                </div>

                {/* Signals (collapsible reference, OPEN by default) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setSignalsOpen((v) => !v)}
                    className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70 hover:text-white/85 transition"
                    aria-expanded={signalsOpen}
                  >
                    <span>What this is based on</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/35">
                      {signalsOpen ? "hide" : "show"}
                    </span>
                    {signalsOpen ? (
                      <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-90" />
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-90" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {signalsOpen ? (
                      <motion.div
                        key="signals"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="mt-4 space-y-3"
                      >
                        {[
                          {
                            label: "Motivations",
                            status: progress.motivationsDone
                              ? ("done" as const)
                              : next === "motivations"
                              ? ("next" as const)
                              : ("later" as const),
                            detail: progress.motivationsDone
                              ? "done"
                              : `${progress.motivationsAnswered}/${progress.totalPer} answered`,
                          },
                          {
                            label: "Strengths",
                            status: progress.strengthsDone
                              ? ("done" as const)
                              : next === "strengths"
                              ? ("next" as const)
                              : ("later" as const),
                            detail: progress.strengthsDone
                              ? "done"
                              : `${progress.strengthsAnswered}/${progress.totalPer} answered`,
                          },
                          {
                            label: "Skills",
                            status: progress.skillsDone
                              ? ("done" as const)
                              : next === "skills"
                              ? ("next" as const)
                              : ("later" as const),
                            detail: progress.skillsDone
                              ? "done"
                              : `${progress.skillsAnswered}/${progress.totalPer} answered`,
                          },
                        ].map((row) => {
                          const dotClass =
                            row.status === "done"
                              ? "bg-white/35"
                              : row.status === "next"
                              ? "bg-amber-200/60"
                              : "bg-white/12";

                          const statusLabel =
                            row.status === "done"
                              ? "in hand"
                              : row.status === "next"
                              ? "worth next"
                              : "later";

                          const Dot =
                            row.status === "next" ? (
                              <motion.span
                                aria-hidden
                                className={`mt-[6px] h-2 w-2 rounded-full ${dotClass}`}
                                animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.18, 1] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            ) : (
                              <span className={`mt-[6px] h-2 w-2 rounded-full ${dotClass}`} />
                            );

                          return (
                            <div key={row.label} className="flex items-start gap-3">
                              {Dot}
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white/85">
                                  {row.label}
                                  <span className="ml-2 text-xs font-semibold text-white/35">
                                    · {statusLabel}
                                  </span>
                                </div>
                                <div className={`text-xs ${textFaint}`}>{row.detail}</div>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Tiny tasks (optional, minimal) */}
                <div className="pt-2">
                  <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${textFaint}`}>
                    Two tiny things (optional)
                  </div>

                  <div className="mt-4 space-y-5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white/90">
                          Weekly focus
                          {focusDone ? (
                            <span className="ml-2 text-xs font-semibold text-white/45">· saved</span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => openTask("weekly_focus")}
                          className={`text-sm font-semibold underline underline-offset-4 transition ${
                            dark
                              ? "text-slate-100/85 hover:text-white"
                              : "text-slate-900 hover:text-slate-950"
                          }`}
                        >
                          {focusDone ? "Edit" : "Start"}
                        </button>
                      </div>

                      <div className={`text-sm ${textMuted}`}>
                        Takes ~45 seconds. Makes the next suggestions sharper.
                      </div>

                      {focusDone && weeklyFocus ? (
                        <div className="mt-2 text-xs text-white/55">
                          Focus:{" "}
                          <span className="font-semibold text-white/80">
                            {weeklyFocus.vibe} + {weeklyFocus.target}
                          </span>
                          {weeklyFocus.sentence ? (
                            <span className="text-white/45"> · “{weeklyFocus.sentence}”</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-white/90">
                          10-minute curiosity sprint
                          {sprintDoneThisSession ? (
                            <span className="ml-2 text-xs font-semibold text-white/45">· saved</span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => openTask("curiosity_sprint")}
                          className={`text-sm font-semibold underline underline-offset-4 transition ${
                            dark
                              ? "text-slate-100/85 hover:text-white"
                              : "text-slate-900 hover:text-slate-950"
                          }`}
                        >
                          Start
                        </button>
                      </div>

                      <div className={`text-sm ${textMuted}`}>
                        Pick a prompt. Explore a little. Save one takeaway.
                      </div>

                      {sprintCount > 0 ? (
                        <div className="mt-2 text-xs text-white/55">
                          Saved sprints:{" "}
                          <span className="font-semibold text-white/75">{sprintCount}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {agentState === "RETURNING" ? (
                  <div className={`pt-2 text-xs ${textFaint}`}>
                    You’re not starting over — the suggestions will keep getting sharper over time.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>

        <BottomNav activeKey="home" />
      </div>
    </AppChrome>
  );
}