// Word cards for Build a Sentence. Every hand uses words from one deck and
// still contains a 3 or 4 word sentence the grader accepts.
// Templates expand into many hands. A session shuffles them and saves the
// ones a child just saw so the next visit starts somewhere else.

import { gradeSentence, isAcceptable } from "./grade-sentence.js";
import { grades } from "./words.js";
import { orderByFreshness, shuffle } from "./variety.js";

function asSet(list) {
  return new Set(list.map((word) => (typeof word === "string" ? word : word.text).toLowerCase()));
}

const deckWords = {};
for (const grade of grades) deckWords[grade.id] = asSet(grade.words);
// A 1st grader's own deck also reviews Kindergarten words (used for the class-word sentences).
deckWords["1-review"] = asSet([...grades[0].words, ...grades[1].words]);

const hands = new Map();
let sentenceTemplateCount = 0;

function commit(must, words) {
  const decks = Object.keys(deckWords).filter((id) => words.every((word) => deckWords[id].has(word.toLowerCase())));
  if (must.some((id) => !decks.includes(id))) {
    throw new Error(`${must.join(",")} does not contain: ${words.join(" ")}`);
  }
  const key = words.map((word) => word.toLowerCase()).sort().join("|");
  const prev = hands.get(key);
  if (prev) {
    prev.decks = [...new Set([...prev.decks, ...decks])];
    return;
  }
  hands.set(key, { decks, words: [...words] });
}

function addSentence(must, words, extras = []) {
  const lower = words.map((word) => word.toLowerCase());
  if (new Set(lower).size !== lower.length) return;
  if (words.length < 3 || words.length > 4) {
    throw new Error(`Bad length: ${words.join(" ")}`);
  }
  if (!isAcceptable(lower)) {
    throw new Error(`Not acceptable: ${words.join(" ")}`);
  }
  sentenceTemplateCount += 1;
  if (words.length === 4) {
    commit(must, words);
    return;
  }
  let added = 0;
  for (const extra of extras) {
    if (lower.includes(extra.toLowerCase())) continue;
    commit(must, [...words, extra]);
    added += 1;
  }
  if (!added) throw new Error(`No extra word for: ${words.join(" ")}`);
}

function pairs(list, use) {
  for (let left = 0; left < list.length; left += 1) {
    for (let right = left + 1; right < list.length; right += 1) use(list[left], list[right]);
  }
}

const SEE_WHO = ["I", "we", "you", "they", "he", "she", "it", "this"];
const SEE_WHAT = ["me", "you", "it", "us"];
const BE_WHO = ["I", "you", "he", "she", "we", "they"];
const ADJ = ["little", "funny", "blue", "yellow"];
const SG = ["he", "she", "it", "this", "that"];
const PL = ["you", "we", "they"];

for (const who of SEE_WHO) {
  for (const what of SEE_WHAT) addSentence(["k"], [who, "can", "see", what]);
}
for (const who of BE_WHO) {
  for (const look of ADJ) addSentence(["k"], [who, "can", "be", look]);
}
for (const who of SG) {
  for (const look of ADJ) {
    addSentence(["k"], [who, "is", "not", look]);
    addSentence(["k"], [who, "was", "not", look]);
  }
}
for (const who of PL) {
  for (const look of ADJ) {
    addSentence(["k"], [who, "are", "not", look]);
    addSentence(["k"], [who, "were", "not", look]);
  }
}
for (const look of ADJ) {
  addSentence(["k"], ["I", "am", "not", look]);
  addSentence(["k"], ["I", "was", "not", look]);
}
for (const det of ["the", "a", "my", "his", "your", "this", "that"]) {
  for (const look of ["little", "funny", "blue"]) addSentence(["k"], [det, "word", "is", look]);
}
for (const who of ["he", "she", "this", "that"]) {
  for (const what of ["me", "you", "it"]) addSentence(["k"], [who, "says", what], ["not"]);
  addSentence(["k"], [who, "has", "it"], ["not"]);
}
for (const who of ["I", "we", "you", "they", "he", "she"]) {
  for (const what of ["me", "you", "it"]) addSentence(["k"], [who, "can", "like", what]);
}
for (const who of ["I", "we", "you", "they"]) {
  for (const what of ["me", "you", "it"]) addSentence(["k"], [who, "see", what], ["not"]);
  addSentence(["k"], [who, "look", "up"], ["not"]);
  addSentence(["k"], [who, "look", "out"], ["not"]);
}
for (const what of ["me", "you", "it", "us"]) addSentence(["k"], ["look", "at", what], ["the", "you", "me"]);
for (const who of ["I", "he", "she", "we", "they"]) {
  addSentence(["k"], [who, "had", "it"], ["not"]);
  for (const what of ["it", "you"]) addSentence(["k"], [who, "said", what], ["not"]);
}

