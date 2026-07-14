"use client";

import { ChevronRight } from "lucide-react";

import { CardBody, CardTitle } from "@/lib/ui/card";

type DiscoveryCardProps = {
  onPrimary: () => void;
};

export function DiscoveryCard({ onPrimary }: DiscoveryCardProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-body">✨</span>
        <div className="text-micro font-semibold uppercase tracking-eyebrow text-white/54">
          Your Story
        </div>
      </div>

      <CardTitle as="h2">Start building your Story.</CardTitle>

      <CardBody className="mt-4">
        Your Story is where Everleap starts turning your answers into signals,
        insights, and new possibilities. You can answer a little at a time and
        watch the picture come into focus.
      </CardBody>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="text-meta font-semibold uppercase tracking-eyebrow text-cyan-200/80">
          What starts opening up
        </div>

        <div className="mt-3 space-y-2 text-label leading-6 text-white/82">
          <div>• Story progress</div>
          <div>• Early signals</div>
          <div>• Personalized insights</div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onPrimary}
          className="group inline-flex items-center gap-2 text-label font-semibold tracking-title text-cyan-300 transition hover:text-cyan-100"
        >
          <span>Start My Story</span>
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}