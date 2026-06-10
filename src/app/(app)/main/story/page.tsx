"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Lightbulb,
  Mic,
  PenTool,
  Route,
} from "lucide-react";

type StorySection = {
  key: "motivations" | "strengths" | "skills";
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
};

const STORY_SECTIONS: StorySection[] = [
  {
    key: "motivations",
    title: "Motivations",
    icon: Dumbbell,
    accentClass: "border-lime-300/80 bg-lime-300/10 text-lime-100",
  },
  {
    key: "strengths",
    title: "Strengths",
    icon: Lightbulb,
    accentClass: "border-sky-400/80 bg-sky-400/10 text-sky-100",
  },
  {
    key: "skills",
    title: "Skills",
    icon: PenTool,
    accentClass: "border-fuchsia-300/70 bg-fuchsia-300/10 text-fuchsia-100",
  },
];

export default function StoryPage(): React.JSX.Element {
  const router = useRouter();
  const [activeKey, setActiveKey] =
    React.useState<StorySection["key"]>("motivations");

  const activeSection =
    STORY_SECTIONS.find((section) => section.key === activeKey) ??
    STORY_SECTIONS[0];

  function openQuestions(section = activeSection) {
    router.push(
      `/main/questions?cat=${section.key}&questionId=${section.key}_1&returnTo=/main/story`
    );
  }

  return (
    <main className="min-h-[100svh] px-5 pb-28 pt-5 text-white">
      <div className="mx-auto w-full max-w-[520px]">
        <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-white/92">
          Discussion
        </h1>

        <div className="mt-10 flex justify-center gap-3">
          {STORY_SECTIONS.map((section) => {
            const Icon = section.icon;
            const active = section.key === activeKey;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveKey(section.key)}
                className={[
                  "flex h-[74px] w-[108px] flex-col items-center justify-center rounded-xl border text-center transition",
                  active
                    ? section.accentClass +
                      " shadow-[0_0_22px_rgba(190,242,100,0.18)]"
                    : "border-white/24 bg-white/[0.035] text-white/72 hover:border-white/38 hover:bg-white/[0.055]",
                ].join(" ")}
              >
                <Icon className="h-7 w-7" />
                <span className="mt-2 text-[13px] font-semibold">
                  {section.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3 text-[16px] tracking-[-0.02em] text-white/88">
          <Route className="h-4 w-4 text-white/58" />
          <span>Phase of your journey:</span>
          <span className="rounded-full border-2 border-lime-300 px-4 py-1 text-[14px] font-semibold text-lime-100 shadow-[0_0_16px_rgba(190,242,100,0.18)]">
            Baseline
          </span>
        </div>

        <section className="mt-9">
          <h2 className="max-w-[450px] text-[31px] font-semibold leading-[1.14] tracking-[-0.055em] text-white sm:text-[34px]">
            Now, let&apos;s talk about how you interact with others. Which of
            these best describes you?
          </h2>

          <button
            type="button"
            onClick={() => openQuestions()}
            className="mt-8 w-full rounded-[1.1rem] border border-white/18 bg-white/[0.035] px-4 py-4 text-left transition hover:border-lime-200/40 hover:bg-white/[0.055]"
          >
            <div className="flex min-h-[88px] items-start justify-between gap-4">
              <span className="text-[13px] font-semibold text-white/58">
                Type your answer here...
              </span>

              <span className="mt-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-200/35 text-white">
                <Mic className="h-5 w-5" />
              </span>
            </div>
          </button>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => openQuestions()}
              className="rounded-full border border-white/45 px-9 py-3 text-[16px] font-semibold text-white transition hover:border-lime-200/70 hover:bg-white/[0.06]"
            >
              Continue
            </button>
          </div>
        </section>

        <div className="mt-9 flex items-center justify-between px-4 text-white/60">
          <button
            type="button"
            className="rounded-full p-2 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div className="text-[16px] tracking-[-0.02em] text-white/62">
            1 / 5
          </div>

          <button
            type="button"
            onClick={() => openQuestions()}
            className="rounded-full p-2 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>
    </main>
  );
}