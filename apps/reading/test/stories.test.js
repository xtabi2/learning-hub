import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, stories, storyLevel } from "../src/stories.js";
import { grades } from "../src/words.js";
import { pickStories, recentStories, rememberStory } from "../src/story-rotation.js";
import { createMemoryStorage } from "../../../shared/index.js";

const RANGE = { k: [3, 4], 1: [5, 6], 2: [7, 10] };
const QUESTIONS = { k: 2, 1: 3, 2: 4 };
const sight = new Set(grades.find((g) => g.id === "k").words.map((w) => w.toLowerCase()));
const wordsOf = (s) => s.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);

test("library has at least 30 stories with unique ids", () => {
  assert.ok(stories.length >= 30, `${stories.length} stories`);
  assert.equal(new Set(stories.map((s) => s.id)).size, stories.length);
});

test("every story has a version for every grade with the right sentence count", () => {
  for (const story of stories) {
    for (const level of LEVELS) {
      const { sentences } = story.levels[level];
      const [min, max] = RANGE[level];
      assert.ok(sentences.length >= min && sentences.length <= max, `${story.id} ${level}: ${sentences.length}`);
      for (const s of sentences) assert.match(s, /[.!?]"?$/, `${story.id} ${level}: ${s}`);
      assert.equal(new Set(sentences).size, sentences.length, `${story.id} ${level} repeats a sentence`);
    }
  }
});

test("grades map to levels", () => {
  assert.deepEqual(["PreK", "K", "1", "2", "3"].map(storyLevel), ["k", "k", "1", "2", "2"]);
});

test("Pre-K/K versions are mostly K sight words", () => {
  let total = 0;
  let hits = 0;
  for (const story of stories) {
    const words = story.levels.k.sentences.flatMap(wordsOf);
    const known = words.filter((w) => sight.has(w)).length;
    total += words.length;
    hits += known;
    assert.ok(known / words.length > 0.5, `${story.id}: ${Math.round((100 * known) / words.length)}%`);
  }
  console.log(`K sight-word share: ${((100 * hits) / total).toFixed(1)}% (${hits}/${total} words)`);
});

test("questions and answers are valid", () => {
  for (const story of stories) {
    for (const level of LEVELS) {
      const { questions } = story.levels[level];
      assert.equal(questions.length, QUESTIONS[level], `${story.id} ${level}`);
      for (const q of questions) {
        assert.match(q.prompt, /\?$/);
        assert.equal(q.choices.length, 3);
        assert.equal(q.choices.filter((c) => c.ok).length, 1, q.prompt);
        assert.equal(new Set(q.choices.map((c) => c.text.toLowerCase())).size, 3, q.prompt);
        for (const c of q.choices) assert.ok(c.text.trim().length > 0);
      }
    }
  }
});

test("rotation avoids recent repeats", () => {
  const store = createMemoryStorage();
  const seen = [];
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let round = 0; round < stories.length; round += 1) {
    const [first] = pickStories(stories, recentStories(store, "kid"), 3, random);
    assert.ok(!seen.includes(first.id), `${first.id} repeated in round ${round}`);
    seen.push(first.id);
    rememberStory(store, "kid", first.id);
  }
  assert.equal(seen.length, stories.length);
  // Once all are read, the oldest one comes back first.
  const [next] = pickStories(stories, recentStories(store, "kid"), 3, random);
  assert.equal(next.id, seen[0]);
  // History is per child.
  assert.deepEqual(recentStories(store, "other"), []);
});
