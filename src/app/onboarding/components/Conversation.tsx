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

export default function Conversation({ node, answers }: Props) {
  if (!node) return null;

  const name = firstName(typeof answers.name === "string" ? answers.name : "");

  // Title with name replacement
  const title =
    node.title?.replace("{name}", name) ?? null;

  // Body with name replacement + line splitting
  const lines = splitBodyLines(node.body).map((line) =>
    line.replace("{name}", name)
  );

  return (
    <div className="w-full max-w-[720px] px-5">
      <div className="space-y-5">
        {/* TITLE */}
        {title && (
          <motion.h1
            key={`${node.id}-title`}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="text-[1.9rem] sm:text-[2.4rem] font-semibold leading-[1.15] tracking-tight text-white"
          >
            {renderHighlightedText(title)}
          </motion.h1>
        )}

        {/* BODY */}
        {lines.map((line, index) => (
          <motion.p
            key={`${node.id}-${index}`}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: title ? 0.1 + index * 0.15 : index * 0.15,
            }}
            className="text-[17px] sm:text-[18px] leading-[1.7] text-white/90"
          >
            {renderHighlightedText(line)}
          </motion.p>
        ))}
      </div>
    </div>
  );
}