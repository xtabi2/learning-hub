import type { Pillar } from "./constants";
import {
  DEFAULT_STORY_READING_BAND,
  isStoryReadingBand,
  type StoryReadingBand,
} from "./storyReadingBand";
import {
  emptyBookProgress,
  parseBookProgressJson,
  type BookProgress,
} from "./glowtrailsTidal";
import {
  buildPlanetOrder,
  galaxyForGrade,
  gearById,
  mapPillarsToPlanets,
  migrateOwnedGearIds,
  planetCountForChild,
  planetThemeById,
  requiredShipTierForPlanetIndex,
  shipTierDef,
  type GearDef,
  type PlanetThemeDef,
  type ShipTierDef,
} from "./galaxyCatalog";

/** Home hub catalog id (stable). Kid-facing name is Star Nook — see HOME_PLANET_NAME. */
export const HOME_PLANET_ID = "nibbles";
/** Optional hub alias for kid copy / helpers. */
export const HOME_HUB_ID = "star-nook";
/** Kid-facing home hub label (cozy dockyard moon). Not "planet Nibbles". */
export const HOME_PLANET_NAME = "Star Nook";

/** Ship parts needed at Star Nook before "ready to leave" celebration. */
export const NIBBLES_PARTS_TO_LAUNCH = 5;

export type ShipPartDef = {
  id: string;
  label: string;
  /** Kid-safe short blurb (no literacy jargon). */
  blurb: string;
};

/** Ordered catalog of spaceship parts earned at Star Nook (original fantasy only). */
export const NIBBLES_SHIP_PARTS: readonly ShipPartDef[] = [
  {
    id: "boost-thruster",
    label: "Boost Thruster",
    blurb: "Gives your ship a playful push off the pad.",
  },
  {
    id: "star-hull",
    label: "Star Hull",
    blurb: "A shiny shell that keeps space dust out.",
  },
  {
    id: "nav-crystal",
    label: "Nav Crystal",
    blurb: "Glows the way toward the next star.",
  },
  {
    id: "signal-antenna",
    label: "Signal Antenna",
    blurb: "Catches friendly radio waves from home.",
  },
  {
    id: "glow-fuel",
    label: "Glow Fuel Cell",
    blurb: "Stores bright energy for the long hop.",
  },
  {
    id: "comet-fin",
    label: "Comet Fin",
    blurb: "Helps you steer through sparkly trails.",
  },
  {
    id: "moon-window",
    label: "Moon Window",
    blurb: "A round porthole for waving at Star Nook.",
  },
  {
    id: "oxygen-tank",
    label: "Oxygen Tank",
    blurb: "Helps the ship breathe deep under the sea.",
  },
  {
    id: "dorsal-fin",
    label: "Dorsal Fin",
    blurb: "A sleek fin for steering through the waves.",
  },
  {
    id: "sonar",
    label: "Sonar",
    blurb: "Listens across the deep with a friendly ping.",
  },
] as const;

export type EarnedShipPart = {
  partId: string;
  skillId?: string;
  earnedAt: string;
};

export type AdventureSnapshot = {
  planetId: string;
  partsCollected: number;
  shipParts: EarnedShipPart[];
  readyToLeave: boolean;
  /** Iteration 2 layout fields (additive). */
  galaxyId: string;
  planetOrder: string[];
  currentPlanetId: string;
  shipTier: number;
  gearOwned: string[];
  /** Placement start band; Glowtrail planets ramp toward peak (≤ start+3, MS cap). */
  storyReadingBand: StoryReadingBand;
  /** Deterministic seed for future beat variants (N=1 OK). */
  runSeed: number;
  /** GlowTrails book: Tidal earned stickers + chapter stamp (spreadIndex / planet). */
  bookProgress: BookProgress;
};

/** Kid-facing pillar names — hide literacy competency jargon on play UI. */
export const KID_PILLAR_LABELS: Record<Pillar, string> = {
  phonemic_awareness: "Sound Scanners",
  phonics: "Letter Rockets",
  fluency: "Speed Boosters",
  vocabulary: "Word Crystals",
  comprehension: "Story Maps",
};

export function kidPillarLabel(pillar: string): string {
  return KID_PILLAR_LABELS[pillar as Pillar] ?? pillar;
}

export function parseShipPartsJson(raw: string | null | undefined): EarnedShipPart[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is EarnedShipPart => {
      return (
        Boolean(entry) &&
        typeof entry === "object" &&
        typeof (entry as EarnedShipPart).partId === "string" &&
        typeof (entry as EarnedShipPart).earnedAt === "string"
      );
    });
  } catch {
    return [];
  }
}

export function serializeShipParts(parts: EarnedShipPart[]): string {
  return JSON.stringify(parts);
}

export function shipPartDef(partId: string): ShipPartDef | undefined {
  return NIBBLES_SHIP_PARTS.find((p) => p.id === partId);
}

export function isReadyForLaunch(
  partsCollected: number,
  threshold: number = NIBBLES_PARTS_TO_LAUNCH,
): boolean {
  return partsCollected >= threshold;
}

