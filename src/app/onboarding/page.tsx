"use client";

// apps/web/src/app/onboarding/page.tsx

import * as React from "react";
import { useRouter } from "next/navigation";

import Conversation from "./components/Conversation";
import InputRenderer from "./components/InputRenderer";
import NavControls from "./components/NavControls";

import IntroScreenRenderer, {
  isIntroScreen,
} from "./components/IntroScreenRenderer";

import {
  useOnboardingFlow,
  type Answers,
  type FlowPayload,
} from "./engine/useOnboardingFlow";

import { useAnimationState } from "./animation/useAnimationState";
import AnimatedCanvas from "./animation/AnimatedCanvas";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7071/api";
}

type OnboardingSynthesis = {
  headline: string;
  body: string;
  signals: string[];
  bridge: string;
};

type IconKind =
  | "signature"
  | "situation"
  | "branch"
  | "openCircle"
  | "singlePath"
  | "sparkPath"
  | "plans"
  | "page"
  | "constellation"
  | "mirror"
  | "strength"
  | "friction"
  | "instinct"
  | "animal"
  | "future"
  | "permission"
  | "fallback";

const ICON_BY_NODE: Record<string, IconKind> = {
  intro_name: "signature",
  name: "signature",

  current_situation: "situation",

  certainty: "branch",
  certainty_response: "openCircle",
  certainty_idea: "singlePath",
  idea_response: "sparkPath",

  post_plans: "plans",
  post_plans_response: "page",

  activities: "constellation",
  activities_response: "mirror",

  strengths: "strength",
  challenges: "friction",

  instincts: "instinct",
  fun_instinct: "animal",
  instinct_response: "animal",

  future: "future",
  permissions: "permission",
};

function QuestionProgress({ progress }: { progress: number }) {
  const totalDots = 5;

  const activeDots = Math.max(
    1,
    Math.min(totalDots, Math.round(progress * totalDots))
  );

  return (
    <div
      className="flex w-full flex-col items-center"
      aria-label="Onboarding progress"
    >
      <div className="flex items-center gap-2">
        <div className="text-[13px] font-medium tracking-[-0.01em] text-white">
          Onboarding
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDots }).map((_, index) => {
            const active = index < activeDots;

            return (
              <div
                key={index}
                className={[
                  "h-[7px] w-[7px] rounded-full transition-all duration-500",
                  active
                    ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                    : "bg-white/16",
                ].join(" ")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SymbolIcon({ kind }: { kind: IconKind }) {
  const common = {
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      className="h-16 w-16 overflow-visible"
    >
      <defs>
        <linearGradient id={`icon-${kind}`} x1="10%" y1="20%" x2="90%" y2="80%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="46%" stopColor="rgba(103,232,249,0.92)" />
          <stop offset="100%" stopColor="rgba(167,139,250,0.86)" />
        </linearGradient>
      </defs>

      <g stroke={`url(#icon-${kind})`}>
        {kind === "signature" ? (
          <>
            <path
              {...common}
              strokeWidth="3.2"
              d="M20 56 C30 32 42 76 54 46 C62 28 70 46 78 38"
            />
            <path
              {...common}
              strokeWidth="1.8"
              opacity="0.4"
              d="M30 70 C44 64 58 62 72 60"
            />
          </>
        ) : null}

        {kind === "situation" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M18 62 C30 38 44 68 56 44 C64 30 74 42 80 34"
            />
            <path
              {...common}
              strokeWidth="1.8"
              opacity="0.45"
              d="M20 74 H76"
            />
          </>
        ) : null}

        {kind === "branch" ? (
          <>
            <path
              {...common}
              strokeWidth="3.4"
              d="M18 68 C34 62 44 52 50 42"
            />
            <path
              {...common}
              strokeWidth="2.5"
              d="M50 42 C60 28 72 24 82 22"
            />
            <path
              {...common}
              strokeWidth="2"
              opacity="0.48"
              d="M50 42 C62 50 70 60 82 62"
            />
          </>
        ) : null}

        {kind === "openCircle" ? (
          <>
            <path
              {...common}
              strokeWidth="3.2"
              d="M68 34 C78 48 72 68 56 74 C38 80 20 68 20 48 C20 30 38 18 56 24"
            />
          </>
        ) : null}

        {kind === "singlePath" ? (
          <>
            <path
              {...common}
              strokeWidth="3.4"
              d="M16 66 C32 56 44 52 54 40 C62 30 72 26 82 24"
            />
            <circle
              cx="82"
              cy="24"
              r="4"
              fill="rgba(103,232,249,0.8)"
            />
          </>
        ) : null}

        {kind === "sparkPath" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M18 66 C34 52 46 58 58 42 C66 30 74 30 82 26"
            />
          </>
        ) : null}

        {kind === "plans" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M24 26 H70 V70 H24 Z"
            />
            <path
              {...common}
              strokeWidth="2"
              opacity="0.5"
              d="M34 40 H60 M34 52 H54"
            />
          </>
        ) : null}

        {kind === "page" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M28 20 H58 L72 34 V76 H28 Z"
            />
          </>
        ) : null}

        {kind === "constellation" ? (
          <>
            <path
              {...common}
              strokeWidth="1.8"
              opacity="0.55"
              d="M24 58 L40 34 L56 52 L74 28"
            />
          </>
        ) : null}

        {kind === "mirror" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M32 20 H64 V62 C64 72 56 78 48 78 C40 78 32 72 32 62 Z"
            />
          </>
        ) : null}

        {kind === "strength" ? (
          <path
            {...common}
            strokeWidth="3.3"
            d="M48 18 L56 40 L80 40 L60 54 L68 78 L48 64 L28 78 L36 54 L16 40 L40 40 Z"
          />
        ) : null}

        {kind === "friction" ? (
          <>
            <path
              {...common}
              strokeWidth="3.2"
              d="M18 58 C28 42 42 72 52 54"
            />
          </>
        ) : null}

        {kind === "instinct" ? (
          <>
            <path
              {...common}
              strokeWidth="3.2"
              d="M20 66 C34 24 48 76 60 36 C66 18 76 28 82 22"
            />
          </>
        ) : null}

        {kind === "animal" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M22 58 C32 34 52 28 72 38"
            />
          </>
        ) : null}

        {kind === "future" ? (
          <>
            <path
              {...common}
              strokeWidth="3"
              d="M16 64 C32 46 50 42 80 46"
            />
          </>
        ) : null}

        {kind === "permission" ? (
          <>
            <path
              {...common}
              strokeWidth="3.2"
              d="M48 18 L72 28 V46 C72 62 62 74 48 80 C34 74 24 62 24 46 V28 Z"
            />
            <path
              {...common}
              strokeWidth="3"
              d="M36 48 L44 56 L62 38"
            />
          </>
        ) : null}

        {kind === "fallback" ? (
          <>
            <circle
              {...common}
              strokeWidth="2.8"
              cx="48"
              cy="48"
              r="26"
            />
          </>
        ) : null}
      </g>
    </svg>
  );
}

