/**
 * Nibbles = kid companion character (small green goo alien mechanic/guide).
 * Star Nook = home hub place name. Do not call the hub "planet Nibbles".
 */

import type { StoryReadingBand } from "./storyReadingBand";
import {
  galaxyScript,
  hasPlanetScripts,
  planetOrEmpty,
  planetScript,
  planetScriptIds,
  type GalaxyScriptBeat,
  type PlanetScriptBeat,
} from "./planetScripts";

export const NIBBLES_CHARACTER = {
  id: "nibbles-companion",
  name: "Nibbles",
  /** Kid-facing role blurb. */
  role: "ship mechanic and adventure guide",
  /** Companion portrait under /public. */
  artSrc: "/nibbles-companion.png",
  /** Fallback if companion sheet missing. */
  fallbackArtSrc: "/nibbles-avatar.png",
} as const;

/** Kid-facing home hub (cozy dockyard moon) — not a skill planet label. */
export const STAR_NOOK_HUB = {
  /** Stable catalog / DB planet id (legacy). */
  planetId: "nibbles",
  /** Optional hub alias for copy helpers. */
  hubId: "star-nook",
  displayName: "Star Nook",
  blurb:
    "Our cozy dockyard moon — the ship parks here between adventures while the Story Star stays a little dim.",
  storyStarHint:
    "The Story Star looks a little dim from here. We'll gather gear and light it back up together.",
} as const;

export type NibblesLineKind =
  | "hub_welcome"
  | "before_task"
  | "after_clear"
  | "miss_pep"
  | "blocked_gear"
  | "blocked_ship"
  | "gear_unlock"
  | "morph_teaser"
  | "story_star_hint"
  | "celebration"
  | "galaxy_arrive"
  | "map_nudge"
  | "galaxy_clear";


/** Pose pack ids under /public/adventure/nibbles/pose-<id>.png (+ -512). */
export type NibblesPoseId =
  | "guide"
  | "thumbs"
  | "cheer"
  | "spin"
  | "puddle"
  | "reach-star"
  | "tinker"
  | "oops"
  | "welcome"
  | "listen";

/** Line-kind → pose id (CW/GD locked). celebration→cheer; before_task→listen. */
const LINE_KIND_POSE: Record<NibblesLineKind, NibblesPoseId> = {
  hub_welcome: "welcome",
  before_task: "listen",
  after_clear: "thumbs",
  miss_pep: "oops",
  blocked_gear: "tinker",
  blocked_ship: "tinker",
  gear_unlock: "cheer",
  /** morph_teaser uses morph gear art when gearId known; else pose-guide. */
  morph_teaser: "guide",
  story_star_hint: "reach-star",
  celebration: "cheer",
  galaxy_arrive: "welcome",
  map_nudge: "guide",
  galaxy_clear: "cheer",
};

export function nibblesPoseIdForKind(kind: NibblesLineKind): NibblesPoseId {
  return LINE_KIND_POSE[kind];
}

/** 128 = pose-<id>.png; 512 = pose-<id>-512.png. */
export function nibblesPoseArtSrc(
  poseId: NibblesPoseId,
  size: 128 | 512 = 512,
): string {
  return size === 512
    ? `/adventure/nibbles/pose-${poseId}-512.png`
    : `/adventure/nibbles/pose-${poseId}.png`;
}

/** Morph-gear tease art when a gear id is known. */
export function nibblesMorphGearArtSrc(gearId: string): string {
  // Keep path as-is for locked CW ids; callers may pass already-canonical ids.
  return `/adventure/gear/morph-${gearId}.png`;
}

/**
 * Resolve companion portrait for a line kind.
 * Prefer 512 for banner; 128 for compact/badges.
 * morph_teaser → morph gear art when gearId known, else pose-guide.
 * Fallback portrait: NIBBLES_CHARACTER.artSrc (/nibbles-companion.png).
 */
export function nibblesCompanionArtSrc(options: {
  kind: NibblesLineKind;
  gearId?: string | null;
  size?: 128 | 512;
}): string {
  const size = options.size ?? 512;
  if (options.kind === "morph_teaser" && options.gearId) {
    return nibblesMorphGearArtSrc(options.gearId);
  }
  return nibblesPoseArtSrc(nibblesPoseIdForKind(options.kind), size);
}


const LINES: Record<NibblesLineKind, readonly string[]> = {
  hub_welcome: [
    "Welcome back to Star Nook! We'll tune the ship and pick our next hop together.",
    "Home base sweet home — Star Nook's dock is ready. We can explore whenever you are!",
  ],
  before_task: [
    "We've got this mission — I'll ride along and cheer you on.",
    "Ready when you are. We'll take it one sparkly step at a time.",
  ],
  after_clear: [
    "We cleared it! High-five goo bump!",
    "Nice work, crewmate — that part of the ship feels stronger already.",
  ],
  miss_pep: [
    "Oopsie bounce! I'll morph into a silly spring and we'll try again together.",
    "No worries — even goo guides slip. We can retry whenever you're ready.",
  ],
  blocked_gear: [
    "Our ship needs special gear before we can land safely. I'll pretend to be that gear until we unlock the real piece!",
    "That world needs a suit piece first. Morph mode on — tease gear until we earn it!",
  ],
  blocked_ship: [
    "Our hopper needs an upgrade before that forward hop. We'll earn ship parts back at Star Nook.",
    "The next lane is a stretch — let's power up the ship, then we'll fly farther.",
  ],
  gear_unlock: [
    "Real gear unlocked! I can stop morphing into that piece — you earned it!",
    "Suit upgrade complete. We are ready to land somewhere new!",
  ],
  morph_teaser: [
    "Boing! I'm a temporary gear blob until the real piece unlocks. Fancy, right?",
    "Morph-into-gear mode engaged. It's silly, but it keeps us safe for now.",
  ],
  story_star_hint: [
    "See the Story Star? It's a little dim. Our next beat might help it glow again.",
    "When you're ready, we can chase the next Story Star spark — no rush.",
  ],
  celebration: [
    "Woohoo! Celebration goo dance! We did that together!",
    "Launch lights flash — that was a sparkling clear!",
  ],
  galaxy_arrive: [galaxyScript("arrive")],
  map_nudge: [galaxyScript("map_nudge")],
  galaxy_clear: [galaxyScript("galaxy_clear")],
};

