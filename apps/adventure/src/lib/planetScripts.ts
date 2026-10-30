/**
 * Nibbles TTS intro / beat script pack (Creative Writer).
 * Modular beat tables keyed by storyReadingBand (emerging|early|growing|fluent-ms).
 * Default PLANET_SCRIPTS = growing bookends; banded tables supply variants.
 * Never select a line above personal peak (clampBandToPeak).
 */

import type { StoryReadingBand } from "./storyReadingBand";
import { clampBandToPeak } from "./storyReadingBand";
import { bandedPlanetLine } from "./glowtrailBandScripts";

export type PlanetScriptBeat =
  | "arrive"
  | "gearLocked"
  | "gearUnlocked"
  | "start"
  | "win";

export type GalaxyScriptBeat = "arrive" | "map_nudge" | "galaxy_clear";

type PlanetScriptPack = Record<PlanetScriptBeat, string>;

const GALAXY_SCRIPTS: Record<GalaxyScriptBeat, string> = {
  arrive:
    "Welcome to Glowtrail Galaxy! Tiny lights. Big sky. The Story Star is watching. Ready to make it smile?",
  map_nudge:
    "Pick a planet. I’ll bring the snacks. And the tools. Mostly the tools.",
  galaxy_clear:
    "Glowtrail complete! Look—Story Star smiled a little. New sky ahead. I’ll upgrade the ship. You bring the brave.",
};

const PLANET_SCRIPTS: Record<string, PlanetScriptPack> = {
  mistwhisper: {
    arrive:
      "Mistwhisper! Soft fog. Shy words hiding. Don’t worry—I’m a lantern now. Sort of.",
    gearLocked:
      "Need a glow lantern first. I can fake one… but the real one is brighter.",
    gearUnlocked: "Lantern on! Fog, meet shiny.",
    start: "Shine your light. Say hi to the words. They’ll come out.",
    win: "Fog friends found! Mistwhisper is glowing. Spark for the Story Star!",
  },
  bouncebloom: {
    arrive:
      "Bouncebloom! Everything springs. Including my goo. Whee—okay I’m okay.",
    gearLocked:
      "Spring boots first. Otherwise we bounce into space. That’s a bad bounce.",
    gearUnlocked: "Boots on! Boing mode: go.",
    start: "Hop the path. Catch the bouncing lines. Soft landing, big pilot.",
    win: "Best bounce ever! Bouncebloom lit. The Star got a giggle.",
  },
  "echo-canyon": {
    arrive:
      "Echo Canyon! It copies you… wrong on purpose. Rude. Funny. Rude-funny.",
    gearLocked: "Grab the echo headphones. So we can catch the silly copies.",
    gearUnlocked: "Headphones ready. Bad echoes, you’re toast.",
    start: "Listen. Fix the echo. Stop the giggle-collapse.",
    win: "Echo fixed! Cliffs calm. Canyon shining. Nice catch.",
  },
  bubbledeep: {
    arrive:
      "Bubbledeep! Chatty bubbles everywhere. I’ll be a fishbowl helmet. Fashion!",
    gearLocked: "Scuba bubbles first. Dry pilots only float… briefly.",
    gearUnlocked: "Bubbles on. Underwater crew: activate.",
    start: "Catch the matching bubble. Before it pops into sparkles!",
    win: "Pop-pop-perfect! Bubbledeep is bright. Splash win.",
  },
  "sizzle-rock": {
    arrive: "Sizzle Rock! Hot hot hot. Marshmallow mode: OFF.",
    gearLocked:
      "Fire suit time. I tried being a fire suit. I got toasty. Real suit is better.",
    gearUnlocked: "Suit sealed. Lava, behave.",
    start: "Say the line out loud. Cool the trail. You’ve got this.",
    win: "Lava cooled! Sizzle Rock shines. We did not become toast. Pride!",
  },
  flipcliff: {
    arrive:
      "Flipcliff! Upside down. My top is my bottom. Don’t laugh. Okay laugh a little.",
    gearLocked: "Sticky boots first. Please do not drop the pilot.",
    gearUnlocked: "Boots sticky. Ceiling is floor. Let’s walk weird.",
    start: "Stick to the trail. Follow the signs. No space-dropping.",
    win: "Right-side-up win! Flipcliff lit. Boots did their job. So did you.",
  },
  "softsnow-drift": {
    arrive: "Softsnow Drift. Shh. Sleepy story-snowflakes. Tiptoe voice.",
    gearLocked: "Hush scarf first. Quiet gear for a quiet world.",
    gearUnlocked: "Hush scarf on. Whisper mode: me.",
    start: "Careful words. Wake one snowflake at a time. Gentle pilot.",
    win: "Snowflakes awake! Softsnow glowing soft and proud. Beautiful.",
  },
  "sparktown-dock": {
    arrive:
      "Sparktown Dock! Busy bots. Tiny light packages. Story Star mail call!",
    gearLocked: "Sorter gloves first. Sticky fingers, meet spark mail.",
    gearUnlocked: "Gloves on. Let’s sort like champions.",
    start:
      "Help the dockbots. Right spark, right box. Make the Star’s mailbox happy.",
    win: "Mail delivered! Sparktown shining! Glowtrail Galaxy… brighter. Thrusters next? I can be a wrench.",
  },
};

