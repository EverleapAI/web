"use client";

import * as React from "react";

import type { Answers, FlowNode } from "../engine/useOnboardingFlow";
import { getArrayAnswer, getTextAnswer } from "../engine/useOnboardingFlow";
import { nodeVisuals, type AnimationPreset } from "./nodeVisuals";

export type InstinctStyle = "none" | "wolf" | "fox" | "dolphin" | "hawk";

export type OnboardingSection =
  | "what-is-everleap"
  | "discovery"
  | "transition";

export type VisualConcept =
  | "arrival"
  | "nameTag"
  | "signal"
  | "terrain"
  | "branch"
  | "horizon"
  | "network"
  | "instinct"
  | "map"
  | "reflection"
  | "unknown";

export type OnboardingChapter =
  | "arrival"
  | "discovery"
  | "grounding"
  | "branching"
  | "expansion"
  | "reflection";

export type OnboardingAnimationState = {
  preset: AnimationPreset;
  nodeKey: string;
  section: OnboardingSection;
  chapter: OnboardingChapter;
  visualConcept: VisualConcept;
  progress: number;
  nodeCount: number;
  branchCount: number;
  certainty: string;
  instinctStyle: InstinctStyle;
  activityCount: number;
  isWelcome: boolean;
  isQuestions: boolean;
  isReflection: boolean;
  showProgress: boolean;
};

const WHAT_IS_EVERLEAP_NODE_KEYS = new Set([
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

const ARRIVAL_NODE_KEYS = new Set([
  "welcome",
  "how_it_works",
  "what_you_get",
  "progress",
  "lets_get_started",
]);

const DISCOVERY_NODE_KEYS = new Set([
  "permissions",
  "name",
  "activities",
]);

const GROUNDING_NODE_KEYS = new Set([
  "current_situation",
]);

const BRANCHING_NODE_KEYS = new Set([
  "certainty",
  "certainty_idea",
]);

const EXPANSION_NODE_KEYS = new Set([
  "post_plans",
  "fun_instinct",
]);

function getInstinctStyle(value: string): InstinctStyle {
  if (value === "wolf") return "wolf";
  if (value === "fox") return "fox";
  if (value === "dolphin") return "dolphin";
  if (value === "hawk") return "hawk";

  return "none";
}

function getSectionForNode(node: FlowNode | null): OnboardingSection {
  if (!node) return "what-is-everleap";

  if (node.type === "summary" || TRANSITION_NODE_KEYS.has(node.key)) {
    return "transition";
  }

  if (WHAT_IS_EVERLEAP_NODE_KEYS.has(node.key)) {
    return "what-is-everleap";
  }

  return "discovery";
}

function getChapterForNode(node: FlowNode | null): OnboardingChapter {
  if (!node) return "arrival";

  if (node.type === "summary" || TRANSITION_NODE_KEYS.has(node.key)) {
    return "reflection";
  }

  if (ARRIVAL_NODE_KEYS.has(node.key)) {
    return "arrival";
  }

  if (DISCOVERY_NODE_KEYS.has(node.key)) {
    return "discovery";
  }

  if (GROUNDING_NODE_KEYS.has(node.key)) {
    return "grounding";
  }

  if (BRANCHING_NODE_KEYS.has(node.key)) {
    return "branching";
  }

  if (EXPANSION_NODE_KEYS.has(node.key)) {
    return "expansion";
  }

  return "discovery";
}

function getPresetForNode(node: FlowNode): AnimationPreset {
  if (getSectionForNode(node) === "transition") {
    return "idle";
  }

  const mappedPreset = nodeVisuals[node.key];

  if (mappedPreset) {
    return mappedPreset;
  }

  const chapter = getChapterForNode(node);

  switch (chapter) {
    case "arrival":
      return "anchor";

    case "discovery":
      return "networkGrow";

    case "grounding":
      return "terrain";

    case "branching":
      return "branching";

    case "expansion":
      return "branchExtend";

    case "reflection":
      return "finalMap";

    default:
      return "connect";
  }
}

function getVisualConceptForNode(node: FlowNode | null): VisualConcept {
  if (!node) return "unknown";

  if (node.type === "summary" || TRANSITION_NODE_KEYS.has(node.key)) {
    return "reflection";
  }

  if (node.key === "name") {
    return "nameTag";
  }

  if (WHAT_IS_EVERLEAP_NODE_KEYS.has(node.key)) {
    return "arrival";
  }

  if (node.key === "permissions") {
    return "signal";
  }

  if (node.key === "current_situation") {
    return "terrain";
  }

  if (BRANCHING_NODE_KEYS.has(node.key)) {
    return "branch";
  }

  if (node.key === "post_plans") {
    return "horizon";
  }

  if (node.key === "activities") {
    return "network";
  }

  if (node.key === "fun_instinct") {
    return "instinct";
  }

  return "unknown";
}

function getBranchCount(certainty: string) {
  if (certainty === "clear" || certainty === "strong") return 2;
  if (certainty === "somewhat" || certainty === "kinda") return 3;
  if (certainty === "uncertain") return 5;
  if (certainty === "no_idea" || certainty === "no_clue") return 6;

  return 3;
}

function getDiscoveryNodes(nodes: FlowNode[]) {
  return nodes.filter((node) => getSectionForNode(node) === "discovery");
}

function getDiscoveryProgress(nodes: FlowNode[], currentNode: FlowNode | null) {
  if (!currentNode || nodes.length === 0) return 0;

  const discoveryNodes = getDiscoveryNodes(nodes);

  if (discoveryNodes.length === 0) return 0;

 const currentIndex = discoveryNodes.findIndex(
  (node) => node.id === currentNode.id
);

  if (currentIndex < 0) return 0;

  return Math.max(
    0,
    Math.min(1, currentIndex / Math.max(1, discoveryNodes.length - 1))
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
    const chapter = getChapterForNode(currentNode);
    const visualConcept = getVisualConceptForNode(currentNode);
    const preset = currentNode ? getPresetForNode(currentNode) : "idle";

    const activities = getArrayAnswer(answers, "activities");
    const certainty = getTextAnswer(answers, "certainty");
    const instinct = getTextAnswer(answers, "fun_instinct");

    const isWelcome = section === "what-is-everleap";
    const isQuestions = section === "discovery";
    const isReflection = section === "transition";

    return {
      preset,
      nodeKey,
      section,
      chapter,
      visualConcept,
      progress: isQuestions ? getDiscoveryProgress(nodes, currentNode) : 0,
      nodeCount: Math.max(1, 2 + activities.length),
      branchCount: getBranchCount(certainty),
      certainty,
      instinctStyle: getInstinctStyle(instinct),
      activityCount: activities.length,
      isWelcome,
      isQuestions,
      isReflection,
      showProgress: isQuestions,
    };
  }, [answers, currentNode, nodes]);
}