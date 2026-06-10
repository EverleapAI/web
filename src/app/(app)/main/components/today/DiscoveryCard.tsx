"use client";

import { ChevronRight } from "lucide-react";

type DiscoveryCardProps = {
  onPrimary: () => void;
};

export function DiscoveryCard({ onPrimary }: DiscoveryCardProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[18px]">✨</span>
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/54">
          Your Story
        </div>
      </div>

      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-white">
        Start building your Story.
      </h2>

      <p className="mt-4 text-[15px] leading-7 tracking-[-0.015em] text-white/80">
        Your Story is where Everleap starts turning your answers into signals,
        insights, and new possibilities. You can answer a little at a time and
        watch the picture come into focus.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          What starts opening up
        </div>

        <div className="mt-3 space-y-2 text-[14px] leading-6 text-white/82">
          <div>• Story progress</div>
          <div>• Early signals</div>
          <div>• Personalized insights</div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onPrimary}
          className="group inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-cyan-300 transition hover:text-cyan-100"
        >
          <span>Start My Story</span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}