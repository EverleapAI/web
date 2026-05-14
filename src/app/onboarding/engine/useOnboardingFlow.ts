import * as React from "react";

export type FlowOption = {
  key: string;
  label: string;
  description?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  sort_order?: number;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
};

export type FlowQuestion = {
  id: string;
  key: string;
  family: string;
  prompt: string;
  inputType:
    | "text"
    | "single_select"
    | "multi_select"
    | "image_select"
    | "single_choice"
    | "multi_choice"
    | "image_choice";
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  validationRules?: Record<string, unknown>;
  options: FlowOption[];
};

export type FlowNode = {
  id: string;
  key: string;
  type:
    | "statement"
    | "story"
    | "question"
    | "text"
    | "single_select"
    | "multi_select"
    | "image_select"
    | "single_choice"
    | "multi_choice"
    | "image_choice"
    | "summary";
  sortOrder: number;
  title?: string | null;
  body: string;
  questionKey?: string | null;
  isRequired: boolean;
  metadata?: Record<string, unknown>;
  question?: FlowQuestion | null;
};

export type NormalizedFlowNode = Omit<FlowNode, "type" | "question"> & {
  rawType: FlowNode["type"];
  type:
    | "story"
    | "text"
    | "single_choice"
    | "multi_choice"
    | "image_choice"
    | "summary";
  question?: NormalizedFlowQuestion | null;
};

export type NormalizedFlowQuestion = Omit<
  FlowQuestion,
  "inputType" | "options"
> & {
  inputType: "text" | "single_choice" | "multi_choice" | "image_choice";
  options: FlowOption[];
};

export type FlowPayload = {
  id: string;
  key: string;
  name: string;
  nodes: FlowNode[];
};

export type Answers = Record<string, string | string[]>;

type ShowIfRule = {
  question_key?: string;
  questionKey?: string;
  operator?: string;
  values?: string[];
};

const STORAGE_KEY = "everleap_onboarding_answers";

function normalizeInputType(
  inputType: FlowQuestion["inputType"] | undefined
): NormalizedFlowQuestion["inputType"] {
  if (inputType === "single_select") return "single_choice";
  if (inputType === "multi_select") return "multi_choice";
  if (inputType === "image_select") return "image_choice";
  if (inputType === "single_choice") return "single_choice";
  if (inputType === "multi_choice") return "multi_choice";
  if (inputType === "image_choice") return "image_choice";

  return "text";
}

function normalizeQuestion(
  question: FlowQuestion | null | undefined
): NormalizedFlowQuestion | null {
  if (!question) return null;

  return {
    ...question,
    inputType: normalizeInputType(question.inputType),
    options: [...(question.options ?? [])].sort(
      (a, b) =>
        (a.sortOrder ?? a.sort_order ?? 0) -
        (b.sortOrder ?? b.sort_order ?? 0)
    ),
  };
}

function normalizeNode(node: FlowNode): NormalizedFlowNode {
  const question = normalizeQuestion(node.question);
  const rawType = node.type;

  let type: NormalizedFlowNode["type"] = "story";

  if (rawType === "summary") {
    type = "summary";
  } else if (rawType === "statement" || rawType === "story") {
    type = "story";
  } else if (rawType === "question" && question) {
    type = question.inputType;
  } else if (rawType === "single_select" || rawType === "single_choice") {
    type = "single_choice";
  } else if (rawType === "multi_select" || rawType === "multi_choice") {
    type = "multi_choice";
  } else if (rawType === "image_select" || rawType === "image_choice") {
    type = "image_choice";
  } else if (rawType === "text") {
    type = "text";
  }

  return {
    ...node,
    rawType,
    type,
    question,
  };
}

function getShowIfRule(node: NormalizedFlowNode): ShowIfRule | null {
  const rule = node.metadata?.show_if;

  if (!rule || typeof rule !== "object") return null;

  return rule as ShowIfRule;
}

export function shouldShowNode(
  node: NormalizedFlowNode,
  answers: Answers
): boolean {
  const rule = getShowIfRule(node);

  if (!rule) return true;

  const questionKey = rule.question_key ?? rule.questionKey;

  if (!questionKey) return true;

  const value = answers[questionKey];

  if (rule.operator === "in") {
    const allowed = Array.isArray(rule.values) ? rule.values : [];

    if (Array.isArray(value)) {
      return value.some((item) => allowed.includes(item));
    }

    if (typeof value === "string") {
      return allowed.includes(value);
    }

    return false;
  }

  return true;
}

function getVisibleNodes(nodes: NormalizedFlowNode[], answers: Answers) {
  return nodes.filter((node) => shouldShowNode(node, answers));
}

function nextVisibleIndex(
  nodes: NormalizedFlowNode[],
  answers: Answers,
  fromIndex: number
): number {
  for (let i = fromIndex + 1; i < nodes.length; i += 1) {
    const node = nodes[i];

    if (node && shouldShowNode(node, answers)) return i;
  }

  return fromIndex;
}

function previousVisibleIndex(
  nodes: NormalizedFlowNode[],
  answers: Answers,
  fromIndex: number
): number {
  for (let i = fromIndex - 1; i >= 0; i -= 1) {
    const node = nodes[i];

    if (node && shouldShowNode(node, answers)) return i;
  }

  return fromIndex;
}

