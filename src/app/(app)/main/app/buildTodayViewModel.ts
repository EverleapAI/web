// src/app/main/app/buildTodayViewModel.ts

/* =============================================================================
   Today (/main) view-model builder
   - Reads storage (client only)
   - Calls domain pure functions
   - Returns a single object the UI can render
   ============================================================================= */

import type {
  OnboardingSnapshot,
  StoryAnswers,
  WeeklyFocusState,
  CuriositySprintState,
  SessionTinyState,
  RetortViewModel,
  SignalKey,
  SignalsProgress,
  AgentState,
  Quote,
} from "../domain/types";

import { deriveSignalsProgress, nextSignal } from "../domain/signals";
import { deriveAgentState, buildRetort } from "../domain/retort";

/* =============================================================================
   Storage keys (keep aligned with existing app)
   ============================================================================= */

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";

const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

// Optional: quote session cache (simple + stable per session)
const QUOTE_SESSION_KEY = "everleap.main.quote.v1";

/* =============================================================================
   Safe JSON
   ============================================================================= */

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/* =============================================================================
   Quote (stable per session)
   ============================================================================= */

const QUOTES: Quote[] = [
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "You don’t have to see the whole staircase. Just take the first step.", author: "Martin Luther King Jr." },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "What you do makes a difference — decide what kind of difference.", author: "Jane Goodall" },
];

const FALLBACK_QUOTE: Quote =
  QUOTES[0] ?? { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" };

function pickStableSessionQuote(): Quote {
  if (typeof window === "undefined") return FALLBACK_QUOTE;

  const existing = safeJsonParse<Quote>(window.sessionStorage.getItem(QUOTE_SESSION_KEY));
  if (existing?.text && existing?.author) return existing;

  const idx = Math.floor(Math.random() * QUOTES.length);
  const chosen = QUOTES[idx] ?? FALLBACK_QUOTE;

  try {
    window.sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(chosen));
  } catch {
    // ignore
  }

  return chosen;
}

/* =============================================================================
   Reads
   ============================================================================= */

function readSnapshot(): OnboardingSnapshot | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<OnboardingSnapshot>(window.localStorage.getItem(ONBOARDING_STORAGE_KEY));
}

function readStoryAnswers(): StoryAnswers | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<StoryAnswers>(window.localStorage.getItem(STORY_STORAGE_KEY_V3));
}

function readWeeklyFocus(): WeeklyFocusState | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<WeeklyFocusState>(window.localStorage.getItem(WEEKLY_FOCUS_KEY));
}

function readSprints(): CuriositySprintState[] {
  if (typeof window === "undefined") return [];
  const parsed = safeJsonParse<CuriositySprintState[]>(window.localStorage.getItem(CURIOSITY_SPRINTS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function readSessionTiny(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };

  const parsed = safeJsonParse<SessionTinyState>(window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY));

  const shownIds = Array.isArray(parsed?.shownIds) ? parsed!.shownIds : [];
  const completedIds = Array.isArray(parsed?.completedIds) ? parsed!.completedIds : [];

  return { shownIds, completedIds };
}

/* =============================================================================
   Public API
   ============================================================================= */

export type TodayViewModel = {
  snapshot: OnboardingSnapshot | null;
  answers: StoryAnswers | null;

  progress: SignalsProgress;
  nextKey: SignalKey;

  weeklyFocus: WeeklyFocusState | null;
  sprintCount: number;
  sessionTiny: SessionTinyState;

  agentState: AgentState;
  retort: RetortViewModel;
  quote: Quote;

  // Optional: you can populate this later (zip->state lookup).
  homeState: string | null;
};

export function buildTodayViewModel(): TodayViewModel {
  const snapshot = readSnapshot();
  const answers = readStoryAnswers();

  const progress = deriveSignalsProgress(answers);
  const nextKey = nextSignal(progress);

  const weeklyFocus = readWeeklyFocus();
  const sprintCount = readSprints().length;
  const sessionTiny = readSessionTiny();

  const totalAnswered =
    progress.motivationsAnswered + progress.strengthsAnswered + progress.skillsAnswered;

  const hasAnySignal = totalAnswered > 0;
  const hasAnyTiny = Boolean((weeklyFocus?.vibe && weeklyFocus?.target) || sprintCount > 0);

  const agentState = deriveAgentState({ snapshot, progress, hasAnySignal, hasAnyTiny });

  const sprintDoneThisSession = sessionTiny.completedIds.includes("curiosity_sprint");

  // NOTE: homeState is resolved elsewhere (zip lookup). Keep null for now.
  const homeState: string | null = null;

  const retort = buildRetort({
    agentState,
    nextKey,
    progress,
    snapshot,
    answers,
    homeState,
    weeklyFocus,
    sprintCount,
    sprintDoneThisSession,
  });

  const quote = pickStableSessionQuote();

  return {
    snapshot,
    answers,
    progress,
    nextKey,
    weeklyFocus,
    sprintCount,
    sessionTiny,
    agentState,
    retort,
    quote,
    homeState,
  };
}
