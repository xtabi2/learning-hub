import { describe, it, expect } from 'vitest';
import { makeFact, makeOptions, makeProblem, makeRound, summarize, Op, Result } from './logic';
const N = 2000;
describe('facts', () => {
  it('addition sums <= 20', () => { for (let i = 0; i < N; i++) { const f = makeFact('add'); expect(f.a + f.b).toBe(f.answer); expect(f.answer).toBeLessThanOrEqual(20); expect(Math.min(f.a, f.b)).toBeGreaterThanOrEqual(0); } });
  it('subtraction no negatives, minuend <= 20', () => { for (let i = 0; i < N; i++) { const f = makeFact('sub'); expect(f.a).toBeLessThanOrEqual(20); expect(f.answer).toBeGreaterThanOrEqual(0); expect(f.a - f.b).toBe(f.answer); } });
  it('multiplication factors 0-5', () => { for (let i = 0; i < N; i++) { const f = makeFact('mul'); expect(f.a).toBeLessThanOrEqual(5); expect(f.b).toBeLessThanOrEqual(5); expect(f.a * f.b).toBe(f.answer); } });
  it('division whole, divisor 1-5, quotient 0-5', () => { for (let i = 0; i < N; i++) { const f = makeFact('div'); expect(f.b).toBeGreaterThanOrEqual(1); expect(f.b).toBeLessThanOrEqual(5); expect(f.answer).toBeLessThanOrEqual(5); expect(Number.isInteger(f.answer)).toBe(true); expect(f.b * f.answer).toBe(f.a); } });
});
describe('options', () => {
  it('4 unique non-negative incl. correct', () => {
    for (const ans of [0, 1, 2, 3, 10, 25]) for (let i = 0; i < 200; i++) {
      const o = makeOptions(ans); expect(o).toHaveLength(4); expect(new Set(o).size).toBe(4); expect(o).toContain(ans);
      o.forEach(v => { expect(v).toBeGreaterThanOrEqual(0); expect(Math.abs(v - ans)).toBeLessThanOrEqual(8); });
    }
  });
  it('problems in every mode have valid options', () => {
    for (const m of ['add', 'sub', 'mul', 'div', 'mixed'] as const) for (let i = 0; i < 300; i++) { const p = makeProblem(m); expect(p.options).toContain(p.answer); expect(new Set(p.options).size).toBe(4); }
  });
  it('round has 10 problems', () => { expect(makeRound('mixed')).toHaveLength(10); });
});
describe('summary', () => {
  it('computes accuracy, avg, slowest', () => {
    const mk = (ms: number, correct: boolean): Result => ({ problem: { a: 1, b: 1, op: 'add' as Op, answer: 2, options: [] }, chosen: 2, correct, ms });
    const rs = [mk(1000, true), mk(3000, false), mk(2000, true), mk(1500, true)];
    const s = summarize(rs);
    expect(s.correct).toBe(3); expect(s.pct).toBe(75); expect(s.avgSec).toBe(1.9);
    expect(s.slowest.map(r => r.ms)).toEqual([3000, 2000, 1500]);
  });
  it('handles empty', () => { expect(summarize([]).avgSec).toBe(0); });
});
