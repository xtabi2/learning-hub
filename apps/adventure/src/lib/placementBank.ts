/**
 * Placement question bank aligned to Ohio K–3 Third Grade Reading Guarantee
 * (TGRG) foundational skills and Ohio ELA grade-level reading standards used by
 * districts such as Big Walnut. Home-practice heuristic only — not an official
 * ODE, district, or diagnostic assessment.
 *
 * `pillar` keys match Skill.pillar so placement scoring / synthetic mastery and
 * deriveStartBandFromPillarHits (accuracy -> storyReadingBand) stay unchanged.
 */
import { randomInt } from "node:crypto";

export const PLACEMENT_SKILLS = [
  "phonemic_awareness",
  "phonics",
  "sight_words",
  "vocabulary",
  "fluency",
  "comprehension",
] as const;
export type PlacementSkill = (typeof PLACEMENT_SKILLS)[number];

export const PLACEMENT_LEVELS = ["emerging", "early", "growing", "fluent-ms"] as const;
export type PlacementLevel = (typeof PLACEMENT_LEVELS)[number];

/** Parent-facing competency labels. */
export const PLACEMENT_SKILL_LABELS: Record<PlacementSkill, string> = {
  phonemic_awareness: "Hearing sounds in words (phonemic awareness)",
  phonics: "Sounding out words (phonics)",
  sight_words: "Reading common sight words",
  vocabulary: "Word meanings (vocabulary)",
  fluency: "Smooth, accurate reading (fluency)",
  comprehension: "Understanding what was read (comprehension)",
};

export const PLACEMENT_QUIZ_LENGTH = 10;

export type PlacementQuestion = {
  id: string;
  skill: PlacementSkill;
  /** Scoring pillar (matches Skill.pillar). Sight words score under phonics. */
  pillar: string;
  level: PlacementLevel;
  prompt: string;
  correct: string;
  distractors: [string, string, string];
};

type Raw = [string, PlacementSkill, PlacementLevel, string, string, string, string, string];
const RAW: Raw[] = [
  // phonemic awareness
  ["pa-e1", "phonemic_awareness", "emerging", "Which word rhymes with frog?", "log", "flag", "fish", "farm"],
  ["pa-e2", "phonemic_awareness", "emerging", "What is the first sound in mouse?", "/m/", "/n/", "/s/", "/b/"],
  ["pa-e3", "phonemic_awareness", "emerging", "Which word rhymes with cat?", "hat", "cup", "dog", "sun"],
  ["pa-r1", "phonemic_awareness", "early", "What is the last sound in bus?", "/s/", "/b/", "/u/", "/z/"],
  ["pa-r2", "phonemic_awareness", "early", "Say stop without /s/. What word is left?", "top", "pot", "sop", "tap"],
  ["pa-g1", "phonemic_awareness", "growing", "How many syllables are in butterfly?", "3", "2", "4", "1"],
  ["pa-f1", "phonemic_awareness", "fluent-ms", "Which word has the stress on the second syllable?", "begin", "garden", "table", "happy"],
  // phonics
  ["ph-e1", "phonics", "emerging", "Which word has a short a sound?", "cap", "cake", "coat", "cube"],
  ["ph-e2", "phonics", "emerging", "Choose the word for /s/ /i/ /t/.", "sit", "sat", "set", "sot"],
  ["ph-r1", "phonics", "early", "Which word has a long a sound spelled ai?", "rain", "ran", "rang", "rat"],
  ["ph-r2", "phonics", "early", "Which word ends with the sh sound?", "fish", "fist", "fit", "fizz"],
  ["ph-g1", "phonics", "growing", "Which prefix means \"not\" in unhappy?", "un-", "-happy", "-py", "hap-"],
  ["ph-g2", "phonics", "growing", "Which word is spelled correctly?", "because", "becuz", "becawse", "beacause"],
  ["ph-f1", "phonics", "fluent-ms", "The root \"graph\" in autograph means:", "write", "self", "light", "sound"],
  // sight words (scored under phonics)
  ["sw-e1", "sight_words", "emerging", "Find the word: the", "the", "tha", "hte", "teh"],
  ["sw-e2", "sight_words", "emerging", "Which word completes: I ___ a dog.", "see", "sea", "si", "ees"],
  ["sw-r1", "sight_words", "early", "Which word completes: They went ___ the store.", "to", "two", "too", "tow"],
  ["sw-r2", "sight_words", "early", "Find the word: because", "because", "becose", "becaus", "beacuse"],
  ["sw-g1", "sight_words", "growing", "Which word completes: ___ coats are on the hook.", "Their", "There", "They're", "Thier"],
  ["sw-f1", "sight_words", "fluent-ms", "Which word completes: The rain will ___ the game.", "affect", "effect", "affeckt", "efect"],
  // vocabulary
  ["vo-e1", "vocabulary", "emerging", "Which one is an animal?", "horse", "chair", "apple", "shoe"],
  ["vo-r1", "vocabulary", "early", "What does enormous mean?", "very big", "very small", "very quiet", "very slow"],
  ["vo-r2", "vocabulary", "early", "Which word means the opposite of happy?", "sad", "glad", "silly", "kind"],
  ["vo-g1", "vocabulary", "growing", "\"The trail was steep, so we climbed slowly.\" Steep means:", "rising sharply", "very flat", "very wet", "full of rocks"],
  ["vo-g2", "vocabulary", "growing", "Which word is a synonym for brave?", "courageous", "nervous", "careless", "tired"],
  ["vo-f1", "vocabulary", "fluent-ms", "\"Her reply was concise.\" Concise means:", "brief and clear", "long and confusing", "rude", "late"],
  ["vo-f2", "vocabulary", "fluent-ms", "\"Time is a thief\" is an example of a:", "metaphor", "simile", "rhyme", "question"],
  // fluency
  ["fl-e1", "fluency", "emerging", "Which sentence is written for smooth reading?", "The pup naps on the rug.", "Pup the naps rug on the.", "On naps the pup rug the.", "The. pup naps on the rug"],
  ["fl-r1", "fluency", "early", "Which sentence should be read with excitement?", "We won the game!", "We won the game.", "Did we win the game?", "we won the game"],
  ["fl-g1", "fluency", "growing", "Where should a reader pause? \"After lunch we played outside\"", "after lunch,", "after we,", "played outside,", "no pause"],
  ["fl-g2", "fluency", "growing", "Which sentence asks a question?", "Where did the dog go?", "The dog went home.", "Go home, dog!", "The dog, at home."],
  ["fl-f1", "fluency", "fluent-ms", "In dialogue, quotation marks show:", "a character's exact words", "a new chapter", "the narrator's thoughts only", "a list"],
  // comprehension
  ["co-e1", "comprehension", "emerging", "Read: \"Kai flew a kite at the park.\" Where was Kai?", "at the park", "at home", "at school", "at the store"],
  ["co-e2", "comprehension", "emerging", "Plant, water, bloom. What happens last?", "bloom", "plant", "water", "dig"],
  ["co-r1", "comprehension", "early", "Read: \"Mia grabbed her umbrella before walking out.\" What is the weather probably like?", "rainy", "sunny and dry", "snowy and calm", "windless"],
  ["co-g1", "comprehension", "growing", "Read: \"Bees carry pollen from flower to flower, helping plants make seeds.\" What is the main idea?", "Bees help plants make seeds.", "Bees are yellow.", "Flowers are pretty.", "Seeds are small."],
  ["co-g2", "comprehension", "growing", "Read: \"Leo kept checking the clock and tapping his foot.\" Leo feels:", "impatient", "sleepy", "proud", "scared of clocks"],
  ["co-f1", "comprehension", "fluent-ms", "An author writes to convince readers to recycle. The purpose is to:", "persuade", "entertain", "describe a person", "tell a joke"],
  ["co-f2", "comprehension", "fluent-ms", "Which is the best evidence that a character is generous?", "She shared her lunch with a new student.", "She has a blue backpack.", "She likes math.", "She walked home."],
];

