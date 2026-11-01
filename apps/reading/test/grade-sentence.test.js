import assert from "node:assert/strict";
import test from "node:test";
import { gradeSentence, formatSentence, isAcceptable } from "../src/grade-sentence.js";
import { dealOrder, mixHand, sentenceSets, sentenceTemplateCount, setKey } from "../src/sentence-sets.js";
import { grades } from "../src/words.js";

const decks = {
  k: grades.find((grade) => grade.id === "k").words,
  1: grades.find((grade) => grade.id === "1").words,
  2: grades.find((grade) => grade.id === "2").words,
  3: grades.find((grade) => grade.id === "3").words,
};

function accept(words) {
  const result = gradeSentence(words);
  assert.equal(result.ok, true, `${words.join(" ")} should pass, got ${result.message}`);
}

function reject(words) {
  const result = gradeSentence(words);
  assert.equal(result.ok, false, `${words.join(" ")} should not pass`);
}

test("accepts I can see you and rejects you can see I", () => {
  accept(["I", "can", "see", "you"]);
  accept(["i", "can", "see"]);
  accept(["You", "can", "see"]);
  accept(["I", "see", "you"]);
  reject(["you", "can", "see", "I"]);
  reject(["me", "can", "see", "you"]);
});

test("accepts the pig variants and rejects a broken order", () => {
  accept(["the", "big", "pig", "can", "run"]);
  accept(["the", "pig", "can", "run"]);
  accept(["the", "pigs", "can", "run"]);
  accept(["the", "big", "pigs", "can", "run"]);
  reject(["the", "big", "pig", "run"]);
  reject(["the", "can", "pig", "run"]);
  reject(["pig", "the", "can", "run"]);
  reject(["you", "can", "see", "I"]);
});

test("agreement and object case", () => {
  accept(["He", "is", "little"]);
  accept(["He", "is", "not", "little"]);
  reject(["He", "are", "little"]);
  accept(["I", "am", "little"]);
  accept(["I", "am", "not", "little"]);
  reject(["I", "is", "little"]);
  reject(["I", "are", "little"]);
  accept(["They", "are", "little"]);
  accept(["She", "has", "it"]);
  reject(["He", "have", "it"]);
  accept(["They", "have", "legs"]);
  accept(["The", "pigs", "have", "legs"]);
  accept(["Pigs", "have", "legs"]);
  accept(["The", "strong", "pigs", "run"]);
  accept(["The", "pigs", "run"]);
  accept(["Strong", "pigs", "run"]);
  accept(["Look", "at", "me"]);
  reject(["Look", "at", "I"]);
  accept(["Men", "saw", "her"]);
  reject(["Men", "saw", "she"]);
  accept(["Big", "men", "will", "play"]);
  accept(["People", "go", "home"]);
  accept(["Old", "people", "went", "home"]);
  accept(["Keep", "warm", "today"]);
  accept(["Keep", "clean", "today"]);
  reject(["Warm", "keep", "today"]);
  accept(["I", "can", "be", "little"]);
  accept(["She", "says", "it"]);
  reject(["They", "says", "it"]);
  reject(["I", "can", "be"]);
  accept(["This", "word", "is", "little"]);
  accept(["This", "is", "little"]);
  accept(["Draw", "together", "today"]);
  accept(["Never", "laugh", "today"]);
  accept(["Better", "try", "today"]);
  accept(["Never", "draw", "together", "today"]);
  reject(["Better", "fall", "today"]);
  accept(["People", "must", "go", "home"]);
  accept(["Our", "man", "will", "play"]);
  accept(["Seven", "men", "could", "draw"]);
});

test("formats a capital and a period", () => {
  assert.equal(formatSentence(["i", "can", "see", "you"]), "I can see you.");
  assert.equal(formatSentence(["the", "pigs", "run"]), "The pigs run.");
  assert.equal(formatSentence([]), "");
});

test("asks for more words when the line is too short", () => {
  assert.equal(gradeSentence(["I", "can"]).message, "Use 3 or 4 words.");
});

function permutations(items) {
  if (items.length <= 1) return [items];
  const out = [];
  items.forEach((item, index) => {
    const rest = items.filter((_, itemIndex) => itemIndex !== index);
    for (const perm of permutations(rest)) out.push([item, ...perm]);
  });
  return out;
}

function combinations(items, count) {
  if (count === 0) return [[]];
  if (items.length < count) return [];
  const [first, ...rest] = items;
  return [
    ...combinations(rest, count).map((combo) => combo),
    ...combinations(rest, count - 1).map((combo) => [first, ...combo]),
  ];
}

function canFormSentence(words) {
  const lower = words.map((word) => word.toLowerCase());
  for (const size of [3, 4]) {
    if (lower.length < size) continue;
    for (const combo of combinations(lower, size)) {
      for (const order of permutations(combo)) {
        if (isAcceptable(order)) return true;
      }
    }
  }
  return false;
}

test("every word set can make a 3 or 4 word sentence the grader accepts", () => {
  assert.ok(sentenceTemplateCount >= 80, `only ${sentenceTemplateCount} templates`);
  for (const set of sentenceSets) {
    assert.equal(set.words.length, 4, set.words.join(" "));
    assert.equal(new Set(set.words.map((word) => word.toLowerCase())).size, set.words.length);
    assert.equal(canFormSentence(set.words), true, set.words.join(" "));
  }
});

test("every set stays inside its deck and each deck has choices", () => {
  for (const [id, words] of Object.entries(decks)) {
    const have = new Set(words.map((word) => word.toLowerCase()));
    const sets = sentenceSets.filter((set) => set.decks.includes(id));
    assert.ok(sets.length >= 12, `${id} has ${sets.length} sets`);
    for (const set of sets) {
      for (const word of set.words) {
        assert.ok(have.has(word.toLowerCase()), `${id} is missing ${word}`);
      }
    }
  }
});

test("many random deals can form a sentence for every grade", () => {
  for (const [id, words] of Object.entries(decks)) {
    const have = new Set(words.map((word) => word.toLowerCase()));
    const seen = new Set();
    const openers = new Set();
    for (let turn = 0; turn < 40; turn += 1) {
      const queue = dealOrder(words);
      assert.ok(queue.length >= 12, `${id} has ${queue.length} hands`);
      const hand = mixHand(queue[0].words);
      assert.deepEqual(
        [...hand].map((word) => word.toLowerCase()).sort(),
        [...queue[0].words].map((word) => word.toLowerCase()).sort(),
      );
      for (const word of hand) assert.ok(have.has(word.toLowerCase()), `${id} dealt ${word}`);
      assert.equal(canFormSentence(hand), true, hand.join(" "));
      seen.add(setKey(queue[0]));
      openers.add(setKey(queue[0]));
    }
    assert.ok(seen.size >= 5, `${id} dealt ${seen.size} unique hands`);
    assert.ok(openers.size > 1, `${id} reused one opening hand`);
  }
});

test("recent sentences are dealt after fresh ones", () => {
  const words = decks.k;
  const recent = dealOrder(words).slice(0, 6).map(setKey);
  const next = dealOrder(words, recent, () => 0);
  let seenRecent = false;
  for (const key of next.map(setKey)) {
    if (recent.includes(key)) seenRecent = true;
    else assert.equal(seenRecent, false);
  }
  assert.equal(seenRecent, true);
});

test("1st grade deck has class words once each", () => {
  const have = new Set(decks[1].map((word) => word.toLowerCase()));
  assert.equal(have.has("pigs") && have.has("sheep") && have.has("long"), true);
  assert.equal(new Set(decks[1]).size, decks[1].length);
});
