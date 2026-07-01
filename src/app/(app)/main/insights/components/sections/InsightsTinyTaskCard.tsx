"use client";

import * as React from "react";
import { Check, CheckSquare } from "lucide-react";

import {
  bodyText,
  cardBody,
  constellationOrnament,
  headerCopyStack,
  headerIconWrap,
  headerLabel,
  headerMain,
  headerRow,
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
  taskId?: string | null;
  selectedOptionIndex?: number | null;
};

function optionBase(dark: boolean, selected: boolean) {
  return [
    "w-full rounded-[14px] px-3 py-2.5 text-left transition",
    "focus-visible:outline-none",
    dark
      ? selected
        ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.18)_0%,rgba(14,165,233,0.12)_100%)] ring-1 ring-sky-300/30"
        : "bg-[linear-gradient(135deg,rgba(28,48,70,0.78)_0%,rgba(24,44,68,0.82)_100%)] hover:bg-[linear-gradient(135deg,rgba(56,189,248,0.12)_0%,rgba(14,165,233,0.08)_100%)] ring-1 ring-white/6"
      : selected
        ? "bg-sky-100 ring-1 ring-sky-300"
        : "bg-white hover:bg-sky-50 ring-1 ring-black/8",
    dark
      ? "focus-visible:ring-2 focus-visible:ring-sky-300/30"
      : "focus-visible:ring-2 focus-visible:ring-sky-500/30",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
  ].join(" ");
}

function labelClass(dark: boolean, selected: boolean) {
  if (!dark) return selected ? "text-slate-950" : "text-slate-900";
  return selected ? "text-white/90" : "text-white/78";
}

function metaClass(dark: boolean, selected: boolean) {
  if (!dark) return selected ? "text-slate-700" : "text-slate-500";
  return selected ? "text-white/64" : "text-white/46";
}

function checkWrap(dark: boolean, selected: boolean) {
  return [
    "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full transition",
    selected
      ? dark
        ? "bg-sky-300/22 text-sky-100 ring-1 ring-sky-300/30"
        : "bg-sky-500/20 text-sky-700 ring-1 ring-sky-500/30"
      : dark
        ? "bg-white/[0.035] text-white/26 ring-1 ring-white/6"
        : "bg-black/6 text-black/18 ring-1 ring-black/6",
  ].join(" ");
}

export default function InsightsTinyTaskCard({
  dark,
  eyebrow = "Something I’m Wondering",
  title,
  body,
  choices = [],
  hasStrongSignal,
  taskId,
  selectedOptionIndex,
}: Props) {
  const safeChoices = React.useMemo(
    () =>
      choices
        .map((choice, index) => ({
          originalIndex: index,
          label: (choice?.label ?? "").trim(),
          meta: (choice?.meta ?? "").trim() || undefined,
        }))
        .filter((choice) => choice.label)
        .slice(0, 3),
    [choices]
  );

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    selectedOptionIndex ?? null
  );

  React.useEffect(() => {
    setSelectedIndex(selectedOptionIndex ?? null);
  }, [taskId, selectedOptionIndex]);

  async function select(index: number) {
    if (!taskId) return;

    setSelectedIndex(index);

    try {
      const res = await fetch(`/api/micro-tasks/${taskId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected_option_index: index }),
      });

      if (!res.ok) {
        console.error("Failed to save tiny task answer", {
          status: res.status,
          body: await res.text(),
        });
      }
    } catch (error) {
      console.error("Failed to save tiny task answer", error);
    }
  }

  return (
    <section
      className={[
        sectionCard(dark, "task"),
        "overflow-hidden px-3 py-3.5 sm:px-4 sm:py-4.5",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(56,189,248,0.14) 0%, transparent 30%), radial-gradient(circle at 88% 100%, rgba(34,211,238,0.08) 0%, transparent 24%)",
        }}
      />

      <div className="relative">
        <div className={headerRow()}>
          <div className={headerIconWrap(dark, "sky")}>
            <CheckSquare className="h-3.5 w-3.5" />
          </div>

          <div className={headerMain()}>
            <div className={headerCopyStack()}>
              <div className={headerLabel(dark)}>{eyebrow}</div>
            </div>
          </div>

          {constellationOrnament(dark, "task")}
        </div>

        <div className={cardBody()}>
          <div className={sectionTitle(dark)}>
            {title?.trim() || "Pick the one that’s most true this week."}
          </div>

          {hasStrongSignal ? (
            <>
              {body ? (
                <p
                  className={[
                    "mt-2.5",
                    bodyText(dark),
                    "text-[14px] leading-[1.65] sm:text-[14.5px]",
                  ].join(" ")}
                >
                  {body}
                </p>
              ) : null}

              {safeChoices.length ? (
                <div className="mt-3 space-y-2">
                  {safeChoices.map((choice) => {
                    const selected = selectedIndex === choice.originalIndex;

                    return (
                      <button
                        key={choice.originalIndex}
                        type="button"
                        onClick={() => select(choice.originalIndex)}
                        className={optionBase(dark, selected)}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="min-w-0">
                            <div
                              className={[
                                "text-[13.5px] font-medium leading-5 sm:text-[14px]",
                                labelClass(dark, selected),
                              ].join(" ")}
                            >
                              {choice.label}
                            </div>

                            {choice.meta ? (
                              <div
                                className={[
                                  "mt-0.5 text-[12px] leading-5 sm:text-[12.5px]",
                                  metaClass(dark, selected),
                                ].join(" ")}
                              >
                                {choice.meta}
                              </div>
                            ) : null}
                          </div>

                          <span className={checkWrap(dark, selected)} aria-hidden>
                            {selected ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </>
          ) : (
            <p
              className={[
                "mt-2.5",
                bodyText(dark),
                "text-[14px] leading-[1.65] sm:text-[14.5px]",
              ].join(" ")}
            >
              A Tiny Task is one small experiment. Once we have more signal, this
              turns into something simple you can actually try this week.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}