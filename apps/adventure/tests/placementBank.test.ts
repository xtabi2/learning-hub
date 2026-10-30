import { describe, expect, it } from "vitest";
import {
  PLACEMENT_BANK,
  PLACEMENT_LEVELS,
  PLACEMENT_SKILLS,
  PLACEMENT_SKILL_LABELS,
  drawPlacementQuiz,
  getPlacementQuestion,
  gradePlacementAnswers,
} from "../src/lib/placementBank";
import { deriveStartBandFromPillarHits } from "../src/lib/storyReadingBand";
import { toSafeRunSeed } from "../src/lib/runSeed";

describe("placement bank", () => {
  it("has 30+ questions with unique ids and unique options", () => {
    expect(PLACEMENT_BANK.length).toBeGreaterThanOrEqual(30);
    expect(new Set(PLACEMENT_BANK.map((q) => q.id)).size).toBe(PLACEMENT_BANK.length);
    for (const q of PLACEMENT_BANK) {
      const opts = [q.correct, ...q.distractors].map((o) => o.toLowerCase());
      expect(new Set(opts).size).toBe(4);
    }
  });
  it("covers every skill at every level and keeps parent labels", () => {
    for (const s of PLACEMENT_SKILLS) {
      expect(PLACEMENT_SKILL_LABELS[s]).toBeTruthy();
      for (const l of PLACEMENT_LEVELS)
        expect(PLACEMENT_BANK.some((q) => q.skill === s && q.level === l)).toBe(true);
    }
  });
});

describe("stratified draw", () => {
  it("draws 10 unique items covering all skills and levels, every time", () => {
    for (let i = 0; i < 300; i++) {
      const quiz = drawPlacementQuiz();
      expect(quiz).toHaveLength(10);
      expect(new Set(quiz.map((q) => q.id)).size).toBe(10);
      const qs = quiz.map((q) => getPlacementQuestion(q.id)!);
      for (const s of PLACEMENT_SKILLS) expect(qs.some((q) => q.skill === s)).toBe(true);
      for (const l of PLACEMENT_LEVELS) expect(qs.some((q) => q.level === l)).toBe(true);
    }
  });
  it("varies quizzes and correct-answer positions across attempts", () => {
    const sets = new Set<string>();
    const positions = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const quiz = drawPlacementQuiz();
      sets.add(quiz.map((q) => q.id).sort().join());
      for (const item of quiz)
        positions.add(item.options.indexOf(getPlacementQuestion(item.id)!.correct));
    }
    expect(sets.size).toBeGreaterThan(1);
    expect(positions).toEqual(new Set([0, 1, 2, 3]));
  });
  it("does not leak the answer key to the client payload", () => {
    for (const item of drawPlacementQuiz())
      expect(Object.keys(item).sort()).toEqual(["id", "options", "prompt"]);
  });
});

describe("grading by value", () => {
  it("grades by answer value regardless of shuffled position", () => {
    const quiz = drawPlacementQuiz();
    const answers = quiz.map((q) => ({ itemId: q.id, answer: getPlacementQuestion(q.id)!.correct }));
    expect(gradePlacementAnswers(answers).correctCount).toBe(10);
    const first = quiz.map((q) => ({ itemId: q.id, answer: q.options[0]! }));
    const expected = quiz.filter((q) => q.options[0] === getPlacementQuestion(q.id)!.correct).length;
    expect(gradePlacementAnswers(first).correctCount).toBe(expected);
  });
  it("ignores unknown ids, duplicates and numeric indexes", () => {
    const q = PLACEMENT_BANK[0]!;
    const r = gradePlacementAnswers([
      { itemId: q.id, answer: q.correct },
      { itemId: q.id, answer: q.correct },
      { itemId: "nope", answer: "x" },
      { itemId: PLACEMENT_BANK[1]!.id, answer: "0" },
    ]);
    expect(r.graded).toBe(2);
    expect(r.correctCount).toBe(1);
  });
  it("feeds the existing accuracy -> storyReadingBand mapping", () => {
    const all = PLACEMENT_BANK.slice(0, 10).map((q) => ({ itemId: q.id, answer: q.correct }));
    expect(deriveStartBandFromPillarHits(gradePlacementAnswers(all).pillarHits)).toBe(
      deriveStartBandFromPillarHits({ x: { correct: 10, total: 10 } }),
    );
  });
});

describe("save path: runSeed fits Prisma Int (i32)", () => {
  it("clamps unsigned 32-bit hashes", () => {
    for (const h of [0, 1, 2298598178, 4294967295, -5, 2147483647])
      expect(toSafeRunSeed(h)).toBeGreaterThan(0), expect(toSafeRunSeed(h)).toBeLessThanOrEqual(2147483647);
  });
});
