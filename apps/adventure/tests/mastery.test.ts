import { describe, expect, it } from "vitest";
import {
  buildUnlockMap,
  computeMastery,
  isSkillUnlocked,
  updateStreak,
  weakestPillars,
} from "../src/lib/mastery";
import { MASTERY_THRESHOLD, MASTERY_WINDOW } from "../src/lib/constants";

function attempt(skillId: string, correct: boolean, minutesAgo: number) {
  return {
    skillId,
    correct,
    createdAt: new Date(Date.now() - minutesAgo * 60_000),
  };
}

describe("mastery constants", () => {
  it("uses an 80% threshold over a 10-item window", () => {
    expect(MASTERY_THRESHOLD).toBe(0.8);
    expect(MASTERY_WINDOW).toBe(10);
  });
});

describe("computeMastery", () => {
  it("is not mastered with no attempts (empty window)", () => {
    const result = computeMastery([], "rhyme");
    expect(result).toEqual({
      percent: 0,
      windowSize: 0,
      correct: 0,
      mastered: false,
    });
  });

  it("stays locked when the window is not yet full, even at 100%", () => {
    const attempts = Array.from({ length: 8 }, (_, i) =>
      attempt("rhyme", true, i),
    );
    const result = computeMastery(attempts, "rhyme");
    expect(result.windowSize).toBe(8);
    expect(result.percent).toBe(1);
    expect(result.mastered).toBe(false);
  });

  it("masters a skill at exactly 80% over a full window", () => {
    const attempts = [
      ...Array.from({ length: 8 }, (_, i) => attempt("rhyme", true, i)),
      attempt("rhyme", false, 8),
      attempt("rhyme", false, 9),
    ];
    const result = computeMastery(attempts, "rhyme");
    expect(result.windowSize).toBe(10);
    expect(result.correct).toBe(8);
    expect(result.percent).toBe(0.8);
    expect(result.mastered).toBe(true);
  });

  it("does not master at 70% over a full window", () => {
    const attempts = [
      ...Array.from({ length: 7 }, (_, i) => attempt("rhyme", true, i)),
      ...Array.from({ length: 3 }, (_, i) => attempt("rhyme", false, 7 + i)),
    ];
    const result = computeMastery(attempts, "rhyme");
    expect(result.percent).toBe(0.7);
    expect(result.mastered).toBe(false);
  });

  it("ignores attempts outside the recent window", () => {
    const oldMisses = Array.from({ length: 10 }, (_, i) =>
      attempt("rhyme", false, 100 + i),
    );
    const recentHits = Array.from({ length: 10 }, (_, i) =>
      attempt("rhyme", true, i),
    );
    const result = computeMastery([...oldMisses, ...recentHits], "rhyme");
    expect(result.percent).toBe(1);
    expect(result.mastered).toBe(true);
  });

  it("only counts attempts for the requested skill", () => {
    const rhyme = Array.from({ length: 10 }, (_, i) =>
      attempt("rhyme", true, i),
    );
    const blend = Array.from({ length: 10 }, (_, i) =>
      attempt("blend", false, i),
    );
    expect(computeMastery([...rhyme, ...blend], "rhyme").mastered).toBe(true);
    expect(computeMastery([...rhyme, ...blend], "blend").mastered).toBe(false);
  });

  it("uses recent misses to drop a previously mastered skill below the gate", () => {
    const history = [
      ...Array.from({ length: 10 }, (_, i) => attempt("rhyme", true, 20 + i)),
      ...Array.from({ length: 6 }, (_, i) => attempt("rhyme", false, i)),
    ];
    const result = computeMastery(history, "rhyme");
    expect(result.windowSize).toBe(10);
    expect(result.correct).toBe(4);
    expect(result.mastered).toBe(false);
  });

  it("honors custom threshold and window options", () => {
    const attempts = Array.from({ length: 5 }, (_, i) =>
      attempt("rhyme", true, i),
    );
    expect(
      computeMastery(attempts, "rhyme", { window: 5, threshold: 1 }).mastered,
    ).toBe(true);
    expect(
      computeMastery(attempts, "rhyme", { window: 5, threshold: 1.01 }).mastered,
    ).toBe(false);
  });

  it("treats a single-skill empty filter as an empty window", () => {
    const other = Array.from({ length: 10 }, (_, i) =>
      attempt("other", true, i),
    );
    expect(computeMastery(other, "rhyme")).toEqual({
      percent: 0,
      windowSize: 0,
      correct: 0,
      mastered: false,
    });
  });
});

