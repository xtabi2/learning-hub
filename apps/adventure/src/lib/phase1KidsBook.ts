/**
 * Phase 1 Glowtrail Adventures kids-book: copy, page model, hotspot ids,
 * and pure earn / unlock helpers. Unlock catalog stays frozen — one part
 * grants existing Mistwhisper gear `fog-lantern-helm`; the other is a
 * chapter-progress sticker only.
 */
import rawBook from "./phase1-kids-book.json";
import {
  DEFAULT_STORY_READING_BAND,
  isStoryReadingBand,
  type StoryReadingBand,
} from "./storyReadingBand";
import type { NibblesPoseId } from "./nibblesCompanion";

export const PHASE1_PART_IDS = ["boost-thruster", "comet-fin"] as const;
export type Phase1PartId = (typeof PHASE1_PART_IDS)[number];

export const PHASE1_CHAPTER_PLANET_ID = "mistwhisper";
/** Existing Mistwhisper landing gear — granted on boost-thruster lesson success. */
export const PHASE1_GEAR_UNLOCK_ID = "fog-lantern-helm";
export const PHASE1_GEAR_UNLOCK_PART_ID: Phase1PartId = "boost-thruster";
/** comet-fin is chapter-progress only (no new unlock id). */
export const PHASE1_PROGRESS_STICKER_PART_ID: Phase1PartId = "comet-fin";

export const PHASE1_BOOK_TITLE = "Glowtrail Adventures";
export const PHASE1_TURN_MS = 420;
export const PHASE1_REDUCED_MOTION_MS = 160;
export const PHASE1_HOTSPOT_MIN_PX = 64;

export const PHASE1_ART = {
  cover: "/adventure/book/cover-hub.png",
  intro: "/adventure/book/intro-spread.png",
  pageEdge: "/adventure/book/page-edge.png",
  chapter: "/adventure/book/chapter-mistwhisper.png",
} as const;

export const MISTWHISPER_LESSON_PILLAR = "phonemic_awareness";

export type BandedText = Record<StoryReadingBand, string>;
export type BandedLines = Record<StoryReadingBand, readonly string[]>;

export type Phase1KidsBookCopy = {
  phase: number;
  title: string;
  chapter1PlanetId: string;
  shipPartIds: readonly string[];
  chapterCompleteWhen: string;
  bands: readonly string[];
  cover: {
    title: string;
    byline: string;
    subtitle: BandedText;
    cta: BandedText;
  };
  intro: {
    page1_coverOpen: BandedLines;
    page2_meet: BandedLines;
    page3_quest: BandedLines;
    page4_bridge: BandedLines;
  };
  mistwhisper: {
    chapterOpen: BandedLines;
    pagePrompt: BandedLines;
    parts: Record<
      Phase1PartId,
      { kidLabel: string; find: BandedLines; earn: BandedLines }
    >;
    partMiss: BandedLines;
    chapterComplete: BandedLines;
    phase1EndNote: BandedLines;
  };
};

export const PHASE1_KIDS_BOOK = rawBook as Phase1KidsBookCopy;

export type BookProgress = {
  earnedPartIds: Phase1PartId[];
  chapterComplete: boolean;
};

export type BookPageId =
  | "cover"
  | "intro-1"
  | "intro-2"
  | "intro-3"
  | "intro-4"
  | "chapter"
  | "complete";

export const PHASE1_PAGE_ORDER: readonly BookPageId[] = [
  "cover",
  "intro-1",
  "intro-2",
  "intro-3",
  "intro-4",
  "chapter",
  "complete",
] as const;

export type Phase1HotspotSlot = {
  id: Phase1PartId;
  /** Percent of chapter-art box (gold dashed rings). */
  leftPct: number;
  topPct: number;
};

/** Slot hints from chapter-mistwhisper.png gold rings — stay above karaoke. */
export const PHASE1_HOTSPOTS: readonly Phase1HotspotSlot[] = [
  /** GD QA: ring centers on 1024 art ≈ (700,400) / (860,520). */
  { id: "boost-thruster", leftPct: 68, topPct: 50 },
  { id: "comet-fin", leftPct: 84, topPct: 65 },
];

export function isPhase1PartId(value: string): value is Phase1PartId {
  return (PHASE1_PART_IDS as readonly string[]).includes(value);
}

export function emptyBookProgress(): BookProgress {
  return { earnedPartIds: [], chapterComplete: false };
}

export function parseBookProgressJson(
  raw: string | null | undefined,
): BookProgress {
  if (!raw) return emptyBookProgress();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyBookProgress();
    const rec = parsed as { earnedPartIds?: unknown; chapterComplete?: unknown };
    const earnedPartIds = Array.isArray(rec.earnedPartIds)
      ? rec.earnedPartIds.filter((id): id is Phase1PartId =>
          typeof id === "string" && isPhase1PartId(id),
        )
      : [];
    const unique: Phase1PartId[] = [];
    for (const id of earnedPartIds) {
      if (!unique.includes(id)) unique.push(id);
    }
    const both = PHASE1_PART_IDS.every((id) => unique.includes(id));
    return {
      earnedPartIds: unique,
      chapterComplete: rec.chapterComplete === true || both,
    };
  } catch {
    return emptyBookProgress();
  }
}

