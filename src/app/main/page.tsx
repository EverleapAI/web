// src/app/main/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight } from "lucide-react";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AppChrome } from "@/components/site/AppChrome";

import {
  isDarkTheme,
  type SpotlightThemeId,
  type GradientLevel,
  INSIGHTS_THEMES,
} from "@/theme/everleapVisuals";

// Reuse onboarding zip helpers so we can say “San Rafael, CA”
import { lookupZipPlace, stateFullName } from "../onboarding/zipLookup";

/* =============================================================================
   Storage keys
   ============================================================================= */

const ONBOARDING_STORAGE_KEY = "everleapOnboarding_v4_convo_min";

// Story answers used by QuestionFlow (category sets)
const STORY_STORAGE_KEY_V3 = "everleap.story.answers.v3";

const QUOTE_SESSION_KEY = "everleap.main.quote.v1";
const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

// Tiny task storage (UI-only for now; Actions hookup later)
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";
const WEEKLY_FOCUS_KEY = "everleap.focus.week.v1";
const CURIOSITY_SPRINTS_KEY = "everleap.sprints.v1";

/* =============================================================================
   Types
   ============================================================================= */

type Situation = "high_school" | "young_adult" | null;
type Certainty = "strong" | "kinda" | "no_clue" | null;

type PostPlanKey =
  | "job"
  | "associates"
  | "credential"
  | "military"
  | "four_year"
  | "no_idea";

type ActivityKey =
  | "sports"
  | "visual_arts"
  | "performing_arts"
  | "volunteer"
  | "job"
  | "other";

type FunChoice = "dog" | "cat" | "bearded_dragon" | "rock" | null;

type OnboardingSnapshot = {
  name?: string;
  situation?: Situation;
  zip?: string; // normalized zip or ""
  certainty?: Certainty;
  postPlans?: PostPlanKey[];
  activities?: ActivityKey[];
  activitiesOther?: string;
  funChoice?: FunChoice;
};

type Saved = { answer?: string; skipped?: boolean };
type StoryAnswersV3 = Record<string, Saved>;

type Quote = { text: string; author: string };

type TinyTaskId = "weekly_focus" | "curiosity_sprint";

type WeeklyFocusState = {
  createdAt: string; // ISO
  vibe: string;
  target: string;
  sentence?: string;
};

type CuriositySprintState = {
  createdAt: string; // ISO
  lane: "jobs" | "majors" | "skills" | "experiments";
  prompt: string;
  takeaway: string;
};

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

type SignalKey = "motivations" | "strengths" | "skills";

type SignalProgress = {
  motivationsDone: boolean;
  strengthsDone: boolean;
  skillsDone: boolean;
  motivationsCount: number;
  strengthsCount: number;
  skillsCount: number;
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

function joinNatural(list: string[]) {
  const clean = list.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0]!;
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function readOnboardingSnapshot(): OnboardingSnapshot | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<OnboardingSnapshot>(window.localStorage.getItem(ONBOARDING_STORAGE_KEY));
}

function readStoryAnswersV3(): StoryAnswersV3 | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<StoryAnswersV3>(window.localStorage.getItem(STORY_STORAGE_KEY_V3));
}

function isSavedMeaningfully(s: Saved | undefined): boolean {
  if (!s) return false;
  if (s.skipped) return true;
  const a = (s.answer ?? "").trim();
  return a.length > 0;
}

function countCategorySaved(answers: StoryAnswersV3 | null, cat: SignalKey): number {
  if (!answers) return 0;
  let n = 0;
  for (let i = 1; i <= 5; i += 1) {
    const id = `${cat}_${i}`;
    if (isSavedMeaningfully(answers[id])) n += 1;
  }
  return n;
}

function computeSignals(answers: StoryAnswersV3 | null): SignalProgress {
  const motivationsCount = countCategorySaved(answers, "motivations");
  const strengthsCount = countCategorySaved(answers, "strengths");
  const skillsCount = countCategorySaved(answers, "skills");

  return {
    motivationsDone: motivationsCount >= 5,
    strengthsDone: strengthsCount >= 5,
    skillsDone: skillsCount >= 5,
    motivationsCount,
    strengthsCount,
    skillsCount,
  };
}

