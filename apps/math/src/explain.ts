import { Op, Problem, SYMBOL } from './logic';
import { SORT_GROUPS } from './algebra';

/** What a kid sees (and hears) after a wrong answer: the right answer and a short why. */
export interface Explanation {
  /** The correct answer as shown on its button. */
  answer: string;
  /** Picture explanation (emoji / dots), always present for Pre-K and K. */
  visual?: string;
  /** One or two short kid-level sentences. */
  text: string;
  /** Speech-friendly version of answer + text for the speaker button. */
  say: string;
}

const DOT = '🔵';
const SMALL = 10;
const calc = (op: Op, a: number, b: number) => ({ add: a + b, sub: a - b, mul: a * b, div: b ? a / b : 0 })[op];
const rep = (e: string, n: number) => e.repeat(Math.max(0, n));
const range = (from: number, to: number, step: number) => { const out: number[] = []; for (let v = from; step > 0 ? v <= to : v >= to; v += step) out.push(v); return out; };

/** Turn math symbols into words and drop emoji so speech sounds natural. */
export function toSpeech(s: string): string {
  return s
    .replace(/__|_/g, ' blank ')
    .replace(/\+/g, ' plus ').replace(/[−-](?=\s*\d|\s)/g, ' minus ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ')
    .replace(/=/g, ' equals ').replace(/→/g, ' ')
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, '')
    .replace(/\s+([.,!?])/g, '$1').replace(/\s+/g, ' ').trim();
}

/** Emoji picture of a small add/sub/mul fact, e.g. "🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎". */
export function pictureFact(op: Op, a: number, b: number, emoji = DOT): string | undefined {
  const r = calc(op, a, b);
  if (op === 'add' || op === 'sub') {
    if (Math.max(a, b, r) > SMALL) return undefined;
    return `${a} ${emoji} ${SYMBOL[op]} ${b} ${emoji} = ${r} ${emoji}\n${rep(emoji, a) || '0'} ${SYMBOL[op]} ${rep(emoji, b) || '0'} = ${rep(emoji, r) || '0'}`;
  }
  if (op === 'mul' && a > 0 && b > 0 && a * b <= 20) return `${Array.from({ length: a }, () => rep(emoji, b)).join('  ')} = ${r} ${emoji}`;
  if (op === 'div' && b > 0 && a > 0 && a <= 20) return `${Array.from({ length: b }, () => rep(emoji, r)).join('  ')}\n${a} ${emoji} in ${b} groups = ${r} each`;
  return undefined;
}

/** Short reason for a plain fact. */
export function factWhy(op: Op, a: number, b: number): string {
  const r = calc(op, a, b);
  switch (op) {
    case 'add': return b === 0 ? `Adding 0 keeps it the same: ${a} + 0 = ${r}.` : b <= 5 ? `Start at ${a} and count up ${b}: ${range(a + 1, r, 1).join(', ')}.` : `${a} + ${b} = ${r}.`;
    case 'sub': return b === 0 ? `Taking away 0 keeps it the same: ${a} − 0 = ${r}.` : b <= 5 ? `Start at ${a} and count back ${b}: ${range(a - 1, r, -1).join(', ')}.` : `${a} − ${b} = ${r}, because ${r} + ${b} = ${a}.`;
    case 'mul': return a === 0 || b === 0 ? `Anything times 0 is 0.` : a <= 5 ? `${a} groups of ${b}: ${Array(a).fill(b).join(' + ')} = ${r}.` : `${a} groups of ${b} make ${r}.`;
    case 'div': return `${a} ÷ ${b} = ${r}, because ${b} × ${r} = ${a}.`;
  }
}

const choiceLabel = (p: Problem) => (p.choices ? p.choices[p.answer] : String(p.answer));
const fill = (text: string, answer: string) => text.replace(/__|_/, answer);

function algebraWhy(p: Problem): Pick<Explanation, 'visual' | 'text'> {
  const ans = choiceLabel(p);
  switch (p.kind) {
    case 'pattern':
      if (p.choices) {
        const seq = (p.visual ?? '').replace('❓', '').trim().split(/\s+/);
        return { visual: `${seq.join(' ')} ${ans}`, text: 'The pattern repeats, so this one comes next.' };
      }
      return { text: `It goes ${p.op === 'sub' ? 'down' : 'up'} by ${p.b} each time: ${p.a} ${SYMBOL[p.op]} ${p.b} = ${p.answer}.` };
    case 'sort': {
      const group = Object.entries(SORT_GROUPS).find(([, xs]) => xs.includes(ans))?.[0];
      const same = (p.choices ?? []).filter(c => c !== ans);
      return { visual: `${same.join(' ')}  ≠  ${ans}`, text: group ? `This one is not like the others. It is in the ${group} group.` : `This one is not like the others.` };
    }
    case 'true-false': {
      const m = /^Is (.+) = (.+)\?$/.exec(p.text ?? '');
      const evalSide = (s: string) => { const t = /^(\d+) (.) (\d+)$/.exec(s.trim()); if (!t) return Number(s); const op = (Object.keys(SYMBOL) as Op[]).find(k => SYMBOL[k] === t[2])!; return calc(op, +t[1], +t[3]); };
      if (!m) return { text: `The answer is ${ans}.` };
      const l = evalSide(m[1]); const r = evalSide(m[2]);
      return { visual: Math.max(l, r) <= SMALL ? `${rep(DOT, l) || '0'}  ${l === r ? '=' : '≠'}  ${rep(DOT, r) || '0'}` : undefined, text: `${m[1]} = ${l}. ${m[2]} = ${r}. ${l === r ? 'Both sides match, so it is True.' : `${l} is not ${r}, so it is False.`}` };
    }
    case 'make-ten':
      if (p.visual) return { visual: `${rep('🔴', p.a)}${rep('🟢', p.answer)}`, text: `${p.a} and ${p.answer} more fill all 10 spots.` };
      return { text: `${fill(p.text ?? '', String(p.answer))} ✅` };
    case 'fact-family':
      return { visual: pictureFact(p.op, p.a, p.b), text: `Same numbers, same family: ${fill(p.text ?? '', String(p.answer))}` };
    default:
      return { visual: pictureFact(p.op, p.a, p.b), text: `${fill(p.text ?? '', String(p.answer))} ✅` };
  }
}

/** Build the explanation for any problem format. `young` = Pre-K/K: always add a picture. */
export function explain(p: Problem, young = false): Explanation {
  const answer = choiceLabel(p);
  let visual: string | undefined; let text: string;
  if (p.format === 'algebra') ({ visual, text } = algebraWhy(p));
  else if (p.key?.startsWith('count:')) {
    visual = `${rep(p.emoji ?? DOT, p.answer)} = ${p.answer}`;
    text = `Count each one: ${range(1, p.answer, 1).join(', ')}.`;
  } else {
    const result = calc(p.op, p.a, p.b);
    visual = pictureFact(p.op, p.a, p.b, p.emoji ?? DOT);
    if (p.format === 'missing') text = `The missing number is ${p.answer}, because ${p.a} ${SYMBOL[p.op]} ${p.b} = ${result}.`;
    else if (p.format === 'word') text = `The story is ${p.a} ${SYMBOL[p.op]} ${p.b}. ${factWhy(p.op, p.a, p.b)}`;
    else text = factWhy(p.op, p.a, p.b);
  }
  if (young && !visual) visual = rep(DOT, Math.min(Number(answer) || 0, 20)) || undefined;
  const lead = toSpeech(answer) ? `The answer is ${toSpeech(answer)}.` : 'Look at the green one.';
  return { answer, visual, text, say: `${lead} ${toSpeech(text)}` };
}
