import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_CHILDREN, GRADES, STORAGE_KEY, createHub, createMemoryStorage, gradeLabel, readingGradeId } from "./index.js";

function fresh() {
  return createHub(createMemoryStorage());
}

test("adds a child and selects them", () => {
  const hub = fresh();
  const child = hub.addChild({ name: "  Ada  ", grade: "1" });
  assert.equal(child.name, "Ada");
  assert.equal(child.grade, "1");
  assert.equal(hub.getCurrentChild().id, child.id);
  assert.equal(hub.listChildren().length, DEFAULT_CHILDREN.length + 1, "defaults kept alongside the new kid");
});

test("rejects an empty name and an unknown grade", () => {
  const hub = fresh();
  assert.throws(() => hub.addChild({ name: "   ", grade: "K" }), /Name/);
  assert.throws(() => hub.addChild({ name: "Bea", grade: "4" }), /Grade/);
  assert.deepEqual(GRADES, ["PreK", "K", "1", "2", "3"]);
});

test("switches and removes the current child", () => {
  const hub = fresh();
  const ada = hub.addChild({ name: "Ada", grade: "K" });
  const bea = hub.addChild({ name: "Bea", grade: "2" });
  assert.equal(hub.getCurrentChild().id, bea.id);
  assert.equal(hub.setCurrentChild(ada.id).name, "Ada");
  hub.removeChild(ada.id);
  assert.equal(hub.getCurrentChild().id, hub.listChildren()[0].id);
  assert.ok(hub.listChildren().some((kid) => kid.id === bea.id));
  for (const kid of hub.listChildren()) hub.removeChild(kid.id);
  assert.equal(hub.getCurrentChild(), null);
  assert.equal(hub.listChildren().length, DEFAULT_CHILDREN.length, "defaults reappear once nothing is saved");
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

test("shows Madison, Sydney, and Wesley when nothing is saved", () => {
  const storage = createMemoryStorage();
  const hub = createHub(storage);
  const kids = hub.listChildren();
  assert.deepEqual(
    kids.map(({ name, age, grade }) => ({ name, age, grade })),
    [
      { name: "Madison", age: 7, grade: "1" },
      { name: "Sydney", age: 5, grade: "PreK" },
      { name: "Wesley", age: 2, grade: "PreK" },
    ],
  );
  assert.equal(DEFAULT_CHILDREN.length, 3);
  assert.equal(hub.getCurrentChild(), null);
  assert.equal(storage.getItem(STORAGE_KEY), null, "listing does not write to storage");
  assert.equal(hub.setCurrentChild("default-sydney").name, "Sydney");
  assert.equal(hub.getCurrentChild().grade, "PreK");
});

test("never overwrites saved profiles with the defaults", () => {
  const storage = createMemoryStorage();
  const saved = { children: [{ id: "x", name: "Zoe", grade: "2", createdAt: "t", progress: {} }], currentId: "x" };
  storage.setItem(STORAGE_KEY, JSON.stringify(saved));
  const hub = createHub(storage);
  assert.deepEqual(hub.listChildren().map((k) => k.name), ["Zoe"]);
  hub.addChild({ name: "Ann", grade: "K" });
  assert.deepEqual(hub.listChildren().map((k) => k.name), ["Zoe", "Ann"]);
});

test("stores and validates age", () => {
  const hub = fresh();
  const kid = hub.addChild({ name: "Lu", grade: "PreK", age: "4" });
  assert.equal(kid.age, 4);
  assert.equal(hub.updateChild(kid.id, { age: 5 }).age, 5);
  assert.throws(() => hub.addChild({ name: "Bad", grade: "K", age: -1 }), /Age/);
  assert.throws(() => hub.addChild({ name: "Bad", grade: "K", age: 2.5 }), /Age/);
  assert.equal(hub.addChild({ name: "NoAge", grade: "K" }).age, undefined);
});

test("Pre-K falls back to the easiest content", () => {
  assert.equal(readingGradeId("PreK"), "k");
  assert.equal(gradeLabel("PreK"), "Pre-K");
  assert.equal(gradeLabel("K"), "Kindergarten");
  assert.equal(gradeLabel("1"), "Grade 1");
});
