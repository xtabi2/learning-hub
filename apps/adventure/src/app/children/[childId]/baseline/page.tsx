import Link from "next/link";
import { redirect } from "next/navigation";
import { BaselineForm } from "@/components/BaselineForm";
import { Disclaimer } from "@/components/Disclaimer";
import { parseBandsJson } from "@/lib/baseline";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ChildBaselinePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);

  if (child.isDemo) {
    redirect("/dashboard");
  }

  const baseline = await prisma.schoolBaseline.findUnique({
    where: { childId },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link className="btn-secondary" href="/dashboard">
          Dashboard
        </Link>
        <Link className="btn-secondary" href={`/play/${childId}`}>
          Skill path
        </Link>
      </div>
      <Disclaimer compact />
      <BaselineForm
        childId={child.id}
        childName={child.name}
        initialBands={baseline ? parseBandsJson(baseline.bandsJson) : {}}
        initialInstrumentLabel={baseline?.instrumentLabel}
        initialNotes={baseline?.notes}
      />
    </div>
  );
}
