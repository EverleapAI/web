"use client";

import * as React from "react";

import Conversation from "../../../onboarding/components/Conversation";
import InputRenderer from "../../../onboarding/components/InputRenderer";
import NavControls from "../../../onboarding/components/NavControls";

import {
  useOnboardingFlow,
  type Answers,
  type FlowPayload,
} from "../../../onboarding/engine/useOnboardingFlow";

type Provider = "openai" | "anthropic";

type PromptTemplate = {
  key: string;
  label: string;
  prompt: string;
};

type AiUsage = Record<string, unknown> | null;

type AiRunResult = {
  output: string;
  provider: Provider | string;
  model: string;
  latencyMs: number;
  usage: AiUsage;
  estimatedCostUsd?: number | null;
};

type AiLabTotal = {
  latencyMs?: number;
  estimatedCostUsd?: number | null;
};

type AiLabRun = {
  internal: AiRunResult;
  user: AiRunResult;
  total?: AiLabTotal;
};

type LabQuestionItem = {
  key: string;
  prompt: string;
  inputType: string;
  options: { key: string; label: string }[];
  answer: unknown;
};

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    key: "hybrid",
    label: "Hybrid Everleap",
    prompt: `You are Everleap.

You are an intelligent, emotionally aware exploration system helping people better understand themselves, their motivations, their environments, and their future possibilities.

Analyze the onboarding responses using a synthesis of:
- motivational psychology
- narrative identity
- future-self theory
- behavioral patterns
- vocational psychology
- curiosity and exploration signals

Do NOT:
- diagnose
- label
- reduce the user to a type
- force simplistic career advice

Instead:
- identify meaningful patterns
- identify tensions
- identify environments where the user may thrive
- identify signals of motivation and curiosity
- identify possible future directions
- identify what feels unresolved or unexplored

The response should feel:
- deeply observant
- emotionally intelligent
- hopeful
- grounded
- exploratory
- human

Avoid:
- corporate tone
- therapy clichés
- exaggerated praise
- fake certainty
- generic motivational language

Return:
1. What stands out most about this person
2. Motivational and behavioral patterns
3. Potential future directions worth exploring
4. Environments likely to energize them
5. Tensions or uncertainties worth exploring further
6. What Everleap should help them explore next`,
  },
  {
    key: "self_determination",
    label: "Self-Determination Theory",
    prompt: `You are an expert in motivational psychology and human development.

Analyze the onboarding responses through the lens of Self-Determination Theory:
- autonomy
- competence/mastery
- relatedness

Do NOT diagnose or label the user.

Instead:
- identify motivational patterns
- identify what appears energizing or draining
- identify environments where the user may thrive
- identify tensions or unmet needs
- identify signs of curiosity, drive, uncertainty, or resistance

Return:
1. Key observations
2. Potential growth directions
3. Environments where the user may flourish
4. Areas Everleap should explore further`,
  },
  {
    key: "narrative_identity",
    label: "Narrative Identity",
    prompt: `You are an expert in narrative identity psychology.

Analyze the onboarding responses as signals of how this person constructs meaning, identity, motivation, and future direction.

Do NOT reduce the user to a personality type.

Instead:
- identify emerging themes
- identify emotional patterns
- identify recurring tensions
- identify what kind of story this person may be trying to build for themselves
- identify what appears meaningful or emotionally charged

Return:
1. Narrative themes
2. Possible future directions
3. Emotional tensions
4. What Everleap should help this user explore next`,
  },
  {
    key: "possible_selves",
    label: "Possible Selves",
    prompt: `You are an expert in future-self psychology and Possible Selves Theory.

Analyze the onboarding responses to identify:
- possible future identities
- aspirations
- avoided futures
- curiosity signals
- fear or hesitation patterns
- identity experimentation

Do NOT make deterministic recommendations.

Return:
1. Possible future selves emerging
2. Signals of motivation and aspiration
3. Areas of hesitation or uncertainty
4. Explorations Everleap should encourage next`,
  },
  {
    key: "big_five",
    label: "Big Five Signal Extraction",
    prompt: `You are an expert in personality psychology and behavioral signal extraction.

Analyze the onboarding responses for probable Big Five personality signals.

Do NOT state conclusions as facts.
Do NOT diagnose or label the user.

Estimate:
- openness
- conscientiousness
- extraversion
- agreeableness
- emotional sensitivity/neuroticism

For each dimension provide:
- estimated strength
- confidence level
- behavioral evidence
- possible implications for learning style, work environments, exploration preferences, and motivation patterns

Return:
1. Structured signal summary
2. Environmental fit hypotheses
3. Exploration recommendations
4. Follow-up questions Everleap should ask`,
  },
  {
    key: "ikigai",
    label: "Ikigai",
    prompt: `You are using Ikigai as an exploratory career and life-direction framework.

Use the onboarding responses to explore possible overlap between:
- what the user enjoys or is curious about
- what they may become good at
- what the world/community may need
- what could become economically or practically sustainable

Do NOT treat Ikigai as a diagnostic tool.
Do NOT force a perfect answer.
Do NOT over-romanticize purpose.

Instead:
- identify possible areas of overlap
- identify gaps where Everleap needs more information
- identify practical experiments the user could try
- identify tensions between passion, skill, usefulness, and viability

Return:
1. Possible Ikigai overlaps
2. What seems strongest
3. What is missing or uncertain
4. Practical next experiments Everleap should suggest`,
  },
  {
    key: "enneagram",
    label: "Enneagram",
    prompt: `You are using the Enneagram only as a reflective, exploratory lens.

Do NOT type the user definitively.
Do NOT diagnose.
Do NOT present Enneagram claims as scientific fact.
Do NOT reduce the user to a number.

Use the onboarding responses to explore possible motivation patterns such as:
- desire for achievement
- desire for security
- desire for autonomy
- desire for connection
- desire for meaning
- desire for mastery
- desire to help or improve the world

Return:
1. Possible motivational themes
2. Possible Enneagram-style patterns, stated cautiously
3. What evidence supports or weakens each hypothesis
4. How Everleap could use this lens to ask better follow-up questions`,
  },
  {
    key: "parachute",
    label: "What Color Is Your Parachute?",
    prompt: `You are using What Color Is Your Parachute? as a practical career-discovery framework.

Analyze the onboarding responses to identify:
- preferred skills
- people/environments they may enjoy
- working conditions that may fit
- fields worth exploring
- next practical steps
- questions that would help clarify direction

Do NOT give generic career advice.
Do NOT assume the first stated interest is the final answer.

Return:
1. Possible career/work themes
2. Skills and environments to investigate
3. Practical exploration paths
4. Questions Everleap should ask next
5. Near-term next steps`,
  },
];

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

