import { describe, expect, it } from "vitest";
import { NIBBLES_SHIP_PARTS, emptyAdventureSnapshot, snapshotFromRow } from "../src/lib/adventure";
import {
  GLOWTRAILS_ART,
  GLOWTRAILS_FIRST_PLANET_ID,
  GLOWTRAILS_HINT_AFTER_MS,
  GLOWTRAILS_HOTSPOTS,
  GLOWTRAILS_HOTSPOT_MIN_PX,
  GLOWTRAILS_PAGE_ORDER,
  GLOWTRAILS_PART_IDS,
  GLOWTRAILS_TIDAL,
  GLOWTRAILS_TREE_FRUIT_HIT,
  activePartId,
  applyBookPartEarn,
  bandText,
  emptyBookProgress,
  hintAfterMs,
  isGlowTrailsPartId,
  karaokeForPage,
  nextBookPage,
  parseBookProgressJson,
  partEarnLine,
  partFindLine,
  partHintLine,
  partOverviewLine,
  prevBookPage,
  serializeBookProgress,
} from "../src/lib/glowtrailsTidal";

describe("GlowTrails Tidal catalog lock", () => {
  it("locks part order oxygen-tank → dorsal-fin → sonar", () => {
    expect(GLOWTRAILS_PART_IDS).toEqual([
      "oxygen-tank",
      "dorsal-fin",
      "sonar",
    ]);
    expect(GLOWTRAILS_TIDAL.partOrder).toEqual([
      "oxygen-tank",
      "dorsal-fin",
      "sonar",
    ]);
    expect(GLOWTRAILS_FIRST_PLANET_ID).toBe("tidal");
    expect(GLOWTRAILS_TIDAL.firstPlanetId).toBe("tidal");
    expect(GLOWTRAILS_TIDAL.firstPlanetKidName).toBe("Tidal");
  });

  it("extends NIBBLES_SHIP_PARTS with Tidal sticker ids", () => {
    for (const id of GLOWTRAILS_PART_IDS) {
      expect(NIBBLES_SHIP_PARTS.some((p) => p.id === id)).toBe(true);
      expect(isGlowTrailsPartId(id)).toBe(true);
    }
    expect(isGlowTrailsPartId("boost-thruster")).toBe(false);
    expect(isGlowTrailsPartId("comet-fin")).toBe(false);
  });

  it("keeps soft hits ≥64px at GD centers; no Mistwhisper parts on kid cut", () => {
    expect(GLOWTRAILS_HOTSPOT_MIN_PX).toBeGreaterThanOrEqual(64);
    expect(GLOWTRAILS_HOTSPOTS).toEqual([
      { id: "oxygen-tank", leftPct: 60, topPct: 68 },
      { id: "dorsal-fin", leftPct: 54, topPct: 38 },
      { id: "sonar", leftPct: 73, topPct: 72 },
    ]);
    expect(GLOWTRAILS_TREE_FRUIT_HIT).toEqual({ leftPct: 49, topPct: 47 });
    expect(Object.keys(GLOWTRAILS_TIDAL.tidal.spreads)).toEqual([
      "oxygen-tank",
      "dorsal-fin",
      "sonar",
    ]);
    expect(GLOWTRAILS_TIDAL.partOrder).not.toContain("boost-thruster");
    expect(GLOWTRAILS_TIDAL.partOrder).not.toContain("comet-fin");
    expect(GLOWTRAILS_TIDAL.firstPlanetId).not.toBe("mistwhisper");
  });

  it("wires GD art path contract", () => {
    expect(GLOWTRAILS_ART.treeHome).toBe("/adventure/glowtrails/tree-home.png");
    expect(GLOWTRAILS_ART.fruitGlowTrails).toBe(
      "/adventure/glowtrails/fruit-glowtrails.png",
    );
    expect(GLOWTRAILS_ART.shipChrome).toBe("/adventure/glowtrails/hud-ship.png");
    expect(GLOWTRAILS_ART.starMap).toBe("/adventure/glowtrails/hud-starmap.png");
    expect(GLOWTRAILS_ART.spread("oxygen-tank")).toBe(
      "/adventure/glowtrails/tidal/spread-oxygen-tank.png",
    );
    expect(GLOWTRAILS_ART.part("sonar", "earned")).toBe(
      "/adventure/glowtrails/parts/sonar-earned.png",
    );
  });
});

