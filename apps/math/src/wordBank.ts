import { Op, Problem, SYMBOL, makeOptions } from './logic';
import type { Band, Level, Rng } from './variety';

/** Kid-friendly names and themed objects for the word-problem bank. */
export const NAMES = ['Maya', 'Leo', 'Zara', 'Sam', 'Ava', 'Noah', 'Lily', 'Omar', 'Ruby', 'Max', 'Ivy', 'Ben',
  'Mia', 'Eli', 'Nina', 'Kai', 'Rosa', 'Theo', 'June', 'Finn', 'Priya', 'Jack', 'Lena', 'Hugo'];

export interface Thing { emoji: string; one: string; many: string; theme: string }
export const THINGS: Thing[] = [
  { theme: 'animals', emoji: '🐶', one: 'puppy', many: 'puppies' }, { theme: 'animals', emoji: '🐱', one: 'kitten', many: 'kittens' },
  { theme: 'animals', emoji: '🐰', one: 'bunny', many: 'bunnies' }, { theme: 'animals', emoji: '🦆', one: 'duck', many: 'ducks' },
  { theme: 'animals', emoji: '🐸', one: 'frog', many: 'frogs' }, { theme: 'animals', emoji: '🐢', one: 'turtle', many: 'turtles' },
  { theme: 'space', emoji: '🚀', one: 'rocket', many: 'rockets' }, { theme: 'space', emoji: '⭐', one: 'star', many: 'stars' },
  { theme: 'space', emoji: '🪐', one: 'planet', many: 'planets' }, { theme: 'space', emoji: '👽', one: 'alien', many: 'aliens' },
  { theme: 'snacks', emoji: '🍎', one: 'apple', many: 'apples' }, { theme: 'snacks', emoji: '🍪', one: 'cookie', many: 'cookies' },
  { theme: 'snacks', emoji: '🧁', one: 'cupcake', many: 'cupcakes' }, { theme: 'snacks', emoji: '🍓', one: 'strawberry', many: 'strawberries' },
  { theme: 'snacks', emoji: '🍌', one: 'banana', many: 'bananas' }, { theme: 'snacks', emoji: '🥕', one: 'carrot', many: 'carrots' },
  { theme: 'toys', emoji: '🧸', one: 'teddy bear', many: 'teddy bears' }, { theme: 'toys', emoji: '🚗', one: 'toy car', many: 'toy cars' },
  { theme: 'toys', emoji: '🎈', one: 'balloon', many: 'balloons' }, { theme: 'toys', emoji: '⚽', one: 'ball', many: 'balls' },
  { theme: 'toys', emoji: '🧱', one: 'block', many: 'blocks' }, { theme: 'toys', emoji: '🪁', one: 'kite', many: 'kites' },
  { theme: 'dinosaurs', emoji: '🦕', one: 'dino', many: 'dinos' }, { theme: 'dinosaurs', emoji: '🦖', one: 'T. rex', many: 'T. rexes' },
  { theme: 'dinosaurs', emoji: '🥚', one: 'dino egg', many: 'dino eggs' },
  { theme: 'sea', emoji: '🐟', one: 'fish', many: 'fish' }, { theme: 'sea', emoji: '🐚', one: 'shell', many: 'shells' },
  { theme: 'sea', emoji: '🐙', one: 'octopus', many: 'octopuses' },
  { theme: 'garden', emoji: '🌸', one: 'flower', many: 'flowers' }, { theme: 'garden', emoji: '🐞', one: 'ladybug', many: 'ladybugs' },
  { theme: 'garden', emoji: '🦋', one: 'butterfly', many: 'butterflies' }, { theme: 'garden', emoji: '🍂', one: 'leaf', many: 'leaves' },
];

const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[ri(rng, 0, xs.length - 1)];
const n = (k: number, t: Thing) => `${k} ${k === 1 ? t.one : t.many}`;
/** Verb agreement: 1 hides / 2 hide. */
const v = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;

