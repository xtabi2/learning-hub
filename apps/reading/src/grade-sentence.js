// Grades a short sentence as acceptable English.
// A fair answer should pass even when it is not the only possible order.
// Add words to the sets below only when this checker accepts a real sentence.

const SUBJ_I = new Set(["i"]);
const SUBJ_PL = new Set(["you", "we", "they"]);
const SUBJ_SG = new Set(["he", "she", "it", "this", "that"]);
const OBJ = new Set(["me", "you", "him", "her", "it", "us", "them"]);
const POSS = new Set(["my", "his", "her", "your", "their", "our", "its"]);
const DET_ANY = new Set(["the"]);
const DET_SG = new Set(["a", "an", "this", "that", "one"]);
const DET_PL = new Set([
  "two", "three", "all", "these", "those", "many", "some", "both",
  "seven", "six", "eight", "ten",
]);
const ADJ = new Set([
  "big", "little", "blue", "yellow", "funny", "strong", "long", "small",
  "good", "white", "brown", "deep", "new", "old", "hot", "cold", "great",
  "round", "clean", "warm", "full", "kind", "special", "same", "light",
]);
const NOUN_SG = new Set([
  "pig", "eel", "man", "thing", "word", "van", "hand", "week", "name", "line", "sheep",
]);
const NOUN_PL = new Set(["pigs", "sheep", "legs", "teeth", "men", "people"]);
const MODAL = new Set(["can", "will", "may", "could", "should", "would", "must", "shall"]);
const V_INTRANS = new Set([
  "run", "sleep", "go", "come", "look", "play", "walk", "work", "fly", "fall",
  "live", "laugh", "sniff", "kick", "see", "help", "eat", "drink", "read",
  "grow", "try", "start", "draw", "write",
]);
const V_TRANS = new Set([
  "see", "like", "kick", "sniff", "help", "read", "eat", "drink", "have",
  "make", "take", "find", "hold", "show", "want", "need", "get", "tell",
  "thank", "bring", "carry", "draw", "write", "call", "use", "found", "saw", "got", "had",
]);
const NEED_OBJ = new Set([
  "like", "thank", "have", "has", "found", "saw", "got", "tell", "want",
  "need", "make", "take", "bring", "carry", "hold", "show", "use", "call", "get", "had",
]);
const PAST_GO = new Set(["went", "came"]);
const PAST_TRANS = new Set(["saw", "found", "got", "had", "made", "said"]);
const PLACE = new Set(["home", "here", "away", "out", "up", "today", "now", "soon", "well", "again"]);
const NUM = new Set(["two", "three", "six", "seven", "eight", "ten"]);
const IMP_TOGETHER = new Set(["laugh", "start", "try", "draw", "grow", "drink", "fall", "show", "hold", "bring"]);
const IMP_NEVER = new Set(["fall", "start", "try", "laugh", "grow", "draw", "drink"]);
const IMP_BETTER = new Set(["start", "try", "laugh", "draw", "grow", "drink"]);

function nounKind(noun) {
  const pl = NOUN_PL.has(noun);
  const sg = NOUN_SG.has(noun);
  if (pl && sg) return "either";
  if (pl) return "pl";
  if (sg) return "sg";
  return null;
}

function nounPhrase(tokens, start, mode, article) {
  let index = start;
  if (ADJ.has(tokens[index])) index += 1;
  const noun = tokens[index];
  const kind = nounKind(noun);
  if (!kind) return null;
  if (mode === "pl" && kind === "sg") return null;
  if (mode === "sg" && kind === "pl") return null;
  if (article === "an" && !/^[aeiou]/.test(noun)) return null;
  if (article === "a" && /^[aeiou]/.test(noun)) return null;
  let agree = kind;
  if (mode === "pl") agree = "pl";
  if (mode === "sg") agree = "sg";
  return { end: index + 1, agree };
}

function parseSubject(tokens) {
  const first = tokens[0];
  if (!first) return null;
  if (SUBJ_I.has(first)) return { end: 1, agree: "i" };
  if (SUBJ_PL.has(first)) return { end: 1, agree: "pl" };
  if (SUBJ_SG.has(first)) {
    if ((first === "this" || first === "that") && nounKind(tokens[1])) {
      return nounPhrase(tokens, 1, "sg");
    }
    return { end: 1, agree: "sg" };
  }
  if (NOUN_PL.has(first) && !DET_ANY.has(first) && !DET_PL.has(first) && !DET_SG.has(first) && !POSS.has(first) && !ADJ.has(first)) {
    const kind = nounKind(first);
    return { end: 1, agree: kind === "either" ? "either" : "pl" };
  }
  if (first === "all" && tokens[1] === "the") return nounPhrase(tokens, 2, "pl");
  if (first === "the" && NUM.has(tokens[1])) return nounPhrase(tokens, 2, "pl");
  if (POSS.has(first)) return nounPhrase(tokens, 1, "any");
  if (first === "a" || first === "an") return nounPhrase(tokens, 1, "sg", first);
  if (DET_SG.has(first)) return nounPhrase(tokens, 1, "sg");
  if (DET_PL.has(first)) return nounPhrase(tokens, 1, "pl");
  if (DET_ANY.has(first)) return nounPhrase(tokens, 1, "any");
  if (ADJ.has(first)) return nounPhrase(tokens, 0, "pl");
  return null;
}

