import { MASTERY_THRESHOLD, MASTERY_WINDOW } from "./constants";

export type AttemptLike = {
  skillId: string;
  correct: boolean;
  createdAt: Date;
};

export type MasteryResult = {
  percent: number;
  windowSize: number;
  correct: number;
  mastered: boolean;
};

/**
 * Mastery is computed from the most recent MASTERY_WINDOW attempts
 * for a skill. A skill is mastered only when the window is full and
 * the correct rate is at least MASTERY_THRESHOLD (default 80%).
 */
export function computeMastery(
  attempts: AttemptLike[],
  skillId: string,
  options?: { threshold?: number; window?: number },
): MasteryResult {
  const threshold = options?.threshold ?? MASTERY_THRESHOLD;
  const window = options?.window ?? MASTERY_WINDOW;

  const skillAttempts = attempts
    .filter((a) => a.skillId === skillId)
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, window);

  if (skillAttempts.length === 0) {
    return { percent: 0, windowSize: 0, correct: 0, mastered: false };
  }

  const correct = skillAttempts.filter((a) => a.correct).length;
  const percent = correct / skillAttempts.length;
  const mastered = skillAttempts.length >= window && percent >= threshold;

  return { percent, windowSize: skillAttempts.length, correct, mastered };
}

export type SkillGate = {
  id: string;
  prerequisiteSkillId: string | null;
};

/**
 * Nodes stay LOCKED until the prerequisite skill is mastered.
 * Skills with no prerequisite start unlocked.
 */
export function isSkillUnlocked(
  skill: SkillGate,
  masteryBySkillId: Record<string, boolean>,
): boolean {
  if (!skill.prerequisiteSkillId) {
    return true;
  }
  return masteryBySkillId[skill.prerequisiteSkillId] === true;
}

export function buildUnlockMap(
  skills: SkillGate[],
  masteryBySkillId: Record<string, boolean>,
): Record<string, boolean> {
  const unlocked: Record<string, boolean> = {};
  for (const skill of skills) {
    unlocked[skill.id] = isSkillUnlocked(skill, masteryBySkillId);
  }
  return unlocked;
}

export function weakestPillars(
  pillarPercents: Record<string, number>,
  count = 2,
): string[] {
  return Object.entries(pillarPercents)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([pillar]) => pillar);
}

export function updateStreak(
  lastPracticeDate: Date | null,
  now: Date,
  currentStreak: number,
): number {
  if (!lastPracticeDate) {
    return 1;
  }
  const last = startOfDay(lastPracticeDate);
  const today = startOfDay(now);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);
  if (diffDays === 0) {
    return Math.max(currentStreak, 1);
  }
  if (diffDays === 1) {
    return currentStreak + 1;
  }
  return 1;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
