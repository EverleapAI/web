import type { FlowQuestion } from "../engine/useOnboardingFlow";

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function hasHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function hasRepeatedChars(value: string) {
  const squashed = value.replace(/\s+/g, "");
  return /^(.)\1{5,}$/i.test(squashed);
}

function hasKeyboardSmash(value: string) {
  const trimmed = value.toLowerCase().replace(/\s+/g, "");
  if (trimmed.length < 5) return false;

  const badPatterns = [
    "asdf",
    "qwer",
    "zxcv",
    "hjkl",
    "jkl",
    "qaz",
    "wsx",
    "edc",
    "1234",
    "0987",
  ];

  return badPatterns.some((pattern) => trimmed.includes(pattern));
}

function hasProfanity(value: string) {
  const text = value.toLowerCase();
  const blocked = ["fuck", "shit", "bitch", "asshole", "dick", "cunt"];
  return blocked.some((word) => text.includes(word));
}

export function cleanTextAnswer(value: string) {
  return normalizeText(value);
}

export function validateTextAnswer(value: string, question: FlowQuestion): string | null {
  const trimmed = normalizeText(value);
  const rules = question.validationRules ?? {};
  const min = question.minLength ?? 1;
  const max = question.maxLength ?? 500;

  if (!trimmed) {
    return "I need something real enough to work with.";
  }

  if (trimmed.length < min) {
    return "That’s a little too thin for me to read anything from.";
  }

  if (trimmed.length > max) {
    return "Give me the short version for now.";
  }

  if (rules.no_html && hasHtml(trimmed)) {
    return "I get the energy. I still need a clean answer to build from.";
  }

  if (rules.no_repeated_chars && hasRepeatedChars(trimmed)) {
    return "I need something real enough to work with.";
  }

  if (hasKeyboardSmash(trimmed)) {
    return "That feels more like keyboard noise than a signal.";
  }

  if (rules.no_profanity && hasProfanity(trimmed)) {
    return "I get the energy. I still need a clean answer to build from.";
  }

  if (rules.no_numbers && /\d/.test(trimmed)) {
    return "I want to call you something real.";
  }

  return null;
}