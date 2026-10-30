import {
  canLandOnPlanet,
  canVisitPlanetIndex,
  checkGearGate,
  describeShipForTier,
  farthestReachableIndex,
  planetThemeById,
  requiredShipTierForPlanetIndex,
  type AdventureSnapshot,
} from "@/lib/adventure";
import { galaxyById, isGlowtrailSkillPlanet } from "@/lib/galaxyCatalog";
import { NibblesCompanionBanner } from "@/components/NibblesCompanionBanner";
import { SpokenPrompt } from "@/components/SpokenPrompt";
import {
  galaxyScript,
  kidPlanetDisplayName,
  nibblesArriveLine,
  nibblesBlockerLine,
  nibblesMorphTeaser,
  planetScript,
} from "@/lib/nibblesCompanion";

/**
 * Kid-facing galaxy / planet map (iteration 2).
 * Shows locked forward planets, revisit for unlocked, and gear-gate messaging.
 * Parent competency names are never rendered here.
 * Nibbles companion explains blockers in ship/gear story terms.
 */
export function GalaxyPlanetMap({
  adventure,
}: {
  adventure: AdventureSnapshot;
}) {
  const galaxy = galaxyById(adventure.galaxyId);
  const ship = describeShipForTier(adventure.shipTier);
  const farthest = farthestReachableIndex(adventure.shipTier);
  const currentId = adventure.currentPlanetId || adventure.planetId;

  const firstBlocked = adventure.planetOrder
    .map((planetId, index) => {
      const reachable = canVisitPlanetIndex(index, adventure.shipTier);
      const gearGate = checkGearGate(planetId, adventure.gearOwned);
      if (!reachable) {
        return {
          planetId,
          reason: "need_ship_upgrade" as const,
          gearLabel: undefined as string | undefined,
        };
      }
      if (!gearGate.ok) {
        return {
          planetId,
          reason: "need_gear" as const,
          gearLabel: gearGate.gear.label,
        };
      }
      return null;
    })
    .find(Boolean);

  const companionKind = firstBlocked
    ? firstBlocked.reason === "need_gear"
      ? "blocked_gear"
      : "blocked_ship"
    : "map_nudge";
  const companionLine = firstBlocked
    ? firstBlocked.reason === "need_gear"
      ? nibblesBlockerLine({
          reason: "need_gear",
          gearLabel: firstBlocked.gearLabel,
          seed: firstBlocked.planetId,
          planetId: firstBlocked.planetId,
        })
      : nibblesBlockerLine({
          reason: firstBlocked.reason,
          seed: firstBlocked.planetId,
        })
    : galaxyScript("map_nudge");

  const currentArrive =
    currentId && isGlowtrailSkillPlanet(currentId)
      ? nibblesArriveLine(currentId, currentId)
      : null;

  return (
    <section
      className="card space-y-4 border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50"
      aria-label="Galaxy planet map"
      data-galaxy-id={adventure.galaxyId}
    >
      <NibblesCompanionBanner
        kind={companionKind}
        line={companionLine}
        seed={adventure.galaxyId}
        // Speak blockers; map nudge is silent here (play page speaks galaxy arrive).
        speak={Boolean(firstBlocked)}
      />
      {currentArrive ? (
        <NibblesCompanionBanner
          kind="before_task"
          line={currentArrive}
          seed={currentId}
          speak={false}
          compact
        />
      ) : null}
      <div
        className="overflow-hidden rounded-2xl border border-indigo-400/40"
        style={{
          backgroundImage: "url(/adventure/galaxy-backdrop.svg)",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/55 px-4 py-3 sm:px-5">
          <img
            src="/adventure/ship-starter.png"
            alt=""
            width={72}
            height={72}
            className="h-16 w-16 rounded-2xl border-2 border-amber-300/80 bg-slate-800 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-300">
              Galaxy map
            </p>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              {galaxy?.name ?? "Your galaxy"}
            </h2>
            <p className="mt-1 text-sm text-slate-200">
              {galaxy?.blurb ??
                "Visit unlocked planets. Upgrade your ship to go forward."}
            </p>
            <p className="mt-2 text-sm font-semibold text-amber-200">
              Ship: {ship.label} (tier {adventure.shipTier}) — {ship.blurb}
            </p>
          </div>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {adventure.planetOrder.map((planetId, index) => {
          const theme = planetThemeById(planetId);
          const reachable = canVisitPlanetIndex(index, adventure.shipTier);
          const isCurrent = planetId === currentId;
          const isForwardLocked = index > farthest;
          const gearGate = checkGearGate(planetId, adventure.gearOwned);
          const canLand = canLandOnPlanet(planetId, adventure.gearOwned);
          const needTier = requiredShipTierForPlanetIndex(index);
          const displayName = kidPlanetDisplayName(planetId, theme?.name);

          let statusLabel = "Unlocked";
          let statusDetail = "You can revisit this planet.";
          if (isCurrent) {
            statusLabel = "You are here";
            statusDetail =
              planetScript(planetId, "arrive") ||
              theme?.themeBlurb ||
              "Home base.";
          } else if (isForwardLocked) {
            statusLabel = "Locked forward";
            statusDetail = nibblesBlockerLine({
              reason: "need_ship_upgrade",
              seed: planetId,
            });
          } else if (!canLand) {
            statusLabel = "Need gear";
            statusDetail = !gearGate.ok
              ? planetScript(planetId, "gearLocked") ||
                nibblesMorphTeaser(gearGate.gear.label, planetId)
              : "Need gear to land.";
          }

          return (
            <li
              key={planetId}
              data-planet-id={planetId}
              data-reachable={reachable ? "true" : "false"}
              data-gear-ok={canLand ? "true" : "false"}
              data-current={isCurrent ? "true" : "false"}
              className={`rounded-2xl border-2 p-3 ${
                isCurrent
                  ? "border-amber-300 bg-amber-400/20"
                  : reachable
                    ? "border-sky-400/70 bg-sky-500/10"
                    : "border-slate-600 bg-slate-800/80 opacity-80"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={theme?.artSrc ?? "/adventure/star-nook.png"}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-white/30 bg-slate-800 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-white">
                    {index + 1}. {displayName}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-200">
                    {statusLabel}
                  </p>
                </div>
              </div>
              <div className="mt-2 rounded-xl bg-slate-950/40 px-2 py-1 text-slate-50 [&_.text-pine-900]:!text-slate-50 [&_button]:!text-slate-50 [&_button]:decoration-sky-300">
                <SpokenPrompt
                  text={statusDetail}
                  autoSpeak={false}
                  tapWords
                  compact
                  className="!gap-2"
                />
              </div>
              {!gearGate.ok ? (
                <div
                  className="mt-2 rounded-xl bg-rose-500/20 px-2 py-1 text-sm font-semibold text-rose-100 [&_.text-pine-900]:!text-rose-50 [&_button]:!text-rose-50"
                  data-gear-gate="true"
                >
                  <SpokenPrompt
                    text={
                      planetScript(planetId, "gearLocked") ||
                      `Need ${gearGate.gear.label} to land — ${nibblesMorphTeaser(
                        gearGate.gear.label,
                        `${planetId}-gate`,
                      )}`
                    }
                    autoSpeak={false}
                    tapWords
                    compact
                    className="!gap-2"
                  />
                </div>
              ) : null}
              {isForwardLocked ? (
                <p
                  className="mt-2 rounded-xl bg-slate-700/80 px-2 py-1 text-sm text-slate-100"
                  data-ship-lock="true"
                >
                  Upgrade to {describeShipForTier(needTier).label} to go
                  forward
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