const MEN_MODAL = ["will", "could", "should", "may", "would"];
const MEN_VERB = ["play", "drink", "start", "draw", "write"];
const MEN_OBJ = ["her", "him", "them"];
const MEN_PAST = ["saw", "found", "got"];
const MEN_DET = ["some", "our", "seven"];
const MEN_ADJ = ["good", "big"];

for (const det of MEN_DET) {
  for (const modal of MEN_MODAL) {
    for (const verb of MEN_VERB) addSentence(["1"], [det, "men", modal, verb]);
  }
}
for (const adj of MEN_ADJ) {
  for (const modal of MEN_MODAL) {
    for (const verb of MEN_VERB) addSentence(["1"], [adj, "men", modal, verb]);
  }
}
for (const modal of MEN_MODAL) {
  for (const verb of ["play", "start", "draw", "write"]) {
    addSentence(["1"], ["men", modal, verb, "today"]);
    addSentence(["1"], ["men", modal, verb, "soon"]);
  }
}
for (const adj of MEN_ADJ) {
  for (const past of MEN_PAST) {
    for (const obj of MEN_OBJ) addSentence(["1"], [adj, "men", past, obj]);
  }
}
for (const det of ["some", "our"]) {
  for (const past of MEN_PAST) {
    for (const obj of MEN_OBJ) addSentence(["1"], [det, "men", past, obj]);
  }
}
for (const modal of MEN_MODAL) {
  for (const verb of MEN_VERB) addSentence(["1"], ["our", "man", modal, verb]);
}
for (const past of MEN_PAST) {
  for (const obj of MEN_OBJ) addSentence(["1"], ["our", "man", past, obj]);
}
for (const verb of MEN_VERB) {
  addSentence(["1"], ["good", "men", verb, "today"]);
  addSentence(["1"], ["big", "men", verb, "today"]);
  addSentence(["1"], ["some", "men", verb, "today"]);
}
for (const obj of MEN_OBJ) {
  addSentence(["1"], ["good", "men", "thank", obj]);
  addSentence(["1"], ["some", "men", "thank", obj]);
  addSentence(["1"], ["our", "men", "thank", obj]);
  addSentence(["1"], ["men", "thank", obj], ["today", "big"]);
}
for (const past of MEN_PAST) {
  for (const obj of MEN_OBJ) addSentence(["1"], ["men", past, obj], ["today"]);
}

const PEOPLE = [
  ["old", "people"],
  ["kind", "people"],
  ["many", "people"],
  ["small", "people"],
  ["these", "people"],
  ["both", "people"],
  ["great", "people"],
  ["new", "people"],
  ["special", "people"],
];
const TRIPS = [
  ["go", "home"],
  ["go", "away"],
  ["come", "here"],
  ["come", "home"],
  ["walk", "home"],
  ["walk", "away"],
  ["live", "here"],
  ["went", "home"],
  ["went", "away"],
  ["came", "home"],
  ["came", "here"],
  ["fly", "away"],
  ["work", "here"],
  ["read", "here"],
  ["eat", "here"],
  ["help", "here"],
  ["try", "again"],
  ["grow", "well"],
];
const MUST = [
  ["go", "home"],
  ["go", "away"],
  ["come", "here"],
  ["come", "home"],
  ["walk", "home"],
  ["eat", "here"],
  ["read", "here"],
  ["help", "here"],
  ["try", "again"],
  ["live", "here"],
  ["work", "here"],
];

for (const subject of PEOPLE) {
  for (const [verb, place] of TRIPS) addSentence(["2"], [...subject, verb, place]);
}
for (const [verb, place] of MUST) {
  addSentence(["2"], ["people", "must", verb, place]);
  addSentence(["2"], ["kind", "people", "must", verb]);
}
for (const verb of ["go", "come"]) {
  for (const place of ["home", "here"]) addSentence(["2"], ["please", verb, place], ["now", "again"]);
}

