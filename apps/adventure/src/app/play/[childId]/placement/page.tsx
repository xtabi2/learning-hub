import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { PlacementQuiz } from "@/components/PlacementQuiz";
import { Disclaimer } from "@/components/Disclaimer";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { drawPlacementQuiz } from "@/lib/placementBank";

export const dynamic = "force-dynamic";

export default async function PlacementPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);
  if (child.placementCompleted) {
    redirect(`/play/${childId}`);
  }

  const items = drawPlacementQuiz();

  return (
    <div className="kid-shell">
      {child.isDemo ? <DemoBanner /> : null}
      <Disclaimer compact />
      <PlacementQuiz
        childId={childId}
        items={items}
      />
    </div>
  );
}
