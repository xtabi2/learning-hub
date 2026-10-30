import type { Grade, Pillar } from "./constants";
import { GRADES, PILLARS } from "./constants";

/** Galaxy = one grade band (K–3). */
export type GalaxyDef = {
  id: string;
  grade: Grade;
  /** Kid-facing fantasy name (no literacy jargon / no grade label). */
  name: string;
  blurb: string;
  /** CSS accent hue hint for map chips. */
  accent: string;
};

export type GearDef = {
  id: string;
  label: string;
  blurb: string;
};

export type PlanetThemeDef = {
  id: string;
  name: string;
  /** Kid-facing fantasy theme loosely matching literacy practice. */
  themeBlurb: string;
  /** Parent-only competency hint — never shown on kid UI. */
  parentPillarHint: Pillar;
  /**
   * Parent-only skill focus note (Creative Writer bible).
   * Never render on kid play screens — parent metadata / comments only.
   */
  parentSkillNote: string;
  /** Required environment / spacesuit piece to land (null = open landing). */
  requiredGearId: string | null;
  /** Placeholder art under /public/adventure/ */
  artSrc: string;
  /** Optional Nibbles morph gag for locked gear (kid-facing). */
  nibblesMorphHint?: string;
  /** Optional morph art asset id (CW+GD locked; e.g. hush-scarf on Softsnow). */
  morphArtId?: string;
};

export type ShipTierDef = {
  tier: number;
  id: string;
  label: string;
  blurb: string;
};

/**
 * Galaxies by grade. Kid UI shows fantasy names only — never "Grade K" etc.
 * First stretch (starting / K band) = Glowtrail Galaxy toward Story Star.
 */
export const GALAXIES: readonly GalaxyDef[] = [
  {
    id: "galaxy-k",
    grade: "K",
    name: "Glowtrail Galaxy",
    blurb:
      "Tiny lights, big sky — first stretch toward the Story Star. Clear planets to help it smile.",
    accent: "#38bdf8",
  },
  {
    id: "galaxy-1",
    grade: "1",
    name: "Little Comet Galaxy",
    blurb: "Bright comet lanes for growing space crews.",
    accent: "#a78bfa",
  },
  {
    id: "galaxy-2",
    grade: "2",
    name: "Story Drift Galaxy",
    blurb: "Drift islands packed with longer quests.",
    accent: "#34d399",
  },
  {
    id: "galaxy-3",
    grade: "3",
    name: "Signal Forge Galaxy",
    blurb: "Busy signal yards for bold chart readers.",
    accent: "#fbbf24",
  },
] as const;

/** Glowtrail / first-galaxy environment gear (original cartoon; no IP). */
/**
 * CW+GD locked gear ids (v1). Legacy encode ids remapped via GEAR_ID_ALIASES.
 */
export const GEAR_CATALOG: readonly GearDef[] = [
  {
    id: "fog-lantern-helm",
    label: "Fog Lantern Helm",
    blurb: "Soft lantern light for shy fog worlds.",
  },
  {
    id: "spring-boots",
    label: "Spring Boots",
    blurb: "Boingy boots for bouncing sentence paths.",
  },
  {
    id: "echo-headphones",
    label: "Echo Headphones",
    blurb: "Catch wrong echoes before they giggle-collapse.",
  },
  {
    id: "scuba-bubble",
    label: "Scuba Bubble",
    blurb: "Bubble gear (and fishbowl helmet vibes) for deep chats.",
  },
  {
    id: "fire-suit",
    label: "Fire Suit",
    blurb: "Shiny heat shield for sizzle trails.",
  },
  {
    id: "sticky-boots",
    label: "Sticky Boots",
    blurb: "Stick to upside-down cliffs — no space-dropping.",
  },
  {
    id: "hush-scarf",
    label: "Hush Scarf",
    blurb: "Soft hush scarf for sleepy snow worlds.",
  },
  {
    id: "sorter-mitts",
    label: "Sorter Mitts",
    blurb: "Sort spark mail for busy dockbots.",
  },
] as const;

