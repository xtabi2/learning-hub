import { describe, expect, it } from "vitest";
import { GLOWTRAIL_SKILL_PLANET_IDS } from "../src/lib/galaxyCatalog";
import {
  galaxyScript,
  hasPlanetScripts,
  nibblesArriveLine,
  nibblesStartLine,
  nibblesWinLine,
  planetScript,
} from "../src/lib/nibblesCompanion";
import {
  planetScript as planetScriptDirect,
  planetScriptIds,
} from "../src/lib/planetScripts";

const BEATS = ["arrive", "gearLocked", "gearUnlocked", "start", "win"] as const;

describe("Glowtrail galaxy TTS scripts", () => {
  it("exposes galaxy arrive, map nudge, and galaxy clear lines", () => {
    expect(galaxyScript("arrive")).toMatch(/Glowtrail Galaxy/i);
    expect(galaxyScript("arrive").toLowerCase()).toMatch(/story star/);
    expect(galaxyScript("map_nudge").toLowerCase()).toMatch(/planet|tools/);
    expect(galaxyScript("galaxy_clear").toLowerCase()).toMatch(
      /glowtrail|story star|ship/,
    );
    for (const line of [
      galaxyScript("arrive"),
      galaxyScript("map_nudge"),
      galaxyScript("galaxy_clear"),
    ]) {
      expect(line.toLowerCase()).not.toMatch(
        /phonics|fluency|vocabulary|comprehension|literacy|decoding/,
      );
    }
  });

  it("has arrive/gear/start/win packs for all eight Glowtrail skill planets", () => {
    expect(planetScriptIds().sort()).toEqual(
      [...GLOWTRAIL_SKILL_PLANET_IDS].sort(),
    );
    for (const id of GLOWTRAIL_SKILL_PLANET_IDS) {
      expect(hasPlanetScripts(id)).toBe(true);
      for (const beat of BEATS) {
        const line = planetScript(id, beat);
        expect(line.length, `${id}.${beat}`).toBeGreaterThan(8);
        expect(line.toLowerCase()).not.toMatch(
          /phonics|fluency|vocabulary|comprehension|literacy|phonological|decoding/,
        );
      }
    }
  });

  it("matches Creative Writer sample lines for Mistwhisper / Sizzle / Flipcliff / Sparktown", () => {
    expect(planetScriptDirect("mistwhisper", "arrive")).toMatch(/lantern/i);
    expect(planetScriptDirect("sizzle-rock", "arrive")).toMatch(/Marshmallow/i);
    expect(planetScriptDirect("flipcliff", "win")).toMatch(/Right-side-up/i);
    expect(planetScriptDirect("sparktown-dock", "win")).toMatch(/wrench/i);
  });

  it("companion helpers prefer planet arrive/start/win when available", () => {
    expect(nibblesArriveLine("mistwhisper")).toBe(
      planetScript("mistwhisper", "arrive"),
    );
    expect(nibblesStartLine("bouncebloom")).toBe(
      planetScript("bouncebloom", "start"),
    );
    expect(nibblesWinLine("echo-canyon")).toBe(
      planetScript("echo-canyon", "win"),
    );
    expect(nibblesArriveLine("nibbles").toLowerCase()).toMatch(/star nook/);
  });
});
