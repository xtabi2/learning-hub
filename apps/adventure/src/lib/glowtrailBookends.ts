/**
 * Glowtrail narrative bookends (CW verbatim).
 * Slots: coldOpen, meetNibbles, endingRescue, endingSting.
 * Values are string[] per band (join for TTS; N=1+ arrays OK).
 */
import type { StoryReadingBand } from "./storyReadingBand";
import { clampBandToPeak } from "./storyReadingBand";
import { pickBeatLine, type BeatLineValue } from "./narrativeBible";

export type BookendSlot =
  | "coldOpen"
  | "meetNibbles"
  | "endingRescue"
  | "endingSting";

export type BookendTable = Record<BookendSlot, Record<StoryReadingBand, BeatLineValue>>;

export const GLOWTRAIL_BOOKENDS: BookendTable = {
  coldOpen: {
    emerging: ["Night. Stars close.", "Your light clicks on.", "The sky answers."],
    early: ["Night in the backyard. Stars look close.", "Your reading light clicks on.", "And the sky answers."],
    growing: ["Night. A tiny backyard. Stars look close enough to poke.", "The reading light clicks on… and the sky answers."],
    "fluent-ms": ["Night settles on a tiny backyard, stars close enough to poke.", "The reading light clicks on—and somehow, the sky answers back."],
  },
  meetNibbles: {
    emerging: ["Green goo lands. Splorp.", "Hi! I am Nibbles. I fix ships.", "The Story Star is dim. We need a pilot."],
    early: ["Green goo crash-lands. Splorp!", "Hi! I’m Nibbles. I fix ships. I may have broken this one a little.", "The Story Star is dimming. We need a brave pilot."],
    growing: ["A streak of green goo crash-lands in a soft splorp.", "Hi! I’m Nibbles. I fix ships. Also… I may have broken this one a little.", "Uh-oh. The Story Star is dimming. If it goes dark, good stories go quiet. We need a brave pilot. Got a minute?"],
    "fluent-ms": ["A streak of green goo wobbles past the moon and crash-lands in a soft splorp.", "Hi! I’m Nibbles. I fix ships. Also… I may have broken this one a little.", "The Story Star is dimming—if it goes dark, the good stories go quiet. We need a brave pilot. Got a minute?"],
  },
  endingRescue: {
    emerging: ["Someone took the light. They were lonely.", "We help. Light comes home."],
    early: ["Someone collected the light. Not to be mean—lonely.", "We help them. The light comes home."],
    growing: ["Someone has been collecting the light—not to wreck stories, but because they were lonely.", "We help. Nibbles morphs into something nobody expects. The light comes home."],
    "fluent-ms": ["Someone has been collecting the starlight—not to end stories, but because they were lonely in the quiet.", "It’s a brave, funny rescue. Nibbles morphs into something nobody expects—and the light comes home."],
  },
  endingSting: {
    emerging: ["The Story Star is bright again.", "You did not just read it.", "You flew it."],
    early: ["The Story Star flares bright. Planets twinkle back.", "You didn’t just read the adventure.", "You flew it."],
    growing: ["The Story Star flares bright again. Every planet you’ve visited twinkles back.", "You didn’t just read the adventure. You flew it."],
    "fluent-ms": ["The Story Star flares bright again, and every planet you’ve visited twinkles in reply.", "You didn’t just read the adventure.", "You flew it."],
  },
};

/** Join bookend lines for a single SpokenPrompt utterance. */
export function bookendLines(
  slot: BookendSlot,
  band: StoryReadingBand,
  startBand?: StoryReadingBand,
): string[] {
  const capped = startBand ? clampBandToPeak(startBand, band) : band;
  const raw = GLOWTRAIL_BOOKENDS[slot][capped];
  if (raw == null) return [];
  return typeof raw === "string" ? [raw] : [...raw];
}

export function bookendText(
  slot: BookendSlot,
  band: StoryReadingBand,
  startBand?: StoryReadingBand,
  joiner: string = " ",
): string {
  return bookendLines(slot, band, startBand).join(joiner);
}

/** Seeded single-line pick when a slot is used as a variant pool. */
export function pickBookendLine(
  slot: BookendSlot,
  band: StoryReadingBand,
  runSeed: number = 0,
  startBand?: StoryReadingBand,
): string {
  const capped = startBand ? clampBandToPeak(startBand, band) : band;
  return pickBeatLine(GLOWTRAIL_BOOKENDS[slot][capped], runSeed);
}

