"use client";

import * as React from "react";
import { CheckSquare, ChevronRight } from "lucide-react";

import {
  bodyText,
  headerIconWrap,
  headerLabel,
  headerRow,
  mutedText,
  sectionCard,
  sectionTitle,
} from "./summaryShared";

type Choice = {
  label: string;
  meta?: string;
};

type Props = {
  dark: boolean;
  eyebrow?: string;
  title?: string;
  body?: string;
  choices?: Choice[];
  hasStrongSignal: boolean;
};

export default function InsightsTinyTaskCard({
  dark,
  eyebrow = "Tiny Task",
  title,
  body,
  choices = [],
  hasStrongSignal,
}: Props) {
  const safeChoices = React.useMemo(
    () =>
      choices
        .map((choice) => ({
          label: (choice?.label ?? "").trim(),
          meta: (choice?.meta ?? "").trim() || undefined,
        }))
        .filter((choice) => choice.label),
    [choices]
  );

  return (
    <section className={sectionCard(dark, "task")}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(120,200,255,0.10) 0%, transparent 28%), radial-gradient(circle at 88% 100%, rgba(120,255,190,0.05) 0%, transparent 22%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "sky")}>
            <CheckSquare className="h-3.5 w-3.5" />
          </div>
          <div className={headerLabel(dark)}>{eyebrow}</div>
        </div>

        <div className={sectionTitle(dark)}>
          {title?.trim() || "Pick the one that’s most true this week."}
        </div>

        {hasStrongSignal ? (
          <>
            {body ? (
              <p className={["mt-3", bodyText(dark)].join(" ")}>{body}</p>
            ) : null}

            {safeChoices.length ? (
              <div className="mt-4 space-y-2">
                {safeChoices.map((choice, index) => (
                  <button
                    key={`${choice.label}_${index}`}
                    type="button"
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-[14px] border px-3.5 py-3 text-left transition",
                      dark
                        ? "border-white/10 bg-white/[0.05] hover:bg-white/[0.07]"
                        : "border-black/10 bg-black/[0.03] hover:bg-black/[0.05]",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div
                        className={
                          dark
                            ? "text-[14px] font-medium text-white/66"
                            : "text-[14px] font-medium text-slate-900"
                        }
                      >
                        {choice.label}
                      </div>

                      {choice.meta ? (
                        <div className={["mt-1", mutedText(dark)].join(" ")}>
                          {choice.meta}
                        </div>
                      ) : null}
                    </div>

                    <ChevronRight
                      className={
                        dark
                          ? "h-4 w-4 shrink-0 text-white/28"
                          : "h-4 w-4 shrink-0 text-slate-400"
                      }
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className={["mt-3", bodyText(dark)].join(" ")}>
                Once we have a stronger signal, this will turn into one small
                experiment you can actually try this week.
              </p>
            )}
          </>
        ) : (
          <>
            <p className={["mt-3", bodyText(dark)].join(" ")}>
              A Tiny Task is one small experiment built from your emerging
              pattern. It is meant to be light, specific, and easy to try this
              week.
            </p>

            <p className={["mt-3", bodyText(dark)].join(" ")}>
              Once we have more signal, this section will turn your strongest
              pattern into one small move that feels realistic enough to do, not
              just think about.
            </p>
          </>
        )}
      </div>
    </section>
  );
}