describe("isSkillUnlocked / buildUnlockMap", () => {
  const rhyme = { id: "rhyme", prerequisiteSkillId: null };
  const begin = { id: "begin", prerequisiteSkillId: "rhyme" };
  const segment = { id: "segment", prerequisiteSkillId: "begin" };

  it("unlocks a skill with no prerequisite", () => {
    expect(isSkillUnlocked(rhyme, {})).toBe(true);
  });

  it("keeps a node locked until its prerequisite is mastered", () => {
    expect(isSkillUnlocked(begin, {})).toBe(false);
    expect(isSkillUnlocked(begin, { rhyme: false })).toBe(false);
    expect(isSkillUnlocked(begin, { rhyme: true })).toBe(true);
  });

  it("does not unlock later nodes when only the first skill is mastered", () => {
    const unlocked = buildUnlockMap([rhyme, begin, segment], { rhyme: true });
    expect(unlocked).toEqual({
      rhyme: true,
      begin: true,
      segment: false,
    });
  });

  it("unlocks the path as each prerequisite is mastered", () => {
    const unlocked = buildUnlockMap([rhyme, begin, segment], {
      rhyme: true,
      begin: true,
    });
    expect(unlocked.segment).toBe(true);
  });

  it("keeps the whole chain locked when mastery map is empty", () => {
    const unlocked = buildUnlockMap([rhyme, begin, segment], {});
    expect(unlocked).toEqual({
      rhyme: true,
      begin: false,
      segment: false,
    });
  });

  it("does not treat missing prerequisite keys as mastered", () => {
    expect(
      isSkillUnlocked(
        { id: "child", prerequisiteSkillId: "missing" },
        { other: true },
      ),
    ).toBe(false);
  });
});

describe("weakestPillars", () => {
  it("returns the lowest-scoring pillars first", () => {
    expect(
      weakestPillars({
        phonics: 0.9,
        fluency: 0.2,
        vocabulary: 0.5,
      }),
    ).toEqual(["fluency", "vocabulary"]);
  });

  it("respects an explicit count and handles empty input", () => {
    expect(weakestPillars({ a: 0.1, b: 0.2, c: 0.3 }, 1)).toEqual(["a"]);
    expect(weakestPillars({}, 2)).toEqual([]);
  });
});

describe("updateStreak", () => {
  it("starts a streak on the first practice day", () => {
    expect(updateStreak(null, new Date("2026-09-05T12:00:00"), 0)).toBe(1);
  });

  it("increments when practice happens on consecutive days", () => {
    expect(
      updateStreak(
        new Date("2026-09-04T18:00:00"),
        new Date("2026-09-05T09:00:00"),
        3,
      ),
    ).toBe(4);
  });

  it("holds the streak when practicing again the same day", () => {
    expect(
      updateStreak(
        new Date("2026-09-05T08:00:00"),
        new Date("2026-09-05T20:00:00"),
        2,
      ),
    ).toBe(2);
  });

  it("resets after a missed day", () => {
    expect(
      updateStreak(
        new Date("2026-09-02T12:00:00"),
        new Date("2026-09-05T12:00:00"),
        6,
      ),
    ).toBe(1);
  });

  it("bumps a zero same-day streak to at least 1", () => {
    expect(
      updateStreak(
        new Date("2026-09-05T08:00:00"),
        new Date("2026-09-05T09:00:00"),
        0,
      ),
    ).toBe(1);
  });
});
