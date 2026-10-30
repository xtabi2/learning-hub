import {
  HOME_PLANET_NAME,
  NIBBLES_PARTS_TO_LAUNCH,
  NIBBLES_SHIP_PARTS,
  shipPartDef,
  type AdventureSnapshot,
} from "@/lib/adventure";
import { NibblesCompanionBanner } from "@/components/NibblesCompanionBanner";
import {
  NIBBLES_CHARACTER,
  STAR_NOOK_HUB,
  pickNibblesLine,
} from "@/lib/nibblesCompanion";

/**
 * Kid-facing Star Nook journey card: companion, ship-parts progress, launch-ready state.
 * Nibbles is the guide character — the hub place name is Star Nook.
 */
export function AdventureJourney({
  childName,
  adventure,
}: {
  childName: string;
  adventure: AdventureSnapshot;
}) {
  const partsNeeded = NIBBLES_PARTS_TO_LAUNCH;
  const collected = adventure.partsCollected;
  const ready = adventure.readyToLeave;
  const hubLine = ready
    ? pickNibblesLine("celebration", childName)
    : pickNibblesLine("hub_welcome", childName);

  return (
    <section className="card space-y-4 border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50">
      <NibblesCompanionBanner
        kind={ready ? "celebration" : "hub_welcome"}
        line={hubLine}
        seed={childName}
        speak={false}
      />
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-4 border-amber-300 bg-amber-50 shadow-md sm:h-28 sm:w-28">
          <img
            src={NIBBLES_CHARACTER.artSrc}
            alt={`${NIBBLES_CHARACTER.name} at ${HOME_PLANET_NAME}`}
            className="h-full w-full object-cover"
            width={112}
            height={112}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Home base · {HOME_PLANET_NAME}
          </p>
          <h2 className="font-display text-2xl text-pine-900 sm:text-3xl">
            {ready
              ? `Ready for launch from ${HOME_PLANET_NAME}!`
              : `${childName}'s dock at ${HOME_PLANET_NAME}`}
          </h2>
          <p className="mt-1 text-base text-pine-700">
            {ready
              ? "Our spaceship has enough parts for the first hop. Check the galaxy map for the next unlocked planet — upgrade the ship to go forward!"
              : `${STAR_NOOK_HUB.blurb} Complete missions to earn spaceship parts. Collect enough parts to leave for the next planet!`}
          </p>
          <p className="mt-2 text-sm font-semibold text-violet-800">
            {STAR_NOOK_HUB.storyStarHint}
          </p>
        </div>
      </div>

      {ready ? (
        <div
          className="rounded-2xl border-2 border-amber-400 bg-amber-100/80 px-4 py-3 text-center font-display text-xl text-amber-950 shadow-sm"
          role="status"
          data-launch-ready="true"
        >
          🚀 Ready for launch from {HOME_PLANET_NAME}! Open the galaxy map to chart your next hop
        </div>
      ) : null}

      <div>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-display text-xl text-pine-900">
            Spaceship parts
          </h3>
          <p className="text-sm font-bold text-pine-700">
            {Math.min(collected, partsNeeded)} / {partsNeeded} for launch
          </p>
        </div>
        <div
          className="mb-3 h-3 overflow-hidden rounded-full bg-pine-100"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{
              width: `${Math.min(100, (collected / partsNeeded) * 100)}%`,
            }}
          />
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {NIBBLES_SHIP_PARTS.slice(0, partsNeeded).map((part, index) => {
            const earned = adventure.shipParts.some((p) => p.partId === part.id);
            const def = shipPartDef(part.id) ?? part;
            return (
              <li
                key={part.id}
                className={`rounded-2xl border-2 px-3 py-2 ${
                  earned
                    ? "border-sky-400 bg-sky-50"
                    : "border-slate-200 bg-slate-50 opacity-70"
                }`}
              >
                <p className="font-bold text-pine-900">
                  {earned ? "✦ " : `${index + 1}. `}
                  {def.label}
                </p>
                <p className="text-sm text-pine-700">{def.blurb}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
