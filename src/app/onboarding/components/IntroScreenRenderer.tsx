"use client";

import * as React from "react";
import { motion } from "framer-motion";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import { firstName } from "../utils/textFormat";

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
      "Get Insights",
      "Explore paths",
      "Make Plans",
      "Take Action",
    ],
  },

  what_you_get: {
    eyebrow: "EVERLEAP",
    title: "What you get",
    bullets: [
      "Clear understanding of yourself",
      "Opportunities and paths which match you",
      "A plan to get there, starting today",
    ],
  },

  progress: {
    eyebrow: "EVERLEAP",
    title: "See your progress",
    body:
      "As you move through Everleap, you'll know your progressing because start seeing things which really related to you. However, to help you along the way, you can earn badges, which guide you and let you know you're moving forward.",
  },

  lets_get_started: {
    eyebrow: "EVERLEAP",
    title: "OK, let's get you going",
    body: "I'm going to ask you some questions to get you onboard",
  },

  permissions: {
    eyebrow: "EVERLEAP",
    title: "First, I need your permission.",
    body:
      "Everleap uses what you share to personalize guidance, ideas, and next steps. I may rely on trusted service providers to help operate Everleap, as described in the Privacy Policy.",
    bullets: [
      "I store basic account information.",
      "I use your responses to personalize your experience.",
      "I protect your data as described in the Privacy Policy.",
    ],
    tone: "compact",
  },

  summary_transition: {
    eyebrow: "EVERLEAP",
    title: "We're already seeing some signals.",
  },
};

function replaceName(value: string, answers: Answers) {
  const name = firstName(typeof answers.name === "string" ? answers.name : "");
  return value.replace("{name}", name);
}

export function isIntroScreen(node: FlowNode | null) {
  return Boolean(node && INTRO_SCREENS[node.key]);
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="mt-7 flex flex-col gap-3">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.34,
            ease: "easeOut",
            delay: 0.08 + index * 0.04,
          }}
          className="flex items-center gap-3"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/70 text-[12px] font-semibold text-white">
            {index + 1}
          </div>

          <div className="text-[16px] font-semibold leading-snug tracking-[-0.02em] text-white sm:text-[17px]">
            {step}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <div className="mt-7 flex flex-col gap-5">
      {bullets.map((bullet, index) => (
        <motion.div
          key={bullet}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.34,
            ease: "easeOut",
            delay: 0.08 + index * 0.05,
          }}
          className="flex gap-3"
        >
          <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />

          <div className="max-w-[270px] text-[16px] font-semibold leading-snug tracking-[-0.02em] text-white sm:max-w-[360px] sm:text-[17px]">
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
    <div className="mt-6 flex max-w-[300px] flex-col gap-5 sm:max-w-[390px]">
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
          className="text-[15px] font-medium leading-7 tracking-[-0.015em] text-white/68 sm:text-[16px]"
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
      <label className="flex cursor-pointer gap-3 text-left">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-white"
        />

        <span className="max-w-[320px] text-[13px] leading-6 text-white/62">
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

      <a
        href="/privacy"
        target="_blank"
        rel="noreferrer"
        className="inline-flex text-[13px] font-medium text-white/46 underline underline-offset-4 transition hover:text-white/76"
      >
        View Privacy Policy
      </a>
    </div>
  );
}

function SummaryTransition({
  synthesis,
  loading,
}: {
  synthesis?: OnboardingSynthesis | null;
  loading?: boolean;
}) {
  const loadingMessages = [
    "Reading your signals",
    "Looking for patterns",
    "Connecting your answers",
    "Mapping possible directions",
    "Building your first path",
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);

  const [showLoadingState, setShowLoadingState] =
    React.useState(true);

  React.useEffect(() => {
    if (!loading && synthesis) {
      const timeout = window.setTimeout(() => {
        setShowLoadingState(false);
      }, 1200);

      return () => window.clearTimeout(timeout);
    }

    if (loading) {
      setShowLoadingState(true);
    }
  }, [loading, synthesis]);

  React.useEffect(() => {
    if (!showLoadingState) return;

    const interval = window.setInterval(() => {
      setMessageIndex((current) => {
        return (current + 1) % loadingMessages.length;
      });
    }, 2600);

    return () => window.clearInterval(interval);
  }, [showLoadingState]);

  if (showLoadingState) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          y: -8,
          filter: "blur(6px)",
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="mt-10 flex min-h-[280px] flex-col items-start justify-center"
      >
        <div className="flex flex-col items-start">
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
            key={messageIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="mt-7 text-[20px] font-semibold tracking-[-0.03em] text-white"
          >
            {loadingMessages[messageIndex]}
            <span className="text-white/55">...</span>
          </motion.div>

          <p className="mt-5 max-w-[310px] text-[15px] leading-7 tracking-[-0.015em] text-white/48">
            Everleap is comparing your answers against behavioral signals,
            motivation patterns, and possible directions.
          </p>
        </div>
      </motion.div>
    );
  }

  if (!synthesis) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className="mt-8 flex flex-col gap-7"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
        }}
      >
        <h2 className="max-w-[320px] text-[20px] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
          {synthesis.headline}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.55,
            delay: 0.32,
          }}
          className="mt-4 max-w-[330px] text-[15px] leading-7 tracking-[-0.015em] text-white/70"
        >
          {synthesis.body}
        </motion.p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {synthesis.signals.map((signal, index) => (
          <motion.div
            key={signal}
            initial={{
              opacity: 0,
              x: -12,
              filter: "blur(4px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.44,
              ease: "easeOut",
              delay: 0.5 + index * 0.14,
            }}
            className="flex gap-3"
          >
            <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.85)]" />

            <div className="max-w-[310px] text-[15px] font-medium leading-6 tracking-[-0.015em] text-white/82">
              {signal}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.0,
        }}
        className="max-w-[320px] text-[14px] leading-6 tracking-[-0.01em] text-white/52"
      >
        {synthesis.bridge}
      </motion.p>
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
          "w-full max-w-[390px]",
          "px-1 pt-[8svh] sm:pt-[10svh]",
          compact ? "pb-4" : "pb-8",
        ].join(" ")}
      >
        {config.eyebrow ? (
          <div className="mb-7 text-[11px] font-bold uppercase tracking-[0.24em] text-white">
            {config.eyebrow}
          </div>
        ) : null}

        <h1 className="max-w-[330px] text-[24px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:max-w-[390px] sm:text-[28px]">
          {replaceName(config.title, answers)}
        </h1>

        {node.key === "summary_transition" ? (
          <SummaryTransition
            synthesis={synthesis}
            loading={synthesisLoading}
          />
        ) : (
          <>
            {config.bodyLines ? (
              <BodyLines lines={config.bodyLines} answers={answers} />
            ) : null}

            {config.body ? (
              <p
                className={[
                  "mt-6 max-w-[320px] text-[15px] font-medium leading-7 tracking-[-0.015em] text-white/72 sm:max-w-[390px] sm:text-[16px]",
                  compact ? "text-white/62" : "",
                ].join(" ")}
              >
                {replaceName(config.body, answers)}
              </p>
            ) : null}

            {config.steps ? <StepList steps={config.steps} /> : null}

            {config.bullets ? <BulletList bullets={config.bullets} /> : null}
          </>
        )}

        {node.key === "permissions" ? (
          <PermissionApproval
            accepted={permissionAccepted}
            onChange={(accepted) => {
              onAnswer?.("permissions_accepted", accepted ? "yes" : "");
            }}
          />
        ) : null}
      </motion.div>
    </section>
  );
}