// src/app/main/questions/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BottomNav, BottomNavKey } from "@/components/navigation/BottomNav";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";
import { AiGuideModal } from "@/components/main/AiGuideModal";

const userName = "Tom";

const questionText =
  "When you are working on a group project with friends, what role do you usually take? Why do you think that is?";

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("you");
  const [guideOpen, setGuideOpen] = useState(false);
  const [answer, setAnswer] = useState("");

  const guideSubtitle = `Hey ${userName}. We’re on your story question. Want help putting this into words? Just say what actually happens when you’re with your friends.`;

  return (
    <div
      className="min-h-screen bg-[#020617] text-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(251,113,133,0.14), transparent 55%)",
      }}
    >
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Header */}
        <header className="mb-4 md:mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Tell your story
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Help Everleap get to know how you work with others
              </h1>
              <p className="mt-1 text-sm text-slate-200/85 md:text-base">
                Answer in your own words. There&apos;s no right or wrong
                response—this is just a first snapshot of how you show up in
                group projects.
              </p>
            </div>

            {/* AI guide orb */}
            <div className="mt-2 md:mt-0">
              <AiGuideOrb
                subline="Stuck? Talk it out with your guide instead of overthinking your answer."
                onClick={() => setGuideOpen(true)}
              />
            </div>
          </div>

          {/* Quick paths */}
          <div className="mt-4">
            <QuickPathsRow />
          </div>
        </header>

        {/* Main card */}
        <main className="flex flex-1 flex-col">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur md:px-6 md:py-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              1 • Question
            </p>

            <h2 className="mt-3 text-base font-semibold text-slate-50 md:text-lg">
              {questionText}
            </h2>

            <p className="mt-2 text-xs text-slate-400 md:text-sm">
              Take your time. A few sentences is plenty, but you can write as
              much as you like.
            </p>

            {/* Answer block with mic hint */}
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-3 md:p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Your answer</span>
                <span className="flex items-center gap-1 text-[0.7rem]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-sm">
                    🎤
                  </span>
                  <span>Use your mic instead of typing if that’s easier.</span>
                </span>
              </div>

              <div className="relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="h-40 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 outline-none placeholder-slate-500 focus:border-sky-400"
                  placeholder="Write how you usually show up in group work, and why that feels natural to you..."
                />

                {/* Mic icon in the corner – visual cue, future voice input */}
                <button
                  type="button"
                  className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/90 text-lg"
                  title="(Coming soon) Hold to talk instead of typing"
                >
                  🎤
                </button>
              </div>
            </div>

            {/* Nav buttons */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="rounded-full border border-slate-700/70 px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-400 hover:text-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                className="rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-sky-400"
              >
                Continue
              </button>
            </div>

            <p className="mt-3 text-[0.7rem] text-slate-500">
              Later, you&apos;ll see how Everleap turns answers like this into
              patterns that describe your strengths, collaboration style, and
              career fit.
            </p>
          </section>
        </main>
      </div>

      <BottomNav activeKey={activeTab} onChange={setActiveTab} />

      {guideOpen && (
        <AiGuideModal
          onClose={() => setGuideOpen(false)}
          title="Story question"
          subtitle={guideSubtitle}
        />
      )}
    </div>
  );
}

/* ========= Quick paths row ========= */

function QuickPathsRow() {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-400">
        Quick paths
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <NavPill href="/main" label="Back to Spotlight" icon="🏠" />
        <NavPill href="/main/carousel" label="Explore your profile" icon="🧭" />
        <NavPill
          href="/main/questions"
          label="Tell your story"
          icon="✍️"
          tone="primary"
        />
        <NavPill href="/main/goals" label="Goals (soon)" icon="🎯" disabled />
      </div>
    </div>
  );
}

/* ========= Small nav pill ========= */

function NavPill({
  href,
  label,
  icon,
  disabled,
  tone = "default",
}: {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
  tone?: "default" | "primary";
}) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-medium border shadow-sm";

  if (disabled) {
    return (
      <span
        className={`${baseStyles} cursor-default border-slate-700/70 bg-slate-900/70 text-slate-500`}
      >
        <span className="text-sm">{icon}</span>
        <span>{label}</span>
      </span>
    );
  }

  const toneClasses =
    tone === "primary"
      ? "border-sky-500/70 bg-sky-500/15 text-sky-100 hover:bg-sky-500/25"
      : "border-slate-700/70 bg-slate-900/80 text-slate-100 hover:bg-slate-900";

  return (
    <Link href={href} className={`${baseStyles} ${toneClasses}`}>
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
