"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import { firstName } from "../utils/textFormat";

import OnboardingVisual from "./visuals/OnboardingVisual";

type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

type Props = {
  node: FlowNode | null;
  answers: Answers;
  synthesis?: OnboardingSynthesis | null;
  synthesisLoading?: boolean;
  onAnswer?: (questionKey: string, value: string | string[]) => void;
};

type IntroConfig = {
  eyebrow?: string;
  title: string;
  body?: string;
  bodyLines?: string[];
  steps?: string[];
  bullets?: string[];
  tone?: "default" | "compact";
};

const INTRO_SCREENS: Record<string, IntroConfig> = {
  welcome: {
    eyebrow: "EVERLEAP",
    title: "Welcome.",
    bodyLines: [
      "Everleap helps you figure out your next move.",
      "Not someday. Not in theory.",
      "Real paths, people, programs, jobs, and ideas you can actually explore.",
    ],
  },

  how_it_works: {
    eyebrow: "EVERLEAP",
    title: "How it works",
    steps: [
      "Tell your story",
      "Get insights",
      "Explore paths",
      "Make plans",
      "Take action",
    ],
  },

  what_you_get: {
    eyebrow: "EVERLEAP",
    title: "What you get",
  },

  progress: {
    eyebrow: "EVERLEAP",
    title: "See your progress",
    body:
      "As you move through Everleap, you'll know your progressing because you start seeing things which really related to you. However, to help you along the way, you can earn badges, which guide you and let you know you're moving forward.",
  },

  lets_get_started: {
    eyebrow: "EVERLEAP",
    title: "OK, let's get you going",
    body:
      "I'm going to ask you some questions to get you onboard",
  },

  permissions: {
    eyebrow: "EVERLEAP",
    title: "We need your permission.",
    body:
      "Everleap uses what you share to personalize guidance, ideas, and next steps. We may rely on trusted service providers to help operate Everleap, as described in our Privacy Policy.",
    bullets: [
      "We store basic account information.",
      "We use your responses to personalize your experience.",
      "We protect your data as described in our Privacy Policy.",
    ],
    tone: "compact",
  },

  summary_transition: {
    eyebrow: "EVERLEAP",
    title: "OK — let's get you into Everleap.",
    body:
      "We're preparing your first personalized insights now.",
  },
};

function replaceName(value: string, answers: Answers) {
  const name = firstName(typeof answers.name === "string" ? answers.name : "");
  return value.replace("{name}", name);
}

export function isIntroScreen(node: FlowNode | null) {
  return Boolean(node && INTRO_SCREENS[node.key]);
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-white">{children}</span>;
}

function ProgressIcons() {
  const icons = [
    "/onboarding/icons/badges/1_onboard.png",
    "/onboarding/icons/badges/2_story.png",
    "/onboarding/icons/badges/3_reflection.png",
    "/onboarding/icons/badges/4_explore.png",
    "/onboarding/icons/badges/5_takeoff.png",
  ];

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {icons.map((src, index) => (
        <motion.div
          key={src}
          initial={{
            opacity: 0,
            y: 8,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.38,
            ease: "easeOut",
            delay: 0.08 + index * 0.05,
          }}
          className="
            relative
            flex
            h-[60px]
            w-[60px]
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/35
            bg-white/[0.03]
            shadow-[0_0_18px_rgba(255,255,255,0.05)]
            backdrop-blur-sm
          "
        >
          <div className="absolute inset-[4px] rounded-full border border-white/8" />

          <Image
            src={src}
            alt=""
            width={30}
            height={30}
            className="relative z-10 object-contain opacity-90"
          />
        </motion.div>
      ))}
    </div>
  );
}

