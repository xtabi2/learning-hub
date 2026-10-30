import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { GlowTrailsBook } from "@/components/GlowTrailsBook";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { getAdventureSnapshot } from "@/lib/adventureStore";
import { getChildPath } from "@/lib/progress";
import { pickBookLessonSkill } from "@/lib/glowtrailsTidal";
import { prisma } from "@/lib/db";

export default async function KidsBookPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);

  if (!child.placementCompleted) {
    redirect(`/play/${childId}/placement`);
  }

  const [adventure, path] = await Promise.all([
    getAdventureSnapshot(childId),
    getChildPath(childId),
  ]);

  const picked = pickBookLessonSkill(path.byPillar);
  let lesson: {
    skillId: string;
    skillTitle: string;
    items: { id: string; prompt: string; options: string[]; sortOrder: number }[];
  } | null = null;

  if (picked) {
    const skill = await prisma.skill.findUnique({
      where: { id: picked.id },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    });
    if (skill && skill.items.length > 0) {
      lesson = {
        skillId: skill.id,
        skillTitle: skill.title,
        items: skill.items.map((item) => ({
          id: item.id,
          prompt: item.prompt,
          options: JSON.parse(item.optionsJson) as string[],
          sortOrder: item.sortOrder,
        })),
      };
    }
  }

  return (
    <div className="kid-shell">
      {child.isDemo ? <DemoBanner /> : null}
      <GlowTrailsBook
        childId={childId}
        childName={child.name}
        band={adventure.storyReadingBand}
        initialProgress={adventure.bookProgress}
        lesson={lesson}
      />
    </div>
  );
}
