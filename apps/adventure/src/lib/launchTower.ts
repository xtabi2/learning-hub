/**
 * Launch Tower book picker config (replaces the Story Tree home).
 * Pure + data-driven: add a book by appending to TOWER_BOOKS with a level.
 */
import type { StoryReadingBand } from "./storyReadingBand";

export type TowerLevelId = "ground" | "2" | "3" | "4" | "final";

export type TowerLevel = {
  id: TowerLevelId;
  /** Kid-facing floor label. Top floor is "Final", never "5th". */
  label: string;
  /** Reading band of books on this floor (higher floors = harder books). */
  band: StoryReadingBand | "stretch";
};

export const TOWER_LEVELS: readonly TowerLevel[] = [
  { id: "ground", label: "Ground", band: "emerging" },
  { id: "2", label: "2", band: "early" },
  { id: "3", label: "3", band: "growing" },
  { id: "4", label: "4", band: "fluent-ms" },
  { id: "final", label: "Final", band: "stretch" },
] as const;

export const GROUND_LEVEL_INDEX = 0;
export const TOP_LEVEL_INDEX = TOWER_LEVELS.length - 1;

export type TowerBook = {
  id: string;
  title: string;
  level: TowerLevelId;
  /** Path under /play/[childId]. */
  path: string;
  /** Placeholder cover colors when no art file is present. */
  colors: [string, string];
  emoji: string;
};

export const TOWER_BOOKS: readonly TowerBook[] = [
  {
    id: "glowtrails-tidal",
    title: "GlowTrails",
    level: "ground",
    path: "book",
    colors: ["#38bdf8", "#a78bfa"],
    emoji: "🌊",
  },
];

export function clampLevel(index: number): number {
  if (!Number.isFinite(index)) return GROUND_LEVEL_INDEX;
  return Math.max(GROUND_LEVEL_INDEX, Math.min(TOP_LEVEL_INDEX, Math.trunc(index)));
}

export function canGoUp(index: number): boolean {
  return clampLevel(index) < TOP_LEVEL_INDEX;
}
export function canGoDown(index: number): boolean {
  return clampLevel(index) > GROUND_LEVEL_INDEX;
}

export function booksForLevel(
  level: TowerLevelId,
  books: readonly TowerBook[] = TOWER_BOOKS,
): TowerBook[] {
  return books.filter((b) => b.level === level);
}

export function bookHref(childId: string, book: TowerBook): string {
  return `/play/${childId}/${book.path}`;
}

/** Single narration line, same on every floor (Creative Writer). */
export const TOWER_HOME_LINE = "Ride the elevator and tap a book to blast off!";

/** Optional art dropped in by the Graphics Designer (checked on the server). */
export const TOWER_ART_DIR = "/adventure/tower";
export const TOWER_ART = {
  ground: `${"/adventure/tower"}/tower-ground.png`,
  floor: `${"/adventure/tower"}/tower-floor.png`,
  final: `${"/adventure/tower"}/tower-final.png`,
  car: `${"/adventure/tower"}/elevator-car.png`,
  up: `${"/adventure/tower"}/elevator-button-up.png`,
  down: `${"/adventure/tower"}/elevator-button-down.png`,
} as const;

/** Ground uses the launch pad, Final the rocket nose, 2–4 reuse the floor tile. */
export function levelArt(id: TowerLevelId): string {
  return id === "ground" ? TOWER_ART.ground : id === "final" ? TOWER_ART.final : TOWER_ART.floor;
}
export function bookCoverFile(bookId: string): string {
  return `book-${bookId}.png`;
}

export type TowerCovers = Record<string, string>;
