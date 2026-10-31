import { describe, expect, it } from 'vitest';
import { LEVELS, levelFor, makeVariedRound, optionCap, seededRng } from './variety';

describe('grade progression in math', () => {
  it('early 1st grade reviews K scope with ranges ramping up', () => {
    const l = levelFor('1', 0.32);
    expect(l.band).toBe('1');
    expect(l.addMax).toBe(13);
    expect(levelFor('1', 1)).toEqual(LEVELS['1']);
    expect(levelFor('1', 0).addMax).toBe(10);
  });
  it("new operations wait until about November", () => {
    expect(levelFor('2', 0.2).ops).not.toContain('mul');
    expect(levelFor('2', 0.5).ops).toContain('mul');
    expect(levelFor('3', 0.2).ops).not.toContain('div');
    expect(levelFor('PreK', 0.1)).toEqual(LEVELS.PreK);
  });
  it('wrong-answer choices stay within the grade range', () => {
    for (const [g, p] of [['PreK', 0.32], ['K', 0.32], ['1', 0.32], ['1', 1], ['2', 1], ['3', 1]] as const) {
      const level = levelFor(g, p);
      for (let s = 1; s <= 40; s++) {
        for (const prob of makeVariedRound('mixed', { level, rng: seededRng(s) })) {
          if (prob.choices) continue;
          const cap = Math.max(prob.answer, optionCap(level));
          expect(prob.options.every(o => o >= 0 && o <= cap), `${g} ${prob.text} ${prob.options}`).toBe(true);
          expect(prob.options).toContain(prob.answer);
          expect(new Set(prob.options).size).toBe(prob.options.length);
        }
      }
    }
    expect(optionCap(LEVELS.PreK)).toBe(10);
    expect(optionCap(LEVELS.K)).toBe(10);
    expect(optionCap(LEVELS['1'])).toBe(20);
  });
});
