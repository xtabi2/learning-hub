import Link from "next/link";
import { startDemoAction } from "@/app/actions/demo";
import { Disclaimer } from "@/components/Disclaimer";
import { requireUser } from "@/lib/auth";
import { PILLAR_LABELS, type Pillar } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { getChildPath } from "@/lib/progress";

export default async function DashboardPage() {
  const user = await requireUser();
  const children = await prisma.child.findMany({
    where: { parentId: user.userId, isDemo: false },
    orderBy: { createdAt: "asc" },
  });

  const cards = await Promise.all(
    children.map(async (child) => {
      const path = await getChildPath(child.id);
      const sessions = await prisma.session.findMany({
        where: { childId: child.id },
        orderBy: { startedAt: "desc" },
        take: 5,
      });
      const baseline = await prisma.schoolBaseline.findUnique({
        where: { childId: child.id },
      });
      return { child, path, sessions, baseline };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-pine-900">Parent dashboard</h1>
          <p className="mt-2 text-pine-700">
            Track weak strands, streaks, and recent practice for each child.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={startDemoAction}>
            <button className="btn-secondary" type="submit">
              Try as kid
            </button>
          </form>
          <Link className="btn-primary" href="/children/new">
            Add child
          </Link>
        </div>
      </div>
      <Disclaimer compact />
      <div className="card space-y-2 border-violet-200 bg-violet-50/60">
        <h2 className="font-display text-xl text-violet-950">Demo / Try as kid</h2>
        <p className="text-sm text-violet-900">
          Preview placement and skill lessons in the kid UI without creating a
          real child profile. Demo progress stays on a separate demo profile and
          never updates your children&apos;s mastery.
        </p>
        <form action={startDemoAction}>
          <button className="btn-secondary" type="submit">
            Open demo kid experience
          </button>
        </form>
      </div>
      {cards.length === 0 ? (
        <div className="card space-y-3">
          <h2 className="font-display text-2xl">No children yet</h2>
          <p className="text-sm text-pine-700">
            Add a child profile to start placement and the skill path — or try
            the demo first.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link className="btn-primary inline-flex" href="/children/new">
              Add your first child
            </Link>
            <form action={startDemoAction}>
              <button className="btn-secondary" type="submit">
                Try as kid
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map(({ child, path, sessions, baseline }) => (
            <article key={child.id} className="card space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl text-pine-900">
                    {child.name}
                  </h2>
                  <p className="text-sm text-pine-700">
                    Grade {child.grade} · Streak {child.currentStreak} day
                    {child.currentStreak === 1 ? "" : "s"}
                    {child.placementCompleted ? "" : " · Placement needed"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link className="btn-primary" href={`/play/${child.id}`}>
                    {child.placementCompleted ? "Open skill path" : "Start placement"}
                  </Link>
                  <Link className="btn-secondary" href={`/report/${child.id}`}>
                    Progress report
                  </Link>
                  <Link
                    className="btn-secondary"
                    href={`/children/${child.id}/baseline`}
                  >
                    School baseline
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-pine-600">
                  Weak strands
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {path.weak.map((item) => (
                    <li
                      key={item.pillar}
                      className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-950"
                    >
                      {item.label}: {Math.round(item.percent * 100)}% mastered
                    </li>
                  ))}
                </ul>
              </div>
              {baseline ? (
                <p className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-950">
                  School-reported / parent-entered baseline on file
                  {baseline.instrumentLabel
                    ? ` (${baseline.instrumentLabel})`
                    : ""}
                  . Home-lab placement only — not an official school score.{" "}
                  <Link
                    className="underline"
                    href={`/children/${child.id}/baseline`}
                  >
                    Edit bands
                  </Link>
                </p>
              ) : null}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-pine-600">
                  Pillar snapshot
                </h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {Object.entries(path.pillarPercents).map(([pillar, percent]) => (
                    <div
                      key={pillar}
                      className="rounded-xl border border-pine-100 bg-pine-50 px-3 py-2 text-sm"
                    >
                      <div className="font-semibold text-pine-900">
                        {PILLAR_LABELS[pillar as Pillar] ?? pillar}
                      </div>
                      <div>{Math.round(percent * 100)}% skills mastered</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-pine-600">
                  Recent sessions
                </h3>
                {sessions.length === 0 ? (
                  <p className="mt-2 text-sm text-pine-700">No sessions yet.</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-pine-800">
                    {sessions.map((session) => (
                      <li key={session.id}>
                        {session.kind} · {session.itemsCorrect}/
                        {session.itemsAttempted} correct ·{" "}
                        {session.startedAt.toLocaleString("en-US", {
                          timeZone: "America/New_York",
                        })}{" "}
                        ET
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
