import { describe, it, expect } from 'vitest';
import { Problem } from './logic';
import {
  FORMATS, LEVELS, PREK_COUNT_MAX, VISUAL_MAX, Band, historyKey, levelForGrade, loadRecent,
  makeVariedRound, modesForLevel, saveRecent, seededRng,
} from './variety';

const BANDS = Object.keys(LEVELS) as Band[];
const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };

/** Independently re-derive the right answer from the problem's numbers. */
function expected(p: Problem): number {
  if (p.key?.startsWith('count:')) return (p.visual ?? '').match(/\p{Extended_Pictographic}/gu)!.length;
  if (p.format === 'missing') return p.b;
  return { add: p.a + p.b, sub: p.a - p.b, mul: p.a * p.b, div: p.a / p.b }[p.op];
}

describe('variety', () => {
  it('answers are correct and options valid for every band, mode, and format', () => {
    for (const band of BANDS) for (const mode of modesForLevel(LEVELS[band])) for (let s = 1; s <= 60; s++) {
      for (const p of makeVariedRound(mode, { level: LEVELS[band], rng: seededRng(s) })) {
        expect(p.answer).toBe(expected(p));
        expect(Number.isInteger(p.answer) && p.answer >= 0).toBe(true);
        expect(p.options).toContain(p.answer);
        expect(new Set(p.options).size).toBe(4);
        if (p.format === 'missing') expect(p.text).toBe(`${p.a} ${({ add: '+', sub: '−', mul: '×', div: '÷' })[p.op]} _ = ${({ add: p.a + p.b, sub: p.a - p.b, mul: p.a * p.b, div: p.a / p.b })[p.op]}`);
        if (p.format === 'word') expect(p.text).toMatch(/\?$/);
        if (p.format === 'count' && !p.key?.startsWith('count:')) {
          const [left, right] = p.visual!.split(/ [+−] /);
          const n = (x: string) => (x.match(/\p{Extended_Pictographic}/gu) ?? []).length;
          expect([n(left), n(right)]).toEqual([p.a, p.b]);
        }
      }
    }
  });

  it('generates every format, with no fact repeated in a round or back to back', () => {
    for (const band of BANDS) for (let s = 1; s <= 40; s++) {
      const round = makeVariedRound('mixed', { level: LEVELS[band], rng: seededRng(s * 7919) });
      expect(round).toHaveLength(10);
      expect(new Set(round.map(p => p.format))).toEqual(new Set(FORMATS));
      expect(new Set(round.map(p => p.key)).size).toBe(round.length);
      round.forEach((p, i) => { if (i) expect(p.key).not.toBe(round[i - 1].key); });
    }
  });

  it('keeps each grade in range', () => {
    for (let s = 1; s <= 200; s++) {
      for (const p of makeVariedRound('mixed', { level: LEVELS.PreK, rng: seededRng(s) })) {
        expect(p.op).toBe('add');
        if (p.key?.startsWith('count:')) expect(p.answer).toBeLessThanOrEqual(PREK_COUNT_MAX);
        else expect(p.a + p.b).toBeLessThanOrEqual(5);
      }
      for (const p of makeVariedRound('mixed', { level: LEVELS.K, rng: seededRng(s) })) {
        expect(['add', 'sub']).toContain(p.op);
        expect(Math.max(p.a, p.b, p.op === 'add' ? p.a + p.b : p.a)).toBeLessThanOrEqual(10);
      }
      for (const p of makeVariedRound('mixed', { level: LEVELS['1'], rng: seededRng(s) })) expect(Math.max(p.a, p.op === 'add' ? p.a + p.b : 0)).toBeLessThanOrEqual(20);
      for (const p of makeVariedRound('mixed', { level: LEVELS['3'], rng: seededRng(s) })) {
        if (p.op === 'mul') expect(Math.max(p.a, p.b)).toBeLessThanOrEqual(10);
        if (p.format === 'count') expect(Math.max(p.a, p.b)).toBeLessThanOrEqual(VISUAL_MAX);
      }
    }
    expect(levelForGrade(undefined).band).toBe('none');
    expect(levelForGrade('PreK').band).toBe('PreK');
    expect(levelForGrade('weird').band).toBe('none');
    expect(modesForLevel(LEVELS.none)).toEqual(['add', 'sub', 'mul', 'div', 'mixed']);
  });

  it('different seeds give different sequences; same seed is reproducible', () => {
    const seq = (s: number) => makeVariedRound('mixed', { level: LEVELS['2'], rng: seededRng(s) }).map(p => p.text).join('|');
    expect(seq(1)).not.toBe(seq(2));
    expect(seq(42)).toBe(seq(42));
    expect(new Set(Array.from({ length: 20 }, (_, i) => seq(i + 100))).size).toBe(20);
  });

  it('avoids problems in the kid\'s recent history, persisted per kid', () => {
    const store = memory();
    const first = makeVariedRound('mixed', { level: LEVELS['1'], rng: seededRng(5) });
    saveRecent(store, 'kid-a', first);
    expect(loadRecent(store, 'kid-a')).toEqual(first.map(p => p.key));
    expect(loadRecent(store, 'kid-b')).toEqual([]);
    expect(store.getItem(historyKey(null))).toBeNull();
    for (let s = 6; s < 40; s++) {
      const next = makeVariedRound('mixed', { level: LEVELS['1'], rng: seededRng(s), recent: loadRecent(store, 'kid-a') });
      for (const p of next) expect(first.map(q => q.key)).not.toContain(p.key);
    }
    for (let i = 0; i < 10; i++) saveRecent(store, 'kid-a', first);
    expect(loadRecent(store, 'kid-a').length).toBeLessThanOrEqual(40);
  });
});