function SemanticIconStage({ nodeKey }: { nodeKey: string }) {
  const kind = ICON_BY_NODE[nodeKey] ?? "fallback";

  return (
    <div className="flex h-[16svh] min-h-[88px] max-h-[130px] shrink-0 items-center justify-center sm:h-[18svh] sm:min-h-[110px] sm:max-h-[160px]">
      <div className="relative flex h-[82px] w-[82px] items-center justify-center rounded-full border border-white/10 bg-white/[0.025] shadow-[0_0_42px_rgba(103,232,249,0.08)] sm:h-[96px] sm:w-[96px]">
        <div className="absolute inset-[-18px] rounded-full bg-cyan-300/[0.025] blur-2xl" />
        <SymbolIcon kind={kind} />
      </div>
    </div>
  );
}

function SynthesisVisualStage({
  animationState,
}: {
  animationState: ReturnType<typeof useAnimationState>;
}) {
  return (
    <div className="relative h-[18svh] min-h-[96px] max-h-[150px] shrink-0 overflow-visible sm:h-[22svh] sm:min-h-[130px] sm:max-h-[190px]">
      <AnimatedCanvas state={animationState} />
    </div>
  );
}

function OnboardingVisualStage({
  nodeKey,
  isSynthesisMoment,
  animationState,
}: {
  nodeKey: string;
  isSynthesisMoment: boolean;
  animationState: ReturnType<typeof useAnimationState>;
}) {
  if (isSynthesisMoment) {
    return <SynthesisVisualStage animationState={animationState} />;
  }

  return <SemanticIconStage nodeKey={nodeKey} />;
}