export const PLACEMENT_BANK: PlacementQuestion[] = RAW.map(
  ([id, skill, level, prompt, correct, a, b, c]) => ({
    id,
    skill,
    pillar: skill === "sight_words" ? "phonics" : skill,
    level,
    prompt,
    correct,
    distractors: [a, b, c],
  }),
);

const BY_ID = new Map(PLACEMENT_BANK.map((q) => [q.id, q]));
export function getPlacementQuestion(id: string): PlacementQuestion | undefined {
  return BY_ID.get(id);
}

export type RandInt = (maxExclusive: number) => number;
const cryptoRand: RandInt = (max) => randomInt(max);

export function shuffle<T>(input: readonly T[], rand: RandInt = cryptoRand): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export type PlacementQuizItem = { id: string; prompt: string; options: string[] };

/**
 * Stratified random draw: one item per required skill, then at least one item
 * per reading level, then random fill to `count`. Options are shuffled per
 * question per attempt; the client never learns which option is correct.
 */
export function drawPlacementQuiz(
  rand: RandInt = cryptoRand,
  count: number = PLACEMENT_QUIZ_LENGTH,
  bank: PlacementQuestion[] = PLACEMENT_BANK,
): PlacementQuizItem[] {
  const pool = shuffle(bank, rand);
  const picked: PlacementQuestion[] = [];
  const take = (pred: (q: PlacementQuestion) => boolean) => {
    const i = pool.findIndex(pred);
    if (i >= 0) picked.push(...pool.splice(i, 1));
  };
  for (const skill of PLACEMENT_SKILLS) take((q) => q.skill === skill);
  for (const level of PLACEMENT_LEVELS) {
    if (!picked.some((q) => q.level === level)) take((q) => q.level === level);
  }
  while (picked.length < count && pool.length) picked.push(pool.shift()!);
  return shuffle(picked, rand).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: shuffle([q.correct, ...q.distractors], rand),
  }));
}

const norm = (s: string) => s.trim().toLowerCase();

/** Grade by answer value against the bank — never by option position. */
export function gradePlacementAnswers(
  answers: { itemId: string; answer: string }[],
): {
  correctCount: number;
  pillarHits: Record<string, { correct: number; total: number }>;
  graded: number;
} {
  const pillarHits: Record<string, { correct: number; total: number }> = {};
  const seen = new Set<string>();
  let correctCount = 0;
  for (const { itemId, answer } of answers) {
    const q = getPlacementQuestion(itemId);
    if (!q || seen.has(itemId) || typeof answer !== "string") continue;
    seen.add(itemId);
    const ok = norm(q.correct) === norm(answer);
    if (ok) correctCount += 1;
    const b = (pillarHits[q.pillar] ??= { correct: 0, total: 0 });
    b.total += 1;
    if (ok) b.correct += 1;
  }
  return { correctCount, pillarHits, graded: seen.size };
}
