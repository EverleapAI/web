// src/components/career/steps/productUx/FinishStep.tsx
"use client";

import * as React from "react";
import type { StepperStep, StepperPersistedState } from "@/components/career/stepperTypes";

type Props = {
  step: StepperStep;
  progress: StepperPersistedState;
  setProgress: React.Dispatch<React.SetStateAction<StepperPersistedState>>;
};

type CommitLevel = "light" | "medium" | "full";

const ZIP_KEY = "everleap.profile.zip.v1";

function readZip(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(ZIP_KEY);
    return (raw ?? "").trim();
  } catch {
    return "";
  }
}

function saveZip(zip: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ZIP_KEY, zip.trim());
  } catch {
    // ignore
  }
}

function openGuide(detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("everleap-open-ai-guide", {
      detail: { source: "career_finish_productUx", ...(detail ?? {}) },
    })
  );
}

function isValidUSZip(value: string) {
  const v = value.trim();
  return /^\d{5}(-\d{4})?$/.test(v);
}

function ChoicePill({
  active,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-panel border px-4 py-3 text-left transition active:scale-[0.99]
        ${active ? "border-sky-300/60 bg-sky-300/10" : "border-white/10 bg-slate-950/40 hover:bg-slate-950/50"}
      `}
    >
      <div className="text-sm font-semibold text-slate-50">{label}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-200/75">{sub}</div>
    </button>
  );
}

function MiniCard({
  title,
  body,
  cta,
  onCta,
}: {
  title: string;
  body: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="rounded-card border border-white/10 bg-slate-950/40 p-4 shadow-[0_14px_42px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-50">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-200/80">{body}</div>
      <div className="mt-3">
        <button
          type="button"
          onClick={onCta}
          className="inline-flex items-center justify-center rounded-full bg-sky-300 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.35)] hover:bg-sky-200 active:scale-95"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

function readString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function FinishStep({ step, progress, setProgress }: Props) {
  const [commit, setCommit] = React.useState<CommitLevel>(() => {
    const v = readString(progress["intensity"]);
    return (v === "light" || v === "medium" || v === "full") ? v : "medium";
  });

  const [zip, setZip] = React.useState<string>(() => {
    const fromProgress = readString(progress["zip"]).trim();
    if (fromProgress) return fromProgress;
    return "94901";
  });

  const [zipTouched, setZipTouched] = React.useState(false);

  React.useEffect(() => {
    const z = readZip();
    if (z) setZip(z);
  }, []);

  const zipOk = !zipTouched ? true : isValidUSZip(zip);

  function handleSaveZip() {
    setZipTouched(true);
    if (!isValidUSZip(zip)) return;
    const trimmed = zip.trim();
    saveZip(trimmed);

    // persist into stepper progress map too
    setProgress((p) => ({
      ...p,
      zip: trimmed,
    }));
  }

  // persist intensity selection
  React.useEffect(() => {
    setProgress((p) => ({
      ...p,
      intensity: commit,
    }));
  }, [commit, setProgress]);

  function sendToGuide(kind: "share_summary" | "custom_plan" | "local_recs") {
    const payload: Record<string, unknown> = {
      laneId: "productUx",
      laneTitle: "Product / UX",
      commit,
      zip: zip.trim(),
      stepId: step.id,
    };

    if (kind === "share_summary") {
      openGuide({
        ...payload,
        intent: "share_summary",
        prompt:
          "Write a short, upbeat summary of this Product/UX recommendation in 5 bullet points (mobile-friendly), ending with ONE question asking what the user wants to try first.",
      });
      return;
    }

    if (kind === "custom_plan") {
      openGuide({
        ...payload,
        intent: "custom_plan",
        prompt:
          "Create a 7-day plan for Product/UX based on the user’s commitment level. Keep steps tiny. End with ONE question about schedule/energy/time.",
      });
      return;
    }

    openGuide({
      ...payload,
      intent: "local_recs",
      prompt:
        "Recommend local places and near-term actions for learning Product/UX based on the user zip code (if present). Include 3–6 options and 3 online resources. End with ONE question.",
    });
  }

  const commitCopy =
    commit === "light"
      ? {
          title: "Light mode",
          body: "Low pressure. You’ll do 2 tiny moves this week and see how it feels.",
        }
      : commit === "full"
      ? {
          title: "Full mode",
          body: "You’re serious. You’ll run the 7-day plan and produce one real artifact.",
        }
      : {
          title: "Medium mode",
          body: "Steady momentum. You’ll do 4–5 days of the plan and get one reaction.",
        };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-white/70">
        Recommendation · {step.title}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Lock in your next move</h1>
        <p className="text-sm leading-relaxed text-slate-200/85">
          Everleap gets powerful when it turns a recommendation into a plan you’ll actually do.
        </p>
      </div>

      {/* Commitment selector */}
      <div className="rounded-card border border-white/10 bg-slate-950/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">Choose your intensity</div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ChoicePill active={commit === "light"} label="Light" sub="2 tiny moves" onClick={() => setCommit("light")} />
          <ChoicePill
            active={commit === "medium"}
            label="Medium"
            sub="4–5 days + feedback"
            onClick={() => setCommit("medium")}
          />
          <ChoicePill active={commit === "full"} label="Full" sub="run the full 7-day" onClick={() => setCommit("full")} />
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-slate-50">{commitCopy.title}</div>
          <div className="mt-1 text-xs leading-relaxed text-slate-200/80">{commitCopy.body}</div>
        </div>
      </div>

      {/* Zip capture (mobile-friendly, optional) */}
      <div className="rounded-card border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">Make it local (optional)</div>
          <div className="mt-1 text-sm text-slate-200/85">
            Add a zip code so we can suggest nearby classes, events, and communities.
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onBlur={handleSaveZip}
            inputMode="numeric"
            placeholder="Zip code"
            className={`
              w-40 rounded-2xl border px-4 py-2 text-sm outline-none
              ${zipOk ? "border-white/10 bg-white/5 text-slate-50" : "border-rose-300/60 bg-rose-500/10 text-rose-100"}
            `}
            aria-label="Zip code"
          />
          <button
            type="button"
            onClick={handleSaveZip}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/10 active:scale-95"
          >
            Save
          </button>
        </div>

        {!zipOk ? <div className="mt-2 text-xs text-rose-200/90">Use a 5-digit US zip (like 94901).</div> : null}
      </div>

      {/* Action cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniCard
          title="Get a custom plan"
          body="We’ll tune the 7-day plan to your schedule + energy level."
          cta="Customize"
          onCta={() => sendToGuide("custom_plan")}
        />
        <MiniCard
          title="Local recommendations"
          body="Find nearby places to learn, meet people, or try UX for real."
          cta="Show local"
          onCta={() => sendToGuide("local_recs")}
        />
        <MiniCard
          title="Shareable summary"
          body="A clean recap you can save, send, or keep for motivation."
          cta="Generate"
          onCta={() => sendToGuide("share_summary")}
        />
      </div>

      {/* Final nudge */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold uppercase tracking-eyebrow text-slate-300/70">One question</div>
        <div className="mt-2 text-sm text-slate-200/85">
          If you had to start today in <span className="text-slate-50 font-semibold">15 minutes</span>, what would you do
          first: sketch a screen, interview one person, or pick a problem?
        </div>
      </div>
    </section>
  );
}
