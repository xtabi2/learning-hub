/**
 * GlowTrails Tidal v1 — canonical copy, part catalog, progress, art paths.
 * Kid path uses this cut (Story Tree → GlowTrails → Tidal). Phase 1 Mistwhisper
 * helpers remain in phase1KidsBook.ts unused on the kid homepage until retired.
 */
import rawBook from "./glowtrails-tidal-v1.json";
import {
  DEFAULT_STORY_READING_BAND,
  isStoryReadingBand,
  type StoryReadingBand,
} from "./storyReadingBand";
import type { NibblesPoseId } from "./nibblesCompanion";

export const GLOWTRAILS_PART_IDS = [
  "oxygen-tank",
  "dorsal-fin",
  "sonar",
] as const;
export type GlowTrailsPartId = (typeof GLOWTRAILS_PART_IDS)[number];

export const GLOWTRAILS_FIRST_PLANET_ID = "tidal";
export const GLOWTRAILS_BOOK_ID = "glowtrails";
export const GLOWTRAILS_BOOK_TITLE = "GlowTrails";
export const GLOWTRAILS_HINT_AFTER_MS = 180_000;
export const GLOWTRAILS_HOTSPOT_MIN_PX = 64;
export const GLOWTRAILS_TURN_MS = 420;
export const GLOWTRAILS_REDUCED_MOTION_MS = 160;

/** Kid-facing ship stickers for Tidal — no new literacy gear unlocks. */
export const GLOWTRAILS_SHIP_PARTS = [
  {
    id: "oxygen-tank" as const,
    label: "Oxygen Tank",
    blurb: "Helps the ship breathe deep under the sea.",
  },
  {
    id: "dorsal-fin" as const,
    label: "Dorsal Fin",
    blurb: "A sleek fin for steering through the waves.",
  },
  {
    id: "sonar" as const,
    label: "Sonar",
    blurb: "Listens across the deep with a friendly ping.",
  },
] as const;

/** Paths match public/adventure/glowtrails/README.md (PR #27 GD art). */
export const GLOWTRAILS_ART = {
  treeHome: "/adventure/glowtrails/tree-home.png",
  fruitGlowTrails: "/adventure/glowtrails/fruit-glowtrails.png",
  shipChrome: "/adventure/glowtrails/hud-ship.png",
  starMap: "/adventure/glowtrails/hud-starmap.png",
  spread: (partId: GlowTrailsPartId) =>
    `/adventure/glowtrails/tidal/spread-${partId}.png`,
  part: (partId: GlowTrailsPartId, state: "idle" | "earned") =>
    `/adventure/glowtrails/parts/${partId}-${state}.png`,
} as const;

/** Soft-hit fruit on Story Tree home (1024 art). */
export const GLOWTRAILS_TREE_FRUIT_HIT = {
  leftPct: 49,
  topPct: 47,
} as const;

/** Soft find-it slots from GD README — no gold rings; ≥64px targets. */
export const GLOWTRAILS_HOTSPOTS: readonly {
  id: GlowTrailsPartId;
  leftPct: number;
  topPct: number;
}[] = [
  { id: "oxygen-tank", leftPct: 60, topPct: 68 },
  { id: "dorsal-fin", leftPct: 54, topPct: 38 },
  { id: "sonar", leftPct: 73, topPct: 72 },
];

export type BandedText = Record<StoryReadingBand, string>;
export type BandedLines = Record<StoryReadingBand, readonly string[]>;

export type GlowTrailsCopy = {
  bookId: string;
  fruitLabel: string;
  title: string;
  firstPlanetId: string;
  firstPlanetKidName: string;
  partOrder: readonly string[];
  hintAfterMs: number;
  bands: readonly string[];
  tree: {
    homeLine: BandedText;
    fruitGlowTrails: BandedText;
  };
  hud: {
    goToShip: BandedText;
    treeControl: BandedText;
    shipExit: BandedText;
    mapTitle: BandedText;
    tidalMissionLabels: Record<GlowTrailsPartId, BandedText>;
    tidalPlanetChip: BandedText;
  };
  intro: {
    page1_open: BandedLines;
    page2_meet: BandedLines;
    page3_quest: BandedLines;
    page4_bridge: BandedLines;
  };
  tidal: {
    chapterOpen: BandedLines;
    spreads: Record<
      GlowTrailsPartId,
      {
        kidLabel: string;
        partId: string;
        overview: BandedLines;
        hint: BandedLines;
        find: BandedLines;
        earn: BandedLines;
      }
    >;
    partMiss: BandedLines;
    chapterComplete: BandedLines;
  };
};

export const GLOWTRAILS_TIDAL = rawBook as GlowTrailsCopy;

export type BookProgress = {
  earnedPartIds: GlowTrailsPartId[];
  chapterComplete: boolean;
  /** 0-based index into partOrder for the active find-it spread. */
  spreadIndex: number;
  currentPlanetId: string;
};

export type BookPageId =
  | "intro-1"
  | "intro-2"
  | "intro-3"
  | "intro-4"
  | "chapter-open"
  | "spread"
  | "complete";