interface Ctx { a: number; b: number; t: Thing; p: string; q: string }
interface Template {
  id: string;
  op: Op;
  /** 'short' = Pre-K / K wording with pictures; 'long' = 1st grade and up. */
  style: 'short' | 'long';
  /** How the story's numbers map to (a op b): 'normal', or 'compare'/'needs' which are subtraction stories. */
  text: (c: Ctx) => string;
}

export const TEMPLATES: Template[] = [
  // ---- short (Pre-K, K): a few words, pictures carry the meaning ----
  { id: 's-add-more', op: 'add', style: 'short', text: c => `${n(c.a, c.t)}. ${v(c.b, 'more comes', 'more come')}. How many now?` },
  { id: 's-add-has', op: 'add', style: 'short', text: c => `${c.p} has ${n(c.a, c.t)}. ${c.p} gets ${c.b} more. How many?` },
  { id: 's-add-and', op: 'add', style: 'short', text: c => `${n(c.a, c.t)} and ${n(c.b, c.t)}. How many in all?` },
  { id: 's-add-sees', op: 'add', style: 'short', text: c => `${c.p} sees ${n(c.a, c.t)}. Then ${c.b} more. How many?` },
  { id: 's-add-two', op: 'add', style: 'short', text: c => `${c.p} has ${c.a}. ${c.q} has ${c.b}. How many ${c.t.many} in all?` },
  { id: 's-sub-away', op: 'sub', style: 'short', text: c => `${n(c.a, c.t)}. ${v(c.b, 'goes', 'go')} away. How many are left?` },
  { id: 's-sub-gives', op: 'sub', style: 'short', text: c => `${c.p} has ${n(c.a, c.t)}. ${c.p} gives ${c.b} away. How many left?` },
  { id: 's-sub-hide', op: 'sub', style: 'short', text: c => `${n(c.a, c.t)}. ${v(c.b, 'hides', 'hide')}. How many can you see?` },
  { id: 's-sub-take', op: 'sub', style: 'short', text: c => `${n(c.a, c.t)}. ${c.p} takes ${c.b}. How many are left?` },
  // ---- long (1st grade and up) ----
  { id: 'l-add-gives', op: 'add', style: 'long', text: c => `${c.p} has ${n(c.a, c.t)}. ${c.q} gives ${c.p} ${c.b} more. How many ${c.t.many} does ${c.p} have now?` },
  { id: 'l-add-days', op: 'add', style: 'long', text: c => `On Monday ${c.p} found ${n(c.a, c.t)}. On Tuesday ${c.p} found ${c.b} more. How many ${c.t.many} did ${c.p} find in all?` },
  { id: 'l-add-together', op: 'add', style: 'long', text: c => `${c.p} has ${n(c.a, c.t)} and ${c.q} has ${n(c.b, c.t)}. How many ${c.t.many} do they have together?` },
  { id: 'l-add-join', op: 'add', style: 'long', text: c => `There are ${n(c.a, c.t)} in the park. ${v(c.b, 'more joins', 'more join')} them. How many ${c.t.many} are in the park now?` },
  { id: 'l-add-box', op: 'add', style: 'long', text: c => `A box holds ${n(c.a, c.t)}. ${c.p} puts in ${c.b} more. How many ${c.t.many} are in the box?` },
  { id: 'l-sub-gives', op: 'sub', style: 'long', text: c => `${c.p} has ${n(c.a, c.t)} and gives ${c.b} to ${c.q}. How many ${c.t.many} does ${c.p} have left?` },
  { id: 'l-sub-left', op: 'sub', style: 'long', text: c => `There were ${n(c.a, c.t)}. ${c.b} of them went home. How many ${c.t.many} are still here?` },
  { id: 'l-sub-compare', op: 'sub', style: 'long', text: c => `${c.p} has ${n(c.a, c.t)}. ${c.q} has ${n(c.b, c.t)}. How many more ${c.t.many} does ${c.p} have than ${c.q}?` },
  { id: 'l-sub-needs', op: 'sub', style: 'long', text: c => `${c.p} wants ${n(c.a, c.t)}. ${c.p} has ${c.b} already. How many more does ${c.p} need?` },
  { id: 'l-sub-sold', op: 'sub', style: 'long', text: c => `A shop had ${n(c.a, c.t)}. It sold ${c.b}. How many ${c.t.many} does the shop have now?` },
  { id: 'l-mul-bags', op: 'mul', style: 'long', text: c => `${c.p} has ${c.a} bags with ${n(c.b, c.t)} in each bag. How many ${c.t.many} in all?` },
  { id: 'l-mul-rows', op: 'mul', style: 'long', text: c => `There are ${c.a} rows of ${c.t.many} with ${c.b} in each row. How many ${c.t.many} are there?` },
  { id: 'l-mul-friends', op: 'mul', style: 'long', text: c => `${c.a} friends each bring ${n(c.b, c.t)}. How many ${c.t.many} do they bring?` },
  { id: 'l-mul-boxes', op: 'mul', style: 'long', text: c => `${c.p} fills ${c.a} boxes. Each box holds ${n(c.b, c.t)}. How many ${c.t.many} is that?` },
  { id: 'l-div-share', op: 'div', style: 'long', text: c => `${c.p} shares ${n(c.a, c.t)} equally among ${c.b} friends. How many does each friend get?` },
  { id: 'l-div-groups', op: 'div', style: 'long', text: c => `${c.p} puts ${n(c.a, c.t)} into groups of ${c.b}. How many groups are there?` },
  { id: 'l-div-bags', op: 'div', style: 'long', text: c => `There are ${n(c.a, c.t)} and ${c.b} bags. The same number go in each bag. How many in each bag?` },
];

