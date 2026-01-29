// src/app/main/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
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

// Modal extracted (Step 1)
import {
  TaskRunnerModal,
  type TinyTaskId,
  type OnboardingSnapshot as ModalOnboardingSnapshot,
} from "./TaskRunnerModal";

// Reuse onboarding zip helpers (STATE only — no city callouts)
import { lookupZipPlace, stateFullName } from "../onboarding/zipLookup";

// ✅ App-layer VM builder
import { buildTodayViewModel } from "./app/buildTodayViewModel";

// ✅ Domain helpers for labels/links + retort assembly
import {
  hrefForSignal,
  signalLabel,
  continueButtonText,
  continueSubcopy,
} from "./domain/signals";
import { buildRetort } from "./domain/retort";

// ✅ Extracted UI modules
import { HowEverleapWorks } from "./components/HowEverleapWorks";
import { SignalsCard } from "./components/SignalsCard";
import { TodayIntro } from "./components/TodayIntro";

/* =============================================================================
   Session keys (only what page still owns)
   ============================================================================= */

// Zip -> state cache (session)
const ZIP_PLACE_SESSION_PREFIX = "everleap.zipPlace.v1:";

// Tiny task session state (page still writes this for now)
const TINY_TASKS_SESSION_KEY = "everleap.main.tiny.session.v1";

/* =============================================================================
   Types (page-local)
   ============================================================================= */

type SessionTinyState = {
  shownIds: TinyTaskId[];
  completedIds: TinyTaskId[];
};

/* =============================================================================
   Small utils
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

function getSnapshotName(snapshot: unknown): string {
  if (!snapshot || typeof snapshot !== "object") return "";
  const s = snapshot as { name?: unknown };
  return typeof s.name === "string" ? s.name : "";
}

function getSnapshotZip(snapshot: unknown): string {
  if (!snapshot || typeof snapshot !== "object") return "";
  const s = snapshot as { zip?: unknown };
  return typeof s.zip === "string" ? s.zip : "";
}

/* =============================================================================
   Zip -> STATE label (cached per session)
   ============================================================================= */

function zipCacheKey(zip5: string) {
  return `${ZIP_PLACE_SESSION_PREFIX}${zip5}`;
}

async function resolveHomeStateLabel(zip5: string): Promise<string | null> {
  if (!zip5) return null;
  if (typeof window === "undefined") return null;

  try {
    const cached = window.sessionStorage.getItem(zipCacheKey(zip5));
    if (cached) return cached;

    const place = await lookupZipPlace(zip5);
    if (!place) return null;

    // STATE ONLY (no city)
    const label = stateFullName(place.state);
    window.sessionStorage.setItem(zipCacheKey(zip5), label);
    return label;
  } catch {
    return null;
  }
}

/* =============================================================================
   Tiny task session state (page still writes this)
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

/* =============================================================================
   Page
   ============================================================================= */