describe("GlowTrails copy bands", () => {
  it("uses canonical tree / HUD / overview / hint / find / earn / complete", () => {
    expect(bandText(GLOWTRAILS_TIDAL.tree.homeLine, "emerging")).toBe(
      "Ride the elevator and tap a book to blast off!",
    );
    expect(bandText(GLOWTRAILS_TIDAL.hud.goToShip, "growing")).toBe(
      "Go to the ship",
    );
    expect(partOverviewLine("oxygen-tank", "emerging")).toContain(
      "oxygen tank",
    );
    expect(partHintLine("dorsal-fin", "early")).toContain("shark");
    expect(partFindLine("sonar", "growing")).toContain("sonar");
    expect(partEarnLine("oxygen-tank", "fluent-ms")).toContain("sticker");
    expect(bandText(GLOWTRAILS_TIDAL.tidal.partMiss, "early")).toContain(
      "Keep looking",
    );
    expect(bandText(GLOWTRAILS_TIDAL.tidal.chapterComplete, "emerging")).toContain(
      "Tidal done",
    );
  });

  it("locks hintAfterMs at 180000", () => {
    expect(GLOWTRAILS_HINT_AFTER_MS).toBe(180_000);
    expect(hintAfterMs()).toBe(180_000);
    expect(GLOWTRAILS_TIDAL.hintAfterMs).toBe(180_000);
  });

  it("builds intro karaoke from bands", () => {
    const progress = emptyBookProgress();
    expect(karaokeForPage("intro-1", "emerging", progress)).toContain(
      "GlowTrails",
    );
    expect(karaokeForPage("intro-2", "early", progress)).toContain("Nibbles");
    expect(karaokeForPage("chapter-open", "growing", progress)).toContain(
      "Tidal",
    );
  });
});

describe("GlowTrails bookProgressJson", () => {
  it("parses spreadIndex / currentPlanetId / earnedPartIds / chapterComplete", () => {
    const parsed = parseBookProgressJson(
      JSON.stringify({
        earnedPartIds: ["oxygen-tank", "boost-thruster", "dorsal-fin"],
        chapterComplete: false,
        spreadIndex: 2,
        currentPlanetId: "tidal",
      }),
    );
    expect(parsed.earnedPartIds).toEqual(["oxygen-tank", "dorsal-fin"]);
    expect(parsed.spreadIndex).toBe(2);
    expect(parsed.currentPlanetId).toBe("tidal");
    expect(parsed.chapterComplete).toBe(false);
    expect(activePartId(parsed)).toBe("sonar");
  });

  it("stamps complete when all three earned", () => {
    const parsed = parseBookProgressJson(
      JSON.stringify({
        earnedPartIds: ["oxygen-tank", "dorsal-fin", "sonar"],
        chapterComplete: false,
      }),
    );
    expect(parsed.chapterComplete).toBe(true);
    expect(JSON.parse(serializeBookProgress(parsed))).toMatchObject({
      earnedPartIds: ["oxygen-tank", "dorsal-fin", "sonar"],
      chapterComplete: true,
      currentPlanetId: "tidal",
    });
  });

  it("hydrates onto adventure snapshots", () => {
    expect(emptyAdventureSnapshot().bookProgress).toEqual(emptyBookProgress());
    const snap = snapshotFromRow({
      planetId: "nibbles",
      partsCollected: 0,
      shipPartsJson: "[]",
      readyToLeave: false,
      bookProgressJson: JSON.stringify({
        earnedPartIds: ["oxygen-tank"],
        chapterComplete: false,
        spreadIndex: 1,
        currentPlanetId: "tidal",
      }),
    });
    expect(snap.bookProgress.earnedPartIds).toEqual(["oxygen-tank"]);
    expect(snap.bookProgress.spreadIndex).toBe(1);
    expect(snap.bookProgress.currentPlanetId).toBe("tidal");
  });
});

describe("applyBookPartEarn (Tidal stickers only)", () => {
  it("earns stickers without inventing literacy gear unlocks", () => {
    const first = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "oxygen-tank",
    );
    expect(first.earned).toBe(true);
    expect(first.grantedGearId).toBeNull();
    expect(first.gearOwned).toEqual([]);
    expect(first.bookProgress.earnedPartIds).toEqual(["oxygen-tank"]);
    expect(first.bookProgress.spreadIndex).toBe(1);

    const second = applyBookPartEarn(
      { bookProgress: first.bookProgress, gearOwned: first.gearOwned },
      "dorsal-fin",
    );
    const third = applyBookPartEarn(
      { bookProgress: second.bookProgress, gearOwned: second.gearOwned },
      "sonar",
    );
    expect(third.bookProgress.chapterComplete).toBe(true);
    expect(third.newlyComplete).toBe(true);
    expect(third.grantedGearId).toBeNull();
  });

  it("ignores Mistwhisper / unknown ids", () => {
    const miss = applyBookPartEarn(
      { bookProgress: emptyBookProgress(), gearOwned: [] },
      "boost-thruster",
    );
    expect(miss.earned).toBe(false);
    expect(miss.bookProgress.earnedPartIds).toEqual([]);
  });
});

describe("GlowTrails page model", () => {
  it("walks intro → chapter-open → spread → complete", () => {
    expect(GLOWTRAILS_PAGE_ORDER).toEqual([
      "intro-1",
      "intro-2",
      "intro-3",
      "intro-4",
      "chapter-open",
      "spread",
      "complete",
    ]);
    expect(nextBookPage("intro-4")).toBe("chapter-open");
    expect(nextBookPage("chapter-open")).toBe("spread");
    expect(nextBookPage("spread")).toBe("complete");
    expect(prevBookPage("intro-1")).toBeNull();
  });
});