export function serializeBookProgress(progress: BookProgress): string {
  return JSON.stringify({
    earnedPartIds: progress.earnedPartIds,
    chapterComplete: progress.chapterComplete,
  });
}

export function resolveStoryBand(value: string | null | undefined): StoryReadingBand {
  return isStoryReadingBand(value ?? "")
    ? value as StoryReadingBand
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

export function partKidLabel(partId: Phase1PartId): string {
  return PHASE1_KIDS_BOOK.mistwhisper.parts[partId].kidLabel;
}

export function partFindLine(partId: Phase1PartId, band: StoryReadingBand): string {
  return bandText(PHASE1_KIDS_BOOK.mistwhisper.parts[partId].find, band);
}

export function partEarnLine(partId: Phase1PartId, band: StoryReadingBand): string {
  return bandText(PHASE1_KIDS_BOOK.mistwhisper.parts[partId].earn, band);
}

export function partArtSrc(
  partId: Phase1PartId,
  earned: boolean,
): string {
  return `/adventure/book/parts/${partId}-${earned ? "earned" : "idle"}.png`;
}

export function gearUnlockForPart(partId: Phase1PartId): string | null {
  return partId === PHASE1_GEAR_UNLOCK_PART_ID ? PHASE1_GEAR_UNLOCK_ID : null;
}

export function bothPartsEarned(earnedPartIds: readonly string[]): boolean {
  return PHASE1_PART_IDS.every((id) => earnedPartIds.includes(id));
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
 * Pure award: stamp one Phase 1 part. boost-thruster grants fog-lantern-helm
 * once; comet-fin is a progress sticker only. Both parts → chapterComplete.
 */
export function applyBookPartEarn(
  input: BookPartEarnInput,
  partId: string,
): BookPartEarnResult {
  if (!isPhase1PartId(partId)) {
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

  const complete = bothPartsEarned(earnedPartIds);
  const newlyComplete = complete && !input.bookProgress.chapterComplete;

  let grantedGearId: string | null = null;
  const gearOwned = [...input.gearOwned];
  const unlock = gearUnlockForPart(partId);
  if (!alreadyHad && unlock && !gearOwned.includes(unlock)) {
    gearOwned.push(unlock);
    grantedGearId = unlock;
  }

  return {
    bookProgress: { earnedPartIds, chapterComplete: complete },
    gearOwned,
    earned: !alreadyHad,
    alreadyHad,
    grantedGearId,
    newlyComplete,
  };
}

export function poseForBookPage(page: BookPageId): NibblesPoseId {
  switch (page) {
    case "cover":
      return "welcome";
    case "intro-1":
      return "spin";
    case "intro-2":
      return "welcome";
    case "intro-3":
      return "reach-star";
    case "intro-4":
      return "guide";
    case "chapter":
      return "listen";
    case "complete":
      return "cheer";
    default:
      return "guide";
  }
}

export function pageIndex(page: BookPageId): number {
  return PHASE1_PAGE_ORDER.indexOf(page);
}

export function nextBookPage(page: BookPageId): BookPageId | null {
  const i = pageIndex(page);
  if (i < 0 || i >= PHASE1_PAGE_ORDER.length - 1) return null;
  return PHASE1_PAGE_ORDER[i + 1]!;
}

export function prevBookPage(page: BookPageId): BookPageId | null {
  const i = pageIndex(page);
  if (i <= 0) return null;
  return PHASE1_PAGE_ORDER[i - 1]!;
}

export type LessonSkillLike = {
  id: string;
  unlocked?: boolean;
  pillar?: string;
};

/** Prefer unlocked Mistwhisper pillar (phonemic_awareness), else first unlocked. */
export function pickBookLessonSkill<T extends LessonSkillLike>(
  byPillar: Record<string, T[]>,
): T | null {
  const mist = byPillar[MISTWHISPER_LESSON_PILLAR] ?? [];
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
): string {
  const book = PHASE1_KIDS_BOOK;
  switch (page) {
    case "cover":
      return [book.cover.subtitle[band], book.cover.byline].filter(Boolean).join(" ");
    case "intro-1":
      return bandText(book.intro.page1_coverOpen, band);
    case "intro-2":
      return bandText(book.intro.page2_meet, band);
    case "intro-3":
      return bandText(book.intro.page3_quest, band);
    case "intro-4":
      return bandText(book.intro.page4_bridge, band);
    case "chapter":
      return [
        bandText(book.mistwhisper.chapterOpen, band),
        bandText(book.mistwhisper.pagePrompt, band),
      ].join(" ");
    case "complete":
      return [
        bandText(book.mistwhisper.chapterComplete, band),
        bandText(book.mistwhisper.phase1EndNote, band),
      ].join(" ");
    default:
      return "";
  }
}

export function coverCta(band: StoryReadingBand): string {
  return PHASE1_KIDS_BOOK.cover.cta[band] ?? "Open the book";
}