function WhatYouGetList() {
  const items = [
    {
      icon: "/onboarding/icons/reflection-white.png",
      text: (
        <>
          <Highlight>Clear understanding</Highlight> of yourself
        </>
      ),
    },
    {
      icon: "/onboarding/icons/road-white.png",
      text: (
        <>
          <Highlight>Opportunities and paths</Highlight> which match you
        </>
      ),
    },
    {
      icon: "/onboarding/icons/ticket-flight-white.png",
      text: (
        <>
          A plan to get there, <Highlight>starting today</Highlight>
        </>
      ),
    },
  ];

  return (
    <div className="mt-6 flex flex-col gap-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.34,
            ease: "easeOut",
            delay: 0.08 + index * 0.05,
          }}
          className="flex items-start gap-4"
        >
          <Image
            src={item.icon}
            alt=""
            width={42}
            height={42}
            className="mt-[2px] shrink-0 opacity-90"
          />

          <div className="max-w-[330px] text-[17px] font-medium leading-7 tracking-[-0.02em] text-white/90">
            {item.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="mt-7 flex flex-col gap-3">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.34,
            ease: "easeOut",
            delay: 0.08 + index * 0.05,
          }}
          className="flex items-center gap-4"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-[11px] font-semibold text-white/82">
            {index + 1}
          </div>

          <div className="text-[16px] font-medium leading-relaxed tracking-[-0.02em] text-white/88 sm:text-[17px]">
            {step}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <div className="mt-7 flex flex-col gap-4">
      {bullets.map((bullet, index) => (
        <motion.div
          key={bullet}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.34,
            ease: "easeOut",
            delay: 0.08 + index * 0.05,
          }}
          className="flex gap-4"
        >
          <div className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)]" />

          <div className="max-w-[340px] text-[16px] font-medium leading-7 tracking-[-0.02em] text-white/84 sm:text-[17px]">
            {bullet}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BodyLines({
  lines,
  answers,
}: {
  lines: string[];
  answers: Answers;
}) {
  return (
    <div className="mt-6 flex max-w-[370px] flex-col gap-4">
      {lines.map((line, index) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.38,
            ease: "easeOut",
            delay: 0.1 + index * 0.06,
          }}
          className="text-[16px] font-medium leading-7 tracking-[-0.018em] text-white/72 sm:text-[17px]"
        >
          {replaceName(line, answers)}
        </motion.p>
      ))}
    </div>
  );
}

function PermissionApproval({
  accepted,
  onChange,
}: {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}) {
  return (
    <div className="mt-7 space-y-4">
      <label className="flex cursor-pointer gap-4 text-left">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-cyan-300"
        />

        <span className="max-w-[340px] text-[13px] leading-6 tracking-[-0.01em] text-white/58">
          I give Everleap permission to use what I share to personalize my
          experience, as described in the{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white underline underline-offset-4"
            onClick={(event) => event.stopPropagation()}
          >
            Privacy Policy
          </a>
          .
        </span>
      </label>
    </div>
  );
}

function SummaryTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="mt-6 flex min-h-[200px] flex-col justify-center"
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            animate={{
              opacity: [0.25, 1, 0.25],
              scale: [0.92, 1.12, 0.92],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot * 0.18,
            }}
            className="h-2 w-2 rounded-full bg-cyan-300"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="mt-6 text-[22px] font-semibold tracking-[-0.035em] text-white"
      >
        Preparing your first Everleap insights
        <span className="text-white/42">...</span>
      </motion.div>

      <p className="mt-4 max-w-[360px] text-[15px] leading-6 tracking-[-0.015em] text-white/46">
        Your responses are helping Everleap begin understanding your
        motivations, interests, strengths, and possible directions.
      </p>
    </motion.div>
  );
}

export default function IntroScreenRenderer({
  node,
  answers,
  synthesis,
  synthesisLoading,
  onAnswer,
}: Props) {
  if (!node) return null;

  const config = INTRO_SCREENS[node.key];

  if (!config) return null;

  const compact = config.tone === "compact";
  const permissionAccepted = answers.permissions_accepted === "yes";
  const isSummary =
    node.key === "summary_transition" || node.type === "summary";

  return (
    <section className="flex w-full justify-center">
      <motion.div
        key={node.key}
        initial={{
          opacity: 0,
          y: 14,
          filter: "blur(6px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className={[
          "w-full max-w-[420px]",
          "px-1 pt-1",
          compact ? "pb-3" : "pb-5",
        ].join(" ")}
      >
        <OnboardingVisual visualKey={node.key} />

        <h1 className="max-w-[360px] text-[30px] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[34px]">
          {replaceName(config.title, answers)}
        </h1>

        {isSummary ? (
          <SummaryTransition />
        ) : (
          <>
            {node.key === "progress" ? <ProgressIcons /> : null}

            {node.key === "what_you_get" ? (
              <WhatYouGetList />
            ) : null}

            {config.bodyLines ? (
              <BodyLines
                lines={config.bodyLines}
                answers={answers}
              />
            ) : null}

            {config.body ? (
              <p
                className={[
                  "mt-6 max-w-[370px] text-[16px] leading-7 tracking-[-0.018em] text-white/70",
                  compact ? "text-white/58" : "",
                ].join(" ")}
              >
                {replaceName(config.body, answers)}
              </p>
            ) : null}

            {config.steps ? (
              <StepList steps={config.steps} />
            ) : null}

            {config.bullets ? (
              <BulletList bullets={config.bullets} />
            ) : null}
          </>
        )}

        {node.key === "permissions" ? (
          <PermissionApproval
            accepted={permissionAccepted}
            onChange={(accepted) => {
              onAnswer?.(
                "permissions_accepted",
                accepted ? "yes" : ""
              );
            }}
          />
        ) : null}
      </motion.div>
    </section>
  );
}