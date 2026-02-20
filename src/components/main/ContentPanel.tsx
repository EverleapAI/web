// src/components/main/ContentPanel.tsx
"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import type {
  MainCarouselCard,
  SpotlightCard,
  InsightCard,
  SpotlightTask,
  SpotlightTaskStatus,
} from "@/app/(app)/main/mainCarouselData";
import { cn } from "@/lib/utils";

interface ContentPanelProps {
  card: MainCarouselCard;
}

export function ContentPanel({ card }: ContentPanelProps) {
  const isSpotlight = card.id === "spotlight";

  if (isSpotlight) {
    return <SpotlightPanel card={card as SpotlightCard} />;
  }

  return <InsightContent card={card as InsightCard} />;
}

/* ============================================================
   SPOTLIGHT CONTENT (interactive) — exported for Landing page
   ============================================================ */

export function SpotlightPanel({ card }: { card: SpotlightCard }) {
  const [tasks, setTasks] = useState<SpotlightTask[]>(card.tasks);

  useEffect(() => {
    setTasks(card.tasks);
  }, [card]);

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const totalTasks = tasks.length || 1;

  const progressPercent = Math.round(
    (card.progress ?? completedCount / totalTasks) * 100
  );

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: nextStatus(task.status),
            }
          : task
      )
    );
  };

  return (
    <section
      className="mt-2 flex-1 overflow-y-auto rounded-3xl border p-4 pb-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:p-6"
      style={{
        backgroundColor: "var(--el-bg-elevated)",
        borderColor: "var(--el-border-subtle)",
      }}
    >
      {/* Header + Progress */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full border border-slate-600/70 bg-slate-950/70 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-slate-300">
              Session Guide
            </span>
            <span className="hidden text-[0.7rem] text-slate-400/90 md:inline">
              ~10 min • 3–4 small moves
            </span>
          </div>

          <div>
            <h2 className="mt-1 text-lg font-semibold text-slate-50 md:text-xl">
              {card.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-200/85">
              {card.summary}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 md:mt-0">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-300/80">
              Session Progress
            </span>

            <div className="flex items-center gap-2">
              <div
                className="relative h-10 w-40 overflow-hidden rounded-full border bg-slate-950/80"
                style={{ borderColor: "var(--el-border-subtle)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${card.accentColor}, rgba(255,255,255,0.9))`,
                    transition: "width 300ms ease-out",
                  }}
                />
              </div>

              <span className="text-sm font-semibold text-slate-50">
                {progressPercent}%
              </span>
            </div>

            <span className="text-xs text-slate-300/80">
              {completedCount}/{totalTasks} tasks completed
            </span>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.13em] text-slate-300/90">
            Today&apos;s Spotlight Tasks
          </h3>
          <span className="text-xs text-slate-400">
            Tap a task to move it forward.
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <SpotlightTaskRow
              key={task.id}
              task={task}
              accentColor={card.accentColor}
              onToggle={() => handleToggleTask(task.id)}
            />
          ))}
        </div>
      </div>

      {/* Coaching Message */}
      <div
        className="mt-6 rounded-2xl border p-4 shadow-inner md:p-5"
        style={{
          backgroundColor: "var(--el-bg-soft)",
          borderColor: "var(--el-border-subtle)",
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/80">
          Coaching Note
        </div>
        <p className="mt-2 text-sm text-slate-100">{card.coachingMessage}</p>
      </div>

      {/* Extra sections */}
      {card.sections?.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {card.sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--el-bg-soft)",
                borderColor: "var(--el-border-subtle)",
              }}
            >
              <h4 className="text-sm font-semibold text-slate-50">
                {section.heading}
              </h4>
              <p className="mt-2 text-sm text-slate-200/85">{section.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function nextStatus(status: SpotlightTaskStatus): SpotlightTaskStatus {
  if (status === "pending") return "in_progress";
  if (status === "in_progress") return "done";
  return "pending";
}

/* ============================================================
   TASK ROW — clickable & status-aware
   ============================================================ */

function SpotlightTaskRow({
  task,
  accentColor,
  onToggle,
}: {
  task: SpotlightTask;
  accentColor: string;
  onToggle: () => void;
}) {
  const statusLabel =
    task.status === "done"
      ? "Done"
      : task.status === "in_progress"
      ? "In progress"
      : "Waiting";

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-3 text-sm shadow-sm transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-slate-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        task.status === "done"
          ? "bg-emerald-500/5"
          : task.status === "in_progress"
          ? "bg-sky-500/5"
          : "hover:bg-slate-900"
      )}
      style={{
        borderColor:
          task.status === "done"
            ? "rgba(52, 211, 153, 0.4)"
            : task.status === "in_progress"
            ? "rgba(56, 189, 248, 0.4)"
            : "var(--el-border-subtle)",
        backgroundColor:
          task.status === "pending" ? "var(--el-bg-soft)" : undefined,
      }}
    >
      <div
        className="mt-[2px] h-4 w-4 flex-shrink-0 rounded-full border bg-slate-950/80"
        style={{ borderColor: "rgba(148, 163, 184, 0.7)" }}
      >
        {task.status === "done" && (
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}, transparent 65%)`,
            }}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-slate-100">{task.label}</span>

        <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium uppercase tracking-[0.14em]",
              "bg-slate-800/90 text-slate-200/85",
              task.type === "reflect" && "bg-purple-500/20 text-purple-100/90",
              task.type === "explore" && "bg-sky-500/20 text-sky-100/90",
              task.type === "practice" &&
                "bg-emerald-500/20 text-emerald-100/90",
              task.type === "action" && "bg-amber-500/20 text-amber-100/90"
            )}
          >
            {task.type}
          </span>

          <span className="text-slate-400/90">•</span>
          <span className="text-slate-400/90">{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INSIGHT CONTENT (non-spotlight cards)
   Overview + You views
   ============================================================ */

type PersonaBlock = {
  title: string;
  emoji: string;
  badge?: string;
  body: string;
};

const personaContent: Partial<Record<InsightCard["id"], PersonaBlock[]>> = {
  motivations: [
    {
      title: "Your energy pattern",
      emoji: "⚡",
      badge: "High-meaning seeker",
      body: "You light up fast when a project feels real and connected to people. When it turns into pure busywork, your brain taps out.",
    },
    {
      title: "When you’re most motivated",
      emoji: "🎯",
      badge: "Momentum driven",
      body: "You’re most engaged when there’s a small, clear win in sight—like finishing something, hitting a checkpoint, or getting real feedback.",
    },
    {
      title: "Watch for these flags",
      emoji: "🚩",
      badge: "Energy leak",
      body: "If you catch yourself doom-scrolling or avoiding simple tasks, it’s often because the work feels pointless, not because you’re lazy.",
    },
  ],
  strengths: [
    {
      title: "Your quiet strengths",
      emoji: "🌱",
      badge: "Steady presence",
      body: "You don’t need to be the loudest person in the room to shift it. Your calm, thoughtful energy helps other people feel safer showing up.",
    },
    {
      title: "People count on you for",
      emoji: "🤝",
      badge: "Trusted teammate",
      body: "Friends and classmates lean on you when things get messy—decisions, group projects, or just needing someone who won’t freak out.",
    },
    {
      title: "Edge to grow",
      emoji: "📈",
      badge: "Stretch zone",
      body: "You’ll get more from your strengths by stepping into slightly bigger roles—leading a part of a project, not the whole thing yet.",
    },
  ],
  skills: [
    {
      title: "Skills that are already working",
      emoji: "🛠️",
      badge: "Real-world useful",
      body: "You’re building skills in communication, problem-solving, and learning on the fly—things that matter way more than memorizing facts.",
    },
    {
      title: "Skills in progress",
      emoji: "⏳",
      badge: "Loading...",
      body: "Time management, speaking up, and staying focused when things get boring are still in progress—normal, and very trainable.",
    },
    {
      title: "Good practice ground",
      emoji: "🎮",
      badge: "XP farm",
      body: "Clubs, side projects, and small part-time work are perfect places to practice without the pressure of being “perfect” yet.",
    },
  ],
  superpowers: [
    {
      title: "Your standout vibe",
      emoji: "✨",
      badge: "Room shifter",
      body: "When you’re into something, you change the energy of the room. People notice—even if they don’t always say it out loud.",
    },
    {
      title: "How you help others",
      emoji: "🧲",
      badge: "Connector",
      body: "You pull people, ideas, and moments together in a way that makes things feel more fun, more real, or just less awkward.",
    },
    {
      title: "Use this intentionally",
      emoji: "🎛️",
      badge: "Aim your power",
      body: "Point your energy at things you actually care about. That’s where your so-called “extra” effort will feel natural, not forced.",
    },
  ],
  friends: [
    {
      title: "Your friend style",
      emoji: "💌",
      badge: "Real over perfect",
      body: "You care more about honest, low-drama friendships than having a giant group. You’d rather have a few real ones than a crowd.",
    },
    {
      title: "What you need from your circle",
      emoji: "🧡",
      badge: "Support system",
      body: "You do best around people who respect your goals and don’t make you feel guilty for growing or changing your mind.",
    },
    {
      title: "Check this pattern",
      emoji: "🔍",
      badge: "Balance check",
      body: "If you’re always the fixer or therapist friend, make sure you also have people who notice when *you* need support too.",
    },
  ],
  family: [
    {
      title: "How your family shows up",
      emoji: "🏠",
      badge: "Context, not destiny",
      body: "Your family shapes how you think about security, risk, and success—even if you eventually build something very different.",
    },
    {
      title: "Unwritten rules",
      emoji: "📜",
      badge: "Invisible scripts",
      body: "There are probably silent rules around grades, money, emotions, or what “success” looks like. Noticing them is step one.",
    },
    {
      title: "Your path forward",
      emoji: "🧭",
      badge: "Story editor",
      body: "You get to learn from your family story without copying every chapter. You’re allowed to keep the parts that work and remix the rest.",
    },
  ],
  careers: [
    {
      title: "Where you might thrive",
      emoji: "🚀",
      badge: "Builder energy",
      body: "You’re likely to enjoy work where you can mix thinking and doing—solving real problems, not just checking boxes.",
    },
    {
      title: "Signals from your interests",
      emoji: "🧩",
      badge: "Hidden clues",
      body: "Games, hobbies, and deep dives you do for fun are often pointing at the kind of problems and environments you enjoy.",
    },
    {
      title: "Next step, not forever step",
      emoji: "🧪",
      badge: "Career experiment",
      body: "Short projects, summer jobs, or shadowing someone are all experiments—not permanent decisions. Each one gives you data.",
    },
  ],
  education: [
    {
      title: "How you learn best",
      emoji: "📚",
      badge: "Custom learner",
      body: "You likely learn more from doing, discussing, or visualizing than just listening. When school matches that, everything feels easier.",
    },
    {
      title: "School vs real learning",
      emoji: "🌍",
      badge: "Beyond the classroom",
      body: "A lot of your real learning will come from projects, people, and experiences outside of class. That totally counts.",
    },
    {
      title: "Designing your path",
      emoji: "🧱",
      badge: "Step-by-step",
      body: "College, trades, work, gap years—your best next step is the one that helps you grow without completely draining you.",
    },
  ],
};

const overviewEmojiByCardId: Partial<Record<InsightCard["id"], string>> = {
  motivations: "🔥",
  strengths: "💪",
  skills: "🛠️",
  superpowers: "⚡",
  friends: "🤝",
  family: "🏠",
  careers: "🧭",
  education: "📚",
};

function InsightContent({ card }: { card: InsightCard }) {
  const [viewMode, setViewMode] = useState<"overview" | "you">("overview");

  useEffect(() => {
    setViewMode("overview");
  }, [card.id]);

  const personaBlocks = personaContent[card.id] ?? [
    {
      title: "How this shows up for you",
      emoji: "💡",
      badge: "Personal view",
      body: "This area will eventually show how your responses, stories, and patterns connect to this part of your life.",
    },
  ];

  const isOverviewActive = viewMode === "overview";
  const isYouActive = viewMode === "you";
  const overviewEmoji = overviewEmojiByCardId[card.id] ?? "📘";

  return (
    <section
      className="mt-2 flex-1 overflow-y-auto rounded-3xl border p-4 pb-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:p-6"
      style={{
        backgroundColor: "var(--el-bg-elevated)",
        borderColor: "var(--el-border-subtle)",
      }}
    >
      {/* Header */}
      <div className="mb-3 flex flex-col gap-2 md:mb-4">
        <div className="inline-flex items-center gap-2 text-xs text-slate-300/90">
          <span className="rounded-full border border-slate-600/70 bg-slate-950/70 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            {card.title}
          </span>
          <span className="hidden text-[0.68rem] text-slate-500 md:inline">
            Concept + your version of it
          </span>
        </div>

        <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
          {card.title}
        </h2>

        {/* Mobile segmented toggle */}
        <div className="mt-3 flex w-full rounded-full bg-slate-900/80 p-1 text-xs text-slate-300 md:hidden">
          <button
            type="button"
            onClick={() => setViewMode("overview")}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 font-medium transition-colors",
              isOverviewActive && "bg-slate-800 text-slate-50"
            )}
          >
            📘 Overview
          </button>
          <button
            type="button"
            onClick={() => setViewMode("you")}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 font-medium transition-colors",
              isYouActive && "bg-slate-800 text-slate-50"
            )}
          >
            👤 You
          </button>
        </div>
      </div>

      {/* Content grid: on md+ show both; on mobile use viewMode */}
      <div className="mt-2 grid gap-4 md:grid-cols-2">
        {/* LEFT: Overview */}
        <div
          className={cn(
            "space-y-3 md:space-y-4",
            !isOverviewActive && "hidden md:block"
          )}
        >
          <div className="mb-1 flex items-center gap-2 text-[0.7rem] text-slate-400 md:mb-0">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-xs">
              📘
            </span>
            <span className="font-semibold uppercase tracking-[0.18em] text-slate-400">
              About this area
            </span>
          </div>

          {card.sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-2xl border p-4 shadow-inner"
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.16), transparent 65%), var(--el-bg-soft)",
                borderColor: "var(--el-border-subtle)",
              }}
            >
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950/85 text-lg">
                  {overviewEmoji}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {section.heading}
                  </h3>
                  <p className="text-sm text-slate-200/85">{section.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* RIGHT: You in this area */}
        <div
          className={cn(
            "space-y-3 md:space-y-4",
            !isYouActive && "hidden md:block"
          )}
        >
          <div className="mb-1 flex items-center gap-2 text-[0.7rem] text-slate-400 md:mb-0">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-xs">
              👤
            </span>
            <span className="font-semibold uppercase tracking-[0.18em] text-slate-400">
              You in this area
            </span>
          </div>

          {personaBlocks.map((block) => (
            <article
              key={block.title}
              className="flex gap-3 rounded-2xl border p-4 shadow-inner"
              style={{
                background:
                  "radial-gradient(circle at 0% 0%, rgba(148,163,184,0.16), transparent 65%), var(--el-bg-soft)",
                borderColor: "var(--el-border-subtle)",
              }}
            >
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950/85 text-lg">
                {block.emoji}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {block.title}
                  </h3>
                  {block.badge && (
                    <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-slate-300">
                      {block.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-200/85">{block.body}</p>
              </div>
            </article>
          ))}

          <p className="mt-1 text-[0.68rem] text-slate-500">
            Later, this space will adapt based on your check-ins, stories, and
            choices—so it feels less like a report and more like a mirror.
          </p>
        </div>
      </div>
    </section>
  );
}