const KEEP = ["warm", "clean", "hot", "full"];
const TOGETHER = ["laugh", "start", "try", "draw", "grow", "drink", "fall", "show", "hold", "bring"];
const NEVER = ["fall", "start", "try", "laugh", "grow", "draw", "drink"];
const BETTER = ["start", "try", "laugh", "draw", "grow", "drink"];

pairs(KEEP, (left, right) => addSentence(["3"], ["keep", left, "today"], [right]));
pairs(TOGETHER, (left, right) => addSentence(["3"], [left, "together", "today"], [right]));
pairs(NEVER, (left, right) => addSentence(["3"], ["never", left, "today"], [right]));
pairs(BETTER, (left, right) => addSentence(["3"], ["better", left, "today"], [right]));
for (const verb of NEVER) addSentence(["3"], ["never", verb, "together", "today"]);
for (const look of KEEP) {
  for (const verb of ["laugh", "start", "try", "draw"]) addSentence(["3"], ["keep", look, "today"], [verb]);
}

for (const verb of ["run", "kick", "sniff"]) {
  addSentence(["1-review"], ["the", "strong", "pigs", verb]);
  addSentence(["1-review"], ["two", "strong", "pigs", verb]);
  addSentence(["1-review"], ["all", "the", "pigs", verb]);
  addSentence(["1-review"], ["his", "strong", "pigs", verb]);
  addSentence(["1-review"], ["all", "strong", "pigs", verb]);
  addSentence(["1-review"], ["the", "pigs", verb], ["legs"]);
}
addSentence(["1-review"], ["the", "pigs", "have", "legs"]);
addSentence(["1-review"], ["all", "pigs", "have", "legs"]);
addSentence(["1-review"], ["two", "pigs", "have", "legs"]);
addSentence(["1-review"], ["his", "pigs", "have", "legs"]);
addSentence(["1-review"], ["strong", "pigs", "have", "legs"]);

addSentence(["1-review"], ["the", "long", "sheep", "sleep"]);
addSentence(["1-review"], ["all", "the", "sheep", "sleep"]);
addSentence(["1-review"], ["three", "long", "sheep", "sleep"]);
addSentence(["1-review"], ["all", "long", "sheep", "sleep"]);
addSentence(["1-review"], ["the", "sheep", "sleep"], ["deep", "eel", "week", "one"]);
addSentence(["1-review"], ["all", "sheep", "sleep"], ["deep", "eel", "week"]);
addSentence(["1-review"], ["three", "sheep", "sleep"], ["deep", "eel", "one"]);
addSentence(["1-review"], ["long", "sheep", "sleep"], ["deep", "eel", "week"]);

for (const verb of ["run", "kick", "sniff", "sleep"]) {
  addSentence(["1-review"], ["the", "long", "pigs", verb]);
  addSentence(["1-review"], ["all", "the", "sheep", verb]);
  addSentence(["1-review"], ["the", "sheep", verb], ["strong"]);
  addSentence(["1-review"], ["two", "sheep", verb], ["long"]);
  addSentence(["1-review"], ["three", "pigs", verb], ["strong"]);
}
addSentence(["1-review"], ["the", "pigs", "have", "teeth"]);
addSentence(["1-review"], ["the", "sheep", "have", "teeth"]);
addSentence(["1-review"], ["all", "sheep", "have", "teeth"]);
addSentence(["1-review"], ["his", "sheep", "have", "teeth"]);
addSentence(["1-review"], ["two", "pigs", "have", "teeth"]);
addSentence(["1-review"], ["his", "pigs", "have", "teeth"]);
addSentence(["1-review"], ["the", "strong", "sheep", "sleep"]);

export const sentenceSets = [...hands.values()];
export { sentenceTemplateCount };

export function setKey(set) {
  return [...set.words].map((word) => word.toLowerCase()).sort().join("|");
}

export function setsFor(deckWordList) {
  const have = new Set(deckWordList.map((word) => word.toLowerCase()));
  return sentenceSets.filter((set) => set.words.every((word) => have.has(word.toLowerCase())));
}

export function dealOrder(deckWordList, recentKeys = [], random = Math.random) {
  return orderByFreshness(setsFor(deckWordList), recentKeys, setKey, random);
}

export function mixHand(words, random = Math.random) {
  let mixed = shuffle(words, random);
  for (let tries = 0; tries < 6 && gradeSentence(mixed).ok; tries += 1) {
    mixed = shuffle(words, random);
  }
  return mixed;
}