/**
 * True when mastery flipped from not-mastered → mastered (award a ship part once).
 */
export function shouldAwardPartForMastery(
  wasMastered: boolean,
  nowMastered: boolean,
): boolean {
  return !wasMastered && nowMastered;
}

/**
 * Pure award helper: append the next catalog part if any remain and skill not already rewarded.
 * Does not mutate input.
 */
export function applyShipPartAward(
  state: AdventureSnapshot,
  options?: {
    skillId?: string;
    now?: Date;
    threshold?: number;
    catalog?: readonly ShipPartDef[];
  },
): {
  state: AdventureSnapshot;
  awarded: boolean;
  part: ShipPartDef | null;
  newlyReady: boolean;
} {
  const catalog = options?.catalog ?? NIBBLES_SHIP_PARTS;
  const threshold = options?.threshold ?? NIBBLES_PARTS_TO_LAUNCH;
  const skillId = options?.skillId;
  const earnedAt = (options?.now ?? new Date()).toISOString();

  if (skillId && state.shipParts.some((p) => p.skillId === skillId)) {
    return { state, awarded: false, part: null, newlyReady: false };
  }

  const next = catalog[state.partsCollected];
  if (!next) {
    return { state, awarded: false, part: null, newlyReady: false };
  }

  if (state.shipParts.some((p) => p.partId === next.id)) {
    return { state, awarded: false, part: null, newlyReady: false };
  }

  const shipParts = [
    ...state.shipParts,
    { partId: next.id, skillId, earnedAt },
  ];
  const partsCollected = state.partsCollected + 1;
  const wasReady = state.readyToLeave;
  const readyToLeave = isReadyForLaunch(partsCollected, threshold);

  return {
    state: {
      ...state,
      partsCollected,
      shipParts,
      readyToLeave,
    },
    awarded: true,
    part: next,
    newlyReady: !wasReady && readyToLeave,
  };
}

export function emptyAdventureSnapshot(
  planetId: string = HOME_PLANET_ID,
): AdventureSnapshot {
  return {
    planetId,
    partsCollected: 0,
    shipParts: [],
    readyToLeave: false,
    galaxyId: "galaxy-k",
    planetOrder: [planetId],
    currentPlanetId: planetId,
    shipTier: 1,
    gearOwned: [],
    storyReadingBand: DEFAULT_STORY_READING_BAND,
    runSeed: 0,
    bookProgress: emptyBookProgress(),
  };
}

