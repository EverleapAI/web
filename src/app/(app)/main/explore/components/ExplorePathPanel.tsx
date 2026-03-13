"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Gamepad2,
  Blocks,
  HeartHandshake,
  GraduationCap,
  Brain,
  Compass,
  Zap,
  Users,
  Sparkles,
} from "lucide-react";

export type ExplorePathPanelData = {
  id: string;
  title: string;
  hook: string;
  description: string;

  previewLabel?: string;
  previewMeta?: string;
  previewItems?: string[];

  testLabel?: string;
  testMinutes?: string;
  testSteps?: string[];
};

type Props = {
  path: ExplorePathPanelData;
  open: boolean;
  onToggle: () => void;
};

type PathTheme = {
  border: string;
  titleGlow: string;
  shell: string;
  wash: string;
  enter: string;
  enterGlow: string;
  dot: string;
  cardShadow: string;
  ctaBridge: string;
  halo: string;
  signalText: string;
  signalBullet: string;
  signalCard: string;
};

type SignalItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type PathInsight = {
  summary: string;
  signals: SignalItem[];
  ctaBridge: string;
};

function sectionKicker() {
  return "text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46";
}

function getPathHref(pathId: string) {
  switch (pathId) {
    case "game-designer":
      return "/main/explore/work/game-designer";
    case "product-builder":
      return "/main/explore/work/product-ux-builder";
    case "health-support":
      return "/main/explore/work/health-human-support";
    case "teaching":
      return "/main/explore/work/teaching-mentorship";
    default:
      return `/main/explore/work/${pathId}`;
  }
}

