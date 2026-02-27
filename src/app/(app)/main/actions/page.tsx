// src/app/main/actions/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  ListChecks,
  Pause,
  Play,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { isDarkTheme, type SpotlightThemeId } from "@/theme/everleapVisuals";

/* ============================================================
   Types
   ============================================================ */

type InsightId =
  | "career"
  | "motivations"
  | "strengths"
  | "skills"
  | "friends"
  | "family";

type ExploreId = "education" | "travel" | "local" | "aid";

type ActionStatus = "todo" | "doing" | "done" | "snoozed";

type FollowUpRating = "energizing" | "neutral" | "draining";

type ActionItem = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  status: ActionStatus;

  goalId?: string;
  insightId?: InsightId;
  exploreId?: ExploreId;

  createdAt: string;
  doneAt?: string;

  followUp?: {
    rating: FollowUpRating;
    note?: string;
  };
};

type GoalItem = {
  id: string;
  title: string;
  horizon: "This week" | "This month" | "This semester";
  actionIds: string[];
};

/* ============================================================
   Storage
   ============================================================ */

const STORAGE_KEY = "everleap.actions.v1";

type StoredState = {
  actions: ActionItem[];
  goals: GoalItem[];
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function loadState(): StoredState | null {
  if (typeof window === "undefined") return null;
  return safeParse<StoredState>(window.localStorage.getItem(STORAGE_KEY));
}

function saveState(state: StoredState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

/* ============================================================
   “Knowledge” maps: align chips + rails with Insights/Explore
   ============================================================ */

const INSIGHT_META: Record<InsightId, { label: string; glowClass: string; dotClass: string }> = {
  career: {
    label: "Recommendations",
    glowClass: "from-sky-400 via-indigo-500 to-slate-400",
    dotClass: "bg-gradient-to-br from-sky-400 via-indigo-500 to-slate-400",
  },
  motivations: {
    label: "Motivations",
    glowClass: "from-amber-400 via-orange-500 to-rose-500",
    dotClass: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
  },
  strengths: {
    label: "Strengths",
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    dotClass: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400",
  },
  skills: {
    label: "Skills",
    glowClass: "from-cyan-400 via-sky-500 to-indigo-500",
    dotClass: "bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500",
  },
  friends: {
    label: "Friends",
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    dotClass: "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400",
  },
  family: {
    label: "Family",
    glowClass: "from-rose-400 via-amber-400 to-fuchsia-500",
    dotClass: "bg-gradient-to-br from-rose-400 via-amber-400 to-fuchsia-500",
  },
};

const EXPLORE_META: Record<ExploreId, { label: string; glowClass: string; dotClass: string }> = {
  education: {
    label: "Education & Training",
    glowClass: "from-violet-500 via-fuchsia-500 to-sky-400",
    dotClass: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400",
  },
  travel: {
    label: "Travel",
    glowClass: "from-sky-400 via-cyan-400 to-indigo-500",
    dotClass: "bg-gradient-to-br from-sky-400 via-cyan-400 to-indigo-500",
  },
  local: {
    label: "Local opportunities",
    glowClass: "from-emerald-400 via-teal-400 to-sky-400",
    dotClass: "bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400",
  },
  aid: {
    label: "Financial assistance",
    glowClass: "from-amber-400 via-orange-400 to-rose-400",
    dotClass: "bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400",
  },
};

function chipClass(dark: boolean) {
  return dark
    ? "border-white/10 bg-white/5 text-slate-100"
    : "border-slate-200 bg-white/80 text-slate-800";
}

/* ============================================================
   Seed data (simple + obviously placeholder)
   ============================================================ */

function seedState(): StoredState {
  const g1: GoalItem = {
    id: "g_clarity",
    title: "Get clearer on careers that fit me",
    horizon: "This month",
    actionIds: [],
  };
  const g2: GoalItem = {
    id: "g_energy",
    title: "Build better momentum (less busywork)",
    horizon: "This week",
    actionIds: [],
  };

  const a1: ActionItem = {
    id: "a_pick_lane",
    title: "Pick 1 lane to test",
    description:
      "Choose ONE direction (Product/UX, Helping roles, Education/Programs, Builder). Not a forever choice—just a test.",
    minutes: 10,
    status: "todo",
    goalId: g1.id,
    insightId: "career",
    exploreId: "education",
    createdAt: new Date().toISOString(),
  };

  const a2: ActionItem = {
    id: "a_one_convo",
    title: "Do 1 real conversation",
    description:
      "Message one person who’s doing something interesting and ask what they love + what’s brutal.",
    minutes: 20,
    status: "todo",
    goalId: g1.id,
    insightId: "career",
    exploreId: "local",
    createdAt: new Date().toISOString(),
  };

  const a3: ActionItem = {
    id: "a_delete_fake",
    title: "Delete one fake task",
    description:
      "Pick one thing you’re doing for appearances and drop it (or shrink it). Replace it with one real, small move.",
    minutes: 15,
    status: "todo",
    goalId: g2.id,
    insightId: "motivations",
    createdAt: new Date().toISOString(),
  };

  const a4: ActionItem = {
    id: "a_proof_30",
    title: "Make a 30-minute proof",
    description:
      "Build something small (a draft, sketch, plan, mini-tool). Output beats notes.",
    minutes: 30,
    status: "todo",
    goalId: g2.id,
    insightId: "skills",
    createdAt: new Date().toISOString(),
  };

  g1.actionIds = [a1.id, a2.id];
  g2.actionIds = [a3.id, a4.id];

  return { actions: [a1, a2, a3, a4], goals: [g1, g2] };
}

/* ============================================================
   Generators (placeholder logic; later your agent replaces this)
   ============================================================ */

function generateFromInsights(): ActionItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid("ai"),
      title: "Define one win-condition",
      description:
        "Take one thing you’re avoiding and write: “Done means ___.” Keep it measurable and small.",
      minutes: 10,
      status: "todo",
      insightId: "motivations",
      createdAt: now,
    },
    {
      id: uid("ai"),
      title: "Ask 2 people what you make look easy",
      description:
        "Text two people: “What do I make look easy?” The overlap is a real strength.",
      minutes: 15,
      status: "todo",
      insightId: "strengths",
      createdAt: now,
    },
    {
      id: uid("ai"),
      title: "Stack 2 skills for one mini output",
      description:
        "Pair a skill you already have with one new tool and make a tiny artifact you can show someone.",
      minutes: 25,
      status: "todo",
      insightId: "skills",
      createdAt: now,
    },
  ];
}

