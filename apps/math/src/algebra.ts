import { Op, Problem, SYMBOL, makeOptions } from './logic';
import { storyNumbers } from './wordBank';
import type { Band, Level, Rng } from './variety';

/**
 * "Algebraic thinking" problems, following Ohio's Operations and Algebraic Thinking strands:
 * patterns, the equal sign (true/false), unknowns in any position, fact families, and making 10.
 * Pre-K gets only picture patterns and sorting.
 */
export type AlgebraKind = 'pattern' | 'sort' | 'true-false' | 'unknown' | 'fact-family' | 'make-ten';

export const KINDS_BY_BAND: Record<Band, AlgebraKind[]> = {
  PreK: ['pattern', 'sort'],
  K: ['pattern', 'true-false', 'unknown', 'make-ten'],
  '1': ['pattern', 'true-false', 'unknown', 'fact-family', 'make-ten'],
  '2': ['pattern', 'true-false', 'unknown', 'fact-family', 'make-ten'],
  '3': ['pattern', 'true-false', 'unknown', 'fact-family', 'make-ten'],
  none: ['pattern', 'true-false', 'unknown', 'fact-family', 'make-ten'],
};

export const PATTERN_SHAPES = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '❤️', '🔺', '🟦', '🌙'];
/** Units for picture patterns: AB, AAB, ABB, ABC. */
export const PATTERN_UNITS = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]];
export const SORT_GROUPS: Record<string, string[]> = {
  fruit: ['🍎', '🍌', '🍓', '🍇', '🍐', '🍊'],
  animals: ['🐶', '🐱', '🐰', '🐸', '🐢', '🦆'],
  vehicles: ['🚗', '🚌', '🚀', '🚲', '🚂', '⛵'],
  shapes: ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
};

