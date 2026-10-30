"use server";

import { redirect } from "next/navigation";
import { GRADES } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ensureStartingUnlocks } from "@/lib/progress";

export async function addChildAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const parent = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();

  if (!name) {
    return { error: "Please enter your child's first name." };
  }
  if (!GRADES.includes(grade as (typeof GRADES)[number])) {
    return { error: "Grade must be K, 1, 2, or 3." };
  }

  const child = await prisma.child.create({
    data: { parentId: parent.userId, name, grade },
  });
  await ensureStartingUnlocks(child.id);
  redirect("/dashboard");
}
