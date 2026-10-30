import Link from "next/link";
import { kidPillarLabel } from "@/lib/adventure";

type SkillNode = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  mastered: boolean;
  mastery: { percent: number; windowSize: number };
};

/**
 * Kid play skill path — adventure language on labels/status.
 * Parent dashboard/report keep real pillar names elsewhere.
 */
export function SkillPath({
  childId,
  byPillar,
}: {
  childId: string;
  byPillar: Record<string, SkillNode[]>;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-pine-900">Mission path at Star Nook</h2>
      {Object.entries(byPillar).map(([pillar, skills]) => (
        <section key={pillar} className="card space-y-4">
          <h3 className="font-display text-pine-900">
            {kidPillarLabel(pillar)}
          </h3>
          <ol className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill, index) => {
              const pct = Math.round(skill.mastery.percent * 100);
              const stateClass = skill.mastered
                ? "kid-path-node-mastered"
                : skill.unlocked
                  ? "kid-path-node-unlocked"
                  : "kid-path-node-locked";
              return (
                <li key={skill.id} className={`kid-path-node ${stateClass}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold uppercase tracking-wide text-pine-600">
                      Mission {index + 1}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        skill.mastered
                          ? "bg-amber-200 text-amber-950"
                          : skill.unlocked
                            ? "bg-pine-200 text-pine-900"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {skill.mastered
                        ? "★ Power-up!"
                        : skill.unlocked
                          ? "Ready"
                          : "🔒 Locked"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-pine-900">
                    {skill.title}
                  </h3>
                  <p className="mt-1 text-base text-pine-700">
                    {skill.description}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-pine-600">
                    Mission progress: {pct}% ({skill.mastery.windowSize} tries)
                  </p>
                  {skill.unlocked ? (
                    <Link
                      className="kid-primary mt-4 inline-flex w-full sm:w-auto"
                      href={`/play/${childId}/skill/${skill.id}`}
                    >
                      Start mission
                    </Link>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      Locked until you finish the mission before this one and
                      earn its power-up.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