function formatAnswersForPrompt(items: { question: string; answer: string }[]) {
  return items
    .map((item, index) => `${index + 1}. ${item.question}\nAnswer: ${item.answer}`)
    .join("\n\n");
}

function formatProvider(provider: string) {
  if (provider === "openai") return "OpenAI";
  if (provider === "anthropic") return "Claude";
  return provider;
}

function formatUsageValue(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "—";
  return JSON.stringify(value);
}

function getUsageRows(usage: AiUsage) {
  if (!usage) return [];

  return Object.entries(usage).map(([key, value]) => ({
    key,
    value: formatUsageValue(value),
  }));
}

function formatCost(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (value === 0) return "$0.000000";
  if (value < 0.01) return `$${value.toFixed(6)}`;
  return `$${value.toFixed(4)}`;
}

function isAnswerFilled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

function getShowIf(node: FlowPayload["nodes"][number]) {
  const metadata = node.metadata as
    | {
        show_if?: {
          question_key?: string;
          operator?: string;
          values?: string[];
        };
      }
    | undefined;

  return metadata?.show_if;
}

function isNodeVisible(node: FlowPayload["nodes"][number], answers: Answers) {
  const showIf = getShowIf(node);

  if (!showIf?.question_key) return true;

  const value = answers[showIf.question_key];
  const values = showIf.values ?? [];

  if (showIf.operator === "in") {
    if (Array.isArray(value)) {
      return value.some((item) => values.includes(String(item)));
    }

    return values.includes(String(value ?? ""));
  }

  return true;
}

function areRequiredVisibleQuestionsAnswered(
  nodes: FlowPayload["nodes"],
  answers: Answers
) {
  const requiredQuestionNodes = nodes.filter(
    (node) => node.question && node.isRequired && isNodeVisible(node, answers)
  );

  if (requiredQuestionNodes.length === 0) return false;

  return requiredQuestionNodes.every((node) => {
    const key = node.question?.key;
    if (!key) return true;
    return isAnswerFilled(answers[key]);
  });
}

