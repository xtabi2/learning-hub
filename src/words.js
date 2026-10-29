// Kindergarten, 1st grade, and 2nd grade are the Big Walnut Local Schools
// High Frequency Words Assessment lists, revised 2026, read down each column.
// 3rd grade stays on Edward William Dolch's third-grade service words.
// Ohio's Department of Education and Workforce does not publish a statewide list.

const kindergarten = [
  "one", "two", "an", "if", "blue", "yellow", "little", "has", "this", "funny",
  "when", "to", "no", "he", "like", "by", "see", "at", "it", "in",
  "and", "up", "us", "as", "of", "with", "was", "says", "were", "which",
  "my", "we", "you", "three", "a", "can", "not", "look", "I", "are",
  "out", "all", "where", "so", "what", "word", "they", "their", "me", "am",
  "the", "had", "on", "but", "his", "is", "that", "from", "once", "there",
  "said", "why", "be", "she", "your",
];

const grade1 = [
  "did", "set", "long", "off", "thing", "because", "too", "round", "for", "never",
  "how", "play", "man", "big", "them", "will", "do", "could", "should", "saw",
  "start", "seven", "write", "white", "him", "end", "van", "use", "have", "our",
  "out", "soon", "after", "or", "think", "may", "get", "men", "then", "into",
  "some", "would", "good", "today", "better", "under", "which", "thank", "hand", "land",
  "back", "got", "who", "found", "draw", "her", "far", "upon", "drink", "say",
];

const grade2 = [
  "its", "went", "still", "line", "same", "here", "please", "open", "been", "brown",
  "live", "only", "myself", "again", "read", "ask", "much", "tell", "made", "down",
  "these", "both", "goes", "first", "call", "find", "hurt", "own", "around", "want",
  "help", "just", "make", "well", "time", "go", "cold", "kind", "people", "know",
  "many", "show", "walk", "away", "work", "such", "small", "came", "name", "before",
  "clean", "going", "old", "always", "fly", "now", "try", "new", "come", "great",
  "must", "spell", "home", "need", "take", "eat", "hold", "over", "any", "fall",
  "grow", "light", "about", "done", "special",
];

const grade3 = [
  "about", "better", "bring", "carry", "clean", "cut", "done", "draw", "drink", "eight",
  "fall", "far", "full", "got", "grow", "hold", "hot", "hurt", "if", "keep",
  "kind", "laugh", "light", "long", "much", "myself", "never", "only", "own", "pick",
  "seven", "shall", "show", "six", "small", "start", "ten", "today", "together", "try",
  "warm",
];

export const grades = [
  { id: "k", label: "Kindergarten", words: kindergarten },
  { id: "1", label: "1st Grade", words: grade1 },
  { id: "2", label: "2nd Grade", words: grade2 },
  { id: "3", label: "3rd Grade", words: grade3 },
];