function consumeObject(tokens, start) {
  if (start >= tokens.length) return -1;
  if (OBJ.has(tokens[start]) && !["i", "he", "she", "we", "they"].includes(tokens[start])) {
    return start + 1;
  }
  if (NOUN_PL.has(tokens[start]) && !ADJ.has(tokens[start])) {
    return start + 1;
  }
  let phrase = null;
  if (POSS.has(tokens[start])) phrase = nounPhrase(tokens, start + 1, "any");
  else if (tokens[start] === "a" || tokens[start] === "an") phrase = nounPhrase(tokens, start + 1, "sg", tokens[start]);
  else if (DET_SG.has(tokens[start])) phrase = nounPhrase(tokens, start + 1, "sg");
  else if (DET_PL.has(tokens[start])) phrase = nounPhrase(tokens, start + 1, "pl");
  else if (DET_ANY.has(tokens[start])) phrase = nounPhrase(tokens, start + 1, "any");
  if (!phrase) return -1;
  return phrase.end;
}

function copulaFits(word, agree) {
  if (word === "am") return agree === "i";
  if (word === "is") return agree === "sg" || agree === "either";
  if (word === "are") return agree === "pl" || agree === "either";
  if (word === "was") return agree === "i" || agree === "sg" || agree === "either";
  if (word === "were") return agree === "pl" || agree === "either";
  return false;
}

function verbFits(verb, rest, kind) {
  const intrans = V_INTRANS.has(verb);
  const trans = V_TRANS.has(verb);
  if (!intrans && !trans) return false;
  if (rest.length === 0) return intrans && !NEED_OBJ.has(verb);
  if (rest.length === 1 && PLACE.has(rest[0]) && intrans && !NEED_OBJ.has(verb)) return true;
  if (!trans || NEED_OBJ.has(verb) && rest.length === 0) return false;
  const end = consumeObject(rest, 0);
  if (end === rest.length) return trans;
  if (end > 0 && end === rest.length - 1 && PLACE.has(rest[end]) && trans) return true;
  return kind === "ignore" ? false : false;
}

function parsePredicate(tokens, agree) {
  if (!tokens.length) return false;
  const [first] = tokens;
  if (MODAL.has(first)) {
    if (tokens[1] === "be" && tokens.length === 3 && ADJ.has(tokens[2])) return true;
    const verb = tokens[1];
    if (!verb) return false;
    return verbFits(verb, tokens.slice(2), "modal");
  }
  if (["am", "is", "are", "was", "were"].includes(first) && copulaFits(first, agree)) {
    let index = 1;
    if (tokens[index] === "not") index += 1;
    if (ADJ.has(tokens[index]) && index === tokens.length - 1) return true;
    const end = consumeObject(tokens, index);
    return end === tokens.length;
  }
  if (first === "has" && (agree === "sg" || agree === "either")) {
    return consumeObject(tokens, 1) === tokens.length;
  }
  if (first === "have" && (agree === "i" || agree === "pl" || agree === "either")) {
    return consumeObject(tokens, 1) === tokens.length;
  }
  if (PAST_GO.has(first)) {
    return tokens.length === 1 || (tokens.length === 2 && PLACE.has(tokens[1]));
  }
  if (PAST_TRANS.has(first)) {
    return consumeObject(tokens, 1) === tokens.length;
  }
  if (first === "says" && (agree === "sg" || agree === "either")) {
    return consumeObject(tokens, 1) === tokens.length;
  }
  if (agree === "sg") return false;
  if (agree === "i" || agree === "pl" || agree === "either") {
    return verbFits(first, tokens.slice(1), "base");
  }
  return false;
}

function imperative(tokens) {
  const [a, b, c, d] = tokens;
  if (a === "look" && b === "at" && tokens.length === 3 && OBJ.has(c)) return true;
  if (a === "keep" && ADJ.has(b) && tokens.length === 3 && c === "today") return true;
  if (IMP_TOGETHER.has(a) && b === "together" && c === "today" && tokens.length === 3) return true;
  if (a === "never" && IMP_NEVER.has(b) && c === "today" && tokens.length === 3) return true;
  if (a === "never" && IMP_NEVER.has(b) && c === "together" && d === "today" && tokens.length === 4) return true;
  if (a === "better" && IMP_BETTER.has(b) && c === "today" && tokens.length === 3) return true;
  if (a === "please" && ["go", "come"].includes(b) && ["home", "here"].includes(c) && tokens.length === 3) return true;
  return false;
}

export function isAcceptable(tokens) {
  if (imperative(tokens)) return true;
  const subject = parseSubject(tokens);
  if (!subject || subject.end >= tokens.length) return false;
  return parsePredicate(tokens.slice(subject.end), subject.agree);
}

export function formatSentence(words) {
  const parts = words
    .map((word) => word.replace(/[^A-Za-z']/g, ""))
    .filter(Boolean)
    .map((word, index) => {
      if (word.toLowerCase() === "i") return "I";
      const lower = word.toLowerCase();
      if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
      return lower;
    });
  if (!parts.length) return "";
  return `${parts.join(" ")}.`;
}

export function gradeSentence(words) {
  const tokens = words
    .map((word) => word.toLowerCase().replace(/[^a-z']/g, ""))
    .filter(Boolean);
  if (tokens.length < 3) return { ok: false, message: "Use 3 or 4 words." };
  if (tokens.length > 5) return { ok: false, message: "Try a shorter sentence." };
  if (isAcceptable(tokens)) return { ok: true, message: "Yes! That works." };
  return { ok: false, message: "Not quite. Try a new order." };
}
