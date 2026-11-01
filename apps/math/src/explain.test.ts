import { describe, expect, it } from 'vitest';
import { explain, toSpeech, pictureFact } from './explain';
import { makeVariedRound, LEVELS, seededRng, Band } from './variety';
import { makeAlgebraProblem, AlgebraKind } from './algebra';

describe('wrong-answer explanations', () => {
  it('shows a picture fact like 3 🍎 + 2 🍎 = 5 🍎', () => {
    expect(pictureFact('add', 3, 2, '🍎')).toContain('3 🍎 + 2 🍎 = 5 🍎');
  });
  it('every format at every level has an answer, a why, and speech without emoji', () => {
    for (const band of ['PreK', 'K', '1', '2', '3', 'none'] as Band[]) {
      for (let seed = 1; seed <= 30; seed++) {
        for (const p of makeVariedRound('mixed', { level: LEVELS[band], rng: seededRng(seed), recent: [] })) {
          const e = explain(p, band === 'PreK' || band === 'K');
          expect(e.answer).toBe(p.choices ? p.choices[p.answer] : String(p.answer));
          expect(e.text.length).toBeGreaterThan(5);
          expect(e.say).not.toMatch(/\p{Extended_Pictographic}/u);
          if (band === 'PreK' || band === 'K') expect(e.visual, `${band} ${p.text}`).toBeTruthy();
        }
      }
    }
  });
  it('covers each algebra kind', () => {
    const kinds: AlgebraKind[] = ['pattern', 'sort', 'true-false', 'unknown', 'fact-family', 'make-ten'];
    for (const k of kinds) {
      const p = makeAlgebraProblem('add', LEVELS['1'], seededRng(7), k);
      const e = explain(p);
      expect(e.text).not.toMatch(/__/);
    }
    const tf = explain(makeAlgebraProblem('add', LEVELS['1'], seededRng(3), 'true-false'));
    expect(tf.text).toMatch(/so it is (True|False)/);
  });
  it('missing number explains the full fact', () => {
    const e = explain({ a: 4, b: 3, op: 'add', answer: 3, format: 'missing', text: '4 + _ = 7', options: [3] });
    expect(e.text).toBe('The missing number is 3, because 4 + 3 = 7.');
    expect(e.say).toContain('4 plus 3 equals 7');
  });
  it('toSpeech reads symbols as words', () => {
    expect(toSpeech('12 ÷ 3 = 4 🍎')).toBe('12 divided by 3 equals 4');
  });
});
