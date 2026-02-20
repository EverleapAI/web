// src/components/main/CarouselCard.tsx
"use client";

import type { MainCarouselCard, IconToken } from "@/app/(app)/main/mainCarouselData";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Heart,
  Shield,
  Wrench,
  Zap,
  Users,
  Home,
  Compass,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

interface CarouselCardProps {
  card: MainCarouselCard;
  isActive: boolean;
}

function IconForToken({ token }: { token: IconToken }) {
  const commonClasses = "h-7 w-7 md:h-8 md:w-8";

  switch (token) {
    case "spark":
      return <Sparkles className={commonClasses} />;
    case "heart":
      return <Heart className={commonClasses} />;
    case "shield":
      return <Shield className={commonClasses} />;
    case "tools":
      return <Wrench className={commonClasses} />;
    case "bolt":
      return <Zap className={commonClasses} />;
    case "people":
      return <Users className={commonClasses} />;
    case "home":
      return <Home className={commonClasses} />;
    case "compass":
      return <Compass className={commonClasses} />;
    case "book":
      return <BookOpen className={commonClasses} />;
    default:
      return <Sparkles className={commonClasses} />;
  }
}

export function CarouselCard({ card, isActive }: CarouselCardProps) {
  const baseGlow = card.accentColor;

  return (
    <motion.div
      className={cn(
        "relative flex h-32 w-28 md:h-36 md:w-32 cursor-pointer items-stretch justify-stretch"
      )}
      initial={false}
      animate={{
        scale: isActive ? 1 : 0.92,
        opacity: isActive ? 1 : 0.75,
        y: isActive ? 0 : 4,
        rotateX: isActive ? 0 : 5,
      }}
      whileHover={{
        scale: isActive ? 1.05 : 0.96,
        y: -2,
        rotateX: 0,
      }}
      whileTap={{
        scale: 0.96,
        rotateX: 2,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
      }}
      style={{ transformPerspective: 900 }}
    >
      {/* Outer glow ring */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[1.4rem] opacity-0 blur-xl transition-opacity duration-300",
          isActive && "opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${baseGlow}66, transparent 62%)`,
        }}
      />

      {/* Card surface */}
      <div
        className={cn(
          "relative flex w-full flex-col items-center justify-between overflow-hidden rounded-[1.25rem] border px-3 py-3 text-center shadow-[0_14px_32px_rgba(0,0,0,0.78)] backdrop-blur-2xl",
          "hover:border-white/22"
        )}
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.06), transparent 55%), var(--el-bg-elevated)",
          borderColor: isActive
            ? "rgba(248, 250, 252, 0.5)"
            : "var(--el-border-subtle)",
        }}
      >
        {/* Accent strip at top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent, ${baseGlow}, transparent)`,
          }}
        />

        {/* Decorative light flecks */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.25rem]">
          <div
            className="absolute -right-3 -top-5 h-12 w-12 rounded-full opacity-40 blur-xl"
            style={{ background: `${baseGlow}66` }}
          />
          <div className="absolute left-2 bottom-2 h-8 w-8 rounded-full bg-white/5 blur-xl" />
        </div>

        {/* Content: big icon on its own line, title below */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-2 md:gap-3">
          {/* Icon orb */}
          <div
            className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-3xl bg-slate-950/85 shadow-inner"
            style={{
              boxShadow:
                "0 0 0 1px rgba(15,23,42,0.9), 0 8px 18px rgba(0,0,0,0.9)",
            }}
          >
            <IconForToken token={card.icon} />
          </div>

          {/* Title only */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-200 md:text-[0.72rem]">
              {card.title}
            </span>

            {/* Tiny accent bar under title */}
            <span className="h-1 w-8 rounded-full bg-slate-800/90">
              <span
                className="block h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${baseGlow}, rgba(255,255,255,0.9))`,
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