function postPlanLabel(k: PostPlanKey): string {
  switch (k) {
    case "job":
      return "a job";
    case "four_year":
      return "four-year college";
    case "associates":
      return "community / two-year college";
    case "credential":
      return "a trade / credential program";
    case "military":
      return "the military";
    case "no_idea":
      return "not sure yet";
  }
}

function activityLabel(k: ActivityKey): string {
  switch (k) {
    case "sports":
      return "sports / training";
    case "visual_arts":
      return "art / design";
    case "performing_arts":
      return "music / dance / theater";
    case "volunteer":
      return "volunteering";
    case "job":
      return "working a job";
    case "other":
      return "other";
  }
}

function funTag(k: FunChoice): string {
  switch (k) {
    case "dog":
      return "dog energy";
    case "cat":
      return "cat energy";
    case "bearded_dragon":
      return "bearded dragon energy";
    case "rock":
      return "rock energy";
    default:
      return "";
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
   Session tiny-task state (so tasks feel “one per session” / “done”)
   ============================================================================= */

function readSessionTinyState(): SessionTinyState {
  if (typeof window === "undefined") return { shownIds: [], completedIds: [] };
  const parsed = safeJsonParse<SessionTinyState>(window.sessionStorage.getItem(TINY_TASKS_SESSION_KEY));
  if (!parsed) return { shownIds: [], completedIds: [] };

  const shownIds = Array.isArray(parsed.shownIds)
    ? (parsed.shownIds.filter((v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint") as TinyTaskId[])
    : [];

  const completedIds = Array.isArray(parsed.completedIds)
    ? (parsed.completedIds.filter((v): v is TinyTaskId => v === "weekly_focus" || v === "curiosity_sprint") as TinyTaskId[])
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

/* =============================================================================
   Agent narrative (recap)
   ============================================================================= */

function buildNarrativeRecap(args: { snapshot: OnboardingSnapshot | null; placeLabel: string | null }) {
  const { snapshot, placeLabel } = args;

  const name = niceName(snapshot?.name ?? "") || "there";
  if (!snapshot) {
    return {
      name,
      recap: null as string | null,
      confidence: null as string | null,
    };
  }

  const fragments: string[] = [];

  if (snapshot.situation === "high_school") fragments.push("high school");
  else if (snapshot.situation === "young_adult") fragments.push("young adult (18–24)");

  const plans = (snapshot.postPlans ?? []).filter(Boolean);
  if (plans.length > 0) {
    if (plans.includes("no_idea")) fragments.push("keeping options open");
    else {
      const planText = joinNatural(plans.map(postPlanLabel));
      if (planText) fragments.push(`considering ${planText}`);
    }
  }

  const activities = (snapshot.activities ?? []).filter(Boolean);
  if (activities.length > 0) {
    const listText = joinNatural(activities.map(activityLabel));
    if (listText) fragments.push(`into ${listText}`);
  }

  if (placeLabel) fragments.push(`${placeLabel}`);
  const fun = funTag(snapshot.funChoice ?? null);
  if (fun) fragments.push(fun);

  // Less parrot-y: “signals” not “here’s what you said”
  const recap =
    fragments.length > 0
      ? `So far the signals look like: ${joinNatural(fragments)}.`
      : null;

  let confidence: string | null = null;
  if (snapshot.certainty === "strong") confidence = "Clear direction — the next steps can move fast.";
  else if (snapshot.certainty === "kinda") confidence = "Some direction — enough to narrow quickly.";
  else if (snapshot.certainty === "no_clue") confidence = "No clear direction yet — that’s normal. Explore smart, not random.";

  return { name, recap, confidence };
}

/* =============================================================================
   Signals progress (Motivations / Strengths / Skills)
   ============================================================================= */

function SignalsProgressStrip({
  dark,
  progress,
}: {
  dark: boolean;
  progress: SignalProgress;
}) {
  const items: { key: SignalKey; label: string; done: boolean; count: number }[] = [
    { key: "motivations", label: "Motivations", done: progress.motivationsDone, count: progress.motivationsCount },
    { key: "strengths", label: "Strengths", done: progress.strengthsDone, count: progress.strengthsCount },
    { key: "skills", label: "Skills", done: progress.skillsDone, count: progress.skillsCount },
  ];

  const rail = dark ? "bg-white/10" : "bg-slate-900/10";
  const dotOff = dark ? "bg-white/14" : "bg-slate-900/15";
  const dotOn = dark ? "bg-white/60" : "bg-slate-900/50";
  const dotDone = dark ? "bg-emerald-300/70" : "bg-emerald-600/55";
  const text = dark ? "text-slate-200/85" : "text-slate-700";
  const faint = dark ? "text-slate-400" : "text-slate-500";
  const border = dark ? "border-white/10" : "border-slate-900/10";

  return (
    <div className={`mt-5 rounded-2xl border ${border} px-4 py-3`}>
      <div className="flex items-center justify-between gap-3">
        <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${faint}`}>Signals</div>
        <div className={`text-xs ${faint}`}>{`${Math.min(15, progress.motivationsCount + progress.strengthsCount + progress.skillsCount)}/15`}</div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {items.map((it) => {
          const dots = 5;
          const filled = Math.max(0, Math.min(dots, it.count));
          return (
            <div key={it.key} className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className={`text-[12px] font-semibold ${text} truncate`}>{it.label}</div>
                <div className={`text-[11px] ${faint}`}>{it.done ? "done" : `${filled}/5`}</div>
              </div>

              <div className={`mt-2 h-1.5 w-full rounded-full ${rail} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${it.done ? (dark ? "bg-emerald-300/65" : "bg-emerald-600/55") : (dark ? "bg-white/35" : "bg-slate-900/25")}`}
                  style={{ width: `${(filled / dots) * 100}%` }}
                />
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                {Array.from({ length: dots }).map((_, i) => {
                  const isFilled = i < filled;
                  const cls = it.done ? dotDone : isFilled ? dotOn : dotOff;
                  return <span key={i} aria-hidden className={`h-1.5 w-1.5 rounded-full ${cls}`} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =============================================================================
   Tiny task runner (inline modal)
   ============================================================================= */

function StepDots({ step, total }: { step: number; total: number }) {
  const filled = Math.max(1, Math.min(total, step + 1));
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${filled} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            className={`h-[6px] w-[14px] rounded-full transition ${on ? "bg-white/70" : "bg-white/18"}`}
          />
        );
      })}
    </div>
  );
}

function ChoiceChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = value === o;
        return (
          <motion.button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            whileTap={{ scale: 0.99 }}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              selected
                ? "border-white/35 bg-white/10 text-white"
                : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
            }`}
            aria-pressed={selected}
          >
            {o}
          </motion.button>
        );
      })}
    </div>
  );
}

function MinimalLineInput({
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}) {
  return (
    <div className="mt-5 border-b border-white/18 focus-within:border-white/40 transition">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter?.();
          }
        }}
        rows={2}
        placeholder={placeholder ?? ""}
        className="w-full resize-none bg-transparent py-3 text-[16px] leading-7 text-white/90 placeholder:text-white/30 outline-none"
      />
    </div>
  );
}