function generateFromExplore(): ActionItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid("ax"),
      title: "Find 2 programs worth testing",
      description:
        "Search for 2 short programs (certificate/community college/bootcamp). Save links + why each is interesting.",
      minutes: 20,
      status: "todo",
      exploreId: "education",
      createdAt: now,
    },
    {
      id: uid("ax"),
      title: "Pick one local door and message it",
      description:
        "Choose one local opportunity (club, volunteer org, internship). Send a short “How can I start?” message.",
      minutes: 15,
      status: "todo",
      exploreId: "local",
      createdAt: now,
    },
    {
      id: uid("ax"),
      title: "Apply to one “money support” thing",
      description:
        "Scholarship, fee waiver, small grant—just one. Completed beats perfect.",
      minutes: 25,
      status: "todo",
      exploreId: "aid",
      createdAt: now,
    },
  ];
}

/* ============================================================
   Component
   ============================================================ */

export default function ActionsPage() {
  // IMPORTANT: AppChrome + BottomNav are handled by the /main layout.
  // This page should only render the page content (prevents double header/nav).
  const themeId: SpotlightThemeId = "nightDusk";
  const dark = isDarkTheme(themeId);

  const surface = [
    "relative rounded-[32px] border backdrop-blur-xl",
    dark
      ? "border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
      : "border-slate-200 bg-white/80 shadow-[0_16px_45px_rgba(0,0,0,0.18)]",
  ].join(" ");

  const sectionLabelClass = dark
    ? "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300/60"
    : "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-600/70";

  const muted = dark ? "text-slate-300/90" : "text-slate-600";

  const [mounted, setMounted] = React.useState(false);
  const [state, setState] = React.useState<StoredState>(() => seedState());

  // follow-up sheet state
  const [followOpen, setFollowOpen] = React.useState(false);
  const [followActionId, setFollowActionId] = React.useState<string | null>(null);
  const [followRating, setFollowRating] = React.useState<FollowUpRating>("energizing");
  const [followNote, setFollowNote] = React.useState("");

  // lightweight collapse for “why this is here”
  const [whyOpen, setWhyOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const loaded = loadState();
    if (loaded?.actions?.length && loaded?.goals?.length) setState(loaded);
    else {
      const seeded = seedState();
      setState(seeded);
      saveState(seeded);
    }
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    saveState(state);
  }, [state, mounted]);

  function updateAction(id: string, patch: Partial<ActionItem>) {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }

  function startAction(id: string) {
    updateAction(id, { status: "doing" });
  }

  function snoozeAction(id: string) {
    updateAction(id, { status: "snoozed" });
  }

  function markDone(id: string) {
    // Open follow-up sheet (this is the personalization loop)
    setFollowActionId(id);
    setFollowRating("energizing");
    setFollowNote("");
    setFollowOpen(true);

    // Optimistically mark done; follow-up attaches after submit
    updateAction(id, { status: "done", doneAt: new Date().toISOString() });
  }

  function saveFollowUp() {
    if (!followActionId) {
      setFollowOpen(false);
      return;
    }

    updateAction(followActionId, {
      followUp: { rating: followRating, note: followNote.trim() ? followNote.trim() : undefined },
    });

    setFollowOpen(false);
    setFollowActionId(null);
    setFollowNote("");
  }

  function closeFollowUp() {
    setFollowOpen(false);
    setFollowActionId(null);
  }

  function addGenerated(kind: "insights" | "explore") {
    const additions = kind === "insights" ? generateFromInsights() : generateFromExplore();

    setState((prev) => {
      // Attach generated actions to a sensible default goal if possible:
      const gClarity = prev.goals.find((g) => g.id === "g_clarity");
      const gEnergy = prev.goals.find((g) => g.id === "g_energy");
      const targetGoal = kind === "explore" ? gClarity : gEnergy;

      const actionsWithGoal = targetGoal ? additions.map((a) => ({ ...a, goalId: targetGoal.id })) : additions;

      const nextGoals = prev.goals.map((g) => {
        if (!targetGoal) return g;
        if (g.id !== targetGoal.id) return g;
        return { ...g, actionIds: [...g.actionIds, ...actionsWithGoal.map((a) => a.id)] };
      });

      return {
        goals: nextGoals,
        actions: [...actionsWithGoal, ...prev.actions], // newest on top
      };
    });
  }

  // “This Week” = todo/doing first; snoozed last; done last-last
  const sortedActions = React.useMemo(() => {
    const score = (s: ActionStatus) => {
      if (s === "doing") return 0;
      if (s === "todo") return 1;
      if (s === "snoozed") return 2;
      return 3; // done
    };
    return [...state.actions].sort((a, b) => score(a.status) - score(b.status));
  }, [state.actions]);

  const thisWeek = sortedActions.slice(0, 5);

  function goalProgress(g: GoalItem) {
    const items = g.actionIds
      .map((id) => state.actions.find((a) => a.id === id))
      .filter(Boolean) as ActionItem[];
    const total = items.length || 0;
    const done = items.filter((a) => a.status === "done").length;
    return { total, done };
  }

  function railForAction(a: ActionItem) {
    if (a.insightId) return `bg-gradient-to-b ${INSIGHT_META[a.insightId].glowClass}`;
    if (a.exploreId) return `bg-gradient-to-b ${EXPLORE_META[a.exploreId].glowClass}`;
    return dark ? "bg-white/10" : "bg-slate-200";
  }

  function pillForInsight(id: InsightId) {
    const meta = INSIGHT_META[id];
    return (
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${chipClass(dark)}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dotClass} opacity-90`} />
        {meta.label}
      </span>
    );
  }

  function pillForExplore(id: ExploreId) {
    const meta = EXPLORE_META[id];
    return (
      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${chipClass(dark)}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dotClass} opacity-90`} />
        {meta.label}
      </span>
    );
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-28 pt-5 md:px-8 md:pt-7">
        {/* Header / framing */}
        <section className="mb-5">
          <div className={`px-6 py-6 sm:px-7 sm:py-7 ${surface}`}>
            <div
              className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-white/10 to-transparent blur-3xl"
              style={{ opacity: dark ? 0.16 : 0.12 }}
              aria-hidden
            />

            <div className="relative">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    dark ? "border-white/10 bg-white/5 text-slate-50" : "border-slate-200 bg-white/80 text-slate-900"
                  }`}
                >
                  <ListChecks className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className={sectionLabelClass}>Actions</div>
                  <h1 className={`mt-1 text-2xl font-semibold tracking-tight ${dark ? "text-slate-50" : "text-slate-900"}`}>
                    Turn insights into real steps.
                  </h1>
                  <p className={`mt-2 max-w-2xl text-sm ${muted}`}>
                    This is your “execution layer.” Small actions, tied to goals, tied to what you’re learning in Insights + Explore.
                    Do → reflect → calibrate.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/main/carousel"
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                      dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    Insights
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/main/explore"
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                      dark ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10" : "border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setWhyOpen((o) => !o)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    dark ? "border-white/10 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70" : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                  }`}
                  aria-expanded={whyOpen}
                >
                  Why this works
                  <ChevronDown className={`h-4 w-4 transition-transform ${whyOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {whyOpen ? (
                <div
                  className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
                    dark ? "border-white/10 bg-slate-950/40 text-slate-200/90" : "border-slate-200 bg-white/70 text-slate-700"
                  }`}
                >
                  <div className="font-semibold">The loop</div>
                  <div className={`mt-2 ${muted}`}>
                    1) Insights give you a hypothesis about you. <br />
                    2) Explore shows doors that match. <br />
                    3) Actions create proof: you do something small, then rate how it felt. That feedback sharpens everything.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* This Week */}
        <section className="mb-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <div className={sectionLabelClass}>This week</div>
              <div className={`mt-1 text-sm ${muted}`}>3–5 small moves. Keep it light. Keep it real.</div>
            </div>

            <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-600/70"}`}>
              Tip: try one <span className="font-semibold">10–20m</span> action today.
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {thisWeek.map((a) => {
              const rail = railForAction(a);

              return (
                <div
                  key={a.id}
                  className={`relative overflow-hidden rounded-3xl border p-[1px] ${
                    dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
                  }`}
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute left-0 top-4 h-[70%] w-[3px] rounded-full ${rail} opacity-90`}
                  />

                  <div className={`relative rounded-3xl px-5 py-4 ${dark ? "bg-slate-950/35" : "bg-white/70"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className={`text-base font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                            {a.title}
                          </div>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {a.minutes}m
                          </span>

                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${
                              a.status === "doing"
                                ? dark
                                  ? "border-sky-200/20 bg-sky-300/15 text-sky-100"
                                  : "border-sky-200 bg-sky-50 text-sky-900"
                                : a.status === "done"
                                ? dark
                                  ? "border-emerald-200/20 bg-emerald-300/15 text-emerald-100"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
                                : a.status === "snoozed"
                                ? dark
                                  ? "border-amber-200/20 bg-amber-300/15 text-amber-100"
                                  : "border-amber-200 bg-amber-50 text-amber-900"
                                : dark
                                ? "border-white/10 bg-white/5 text-slate-100"
                                : "border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            {a.status === "doing"
                              ? "In progress"
                              : a.status === "done"
                              ? "Done"
                              : a.status === "snoozed"
                              ? "Snoozed"
                              : "To do"}
                          </span>
                        </div>

                        <div className={`mt-2 text-sm ${muted}`}>{a.description}</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {a.goalId ? (
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${chipClass(dark)}`}>
                              <Target className="h-3.5 w-3.5 opacity-80" />
                              Goal
                            </span>
                          ) : null}

                          {a.insightId ? pillForInsight(a.insightId) : null}
                          {a.exploreId ? pillForExplore(a.exploreId) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {a.status !== "done" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => startAction(a.id)}
                              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                                dark
                                  ? "bg-sky-300 text-slate-950 hover:bg-sky-200 shadow-[0_10px_30px_rgba(56,189,248,0.25)]"
                                  : "bg-sky-600 text-white hover:bg-sky-500"
                              }`}
                            >
                              <Play className="h-4 w-4" /> Start
                            </button>

                            <button
                              type="button"
                              onClick={() => markDone(a.id)}
                              className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                                dark
                                  ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                                  : "border-slate-200 bg-white/85 text-slate-800 hover:bg-white"
                              }`}
                            >
                              <Check className="h-4 w-4" /> Done
                            </button>

                            <button
                              type="button"
                              onClick={() => snoozeAction(a.id)}
                              className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                                dark
                                  ? "border-white/10 bg-slate-950/40 text-slate-200 hover:bg-slate-950/70"
                                  : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                              }`}
                            >
                              <Pause className="h-4 w-4" /> Snooze
                            </button>
                          </>
                        ) : (
                          <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-600/70"}`}>
                            {a.followUp?.rating ? (
                              <>
                                Felt:{" "}
                                <span className="font-semibold">
                                  {a.followUp.rating === "energizing"
                                    ? "Energizing"
                                    : a.followUp.rating === "neutral"
                                    ? "Neutral"
                                    : "Draining"}
                                </span>
                              </>
                            ) : (
                              "Done ✔"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Goals */}
        <section className="mb-6">
          <div className="mb-3">
            <div className={sectionLabelClass}>Goals</div>
            <div className={`mt-1 text-sm ${muted}`}>Goals are just containers. Actions are the real game.</div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {state.goals.map((g) => {
              const prog = goalProgress(g);
              const pct = prog.total > 0 ? Math.round((prog.done / prog.total) * 100) : 0;

              return (
                <div key={g.id} className={`rounded-3xl border px-5 py-4 ${surface}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${
                            dark ? "border-white/10 bg-white/5 text-slate-50" : "border-slate-200 bg-white/80 text-slate-900"
                          }`}
                        >
                          <Target className="h-4 w-4" />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${dark ? "text-slate-50" : "text-slate-900"}`}>
                            {g.title}
                          </div>
                          <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-600/70"}`}>
                            {g.horizon} • {prog.done}/{prog.total} actions
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs font-semibold ${dark ? "text-slate-200/70" : "text-slate-700/70"}`}>{pct}%</div>
                  </div>

                  <div className="mt-3">
                    <div className={`h-2 w-full rounded-full ${dark ? "bg-white/10" : "bg-slate-200/70"}`}>
                      <div className="h-2 rounded-full bg-sky-300 transition" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.actionIds.slice(0, 3).map((id) => {
                      const a = state.actions.find((x) => x.id === id);
                      if (!a) return null;
                      return (
                        <span
                          key={id}
                          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                            a.status === "done"
                              ? dark
                                ? "border-emerald-200/20 bg-emerald-300/15 text-emerald-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-900"
                              : chipClass(dark)
                          }`}
                          title={a.title}
                        >
                          {a.status === "done" ? "✓ " : ""}
                          {a.title.length > 28 ? `${a.title.slice(0, 28)}…` : a.title}
                        </span>
                      );
                    })}
                    {g.actionIds.length > 3 ? (
                      <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${chipClass(dark)}`}>
                        +{g.actionIds.length - 3} more
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Generator */}
        <section className="mb-2">
          <div className="mb-3">
            <div className={sectionLabelClass}>Generate actions</div>
            <div className={`mt-1 text-sm ${muted}`}>
              Quick suggestions (placeholder logic). Later this comes from your real Insights + Explore data.
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => addGenerated("insights")}
              className={`rounded-3xl border px-5 py-5 text-left transition hover:translate-y-[-1px] active:scale-[0.99] ${
                dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white/80 text-slate-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    dark ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white"
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Give me 3 actions from my Insights</div>
                  <div className={`mt-1 text-sm ${muted}`}>Turns your patterns into tiny experiments (momentum-friendly).</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => addGenerated("explore")}
              className={`rounded-3xl border px-5 py-5 text-left transition hover:translate-y-[-1px] active:scale-[0.99] ${
                dark ? "border-white/10 bg-white/5 text-slate-100" : "border-slate-200 bg-white/80 text-slate-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    dark ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white"
                  }`}
                >
                  <Target className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">Give me 3 actions from Explore</div>
                  <div className={`mt-1 text-sm ${muted}`}>Turns doors into moves (programs, local opportunities, money support).</div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className={`text-xs ${dark ? "text-slate-300/60" : "text-slate-600/70"}`}>Want a clean slate?</div>

            <button
              type="button"
              onClick={() => {
                const seeded = seedState();
                setState(seeded);
                saveState(seeded);
              }}
              className={`text-xs font-semibold ${dark ? "text-slate-200/70 hover:text-slate-50" : "text-slate-700/70 hover:text-slate-900"}`}
            >
              Reset Actions
            </button>
          </div>
        </section>
      </div>

      {/* =========================================================
         Follow-up sheet (post-action calibration)
         ========================================================= */}
      {followOpen ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            onClick={closeFollowUp}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
          />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl md:inset-0 md:flex md:items-center md:justify-center">
            <div
              className="relative w-full rounded-t-[28px] border border-white/10 bg-slate-950/85 shadow-[0_45px_140px_rgba(0,0,0,0.72)] backdrop-blur-2xl md:rounded-[28px] md:max-h-[82vh]"
              role="dialog"
              aria-modal="true"
              aria-label="Action follow up"
            >
              <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-2xl md:rounded-t-[28px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/70">
                      Quick follow-up
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-50">How did that feel?</div>
                    <div className="mt-1 text-sm text-slate-300/80">
                      This is how Everleap gets smarter without turning your life into homework.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeFollowUp}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 active:scale-95"
                    aria-label="Close"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="px-5 pb-6 pt-4">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-100">Pick one</div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["energizing", "⚡ Energizing"],
                        ["neutral", "😐 Neutral"],
                        ["draining", "🥱 Draining"],
                      ] as Array<[FollowUpRating, string]>
                    ).map(([val, label]) => {
                      const active = followRating === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFollowRating(val)}
                          className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                            active
                              ? "border-sky-200/20 bg-sky-300/15 text-sky-100"
                              : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <div className="text-sm font-semibold text-slate-100">One sentence (optional)</div>
                    <textarea
                      value={followNote}
                      onChange={(e) => setFollowNote(e.target.value)}
                      rows={3}
                      placeholder="What did you learn? What made it easy/hard?"
                      className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400/70"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={saveFollowUp}
                      className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-300/40 hover:bg-amber-200 active:scale-[0.99]"
                    >
                      Save
                    </button>
                    <div className="mt-2 text-xs text-slate-300/55">
                      Later: we’ll use this to refine recommendations and action suggestions.
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-3 md:hidden" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}