function shouldShowPageVisual(
  nodeKey: string,
  isIntro: boolean
) {
  if (nodeKey === "summary_transition") return true;

  if (isIntro) return false;

  return true;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [flow, setFlow] = React.useState<FlowPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [synthesisLoading, setSynthesisLoading] =
    React.useState(false);

  const [synthesis, setSynthesis] =
    React.useState<OnboardingSynthesis | null>(null);

  const synthesisRequestedRef = React.useRef(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${getApiBaseUrl()}/flows/onboarding_v1`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!data.ok || !data.flow) {
          throw new Error("Invalid flow response");
        }

        setFlow(data.flow);
      } catch {
        setError("Failed to load onboarding");
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
    validationMessage,
  } = useOnboardingFlow(flow);

  React.useEffect(() => {
    async function generateSynthesis() {
      if (!currentNode) return;

      const isSummaryNode =
        currentNode.key === "summary_transition" ||
        currentNode.type === "summary";

      if (!isSummaryNode) {
        return;
      }

      if (synthesisRequestedRef.current) {
        return;
      }

      synthesisRequestedRef.current = true;

      try {
        setSynthesisLoading(true);

        const res = await fetch(
          "/api/onboarding/synthesis",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify({
              provider: "anthropic",
              flowKey: "onboarding_v1",
              answers,
            }),
          }
        );

        const data = await res.json();

        if (data?.ok && data?.synthesis) {
          setSynthesis(data.synthesis);
        }
      } catch {
        // silent fallback
      } finally {
        setSynthesisLoading(false);
      }
    }

    generateSynthesis();
  }, [answers, currentNode]);

  const animationState = useAnimationState({
    currentNode,
    nodes,
    answers,
  });

  const { showProgress } = animationState;

  const isMultiChoice =
    currentQuestion?.inputType === "multi_choice";

  const isText =
    currentQuestion?.inputType === "text";

  const permissionAccepted =
    answers.permissions_accepted === "yes";

  const permissionsSatisfied =
    currentNode?.key !== "permissions" ||
    permissionAccepted;

  const isSynthesisMoment =
    currentNode?.key === "summary_transition";

  function handleComplete() {
    try {
      window.localStorage.setItem(
        "everleap_onboarding_answers",
        JSON.stringify(answers)
      );
    } catch {}

    router.push("/regauth/zip");
  }

  function handleNext(nextAnswers = answers) {
    if (!currentNode) return;

    if (!permissionsSatisfied) return;

    if (currentNode.type === "summary") {
      handleComplete();
      return;
    }

    goNext(nextAnswers);
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Loading…
      </div>
    );
  }

  if (error || !flow || !currentNode) {
    return (
      <div className="min-h-[100svh] bg-slate-950 p-10 text-white">
        Error loading onboarding
      </div>
    );
  }

  return (
    <div className="relative h-[100svh] overflow-hidden bg-slate-950 text-white">
      <main className="relative z-10 flex h-[100svh] flex-col px-5">
        <header
          className={[
            "mx-auto flex w-full max-w-[720px] shrink-0 items-center justify-center transition-all duration-500",
            showProgress
              ? "h-[44px] pt-4 opacity-100"
              : "h-[24px] pt-2 opacity-0",
          ].join(" ")}
        >
          {showProgress ? (
            <QuestionProgress
              progress={animationState.progress}
            />
          ) : null}
        </header>

        <section className="mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shouldShowPageVisual(
              currentNode.key,
              isIntroScreen(currentNode)
            ) ? (
              <OnboardingVisualStage
                nodeKey={currentNode.key}
                isSynthesisMoment={isSynthesisMoment}
                animationState={animationState}
              />
            ) : null}

            <div className="flex min-h-0 flex-1 flex-col justify-start pt-2">
              {isIntroScreen(currentNode) ? (
                <IntroScreenRenderer
                  node={currentNode}
                  answers={answers}
                  synthesis={synthesis}
                  synthesisLoading={synthesisLoading}
                  onAnswer={(
                    key: string,
                    value: string | string[]
                  ) => updateAnswer(key, value)}
                />
              ) : (
                <Conversation
                  node={currentNode}
                  answers={answers}
                />
              )}

              <InputRenderer
                node={currentNode}
                question={currentQuestion}
                answers={answers}
                validationMessage={validationMessage}
                onAnswer={(
                  key: string,
                  value: string | string[]
                ) => updateAnswer(key, value)}
                onAutoAdvance={(nextAnswers?: Answers) => {
                  window.setTimeout(() => {
                    handleNext(nextAnswers);
                  }, 180);
                }}
              />
            </div>
          </div>

          <div className="shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:pb-5">
            <NavControls
              canGoBack={canGoBack}
              showContinue={
                !currentQuestion ||
                isText ||
                isMultiChoice
              }
              continueDisabled={
                !permissionsSatisfied ||
                (currentNode.key ===
                  "summary_transition" &&
                  synthesisLoading)
              }
              continueLabel={
                currentNode.type === "summary"
                  ? "Enter Everleap"
                  : "Continue"
              }
              onBack={goBack}
              onContinue={() => handleNext()}
            />
          </div>
        </section>
      </main>
    </div>
  );
}