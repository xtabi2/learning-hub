"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEMO_CHILD_GRADE, DEMO_CHILD_NAME } from "@/lib/demo";
import { ensureStartingUnlocks } from "@/lib/progress";

/**
 * Ensure the signed-in parent has exactly one synthetic demo child, then open play.
 * Demo attempts/mastery live only on that Child row (isDemo=true) and never touch real kids.
 */
export async function startDemoAction() {
  const parent = await requireUser();
  let demo = await prisma.child.findFirst({
    where: { parentId: parent.userId, isDemo: true },
  });
  if (!demo) {
    demo = await prisma.child.create({
      data: {
        parentId: parent.userId,
        name: DEMO_CHILD_NAME,
        grade: DEMO_CHILD_GRADE,
        isDemo: true,
      },
    });
    await ensureStartingUnlocks(demo.id);
  }
  redirect(`/play/${demo.id}`);
}
