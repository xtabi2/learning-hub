import { describe, expect, it } from "vitest";
import {
  STORY_READING_BANDS,
  bandAtGlowtrailPlanetNumber,
  deriveStartBandFromPlacementAccuracy,
  peakBand,
  peakGradeForStart,
  gradeMidpointForBand,
} from "../src/lib/storyReadingBand";
import { bandedPlanetLine } from "../src/lib/glowtrailBandScripts";
import { planetScript, galaxyScript } from "../src/lib/planetScripts";
import { pickBeatLine } from "../src/lib/narrativeBible";

describe("storyReadingBand four IDs", () => {
  it("uses only emerging|early|growing|fluent-ms", () => {
    expect([...STORY_READING_BANDS]).toEqual([
      "emerging",
      "early",
      "growing",
      "fluent-ms",
    ]);
  });

  it("derives start from placement accuracy", () => {
    expect(deriveStartBandFromPlacementAccuracy(0.2)).toBe("emerging");
    expect(deriveStartBandFromPlacementAccuracy(0.5)).toBe("early");
    expect(deriveStartBandFromPlacementAccuracy(0.7)).toBe("growing");
    expect(deriveStartBandFromPlacementAccuracy(0.95)).toBe("fluent-ms");
  });

  it("computes peak via grade midpoints +3 not bandIndex+3", () => {
    expect(gradeMidpointForBand("emerging")).toBe(1);
    expect(peakGradeForStart("emerging")).toBe(4);
    expect(peakBand("emerging")).toBe("growing");
    expect(peakBand("early")).toBe("growing");
    expect(peakBand("growing")).toBe("fluent-ms");
    expect(peakBand("fluent-ms")).toBe("fluent-ms");
  });

  it("climbs Glowtrail planets only toward personal peak", () => {
    expect(bandAtGlowtrailPlanetNumber("emerging", 1)).toBe("emerging");
    expect(bandAtGlowtrailPlanetNumber("emerging", 8)).toBe("growing");
    expect(bandAtGlowtrailPlanetNumber("fluent-ms", 8)).toBe("fluent-ms");
  });
});

describe("Glowtrail banded Softsnow/Sparktown/Flipcliff", () => {
  it("encodes Softsnow fluent-ms verbatim", () => {
    expect(bandedPlanetLine("softsnow-drift", "arrive", "fluent-ms")).toBe(
      "Softsnow Drift asks for hush. Sleepy story-snowflakes prefer a tiptoe voice.",
    );
    expect(bandedPlanetLine("softsnow-drift", "win", "fluent-ms")).toMatch(
      /Honestly beautiful/,
    );
  });

  it("encodes Sparktown fluent-ms verbatim", () => {
    expect(bandedPlanetLine("sparktown-dock", "gearUnlocked", "fluent-ms")).toBe(
      "Gloves on. Champion-level sorting: commence.",
    );
    expect(bandedPlanetLine("sparktown-dock", "win", "fluent-ms")).toMatch(
      /temporarily become a wrench/,
    );
  });

  it("has Flipcliff fluent-ms arrive/win", () => {
    expect(planetScript("flipcliff", "arrive", "fluent-ms")).toMatch(/Flipcliff/i);
    expect(planetScript("flipcliff", "win", "fluent-ms")).toMatch(/Right-side-up/i);
  });

  it("galaxy arrive respects band table", () => {
    expect(galaxyScript("arrive", "emerging")).toMatch(/Glowtrail/);
    expect(galaxyScript("arrive", "emerging").length).toBeLessThan(
      galaxyScript("arrive", "fluent-ms").length + 1,
    );
  });
});

describe("pickBeatLine", () => {
  it("returns string or seeded array entry", () => {
    expect(pickBeatLine("only")).toBe("only");
    expect(pickBeatLine(["a", "b"], 0)).toBe("a");
    expect(pickBeatLine(["a", "b"], 1)).toBe("b");
  });
});

import { GLOWTRAIL_BOOKENDS, bookendText } from "../src/lib/glowtrailBookends";
import {
  GLOWTRAIL_SCENE_PACKS,
  scenePacksForPlanet,
  pickScenePackIndex,
} from "../src/lib/glowtrailScenePacks";

describe("Glowtrail bookends", () => {
  it("has coldOpen meetNibbles endingRescue endingSting for all bands", () => {
    for (const slot of ["coldOpen", "meetNibbles", "endingRescue", "endingSting"] as const) {
      for (const band of ["emerging", "early", "growing", "fluent-ms"] as const) {
        const v = GLOWTRAIL_BOOKENDS[slot][band];
        expect(v).toBeTruthy();
      }
    }
    expect(bookendText("coldOpen", "emerging")).toMatch(/Stars|Night/i);
  });
});

describe("Glowtrail scenePacks catalog", () => {
  it("has 8 planets with 2 packs each", () => {
    expect(Object.keys(GLOWTRAIL_SCENE_PACKS).sort()).toEqual([
      "bouncebloom",
      "bubbledeep",
      "echo-canyon",
      "flipcliff",
      "mistwhisper",
      "sizzle-rock",
      "softsnow-drift",
      "sparktown-dock",
    ]);
    for (const packs of Object.values(GLOWTRAIL_SCENE_PACKS)) {
      expect(packs.length).toBe(2);
    }
  });

  it("aliases echocanyon to echo-canyon", () => {
    expect(scenePacksForPlanet("echocanyon")[0]?.id).toBe("fix_the_copy");
  });

  it("pickScenePackIndex is stable mod 2", () => {
    expect(pickScenePackIndex(1, "mistwhisper", 2)).toBe(
      pickScenePackIndex(1, "mistwhisper", 2),
    );
    expect(pickScenePackIndex(1, "mistwhisper", 2)).toBeLessThan(2);
  });
});
