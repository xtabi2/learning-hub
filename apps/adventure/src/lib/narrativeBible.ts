/**
* Reserved modular narrative bible shapes (Glowtrail V1).
* Beat tables keyed by storyReadingBand; N=1 arrays OK.
* Do NOT shuffle scenePacks yet — types only for future subplot pools.
*/
import type { StoryReadingBand } from "./storyReadingBand";
import type { PlanetBeatKey } from "./glowtrailBandScripts";

export type BeatLineValue = string | readonly string[];

export type BandedLines = Record<StoryReadingBand, BeatLineValue>;

export type PlanetBeatTable = Record<PlanetBeatKey, BandedLines>;

export type SceneBeatSet = {
  arrive: BeatLineValue;
  optionalMid?: readonly BeatLineValue[];
  start: BeatLineValue;
  win: BeatLineValue;
};

export type ScenePackDef = {
  id: string;
  beats: Record<StoryReadingBand, SceneBeatSet>;
};

export type PlanetNarrativeNode = {
  /** Default planet beats (gear lives here). */
  beats: PlanetBeatTable;
  scenePacks?: readonly ScenePackDef[];
};

export type NarrativeBookends = {
  coldOpen: BandedLines;
  meetNibbles: BandedLines;
  endingRescue: BandedLines;
  endingSting: BandedLines;
};

export type GlowtrailNarrativeBible = {
  bookends: NarrativeBookends;
  mapNudge: BandedLines;
  planets: Record<string, PlanetNarrativeNode>;
};

/** Stable pick from string | string[] using adventure runSeed. */
export function pickBeatLine(
  value: BeatLineValue | undefined,
  runSeed: number = 0,
): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (!value.length) return "";
  return value[Math.abs(runSeed) % value.length]!;
}