/** Old encode ids → CW+GD locked ids (migrate ownedGear on read). */
export const GEAR_ID_ALIASES: Readonly<Record<string, string>> = {
  "glow-lantern": "fog-lantern-helm",
  "scuba-bubbles": "scuba-bubble",
  "hush-soft-gear": "hush-scarf",
  "echo-scoop": "echo-headphones",
  "hush-muffs": "hush-scarf",
  "sorter-gloves": "sorter-mitts",
};

export function canonicalizeGearId(id: string): string {
  return GEAR_ID_ALIASES[id] ?? id;
}

/** Dedupe + remap legacy gear ids stored in adventure state. */
export function migrateOwnedGearIds(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    const next = canonicalizeGearId(id);
    if (seen.has(next)) continue;
    seen.add(next);
    out.push(next);
  }
  return out;
}

/**
 * Ordered theme pool for Glowtrail (first galaxy) + shared layouts.
 * Star Nook (id nibbles) stays first for K/1 layouts.
 * Eight skill planets from Creative Writer bible — kid hooks only in themeBlurb.
 * parentSkillNote / parentPillarHint are parent-only metadata.
 */
export const PLANET_THEME_POOL: readonly PlanetThemeDef[] = [
  {
    id: "nibbles",
    name: "Star Nook",
    themeBlurb:
      "Cozy dockyard moon — home base where the ship parks between adventures.",
    parentPillarHint: "phonemic_awareness",
    parentSkillNote: "Home hub — ship parts / launch prep (not a skill planet).",
    requiredGearId: null,
    artSrc: "/adventure/star-nook.png",
  },
  {
    id: "mistwhisper",
    name: "Mistwhisper",
    themeBlurb: "Foggy world where shy words hide until a soft light finds them.",
    parentPillarHint: "phonemic_awareness",
    parentSkillNote: "Early word recognition.",
    requiredGearId: "fog-lantern-helm",
    artSrc: "/adventure/planet-mistwhisper.png",
    nibblesMorphHint: "lantern",
  },
  {
    id: "bouncebloom",
    name: "Bouncebloom",
    themeBlurb: "Springy paths where sentences bounce — hop soft, land big.",
    parentPillarHint: "fluency",
    parentSkillNote: "Fluency.",
    requiredGearId: "spring-boots",
    artSrc: "/adventure/planet-bouncebloom.png",
    nibblesMorphHint: "spring",
  },
  {
    id: "echo-canyon",
    name: "Echo Canyon",
    themeBlurb: "Cliffs that copy you wrong on purpose — catch the silly echoes.",
    parentPillarHint: "phonemic_awareness",
    parentSkillNote: "Phonological awareness.",
    requiredGearId: "echo-headphones",
    artSrc: "/adventure/planet-echo-canyon.png",
    nibblesMorphHint: "echo headphones",
  },
  {
    id: "bubbledeep",
    name: "Bubbledeep",
    themeBlurb: "Chatty bubbles everywhere — match them before they pop into sparkles.",
    parentPillarHint: "vocabulary",
    parentSkillNote: "Vocabulary.",
    requiredGearId: "scuba-bubble",
    artSrc: "/adventure/planet-bubbledeep.png",
    nibblesMorphHint: "fishbowl helmet",
  },
  {
    id: "sizzle-rock",
    name: "Sizzle Rock",
    themeBlurb: "Hot lava trails — say the line out loud to cool the path.",
    parentPillarHint: "fluency",
    parentSkillNote: "Oral reading.",
    requiredGearId: "fire-suit",
    artSrc: "/adventure/planet-sizzle-rock.png",
    nibblesMorphHint: "fire suit",
  },
  {
    id: "flipcliff",
    name: "Flipcliff",
    themeBlurb: "Upside-down world — stick to the trail and follow the signs.",
    parentPillarHint: "phonics",
    parentSkillNote: "Directionality.",
    requiredGearId: "sticky-boots",
    artSrc: "/adventure/planet-flipcliff.png",
    nibblesMorphHint: "sticky boots",
  },
  {
    id: "softsnow-drift",
    name: "Softsnow Drift",
    themeBlurb: "Hush planet of sleepy story-snowflakes — tiptoe voice, gentle words.",
    parentPillarHint: "phonics",
    parentSkillNote: "Careful decoding.",
    requiredGearId: "hush-scarf",
    artSrc: "/adventure/planet-softsnow-drift.png",
    nibblesMorphHint: "hush scarf",
    morphArtId: "hush-scarf",
  },
  {
    id: "sparktown-dock",
    name: "Sparktown Dock",
    themeBlurb:
      "Busy dockbots and spark mail — sort the right spark into the right box.",
    parentPillarHint: "comprehension",
    parentSkillNote: "Mixed review / galaxy clear gate.",
    requiredGearId: "sorter-mitts",
    artSrc: "/adventure/planet-sparktown-dock.png",
    nibblesMorphHint: "sorter mitts",
  },
] as const;