export const GLOWTRAILS_PAGE_ORDER: readonly BookPageId[] = [
  "intro-1",
  "intro-2",
  "intro-3",
  "intro-4",
  "chapter-open",
  "spread",
  "complete",
] as const;

export function isGlowTrailsPartId(value: string): value is GlowTrailsPartId {
  return (GLOWTRAILS_PART_IDS as readonly string[]).includes(value);
}

export function emptyBookProgress(): BookProgress {
  return {
    earnedPartIds: [],
    chapterComplete: false,
    spreadIndex: 0,
    currentPlanetId: GLOWTRAILS_FIRST_PLANET_ID,
  };
}

export function parseBookProgressJson(
  raw: string | null | undefined,
): BookProgress {
  if (!raw) return emptyBookProgress();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyBookProgress();
    const rec = parsed as {
      earnedPartIds?: unknown;
      chapterComplete?: unknown;
      spreadIndex?: unknown;
      currentPlanetId?: unknown;
    };
    const earnedPartIds = Array.isArray(rec.earnedPartIds)
      ? rec.earnedPartIds.filter(
          (id): id is GlowTrailsPartId =>
            typeof id === "string" && isGlowTrailsPartId(id),
        )
      : [];
    const unique: GlowTrailsPartId[] = [];
    for (const id of earnedPartIds) {
      if (!unique.includes(id)) unique.push(id);
    }
    const allParts = GLOWTRAILS_PART_IDS.every((id) => unique.includes(id));
    const spreadIndex =
      typeof rec.spreadIndex === "number" &&
      Number.isFinite(rec.spreadIndex) &&
      rec.spreadIndex >= 0
        ? Math.min(
            Math.floor(rec.spreadIndex),
            GLOWTRAILS_PART_IDS.length - 1,
          )
        : nextSpreadIndex(unique);
    const currentPlanetId =
      typeof rec.currentPlanetId === "string" && rec.currentPlanetId
        ? rec.currentPlanetId
        : GLOWTRAILS_FIRST_PLANET_ID;
    return {
      earnedPartIds: unique,
      chapterComplete: rec.chapterComplete === true || allParts,
      spreadIndex,
      currentPlanetId,
    };
  } catch {
    return emptyBookProgress();
  }
}

export function serializeBookProgress(progress: BookProgress): string {
  return JSON.stringify({
    earnedPartIds: progress.earnedPartIds,
    chapterComplete: progress.chapterComplete,
    spreadIndex: progress.spreadIndex,
    currentPlanetId: progress.currentPlanetId || GLOWTRAILS_FIRST_PLANET_ID,
  });
}

/** First unearned part index, or last index when all earned. */
export function nextSpreadIndex(earnedPartIds: readonly string[]): number {
  const idx = GLOWTRAILS_PART_IDS.findIndex((id) => !earnedPartIds.includes(id));
  return idx < 0 ? GLOWTRAILS_PART_IDS.length - 1 : idx;
}

export function activePartId(progress: BookProgress): GlowTrailsPartId {
  return (
    GLOWTRAILS_PART_IDS[progress.spreadIndex] ?? GLOWTRAILS_PART_IDS[0]!
  );
}

export function allPartsEarned(earnedPartIds: readonly string[]): boolean {
  return GLOWTRAILS_PART_IDS.every((id) => earnedPartIds.includes(id));
}

export function resolveStoryBand(
  value: string | null | undefined,
): StoryReadingBand {
  return isStoryReadingBand(value ?? "")
    ? (value as StoryReadingBand)
    : DEFAULT_STORY_READING_BAND;
}

export function bandText(
  byBand: BandedText | BandedLines,
  band: StoryReadingBand,
): string {
  const raw = byBand[band] ?? byBand.emerging;
  if (typeof raw === "string") return raw;
  return raw.join(" ");
}

export function bandLines(
  byBand: BandedLines,
  band: StoryReadingBand,
): string[] {
  const raw = byBand[band] ?? byBand.emerging;
  return [...raw];
}

export function partKidLabel(partId: GlowTrailsPartId): string {
  return GLOWTRAILS_TIDAL.tidal.spreads[partId].kidLabel;
}

export function partOverviewLine(
  partId: GlowTrailsPartId,
  band: StoryReadingBand,
): string {
  return bandText(GLOWTRAILS_TIDAL.tidal.spreads[partId].overview, band);
}

export function partHintLine(
  partId: GlowTrailsPartId,
  band: StoryReadingBand,
): string {
  return bandText(GLOWTRAILS_TIDAL.tidal.spreads[partId].hint, band);
}

export function partFindLine(
  partId: GlowTrailsPartId,
  band: StoryReadingBand,
): string {
  return bandText(GLOWTRAILS_TIDAL.tidal.spreads[partId].find, band);
}

export function partEarnLine(
  partId: GlowTrailsPartId,
  band: StoryReadingBand,
): string {
  return bandText(GLOWTRAILS_TIDAL.tidal.spreads[partId].earn, band);
}

