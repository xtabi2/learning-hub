import { describe, expect, it } from "vitest";
import {
  isStrongPlacementPillar,
  placementCompleteOk,
  placementPlayPath,
} from "../src/lib/placement";

describe("placement complete contract", () => {
  it("returns { ok: true, childId } and never implies a redirect payload", () => {
    const result = placementCompleteOk("child-123");
    expect(result).toEqual({ ok: true, childId: "child-123" });
    expect(result).not.toHaveProperty("redirect");
    expect(Object.keys(result).sort()).toEqual(["childId", "ok"]);
  });

  it("preserves the childId used for client navigation", () => {
    expect(placementCompleteOk("abc").childId).toBe("abc");
  });
});

describe("PlacementQuiz navigation contract", () => {
  it("builds the play path that router.push uses after completePlacementAction", () => {
    expect(placementPlayPath("child-xyz")).toBe("/play/child-xyz");
  });

  it("pairs complete ok payload with the same child id in the nav path", () => {
    const result = placementCompleteOk("nav-kid");
    expect(result.ok).toBe(true);
    expect(placementPlayPath(result.childId)).toBe(`/play/${result.childId}`);
  });
});

describe("isStrongPlacementPillar", () => {
  it("requires a full enough hit rate (≥80%) with attempts present", () => {
    expect(isStrongPlacementPillar({ correct: 4, total: 5 })).toBe(true);
    expect(isStrongPlacementPillar({ correct: 8, total: 10 })).toBe(true);
    expect(isStrongPlacementPillar({ correct: 3, total: 5 })).toBe(false);
    expect(isStrongPlacementPillar({ correct: 0, total: 0 })).toBe(false);
    expect(isStrongPlacementPillar(undefined)).toBe(false);
  });
});
