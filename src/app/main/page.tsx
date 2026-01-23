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
const STORY_STORAGE_KEY = "everleap.story.answers.v1";

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

type StoryAnswers = Record<string, { answer?: string; skipped?: boolean }>;

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
  return safeJsonParse<OnboardingSnapshot>(
    window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
  );
}

function readStoryAnswers(): StoryAnswers | null {
  if (typeof window === "undefined") return null;
  return safeJsonParse<StoryAnswers>(window.localStorage.getItem(STORY_STORAGE_KEY));
}

function countAnsweredStory(answers: StoryAnswers | null): number {
  if (!answers || typeof answers !== "object") return 0;
  let n = 0;
  for (const v of Object.values(answers)) {
    const ans = (v?.answer ?? "").trim();
    const skipped = Boolean(v?.skipped);
    if (!skipped && ans.length > 0) n += 1;
  }
  return n;
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
  { text: "What you do makes a difference. And you have to decide what kind of difference you want to make.", author: "Jane Goodall" },
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

function buildNarrativeRecap(args: {
  snapshot: OnboardingSnapshot | null;
  placeLabel: string | null;
}) {
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

  if (snapshot.situation === "high_school") fragments.push("you’re in high school");
  else if (snapshot.situation === "young_adult") fragments.push("you’re a young adult (18–24)");

  const plans = (snapshot.postPlans ?? []).filter(Boolean);
  if (plans.length > 0) {
    if (plans.includes("no_idea")) fragments.push("you’re keeping options open for what comes next");
    else {
      const planText = joinNatural(plans.map(postPlanLabel));
      if (planText) fragments.push(`you’re considering ${planText}`);
    }
  }

  const activities = (snapshot.activities ?? []).filter(Boolean);
  if (activities.length > 0) {
    const listText = joinNatural(activities.map(activityLabel));
    if (listText) fragments.push(`outside of school you’re into ${listText}`);
  }

  if (placeLabel) fragments.push(`you’re in ${placeLabel}`);
  else if ((snapshot.zip ?? "").trim()) fragments.push("you shared a zip, so I can lean local when it matters");

  const fun = funTag(snapshot.funChoice ?? null);
  if (fun) fragments.push(`and you picked ${fun}`);

  const recap =
    fragments.length > 0
      ? `Right now, all I know about you is what you told me in onboarding — and here’s what I’m hearing: ${joinNatural(
          fragments
        )}.`
      : null;

  let confidence: string | null = null;
  if (snapshot.certainty === "strong")
    confidence = "You’ve got a pretty clear direction — we can move faster.";
  else if (snapshot.certainty === "kinda")
    confidence = "You’ve got some ideas — enough to narrow quickly.";
  else if (snapshot.certainty === "no_clue")
    confidence = "You’re not sure yet — totally normal. We’ll explore smart, not random.";

  return { name, recap, confidence };
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
            className={`h-[6px] w-[14px] rounded-full transition ${
              on ? "bg-white/70" : "bg-white/18"
            }`}
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
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition active:scale-[0.99] ${
              selected
                ? "border-white/35 bg-white/10 text-white"
                : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
            }`}
            aria-pressed={selected}
          >
            {o}
          </button>
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

  // Keep prompts short and *doable*.
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

    // Reset stepper each open
    setStep(0);

    // Prime with existing focus (optional)
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

    // Sprint defaults
    setLane("jobs");
    setPrompt(prompts[0] ?? "");
    setTakeaway("");
  }, [open, taskId, prompts]);

  const surface = dark
    ? "border-white/12 bg-black/35"
    : "border-slate-900/10 bg-white/45";

  const overlay = dark ? "bg-black/55" : "bg-black/35";

  const close = () => {
    onClose();
  };

  const primaryBtn =
    "inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99]";

  const primaryBtnClass = dark
    ? `${primaryBtn} border-white/12 bg-white/8 hover:bg-white/12 text-white`
    : `${primaryBtn} border-slate-900/10 bg-white/70 hover:bg-white text-slate-900`;

  const subtleBtnClass = dark
    ? "text-white/70 hover:text-white/90"
    : "text-slate-700 hover:text-slate-950";

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
    const completedIds: TinyTaskId[] = Array.from(
      new Set<TinyTaskId>([...(s.completedIds ?? []), "weekly_focus"])
    );
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(3); // completion
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
    const completedIds: TinyTaskId[] = Array.from(
      new Set<TinyTaskId>([...(s.completedIds ?? []), "curiosity_sprint"])
    );
    writeSessionTinyState({ shownIds: s.shownIds ?? [], completedIds });

    setStep(4); // completion
  }

  function renderWeeklyFocus() {
    // Steps: 0 vibe -> 1 target -> 2 sentence -> 3 done
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
            <p className="mt-2 text-sm text-white/70">
              Pick one vibe. This helps me steer what I suggest.
            </p>
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
            <p className="mt-2 text-sm text-white/70">
              Keep it simple. You can leave this blank.
            </p>
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
              I’ll steer today’s picks toward <span className="font-semibold text-white">{vibe}</span> +
              <span className="font-semibold text-white"> {target}</span>.
            </p>
            {sentence.trim() ? (
              <p className="mt-3 text-sm text-white/70">“{sentence.trim()}”</p>
            ) : null}

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
    // Steps: 0 pick lane -> 1 pick prompt -> 2 do it (mini) -> 3 takeaway -> 4 done
    const total = 5;

    const laneOptions: { id: CuriositySprintState["lane"]; label: string }[] = [
      { id: "jobs", label: "Jobs" },
      { id: "majors", label: "Majors" },
      { id: "skills", label: "Skills" },
      { id: "experiments", label: "Life experiments" },
    ];

    const suggested = prompts.slice(0, 3);
    const canNext =
      (step === 0 && Boolean(lane)) ||
      (step === 1 && Boolean((prompt ?? "").trim())) ||
      step === 2 ||
      (step === 3 && takeaway.trim().length > 0);

    const nextLabel =
      step === 3 ? "Save takeaway" : step === 2 ? "I did it" : "Next";

    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className={labelClass}>Tiny task · Curiosity sprint</div>
          <StepDots step={step} total={total} />
        </div>

        {step === 0 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Pick a lane for 10 minutes.</h2>
            <p className="mt-2 text-sm text-white/70">No commitment. Just signal.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {laneOptions.map((o) => {
                const selected = lane === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setLane(o.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition active:scale-[0.99] ${
                      selected
                        ? "border-white/35 bg-white/10 text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
                    }`}
                    aria-pressed={selected}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Here’s a prompt.</h2>
            <p className="mt-2 text-sm text-white/70">
              Pick one. You can edit it if you want.
            </p>

            <div className="mt-4 space-y-2">
              {suggested.map((p) => {
                const selected = prompt === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-white/25 bg-white/8 text-white"
                        : "border-white/12 bg-white/5 text-white/75 hover:bg-white/8 hover:text-white/85"
                    }`}
                  >
                    {p}
                  </button>
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
            <p className="mt-2 text-sm text-white/70">
              Set a 10-minute timer on your phone. Then come back and tell me one thing you noticed.
            </p>

            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Your prompt
              </div>
              <div className="mt-2">{prompt.trim() || suggested[0] || "Find one interesting thing."}</div>
            </div>

            <div className="mt-4 text-xs text-white/50">
              (This stays minimalist: no in-app timer yet — just the behavior.)
            </div>
          </>
        ) : step === 3 ? (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">What’s your takeaway?</h2>
            <p className="mt-2 text-sm text-white/70">One sentence is enough.</p>

            <MinimalLineInput
              value={takeaway}
              onChange={setTakeaway}
              placeholder="I noticed that…"
              onEnter={() => completeSprint()}
            />
            <div className="mt-4 text-xs text-white/55">
              This gets saved so the agent can reference it later.
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold text-white">Nice.</h2>
            <p className="mt-2 text-sm text-white/75">
              That’s a real signal. I’ll remember it.
            </p>

            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Saved takeaway
              </div>
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
            initial={{ y: 18, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full max-w-xl overflow-hidden rounded-[28px] border ${surface} backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-sm font-semibold text-white/85">Everleap</div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white/90 hover:bg-white/8 transition"
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pb-6">
              {taskId === "weekly_focus" ? renderWeeklyFocus() : renderCuriositySprint()}
            </div>
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
  const theme =
    INSIGHTS_THEMES.find((t) => t.id === themeId) ?? INSIGHTS_THEMES[0];

  // Orb glow fallback (keeps this file robust if theme shape changes)
  const orbGlowClass =
    "orbGlowClass" in (theme as unknown as Record<string, unknown>)
      ? String((theme as unknown as { orbGlowClass?: string }).orbGlowClass ?? "")
      : dark
      ? "bg-sky-400/25"
      : "bg-amber-300/30";

  // Presence softens after scroll
  const [presenceSoft, setPresenceSoft] = React.useState(false);

  // Snapshot + story
  const [snapshot, setSnapshot] = React.useState<OnboardingSnapshot | null>(null);
  const [storyAnswered, setStoryAnswered] = React.useState(0);

  // Zip place label
  const [placeLabel, setPlaceLabel] = React.useState<string | null>(null);

  // Quote (stable per session)
  const [quote, setQuote] = React.useState<Quote | null>(null);

  // Tiny task runner
  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  // Session tiny state (to mark “done this session”)
  const [sessionTiny, setSessionTiny] = React.useState<SessionTinyState>({
    shownIds: [],
    completedIds: [],
  });

  React.useEffect(() => {
    const snap = readOnboardingSnapshot();
    setSnapshot(snap);
    setStoryAnswered(countAnsweredStory(readStoryAnswers()));
    setQuote(pickStableSessionQuote());
    setSessionTiny(readSessionTinyState());

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
      const next = readOnboardingSnapshot();
      setSnapshot(next);
      setStoryAnswered(countAnsweredStory(readStoryAnswers()));
      setSessionTiny(readSessionTinyState());

      const z = (next?.zip ?? "").trim();
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

  const firstArrival = storyAnswered === 0;

  // Tiny tasks (now “real” via inline step flows)
  const focusExisting = typeof window !== "undefined" ? readWeeklyFocus() : null;
  const focusDone = Boolean(focusExisting?.vibe && focusExisting?.target);

  const sprintCount = typeof window !== "undefined" ? readSprints().length : 0;
  const sprintDoneThisSession = sessionTiny.completedIds.includes("curiosity_sprint");

  const openTask = (id: TinyTaskId) => {
    const s = readSessionTinyState();
    const shownIds: TinyTaskId[] = Array.from(
      new Set<TinyTaskId>([...(s.shownIds ?? []), id])
    );
    const next: SessionTinyState = { shownIds, completedIds: s.completedIds ?? [] };
    writeSessionTinyState(next);
    setSessionTiny(next);

    setActiveTaskId(id);
    setTaskOpen(true);
  };

  const closeTask = () => {
    setTaskOpen(false);
    setActiveTaskId(null);
    // refresh session state (completion writes to sessionStorage inside modal)
    setSessionTiny(readSessionTinyState());
  };

  const primaryNextHref =
    storyAnswered === 0 ? "/main/questions?focus=motivation" : "/main/questions?focus=strengths";
  const primaryNextLabel =
    storyAnswered === 0 ? "Start with motivation" : "Add your strengths";

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
                {firstArrival ? <p>You just finished getting set up.</p> : null}

                {recap ? (
                  <p>{recap}</p>
                ) : (
                  <p className="opacity-85">I don’t see your onboarding snapshot yet — no worries. We can start fresh.</p>
                )}

                {confidence ? <p>{confidence}</p> : null}

                <p className="opacity-90">
                  Next, I’ll learn a little more through short question sets (like motivation and strengths) — and I’ll use that
                  to guide you through insights, explorations, and real-world tiny actions.
                </p>
              </div>

              {/* Primary next step (still allowed, but it’s framed) */}
              <div className="mt-6">
                <div className={`mb-2 text-xs ${textFaint}`}>
                  {storyAnswered === 0
                    ? "Motivation is the cleanest starting point — it makes everything else land better."
                    : "Strengths makes your next options feel way more “you.”"}
                </div>
                <Link
                  href={primaryNextHref}
                  onClick={() => setPresenceSoft(true)}
                  className={`inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    dark
                      ? "border-white/12 bg-white/6 hover:bg-white/10"
                      : "border-slate-900/10 bg-white/40 hover:bg-white/65"
                  }`}
                >
                  {primaryNextLabel}
                </Link>
              </div>

              {/* Tiny tasks (now step-based, not “link cards”) */}
              <div className={`mt-7 border-t pt-4 ${divider}`}>
                <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${textFaint}`}>
                  Two tiny things you can do today
                </div>

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

                    <div className={`text-sm ${textMuted}`}>
                      A 45-second setup that makes the agent feel smarter immediately.
                    </div>

                    {focusDone && focusExisting ? (
                      <div className="mt-2 text-xs text-white/55">
                        Focus:{" "}
                        <span className="font-semibold text-white/80">
                          {focusExisting.vibe} + {focusExisting.target}
                        </span>
                        {focusExisting.sentence ? <span className="text-white/45"> · “{focusExisting.sentence}”</span> : null}
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

                    <div className={`text-sm ${textMuted}`}>
                      Pick a prompt, do a tiny explore, save one takeaway. That’s how the agent learns you.
                    </div>

                    {sprintCount > 0 ? (
                      <div className="mt-2 text-xs text-white/55">
                        Saved sprints: <span className="font-semibold text-white/75">{sprintCount}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Intentionally no “you can still use the bottom nav” copy per your request */}
              </div>
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}
