import { describe, expect, it } from "vitest";
import {
  isBaselineBand,
  parseBandsJson,
  serializeBandsJson,
  skillIdsForBand,
  skillsToMasterCount,
} from "../src/lib/baseline";
import { BASELINE_BANDS } from "../src/lib/constants";

describe("skillsToMasterCount home-lab heuristic", () => {
  it("awards nothing for well_below / below", () => {
    expect(skillsToMasterCount("well_below", 3)).toBe(0);
    expect(skillsToMasterCount("below", 3)).toBe(0);
  });

  it("masters only the entry skill for approaching", () => {
    expect(skillsToMasterCount("approaching", 3)).toBe(1);
    expect(skillsToMasterCount("approaching", 1)).toBe(1);
  });

  it("masters about half (ceil) for on_grade without unlocking everything", () => {
    expect(skillsToMasterCount("on_grade", 1)).toBe(1);
    expect(skillsToMasterCount("on_grade", 2)).toBe(1);
    expect(skillsToMasterCount("on_grade", 3)).toBe(2);
    expect(skillsToMasterCount("on_grade", 4)).toBe(2);
    expect(skillsToMasterCount("on_grade", 5)).toBe(3);
  });

  it("leaves the last node for above when a chain exists", () => {
    expect(skillsToMasterCount("above", 1)).toBe(1);
    expect(skillsToMasterCount("above", 2)).toBe(1);
    expect(skillsToMasterCount("above", 3)).toBe(2);
    expect(skillsToMasterCount("above", 5)).toBe(4);
  });

  it("returns 0 for an empty pillar skill list", () => {
    for (const band of BASELINE_BANDS) {
      expect(skillsToMasterCount(band, 0)).toBe(0);
    }
  });
});

describe("skillIdsForBand band→skill prefix mapping", () => {
  const skills = [
    { id: "a", sortOrder: 2 },
    { id: "b", sortOrder: 1 },
    { id: "c", sortOrder: 3 },
  ];

  it("respects sortOrder and band count", () => {
    expect(skillIdsForBand("approaching", skills)).toEqual(["b"]);
    expect(skillIdsForBand("on_grade", skills)).toEqual(["b", "a"]);
    expect(skillIdsForBand("above", skills)).toEqual(["b", "a"]);
    expect(skillIdsForBand("below", skills)).toEqual([]);
  });

  it("maps well_below and below to an empty prefix (no synthetic mastery)", () => {
    expect(skillIdsForBand("well_below", skills)).toEqual([]);
    expect(skillIdsForBand("below", skills)).toEqual([]);
  });

  it("approaching awards only the lowest sortOrder skill", () => {
    expect(skillIdsForBand("approaching", skills)).toEqual(["b"]);
  });

  it("on_grade awards a sorted prefix (~half, ceil) without the whole chain", () => {
    const five = [
      { id: "s1", sortOrder: 1 },
      { id: "s2", sortOrder: 2 },
      { id: "s3", sortOrder: 3 },
      { id: "s4", sortOrder: 4 },
      { id: "s5", sortOrder: 5 },
    ];
    expect(skillIdsForBand("on_grade", five)).toEqual(["s1", "s2", "s3"]);
  });

  it("above awards all but the last skill in the ordered chain", () => {
    const four = [
      { id: "s1", sortOrder: 10 },
      { id: "s2", sortOrder: 20 },
      { id: "s3", sortOrder: 30 },
      { id: "s4", sortOrder: 40 },
    ];
    expect(skillIdsForBand("above", four)).toEqual(["s1", "s2", "s3"]);
  });

  it("returns [] for empty skills regardless of band", () => {
    for (const band of BASELINE_BANDS) {
      expect(skillIdsForBand(band, [])).toEqual([]);
    }
  });

  it("is additive-prefix only: higher bands extend the same sorted start, never revoke earlier ids", () => {
    // Documented contract for saveBaseline / awardSyntheticMastery:
    // band mapping yields a prefix of sorted skills; applying a stronger band
    // only adds candidates (awardSyntheticMastery itself skips already-mastered).
    const ordered = [
      { id: "entry", sortOrder: 1 },
      { id: "mid", sortOrder: 2 },
      { id: "late", sortOrder: 3 },
    ];
    const wellBelow = skillIdsForBand("well_below", ordered);
    const approaching = skillIdsForBand("approaching", ordered);
    const onGrade = skillIdsForBand("on_grade", ordered);
    const above = skillIdsForBand("above", ordered);

    expect(wellBelow).toEqual([]);
    expect(approaching).toEqual(["entry"]);
    expect(onGrade).toEqual(["entry", "mid"]);
    expect(above).toEqual(["entry", "mid"]);

    // Each stronger (or equal) band's set starts with the weaker band's prefix.
    expect(approaching.slice(0, wellBelow.length)).toEqual(wellBelow);
    expect(onGrade.slice(0, approaching.length)).toEqual(approaching);
    expect(above.slice(0, onGrade.length)).toEqual(onGrade);
  });
});

describe("bands json helpers", () => {
  it("round-trips valid pillar bands", () => {
    const raw = serializeBandsJson({
      phonics: "on_grade",
      fluency: "above",
    });
    expect(parseBandsJson(raw)).toEqual({
      phonics: "on_grade",
      fluency: "above",
    });
  });

  it("drops invalid values", () => {
    expect(
      parseBandsJson(
        JSON.stringify({ phonics: "on_grade", fluency: "legendary" }),
      ),
    ).toEqual({ phonics: "on_grade" });
    expect(parseBandsJson("not-json")).toEqual({});
  });

  it("ignores unknown pillar keys", () => {
    expect(
      parseBandsJson(
        JSON.stringify({ phonics: "below", made_up_pillar: "on_grade" }),
      ),
    ).toEqual({ phonics: "below" });
  });

  it("serializes only known pillars with bands set", () => {
    const raw = serializeBandsJson({
      vocabulary: "approaching",
      comprehension: "well_below",
    });
    expect(JSON.parse(raw)).toEqual({
      vocabulary: "approaching",
      comprehension: "well_below",
    });
  });

  it("recognizes all baseline bands", () => {
    for (const band of BASELINE_BANDS) {
      expect(isBaselineBand(band)).toBe(true);
    }
    expect(isBaselineBand("cut_score")).toBe(false);
    expect(isBaselineBand("")).toBe(false);
  });
});
