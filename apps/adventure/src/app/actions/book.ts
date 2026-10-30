"use server";

import { revalidatePath } from "next/cache";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { awardBookPart } from "@/lib/adventureStore";
import { isGlowTrailsPartId } from "@/lib/glowtrailsTidal";

export async function earnBookPartAction(input: {
  childId: string;
  partId: string;
}) {
  const parent = await requireUser();
  await requireChildForParent(input.childId, parent.userId);

  if (!isGlowTrailsPartId(input.partId)) {
    return { error: "That ship part is not on this page." };
  }

  const result = await awardBookPart(input.childId, input.partId);
  revalidatePath(`/play/${input.childId}`);
  revalidatePath(`/play/${input.childId}/book`);
  revalidatePath(`/play/${input.childId}/skill`);

  return {
    ok: true as const,
    partId: result.partId,
    earned: result.earned,
    alreadyHad: result.alreadyHad,
    grantedGearId: result.grantedGearId,
    newlyComplete: result.newlyComplete,
    chapterComplete: result.bookProgress.chapterComplete,
    earnedPartIds: result.bookProgress.earnedPartIds,
    gearOwned: result.gearOwned,
  };
}
