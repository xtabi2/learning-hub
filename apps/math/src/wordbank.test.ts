import { describe, it, expect } from 'vitest';
import { Problem } from './logic';
import { Band, LEVELS, makeVariedRound, modesForLevel, seededRng } from './variety';
import { TEMPLATES, makeWordProblem } from './wordBank';
import { KINDS_BY_BAND, SORT_GROUPS, makeAlgebraProblem } from './algebra';

const KID_BANDS: Band[] = ['PreK', 'K', '1', '2', '3'];
const ALL: Band[] = [...KID_BANDS, 'none'];
const nums = (t: string) => (t.match(/\d+/g) ?? []).map(Number);

/** Evaluate "3 + 4", "12 ÷ 3", "7" safely (digits and operators only). */
function ev(expr: string): number {
  const js = expr.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').trim();
  if (!/^[\d\s+\-*/]+$/.test(js)) throw new Error(`bad expr ${expr}`);
  return Function(`return (${js})`)() as number;
}
/** Independently solve an algebra problem from its text and pictures. */
function solve(p: Problem): number | string {
  const t = p.text!;
  if (p.kind === 'true-false') { const [l, r] = t.replace(/^Is /, '').replace(/\?$/, '').split('='); return ev(l) === ev(r) ? 'True' : 'False'; }
  if (p.kind === 'sort') {
    const group = (e: string) => Object.keys(SORT_GROUPS).find(g => SORT_GROUPS[g].includes(e));
    const odd = p.choices!.filter(c => p.choices!.filter(d => group(d) === group(c)).length === 1);
    expect(odd).toHaveLength(1); return odd[0];
  }
  if (p.kind === 'pattern' && p.choices) {
    const seq = p.visual!.replace('❓', '').trim().split(' ');
    for (let u = 1; u <= 3; u++) if (seq.every((x, i) => i < u || x === seq[i - u])) return seq[seq.length - u];
    throw new Error('no period');
  }
  if (p.kind === 'pattern') {
    const s = nums(t); const d = s[1] - s[0];
    s.forEach((x, i) => { if (i) expect(x - s[i - 1]).toBe(d); });
    return s[s.length - 1] + d;
  }
  // Equations with a blank. For fact families, the given fact must be true too.
  const parts = t.split('. So ');
  if (parts.length === 2) { const [l, r] = parts[0].split('='); expect(ev(l)).toBe(ev(r)); }
  const eq = parts.at(-1)!;
  const hits: number[] = [];
  for (let x = 0; x <= 200; x++) { const [l, r] = eq.replace('__', String(x)).split('='); if (ev(l) === ev(r)) hits.push(x); }
  expect(hits).toHaveLength(1);
  return hits[0];
}

describe('word problem bank', () => {
  it('answers match the story numbers', () => {
    for (const band of ALL) for (const op of LEVELS[band].ops) for (let s = 0; s < 300; s++) {
      const p = makeWordProblem(op, LEVELS[band], seededRng(s * 31 + 1));
      const v = { add: p.a + p.b, sub: p.a - p.b, mul: p.a * p.b, div: p.a / p.b }[p.op];
      expect(p.answer).toBe(v);
      expect(Number.isInteger(p.answer) && p.answer > 0).toBe(true);
      expect(p.text).toContain(String(p.a)); expect(p.text).toContain(String(p.b));
      expect(p.options).toContain(p.answer);
      expect(p.speak).toBe(p.text);
    }
  });

  it('keeps numbers inside each grade', () => {
    const cap: Record<Band, number> = { PreK: 5, K: 10, '1': 20, '2': 50, '3': 100, none: 25 };
    for (const band of ALL) for (const op of LEVELS[band].ops) for (let s = 0; s < 400; s++) {
      const p = makeWordProblem(op, LEVELS[band], seededRng(s + 7));
      for (const x of [p.a, p.b, p.answer, ...nums(p.text!)]) expect(x).toBeLessThanOrEqual(cap[band]);
      if (op === 'mul' || op === 'div') expect(Math.max(op === 'mul' ? p.a : p.answer, p.b)).toBeLessThanOrEqual(Math.max(LEVELS[band].mulMax, 2));
    }
  });

  it('Pre-K and K get short wording with pictures; 1st grade and up get full stories', () => {
    for (const band of KID_BANDS) for (let s = 0; s < 200; s++) {
      const p = makeWordProblem(LEVELS[band].ops[s % LEVELS[band].ops.length], LEVELS[band], seededRng(s));
      const short = band === 'PreK' || band === 'K';
      if (short) {
        expect(p.text!.split(/\s+/).length).toBeLessThanOrEqual(12);
        const [l, r] = p.visual!.split(/ [+−] /);
        const count = (x: string) => [...x.matchAll(/\p{Extended_Pictographic}/gu)].length;
        expect([count(l), count(r)]).toEqual([p.a, p.b]);
      } else expect(p.visual).toBeUndefined();
    }
  });

  it('is large and varied for every grade', () => {
    for (const band of KID_BANDS) {
      const texts = new Set<string>(); const tpls = new Set<string>(); const themes = new Set<string>();
      for (let s = 0; s < 3000; s++) {
        const op = LEVELS[band].ops[s % LEVELS[band].ops.length];
        const p = makeWordProblem(op, LEVELS[band], seededRng(s * 977 + 3));
        texts.add(p.text!); tpls.add(p.template!); themes.add(p.theme!);
      }
      expect(texts.size).toBeGreaterThan(1500);
      expect(tpls.size).toBeGreaterThanOrEqual(band === 'PreK' ? 5 : 9);
      expect(themes.size).toBeGreaterThanOrEqual(7);
    }
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(25);
  });
});