function pathTheme(id: string): PathTheme {
  switch (id) {
    case "game-designer":
      return {
        border: "border-cyan-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(80,180,255,0.18)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(90,180,255,0.26), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,180,120,0.16), transparent 58%),
          linear-gradient(135deg, rgba(20,32,60,0.88), rgba(10,16,34,0.82))
        `,
        enter:
          "border-cyan-200/55 text-cyan-50 bg-[linear-gradient(135deg,rgba(120,210,255,0.30),rgba(120,180,255,0.18))] hover:border-cyan-100/70 hover:bg-[linear-gradient(135deg,rgba(140,220,255,0.38),rgba(130,190,255,0.24))]",
        enterGlow:
          "shadow-[0_10px_28px_rgba(80,180,255,0.35),0_0_22px_rgba(120,220,255,0.25)] hover:shadow-[0_14px_34px_rgba(80,180,255,0.42),0_0_28px_rgba(120,220,255,0.32)]",
        dot: "bg-cyan-200 shadow-[0_0_20px_rgba(120,220,255,0.55)]",
        cardShadow:
          "shadow-[0_26px_80px_rgba(0,0,0,0.28),0_0_40px_rgba(120,200,255,0.10)]",
        ctaBridge: "text-cyan-100/84",
        halo:
          "radial-gradient(60% 60% at 50% 50%, rgba(120,200,255,0.18), transparent 70%)",
        signalText: "text-cyan-50/90",
        signalBullet: "bg-cyan-200/80 shadow-[0_0_12px_rgba(120,220,255,0.35)]",
        signalCard:
          "border-cyan-200/18 bg-cyan-300/[0.08] shadow-[0_12px_30px_rgba(60,130,190,0.16)]",
      };

    case "product-builder":
      return {
        border: "border-emerald-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(90,255,190,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(70,255,200,0.20), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(120,180,255,0.14), transparent 58%),
          linear-gradient(135deg, rgba(12,36,40,0.84), rgba(9,16,30,0.84))
        `,
        enter:
          "border-emerald-200/55 text-emerald-50 bg-[linear-gradient(135deg,rgba(120,255,210,0.26),rgba(80,190,170,0.18))] hover:border-emerald-100/70 hover:bg-[linear-gradient(135deg,rgba(135,255,220,0.34),rgba(95,205,180,0.24))]",
        enterGlow:
          "shadow-[0_10px_28px_rgba(70,180,150,0.32),0_0_22px_rgba(120,255,210,0.22)] hover:shadow-[0_14px_34px_rgba(70,180,150,0.40),0_0_28px_rgba(120,255,210,0.30)]",
        dot: "bg-emerald-200 shadow-[0_0_20px_rgba(120,255,210,0.5)]",
        cardShadow:
          "shadow-[0_26px_80px_rgba(0,0,0,0.28),0_0_40px_rgba(120,255,210,0.08)]",
        ctaBridge: "text-emerald-100/84",
        halo:
          "radial-gradient(60% 60% at 50% 50%, rgba(120,255,210,0.16), transparent 70%)",
        signalText: "text-emerald-50/90",
        signalBullet: "bg-emerald-200/80 shadow-[0_0_12px_rgba(120,255,210,0.35)]",
        signalCard:
          "border-emerald-200/18 bg-emerald-300/[0.08] shadow-[0_12px_30px_rgba(40,120,100,0.16)]",
      };

    case "health-support":
      return {
        border: "border-amber-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(255,170,120,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(255,165,120,0.22), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,220,120,0.12), transparent 58%),
          linear-gradient(135deg, rgba(44,22,20,0.84), rgba(14,14,28,0.84))
        `,
        enter:
          "border-amber-200/55 text-amber-50 bg-[linear-gradient(135deg,rgba(255,210,140,0.28),rgba(255,165,120,0.18))] hover:border-amber-100/70 hover:bg-[linear-gradient(135deg,rgba(255,220,155,0.36),rgba(255,175,130,0.24))]",
        enterGlow:
          "shadow-[0_10px_28px_rgba(190,140,70,0.30),0_0_22px_rgba(255,210,140,0.22)] hover:shadow-[0_14px_34px_rgba(190,140,70,0.38),0_0_28px_rgba(255,210,140,0.30)]",
        dot: "bg-amber-200 shadow-[0_0_20px_rgba(255,210,140,0.5)]",
        cardShadow:
          "shadow-[0_26px_80px_rgba(0,0,0,0.28),0_0_40px_rgba(255,200,120,0.08)]",
        ctaBridge: "text-amber-100/84",
        halo:
          "radial-gradient(60% 60% at 50% 50%, rgba(255,210,140,0.16), transparent 70%)",
        signalText: "text-amber-50/90",
        signalBullet: "bg-amber-200/80 shadow-[0_0_12px_rgba(255,210,140,0.35)]",
        signalCard:
          "border-amber-200/18 bg-amber-300/[0.08] shadow-[0_12px_30px_rgba(140,100,40,0.16)]",
      };

    case "teaching":
      return {
        border: "border-violet-300/18",
        titleGlow: "drop-shadow-[0_8px_24px_rgba(180,140,255,0.16)]",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(180,140,255,0.24), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(120,180,255,0.12), transparent 58%),
          linear-gradient(135deg, rgba(34,18,48,0.82), rgba(10,14,30,0.84))
        `,
        enter:
          "border-violet-200/55 text-violet-50 bg-[linear-gradient(135deg,rgba(190,150,255,0.28),rgba(120,180,255,0.16))] hover:border-violet-100/70 hover:bg-[linear-gradient(135deg,rgba(205,165,255,0.36),rgba(135,190,255,0.22))]",
        enterGlow:
          "shadow-[0_10px_28px_rgba(120,90,190,0.32),0_0_22px_rgba(190,150,255,0.22)] hover:shadow-[0_14px_34px_rgba(120,90,190,0.40),0_0_28px_rgba(190,150,255,0.30)]",
        dot: "bg-violet-200 shadow-[0_0_20px_rgba(190,150,255,0.5)]",
        cardShadow:
          "shadow-[0_26px_80px_rgba(0,0,0,0.28),0_0_40px_rgba(190,150,255,0.08)]",
        ctaBridge: "text-violet-100/84",
        halo:
          "radial-gradient(60% 60% at 50% 50%, rgba(190,150,255,0.16), transparent 70%)",
        signalText: "text-violet-50/90",
        signalBullet: "bg-violet-200/80 shadow-[0_0_12px_rgba(190,150,255,0.35)]",
        signalCard:
          "border-violet-200/18 bg-violet-300/[0.08] shadow-[0_12px_30px_rgba(100,70,160,0.16)]",
      };

    default:
      return {
        border: "border-white/12",
        titleGlow: "",
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
        wash: `
          radial-gradient(700px 260px at 0% 0%, rgba(110,170,255,0.18), transparent 58%),
          radial-gradient(520px 240px at 100% 100%, rgba(255,190,120,0.10), transparent 58%),
          linear-gradient(135deg, rgba(16,22,40,0.84), rgba(10,14,28,0.84))
        `,
        enter:
          "border-white/18 bg-white/[0.12] text-white/95 hover:border-white/24 hover:bg-white/[0.16]",
        enterGlow:
          "shadow-[0_10px_28px_rgba(255,255,255,0.12),0_0_22px_rgba(170,190,255,0.12)] hover:shadow-[0_14px_34px_rgba(255,255,255,0.18),0_0_28px_rgba(170,190,255,0.18)]",
        dot: "bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.35)]",
        cardShadow: "shadow-[0_26px_80px_rgba(0,0,0,0.28)]",
        ctaBridge: "text-white/82",
        halo:
          "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.12), transparent 70%)",
        signalText: "text-white/90",
        signalBullet: "bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.25)]",
        signalCard:
          "border-white/16 bg-white/[0.08] shadow-[0_12px_30px_rgba(255,255,255,0.08)]",
      };
  }
}

