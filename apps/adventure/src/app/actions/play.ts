"use server";

import { revalidatePath } from "next/cache";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeMastery, isSkillUnlocked, updateStreak } from "@/lib/mastery";
import {
  isStrongPlacementPillar,
  placementCompleteOk,
} from "@/lib/placement";
import { gradePlacementAnswers } from "@/lib/placementBank";
import { deriveStartBandFromPillarHits } from "@/lib/storyReadingBand";
import { setStoryReadingBand } from "@/lib/adventureStore";
import { awardSyntheticMastery, syncSkillProgress } from "@/lib/progress";

export async function submitAttemptAction(input: {
  childId: string;
  itemId: string;
  answer: string;
  sessionId?: string;
}) {
  const parent = await requireUser();
  await requireChildForParent(input.childId, parent.userId);

  const item = await prisma.item.findUnique({
    where: { id: input.itemId },
    include: { skill: true },
  });
  if (!item) {
    return { error: "That activity could not be found." };
  }

  const skills = await prisma.skill.findMany();
  const slugToId = new Map(skills.map((s) => [s.slug, s.id]));
  const attempts = await prisma.attempt.findMany({
    where: { childId: input.childId },
    orderBy: { createdAt: "desc" },
  });
  const masteryBySkillId: Record<string, boolean> = {};
  for (const skill of skills) {
    masteryBySkillId[skill.id] = computeMastery(attempts, skill.id).mastered;
  }
  const prereqId = item.skill.prerequisiteSlug
    ? (slugToId.get(item.skill.prerequisiteSlug) ?? null)
    : null;
  if (
    !isSkillUnlocked(
      { id: item.skill.id, prerequisiteSkillId: prereqId },
      masteryBySkillId,
    )
  ) {
    return {
      error: "This skill is locked until the previous skill is mastered.",
    };
  }

  const correct =
    item.correctAnswer.trim().toLowerCase() ===
    input.answer.trim().toLowerCase();

  await prisma.attempt.create({
    data: {
      childId: input.childId,
      itemId: item.id,
      skillId: item.skillId,
      correct,
      answer: input.answer,
    },
  });

  if (input.sessionId) {
    await prisma.session.update({
      where: { id: input.sessionId },
      data: {
        itemsAttempted: { increment: 1 },
        itemsCorrect: { increment: correct ? 1 : 0 },
      },
    });
  }

  const child = await prisma.child.findUniqueOrThrow({
    where: { id: input.childId },
  });
  const now = new Date();
  await prisma.child.update({
    where: { id: input.childId },
    data: {
      currentStreak: updateStreak(
        child.lastPracticeDate,
        now,
        child.currentStreak,
      ),
      lastPracticeDate: now,
    },
  });

  const mastery = await syncSkillProgress(input.childId, item.skillId);
  revalidatePath(`/play/${input.childId}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/report/${input.childId}`);

  return {
    correct,
    explanation: item.explanation,
    mastered: mastery.mastered,
    percent: mastery.percent,
    windowSize: mastery.windowSize,
  };
}

export async function completePlacementAction(input: {
  childId: string;
  answers: { itemId: string; answer: string }[];
}) {
  const parent = await requireUser();
  const child = await requireChildForParent(input.childId, parent.userId);
  if (child.placementCompleted) {
    return placementCompleteOk(input.childId);
  }

  const { correctCount, pillarHits, graded } = gradePlacementAnswers(
    input.answers ?? [],
  );
  if (graded === 0) {
    return { ok: false as const, error: "No valid placement answers." };
  }

  const session = await prisma.session.create({
    data: {
      childId: input.childId,
      kind: "placement",
      itemsAttempted: graded,
    },
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { itemsCorrect: correctCount, endedAt: new Date() },
  });

  const skills = await prisma.skill.findMany();
  for (const skill of skills) {
    const bucket = pillarHits[skill.pillar];
    if (isStrongPlacementPillar(bucket) && !skill.prerequisiteSlug) {
      await awardSyntheticMastery(input.childId, skill.id);
    }
  }

  const startBand = deriveStartBandFromPillarHits(pillarHits);
  await setStoryReadingBand(input.childId, startBand);

  const now = new Date();
  await prisma.child.update({
    where: { id: input.childId },
    data: {
      placementCompleted: true,
      currentStreak: updateStreak(
        child.lastPracticeDate,
        now,
        child.currentStreak,
      ),
      lastPracticeDate: now,
    },
  });

  revalidatePath(`/play/${input.childId}`);
  revalidatePath("/dashboard");
  return placementCompleteOk(input.childId);
}