function ResultPanel({
  title,
  subtitle,
  result,
}: {
  title: string;
  subtitle: string;
  result: AiRunResult;
}) {
  const usageRows = getUsageRows(result.usage);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4">
        <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">
          {title}
        </div>
        <div className="mt-2 text-sm leading-6 text-white/50">{subtitle}</div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/65">
          {formatProvider(result.provider)}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/65">
          {result.model}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/65">
          {result.latencyMs.toLocaleString()}ms
        </span>

        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">
          {formatCost(result.estimatedCostUsd)}
        </span>
      </div>

      <div className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/82">
        {result.output}
      </div>

      {usageRows.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
            Usage
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {usageRows.map((row) => (
              <div
                key={row.key}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                  {row.key}
                </div>
                <div className="mt-1 text-sm text-white/80">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EditableAnswer({
  item,
  onUpdate,
}: {
  item: LabQuestionItem;
  onUpdate: (key: string, value: string | string[]) => void;
}) {
  if (item.inputType === "multi_choice") {
    const selected = Array.isArray(item.answer)
      ? item.answer.map((value) => String(value))
      : [];

    return (
      <div className="mt-3 grid gap-2">
        {item.options.map((option) => {
          const checked = selected.includes(option.key);

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                const next = checked
                  ? selected.filter((value) => value !== option.key)
                  : [...selected, option.key];

                onUpdate(item.key, next);
              }}
              className={[
                "rounded-2xl border px-4 py-3 text-left text-sm transition",
                checked
                  ? "border-cyan-200 bg-cyan-300 text-slate-950"
                  : "border-white/10 bg-black/30 text-white/75 hover:border-white/25",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (item.options.length > 0) {
    return (
      <select
        value={typeof item.answer === "string" ? item.answer : ""}
        onChange={(event) => onUpdate(item.key, event.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
      >
        <option value="">Select an answer</option>
        {item.options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <textarea
      value={typeof item.answer === "string" ? item.answer : ""}
      onChange={(event) => onUpdate(item.key, event.target.value)}
      rows={3}
      className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-cyan-300"
      placeholder="Type an answer"
    />
  );
}

export default function AiLabPage() {
  const [flow, setFlow] = React.useState<FlowPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [completed, setCompleted] = React.useState(false);
  const [showContext, setShowContext] = React.useState(false);

  const [provider, setProvider] = React.useState<Provider>("openai");
  const [templateKey, setTemplateKey] = React.useState("hybrid");
  const [customPrompt, setCustomPrompt] = React.useState(
    "Generate a meaningful Everleap-style retort for this user. Make it specific, concise, and useful."
  );
  const [userCharacterLimit, setUserCharacterLimit] = React.useState(700);
  const [aiRun, setAiRun] = React.useState<AiLabRun | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/flows/onboarding_v1`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data.ok || !data.flow) {
          throw new Error("Invalid flow response");
        }

        setFlow(data.flow);
      } catch {
        setError("Failed to load onboarding flow for AI Lab");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const {
    nodes,
    currentNode,
    currentQuestion,
    answers,
    goNext,
    goBack,
    updateAnswer,
    canGoBack,
  } = useOnboardingFlow(flow, "everleap_ai_lab_answers");

  React.useEffect(() => {
    if (!flow || completed) return;

    if (areRequiredVisibleQuestionsAnswered(nodes, answers)) {
      setCompleted(true);
    }
  }, [answers, completed, flow, nodes]);

  const labQuestionItems = React.useMemo<LabQuestionItem[]>(() => {
    return nodes
      .filter((node) => node.question && isNodeVisible(node, answers))
      .map((node) => {
        const question = node.question!;

        return {
          key: question.key,
          prompt: question.prompt,
          inputType: question.inputType,
          options: question.options,
          answer: answers[question.key],
        };
      });
  }, [answers, nodes]);

  const readableAnswers = React.useMemo(() => {
    return labQuestionItems
      .map((item) => {
        let formattedAnswer = "";

        if (Array.isArray(item.answer)) {
          formattedAnswer = item.answer
            .map((value) => {
              const option = item.options.find((opt) => opt.key === value);
              return option?.label ?? String(value);
            })
            .join(", ");
        } else if (typeof item.answer === "string") {
          const option = item.options.find((opt) => opt.key === item.answer);
          formattedAnswer = option?.label ?? item.answer;
        }

        return {
          question: item.prompt,
          answer: formattedAnswer,
        };
      })
      .filter((item) => item.answer.trim());
  }, [labQuestionItems]);

  const selectedTemplate =
    PROMPT_TEMPLATES.find((template) => template.key === templateKey) ??
    PROMPT_TEMPLATES[0];

  const finalPrompt = React.useMemo(() => {
    const answerBlock = formatAnswersForPrompt(readableAnswers);

    return `${selectedTemplate.prompt}

ONBOARDING RESPONSES:
${answerBlock}

CUSTOM LAB REQUEST:
${customPrompt}

Output should be readable, emotionally intelligent, and useful to the Everleap product team.`;
  }, [customPrompt, readableAnswers, selectedTemplate]);

  const continueDisabled = React.useMemo(() => {
    if (!currentQuestion) return false;

    const value = answers[currentQuestion.key];

    if (currentQuestion.inputType === "text") {
      return !String(value ?? "").trim();
    }

    if (currentQuestion.inputType === "multi_choice") {
      return !Array.isArray(value) || value.length === 0;
    }

    return false;
  }, [answers, currentQuestion]);

  function handleNext(nextAnswers: Answers = answers) {
    if (!currentNode) return;

    if (currentNode.type === "summary") {
      setCompleted(true);
      return;
    }

    goNext(nextAnswers);
  }

  function handleEditableAnswer(key: string, value: string | string[]) {
    updateAnswer(key, value);
    setAiRun(null);
    setAiError(null);
  }

  function restartLabQuestions() {
    setAiRun(null);
    setAiError(null);
    setCompleted(false);
    setShowContext(false);
  }

  async function runPrompt() {
    setSubmitting(true);
    setAiError(null);
    setAiRun(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/ai/lab/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          prompt: finalPrompt,
          answers: readableAnswers,
          userCharacterLimit,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "AI Lab request failed.");
      }

      if (data.internal && data.user) {
        setAiRun({
          internal: data.internal,
          user: data.user,
          total: data.total,
        });
        return;
      }

      setAiRun({
        internal: {
          output: data.output ?? "",
          provider: data.provider ?? provider,
          model: data.model ?? "Unknown model",
          latencyMs: Number(data.latencyMs ?? 0),
          usage: data.usage ?? null,
          estimatedCostUsd: data.estimatedCostUsd ?? null,
        },
        user: {
          output: "No compressed user view was returned by the backend.",
          provider: data.provider ?? provider,
          model: data.model ?? "Unknown model",
          latencyMs: 0,
          usage: null,
          estimatedCostUsd: null,
        },
        total: {
          latencyMs: Number(data.latencyMs ?? 0),
          estimatedCostUsd: data.estimatedCostUsd ?? null,
        },
      });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Unknown AI Lab error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Loading AI Lab…
      </div>
    );
  }

  if (error || !flow || !currentNode) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Error loading AI Lab onboarding flow
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-[100svh] bg-slate-950 px-4 py-8 text-white sm:px-5 sm:py-10">
        <div className="mx-auto max-w-7xl pb-24">
          <div className="mb-8 sm:mb-10">
            <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-300">
              Everleap AI Lab
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Prompt Lab
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/65 sm:text-lg">
              Test internal interpretation, user-facing compression, provider
              behavior, latency, token usage, and estimated cost from real
              onboarding responses.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowContext(true)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-cyan-300/40 hover:text-white"
              >
                View / edit onboarding context
              </button>

              <button
                type="button"
                onClick={restartLabQuestions}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/50 transition hover:border-white/25 hover:text-white"
              >
                Walk through questions
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="mb-5 text-sm uppercase tracking-[0.2em] text-cyan-300">
                Prompt Construction
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                    Psychology lens
                  </div>

                  <select
                    value={templateKey}
                    onChange={(event) => setTemplateKey(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                  >
                    {PROMPT_TEMPLATES.map((template) => (
                      <option key={template.key} value={template.key}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                    Provider
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(["openai", "anthropic"] as Provider[]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setProvider(item)}
                        className={[
                          "rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                          provider === item
                            ? "border-cyan-200 bg-cyan-300 text-slate-950"
                            : "border-white/10 bg-black/30 text-white/70 hover:border-white/25",
                        ].join(" ")}
                      >
                        {item === "openai" ? "OpenAI" : "Claude"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="mt-5 block">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                  User View Character Limit
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="number"
                    min={120}
                    max={4000}
                    step={10}
                    value={userCharacterLimit}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setUserCharacterLimit(Number.isFinite(value) ? value : 700);
                      setAiRun(null);
                      setAiError(null);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300 sm:w-[160px]"
                  />

                  <div className="text-sm leading-6 text-white/45">
                    Maximum characters allowed in the compressed user-facing
                    response.
                  </div>
                </div>
              </label>

              <label className="mt-5 block">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                  Custom lab request
                </div>

                <textarea
                  value={customPrompt}
                  onChange={(event) => setCustomPrompt(event.target.value)}
                  rows={5}
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-cyan-300"
                />
              </label>

              <label className="mt-5 block">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                  Final prompt sent to AI
                </div>

                <textarea
                  value={finalPrompt}
                  readOnly
                  rows={12}
                  className="w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs leading-5 text-white/70 outline-none sm:rows-14"
                />
              </label>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={runPrompt}
                  disabled={submitting || readableAnswers.length === 0}
                  className="w-full rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitting
                    ? "Running internal + user views…"
                    : `Run with ${
                        provider === "openai" ? "OpenAI" : "Claude"
                      }`}
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                    AI Response
                  </div>
                  <div className="mt-2 text-sm text-white/45">
                    Compare the internal analysis against the compressed
                    user-facing experience.
                  </div>
                </div>

                {aiRun?.total ? (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/65">
                      Total{" "}
                      {Number(aiRun.total.latencyMs ?? 0).toLocaleString()}ms
                    </span>

                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                      Total {formatCost(aiRun.total.estimatedCostUsd)}
                    </span>
                  </div>
                ) : null}
              </div>

              {aiError ? (
                <div className="rounded-2xl border border-red-400/30 bg-red-950/30 p-5 text-sm text-red-100">
                  {aiError}
                </div>
              ) : aiRun ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  <ResultPanel
                    title="Internal View"
                    subtitle="Longer team-facing interpretation for testing signal extraction and prompt behavior."
                    result={aiRun.internal}
                  />

                  <ResultPanel
                    title="User View"
                    subtitle={`Compressed user-facing copy capped at ${userCharacterLimit.toLocaleString()} characters.`}
                    result={aiRun.user}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/45">
                  Run a prompt to see the internal and user-facing views here.
                </div>
              )}
            </div>
          </div>
        </div>

        {showContext ? (
          <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
            <div className="max-h-[88svh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                    Onboarding Context
                  </div>
                  <div className="mt-1 text-sm text-white/45">
                    Edit the answers being sent into the lab prompt.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowContext(false)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[70svh] space-y-6 overflow-auto p-5">
                {labQuestionItems.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.15em] text-white/40">
                      {item.prompt}
                    </div>

                    <EditableAnswer
                      item={item}
                      onUpdate={handleEditableAnswer}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white">
      <main className="relative z-10 flex min-h-[100svh] flex-col justify-center px-5 pb-20 pt-16">
        <div className="mx-auto w-full max-w-[720px]">
          <div className="mb-8">
            <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-300">
              Everleap AI Lab
            </div>
          </div>

          <Conversation node={currentNode} answers={answers} />

          <InputRenderer
            node={currentNode}
            question={currentQuestion}
            answers={answers}
            onAnswer={(key, value) => updateAnswer(key, value)}
            onAutoAdvance={(nextAnswers) => {
              handleNext(nextAnswers);
            }}
          />

          <NavControls
            canGoBack={canGoBack}
            showContinue={
              !currentQuestion ||
              currentQuestion.inputType === "text" ||
              currentQuestion.inputType === "multi_choice"
            }
            continueLabel={
              currentNode.type === "summary" ? "Enter Prompt Lab" : "Continue"
            }
            continueDisabled={continueDisabled}
            onBack={goBack}
            onContinue={() => handleNext()}
          />
        </div>
      </main>
    </div>
  );
}