function getPathInsight(pathId: string): PathInsight {
  switch (pathId) {
    case "game-designer":
      return {
        summary:
          "This usually fits people who notice pacing, reward, friction, balance, and the hidden logic underneath play.",
        ctaBridge:
          "If this direction feels close, step inside and see what it is really asking.",
        signals: [
          { label: "Systems Thinking", icon: Brain },
          { label: "Creative Logic", icon: Zap },
          { label: "Player Instinct", icon: Compass },
          { label: "World-Building", icon: Sparkles },
        ],
      };

    case "product-builder":
      return {
        summary:
          "This tends to pull people who spot friction fast and instinctively want to make things clearer, calmer, and easier to use.",
        ctaBridge:
          "If this direction feels close, open the deeper view and see how this work splits into different roles.",
        signals: [
          { label: "Friction Spotting", icon: Compass },
          { label: "User Empathy", icon: Users },
          { label: "Design Judgment", icon: Brain },
          { label: "Practical Creativity", icon: Sparkles },
        ],
      };

    case "health-support":
      return {
        summary:
          "This often feels right for people who stay present in difficult moments and want their work to genuinely matter to someone else.",
        ctaBridge:
          "If this direction feels close, go deeper into the human reality of what this work asks and gives back.",
        signals: [
          { label: "Empathy", icon: HeartHandshake },
          { label: "Steadiness", icon: Brain },
          { label: "Trust-Building", icon: Users },
          { label: "Care Instinct", icon: Sparkles },
        ],
      };

    case "teaching":
      return {
        summary:
          "This tends to fit people who naturally translate complexity, notice where someone is stuck, and care about helping understanding click.",
        ctaBridge:
          "If this direction feels close, step into the deeper breakdown and see where this path becomes more personal.",
        signals: [
          { label: "Guidance", icon: Users },
          { label: "Clarity", icon: Brain },
          { label: "Growth Instinct", icon: Sparkles },
          { label: "Feedback Energy", icon: Zap },
        ],
      };

    default:
      return {
        summary: "",
        ctaBridge: "Open the deeper breakdown.",
        signals: [],
      };
  }
}

function GameDesignerVisual() {
  return (
    <>
      <div className="absolute inset-0 rounded-full border border-cyan-300/12 bg-cyan-300/[0.03] blur-[1px]" />
      <motion.div
        className="absolute left-[18%] top-[20%] h-[10px] w-[10px] rounded-full bg-cyan-200/80 shadow-[0_0_16px_rgba(120,220,255,0.55)]"
        animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] top-[28%] h-[9px] w-[9px] rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.35)]"
        animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.12, 1] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[24%] left-[32%] h-[9px] w-[9px] rounded-full bg-cyan-100/70 shadow-[0_0_14px_rgba(120,220,255,0.38)]"
        animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.1, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-55"
        viewBox="0 0 128 128"
        fill="none"
      >
        <path
          d="M33 35C47 31 60 31 72 37C83 42 91 51 95 66"
          stroke="rgba(160,225,255,0.28)"
          strokeWidth="1.5"
        />
        <path
          d="M38 84C54 72 72 68 93 70"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
        />
        <path
          d="M51 39L83 44L70 89L38 84L51 39Z"
          stroke="rgba(120,210,255,0.20)"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute bottom-[2%] right-[0%] rounded-full border border-cyan-300/16 bg-cyan-300/10 p-2 text-cyan-100/80">
        <Gamepad2 className="h-4 w-4" />
      </div>
    </>
  );
}

