import { Mode, Op, Problem, ROUND_LENGTH, SYMBOL, makeOptions } from './logic';
import { makeWordProblem } from './wordBank';
import { makeAlgebraProblem } from './algebra';

export type Format = 'fact' | 'missing' | 'word' | 'count' | 'algebra';
export type Rng = () => number;
export const FORMATS: Format[] = ['fact', 'missing', 'word', 'count', 'algebra'];
/** Minimum per 10-problem round when a kid is selected (scaled for other round sizes). */
export const MIN_WORD = 3;
export const MIN_ALGEBRA = 2;

/** Grade band from the shared profile; 'none' keeps the original ranges when no kid is selected. */
export type Band = 'PreK' | 'K' | '1' | '2' | '3' | 'none';
export interface Level {
  band: Band;
  ops: Op[];
  addMax: number;      // largest sum / minuend
  mulMax: number;      // largest factor (mul) or divisor/quotient (div)
  formats: Record<Format, number>; // weights
}

export const LEVELS: Record<Band, Level> = {
  PreK: { band: 'PreK', ops: ['add'], addMax: 5, mulMax: 0, formats: { count: 3, word: 3, algebra: 2, fact: 1, missing: 1 } },
  K: { band: 'K', ops: ['add', 'sub'], addMax: 10, mulMax: 0, formats: { fact: 2, count: 2, missing: 1, word: 3, algebra: 2 } },
  '1': { band: '1', ops: ['add', 'sub'], addMax: 20, mulMax: 0, formats: { fact: 2, missing: 1, word: 3, count: 1, algebra: 2 } },
  '2': { band: '2', ops: ['add', 'sub', 'mul'], addMax: 50, mulMax: 5, formats: { fact: 2, missing: 1, word: 3, count: 1, algebra: 2 } },
  '3': { band: '3', ops: ['add', 'sub', 'mul', 'div'], addMax: 100, mulMax: 10, formats: { fact: 2, missing: 1, word: 3, count: 1, algebra: 2 } },
  none: { band: 'none', ops: ['add', 'sub', 'mul', 'div'], addMax: 20, mulMax: 5, formats: { fact: 2, missing: 1, word: 3, count: 1, algebra: 2 } },
};

/** Pre-K counting goes up to 10 objects even though its sums stay within 5. */
export const PREK_COUNT_MAX = 10;
/** Visual problems only when every number fits on screen as objects. */
export const VISUAL_MAX = 10;

export function levelForGrade(grade: string | null | undefined): Level {
  return grade && grade in LEVELS ? LEVELS[grade as Band] : LEVELS.none;
}

const BAND_ORDER: Band[] = ['PreK', 'K', '1', '2', '3'];
/** Before this point in the year (about November) a grade's new operations stay in review mode. */
export const NEW_OPS_FROM = 0.34;

/**
 * Level for a grade part-way through the school year: number ranges ramp from last year's
 * ranges to this year's, and this year's new operations join once progress reaches NEW_OPS_FROM.
 */
export function levelFor(grade: string | null | undefined, progress = 1): Level {
  const cur = levelForGrade(grade);
  const i = BAND_ORDER.indexOf(cur.band);
  const p = Math.min(1, Math.max(0, progress));
  if (i <= 0 || p >= 1) return cur;
  const prev = LEVELS[BAND_ORDER[i - 1]];
  const ops = p >= NEW_OPS_FROM ? cur.ops : cur.ops.filter(op => prev.ops.includes(op));
  const mulPrev = prev.mulMax || (ops.includes('mul') || ops.includes('div') ? 2 : 0);
  return {
    ...cur,
    ops,
    addMax: Math.round(prev.addMax + (cur.addMax - prev.addMax) * p),
    mulMax: cur.mulMax ? Math.max(2, Math.round(mulPrev + (cur.mulMax - mulPrev) * p)) : 0,
  };
}

/** Largest number a wrong-answer choice may show at this level (Pre-K counts to 10). */
export function optionCap(level: Level): number {
  if (level.band === 'none') return Infinity;
  if (level.band === 'PreK') return PREK_COUNT_MAX;
  return Math.max(level.addMax, level.mulMax * level.mulMax, VISUAL_MAX);
}

