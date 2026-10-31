export type Op = 'add' | 'sub' | 'mul' | 'div';
export type Mode = Op | 'mixed';
export interface Problem {
  a: number; b: number; op: Op; answer: number; options: number[];
  /** Varied formats: 'fact' (a op b), 'missing' (a op _ = c), 'word', 'count' (emoji objects). */
  format?: 'fact' | 'missing' | 'word' | 'count' | 'algebra';
  text?: string; visual?: string; key?: string;
  /** Word-bank / algebra metadata. */
  template?: string; theme?: string; kind?: string; speak?: string;
  /** Non-numeric answers (patterns, true/false): options are indexes into choices. */
  choices?: string[];
}
export interface Result { problem: Problem; chosen: number; correct: boolean; ms: number; }
export const ROUND_LENGTH = 10;
export const SYMBOL: Record<Op, string> = { add: '+', sub: '−', mul: '×', div: '÷' };

type Rng = () => number;
const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

export function makeFact(op: Op, rng: Rng = Math.random): { a: number; b: number; answer: number } {
  switch (op) {
    case 'add': { const s = ri(rng, 0, 20); const a = ri(rng, 0, s); return { a, b: s - a, answer: s }; }
    case 'sub': { const a = ri(rng, 0, 20); const b = ri(rng, 0, a); return { a, b, answer: a - b }; }
    case 'mul': { const a = ri(rng, 0, 5); const b = ri(rng, 0, 5); return { a, b, answer: a * b }; }
    case 'div': { const d = ri(rng, 1, 5); const q = ri(rng, 0, 5); return { a: d * q, b: d, answer: q }; }
  }
}

export function makeOptions(answer: number, rng: Rng = Math.random): number[] {
  const set = new Set<number>([answer]);
  const offsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, 6, 7, 8];
  for (let i = offsets.length - 1; i > 0; i--) { const j = ri(rng, 0, i); [offsets[i], offsets[j]] = [offsets[j], offsets[i]]; }
  for (const o of offsets) { if (set.size >= 4) break; const v = answer + o; if (v >= 0) set.add(v); }
  const arr = [...set];
  for (let i = arr.length - 1; i > 0; i--) { const j = ri(rng, 0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

export function makeProblem(mode: Mode, rng: Rng = Math.random): Problem {
  const ops: Op[] = ['add', 'sub', 'mul', 'div'];
  const op = mode === 'mixed' ? ops[ri(rng, 0, 3)] : mode;
  const f = makeFact(op, rng);
  return { ...f, op, options: makeOptions(f.answer, rng) };
}

export function makeRound(mode: Mode, n = ROUND_LENGTH, rng: Rng = Math.random): Problem[] {
  const out: Problem[] = []; const seen = new Set<string>();
  for (let tries = 0; out.length < n; tries++) {
    const p = makeProblem(mode, rng); const k = `${p.a}${p.op}${p.b}`;
    if (seen.has(k) && tries < 200) continue; seen.add(k); out.push(p);
  }
  return out;
}

export const factText = (p: Problem) => `${p.a} ${SYMBOL[p.op]} ${p.b}`;
/** Full worked answer for feedback / summary, for any format. */
const compute = (p: Problem) => ({ add: p.a + p.b, sub: p.a - p.b, mul: p.a * p.b, div: p.b ? p.a / p.b : 0 })[p.op];
export const answerText = (p: Problem) =>
  p.choices ? `${p.text} ${p.choices[p.answer]}` : p.format === 'algebra' ? `${p.text} → ${p.answer}` : p.key?.startsWith('count:') ? `${p.answer}` : `${factText(p)} = ${compute(p)}`;

export function summarize(results: Result[]) {
  const total = results.length;
  const correct = results.filter(r => r.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const avgSec = total ? Math.round(results.reduce((s, r) => s + r.ms, 0) / total / 100) / 10 : 0;
  const slowest = [...results].sort((x, y) => y.ms - x.ms).slice(0, 3);
  return { total, correct, pct, avgSec, slowest };
}