/** Numbers for a story: never zero, and always inside the grade's range. */
export function storyNumbers(op: Op, level: Level, rng: Rng): { a: number; b: number; answer: number } {
  const max = level.addMax; const big = max > 20;
  const m = Math.max(level.mulMax, 2);
  switch (op) {
    case 'add': { const s = ri(rng, big ? 10 : 2, max); const a = ri(rng, 1, s - 1); return { a, b: s - a, answer: s }; }
    case 'sub': { const a = ri(rng, big ? 10 : 2, max); const b = ri(rng, 1, a - 1); return { a, b, answer: a - b }; }
    case 'mul': { const a = ri(rng, 2, m); const b = ri(rng, 2, m); return { a, b, answer: a * b }; }
    case 'div': { const d = ri(rng, 2, m); const q = ri(rng, 1, m); return { a: d * q, b: d, answer: q }; }
  }
}

export const isShortBand = (band: Band) => band === 'PreK' || band === 'K';

/** One word problem from the bank: template × theme × names × numbers. */
export function makeWordProblem(op: Op, level: Level, rng: Rng): Problem {
  const style = isShortBand(level.band) ? 'short' : 'long';
  let pool = TEMPLATES.filter(t => t.style === style && t.op === op);
  if (!pool.length) pool = TEMPLATES.filter(t => t.style === style && t.op === 'add');
  const tpl = pick(rng, pool);
  const f = storyNumbers(tpl.op, level, rng);
  const t = pick(rng, THINGS); const p = pick(rng, NAMES); const q = pick(rng, NAMES.filter(x => x !== p));
  const text = tpl.text({ ...f, t, p, q });
  const visual = style === 'short' ? `${t.emoji.repeat(f.a)} ${SYMBOL[tpl.op]} ${t.emoji.repeat(f.b)}` : undefined;
  return { ...f, op: tpl.op, format: 'word', key: `${f.a}${tpl.op}${f.b}`, text, visual, emoji: t.emoji, template: tpl.id, theme: t.theme,
    speak: text, options: makeOptions(f.answer, rng) };
}
