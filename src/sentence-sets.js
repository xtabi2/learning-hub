// Word cards for Build a Sentence. Every set uses words from the decks listed,
// and the grader accepts at least one sentence from each set.
// Add another object to grow the bank.

export const sentenceSets = [
  { decks: ["k"], words: ["I", "can", "see", "you"] },
  { decks: ["k"], words: ["I", "can", "see", "it"] },
  { decks: ["k"], words: ["we", "can", "see", "you"] },
  { decks: ["k"], words: ["he", "can", "see", "me"] },
  { decks: ["k"], words: ["he", "is", "little", "not"] },
  { decks: ["k"], words: ["it", "is", "blue", "not"] },
  { decks: ["k"], words: ["she", "is", "funny", "little"] },
  { decks: ["k"], words: ["they", "are", "little", "not"] },
  { decks: ["k"], words: ["I", "am", "little", "not"] },
  { decks: ["k"], words: ["you", "are", "little", "not"] },
  { decks: ["k"], words: ["she", "was", "funny", "little"] },
  { decks: ["k"], words: ["they", "were", "little", "not"] },
  { decks: ["k"], words: ["this", "is", "yellow", "not"] },
  { decks: ["k"], words: ["I", "like", "you", "can"] },
  { decks: ["k"], words: ["look", "at", "me", "you"] },
  { decks: ["k"], words: ["he", "has", "it", "she"] },

  { decks: ["1"], words: ["men", "will", "play", "big"] },
  { decks: ["1"], words: ["some", "men", "play", "today"] },
  { decks: ["1"], words: ["men", "saw", "her", "some"] },
  { decks: ["1"], words: ["our", "men", "will", "play"] },
  { decks: ["1"], words: ["men", "thank", "her", "will"] },
  { decks: ["1"], words: ["some", "men", "drink", "big"] },
  { decks: ["1"], words: ["seven", "men", "play", "will"] },
  { decks: ["1"], words: ["men", "found", "her", "some"] },
  { decks: ["1"], words: ["men", "saw", "him", "our"] },
  { decks: ["1"], words: ["good", "men", "will", "play"] },

  { decks: ["2"], words: ["people", "go", "home", "many"] },
  { decks: ["2"], words: ["people", "went", "home", "old"] },
  { decks: ["2"], words: ["people", "must", "eat", "many"] },
  { decks: ["2"], words: ["kind", "people", "help", "many"] },
  { decks: ["2"], words: ["people", "come", "here", "these"] },
  { decks: ["2"], words: ["people", "live", "here", "many"] },
  { decks: ["2"], words: ["old", "people", "walk", "home"] },
  { decks: ["2"], words: ["people", "went", "away", "many"] },
  { decks: ["2"], words: ["please", "go", "home", "come"] },
  { decks: ["2"], words: ["people", "came", "home", "many"] },

  { decks: ["3"], words: ["keep", "warm", "today", "clean"] },
  { decks: ["3"], words: ["laugh", "together", "today", "start"] },
  { decks: ["3"], words: ["try", "together", "today", "never"] },
  { decks: ["3"], words: ["better", "start", "today", "keep"] },
  { decks: ["3"], words: ["never", "fall", "today", "try"] },

  { decks: ["skills-1-25.1", "class-all"], words: ["the", "pigs", "run", "strong"] },
  { decks: ["skills-1-25.1", "class-all"], words: ["the", "pigs", "have", "legs"] },
  { decks: ["skills-1-25.1", "class-all"], words: ["all", "pigs", "run", "two"] },
  { decks: ["skills-1-25.1", "class-all"], words: ["his", "pigs", "run", "the"] },
  { decks: ["skills-1-25.1", "class-all"], words: ["the", "pigs", "kick", "strong"] },
  { decks: ["skills-1-25.1", "class-all"], words: ["the", "pigs", "sniff", "all"] },

  { decks: ["skills-2-1.1", "class-all"], words: ["the", "sheep", "sleep", "all"] },
  { decks: ["skills-2-1.1", "class-all"], words: ["three", "sheep", "sleep", "the"] },
  { decks: ["skills-2-1.1", "class-all"], words: ["all", "the", "sheep", "sleep"] },
  { decks: ["skills-2-1.1", "class-all"], words: ["the", "long", "sheep", "sleep"] },
];

export function setsFor(deckWords) {
  const have = new Set(deckWords.map((word) => word.toLowerCase()));
  return sentenceSets.filter((set) => set.words.every((word) => have.has(word.toLowerCase())));
}
