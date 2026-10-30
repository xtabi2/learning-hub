import assert from "node:assert/strict";
import test from "node:test";
import { gradeSentence, formatSentence, isAcceptable } from "../src/grade-sentence.js";
import { sentenceSets } from "../src/sentence-sets.js";
import { grades } from "../src/words.js";
import { allClassWords, lessons } from "../src/class-words.js";

const decks = {
  k: grades.find((grade) => grade.id === "k").words,
  1: grades.find((grade) => grade.id === "1").words,
  2: grades.find((grade) => grade.id === "2").words,
  3: grades.find((grade) => grade.id === "3").words,
  "skills-1-25.1": lessons[0].words.map((word) => word.text),
  "skills-2-1.1": lessons[1].words.map((word) => word.text),
  "class-all": allClassWords().map((word) => word.text),
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

test("every word set can make a sentence the grader accepts", () => {
  for (const set of sentenceSets) {
    let found = false;
    for (let size = 3; size <= Math.min(5, set.words.length); size += 1) {
      for (const combo of combinations(set.words, size)) {
        for (const order of permutations(combo)) {
          if (isAcceptable(order.map((word) => word.toLowerCase()))) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }
    assert.equal(found, true, set.words.join(" "));
  }
});

test("every set stays inside its deck and each deck has choices", () => {
  for (const [id, words] of Object.entries(decks)) {
    const have = new Set(words.map((word) => word.toLowerCase()));
    const sets = sentenceSets.filter((set) => set.decks.includes(id));
    assert.ok(sets.length >= 2, `${id} needs more than one set`);
    for (const set of sets) {
      for (const word of set.words) {
        assert.ok(have.has(word.toLowerCase()), `${id} is missing ${word}`);
      }
    }
  }
});

test("class words together include both lessons", () => {
  const have = new Set(decks["class-all"].map((word) => word.toLowerCase()));
  assert.equal(have.has("pigs") && have.has("sheep") && have.has("the"), true);
  assert.equal(new Set(decks["class-all"]).size, decks["class-all"].length);
});
