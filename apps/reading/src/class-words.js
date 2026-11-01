// Class words from Madison's 1st grade CKLA take-home sheets. words.js rolls them into 1st grade.
// Add another object to this array to include a later lesson.
// `underline` is the [start, end) range of the tricky letters on the sheet.
// All together keeps the first copy of a word and skips later duplicates.

export const lessons = [
  {
    id: "skills-1-25.1",
    label: "Skills 1 · 25.1",
    words: [
      { text: "his" },
      { text: "all", underline: [0, 1] },
      { text: "pigs" },
      { text: "strong" },
      { text: "two", underline: [1, 3] },
      { text: "with" },
      { text: "have", underline: [3, 4] },
      { text: "run" },
      { text: "the", underline: [2, 3] },
      { text: "kick" },
      { text: "sniff" },
      { text: "legs" },
    ],
  },
  {
    id: "skills-2-1.1",
    label: "Skills 2 · 1.1",
    words: [
      { text: "the", underline: [2, 3] },
      { text: "all", underline: [0, 1] },
      { text: "long" },
      { text: "teeth" },
      { text: "week" },
      { text: "one", underline: [0, 3] },
      { text: "deep" },
      { text: "eel" },
      { text: "sheep" },
      { text: "speech" },
      { text: "three" },
      { text: "sleep" },
    ],
  },
];

export function allClassWords(list = lessons) {
  const seen = new Set();
  const words = [];
  for (const lesson of list) {
    for (const word of lesson.words) {
      if (seen.has(word.text)) continue;
      seen.add(word.text);
      words.push(word);
    }
  }
  return words;
}
