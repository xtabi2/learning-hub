import { prisma } from "./db";
import {
  buildUnlockMap,
  computeMastery,
  weakestPillars,
} from "./mastery";
import { MASTERY_WINDOW, PILLAR_LABELS, type Pillar } from "./constants";
import { awardShipPartForSkillMastery } from "./adventureStore";

export async function getChildPath(childId: string) {
  const [child, skills, attempts] = await Promise.all([
    prisma.child.findUniqueOrThrow({ where: { id: childId } }),
    prisma.skill.findMany({ orderBy: [{ pillar: "asc" }, { sortOrder: "asc" }] }),
    prisma.attempt.findMany({
      where: { childId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const slugToId = new Map(skills.map((s) => [s.slug, s.id]));
  const gates = skills.map((skill) => ({
    id: skill.id,
    prerequisiteSkillId: skill.prerequisiteSlug
      ? (slugToId.get(skill.prerequisiteSlug) ?? null)
      : null,
  }));

  const masteryBySkillId: Record<string, boolean> = {};
  const masteryDetails: Record<
    string,
    ReturnType<typeof computeMastery>
  > = {};
  for (const skill of skills) {
    const result = computeMastery(attempts, skill.id);
    masteryDetails[skill.id] = result;
    masteryBySkillId[skill.id] = result.mastered;
  }

  const unlockMap = buildUnlockMap(gates, masteryBySkillId);

  const byPillar = skills.reduce(
    (acc, skill) => {
      const list = acc[skill.pillar] ?? [];
      list.push({
        ...skill,
        mastery: masteryDetails[skill.id],
        unlocked: unlockMap[skill.id] ?? false,
        mastered: masteryBySkillId[skill.id] ?? false,
      });
      acc[skill.pillar] = list;
      return acc;
    },
    {} as Record<
      string,
      Array<
        (typeof skills)[number] & {
          mastery: ReturnType<typeof computeMastery>;
          unlocked: boolean;
          mastered: boolean;
        }
      >
    >,
  );

  const pillarPercents: Record<string, number> = {};
  for (const [pillar, list] of Object.entries(byPillar)) {
    const masteredCount = list.filter((s) => s.mastered).length;
    pillarPercents[pillar] = list.length ? masteredCount / list.length : 0;
  }

  const weak = weakestPillars(pillarPercents).map((pillar) => ({
    pillar,
    label: PILLAR_LABELS[pillar as Pillar] ?? pillar,
    percent: pillarPercents[pillar] ?? 0,
  }));

  return { child, skills, byPillar, pillarPercents, weak, attempts };
}

export async function syncSkillProgress(childId: string, skillId: string) {
  const existing = await prisma.skillProgress.findUnique({
    where: { childId_skillId: { childId, skillId } },
  });
  const wasMastered = existing?.mastered === true;

  const attempts = await prisma.attempt.findMany({
    where: { childId, skillId },
    orderBy: { createdAt: "desc" },
  });
  const mastery = computeMastery(attempts, skillId);
  await prisma.skillProgress.upsert({
    where: { childId_skillId: { childId, skillId } },
    create: {
      childId,
      skillId,
      itemsAttempted: attempts.length,
      itemsCorrect: attempts.filter((a) => a.correct).length,
      mastered: mastery.mastered,
      unlocked: true,
    },
    update: {
      itemsAttempted: attempts.length,
      itemsCorrect: attempts.filter((a) => a.correct).length,
      mastered: mastery.mastered,
      unlocked: true,
    },
  });

  // Space-adventure reward: one ship part when a skill newly reaches mastery.
  if (!wasMastered && mastery.mastered) {
    await awardShipPartForSkillMastery(childId, skillId);
  }

  return mastery;
}

export async function ensureStartingUnlocks(childId: string) {
  const skills = await prisma.skill.findMany();
  const firsts = skills.filter((s) => !s.prerequisiteSlug);
  for (const skill of firsts) {
    await prisma.skillProgress.upsert({
      where: { childId_skillId: { childId, skillId: skill.id } },
      create: {
        childId,
        skillId: skill.id,
        unlocked: true,
      },
      update: { unlocked: true },
    });
  }
}


/**
 * Award synthetic mastery for a skill (same pattern as strong placement entry).
 * Additive only: skips if the skill is already mastered from attempts.
 * Used by parent-entered school baselines and placement.
 */
export async function awardSyntheticMastery(childId: string, skillId: string) {
  const existing = await prisma.attempt.findMany({
    where: { childId, skillId },
    orderBy: { createdAt: "desc" },
  });
  if (computeMastery(existing, skillId).mastered) {
    return { awarded: false as const };
  }

  const firstItem = await prisma.item.findFirst({
    where: { skillId },
    orderBy: { sortOrder: "asc" },
  });
  if (!firstItem) {
    return { awarded: false as const };
  }

  await prisma.attempt.createMany({
    data: Array.from({ length: MASTERY_WINDOW }, () => ({
      childId,
      itemId: firstItem.id,
      skillId,
      correct: true,
      answer: firstItem.correctAnswer,
    })),
  });

  await prisma.skillProgress.upsert({
    where: { childId_skillId: { childId, skillId } },
    create: {
      childId,
      skillId,
      mastered: true,
      unlocked: true,
      itemsAttempted: MASTERY_WINDOW,
      itemsCorrect: MASTERY_WINDOW,
    },
    update: {
      mastered: true,
      unlocked: true,
      itemsAttempted: MASTERY_WINDOW,
      itemsCorrect: MASTERY_WINDOW,
    },
  });

  // Placement / baseline synthetic mastery also earns a spaceship part.
  await awardShipPartForSkillMastery(childId, skillId);

  return { awarded: true as const };
}