export default function MainHomePage() {
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

  // ✅ VM state (single source)
  const [vm, setVm] = React.useState(() => buildTodayViewModel());

  // Hydration guards (vm is sourced from client storage; SSR won't match)
  const [mounted, setMounted] = React.useState(false);

  // Zip->state label (async; not in VM yet)
  const [homeState, setHomeState] = React.useState<string | null>(null);

  const [taskOpen, setTaskOpen] = React.useState(false);
  const [activeTaskId, setActiveTaskId] = React.useState<TinyTaskId | null>(null);

  React.useEffect(() => {
    setMounted(true);

    setVm(buildTodayViewModel());

    const onFocus = () => setVm(buildTodayViewModel());
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

  // Resolve homeState label when snapshot zip changes
  React.useEffect(() => {
    const zip5 = getSnapshotZip(vm.snapshot).trim();
    if (!zip5) {
      setHomeState(null);
      return;
    }

    let alive = true;
    void (async () => {
      const label = await resolveHomeStateLabel(zip5);
      if (alive) setHomeState(label);
    })();

    return () => {
      alive = false;
    };
  }, [vm.snapshot]);

  const name = niceName(getSnapshotName(vm.snapshot));

  const openTask = (id: TinyTaskId) => {
    const s = readSessionTinyState();
    const shownIds: TinyTaskId[] = Array.from(new Set<TinyTaskId>([...(s.shownIds ?? []), id]));
    const nextState: SessionTinyState = { shownIds, completedIds: s.completedIds ?? [] };
    writeSessionTinyState(nextState);

    setActiveTaskId(id);
    setTaskOpen(true);
  };

  const closeTask = () => {
    setTaskOpen(false);
    setActiveTaskId(null);

    // refresh VM after modal writes to storage
    setVm(buildTodayViewModel());
  };

  // Prefer session flag if present; guard in case vm shape changes during hydration
  const sprintDoneThisSession = !!vm?.sessionTiny?.completedIds?.includes("curiosity_sprint");

  // ✅ Rebuild retort with homeState (until we move zip lookup into VM/app layer)
  const retort = buildRetort({
    agentState: vm.agentState,
    nextKey: vm.nextKey,
    progress: vm.progress,
    snapshot: vm.snapshot,
    answers: vm.answers,
    homeState,
    weeklyFocus: vm.weeklyFocus,
    sprintCount: vm.sprintCount,
    sprintDoneThisSession,
  });

  const textMuted = dark ? "text-slate-300/85" : "text-slate-700";
  const textFaint = dark ? "text-slate-400" : "text-slate-500";

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

  return (
    <AppChrome
      themeId={themeId}
      setThemeId={setThemeId}
      gradientLevel={gradientLevel}
      setGradientLevel={setGradientLevel}
      orbSource="spotlight_orb"
      ambientCap={0.35}
    >
      <AnimatePresence>
        {taskOpen && activeTaskId ? (
          <TaskRunnerModal
            open={taskOpen}
            onClose={closeTask}
            taskId={activeTaskId}
            // ✅ Fix: TaskRunnerModal expects its own snapshot type
            snapshot={vm.snapshot as unknown as ModalOnboardingSnapshot | null}
            dark={dark}
          />
        ) : null}
      </AnimatePresence>

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
              <TodayIntro
                dark={dark}
                mounted={mounted}
                textFaintClass={textFaint}
                textMutedClass={textMuted}
                quote={vm.quote}
                name={name}
                retortKey={retort.key}
                retortParagraphs={retort.paragraphs.slice(0, 3)}
              />

              {/* Next up (BEFORE Signals) */}
              <div>
                <div className={`text-sm ${dark ? "text-white/70" : "text-slate-600"}`}>
                  Next up:{" "}
                  <span className={`font-semibold ${dark ? "text-white/90" : "text-slate-900"}`}>
                    {mounted ? signalLabel(vm.nextKey) : "…"}
                  </span>
                  .
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href={mounted ? hrefForSignal(vm.nextKey) : "#"}
                    onClick={() => setPresenceSoft(true)}
                    aria-disabled={!mounted}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.99] ${
                      dark
                        ? "bg-white/10 text-white hover:bg-white/14"
                        : "bg-slate-900 text-white hover:bg-slate-950"
                    } ${!mounted ? "pointer-events-none opacity-70" : ""}`}
                  >
                    {mounted ? continueButtonText(vm.nextKey) : "Continue"}
                  </Link>
                </div>

                <div className={`mt-2 text-xs ${dark ? "text-white/50" : "text-slate-500"}`}>
                  {mounted ? continueSubcopy(vm.nextKey, vm.progress) : "Loading your next step…"}
                </div>
              </div>

              {/* Signals */}
              {mounted ? (
                <SignalsCard dark={dark} progress={vm.progress} nextKey={vm.nextKey} />
              ) : (
                <div className="mt-3 h-28 rounded-2xl border border-transparent" aria-hidden />
              )}

              {/* How Everleap works */}
              <HowEverleapWorks dark={dark} textMutedClass={textMuted} />

              {/* Tiny Tasks */}
              {mounted ? (
                <TinyTasks tasks={tasks} onOpenTask={openTask} dark={dark} />
              ) : (
                <div className="mt-4 h-28" aria-hidden />
              )}

              <div className="h-3" />
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </AppChrome>
  );
}