/** Fixed Glowtrail skill-planet order (hub excluded). Clear all 8 → Story Star brightens. */
export const GLOWTRAIL_SKILL_PLANET_IDS: readonly string[] = [
  "mistwhisper",
  "bouncebloom",
  "echo-canyon",
  "bubbledeep",
  "sizzle-rock",
  "flipcliff",
  "softsnow-drift",
  "sparktown-dock",
] as const;

/**
 * Story beat stubs (kid-facing outcomes; implementation hooks later).
 * Forward past Sparktown needs a ship upgrade; revisit stays free within unlocked range.
 */
export const GLOWTRAIL_STORY_BEATS = {
  id: "glowtrail",
  galaxyId: "galaxy-k",
  clearAllBrightensStoryStar: true,
  pathToNextGalaxyAfterClear: true,
  revisitFree: true,
  /** Forward travel after Sparktown Dock needs ship upgrade. */
  forwardAfterSparktownNeedsShipUpgrade: true,
  sparktownPlanetId: "sparktown-dock",
  nibblesCelebrationStub:
    "Glowtrail complete! Look—Story Star smiled a little. New sky ahead.",
} as const;

/** Ship upgrade stubs — cartoon hulls, not food art. */
export const SHIP_TIERS: readonly ShipTierDef[] = [
  {
    tier: 1,
    id: "nibbles-hopper",
    label: "Star Nook Hopper",
    blurb: "Starter pad hopper for short hops from Star Nook.",
  },
  {
    tier: 2,
    id: "comet-skiff",
    label: "Comet Skiff",
    blurb: "Sleek skiff for the next planet lane.",
  },
  {
    tier: 3,
    id: "nebula-cruiser",
    label: "Nebula Cruiser",
    blurb: "Roomy cruiser with twin glow fins.",
  },
  {
    tier: 4,
    id: "quasar-clipper",
    label: "Quasar Clipper",
    blurb: "Fast clipper for longer galaxy legs.",
  },
  {
    tier: 5,
    id: "signal-galleon",
    label: "Signal Galleon",
    blurb: "Big deck ship for charting whole galaxies.",
  },
  {
    tier: 6,
    id: "aurora-ark",
    label: "Aurora Ark",
    blurb: "Aurora-lit ark for deep map runs.",
  },
  {
    tier: 7,
    id: "pulsar-barge",
    label: "Pulsar Barge",
    blurb: "Steady barge for heavy gear hauls.",
  },
  {
    tier: 8,
    id: "orbit-outrunner",
    label: "Orbit Outrunner",
    blurb: "Outrunner built for multi-planet revisits.",
  },
  {
    tier: 9,
    id: "helix-hauler",
    label: "Helix Hauler",
    blurb: "Spiral hauler for far-rim quests.",
  },
  {
    tier: 10,
    id: "cosmos-carrier",
    label: "Cosmos Carrier",
    blurb: "Top stub carrier for a full galaxy tour.",
  },
] as const;

export const MIN_PLANETS_PER_GALAXY = 6;
export const MAX_PLANETS_PER_GALAXY = 10;
/** Glowtrail first-galaxy layout size: Star Nook hub + 8 skill planets. */
export const GLOWTRAIL_PLANET_COUNT = 1 + GLOWTRAIL_SKILL_PLANET_IDS.length;

export function galaxyForGrade(grade: string): GalaxyDef {
  const match = GALAXIES.find((g) => g.grade === grade);
  return match ?? GALAXIES[0];
}

