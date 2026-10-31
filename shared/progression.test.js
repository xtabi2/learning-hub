import assert from "node:assert/strict";
import test from "node:test";
import { KNOWN_KIDS, STORAGE_KEY, ageFrom, createHub, createMemoryStorage, getLevel, gradeFromKStart, schoolYear, yearProgress } from "./index.js";

const d = (y, m, day) => new Date(y, m - 1, day, 12);
const kid = (name) => ({ name, ...KNOWN_KIDS[name.toLowerCase()] });

test("school year rolls over on Aug 15", () => {
  assert.equal(schoolYear(d(2026, 8, 14)), 2025);
  assert.equal(schoolYear(d(2026, 8, 15)), 2026);
  assert.equal(schoolYear(d(2027, 1, 10)), 2026);
  assert.equal(gradeFromKStart(2025, d(2026, 8, 14)), "K");
  assert.equal(gradeFromKStart(2025, d(2026, 8, 15)), "1");
});

test("years before K are Pre-K and 4+ years after K stay 3rd", () => {
  assert.equal(gradeFromKStart(2027, d(2026, 10, 31)), "PreK");
  assert.equal(gradeFromKStart(2022, d(2026, 10, 31)), "3");
  assert.equal(gradeFromKStart(2018, d(2026, 10, 31)), "3");
});

test("progress ramps from 0 on Aug 15 to 1 by spring and stays 1 in summer", () => {
  assert.equal(yearProgress(d(2026, 8, 15)), 0);
  assert.equal(yearProgress(d(2026, 10, 31)), 0.32);
  assert.ok(yearProgress(d(2027, 1, 15)) > 0.6 && yearProgress(d(2027, 1, 15)) < 0.75);
  assert.equal(yearProgress(d(2027, 4, 30)), 1);
  assert.equal(yearProgress(d(2027, 8, 14)), 1);
});

test("each kid as of Oct 31, 2026", () => {
  const day = d(2026, 10, 31);
  assert.deepEqual(getLevel(kid("Madison"), day), { grade: "1", progress: 0.32 });
  assert.deepEqual(getLevel(kid("Sydney"), day), { grade: "PreK", progress: 0.32 });
  assert.deepEqual(getLevel(kid("Wesley"), day), { grade: "PreK", progress: 0.32 });
  assert.equal(ageFrom(kid("Madison"), day), 7);
  assert.equal(ageFrom(kid("Sydney"), day), 5);
  assert.equal(ageFrom(kid("Wesley"), day), 2);
});

test("each kid across rollovers", () => {
  assert.equal(getLevel(kid("Madison"), d(2027, 8, 15)).grade, "2");
  assert.equal(getLevel(kid("Madison"), d(2030, 9, 1)).grade, "3");
  assert.equal(getLevel(kid("Sydney"), d(2027, 8, 14)).grade, "PreK");
  assert.equal(getLevel(kid("Sydney"), d(2027, 8, 15)).grade, "K");
  assert.equal(getLevel(kid("Wesley"), d(2029, 8, 15)).grade, "K");
  assert.equal(ageFrom(kid("Madison"), d(2026, 9, 30)), 6);
});

test("manual grade override wins", () => {
  assert.equal(getLevel({ ...kid("Sydney"), gradeOverride: "K" }, d(2026, 10, 31)).grade, "K");
  assert.deepEqual(getLevel({ grade: "2" }, d(2026, 10, 31)), { grade: "2", progress: 1 });
});

test("load fills missing birthday and K start by name without overwriting", () => {
  const storage = createMemoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({ currentId: "a", children: [
    { id: "a", name: "Madison", grade: "1", avatar: "cat" },
    { id: "b", name: "sydney", grade: "PreK", avatar: "bunny", kStartYear: 2026 },
    { id: "c", name: "Zoe", grade: "2", avatar: "fox" },
  ] }));
  const kids = createHub(storage).listChildren();
  assert.equal(kids[0].kStartYear, 2025);
  assert.equal(kids[0].birthYear, 2019);
  assert.equal(kids[1].kStartYear, 2026);
  assert.equal(kids[1].birthMonth, 9);
  assert.equal(kids[2].kStartYear, undefined);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).children[0].birthMonth, 10);
});

test("addChild takes birthday, K start and optional override", () => {
  const hub = createHub(createMemoryStorage());
  const kid1 = hub.addChild({ name: "Ava", birthMonth: "3", birthYear: "2020", kStartYear: "2025", avatar: "owl" });
  assert.equal(kid1.kStartYear, 2025);
  assert.equal(kid1.gradeOverride, undefined);
  assert.ok(["K", "1"].includes(kid1.grade));
  const kid2 = hub.addChild({ name: "Ben", kStartYear: 2025, gradeOverride: "3", grade: "3" });
  assert.equal(getLevel(kid2).grade, "3");
  assert.throws(() => hub.addChild({ name: "Cy" }), /grade/);
  assert.throws(() => hub.addChild({ name: "Di", kStartYear: 2025, birthMonth: 13, birthYear: 2020 }), /month/);
});
