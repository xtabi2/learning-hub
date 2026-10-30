import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { requireChildForParent, requireUser } from "@/lib/auth";
import { PILLAR_LABELS, type Pillar } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { getChildPath } from "@/lib/progress";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const user = await requireUser();
  const child = await requireChildForParent(childId, user.userId);
  const path = await getChildPath(childId);
  const baseline = child.isDemo
    ? null
    : await prisma.schoolBaseline.findUnique({ where: { childId } });
  const sessions = await prisma.session.findMany({
    where: { childId },
    orderBy: { startedAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      {child.isDemo ? <DemoBanner /> : null}
      <div className="no-print flex flex-wrap items-center gap-2">
        <Link className="btn-secondary" href="/dashboard">
          Dashboard
        </Link>
        <Link className="btn-secondary" href={`/play/${childId}`}>
          Skill path
        </Link>
        <p className="text-sm text-pine-700">
          Tip: use your browser Print dialog (Ctrl/Cmd+P) for a fridge copy.
          Print CSS hides navigation chrome.
        </p>
      </div>
      <article className="card space-y-5 print:border-0 print:shadow-none">
        <header className="space-y-2 border-b border-pine-100 pb-4">
          <p className="text-sm uppercase tracking-wide text-pine-600">
            {child.isDemo ? "Demo progress report" : "Parent progress report"}
          </p>
          <h1 className="font-display text-4xl text-pine-900">
            {child.isDemo ? `${child.name} (DEMO)` : child.name}
          </h1>
          <p className="text-pine-700">
            Grade {child.grade} · Current streak: {child.currentStreak} day
            {child.currentStreak === 1 ? "" : "s"} · Generated{" "}
            {new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}{" "}
            ET
          </p>
        </header>
        <Disclaimer />
        {baseline ? (
          <section className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-950">
            <h2 className="font-display text-xl text-violet-950">
              School-reported / parent-entered baseline
            </h2>
            <p className="mt-1">
              On file for home practice placement only — not an official school
              score
              {baseline.instrumentLabel
                ? ` (instrument note: ${baseline.instrumentLabel})`
                : ""}
              .
            </p>
          </section>
        ) : null}
        <section>
          <h2 className="font-display text-2xl text-pine-900">Weak strands</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-pine-800">
            {path.weak.map((item) => (
              <li key={item.pillar}>
                {item.label}: {Math.round(item.percent * 100)}% of skills mastered
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-pine-900">Skill status</h2>
          <div className="mt-3 space-y-4">
            {Object.entries(path.byPillar).map(([pillar, skills]) => (
              <div key={pillar}>
                <h3 className="font-semibold text-pine-800">
                  {PILLAR_LABELS[pillar as Pillar] ?? pillar}
                </h3>
                <table className="mt-2 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-pine-100 text-pine-600">
                      <th className="py-1 pr-2">Skill</th>
                      <th className="py-1 pr-2">Status</th>
                      <th className="py-1">Recent accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id} className="border-b border-pine-50">
                        <td className="py-1 pr-2">{skill.title}</td>
                        <td className="py-1 pr-2">
                          {skill.mastered
                            ? "Mastered"
                            : skill.unlocked
                              ? "Unlocked"
                              : "Locked"}
                        </td>
                        <td className="py-1">
                          {Math.round(skill.mastery.percent * 100)}% (
                          {skill.mastery.windowSize} items)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl text-pine-900">Recent sessions</h2>
          {sessions.length === 0 ? (
            <p className="mt-2 text-sm text-pine-700">No sessions recorded yet.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-pine-800">
              {sessions.map((session) => (
                <li key={session.id}>
                  {session.kind}: {session.itemsCorrect}/{session.itemsAttempted}{" "}
                  correct on{" "}
                  {session.startedAt.toLocaleString("en-US", {
                    timeZone: "America/New_York",
                  })}{" "}
                  ET
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </div>
  );
}