export function galaxyById(id: string): GalaxyDef | undefined {
  return GALAXIES.find((g) => g.id === id);
}

export function planetThemeById(id: string): PlanetThemeDef | undefined {
  return PLANET_THEME_POOL.find((p) => p.id === id);
}

export function gearById(id: string): GearDef | undefined {
  const canonical = canonicalizeGearId(id);
  return GEAR_CATALOG.find((g) => g.id === canonical);
}

export function shipTierDef(tier: number): ShipTierDef | undefined {
  return SHIP_TIERS.find((s) => s.tier === tier);
}

/** FNV-1a style hash → unsigned 32-bit for deterministic layout seeds. */
export function hashChildId(childId: string): number {
  let h = 2166136261;
  for (let i = 0; i < childId.length; i += 1) {
    h ^= childId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Planet count algorithm: deterministic 6–10 from childId hash.
 * Clamped to available theme pool size.
 */
export function planetCountForChild(childId: string): number {
  const maxAvailable = PLANET_THEME_POOL.length;
  const span = MAX_PLANETS_PER_GALAXY - MIN_PLANETS_PER_GALAXY + 1;
  const raw = MIN_PLANETS_PER_GALAXY + (hashChildId(childId) % span);
  return Math.min(maxAvailable, Math.max(MIN_PLANETS_PER_GALAXY, raw));
}

/**
 * Build an ordered planet id list for a child.
 * Glowtrail (grade K): fixed Star Nook + 8 bible planets.
 * Grades K/1 always start on Star Nook (catalog id nibbles). Grades 2–3 may still
 * include that hub when the seed picks it early, but do not force it first.
 */
export function buildPlanetOrder(options: {
  childId: string;
  grade: string;
  count?: number;
}): string[] {
  // First-galaxy (Glowtrail / K): fixed bible order — hub + all 8 skill planets.
  if (options.grade === "K") {
    return ["nibbles", ...GLOWTRAIL_SKILL_PLANET_IDS];
  }

  const count = options.count ?? planetCountForChild(options.childId);
  const maxAvailable = PLANET_THEME_POOL.length;
  const clamped = Math.min(
    maxAvailable,
    Math.min(MAX_PLANETS_PER_GALAXY, Math.max(MIN_PLANETS_PER_GALAXY, count)),
  );
  const forceNibblesFirst = options.grade === "1";
  const seed = hashChildId(options.childId);
  const pool = PLANET_THEME_POOL.filter((p) =>
    forceNibblesFirst ? p.id !== "nibbles" : true,
  );

  // Deterministic shuffle of the remaining pool.
  const shuffled = [...pool];
  let state = seed || 1;
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  const picked = forceNibblesFirst
    ? ["nibbles", ...shuffled.slice(0, clamped - 1).map((p) => p.id)]
    : shuffled.slice(0, clamped).map((p) => p.id);

  return picked;
}

/**
 * Split progressive pillars across the planet list (parent-facing mapping helper).
 * Kids never see pillar names — only planet themes.
 */
export function mapPillarsToPlanets(planetIds: string[]): Array<{
  planetId: string;
  pillar: Pillar;
  parentPillarLabelKey: Pillar;
  parentSkillNote?: string;
}> {
  return planetIds.map((planetId, index) => {
    const theme = planetThemeById(planetId);
    const pillar =
      theme?.parentPillarHint ?? PILLARS[index % PILLARS.length];
    return {
      planetId,
      pillar,
      parentPillarLabelKey: pillar,
      parentSkillNote: theme?.parentSkillNote,
    };
  });
}

/** Ship tier required to travel forward TO this planet index (0-based). */
export function requiredShipTierForPlanetIndex(index: number): number {
  return Math.max(1, index + 1);
}

export function isValidGrade(grade: string): grade is Grade {
  return (GRADES as readonly string[]).includes(grade);
}

/** True when id is one of the eight Glowtrail skill planets (not Star Nook). */
export function isGlowtrailSkillPlanet(id: string): boolean {
  return (GLOWTRAIL_SKILL_PLANET_IDS as readonly string[]).includes(id);
}
