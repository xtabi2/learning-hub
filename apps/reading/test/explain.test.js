import assert from "node:assert/strict";
import test from "node:test";
import { stories } from "../src/stories.js";
import { sentenceSets } from "../src/sentence-sets.js";
import { evidenceFor, sentenceHelp, solveSentence, storyHelp } from "../src/explain.js";
import { gradeSentence } from "../src/grade-sentence.js";

test("Story Time help names the right answer and quotes the story", () => {
  let found = 0;
  let total = 0;
  for (const story of stories) {
    for (const level of Object.values(story.levels)) {
      for (const question of level.questions) {
        const help = storyHelp(level.sentences, question);
        assert.equal(help.right, question.choices.find((choice) => choice.ok).text);
        assert.match(help.say, /The answer is/);
        total += 1;
        if (help.because) {
          found += 1;
          assert.ok(level.sentences.includes(help.because));
        }
      }
    }
  }
  assert.ok(found / total > 0.9, `${found}/${total} questions have a story sentence`);
});

test("evidence prefers the sentence with the answer words", () => {
  const sentences = ["The pigs left home.", "The wolf blew it in."];
  assert.equal(evidenceFor(sentences, "Who blew?", "The wolf"), "The wolf blew it in.");
});

test("every sentence hand has a solution the grader accepts", () => {
  for (const set of sentenceSets) {
    const solved = solveSentence(set.words);
    assert.ok(solved, set.words.join(" "));
    assert.equal(gradeSentence(solved).ok, true);
  }
  const help = sentenceHelp(["sleep", "the", "sheep"]);
  assert.equal(help.sentence, "The sheep sleep.");
  assert.match(help.say, /The sheep sleep/);
});
