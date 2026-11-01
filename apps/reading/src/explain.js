// Wrong-answer help: the right answer plus why, shared by Story Time and Build a Sentence.
import { formatSentence, isAcceptable } from "./grade-sentence.js";

const STOP = new Set("a an the and but so to of in on at is was it he she they his her its no one did do what who why which whose how happened first last then".split(" "));

const wordsOf = (text) => text.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
const stem = (word) => word.replace(/'s$/, "").replace(/(ing|ed|es|s)$/, "");
const keyWords = (text) => new Set(wordsOf(text).filter((word) => !STOP.has(word)).map(stem));

/** The story sentence that best answers a question (most shared words with the right answer, then the prompt). */
export function evidenceFor(sentences, prompt, answer) {
  const fromAnswer = keyWords(answer);
  const fromPrompt = keyWords(prompt);
  let best = null;
  let bestScore = 0;
  sentences.forEach((sentence) => {
    const have = keyWords(sentence);
    let score = 0;
    fromAnswer.forEach((word) => { if (have.has(word)) score += 2.1; });
    fromPrompt.forEach((word) => { if (have.has(word)) score += 2; });
    if (score > bestScore) {
      best = sentence;
      bestScore = score;
    }
  });
  return best;
}

/** What to show after a wrong Story Time answer. */
export function storyHelp(sentences, question) {
  const right = question.choices.find((choice) => choice.ok).text;
  const because = evidenceFor(sentences, question.prompt, right);
  const say = because ? `The answer is: ${right}. The story says: ${because}` : `The answer is: ${right}.`;
  return { right, because, say };
}

function permutations(items, size) {
  if (size === 0) return [[]];
  return items.flatMap((item, index) =>
    permutations([...items.slice(0, index), ...items.slice(index + 1)], size - 1).map((rest) => [item, ...rest]));
}

/** A sentence the grader accepts using the hand's words (longest first, original order first). */
export function solveSentence(words) {
  for (const size of [Math.min(4, words.length), 3]) {
    for (const order of permutations(words, size)) {
      if (isAcceptable(order.map((word) => word.toLowerCase()))) return order;
    }
  }
  return null;
}

/** What to show after a wrong Build a Sentence check. */
export function sentenceHelp(words) {
  const right = solveSentence(words);
  if (!right) return null;
  const sentence = formatSentence(right);
  return {
    words: right,
    sentence,
    why: "Who first, then what they do.",
    say: `Try this: ${sentence} Who first, then what they do.`,
  };
}
