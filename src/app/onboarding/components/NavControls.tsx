"use client";

import { motion } from "framer-motion";

type Props = {
  canGoBack: boolean;
  showContinue: boolean;
  continueLabel?: string;
  continueDisabled?: boolean;
  onBack: () => void;
  onContinue: () => void;
};

function BrandedNavLink({
  label,
  onClick,
  disabled,
  emphasis = "default",
  arrow = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  emphasis?: "default" | "quiet" | "strong";
  arrow?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.988 }}
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "group inline-flex items-center gap-2 rounded-full px-1 py-1 transition",
        disabled
          ? "cursor-not-allowed text-white/18"
          : emphasis === "quiet"
            ? "text-white/44 hover:text-white/72"
            : emphasis === "strong"
              ? "text-cyan-100 hover:text-white"
              : "text-white/72 hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "relative text-[15px] font-semibold tracking-[0.02em]",
          emphasis === "strong" ? "drop-shadow-[0_0_14px_rgba(103,232,249,0.18)]" : "",
        ].join(" ")}
      >
        {label}
        <span
          aria-hidden="true"
          className={[
            "absolute -bottom-1 left-0 h-px origin-left rounded-full bg-current transition-transform duration-200",
            disabled ? "w-full scale-x-0" : "w-full scale-x-0 group-hover:scale-x-100",
          ].join(" ")}
        />
      </span>

      {arrow ? (
        <span aria-hidden="true" className="text-[17px]">
          →
        </span>
      ) : null}
    </motion.button>
  );
}

export default function NavControls({
  canGoBack,
  showContinue,
  continueLabel = "Continue",
  continueDisabled,
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="mt-8 w-full max-w-[720px] px-5">
      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
          {canGoBack ? (
            <BrandedNavLink label="Back" onClick={onBack} emphasis="quiet" />
          ) : null}

          {showContinue ? (
            <BrandedNavLink
              label={continueLabel}
              onClick={onContinue}
              disabled={continueDisabled}
              emphasis="strong"
              arrow
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}