/** Shared galaxy beats (modular bookends; band may simplify arrive). */
const GALAXY_BANDED: Record<
  "arrive" | "map_nudge" | "galaxy_clear",
  Partial<Record<StoryReadingBand, string>>
> = {
  arrive: {
    emerging: "Welcome to Glowtrail! Tiny lights. Big sky. Story Star is watching. Ready?",
    early: "Welcome to Glowtrail Galaxy! Tiny lights. Big sky. The Story Star is watching. Ready?",
    growing:
      "Welcome to Glowtrail Galaxy! Tiny lights. Big sky. The Story Star is watching. Ready to make it smile?",
    "fluent-ms":
      "Welcome to Glowtrail Galaxy! Tiny lights, big sky—the Story Star is watching. Ready to make it smile?",
  },
  map_nudge: {
    emerging: "Pick a planet. I'll bring tools.",
    early: "Pick a planet. I'll bring the snacks. And the tools.",
    growing: "Pick a planet. I'll bring the snacks. And the tools. Mostly the tools.",
    "fluent-ms":
      "Pick a planet. I'll bring the snacks—and the tools. Mostly the tools.",
  },
  galaxy_clear: {
    emerging: "Glowtrail complete! Story Star smiled. New sky ahead.",
    early: "Glowtrail complete! Story Star smiled a little. New sky ahead. Ship upgrade next.",
    growing:
      "Glowtrail complete! Look—Story Star smiled a little. New sky ahead. I'll upgrade the ship. You bring the brave.",
    "fluent-ms":
      "Glowtrail complete. Look—the Story Star smiled a little. New sky ahead. I'll upgrade the ship; you bring the brave.",
  },
};

function resolveBand(
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): StoryReadingBand | undefined {
  if (!band) return undefined;
  return startBand ? clampBandToPeak(startBand, band) : band;
}

/** Galaxy-level Nibbles TTS line from modular band table. */
export function galaxyScript(
  beat: GalaxyScriptBeat,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  const capped = resolveBand(band, startBand);
  if (capped) {
    const line = GALAXY_BANDED[beat]?.[capped];
    if (line) return line;
  }
  return GALAXY_SCRIPTS[beat];
}

/**
 * Per-planet Nibbles TTS from modular band tables.
 * Falls back to default PLANET_SCRIPTS (growing bookend) when no band / no variant.
 * Never above peak when startBand is provided.
 */
export function planetScript(
  planetId: string,
  beat: PlanetScriptBeat,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  const capped = resolveBand(band, startBand);
  if (capped) {
    const banded = bandedPlanetLine(planetId, beat, capped);
    if (banded) return banded;
  }
  const pack = PLANET_SCRIPTS[planetId];
  if (!pack) return "";
  return pack[beat] ?? "";
}

export function hasPlanetScripts(planetId: string): boolean {
  return Boolean(PLANET_SCRIPTS[planetId]);
}

export function planetScriptIds(): string[] {
  return Object.keys(PLANET_SCRIPTS);
}

export function planetOrEmpty(
  planetId: string | null | undefined,
  beat: PlanetScriptBeat,
  band?: StoryReadingBand,
  startBand?: StoryReadingBand,
): string {
  if (!planetId) return "";
  return planetScript(planetId, beat, band, startBand);
}
