import assert from "node:assert/strict";
import test from "node:test";
import {
  CARD_MOTIONS,
  CARD_THEMES,
  HISTORY_SIZE,
  cardBucket,
  findChoices,
  historyKey,
  loadRecent,
  orderByFreshness,
  pickTwist,
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

test("card plans use the theme list and occasional twists", () => {
  assert.equal(pickTwist(0, 3), "find");
  assert.equal(pickTwist(0.2, 3), "flip");
  assert.equal(pickTwist(0.5, 3), "show");
  assert.equal(pickTwist(0, 2), "flip");
  const words = "abcdefghij".split("").map((text) => ({ text }));
  const choices = findChoices(words[0], words, () => 0);
  assert.equal(choices.length, 3);
  assert.ok(choices.some((word) => word.text === "a"));
  const twists = new Set();
  const themes = new Set();
  for (let turn = 0; turn < 8; turn += 1) {
    const plan = planCards(words, ["a", "b"]);
    assert.deepEqual(plan.map((card) => card.word.text).slice(-2).sort(), ["a", "b"]);
    for (const card of plan) {
      assert.ok(CARD_THEMES.includes(card.theme));
      assert.ok(CARD_MOTIONS.includes(card.motion));
      assert.ok(["show", "flip", "find"].includes(card.twist));
      themes.add(card.theme);
      twists.add(card.twist);
      if (card.twist === "find") {
        assert.equal(card.choices.length, 3);
        assert.ok(card.choices.some((word) => word.text === card.word.text));
      }
    }
  }
  assert.ok(themes.size > 1);
  assert.ok(twists.has("find"));
  assert.ok(twists.has("flip"));
  assert.ok(twists.has("show"));
});
