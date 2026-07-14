// src/components/main/CarouselHeader.tsx
"use client";

import type { MainCarouselCard } from "@/app/(app)/main/mainCarouselData";
import { motion, useMotionTemplate, useSpring } from "framer-motion";

interface CarouselHeaderProps {
  activeCard: MainCarouselCard;
  // Optional: later we can pass in the actual user's name
  userName?: string;
}

export function CarouselHeader({ activeCard, userName }: CarouselHeaderProps) {
  const displayName = userName ?? "there";

  // Smoothly animate the glow color when the active card changes
  const glow = useSpring(1, { stiffness: 120, damping: 18 });

  // Use a motion template to build a dynamic radial gradient string
  const glowBackground = useMotionTemplate`
    radial-gradient(circle at 30% 30%, ${activeCard.accentColor}, transparent 60%)
  `;

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="text-xs font-medium uppercase tracking-eyebrow text-slate-300/80">
          Hey {displayName},
        </div>
        <h1 className="truncate text-xl font-semibold text-slate-50 md:text-2xl">
          Let’s focus on{" "}
          <span className="text-slate-50/90">{activeCard.title}</span>
        </h1>
        <p className="mt-1 line-clamp-2 max-w-xl text-sm text-slate-300/80">
          {activeCard.summary}
        </p>
      </div>

      <div className="hidden shrink-0 md:flex">
        <motion.div
          className="relative h-16 w-16 rounded-full bg-slate-950/80 shadow-[0_0_40px_rgba(0,0,0,0.7)]"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-70 blur-2xl"
            style={{
              backgroundImage: glowBackground,
              scale: glow,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          />

          {/* Inner layered shell */}
          <div className="absolute inset-[6px] rounded-full bg-slate-900/90 backdrop-blur-md" />
          <div className="absolute inset-[10px] rounded-full bg-slate-800/80" />

          {/* Core */}
          <motion.div
            className="absolute inset-[14px] flex items-center justify-center rounded-full bg-slate-950"
            animate={{ boxShadow: [`0 0 10px rgba(0,0,0,0.7)`, `0 0 18px rgba(0,0,0,0.9)`] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <span className="text-[0.7rem] font-medium uppercase tracking-eyebrow text-slate-200/80">
              AI
            </span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
