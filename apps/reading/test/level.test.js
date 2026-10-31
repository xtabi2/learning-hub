import assert from "node:assert/strict";
import test from "node:test";
import { grades, wordsForLevel } from "../src/words.js";
import { storyLevelFor } from "../src/stories.js";

const list = (id) => grades.find((g) => g.id === id).words;
const allowed = new Set(grades.flatMap((g) => g.words));

test("sight words stay inside the lists and grow through the year in order", () => {
  for (const grade of ["PreK", "K", "1", "2", "3"]) {
    let prev = 0;
    for (const progress of [0, 0.32, 0.6, 1]) {
      const words = wordsForLevel({ grade, progress });
      assert.ok(words.every((w) => allowed.has(w)), grade);
      assert.ok(words.length >= prev);
      prev = words.length;
    }
  }
});

test("early 1st grade reviews all K words plus the start of the 1st grade list", () => {
  const words = wordsForLevel({ grade: "1", progress: 0.32 });
  for (const w of list("k")) assert.ok(words.includes(w));
  const g1 = list("1");
  const n = Math.ceil(g1.length * 0.32);
  for (const w of g1.slice(0, n)) assert.ok(words.includes(w));
  assert.ok(!words.includes(g1[g1.length - 1]) || list("k").includes(g1[g1.length - 1]));
  const full = wordsForLevel({ grade: "1", progress: 1 });
  for (const w of g1) assert.ok(full.includes(w));
});

test("Pre-K gets a small slice of the K list from its start", () => {
  const words = wordsForLevel({ grade: "PreK", progress: 0.32 });
  assert.deepEqual(words, list("k").slice(0, words.length));
  assert.ok(words.length >= 10 && words.length < list("k").length);
});

test("story level reviews last year early on", () => {
  assert.equal(storyLevelFor({ grade: "1", progress: 0.32 }), "k");
  assert.equal(storyLevelFor({ grade: "1", progress: 0.5 }), "1");
  assert.equal(storyLevelFor({ grade: "PreK", progress: 0.32 }), "k");
  assert.equal(storyLevelFor({ grade: "3", progress: 0.1 }), "2");
});
