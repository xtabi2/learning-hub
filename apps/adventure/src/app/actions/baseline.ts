"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BASELINE_SOURCE_LABEL,
  PILLARS,
  type BaselineBand,
  type Pillar,
} from "@/lib/constants";
import {
  isBaselineBand,
  serializeBandsJson,
  skillIdsForBand,
  type BaselineBands,
} from "@/lib/baseline";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { baselineBlockReasonForChild } from "@/lib/demo";
import { prisma } from "@/lib/db";
import { awardSyntheticMastery, ensureStartingUnlocks } from "@/lib/progress";

export type BaselineActionState = {
  error?: string;
  ok?: boolean;
} | null;

function readBandsFromForm(formData: FormData): BaselineBands | { error: string } {
  const bands: BaselineBands = {};
  for (const pillar of PILLARS) {
    const raw = String(formData.get(`band_${pillar}`) ?? "").trim();
    if (!raw) continue;
    if (!isBaselineBand(raw)) {
      return { error: `Invalid band for ${pillar}.` };
    }
    bands[pillar] = raw as BaselineBand;
  }
  if (Object.keys(bands).length === 0) {
    return {
      error: "Pick at least one pillar band (school-reported / parent-entered).",
    };
  }
  return bands;
}

/**
 * Save parent-entered school baseline bands and map them into synthetic mastery
 * for this app's skill path. Additive only; does not revoke practiced mastery.
 * Hidden/blocked for demo children.
 */
export async function saveBaselineAction(
  _prev: BaselineActionState,
  formData: FormData,
): Promise<BaselineActionState> {
  const parent = await requireUser();
  const childId = String(formData.get("childId") ?? "").trim();
  if (!childId) {
    return { error: "Missing child." };
  }

  const child = await requireChildForParent(childId, parent.userId);
  const demoBlock = baselineBlockReasonForChild(child);
  if (demoBlock) {
    return { error: demoBlock };
  }

  const bandsResult = readBandsFromForm(formData);
  if ("error" in bandsResult) {
    return { error: bandsResult.error };
  }
  const bands = bandsResult;

  const instrumentLabel =
    String(formData.get("instrumentLabel") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const now = new Date();
  await prisma.schoolBaseline.upsert({
    where: { childId },
    create: {
      childId,
      sourceLabel: BASELINE_SOURCE_LABEL,
      instrumentLabel,
      bandsJson: serializeBandsJson(bands),
      notes,
      appliedAt: now,
    },
    update: {
      sourceLabel: BASELINE_SOURCE_LABEL,
      instrumentLabel,
      bandsJson: serializeBandsJson(bands),
      notes,
      appliedAt: now,
    },
  });

  await ensureStartingUnlocks(childId);

  const skills = await prisma.skill.findMany({
    orderBy: [{ pillar: "asc" }, { sortOrder: "asc" }],
  });
  const byPillar = new Map<string, typeof skills>();
  for (const skill of skills) {
    const list = byPillar.get(skill.pillar) ?? [];
    list.push(skill);
    byPillar.set(skill.pillar, list);
  }

  let awarded = 0;
  for (const pillar of PILLARS) {
    const band = bands[pillar as Pillar];
    if (!band) continue;
    const pillarSkills = byPillar.get(pillar) ?? [];
    const ids = skillIdsForBand(band, pillarSkills);
    for (const skillId of ids) {
      const result = await awardSyntheticMastery(childId, skillId);
      if (result.awarded) awarded += 1;
    }
  }

  await prisma.session.create({
    data: {
      childId,
      kind: "baseline",
      itemsAttempted: awarded,
      itemsCorrect: awarded,
      endedAt: now,
    },
  });

  if (!child.placementCompleted) {
    await prisma.child.update({
      where: { id: childId },
      data: { placementCompleted: true },
    });
  }

  revalidatePath(`/play/${childId}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/report/${childId}`);
  revalidatePath(`/children/${childId}/baseline`);
  redirect(`/play/${childId}`);
}
