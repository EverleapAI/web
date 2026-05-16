"use client";

import * as React from "react";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import { getArrayAnswer, getTextAnswer } from "../engine/useOnboardingFlow";
import { nodeVisuals, type AnimationPreset } from "./nodeVisuals";

export type InstinctStyle =
  | "none"
  | "wolf"
  | "fox"
  | "dolphin"
  | "hawk";

export type OnboardingSection =
  | "intro"
  | "discovery"
  | "transition";

export type VisualConcept =
  | "arrival"
  | "signal"
  | "terrain"
  | "branch"
  | "network"
  | "instinct"
  | "reflection"
  | "unknown";

export type OnboardingAnimationState = {
  preset: AnimationPreset;
  nodeKey: string;
  section: OnboardingSection;
  visualConcept: VisualConcept;
  progress: number;
  nodeCount: number;
  branchCount: number;
  certainty: string;
  instinctStyle: InstinctStyle;
  activityCount: number;
  isIntro: boolean;
  isQuestions: boolean;
  isTransition: boolean;
  showProgress: boolean;
};

const INTRO_NODE_KEYS = new Set([
  "welcome",
  "how_it_works",
  "what_you_get",
  "progress",
  "lets_get_started",
]);

const TRANSITION_NODE_KEYS = new Set([
  "summary_transition",
  "summary",
  "regauth_transition",
]);

function getInstinctStyle(value: string): InstinctStyle {
  if (value === "wolf") return "wolf";
  if (value === "fox") return "fox";
  if (value === "dolphin") return "dolphin";
  if (value === "hawk") return "hawk";

  return "none";
}

function getSectionForNode(
  node: FlowNode | null
): OnboardingSection {
  if (!node) return "intro";

  if (
    node.type === "summary" ||
    TRANSITION_NODE_KEYS.has(node.key)
  ) {
    return "transition";
  }

  if (INTRO_NODE_KEYS.has(node.key)) {
    return "intro";
  }

  return "discovery";
}

function getVisualConceptForNode(
  node: FlowNode | null
): VisualConcept {
  if (!node) return "unknown";

  if (
    node.type === "summary" ||
    TRANSITION_NODE_KEYS.has(node.key)
  ) {
    return "reflection";
  }

  if (INTRO_NODE_KEYS.has(node.key)) {
    return "arrival";
  }

  if (node.key === "permissions") {
    return "signal";
  }

  if (node.key === "current_situation") {
    return "terrain";
  }

  if (
    node.key === "certainty" ||
    node.key === "certainty_idea"
  ) {
    return "branch";
  }

  if (
    node.key === "activities" ||
    node.key === "post_plans"
  ) {
    return "network";
  }

  if (node.key === "fun_instinct") {
    return "instinct";
  }

  return "unknown";
}

function getPresetForNode(node: FlowNode): AnimationPreset {
  const section = getSectionForNode(node);

  if (section === "transition") {
    return "finalMap";
  }

  if (section === "intro") {
    return "idle";
  }

  const mappedPreset = nodeVisuals[node.key];

  if (mappedPreset) {
    return mappedPreset;
  }

  if (node.key === "current_situation") {
    return "terrain";
  }

  if (
    node.key === "certainty" ||
    node.key === "certainty_idea"
  ) {
    return "branching";
  }

  if (
    node.key === "activities" ||
    node.key === "post_plans"
  ) {
    return "networkGrow";
  }

  if (node.key === "fun_instinct") {
    return "instinctShift";
  }

  return "connect";
}

function getBranchCount(certainty: string) {
  if (certainty === "clear" || certainty === "strong") return 2;
  if (certainty === "somewhat" || certainty === "kinda") return 3;
  if (certainty === "uncertain") return 5;
  if (certainty === "no_idea" || certainty === "no_clue") return 6;

  return 3;
}

function getDiscoveryNodes(nodes: FlowNode[]) {
  return nodes.filter(
    (node) => getSectionForNode(node) === "discovery"
  );
}

function getDiscoveryProgress(
  nodes: FlowNode[],
  currentNode: FlowNode | null
) {
  if (!currentNode || nodes.length === 0) return 0;

  const discoveryNodes = getDiscoveryNodes(nodes);

  if (discoveryNodes.length === 0) return 0;

  const currentIndex = discoveryNodes.findIndex(
    (node) => node.id === currentNode.id
  );

  if (currentIndex < 0) return 0;

  return Math.max(
    0,
    Math.min(
      1,
      currentIndex / Math.max(1, discoveryNodes.length - 1)
    )
  );
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

    const section = getSectionForNode(currentNode);

    const visualConcept =
      getVisualConceptForNode(currentNode);

    const preset = currentNode
      ? getPresetForNode(currentNode)
      : "idle";

    const activities = getArrayAnswer(
      answers,
      "activities"
    );

    const certainty = getTextAnswer(
      answers,
      "certainty"
    );

    const instinct = getTextAnswer(
      answers,
      "fun_instinct"
    );

    const isIntro = section === "intro";
    const isQuestions = section === "discovery";
    const isTransition = section === "transition";

    return {
      preset,
      nodeKey,
      section,
      visualConcept,
      progress: isQuestions
        ? getDiscoveryProgress(nodes, currentNode)
        : 0,
      nodeCount: Math.max(1, 2 + activities.length),
      branchCount: getBranchCount(certainty),
      certainty,
      instinctStyle: getInstinctStyle(instinct),
      activityCount: activities.length,
      isIntro,
      isQuestions,
      isTransition,
      showProgress: isQuestions,
    };
  }, [answers, currentNode, nodes]);
}