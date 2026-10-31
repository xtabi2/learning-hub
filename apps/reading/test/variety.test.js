import assert from "node:assert/strict";
import test from "node:test";
import {
  CARD_MOTIONS,
  CARD_THEMES,
  HISTORY_SIZE,
  cardBucket,
  historyKey,
  loadRecent,
  orderByFreshness,
  planCards,
  rememberRecent,
  sentenceBucket,
  shuffle,
} from "../src/variety.js";

function memory() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
  };
}

test("shuffle is Fisher-Yates and does not keep a fixed order", () => {
  const items = ["a", "b", "c", "d"];
  assert.deepEqual(shuffle(items, () => 0), ["b", "c", "d", "a"]);
  assert.deepEqual(shuffle(items, () => 0.999999), ["a", "b", "c", "d"]);
  assert.deepEqual(items, ["a", "b", "c", "d"]);
  const orders = new Set();
  for (let turn = 0; turn < 20; turn += 1) orders.add(shuffle(items).join());
  assert.ok(orders.size > 1);
});

test("recent items are shuffled behind fresh ones", () => {
  const ordered = orderByFreshness(["a", "b", "c", "d"], ["b", "d"], (item) => item, () => 0);
  assert.deepEqual(ordered, ["c", "a", "d", "b"]);
  const samples = new Set();
  for (let turn = 0; turn < 12; turn += 1) {
    const next = orderByFreshness(["a", "b", "c", "d", "e", "f", "g", "h"], ["h"], (item) => item);
    assert.equal(next.at(-1), "h");
    samples.add(next.join());
  }
  assert.ok(samples.size > 1);
});

test("recent history is stored per child and gives those cards lower priority", () => {
  const store = memory();
  rememberRecent(store, "kid-a", cardBucket("k"), "The");
  rememberRecent(store, "kid-a", cardBucket("k"), "and");
  assert.deepEqual(loadRecent(store, "kid-a", cardBucket("k")), ["the", "and"]);
  assert.deepEqual(loadRecent(store, "kid-b", cardBucket("k")), []);
  assert.equal(store.getItem(historyKey(null)), null);
  const words = ["the", "and", "see", "you", "can"].map((text) => ({ text }));
  const plan = planCards(words, loadRecent(store, "kid-a", cardBucket("k")), () => 0);
  assert.deepEqual(plan.map((card) => card.word.text).slice(-2).sort(), ["and", "the"]);
  store.setItem(historyKey("kid-a"), "not-json");
  assert.deepEqual(loadRecent(store, "kid-a", cardBucket("k")), []);
  for (let turn = 0; turn < 50; turn += 1) rememberRecent(store, "kid-a", sentenceBucket("1"), `w${turn}`);
  const saved = loadRecent(store, "kid-a", sentenceBucket("1"));
  assert.equal(saved.length, HISTORY_SIZE);
  assert.equal(saved.at(-1), "w49");
});

test("every flash card is one word with a color and an entrance", () => {
  const words = "long under good big play men".split(" ").map((text) => ({ text }));
  const themes = new Set();
  for (let turn = 0; turn < 20; turn += 1) {
    const plan = planCards(words);
    assert.equal(plan.length, words.length);
    for (const card of plan) {
      assert.equal(typeof card.word.text, "string");
      assert.equal(Object.hasOwn(card, "twist"), false);
      assert.equal(Object.hasOwn(card, "choices"), false);
      assert.ok(CARD_THEMES.includes(card.theme));
      assert.ok(CARD_MOTIONS.includes(card.motion));
      themes.add(card.theme);
    }
  }
  assert.ok(themes.size > 1);
  for (const card of planCards(words, [], () => 0)) {
    assert.equal(Object.hasOwn(card, "twist"), false);
    assert.equal(Object.hasOwn(card, "choices"), false);
    assert.equal(typeof card.word.text, "string");
  }
});

test("stale find and flip records in localStorage cannot change the card", () => {
  const store = memory();
  store.setItem(historyKey("kid"), JSON.stringify({
    [cardBucket("1")]: [
      { text: "long", twist: "find", choices: ["long", "under", "good"] },
      { word: { text: "under" }, twist: "flip" },
      "good",
    ],
    session: { twist: "find", choices: ["long", "under", "good"] },
  }));
  const recent = loadRecent(store, "kid", cardBucket("1"));
  assert.deepEqual(recent, ["long", "under", "good"]);
  const saved = JSON.parse(store.getItem(historyKey("kid")));
  assert.deepEqual(saved, { [cardBucket("1")]: ["long", "under", "good"] });
  assert.equal(JSON.stringify(saved).includes("find"), false);
  assert.equal(JSON.stringify(saved).includes("flip"), false);
  assert.equal(JSON.stringify(saved).includes("choices"), false);
  const words = ["long", "under", "good", "big"].map((text) => ({ text }));
  const plan = planCards(words, recent, () => 0);
  assert.equal(plan.some((card) => card.twist || card.choices), false);
  assert.ok(plan.every((card) => typeof card.word.text === "string"));
  assert.deepEqual(plan.map((card) => card.word.text).slice(-3).sort(), ["good", "long", "under"]);
});