export function modesForLevel(level: Level): Mode[] {
  return level.ops.length > 1 ? [...level.ops, 'mixed'] : [...level.ops];
}

// ---------- randomness ----------
export function newSeed(): number {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.getRandomValues) return c.getRandomValues(new Uint32Array(1))[0];
  return Math.floor(Math.random() * 2 ** 32);
}

/** Small seeded PRNG (mulberry32): a fresh seed per session, reproducible in tests. */
export function seededRng(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[ri(rng, 0, xs.length - 1)];
export function shuffle<T>(xs: T[], rng: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = ri(rng, 0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- content ----------
const THINGS: { emoji: string; one: string; many: string }[] = [
  { emoji: '🍎', one: 'apple', many: 'apples' }, { emoji: '⭐', one: 'star', many: 'stars' },
  { emoji: '🐟', one: 'fish', many: 'fish' }, { emoji: '🎈', one: 'balloon', many: 'balloons' },
  { emoji: '🍪', one: 'cookie', many: 'cookies' }, { emoji: '🐞', one: 'ladybug', many: 'ladybugs' },
  { emoji: '🚗', one: 'toy car', many: 'toy cars' }, { emoji: '🌸', one: 'flower', many: 'flowers' },
  { emoji: '🧁', one: 'cupcake', many: 'cupcakes' }, { emoji: '🦆', one: 'duck', many: 'ducks' },
];

// ---------- facts per level ----------
export function levelFact(op: Op, level: Level, rng: Rng, small = false): { a: number; b: number; answer: number } {
  const max = small ? Math.min(level.addMax, VISUAL_MAX) : level.addMax;
  const big = !small && level.addMax > 20;
  switch (op) {
    case 'add': { const s = ri(rng, big ? 10 : 1, max); const a = ri(rng, 0, s); return { a, b: s - a, answer: s }; }
    case 'sub': { const a = ri(rng, big ? 10 : 1, max); const b = ri(rng, 0, a); return { a, b, answer: a - b }; }
    case 'mul': { const m = Math.max(level.mulMax, 1); const a = ri(rng, 0, m); const b = ri(rng, 0, m); return { a, b, answer: a * b }; }
    case 'div': { const m = Math.max(level.mulMax, 1); const d = ri(rng, 1, m); const q = ri(rng, 0, m); return { a: d * q, b: d, answer: q }; }
  }
}


/** Make one problem of a given op and format. Returns null if the format doesn't fit (e.g. too big to draw). */
export function makeFormatted(op: Op, format: Format, level: Level, rng: Rng): Problem | null {
  if (format === 'count') {
    if (op === 'mul' || op === 'div') return null;
    const t = pick(rng, THINGS);
    if (level.band === 'PreK' && rng() < 0.5) {
      const n = ri(rng, 1, PREK_COUNT_MAX);
      return { a: n, b: 0, op: 'add', answer: n, format, key: `count:${n}`,
        text: 'How many?', visual: t.emoji.repeat(n), options: makeOptions(n, rng) };
    }
    const f = levelFact(op, level, rng, true);
    if (Math.max(f.a, f.b, f.answer) > VISUAL_MAX || f.a === 0 || f.b === 0) return null;
    const visual = `${t.emoji.repeat(f.a) || ''} ${SYMBOL[op]} ${t.emoji.repeat(f.b) || ''}`;
    return { ...f, op, format, key: `${f.a}${op}${f.b}`, text: 'How many?', visual, options: makeOptions(f.answer, rng) };
  }
  if (format === 'word') return makeWordProblem(op, level, rng);
  if (format === 'algebra') return makeAlgebraProblem(op, level, rng);
  const f = levelFact(op, level, rng);
  const key = `${f.a}${op}${f.b}`;
  if (format === 'fact') return { ...f, op, format, key, text: `${f.a} ${SYMBOL[op]} ${f.b} = ?`, options: makeOptions(f.answer, rng) };
  if (format === 'missing') {
    // a op _ = result  → the hidden number is b
    if (op === 'mul' && f.a === 0) return null; // 0 × _ = 0 has no single answer
    return { ...f, op, format, key, answer: f.b, text: `${f.a} ${SYMBOL[op]} _ = ${f.answer}`, options: makeOptions(f.b, rng) };
  }
  return null;
}

/** Weighted format list for a round so every allowed format shows up, then shuffled. */
export function planFormats(level: Level, n: number, rng: Rng): Format[] {
  const allowed = FORMATS.filter(f => level.formats[f] > 0);
  const plan: Format[] = [...allowed];
  if (level.band !== 'none') {
    // A selected kid always gets enough story and algebraic-thinking problems.
    const scale = n / ROUND_LENGTH;
    for (let i = 1; i < Math.round(MIN_WORD * scale); i++) plan.push('word');
    for (let i = 1; i < Math.round(MIN_ALGEBRA * scale); i++) plan.push('algebra');
  }
  const bag = allowed.flatMap(f => Array(level.formats[f]).fill(f) as Format[]);
  while (plan.length < n) plan.push(pick(rng, bag));
  return shuffle(plan.slice(0, n), rng);
}

export interface RoundOptions { level?: Level; n?: number; rng?: Rng; recent?: string[] }

/**
 * Build a varied round: per-session RNG, mixed formats, no fact repeated within the round,
 * none from the kid's recent history when possible, and never the same fact twice in a row.
 */
export function makeVariedRound(mode: Mode, opts: RoundOptions = {}): Problem[] {
  const level = opts.level ?? LEVELS.none;
  const n = opts.n ?? ROUND_LENGTH;
  const rng = opts.rng ?? seededRng(newSeed());
  const recent = new Set(opts.recent ?? []);
  const ops = mode === 'mixed' ? level.ops : (level.ops.includes(mode) ? [mode] : level.ops);
  const formats = planFormats(level, n, rng);
  const out: Problem[] = []; const used = new Set<string>();
  for (const format of formats) {
    let chosen: Problem | null = null; let fallback: Problem | null = null;
    for (let tries = 0; tries < 200 && !chosen; tries++) {
      const op = mode === 'mixed' && tries === 0 && out.length < ops.length ? ops[out.length] : pick(rng, ops);
      const f = tries < 120 ? format : 'fact';
      const p = makeFormatted(op, f, level, rng);
      if (!p || used.has(p.key!)) continue;
      if (out.length && out[out.length - 1].key === p.key) continue;
      if (recent.has(p.key!) && tries < 150) { fallback ??= p; continue; }
      chosen = p;
    }
    chosen ??= fallback ?? makeFormatted(pick(rng, ops), 'fact', level, rng)!;
    // Keep every wrong-answer choice inside the grade's number range.
    if (!chosen.choices && level.band !== 'none') {
      chosen = { ...chosen, options: makeOptions(chosen.answer, rng, Math.max(chosen.answer, optionCap(level))) };
    }
    used.add(chosen.key!); out.push(chosen);
  }
  // Final order shuffle; reshuffle until no two neighbours share a fact (they're unique, so this is a guard).
  let order = shuffle(out, rng);
  for (let i = 0; i < 20 && order.some((p, j) => j > 0 && order[j - 1].key === p.key); i++) order = shuffle(out, rng);
  return order;
}

// ---------- per-kid recent history ----------
export const HISTORY_SIZE = 40;
export const historyKey = (childId: string | null | undefined) => `learning-hub.math-recent.v1:${childId ?? 'guest'}`;
type Store = Pick<Storage, 'getItem' | 'setItem'>;

export function loadRecent(store: Store | undefined, childId: string | null | undefined): string[] {
  try {
    const raw = store?.getItem(historyKey(childId));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.map(String).slice(-HISTORY_SIZE) : [];
  } catch { return []; }
}

export function saveRecent(store: Store | undefined, childId: string | null | undefined, round: Problem[]): string[] {
  const next = [...loadRecent(store, childId), ...round.map(p => p.key ?? `${p.a}${p.op}${p.b}`)].slice(-HISTORY_SIZE);
  try { store?.setItem(historyKey(childId), JSON.stringify(next)); } catch { /* storage full or blocked */ }
  return next;
}
