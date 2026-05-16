"use client";

import { motion } from "framer-motion";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import {
  firstName,
  renderHighlightedText,
  splitBodyLines,
} from "../utils/textFormat";

type Props = {
  node: FlowNode | null;
  answers: Answers;
};

type Section =
  | "what-is-everleap"
  | "discovery"
  | "transition";

function getSectionForNode(node: FlowNode): Section {
  if (
    node.type === "summary" ||
    node.key === "summary_transition" ||
    node.key === "summary" ||
    node.key === "regauth_transition"
  ) {
    return "transition";
  }

  if (
    node.key === "welcome" ||
    node.key === "how_it_works" ||
    node.key === "what_you_get" ||
    node.key === "progress" ||
    node.key === "lets_get_started"
  ) {
    return "what-is-everleap";
  }

  return "discovery";
}

function getPacing(section: Section) {
  if (section === "transition") {
    return {
      titleDuration: 0.55,
      bodyDuration: 0.5,
      bodyBaseDelay: 0.12,
      bodyStepDelay: 0.08,
      titleY: 10,
      bodyY: 8,
      blur: 3,
    };
  }

  if (section === "what-is-everleap") {
    return {
      titleDuration: 0.5,
      bodyDuration: 0.45,
      bodyBaseDelay: 0.08,
      bodyStepDelay: 0.06,
      titleY: 12,
      bodyY: 10,
      blur: 4,
    };
  }

  return {
    titleDuration: 0.34,
    bodyDuration: 0.3,
    bodyBaseDelay: 0.04,
    bodyStepDelay: 0.04,
    titleY: 8,
    bodyY: 6,
    blur: 2,
  };
}

export default function Conversation({ node, answers }: Props) {
  if (!node) return null;

  const section = getSectionForNode(node);

  const isWelcome = section === "what-is-everleap";
  const isDiscovery = section === "discovery";
  const isTransition = section === "transition";

  const name = firstName(typeof answers.name === "string" ? answers.name : "");

  const pacing = getPacing(section);

  const title = node.title?.replace("{name}", name) ?? null;

  const lines = splitBodyLines(node.body).map((line) =>
    line.replace("{name}", name)
  );

  return (
    <section
      className={[
        "w-full",
        isTransition ? "text-center" : "text-left",
      ].join(" ")}
    >
      <div
        className={[
          isTransition
            ? "mx-auto max-w-[640px] space-y-5"
            : isWelcome
              ? "space-y-5"
              : "space-y-3",
        ].join(" ")}
      >
        {title ? (
          <motion.h1
            key={`${node.id}-title`}
            initial={{
              opacity: 0,
              y: pacing.titleY,
              filter: `blur(${pacing.blur}px)`,
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: pacing.titleDuration,
              ease: "easeOut",
            }}
            className={[
              "text-balance font-semibold tracking-[-0.045em] text-white",
              isTransition
                ? "mx-auto max-w-[620px] text-[2rem] leading-[1.02] sm:text-[2.7rem]"
                : isWelcome
                  ? "max-w-[700px] text-[2.2rem] leading-[0.98] sm:text-[3rem]"
                  : "max-w-[680px] text-[1.5rem] leading-[1.08] sm:text-[2rem]",
            ].join(" ")}
          >
            {renderHighlightedText(title)}
          </motion.h1>
        ) : null}

        {lines.length > 0 ? (
          <div
            className={[
              isTransition
                ? "mx-auto max-w-[580px] space-y-4"
                : isWelcome
                  ? "max-w-[640px] space-y-4"
                  : "max-w-[620px] space-y-2.5",
            ].join(" ")}
          >
            {lines.map((line, index) => (
              <motion.p
                key={`${node.id}-${index}`}
                initial={{
                  opacity: 0,
                  y: pacing.bodyY,
                  filter: `blur(${pacing.blur}px)`,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: pacing.bodyDuration,
                  ease: "easeOut",
                  delay: title
                    ? pacing.bodyBaseDelay + index * pacing.bodyStepDelay
                    : index * pacing.bodyStepDelay,
                }}
                className={[
                  "text-pretty",
                  isTransition
                    ? "text-[17px] leading-[1.72] text-white/74 sm:text-[19px]"
                    : isWelcome
                      ? "text-[18px] leading-[1.72] text-white/78 sm:text-[20px]"
                      : isDiscovery
                        ? "text-[15px] leading-[1.55] text-white/74 sm:text-[16px]"
                        : "",
                ].join(" ")}
              >
                {renderHighlightedText(line)}
              </motion.p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}