const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[ri(rng, 0, xs.length - 1)];
const shuffle = <T,>(xs: T[], rng: Rng): T[] => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = ri(rng, 0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function choiceProblem(kind: AlgebraKind, text: string, visual: string | undefined, choices: string[], correct: string, rng: Rng, shuffleChoices = true): Problem {
  const list = shuffleChoices ? shuffle(choices, rng) : choices;
  const answer = list.indexOf(correct);
  return { a: 0, b: 0, op: 'add', answer, format: 'algebra', kind, text, visual, choices: list,
    options: list.map((_, i) => i), key: `alg:${kind}:${text}:${visual ?? ''}`, speak: text };
}

function numberProblem(kind: AlgebraKind, op: Op, a: number, b: number, answer: number, text: string, rng: Rng, visual?: string): Problem {
  return { a, b, op, answer, format: 'algebra', kind, text, visual, options: makeOptions(answer, rng), key: `alg:${kind}:${text}`,
    speak: text.replace(/__/g, 'blank') };
}

function pattern(level: Level, rng: Rng): Problem {
  if (level.band === 'PreK' || level.band === 'K' && rng() < 0.5) {
    const unit = pick(rng, PATTERN_UNITS);
    const shapes = shuffle(PATTERN_SHAPES, rng).slice(0, 3);
    const seq = Array.from({ length: unit.length * 2 + 1 }, (_, i) => shapes[unit[i % unit.length]]);
    const next = shapes[unit[seq.length % unit.length]];
    const choices = [...new Set([next, ...shapes.slice(0, Math.max(...unit) + 1), shapes[2]])].slice(0, 3);
    return choiceProblem('pattern', 'What comes next?', `${seq.join(' ')} ❓`, choices, next, rng);
  }
  const max = level.addMax;
  const steps = level.band === 'K' ? [1] : level.band === '1' ? [1, 2, 5] : level.band === '2' ? [2, 5, 10] : [2, 3, 4, 5, 10, 25];
  const step = pick(rng, steps.filter(s => s * 4 <= max));
  const down = level.band !== 'K' && rng() < 0.3;
  const start = down ? ri(rng, step * 4, max) : ri(rng, 0, max - step * 4);
  const seq = [0, 1, 2, 3].map(i => down ? start - i * step : start + i * step);
  const answer = down ? start - 4 * step : start + 4 * step;
  return numberProblem('pattern', down ? 'sub' : 'add', seq[3], step, answer, `${seq.join(', ')}, __`, rng);
}

function sort(rng: Rng): Problem {
  const [g1, g2] = shuffle(Object.keys(SORT_GROUPS), rng);
  const same = shuffle(SORT_GROUPS[g1], rng).slice(0, 3);
  const odd = pick(rng, SORT_GROUPS[g2]);
  return choiceProblem('sort', 'Which one does not belong?', undefined, [...same, odd], odd, rng);
}

const result = (op: Op, a: number, b: number) => ({ add: a + b, sub: a - b, mul: a * b, div: a / b })[op];

function trueFalse(op: Op, level: Level, rng: Rng): Problem {
  const f = storyNumbers(op, level, rng);
  const v = f.answer;
  const truth = rng() < 0.5;
  const target = truth ? v : (v <= 1 || rng() < 0.5 ? v + 1 : v - 1);
  // Right side: another addition with the target value, different from the left when possible.
  const c = ri(rng, 0, target); const d = target - c;
  const right = rng() < 0.2 && level.band !== 'K' ? `${target}` : `${c} + ${d}`;
  const text = `Is ${f.a} ${SYMBOL[op]} ${f.b} = ${right}?`;
  return choiceProblem('true-false', text, undefined, ['True', 'False'], truth ? 'True' : 'False', rng, false);
}

function unknown(op: Op, level: Level, rng: Rng): Problem {
  const f = storyNumbers(op, level, rng); const s = SYMBOL[op]; const r = f.answer;
  const forms: [string, number][] = [
    [`__ ${s} ${f.b} = ${r}`, f.a], [`${f.a} ${s} __ = ${r}`, f.b],
    [`${r} = __ ${s} ${f.b}`, f.a], [`${r} = ${f.a} ${s} __`, f.b],
  ];
  const [text, answer] = pick(rng, forms);
  return numberProblem('unknown', op, f.a, f.b, answer, text, rng);
}

function factFamily(op: Op, level: Level, rng: Rng): Problem {
  const base: Op = op === 'mul' || op === 'div' ? 'mul' : 'add';
  const f = storyNumbers(base, level, rng); const r = f.answer;
  const plus = base === 'add';
  const forms: [string, number][] = plus
    ? [[`${f.a} + ${f.b} = ${r}. So ${r} − ${f.b} = __`, f.a], [`${f.a} + ${f.b} = ${r}. So ${r} − ${f.a} = __`, f.b], [`${f.a} + ${f.b} = ${r}. So ${f.b} + ${f.a} = __`, r]]
    : [[`${f.a} × ${f.b} = ${r}. So ${r} ÷ ${f.b} = __`, f.a], [`${f.a} × ${f.b} = ${r}. So ${r} ÷ ${f.a} = __`, f.b], [`${f.a} × ${f.b} = ${r}. So ${f.b} × ${f.a} = __`, r]];
  const [text, answer] = pick(rng, forms);
  return numberProblem('fact-family', base, f.a, f.b, answer, text, rng);
}

function makeTen(level: Level, rng: Rng): Problem {
  if (level.band === 'K' || level.band === '1' && rng() < 0.5) {
    const a = ri(rng, 1, 9);
    const frame = '🔴'.repeat(a) + '⚪'.repeat(10 - a);
    return numberProblem('make-ten', 'add', a, 10 - a, 10 - a, `${a} + __ = 10`, rng, level.band === 'K' ? frame : undefined);
  }
  if (level.band === '1') {
    const a = ri(rng, 6, 9); const b = ri(rng, 11 - a, 9);
    return numberProblem('make-ten', 'add', a, b, a + b - 10, `${a} + ${b} = 10 + __`, rng);
  }
  // 2nd/3rd: make the next ten.
  const tens = ri(rng, 2, Math.floor(level.addMax / 10)) * 10;
  const a = tens - ri(rng, 1, 9);
  return numberProblem('make-ten', 'add', a, tens - a, tens - a, `${a} + __ = ${tens}`, rng);
}

export function makeAlgebraProblem(op: Op, level: Level, rng: Rng, kind?: AlgebraKind): Problem {
  const k = kind ?? pick(rng, KINDS_BY_BAND[level.band]);
  switch (k) {
    case 'pattern': return pattern(level, rng);
    case 'sort': return sort(rng);
    case 'true-false': return trueFalse(op, level, rng);
    case 'unknown': return unknown(op, level, rng);
    case 'fact-family': return factFamily(op, level, rng);
    case 'make-ten': return makeTen(level, rng);
  }
}

export { result as evaluate };
