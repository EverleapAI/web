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
}{
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
      titleDuration: 0.9,
      bodyDuration: 0.8,
      bodyBaseDelay: 0.24,
      bodyStepDelay: 0.2,
      titleY: 10,
      bodyY: 8,
      blur: 4,
    };
  }

  if (section === "what-is-everleap") {
    return {
      titleDuration: 0.72,
      bodyDuration: 0.66,
      bodyBaseDelay: 0.16,
      bodyStepDelay: 0.16,
      titleY: 18,
      bodyY: 14,
      blur: 6,
    };
  }

  return {
    titleDuration: 0.48,
    bodyDuration: 0.48,
    bodyBaseDelay: 0.08,
    bodyStepDelay: 0.1,
    titleY: 14,
    bodyY: 12,
    blur: 5,
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
        "w-full transition-all duration-700",
        isTransition ? "text-center" : "text-left",
      ].join(" ")}
    >
      <div
        className={[
          "transition-all duration-700",
          isTransition
            ? "mx-auto max-w-[640px] space-y-5 sm:space-y-6"
            : isWelcome
              ? "space-y-5 sm:space-y-6"
              : "space-y-3.5 sm:space-y-4",
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
              "text-balance font-semibold tracking-[-0.04em] text-white transition-all duration-700",
              isTransition
                ? "mx-auto max-w-[620px] text-[2rem] leading-[1.04] sm:text-[2.7rem]"
                : isWelcome
                  ? "max-w-[700px] text-[2rem] leading-[1.02] sm:text-[2.9rem]"
                  : "max-w-[680px] text-[1.62rem] leading-[1.12] sm:text-[2.2rem]",
            ].join(" ")}
          >
            {renderHighlightedText(title)}
          </motion.h1>
        ) : null}

        {lines.length > 0 ? (
          <div
            className={[
              "transition-all duration-700",
              isTransition
                ? "mx-auto max-w-[580px] space-y-4"
                : isWelcome
                  ? "max-w-[640px] space-y-4"
                  : "max-w-[620px] space-y-3 sm:space-y-3.5",
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
                  "text-pretty transition-all duration-700",
                  isTransition
                    ? "text-[17px] leading-[1.74] text-white/76 sm:text-[19px]"
                    : isWelcome
                      ? "text-[17px] leading-[1.72] text-white/82 sm:text-[19px]"
                      : isDiscovery
                        ? "text-[15.5px] leading-[1.58] text-white/80 sm:text-[17px]"
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