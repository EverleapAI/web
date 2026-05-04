"use client";

import * as React from "react";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import { getArrayAnswer, getTextAnswer } from "../engine/useOnboardingFlow";
import { nodeVisuals, type AnimationPreset } from "./nodeVisuals";

export type InstinctStyle = "none" | "wolf" | "fox" | "dolphin" | "hawk";

export type OnboardingAnimationState = {
  preset: AnimationPreset;
  nodeKey: string;
  progress: number;
  nodeCount: number;
  branchCount: number;
  certainty: string;
  instinctStyle: InstinctStyle;
  activityCount: number;
};

function getInstinctStyle(value: string): InstinctStyle {
  if (value === "wolf") return "wolf";
  if (value === "fox") return "fox";
  if (value === "dolphin") return "dolphin";
  if (value === "hawk") return "hawk";
  return "none";
}

function getPresetForNode(node: FlowNode): AnimationPreset {
  const mappedPreset = nodeVisuals[node.key];

  if (mappedPreset) {
    return mappedPreset;
  }

  if (node.type === "story") {
    return "connect";
  }

  if (node.type === "question") {
    return "scatter";
  }

  if (node.type === "summary") {
    return "finalMap";
  }

  return "idle";
}

export function useAnimationState({
  currentNode,
  nodes,
  answers,
}: {
  currentNode: FlowNode | null;
  nodes: FlowNode[];
  answers: Answers;
}): OnboardingAnimationState {
  return React.useMemo(() => {
    const nodeKey = currentNode?.key ?? "none";
    const preset = currentNode ? getPresetForNode(currentNode) : "idle";

    const progress =
      currentNode && nodes.length > 0
        ? Math.max(0, Math.min(1, currentNode.sortOrder / nodes.length))
        : 0;

    const activities = getArrayAnswer(answers, "activities");
    const certainty = getTextAnswer(answers, "certainty");
    const instinct = getTextAnswer(answers, "fun_instinct");

    const branchCount =
      certainty === "clear"
        ? 2
        : certainty === "somewhat"
          ? 3
          : certainty === "uncertain"
            ? 5
            : certainty === "no_idea"
              ? 6
              : 3;

    return {
      preset,
      nodeKey,
      progress,
      nodeCount: Math.max(1, 2 + activities.length),
      branchCount,
      certainty,
      instinctStyle: getInstinctStyle(instinct),
      activityCount: activities.length,
    };
  }, [answers, currentNode, nodes]);
}