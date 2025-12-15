"use client";

import { motion } from "framer-motion";
import { AiGuideOrb } from "@/components/main/AiGuideOrb";

type AnimatedGuideOrbProps = {
  className?: string;
};

export function AnimatedGuideOrb({ className = "" }: AnimatedGuideOrbProps) {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-30 ${className}`}
      animate={{
        scale: [1, 1.06, 1],
        rotate: [0, -3, 2, 0],
        boxShadow: [
          "0 0 0 0 rgba(129, 140, 248, 0.4)",
          "0 0 40px 4px rgba(129, 140, 248, 0.65)",
          "0 0 0 0 rgba(129, 140, 248, 0.3)",
        ],
      }}
      transition={{
        duration: 3.4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Make sure AiGuideOrb renders just the orb (no label) in this context */}
      <AiGuideOrb />
    </motion.div>
  );
}
