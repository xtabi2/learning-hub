import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/DemoBanner";
import { QuizPlayer } from "@/components/QuizPlayer";
import { Disclaimer } from "@/components/Disclaimer";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { getAdventureSnapshot } from "@/lib/adventureStore";
import { prisma } from "@/lib/db";
import { computeMastery, isSkillUnlocked } from "@/lib/mastery";
import { isPhase1PartId } from "@/lib/phase1KidsBook";

export default async function SkillPracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ childId: string; skillId: string }>;
  searchParams: Promise<{ from?: string; part?: string }>;
}) {
  const { childId, skillId } = await params;
  const query = await searchParams;
  const fromBook = query.from === "book";
  const bookPartId =
    fromBook && query.part && isPhase1PartId(query.part) ? query.part : null;
  const returnHref = fromBook ? `/play/${childId}/book` : null;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);

  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  if (!skill) notFound();

  const skills = await prisma.skill.findMany();
  const slugToId = new Map(skills.map((s) => [s.slug, s.id]));
  const attempts = await prisma.attempt.findMany({
    where: { childId },
    orderBy: { createdAt: "desc" },
  });
  const masteryBySkillId: Record<string, boolean> = {};
  for (const entry of skills) {
    masteryBySkillId[entry.id] = computeMastery(attempts, entry.id).mastered;
  }
  const prereqId = skill.prerequisiteSlug
    ? (slugToId.get(skill.prerequisiteSlug) ?? null)
    : null;
  const unlocked = isSkillUnlocked(
    { id: skill.id, prerequisiteSkillId: prereqId },
    masteryBySkillId,
  );

  if (!unlocked) {
    return (
      <div className="kid-shell">
        {child.isDemo ? <DemoBanner /> : null}
        <div className="card space-y-4">
          <h1 className="font-display text-pine-900">{skill.title}</h1>
          <p>
            This mission is locked. Finish the mission before this one and earn
            its power-up to open practice here.
          </p>
          <Link className="kid-primary inline-flex" href={`/play/${childId}`}>
            Back to mission path
          </Link>
        </div>
      </div>
    );
  }

  const adventure = await getAdventureSnapshot(childId);
  const planetId = adventure.currentPlanetId || adventure.planetId;

  return (
    <div className="kid-shell">
      {child.isDemo ? <DemoBanner /> : null}
      <div className="flex flex-wrap gap-2">
        <Link className="btn-secondary" href={`/play/${childId}`}>
          Back to missions
        </Link>
        {returnHref ? (
          <Link className="kid-celebrate" href={returnHref}>
            Back to the book
          </Link>
        ) : null}
      </div>
      <Disclaimer compact />
      <QuizPlayer
        childId={childId}
        skillTitle={skill.title}
        planetId={planetId}
        items={skill.items.map((item) => ({
          id: item.id,
          prompt: item.prompt,
          options: JSON.parse(item.optionsJson) as string[],
          sortOrder: item.sortOrder,
        }))}
        bookPartId={bookPartId}
        returnHref={returnHref}
      />
    </div>
  );
}