function firstVisibleIndex(
  nodes: NormalizedFlowNode[],
  answers: Answers
): number {
  const index = nodes.findIndex((node) => shouldShowNode(node, answers));

  return index >= 0 ? index : 0;
}

export function getTextAnswer(answers: Answers, questionKey: string): string {
  const value = answers[questionKey];

  return typeof value === "string" ? value : "";
}

export function getArrayAnswer(
  answers: Answers,
  questionKey: string
): string[] {
  const value = answers[questionKey];

  return Array.isArray(value) ? value : [];
}

export function setAnswer(
  answers: Answers,
  questionKey: string,
  value: string | string[]
): Answers {
  return {
    ...answers,
    [questionKey]: value,
  };
}

export function toggleArrayAnswer(
  list: string[],
  value: string,
  maxChoices?: number | null
) {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }

  if (
    typeof maxChoices === "number" &&
    maxChoices > 0 &&
    list.length >= maxChoices
  ) {
    return list;
  }

  return [...list, value];
}

export function isQuestionAnswered(
  question: NormalizedFlowQuestion | null | undefined,
  answers: Answers
): boolean {
  if (!question) return true;

  if (question.inputType === "multi_choice") {
    return getArrayAnswer(answers, question.key).length > 0;
  }

  return getTextAnswer(answers, question.key).trim().length > 0;
}

export function getQuestionValidationMessage(
  question: NormalizedFlowQuestion | null | undefined,
  answers: Answers
): string | null {
  if (!question) return null;

  if (question.inputType === "multi_choice") {
    return getArrayAnswer(answers, question.key).length > 0
      ? null
      : "Pick at least one that fits.";
  }

  const value = getTextAnswer(answers, question.key).trim();

  if (!value) {
    return "Add an answer to keep going.";
  }

  if (
    typeof question.minLength === "number" &&
    question.minLength > 0 &&
    value.length < question.minLength
  ) {
    return `Add at least ${question.minLength} characters.`;
  }

  return null;
}

export function useOnboardingFlow(
  flow: FlowPayload | null,
  storageKey: string = STORAGE_KEY
) {
  const nodes = React.useMemo(() => {
    return [...(flow?.nodes ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(normalizeNode);
  }, [flow]);

  const [nodeIndex, setNodeIndex] = React.useState(0);
  const [validationMessage, setValidationMessage] = React.useState<
    string | null
  >(null);

  const [answers, setAnswers] = React.useState<Answers>(() => {
    if (typeof window === "undefined") return {};

    try {
      const raw = localStorage.getItem(storageKey);

      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const currentNode = nodes[nodeIndex] ?? null;
  const currentQuestion = currentNode?.question ?? null;

  const visibleNodes = React.useMemo(() => {
    return getVisibleNodes(nodes, answers);
  }, [answers, nodes]);

  const isComplete = Boolean(
    nodes.length > 0 &&
      currentNode &&
      nodeIndex === nodes.length - 1 &&
      nextVisibleIndex(nodes, answers, nodeIndex) === nodeIndex
  );

  React.useEffect(() => {
    setNodeIndex(firstVisibleIndex(nodes, answers));
    setValidationMessage(null);
    // Only reset when a new flow loads.
    // Do NOT include answers here or every answer sends the user back to the first screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow?.id]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {}
  }, [answers, storageKey]);

  React.useEffect(() => {
    if (!currentNode) return;

    if (shouldShowNode(currentNode, answers)) return;

    setNodeIndex((currentIndex) => {
      const nextIndex = nextVisibleIndex(nodes, answers, currentIndex);

      if (nextIndex !== currentIndex) return nextIndex;

      return previousVisibleIndex(nodes, answers, currentIndex);
    });
  }, [answers, currentNode, nodes]);

  function reset() {
    setNodeIndex(firstVisibleIndex(nodes, {}));
    setAnswers({});
    setValidationMessage(null);
  }

  function canContinue(nextAnswers: Answers = answers) {
    if (!currentNode) return false;
    if (!currentNode.isRequired) return true;

    return isQuestionAnswered(currentQuestion, nextAnswers);
  }

  function goNext(nextAnswers: Answers = answers) {
    setAnswers(nextAnswers);

    if (!currentNode) return false;

    if (!canContinue(nextAnswers)) {
      setValidationMessage(
        getQuestionValidationMessage(currentQuestion, nextAnswers)
      );
      return false;
    }

    setValidationMessage(null);

    const nextIndex = nextVisibleIndex(nodes, nextAnswers, nodeIndex);

    if (nextIndex === nodeIndex) {
      return false;
    }

    setNodeIndex(nextIndex);
    return true;
  }

  function goBack() {
    setValidationMessage(null);
    setNodeIndex((index) => previousVisibleIndex(nodes, answers, index));
  }

  function updateAnswer(questionKey: string, value: string | string[]) {
    const nextAnswers = setAnswer(answers, questionKey, value);

    setAnswers(nextAnswers);
    setValidationMessage(null);

    return nextAnswers;
  }

  return {
    nodes,
    visibleNodes,
    nodeIndex,
    currentNode,
    currentQuestion,
    answers,
    setAnswers,
    reset,
    goNext,
    goBack,
    updateAnswer,
    canContinue,
    canGoBack: previousVisibleIndex(nodes, answers, nodeIndex) !== nodeIndex,
    isComplete,
    validationMessage,
  };
}