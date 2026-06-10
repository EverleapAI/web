const SIGNAL_COMPLETE_COUNT = 5;

type TodayProgress = {
  motivationsAnswered?: number;
  strengthsAnswered?: number;
  skillsAnswered?: number;
};

export function getEarnedBadgeCount(progress: TodayProgress | null | undefined): number {
  if (!progress) return 1;

  const totalAnswered =
    (progress.motivationsAnswered ?? 0) +
    (progress.strengthsAnswered ?? 0) +
    (progress.skillsAnswered ?? 0);

  const allSignalsComplete =
    (progress.motivationsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress.strengthsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT &&
    (progress.skillsAnswered ?? 0) >= SIGNAL_COMPLETE_COUNT;

  if (allSignalsComplete) return 5;
  if (totalAnswered >= 10) return 4;
  if (totalAnswered >= 5) return 3;
  if (totalAnswered > 0) return 2;

  return 1;
}