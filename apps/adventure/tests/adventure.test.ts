import { describe, expect, it } from "vitest";
import {
  HOME_PLANET_ID,
  HOME_PLANET_NAME,
  NIBBLES_PARTS_TO_LAUNCH,
  NIBBLES_SHIP_PARTS,
  applyShipPartAward,
  emptyAdventureSnapshot,
  isReadyForLaunch,
  kidPillarLabel,
  parseShipPartsJson,
  shouldAwardPartForMastery,
} from "../src/lib/adventure";

describe("adventure thresholds", () => {
  it("uses Star Nook hub (stable id nibbles) and a 5-part launch threshold", () => {
    expect(HOME_PLANET_ID).toBe("nibbles");
    expect(HOME_PLANET_NAME).toBe("Star Nook");
    expect(NIBBLES_PARTS_TO_LAUNCH).toBe(5);
    expect(NIBBLES_SHIP_PARTS.length).toBeGreaterThanOrEqual(
      NIBBLES_PARTS_TO_LAUNCH,
    );
  });

  it("isReadyForLaunch respects the threshold", () => {
    expect(isReadyForLaunch(0)).toBe(false);
    expect(isReadyForLaunch(4)).toBe(false);
    expect(isReadyForLaunch(5)).toBe(true);
    expect(isReadyForLaunch(6)).toBe(true);
    expect(isReadyForLaunch(3, 3)).toBe(true);
  });
});

describe("shouldAwardPartForMastery", () => {
  it("awards only on the not-mastered → mastered edge", () => {
    expect(shouldAwardPartForMastery(false, true)).toBe(true);
    expect(shouldAwardPartForMastery(true, true)).toBe(false);
    expect(shouldAwardPartForMastery(false, false)).toBe(false);
    expect(shouldAwardPartForMastery(true, false)).toBe(false);
  });
});

describe("applyShipPartAward", () => {
  it("awards the next catalog part and increments the counter", () => {
    const before = emptyAdventureSnapshot();
    const result = applyShipPartAward(before, {
      skillId: "skill-a",
      now: new Date("2026-09-05T12:00:00Z"),
    });
    expect(result.awarded).toBe(true);
    expect(result.part?.id).toBe(NIBBLES_SHIP_PARTS[0].id);
    expect(result.state.partsCollected).toBe(1);
    expect(result.state.shipParts).toHaveLength(1);
    expect(result.state.shipParts[0]).toMatchObject({
      partId: NIBBLES_SHIP_PARTS[0].id,
      skillId: "skill-a",
    });
    expect(result.state.readyToLeave).toBe(false);
    expect(result.newlyReady).toBe(false);
  });

  it("is idempotent for the same skillId", () => {
    const first = applyShipPartAward(emptyAdventureSnapshot(), {
      skillId: "skill-a",
    });
    const second = applyShipPartAward(first.state, { skillId: "skill-a" });
    expect(second.awarded).toBe(false);
    expect(second.state.partsCollected).toBe(1);
  });

  it("marks readyToLeave when the launch threshold is reached", () => {
    let state = emptyAdventureSnapshot();
    let newlyReady = false;
    for (let i = 0; i < NIBBLES_PARTS_TO_LAUNCH; i += 1) {
      const result = applyShipPartAward(state, { skillId: `skill-${i}` });
      expect(result.awarded).toBe(true);
      state = result.state;
      if (result.newlyReady) newlyReady = true;
    }
    expect(state.partsCollected).toBe(NIBBLES_PARTS_TO_LAUNCH);
    expect(state.readyToLeave).toBe(true);
    expect(newlyReady).toBe(true);
    expect(isReadyForLaunch(state.partsCollected)).toBe(true);
  });

  it("stops awarding when the catalog is exhausted", () => {
    let state = emptyAdventureSnapshot();
    for (let i = 0; i < NIBBLES_SHIP_PARTS.length; i += 1) {
      const result = applyShipPartAward(state, { skillId: `skill-${i}` });
      expect(result.awarded).toBe(true);
      state = result.state;
    }
    const extra = applyShipPartAward(state, { skillId: "overflow" });
    expect(extra.awarded).toBe(false);
    expect(extra.state.partsCollected).toBe(NIBBLES_SHIP_PARTS.length);
  });
});

describe("parseShipPartsJson", () => {
  it("returns [] for empty or invalid JSON", () => {
    expect(parseShipPartsJson(null)).toEqual([]);
    expect(parseShipPartsJson("")).toEqual([]);
    expect(parseShipPartsJson("not-json")).toEqual([]);
    expect(parseShipPartsJson("{}")).toEqual([]);
  });

  it("keeps well-formed earned part records", () => {
    const raw = JSON.stringify([
      { partId: "boost-thruster", earnedAt: "2026-09-05T12:00:00.000Z" },
      { partId: 1, earnedAt: "x" },
    ]);
    expect(parseShipPartsJson(raw)).toEqual([
      { partId: "boost-thruster", earnedAt: "2026-09-05T12:00:00.000Z" },
    ]);
  });
});

describe("kidPillarLabel", () => {
  it("maps literacy pillars to adventure language", () => {
    expect(kidPillarLabel("phonics")).toBe("Letter Rockets");
    expect(kidPillarLabel("phonemic_awareness")).toBe("Sound Scanners");
    expect(kidPillarLabel("unknown_pillar")).toBe("unknown_pillar");
  });
});