/**
 * Sample planet-flavored Nibbles lines (Mistwhisper, Sizzle Rock, Flipcliff, Sparktown).
 * Prefer planetScript() for full arrive/gear/start/win packs.
 */
export const NIBBLES_PLANET_SAMPLE_LINES: Record<string, readonly string[]> = {
  mistwhisper: [
    planetScript("mistwhisper", "arrive"),
    planetScript("mistwhisper", "win"),
  ],
  "sizzle-rock": [
    planetScript("sizzle-rock", "arrive"),
    planetScript("sizzle-rock", "win"),
  ],
  flipcliff: [
    planetScript("flipcliff", "arrive"),
    planetScript("flipcliff", "win"),
  ],
  "sparktown-dock": [
    planetScript("sparktown-dock", "arrive"),
    planetScript("sparktown-dock", "win"),
  ],
};

/**
 * Pick a deterministic companion line for a kind (stable across SSR/client for a seed).
 */
export function pickNibblesLine(
  kind: NibblesLineKind,
  seed: string | number = 0,
): string {
  const pool = LINES[kind];
  if (!pool.length) return "";
  const n =
    typeof seed === "number"
      ? Math.abs(seed)
      : Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return pool[n % pool.length]!;
}

/** All stub lines for a kind (tests / catalog). */
export function nibblesLines(kind: NibblesLineKind): readonly string[] {
  return LINES[kind];
}

/** Kid-facing planet/hub display name (maps legacy nibbles id → Star Nook). */
export function kidPlanetDisplayName(
  planetId: string,
  fallbackName?: string,
): string {
  if (planetId === STAR_NOOK_HUB.planetId || planetId === STAR_NOOK_HUB.hubId) {
    return STAR_NOOK_HUB.displayName;
  }
  return fallbackName ?? planetId;
}

export function isStarNookHubId(id: string): boolean {
  return id === STAR_NOOK_HUB.planetId || id === STAR_NOOK_HUB.hubId;
}

/**
 * Story-term blocker copy (gear/ship) — never literacy skill names.
 * Prefers planet-specific gearLocked script when planetId is known.
 */
export function nibblesBlockerLine(options: {
  reason: "need_gear" | "need_ship_upgrade" | "locked";
  gearLabel?: string;
  seed?: string | number;
  planetId?: string;
}): string {
  if (options.reason === "need_gear") {
    const planetLine = planetOrEmpty(options.planetId, "gearLocked");
    if (planetLine) return planetLine;
    const base = pickNibblesLine("blocked_gear", options.seed);
    if (options.gearLabel) {
      return `${base} We still need the ${options.gearLabel}.`;
    }
    return base;
  }
  if (options.reason === "need_ship_upgrade") {
    return pickNibblesLine("blocked_ship", options.seed);
  }
  return pickNibblesLine("blocked_ship", options.seed ?? 1);
}

/** Morph teaser when a gear piece is locked. */
export function nibblesMorphTeaser(
  gearLabel: string,
  seed: string | number = 0,
): string {
  const tease = pickNibblesLine("morph_teaser", seed);
  return `${tease} (Pretend ${gearLabel}!)`;
}

/**
 * Companion line for landing on a planet (TTS arrive beat).
 * Star Nook uses hub_welcome; Glowtrail skill planets use arrive scripts.
 */
export function nibblesArriveLine(
  planetId: string,
  seed: string | number = 0,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  if (isStarNookHubId(planetId)) {
    return pickNibblesLine("hub_welcome", seed);
  }
  const arrive = planetScript(planetId, "arrive", band, startBand);
  if (arrive) return arrive;
  return pickNibblesLine("before_task", seed);
}

/** Companion line after clearing a planet mission (TTS win beat when available). */
export function nibblesWinLine(
  planetId: string | null | undefined,
  seed: string | number = 0,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  const win = planetOrEmpty(planetId, "win", band, startBand);
  if (win) return win;
  return pickNibblesLine("celebration", seed);
}

/** Companion line at mission start on a planet (TTS start beat when available). */
export function nibblesStartLine(
  planetId: string | null | undefined,
  seed: string | number = 0,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  const start = planetOrEmpty(planetId, "start", band, startBand);
  if (start) return start;
  return pickNibblesLine("before_task", seed);
}

export {
  galaxyScript,
  hasPlanetScripts,
  planetOrEmpty,
  planetScript,
  planetScriptIds,
};
export type { GalaxyScriptBeat, PlanetScriptBeat };
