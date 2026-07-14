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

type Section = "discovery" | "transition";

function getSectionForNode(node: FlowNode): Section {
  if (
    node.type === "summary" ||
    node.key === "summary_transition" ||
    node.key === "summary" ||
    node.key === "regauth_transition"
  ) {
    return "transition";
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
  const isTransition = section === "transition";

  const name = firstName(
    typeof answers.name === "string" ? answers.name : ""
  );

  const pacing = getPacing(section);

  const title = node.title?.replace("{name}", name) ?? null;

  const lines = splitBodyLines(node.body).map((line) =>
    line.replace("{name}", name)
  );

  return (
    <section
      className={[
        "flex w-full justify-center",
        isTransition ? "text-center" : "text-left",
      ].join(" ")}
    >
      <div
        className={[
          "w-full",
          isTransition
            ? "max-w-[620px] space-y-4"
            : "max-w-[400px] space-y-3",
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
              "text-balance font-semibold tracking-display text-white",
              isTransition
                ? "mx-auto max-w-[620px] text-[2rem] leading-display sm:text-[2.7rem]"
                : "max-w-[400px] text-[1.68rem] leading-display sm:text-[2.05rem]",
            ].join(" ")}
          >
            {renderHighlightedText(title)}
          </motion.h1>
        ) : null}

        {lines.length > 0 ? (
          <div
            className={[
              isTransition
                ? "mx-auto max-w-[640px] space-y-3"
                : "max-w-[390px] space-y-2.5",
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
                  "text-pretty tracking-title",
                  isTransition
                    ? "text-body leading-read text-white/74 sm:text-lede"
                    : "text-label leading-body text-white/70 sm:text-body",
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