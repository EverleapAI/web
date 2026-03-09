import {
  type MotivationId,
  type SkillTag,
  type StrengthSignalId,
  type ThemeTag,
} from "../content/timeTwins";

import { type TimeTwinUserProfile } from "./scoreTimeTwins";

export function buildTimeTwinProfile(): TimeTwinUserProfile {
  if (typeof window === "undefined") {
    return {
      motivations: {},
      signals: {},
      skills: [],
      themes: [],
    };
  }

  const story = JSON.parse(
    localStorage.getItem("everleap.story.answers.v3") ?? "{}"
  );

  const motivations = story.motivations ?? {};
  const signals = story.signals ?? {};
  const skills = story.skills ?? [];
  const themes = story.themes ?? [];

  return {
    motivations: motivations as Partial<Record<MotivationId, number>>,
    signals: signals as Partial<Record<StrengthSignalId, number>>,
    skills: skills as SkillTag[],
    themes: themes as ThemeTag[],
  };
}