export function parseStringArrayJson(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function serializeStringArray(values: string[]): string {
  return JSON.stringify(values);
}

/**
 * Deterministic per-child layout: galaxy from grade, 6–10 planets from childId seed.
 * K/1 always start on Star Nook (catalog id nibbles).
 */
export function generateAdventureLayout(
  childId: string,
  grade: string,
): Pick<
  AdventureSnapshot,
  "galaxyId" | "planetOrder" | "currentPlanetId" | "shipTier" | "gearOwned" | "planetId"
> {
  const galaxy = galaxyForGrade(grade);
  const planetOrder = buildPlanetOrder({ childId, grade });
  const currentPlanetId = planetOrder[0] ?? HOME_PLANET_ID;
  return {
    galaxyId: galaxy.id,
    planetOrder,
    currentPlanetId,
    planetId: currentPlanetId,
    shipTier: 1,
    gearOwned: [],
  };
}

export function snapshotFromRow(row: {
  planetId: string;
  partsCollected: number;
  shipPartsJson: string;
  readyToLeave: boolean;
  galaxyId?: string | null;
  planetOrderJson?: string | null;
  currentPlanetId?: string | null;
  shipTier?: number | null;
  gearOwnedJson?: string | null;
  storyReadingBand?: string | null;
  runSeed?: number | null;
  bookProgressJson?: string | null;
}): AdventureSnapshot {
  const planetOrder = parseStringArrayJson(row.planetOrderJson);
  const currentPlanetId =
    row.currentPlanetId || row.planetId || HOME_PLANET_ID;
  const bandRaw = row.storyReadingBand ?? "";
  return {
    planetId: row.planetId || currentPlanetId,
    partsCollected: row.partsCollected,
    shipParts: parseShipPartsJson(row.shipPartsJson),
    readyToLeave: row.readyToLeave,
    galaxyId: row.galaxyId || "galaxy-k",
    planetOrder:
      planetOrder.length > 0 ? planetOrder : [currentPlanetId || HOME_PLANET_ID],
    currentPlanetId,
    shipTier: row.shipTier && row.shipTier > 0 ? row.shipTier : 1,
    gearOwned: migrateOwnedGearIds(parseStringArrayJson(row.gearOwnedJson)),
    storyReadingBand: isStoryReadingBand(bandRaw)
      ? bandRaw
      : DEFAULT_STORY_READING_BAND,
    runSeed: typeof row.runSeed === "number" && row.runSeed > 0 ? row.runSeed : 0,
    bookProgress: parseBookProgressJson(row.bookProgressJson),
  };
}

export function planetIndexInOrder(
  planetOrder: string[],
  planetId: string,
): number {
  return planetOrder.indexOf(planetId);
}

/** Farthest planet index reachable with the current ship tier (0-based). */
export function farthestReachableIndex(shipTier: number): number {
  return Math.max(0, shipTier - 1);
}

/**
 * Revisit rule: any planet at or before the farthest reachable index may be opened.
 * Forward beyond that index is locked until a ship upgrade raises shipTier.
 */
export function canVisitPlanetIndex(
  targetIndex: number,
  shipTier: number,
): boolean {
  if (targetIndex < 0) return false;
  return targetIndex <= farthestReachableIndex(shipTier);
}

export function isForwardTravel(fromIndex: number, toIndex: number): boolean {
  return toIndex > fromIndex;
}

/**
 * Forward travel needs a ship tier that unlocks the destination index.
 * Revisits within the unlocked range do not need a new ship.
 */
export function canTravelToPlanet(options: {
  planetOrder: string[];
  fromPlanetId: string;
  toPlanetId: string;
  shipTier: number;
}): {
  allowed: boolean;
  reason: "ok" | "unknown_planet" | "need_ship_upgrade" | "locked";
} {
  const fromIndex = planetIndexInOrder(
    options.planetOrder,
    options.fromPlanetId,
  );
  const toIndex = planetIndexInOrder(options.planetOrder, options.toPlanetId);
  if (toIndex < 0) return { allowed: false, reason: "unknown_planet" };

  if (!canVisitPlanetIndex(toIndex, options.shipTier)) {
    const forward = isForwardTravel(fromIndex < 0 ? 0 : fromIndex, toIndex);
    return {
      allowed: false,
      reason: forward ? "need_ship_upgrade" : "locked",
    };
  }
  return { allowed: true, reason: "ok" };
}

export type GearGateResult =
  | { ok: true; gear: null }
  | { ok: false; gear: GearDef; gearId: string };

/** Stub gear gate: planet may require a unique spacesuit / environment piece. */
export function checkGearGate(
  planetId: string,
  gearOwned: readonly string[],
): GearGateResult {
  const theme = planetThemeById(planetId);
  const gearId = theme?.requiredGearId ?? null;
  if (!gearId) return { ok: true, gear: null };
  const owned = new Set(migrateOwnedGearIds(gearOwned));
  if (owned.has(gearId)) return { ok: true, gear: null };
  const gear = gearById(gearId);
  return {
    ok: false,
    gearId,
    gear: gear ?? {
      id: gearId,
      label: gearId,
      blurb: "Special gear needed to land.",
    },
  };
}

export function canLandOnPlanet(
  planetId: string,
  gearOwned: readonly string[],
): boolean {
  return checkGearGate(planetId, gearOwned).ok;
}

export function describeShipForTier(tier: number): ShipTierDef {
  return (
    shipTierDef(tier) ?? {
      tier,
      id: `ship-tier-${tier}`,
      label: `Ship Tier ${tier}`,
      blurb: "Upgrade stub hull.",
    }
  );
}

export function layoutPlanetThemes(planetOrder: string[]): PlanetThemeDef[] {
  return planetOrder
    .map((id) => planetThemeById(id))
    .filter((p): p is PlanetThemeDef => Boolean(p));
}

export {
  buildPlanetOrder,
  galaxyForGrade,
  mapPillarsToPlanets,
  planetCountForChild,
  planetThemeById,
  requiredShipTierForPlanetIndex,
  gearById,
  shipTierDef,
};

export {
  NIBBLES_CHARACTER,
  STAR_NOOK_HUB,
  galaxyScript,
  hasPlanetScripts,
  isStarNookHubId,
  kidPlanetDisplayName,
  nibblesArriveLine,
  nibblesBlockerLine,
  nibblesLines,
  nibblesMorphTeaser,
  nibblesStartLine,
  nibblesWinLine,
  pickNibblesLine,
  planetScript,
} from "./nibblesCompanion";

export {
  GLOWTRAIL_SKILL_PLANET_IDS,
  GLOWTRAIL_STORY_BEATS,
  GLOWTRAIL_PLANET_COUNT,
  isGlowtrailSkillPlanet,
} from "./galaxyCatalog";

export {
  DEFAULT_STORY_READING_BAND,
  STORY_READING_BANDS,
  bandAtGlowtrailPlanetNumber,
  clampBandToPeak,
  deriveStartBandFromPillarHits,
  deriveStartBandFromPlacementAccuracy,
  effectiveBandForPlanet,
  narrativeComplexityForBand,
  peakBand,
  peakBandIndex,
  storyReadingBandIndex,
  type StoryReadingBand,
} from "./storyReadingBand";

export {
  parseBookProgressJson,
  serializeBookProgress,
  emptyBookProgress,
  applyBookPartEarn,
  isPhase1PartId,
  PHASE1_PART_IDS,
  PHASE1_GEAR_UNLOCK_ID,
  PHASE1_GEAR_UNLOCK_PART_ID,
} from "./phase1KidsBook";
export type { BookProgress, Phase1PartId } from "./phase1KidsBook";