describe('algebraic thinking', () => {
  it('every kind is answered correctly for every grade', () => {
    for (const band of ALL) for (const kind of KINDS_BY_BAND[band]) for (const op of LEVELS[band].ops) for (let s = 0; s < 150; s++) {
      const p = makeAlgebraProblem(op, LEVELS[band], seededRng(s * 13 + 5), kind);
      expect(p.kind).toBe(kind);
      const want = solve(p);
      if (p.choices) { expect(p.choices[p.answer]).toBe(want); expect(new Set(p.choices).size).toBe(p.choices.length); expect(p.options).toEqual(p.choices.map((_, i) => i)); }
      else { expect(p.answer).toBe(want); expect(p.options).toContain(p.answer); expect(new Set(p.options).size).toBe(4); }
    }
  });

  it('covers patterns, true/false, unknowns in every position, fact families, making 10; Pre-K only patterns and sorting', () => {
    expect(KINDS_BY_BAND.PreK).toEqual(['pattern', 'sort']);
    const forms = new Set<string>();
    for (let s = 0; s < 400; s++) {
      const p = makeAlgebraProblem('add', LEVELS['1'], seededRng(s), 'unknown');
      forms.add(p.text!.replace(/\d+/g, 'n'));
      const pk = makeAlgebraProblem('add', LEVELS.PreK, seededRng(s));
      expect(['pattern', 'sort']).toContain(pk.kind);
      expect(pk.choices).toBeDefined();
    }
    expect(forms).toEqual(new Set(['__ + n = n', 'n + __ = n', 'n = __ + n', 'n = n + __']));
    const tf = new Set(Array.from({ length: 200 }, (_, s) => solve(makeAlgebraProblem('add', LEVELS.K, seededRng(s), 'true-false'))));
    expect(tf).toEqual(new Set(['True', 'False']));
    for (let s = 0; s < 100; s++) {
      const p = makeAlgebraProblem('add', LEVELS.K, seededRng(s), 'make-ten');
      expect(p.text).toMatch(/= 10$/);
      expect([...p.visual!.matchAll(/🔴|⚪/gu)]).toHaveLength(10);
    }
  });

  it('keeps algebra numbers inside each grade', () => {
    for (const band of KID_BANDS) for (const kind of KINDS_BY_BAND[band]) for (let s = 0; s < 200; s++) {
      const op = LEVELS[band].ops[s % LEVELS[band].ops.length];
      const p = makeAlgebraProblem(op, LEVELS[band], seededRng(s + 99), kind);
      const cap = band === 'PreK' ? 0 : LEVELS[band].addMax;
      for (const x of nums(p.text!)) expect(x).toBeLessThanOrEqual(cap);
      if (!p.choices) expect(p.answer).toBeLessThanOrEqual(cap);
    }
  });
});

describe('rounds', () => {
  it('every round for a selected kid has at least 3 word problems and 2 algebra problems, no repeats', () => {
    for (const band of KID_BANDS) for (const mode of modesForLevel(LEVELS[band])) for (let s = 0; s < 60; s++) {
      const round = makeVariedRound(mode, { level: LEVELS[band], rng: seededRng(s * 101 + 9) });
      expect(round).toHaveLength(10);
      expect(round.filter(p => p.format === 'word').length).toBeGreaterThanOrEqual(3);
      expect(round.filter(p => p.format === 'algebra').length).toBeGreaterThanOrEqual(2);
      expect(new Set(round.map(p => p.key)).size).toBe(10);
    }
  });

  it('avoids recent word problems across sessions', () => {
    const first = makeVariedRound('mixed', { level: LEVELS['1'], rng: seededRng(1) });
    const recent = first.map(p => p.key!);
    for (let s = 2; s < 30; s++) for (const p of makeVariedRound('mixed', { level: LEVELS['1'], rng: seededRng(s), recent })) expect(recent).not.toContain(p.key);
  });
});
