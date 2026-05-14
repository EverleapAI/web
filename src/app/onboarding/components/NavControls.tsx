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
  const isStrong = emphasis === "strong";

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      onClick={onClick}
      disabled={Boolean(disabled)}
      className={[
        "group inline-flex min-h-10 items-center gap-2 rounded-full transition",
        isStrong ? "px-4 py-2" : "px-1 py-1",
        disabled
          ? "cursor-not-allowed text-white/18"
          : emphasis === "quiet"
            ? "text-white/36 hover:text-white/66"
            : isStrong
              ? "border border-cyan-100/16 bg-cyan-100/7 text-cyan-50 shadow-[0_12px_30px_rgba(8,145,178,0.12)] hover:border-cyan-100/28 hover:bg-cyan-100/11 hover:text-white"
              : "text-white/68 hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "relative font-semibold tracking-[0.02em]",
          isStrong ? "text-[14px]" : "text-[15px]",
          isStrong && !disabled
            ? "drop-shadow-[0_0_14px_rgba(103,232,249,0.12)]"
            : "",
        ].join(" ")}
      >
        {label}

        {!isStrong ? (
          <span
            aria-hidden="true"
            className={[
              "absolute -bottom-1 left-0 h-px origin-left rounded-full bg-current transition-transform duration-200",
              disabled
                ? "w-full scale-x-0"
                : "w-full scale-x-0 group-hover:scale-x-100",
            ].join(" ")}
          />
        ) : null}
      </span>

      {arrow ? (
        <span
          aria-hidden="true"
          className={[
            "text-[17px] transition-transform duration-200",
            disabled ? "" : "group-hover:translate-x-0.5",
          ].join(" ")}
        >
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
    <nav className="w-full pt-2 transition-all duration-700">
      <div className="grid min-h-10 grid-cols-[1fr_auto] items-center gap-4 border-t border-white/6 pt-3">
        <div className="flex min-w-0 justify-start">
          {canGoBack ? (
            <BrandedNavLink label="Back" onClick={onBack} emphasis="quiet" />
          ) : (
            <span aria-hidden="true" className="block min-h-10" />
          )}
        </div>

        <div className="flex min-w-0 justify-end">
          {showContinue ? (
            <BrandedNavLink
              label={continueLabel}
              onClick={onContinue}
              disabled={continueDisabled}
              emphasis="strong"
              arrow
            />
          ) : (
            <span aria-hidden="true" className="block min-h-10" />
          )}
        </div>
      </div>
    </nav>
  );
}