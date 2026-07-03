"use client";

import * as React from "react";

export type MicroTaskBatchItem = {
  id: string;
  question: string;
  options: string[];
  signal_key: string;
  selected_option: string | null;
  selected_option_index: number | null;
};

export function useMicroTaskBatch(tasks: MicroTaskBatchItem[]) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [localAnswers, setLocalAnswers] = React.useState<
    Record<string, number>
  >({});

  const idsKey = tasks.map((task) => task.id).join(",");

  React.useEffect(() => {
    setActiveIndex(0);
    setLocalAnswers({});
  }, [idsKey]);

  const isAnswered = React.useCallback(
    (task: MicroTaskBatchItem) =>
      localAnswers[task.id] != null || task.selected_option_index != null,
    [localAnswers]
  );

  const allAnswered = tasks.length > 0 && tasks.every(isAnswered);
  const current = activeIndex < tasks.length ? tasks[activeIndex] : null;
  const canGoBack = activeIndex > 0 && !allAnswered;

  function selectedIndexFor(task: MicroTaskBatchItem): number | null {
    return localAnswers[task.id] ?? task.selected_option_index ?? null;
  }

  async function answer(index: number) {
    const task = current;
    if (!task) return;

    setLocalAnswers((prev) => ({ ...prev, [task.id]: index }));

    fetch(`/api/micro-tasks/${task.id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_option_index: index }),
    }).catch((error) => {
      console.error("Failed to save tiny task answer", error);
    });

    const nextUnansweredIndex = tasks.findIndex((candidate, taskIndex) => {
      if (taskIndex <= activeIndex) return false;
      if (candidate.id === task.id) return false;
      return !isAnswered(candidate);
    });

    setActiveIndex(nextUnansweredIndex >= 0 ? nextUnansweredIndex : tasks.length);
  }

  function goBack() {
    if (!canGoBack) return;
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  return {
    current,
    allAnswered,
    canGoBack,
    answer,
    goBack,
    selectedIndexFor,
  };
}
