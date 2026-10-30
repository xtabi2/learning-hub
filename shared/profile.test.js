import assert from "node:assert/strict";
import test from "node:test";
import { GRADES, createHub, createMemoryStorage, readingGradeId } from "./index.js";

function fresh() {
  return createHub(createMemoryStorage());
}

test("adds a child and selects them", () => {
  const hub = fresh();
  const child = hub.addChild({ name: "  Ada  ", grade: "1" });
  assert.equal(child.name, "Ada");
  assert.equal(child.grade, "1");
  assert.equal(hub.getCurrentChild().id, child.id);
  assert.equal(hub.listChildren().length, 1);
});

test("rejects an empty name and an unknown grade", () => {
  const hub = fresh();
  assert.throws(() => hub.addChild({ name: "   ", grade: "K" }), /Name/);
  assert.throws(() => hub.addChild({ name: "Bea", grade: "4" }), /Grade/);
  assert.deepEqual(GRADES, ["K", "1", "2", "3"]);
});

test("switches and removes the current child", () => {
  const hub = fresh();
  const ada = hub.addChild({ name: "Ada", grade: "K" });
  const bea = hub.addChild({ name: "Bea", grade: "2" });
  assert.equal(hub.getCurrentChild().id, bea.id);
  assert.equal(hub.setCurrentChild(ada.id).name, "Ada");
  hub.removeChild(ada.id);
  assert.equal(hub.getCurrentChild().id, bea.id);
  hub.removeChild(bea.id);
  assert.equal(hub.getCurrentChild(), null);
});

test("records math level, mastered words, and adventure progress", () => {
  const hub = fresh();
  const child = hub.addChild({ name: "Ada", grade: "K" });
  hub.recordProgress(child.id, { math: { lastMode: "add", lastPct: 90, level: "add" } });
  hub.recordProgress(child.id, { reading: { masteredWords: ["the", "and"] } });
  hub.recordProgress(child.id, { reading: { practicedWords: ["cat"], masteredWords: ["the", "see"] } });
  hub.recordProgress(child.id, {
    adventure: { storyReadingBand: "on_grade", partsCollected: 1, lastOpenedAt: "t1" },
  });
  const progress = hub.getProgress(child.id);
  assert.equal(progress.math.level, "add");
  assert.equal(progress.math.lastPct, 90);
  assert.deepEqual(progress.reading.masteredWords, ["the", "and", "see"]);
  assert.deepEqual(progress.reading.practicedWords, ["cat"]);
  assert.equal(progress.adventure.partsCollected, 1);
  assert.equal(progress.adventure.storyReadingBand, "on_grade");
});

test("maps kindergarten for the sight-word grade buttons", () => {
  assert.equal(readingGradeId("K"), "k");
  assert.equal(readingGradeId("2"), "2");
});