export function partArtSrc(
  partId: GlowTrailsPartId,
  earned: boolean,
): string {
  return GLOWTRAILS_ART.part(partId, earned ? "earned" : "idle");
}

export function partOverviewArtSrc(partId: GlowTrailsPartId): string {
  // GD ships idle/earned only; idle doubles as overview match thumb.
  return GLOWTRAILS_ART.part(partId, "idle");
}

export function spreadArtSrc(partId: GlowTrailsPartId): string {
  return GLOWTRAILS_ART.spread(partId);
}

export type BookPartEarnInput = {
  bookProgress: BookProgress;
  gearOwned: readonly string[];
};

export type BookPartEarnResult = {
  bookProgress: BookProgress;
  gearOwned: string[];
  earned: boolean;
  alreadyHad: boolean;
  grantedGearId: string | null;
  newlyComplete: boolean;
};

/**
 * Pure award: stamp one Tidal ship sticker. No literacy gear unlocks for this cut.
 */
export function applyBookPartEarn(
  input: BookPartEarnInput,
  partId: string,
): BookPartEarnResult {
  if (!isGlowTrailsPartId(partId)) {
    return {
      bookProgress: input.bookProgress,
      gearOwned: [...input.gearOwned],
      earned: false,
      alreadyHad: false,
      grantedGearId: null,
      newlyComplete: false,
    };
  }

  const alreadyHad = input.bookProgress.earnedPartIds.includes(partId);
  const earnedPartIds = alreadyHad
    ? [...input.bookProgress.earnedPartIds]
    : [...input.bookProgress.earnedPartIds, partId];

  const complete = allPartsEarned(earnedPartIds);
  const newlyComplete = complete && !input.bookProgress.chapterComplete;
  const spreadIndex = nextSpreadIndex(earnedPartIds);

  return {
    bookProgress: {
      earnedPartIds,
      chapterComplete: complete,
      spreadIndex,
      currentPlanetId:
        input.bookProgress.currentPlanetId || GLOWTRAILS_FIRST_PLANET_ID,
    },
    gearOwned: [...input.gearOwned],
    earned: !alreadyHad,
    alreadyHad,
    grantedGearId: null,
    newlyComplete,
  };
}

export function poseForBookPage(page: BookPageId): NibblesPoseId {
  switch (page) {
    case "intro-1":
      return "spin";
    case "intro-2":
      return "welcome";
    case "intro-3":
      return "reach-star";
    case "intro-4":
      return "guide";
    case "chapter-open":
      return "listen";
    case "spread":
      return "listen";
    case "complete":
      return "cheer";
    default:
      return "guide";
  }
}

export function pageIndex(page: BookPageId): number {
  return GLOWTRAILS_PAGE_ORDER.indexOf(page);
}

export function nextBookPage(page: BookPageId): BookPageId | null {
  const i = pageIndex(page);
  if (i < 0 || i >= GLOWTRAILS_PAGE_ORDER.length - 1) return null;
  return GLOWTRAILS_PAGE_ORDER[i + 1]!;
}

export function prevBookPage(page: BookPageId): BookPageId | null {
  const i = pageIndex(page);
  if (i <= 0) return null;
  return GLOWTRAILS_PAGE_ORDER[i - 1]!;
}

export type LessonSkillLike = {
  id: string;
  unlocked?: boolean;
  pillar?: string;
};

/** Prefer unlocked phonemic_awareness (Sound Scanners), else first unlocked. */
export function pickBookLessonSkill<T extends LessonSkillLike>(
  byPillar: Record<string, T[]>,
): T | null {
  const mist = byPillar.phonemic_awareness ?? [];
  const unlockedMist = mist.find((s) => s.unlocked !== false);
  if (unlockedMist) return unlockedMist;
  for (const list of Object.values(byPillar)) {
    const hit = list.find((s) => s.unlocked);
    if (hit) return hit;
  }
  return mist[0] ?? Object.values(byPillar).flat()[0] ?? null;
}

export function karaokeForPage(
  page: BookPageId,
  band: StoryReadingBand,
  progress: BookProgress,
): string {
  const book = GLOWTRAILS_TIDAL;
  switch (page) {
    case "intro-1":
      return bandText(book.intro.page1_open, band);
    case "intro-2":
      return bandText(book.intro.page2_meet, band);
    case "intro-3":
      return bandText(book.intro.page3_quest, band);
    case "intro-4":
      return bandText(book.intro.page4_bridge, band);
    case "chapter-open":
      return bandText(book.tidal.chapterOpen, band);
    case "spread": {
      const partId = activePartId(progress);
      return partOverviewLine(partId, band);
    }
    case "complete":
      return bandText(book.tidal.chapterComplete, band);
    default:
      return "";
  }
}

export function hintAfterMs(): number {
  return GLOWTRAILS_TIDAL.hintAfterMs || GLOWTRAILS_HINT_AFTER_MS;
}

export function missionLabel(
  partId: GlowTrailsPartId,
  band: StoryReadingBand,
): string {
  return bandText(GLOWTRAILS_TIDAL.hud.tidalMissionLabels[partId], band);
}
