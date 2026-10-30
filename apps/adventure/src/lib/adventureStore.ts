import { prisma } from "./db";
import {
  HOME_PLANET_ID,
  applyShipPartAward,
  emptyAdventureSnapshot,
  generateAdventureLayout,
  serializeShipParts,
  serializeStringArray,
  snapshotFromRow,
  type AdventureSnapshot,
  type ShipPartDef,
} from "./adventure";
import {
  applyBookPartEarn,
  isGlowTrailsPartId,
  serializeBookProgress,
  type BookPartEarnResult,
  type GlowTrailsPartId,
} from "./glowtrailsTidal";
import { hashChildId } from "./galaxyCatalog";
import { toSafeRunSeed } from "./runSeed";
import {
  DEFAULT_STORY_READING_BAND,
  isStoryReadingBand,
  type StoryReadingBand,
} from "./storyReadingBand";

type AdventureRow = Awaited<
  ReturnType<typeof prisma.childAdventure.findUniqueOrThrow>
>;

function layoutCreateData(childId: string, grade: string) {
  const layout = generateAdventureLayout(childId, grade);
  return {
    childId,
    planetId: layout.planetId,
    partsCollected: 0,
    shipPartsJson: "[]",
    readyToLeave: false,
    galaxyId: layout.galaxyId,
    planetOrderJson: serializeStringArray(layout.planetOrder),
    currentPlanetId: layout.currentPlanetId,
    shipTier: layout.shipTier,
    gearOwnedJson: serializeStringArray(layout.gearOwned),
    storyReadingBand: DEFAULT_STORY_READING_BAND,
    runSeed: toSafeRunSeed(hashChildId(childId)),
    bookProgressJson: "{}",
  };
}

/** Backfill iter2 layout fields on legacy ChildAdventure rows (additive). */
async function ensureLayoutFields(row: AdventureRow): Promise<AdventureRow> {
  const orderEmpty =
    !row.planetOrderJson ||
    row.planetOrderJson === "[]" ||
    row.planetOrderJson.trim() === "";
  if (!orderEmpty && row.galaxyId) return row;

  const child = await prisma.child.findUniqueOrThrow({
    where: { id: row.childId },
  });
  const layout = generateAdventureLayout(child.id, child.grade);
  return prisma.childAdventure.update({
    where: { childId: row.childId },
    data: {
      galaxyId: layout.galaxyId,
      planetOrderJson: serializeStringArray(layout.planetOrder),
      currentPlanetId:
        row.currentPlanetId || row.planetId || layout.currentPlanetId,
      planetId: row.planetId || layout.planetId,
      shipTier: row.shipTier > 0 ? row.shipTier : 1,
      gearOwnedJson: row.gearOwnedJson || "[]",
    },
  });
}

export async function getOrCreateAdventure(
  childId: string,
): Promise<AdventureRow> {
  const existing = await prisma.childAdventure.findUnique({
    where: { childId },
  });
  if (existing) {
    return ensureLayoutFields(existing);
  }

  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
  });
  return prisma.childAdventure.create({
    data: layoutCreateData(childId, child.grade),
  });
}

export async function getAdventureSnapshot(
  childId: string,
): Promise<AdventureSnapshot> {
  const row = await getOrCreateAdventure(childId);
  return snapshotFromRow(row);
}

/**
 * Award one ship part when a skill newly reaches mastery / synthetic mastery.
 * Idempotent per skillId.
 */
export async function awardShipPartForSkillMastery(
  childId: string,
  skillId: string,
): Promise<{
  awarded: boolean;
  part: ShipPartDef | null;
  newlyReady: boolean;
  snapshot: AdventureSnapshot;
}> {
  const row = await getOrCreateAdventure(childId);
  const before = snapshotFromRow(row);
  const result = applyShipPartAward(before, { skillId });
  if (!result.awarded) {
    return {
      awarded: false,
      part: null,
      newlyReady: false,
      snapshot: before,
    };
  }

  const updated = await prisma.childAdventure.update({
    where: { childId },
    data: {
      partsCollected: result.state.partsCollected,
      shipPartsJson: serializeShipParts(result.state.shipParts),
      readyToLeave: result.state.readyToLeave,
    },
  });

  return {
    awarded: true,
    part: result.part,
    newlyReady: result.newlyReady,
    snapshot: snapshotFromRow(updated),
  };
}


/** Persist placement-derived START_BAND on ChildAdventure. */
export async function setStoryReadingBand(
  childId: string,
  band: StoryReadingBand,
): Promise<AdventureSnapshot> {
  const safe = isStoryReadingBand(band) ? band : DEFAULT_STORY_READING_BAND;
  await getOrCreateAdventure(childId);
  const updated = await prisma.childAdventure.update({
    where: { childId },
    data: { storyReadingBand: safe },
  });
  return snapshotFromRow(updated);
}

export { emptyAdventureSnapshot, HOME_PLANET_ID };


/** Persist a GlowTrails Tidal book part after lesson success. Idempotent per part. */
export async function awardBookPart(
  childId: string,
  partId: string,
): Promise<
  BookPartEarnResult & {
    snapshot: AdventureSnapshot;
    partId: GlowTrailsPartId | null;
  }
> {
  if (!isGlowTrailsPartId(partId)) {
    const snapshot = await getAdventureSnapshot(childId);
    return {
      snapshot,
      partId: null,
      bookProgress: snapshot.bookProgress,
      gearOwned: snapshot.gearOwned,
      earned: false,
      alreadyHad: false,
      grantedGearId: null,
      newlyComplete: false,
    };
  }

  const row = await getOrCreateAdventure(childId);
  const before = snapshotFromRow(row);
  const result = applyBookPartEarn(
    { bookProgress: before.bookProgress, gearOwned: before.gearOwned },
    partId,
  );
  if (!result.earned && !result.newlyComplete) {
    return { ...result, snapshot: before, partId };
  }

  const updated = await prisma.childAdventure.update({
    where: { childId },
    data: {
      bookProgressJson: serializeBookProgress(result.bookProgress),
      gearOwnedJson: serializeStringArray(result.gearOwned),
    },
  });

  return {
    ...result,
    snapshot: snapshotFromRow(updated),
    partId,
  };
}