function readWeeklyFocus(): WeeklyFocusState | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<WeeklyFocusState>(window.localStorage.getItem(WEEKLY_FOCUS_KEY));
}

function writeWeeklyFocus(next: WeeklyFocusState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WEEKLY_FOCUS_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

function readSprints(): CuriositySprintState[] {
  if (typeof window === "undefined") return [];
  const parsed = safeJsonParse<CuriositySprintState[]>(window.localStorage.getItem(CURIOSITY_SPRINTS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function writeSprints(next: CuriositySprintState[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURIOSITY_SPRINTS_KEY, safeJsonStringify(next));
  } catch {
    // ignore
  }
}

function buildSprintPromptsFromOnboarding(snapshot: OnboardingSnapshot | null): string[] {
  const plans = snapshot?.postPlans ?? [];
  const activities = snapshot?.activities ?? [];

  const leansWork = plans.includes("job") || activities.includes("job");
  const leansCollege = plans.includes("four_year") || plans.includes("associates");
  const leansTrade = plans.includes("credential");
  const leansMilitary = plans.includes("military");

  if (leansWork) {
    return [
      "Find 1 thing about being a Product Manager that seems genuinely fun.",
      "Find 1 job title that surprised you — and write down why.",
      "Find 1 skill that shows up in a lot of jobs you’d actually want.",
    ];
  }
  if (leansTrade) {
    return [
      "Find 1 trade skill you didn’t realize was a real career.",
      "Find 1 local program that teaches a hands-on skill — just note the name.",
      "Find 1 tool or technique in a trade that looks satisfying to learn.",
    ];
  }
  if (leansMilitary) {
    return [
      "Find 1 role that’s not what people assume — and note what it actually does.",
      "Find 1 benefit that matters to you personally (and why).",
      "Find 1 story from someone who joined — and what you notice about it.",
    ];
  }
  if (leansCollege) {
    return [
      "Find 1 major that connects to something you already like doing.",
      "Find 1 class you’d actually enjoy taking — and why.",
      "Find 1 campus club or program that feels like “your people.”",
    ];
  }

  return [
    "Find 1 job you didn’t know existed — and why it’s interesting.",
    "Find 1 skill you’d be proud to have in 6 months.",
    "Find 1 path that feels “possible” — not perfect — and why.",
  ];
}

function laneHelper(lane: CuriositySprintState["lane"]) {
  switch (lane) {
    case "jobs":
      return "What people actually do all day.";
    case "majors":
      return "What you’d spend time learning.";
    case "skills":
      return "Things you could get good at.";
    case "experiments":
      return "Low-risk ways to try things.";
  }
}

function TaskRunnerModal({
  open,
  onClose,
  taskId,
  snapshot,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  taskId: TinyTaskId | null;
  snapshot: OnboardingSnapshot | null;
  dark: boolean;
}) {
  const [step, setStep] = React.useState(0);

  // Weekly focus state
  const [vibe, setVibe] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [sentence, setSentence] = React.useState("");

  // Sprint state
  const [lane, setLane] = React.useState<CuriositySprintState["lane"]>("jobs");
  const [prompt, setPrompt] = React.useState("");
  const [takeaway, setTakeaway] = React.useState("");

  const prompts = React.useMemo(() => buildSprintPromptsFromOnboarding(snapshot), [snapshot]);

  React.useEffect(() => {
    if (!open) return;

    setStep(0);

    const existingFocus = readWeeklyFocus();
    if (existingFocus) {
      setVibe(existingFocus.vibe ?? "");
      setTarget(existingFocus.target ?? "");
      setSentence(existingFocus.sentence ?? "");
    } else {
      setVibe("");
      setTarget("");
      setSentence("");
    }

    setLane("jobs");
    setPrompt(prompts[0] ?? "");
    setTakeaway("");
  }, [open, taskId, prompts]);

  const surface = dark ? "border-white/12 bg-black/40" : "border-slate-900/10 bg-white/55";
  const overlay = dark ? "bg-black/60" : "bg-black/40";

  const close = () => onClose();

  const primaryBtn =
    "inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99]";

  const primaryBtnClass = dark
    ? `${primaryBtn} border-white/12 bg-white/10 hover:bg-white/14 text-white`
    : `${primaryBtn} border-slate-900/10 bg-white/75 hover:bg-white text-slate-900`;

  const subtleBtnClass = dark ? "text-white/70 hover:text-white/90" : "text-slate-700 hover:text-slate-950";

  const labelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/70"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-700/60";

  function completeWeeklyFocus() {
    const next: WeeklyFocusState = {
      createdAt: new Date().toISOString(),
      vibe: vibe.trim(),
      target: target.trim(),
      sentence: sentence.trim() ? sentence.trim() : undefined,
    };
    writeWeeklyFocus(next);

    const s = readSessionTinyState();
    const completedIds: TinyTaskId[] = Array.from(new Set<TinyTaskId>([...(s.completedIds ?? []), "weekly_focus"]));
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(3);
  }

  function completeSprint() {
    const t = takeaway.trim();
    if (!t) return;

    const nextItem: CuriositySprintState = {
      createdAt: new Date().toISOString(),
      lane,
      prompt: prompt.trim() || (prompts[0] ?? ""),
      takeaway: t,
    };

    const prev = readSprints();
    writeSprints([nextItem, ...prev].slice(0, 40));

    const s = readSessionTinyState();
    const completedIds: TinyTaskId[] = Array.from(new Set<TinyTaskId>([...(s.completedIds ?? []), "curiosity_sprint"]));
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(4);
  }

  function renderWeeklyFocus() {
    const total = 4;

    const vibeOptions = ["Calm", "Confident", "Curious", "Productive", "Social", "Strong", "Creative", "Reset"];
    const targetOptions = ["School", "Friends", "Health", "Money", "Future", "Confidence", "Time"];

    const canNext =
      (step === 0 && vibe.trim().length > 0) ||
      (step === 1 && target.trim().length > 0) ||
      step === 2;

    const nextLabel = step === 2 ? "Save focus" : "Next";

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className={labelClass}>Tiny task · Focus</div>
          <StepDots step={step} total={total} />
        </div>

        {step === 0 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">How do you want this week to feel?</h2>
            <p className="mt-2 text-sm text-white/70">Pick one vibe. It helps Everleap steer what shows up next.</p>
            <ChoiceChips options={vibeOptions} value={vibe} onChange={(v) => setVibe(v)} />
          </>
        ) : step === 1 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">What do you want that energy aimed at?</h2>
            <p className="mt-2 text-sm text-white/70">Pick one target.</p>
            <ChoiceChips options={targetOptions} value={target} onChange={(v) => setTarget(v)} />
          </>
        ) : step === 2 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">One sentence (optional)</h2>
            <p className="mt-2 text-sm text-white/70">Keep it simple. You can leave this blank.</p>
            <MinimalLineInput
              value={sentence}
              onChange={setSentence}
              placeholder="This week I want…"
              onEnter={() => completeWeeklyFocus()}
            />
            <div className="mt-4 text-xs text-white/55">
              Saved focus will show up here as your “north star” (Actions hookup comes later).
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Locked.</h2>
            <p className="mt-2 text-sm text-white/75">
              Today’s picks can lean toward{" "}
              <span className="font-semibold text-white">{vibe}</span> +
              <span className="font-semibold text-white"> {target}</span>.
            </p>
            {sentence.trim() ? <p className="mt-3 text-sm text-white/70">“{sentence.trim()}”</p> : null}

            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={close} className={primaryBtnClass}>
                Done
              </button>
              <button type="button" onClick={close} className={`text-sm font-semibold ${subtleBtnClass}`}>
                Back to home
              </button>
            </div>
          </>
        )}

        {step < 3 ? (
          <div className="mt-7 flex items-center justify-between">
            <button type="button" onClick={close} className={`text-sm font-semibold ${subtleBtnClass}`}>
              Not now
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  completeWeeklyFocus();
                  return;
                }
                if (!canNext) return;
                setStep((s) => Math.min(2, s + 1));
              }}
              disabled={!canNext}
              className={`${primaryBtnClass} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {nextLabel} <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderCuriositySprint() {
    const total = 5;

    const laneOptions: { id: CuriositySprintState["lane"]; label: string; emoji: string }[] = [
      { id: "jobs", label: "Jobs", emoji: "🔎" },
      { id: "majors", label: "Majors", emoji: "🎓" },
      { id: "skills", label: "Skills", emoji: "🛠️" },
      { id: "experiments", label: "Experiments", emoji: "🧪" },
    ];

    const suggested = prompts.slice(0, 3);

    const canNext =
      (step === 0 && Boolean(lane)) ||
      (step === 1 && Boolean((prompt ?? "").trim())) ||
      step === 2 ||
      (step === 3 && takeaway.trim().length > 0);

    const nextLabel =
      step === 3 ? "Save takeaway" : step === 2 ? "I did it" : step === 1 ? "Do it" : "See a prompt";

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className={labelClass}>Tiny task · Curiosity sprint</div>
          <StepDots step={step} total={total} />
        </div>

        {step === 0 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">What do you want to explore for 10 minutes?</h2>
            <p className="mt-2 text-sm text-white/70">Pick one area. No commitment — just curiosity.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {laneOptions.map((o) => {
                const selected = lane === o.id;
                return (
                  <motion.button
                    key={o.id}
                    type="button"
                    onClick={() => setLane(o.id)}
                    whileTap={{ scale: 0.99 }}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                      selected
                        ? "border-white/35 bg-white/12 text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
                    }`}
                    aria-pressed={selected}
                  >
                    {o.label}
                    {selected ? <span className="ml-2 opacity-80">{o.emoji}</span> : null}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {lane ? (
                <motion.div
                  key={lane}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">What this means</div>
                  <div className="mt-2 text-sm text-white/85">{laneHelper(lane)}</div>
                  <div className="mt-2 text-xs text-white/45">Not choosing a path — just opening a door.</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Here’s a prompt.</h2>
            <p className="mt-2 text-sm text-white/70">Pick one. You can edit it if you want.</p>

            <div className="mt-4 space-y-2">
              {suggested.map((p) => {
                const selected = prompt === p;
                return (
                  <motion.button
                    key={p}
                    type="button"
                    onClick={() => setPrompt(p)}
                    whileTap={{ scale: 0.995 }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-white/25 bg-white/10 text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
                    }`}
                  >
                    {p}
                  </motion.button>
                );
              })}
            </div>

            <MinimalLineInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Or write your own prompt…"
              onEnter={() => setStep(2)}
            />
          </>
        ) : step === 2 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Do it.</h2>
            <p className="mt-2 text-sm text-white/70">Set a 10-minute timer on your phone. Then come back and save one thing you noticed.</p>

            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Your prompt</div>
              <div className="mt-2">{prompt.trim() || suggested[0] || "Find one interesting thing."}</div>
            </div>

            <div className="mt-4 text-xs text-white/50">(No in-app timer yet — just the behavior.)</div>
          </>
        ) : step === 3 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">What’s your takeaway?</h2>
            <p className="mt-2 text-sm text-white/70">One sentence is enough.</p>

            <MinimalLineInput value={takeaway} onChange={setTakeaway} placeholder="I noticed that…" onEnter={() => completeSprint()} />
            <div className="mt-4 text-xs text-white/55">This gets saved so Everleap can build on it later.</div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Nice.</h2>
            <p className="mt-2 text-sm text-white/75">That’s a real signal. It will show up in better picks over time.</p>

            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Saved takeaway</div>
              <div className="mt-2">{takeaway.trim()}</div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={close} className={primaryBtnClass}>
                Done
              </button>
              <button type="button" onClick={close} className={`text-sm font-semibold ${subtleBtnClass}`}>
                Back to home
              </button>
            </div>
          </>
        )}

        {step < 4 ? (
          <div className="mt-7 flex items-center justify-between">
            <button type="button" onClick={close} className={`text-sm font-semibold ${subtleBtnClass}`}>
              Not now
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === 3) {
                  completeSprint();
                  return;
                }
                if (!canNext) return;
                setStep((s) => Math.min(3, s + 1));
              }}
              disabled={!canNext}
              className={`${primaryBtnClass} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {nextLabel} <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && taskId ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <div className={`absolute inset-0 ${overlay}`} onClick={close} aria-hidden="true" />

          <motion.div
            initial={{ y: 22, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative w-full max-w-xl overflow-hidden rounded-[28px] border ${surface} backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.75)]`}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(1200px 500px at 12% 0%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 400px at 90% 10%, rgba(255,255,255,0.06), transparent 55%)",
              }}
            />

            <div className="relative flex items-center justify-between px-5 py-4">
              <div className="text-sm font-semibold text-white/90">Everleap</div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 hover:text-white/90 hover:bg-white/10 transition"
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative px-5 pb-6">{taskId === "weekly_focus" ? renderWeeklyFocus() : renderCuriositySprint()}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
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

  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
        ? "bg-sky-400/25"
        : "bg-amber-300/30";

  const [presenceSoft, setPresenceSoft] = React.useState(false);

  const [snapshot, setSnapshot] = React.useState<OnboardingSnapshot | null>(null);

  const [placeLabel, setPlaceLabel] = React.useState<string | null>(null);
  const [quote, setQuote] = React.useState<Quote | null>(null);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  const [sessionTiny, setSessionTiny] = React.useState<SessionTinyState>({ shownIds: [], completedIds: [] });

  // Persisted data that must not be read during render (prevents hydration mismatch)
  const [weeklyFocus, setWeeklyFocus] = React.useState<WeeklyFocusState | null>(null);
  const [sprintCount, setSprintCount] = React.useState(0);

  const [signals, setSignals] = React.useState<SignalProgress>({
    motivationsDone: false,
    strengthsDone: false,
    skillsDone: false,
    motivationsCount: 0,
    strengthsCount: 0,
    skillsCount: 0,
  });

  React.useEffect(() => {
    const snap = readOnboardingSnapshot();
    setSnapshot(snap);
    setQuote(pickStableSessionQuote());
    setSessionTiny(readSessionTinyState());

    setWeeklyFocus(readWeeklyFocus());
    setSprintCount(readSprints().length);

    const story = readStoryAnswersV3();
    setSignals(computeSignals(story));

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
      const nextSnap = readOnboardingSnapshot();
      setSnapshot(nextSnap);
      setSessionTiny(readSessionTinyState());

      setWeeklyFocus(readWeeklyFocus());
      setSprintCount(readSprints().length);

      const nextStory = readStoryAnswersV3();
      setSignals(computeSignals(nextStory));

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

  const { name, recap, confidence } = buildNarrativeRecap({ snapshot, placeLabel });

  const textMuted = dark ? "text-slate-300/85" : "text-slate-600";
  const textFaint = dark ? "text-slate-400" : "text-slate-500";
  const divider = dark ? "border-white/10" : "border-slate-900/10";

  const focusDone = Boolean(weeklyFocus?.vibe && weeklyFocus?.target);
  const sprintDoneThisSession = sessionTiny.completedIds.includes("curiosity_sprint");

  const openTask = (id: TinyTaskId) => {
    const s = readSessionTinyState();
    const shownIds: TinyTaskId[] = Array.from(new Set<TinyTaskId>([...(s.shownIds ?? []), id]));
    const next: SessionTinyState = { shownIds, completedIds: s.completedIds ?? [] };
    writeSessionTinyState(next);
    setSessionTiny(next);

    setActiveTaskId(id);
    setTaskOpen(true);
  };

  const closeTask = () => {
    setTaskOpen(false);
    setActiveTaskId(null);

    setSessionTiny(readSessionTinyState());
    setWeeklyFocus(readWeeklyFocus());
    setSprintCount(readSprints().length);

    const story = readStoryAnswersV3();
    setSignals(computeSignals(story));
  };

  // Decide the next “signal set” to do
  const nextSignal: SignalKey | "done" =
    !signals.motivationsDone ? "motivations" : !signals.strengthsDone ? "strengths" : !signals.skillsDone ? "skills" : "done";

  const nextHref =
    nextSignal === "done"
      ? "/main" // safe fallback; change to your next destination (Insights/Explore) when ready
      : `/main/questions?cat=${nextSignal}&returnTo=/main`;

  const nextLabel =
    nextSignal === "motivations"
      ? "Motivations"
      : nextSignal === "strengths"
        ? "Strengths"
        : nextSignal === "skills"
          ? "Skills"
          : "Next";

  const nextMicro =
    nextSignal === "motivations"
      ? "2 minutes. First signal. Sets your direction."
      : nextSignal === "strengths"
        ? "2 minutes. Second signal. Finds what you do best."
        : nextSignal === "skills"
          ? "2 minutes. Third signal. Turns growth into moves."
          : "You’ve built the core signals.";

  // Copy shifts once you’ve finished something (feels “earned”)
  const topNudge =
    nextSignal === "motivations"
      ? "A quick set to learn what actually drives you — so suggestions stop being generic."
      : nextSignal === "strengths"
        ? "Motivations captured. Next: strengths — so the guidance can match how you naturally win."
        : nextSignal === "skills"
          ? "Motivations + strengths captured. Next: skills — so the plan turns into momentum."
          : "Signals captured. Now it can start feeling personal.";

  const primaryBtnBase =
    "inline-flex items-center justify-center rounded-full border text-sm font-semibold transition active:scale-[0.99]";

  // Smaller, calmer control (not a big CTA)
  const primaryBtnClass = dark
    ? `${primaryBtnBase} border-white/12 bg-white/6 hover:bg-white/10 px-4 py-2.5`
    : `${primaryBtnBase} border-slate-900/10 bg-white/45 hover:bg-white/70 px-4 py-2.5`;

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="spotlight_orb"
      ambientCap={0.35}
    >
      <TaskRunnerModal open={taskOpen} onClose={closeTask} taskId={activeTaskId} snapshot={snapshot} dark={dark} />

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
              {/* TODAY marker first */}
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

              {/* Quote after TODAY */}
              {quote ? (
                <div className={`mb-4 text-sm ${textFaint}`}>
                  <span className="opacity-80">“</span>
                  <span className="italic">{quote.text}</span>
                  <span className="opacity-80">”</span>
                  <span className="ml-2 opacity-70">— {quote.author}</span>
                </div>
              ) : null}

              {/* Greeting */}
              <h1 className="text-xl font-semibold sm:text-2xl">{`Hey ${name}.`}</h1>

              <div className={`mt-2 space-y-3 text-sm leading-relaxed ${textMuted}`}>
                {recap ? (
                  <p>{recap}</p>
                ) : (
                  <p className="opacity-85">Onboarding snapshot isn’t here yet — no worries. A quick set will teach Everleap fast.</p>
                )}

                {confidence ? <p>{confidence}</p> : null}

                <p className="opacity-90">{topNudge}</p>
              </div>

              {/* Signals progress imagery */}
              <SignalsProgressStrip dark={dark} progress={signals} />

              {/* Primary next step */}
              <div className="mt-6">
                <div className={`mb-2 text-xs ${textFaint}`}>
                  {nextSignal === "done"
                    ? "You’ve finished the three core signal sets."
                    : `Next up: ${nextLabel}.`}
                </div>

                {nextSignal === "done" ? (
                  <Link href={nextHref} onClick={() => setPresenceSoft(true)} className={primaryBtnClass}>
                    See what this unlocked
                  </Link>
                ) : (
                  <Link href={nextHref} onClick={() => setPresenceSoft(true)} className={primaryBtnClass}>
                    Continue with {nextLabel}
                  </Link>
                )}

                <div className={`mt-2 text-xs ${textFaint}`}>{nextMicro}</div>
              </div>

              {/* Tiny tasks (step-based) */}
              <div className={`mt-7 border-t pt-4 ${divider}`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${textFaint}`}>Two tiny things you can do today</div>

                <div className="mt-4 space-y-5">
                  {/* Task 1: Weekly focus */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white/90">
                        Pick a focus for this week
                        {focusDone ? <span className="ml-2 text-xs font-semibold text-white/45">· saved</span> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => openTask("weekly_focus")}
                        className={`text-sm font-semibold underline underline-offset-4 transition ${
                          dark ? "text-slate-100/85 hover:text-white" : "text-slate-900 hover:text-slate-950"
                        }`}
                      >
                        {focusDone ? "Edit" : "Start"}
                      </button>
                    </div>

                    <div className={`text-sm ${textMuted}`}>A 45-second setup that makes Everleap’s next picks feel smarter.</div>

                    {focusDone && weeklyFocus ? (
                      <div className="mt-2 text-xs text-white/55">
                        Focus:{" "}
                        <span className="font-semibold text-white/80">
                          {weeklyFocus.vibe} + {weeklyFocus.target}
                        </span>
                        {weeklyFocus.sentence ? <span className="text-white/45"> · “{weeklyFocus.sentence}”</span> : null}
                      </div>
                    ) : null}
                  </div>

                  {/* Task 2: Curiosity sprint */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white/90">
                        10-minute curiosity sprint
                        {sprintDoneThisSession ? <span className="ml-2 text-xs font-semibold text-white/45">· saved</span> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => openTask("curiosity_sprint")}
                        className={`text-sm font-semibold underline underline-offset-4 transition ${
                          dark ? "text-slate-100/85 hover:text-white" : "text-slate-900 hover:text-slate-950"
                        }`}
                      >
                        Start
                      </button>
                    </div>

                    <div className={`text-sm ${textMuted}`}>Pick a prompt, explore a little, save one takeaway. That’s how Everleap learns you.</div>

                    {sprintCount > 0 ? (
                      <div className="mt-2 text-xs text-white/55">
                        Saved sprints: <span className="font-semibold text-white/75">{sprintCount}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
