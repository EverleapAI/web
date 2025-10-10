"use client";

type Props = {
  /** 0 → 1 */
  value: number;
  /** Show percent text to the right (optional) */
  showPercent?: boolean;
  /** Accessible label for the progressbar (optional) */
  label?: string;
  /** Optional extra classes on the outer wrapper */
  className?: string;
};

export default function ProgressBar({ value, showPercent, label, className }: Props) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const pct = Math.round(clamped * 100);

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        {...(label ? { "aria-label": label, "aria-valuetext": `${pct}%` } : {})}
        className="progress-track"
        title={`${pct}%`}
      >
        <div
          className="progress-fill transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs tabular-nums opacity-70" aria-hidden="true">
          {pct}%
        </span>
      )}
    </div>
  );
}