function ProductBuilderVisual() {
  return (
    <>
      <div className="absolute inset-[14%] rounded-[22px] border border-emerald-300/12" />
      <div className="absolute left-[6%] top-[30%] h-[46%] w-[58%] rounded-[18px] border border-emerald-300/10 bg-emerald-300/[0.03]" />
      <div className="absolute right-[8%] top-[18%] h-[42%] w-[48%] rounded-[16px] border border-white/10 bg-white/[0.02]" />
      <motion.div
        className="absolute left-[22%] top-[18%] h-[9px] w-[9px] rounded-full bg-emerald-200/75 shadow-[0_0_14px_rgba(120,255,210,0.45)]"
        animate={{ opacity: [0.35, 0.95, 0.35] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] bottom-[24%] h-[9px] w-[9px] rounded-full bg-white/65"
        animate={{ opacity: [0.3, 0.85, 0.3] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-[2%] right-[0%] rounded-full border border-emerald-300/16 bg-emerald-300/10 p-2 text-emerald-100/80">
        <Blocks className="h-4 w-4" />
      </div>
    </>
  );
}

function HealthSupportVisual() {
  return (
    <>
      <motion.div
        className="absolute inset-[18%] rounded-full border border-amber-300/12"
        animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[33%] rounded-full border border-amber-200/16"
        animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.62, 0.28] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/75 shadow-[0_0_20px_rgba(255,210,140,0.4)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 128 128"
        fill="none"
      >
        <path
          d="M26 69C34 69 37 58 44 58C51 58 53 75 62 75C71 75 74 49 82 49C90 49 93 65 102 65"
          stroke="rgba(255,226,176,0.26)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="absolute bottom-[2%] right-[0%] rounded-full border border-amber-300/16 bg-amber-300/10 p-2 text-amber-100/80">
        <HeartHandshake className="h-4 w-4" />
      </div>
    </>
  );
}

function TeachingVisual() {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full opacity-45"
        viewBox="0 0 128 128"
        fill="none"
      >
        <path
          d="M26 92C40 78 51 65 61 49C73 62 85 72 102 83"
          stroke="rgba(196,176,255,0.28)"
          strokeWidth="1.5"
        />
        <path
          d="M37 48C47 51 56 56 63 64C72 55 81 49 95 45"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.5"
        />
      </svg>
      <motion.div
        className="absolute left-[22%] top-[20%] h-[9px] w-[9px] rounded-full bg-violet-200/80 shadow-[0_0_14px_rgba(190,150,255,0.45)]"
        animate={{ opacity: [0.35, 0.95, 0.35] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] top-[28%] h-[9px] w-[9px] rounded-full bg-white/70"
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[24%] left-[32%] h-[9px] w-[9px] rounded-full bg-violet-100/70"
        animate={{ opacity: [0.35, 0.85, 0.35] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-[2%] right-[0%] rounded-full border border-violet-300/16 bg-violet-300/10 p-2 text-violet-100/80">
        <GraduationCap className="h-4 w-4" />
      </div>
    </>
  );
}

function PathVisual({ id }: { id: string }) {
  return (
    <>
      <div className="pointer-events-none absolute right-3 top-4 h-20 w-20 opacity-[0.82] sm:right-4 sm:top-5 sm:h-24 sm:w-24 lg:hidden">
        {id === "game-designer" ? (
          <GameDesignerVisual />
        ) : id === "product-builder" ? (
          <ProductBuilderVisual />
        ) : id === "health-support" ? (
          <HealthSupportVisual />
        ) : (
          <TeachingVisual />
        )}
      </div>

      <div className="pointer-events-none absolute right-4 top-5 hidden h-32 w-32 lg:block">
        {id === "game-designer" ? (
          <GameDesignerVisual />
        ) : id === "product-builder" ? (
          <ProductBuilderVisual />
        ) : id === "health-support" ? (
          <HealthSupportVisual />
        ) : (
          <TeachingVisual />
        )}
      </div>
    </>
  );
}

function SignalPreview({
  items,
  textClassName,
  bulletClassName,
  cardClassName,
}: {
  items: SignalItem[];
  textClassName: string;
  bulletClassName: string;
  cardClassName: string;
}) {
  return (
    <div className={["mt-5 rounded-[22px] border px-4 py-4", cardClassName].join(" ")}>
      <div className={sectionKicker()}>Signals I&apos;m picking up</div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 ? (
              <span
                aria-hidden
                className={["h-1 w-1 rounded-full", bulletClassName].join(" ")}
              />
            ) : null}

            <div
              className={[
                "inline-flex items-center gap-2 text-[13px] font-semibold sm:text-[13.5px]",
                textClassName,
              ].join(" ")}
            >
              <item.icon className="h-3.5 w-3.5 opacity-80" />
              <span>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function ExplorePathPanel({ path }: Props) {
  const theme = pathTheme(path.id);
  const href = getPathHref(path.id);
  const insight = getPathInsight(path.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={[
        "group relative overflow-hidden rounded-[30px] border backdrop-blur-2xl",
        "transition-all duration-300 hover:brightness-[1.03]",
        theme.border,
        theme.shell,
        theme.cardShadow,
      ].join(" ")}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[2px] rounded-[34px] opacity-40 blur-2xl"
        animate={{
          opacity: [0.28, 0.45, 0.28],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: theme.halo,
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.wash }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute inset-y-0 w-[24%]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.00) 12%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.00) 88%, transparent 100%)",
            filter: "blur(14px)",
          }}
          animate={{ x: ["-140%", "360%"] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-1/2 hidden h-28 w-28 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl sm:block"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-white/[0.04] blur-3xl sm:block"
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative"
        whileHover={{ x: 2 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <PathVisual id={path.id} />
      </motion.div>

      <div className="relative px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(160px,0.45fr)] lg:items-start">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <motion.span
                aria-hidden
                className={[
                  "mt-[14px] h-2.5 w-2.5 shrink-0 rounded-full",
                  theme.dot,
                ].join(" ")}
                animate={{
                  opacity: [0.45, 0.85, 0.45],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="min-w-0">
                <h2
                  className={[
                    "pb-1 pr-16 text-[1.9rem] font-semibold tracking-tight leading-[1.14] text-white sm:pr-20 sm:text-[2.15rem] lg:pr-0",
                    theme.titleGlow,
                  ].join(" ")}
                >
                  {path.title}
                </h2>

                <p className="mt-3 max-w-[38ch] pr-12 text-[17px] leading-8 text-white/88 sm:pr-16 sm:text-[18px] lg:pr-0">
                  {path.hook}
                </p>

                <div className="mt-4 max-w-[78ch] space-y-3 pr-6 sm:pr-10 lg:pr-0">
                  <p className="text-[15px] leading-7 text-white/68 sm:text-[15.5px]">
                    {path.description}
                  </p>

                  <p className="text-[15px] leading-7 text-white/84 sm:text-[15.5px]">
                    {insight.summary}
                  </p>
                </div>

                {insight.signals.length ? (
                  <SignalPreview
                    items={insight.signals}
                    textClassName={theme.signalText}
                    bulletClassName={theme.signalBullet}
                    cardClassName={theme.signalCard}
                  />
                ) : null}

                <p
                  className={[
                    "mt-5 max-w-[68ch] text-[14px] leading-6",
                    theme.ctaBridge,
                  ].join(" ")}
                >
                  {insight.ctaBridge}
                </p>

                <div className="mt-5">
                  <motion.div
                    whileHover={{ y: -1, scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="inline-block"
                  >
                    <Link
                      href={href}
                      className={[
                        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border px-6 py-3.5 text-[16px] font-semibold backdrop-blur-xl transition-all duration-200",
                        "before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.18)_48%,transparent_78%)] before:translate-x-[-140%] before:transition-transform before:duration-700 hover:before:translate-x-[140%]",
                        "hover:-translate-y-[1px]",
                        theme.enter,
                        theme.enterGlow,
                      ].join(" ")}
                    >
                      <span className="relative">Explore this path</span>
                      <ArrowUpRight className="relative h-[18px] w-[18px] opacity-95 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}