import { useEffect, useRef, useState } from 'react';
import { hub } from '../../../shared/index.js';
import { Mode, Problem, Result, summarize, answerText } from './logic';
import { speakWord, stopSpeaking } from '../../reading/src/speech.js';
import { levelForGrade, loadRecent, makeVariedRound, modesForLevel, newSeed, saveRecent, seededRng } from './variety';

const storage = typeof localStorage !== 'undefined' ? localStorage : undefined;

const MODES: { id: Mode; label: string }[] = [
  { id: 'add', label: '➕ Addition' }, { id: 'sub', label: '➖ Subtraction' },
  { id: 'mul', label: '✖️ Multiplication' }, { id: 'div', label: '➗ Division' }, { id: 'mixed', label: '🎲 Mixed' },
];
const GRADE_NAME: Record<string, string> = { PreK: 'Pre-K', K: 'Kindergarten' };

export default function App() {
  const [screen, setScreen] = useState<'start' | 'play' | 'done'>('start');
  const [mode, setMode] = useState<Mode>('add');
  const [round, setRound] = useState<Problem[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [feedback, setFeedback] = useState<Result | null>(null);
  const shownAt = useRef(0);

  const player = hub().getCurrentChild();
  const level = levelForGrade(player?.grade);
  const modes = MODES.filter(m => modesForLevel(level).includes(m.id));
  const start = (m: Mode) => {
    // Fresh seed every session, skip this kid's recent problems, mixed formats, shuffled order.
    const r = makeVariedRound(m, { level, rng: seededRng(newSeed()), recent: loadRecent(storage, player?.id) });
    saveRecent(storage, player?.id, r);
    setMode(m); setRound(r); setIdx(0); setResults([]); setFeedback(null); setScreen('play'); };
  useEffect(() => { if (screen === 'play' && !feedback) shownAt.current = performance.now(); }, [screen, idx, feedback]);
  useEffect(() => {
    if (screen !== 'done') return;
    const child = hub().getCurrentChild();
    if (!child) return;
    const s = summarize(results);
    const math: { lastMode: string; lastPct: number; lastAvgSec: number; updatedAt: string; level?: string } = {
      lastMode: mode, lastPct: s.pct, lastAvgSec: s.avgSec, updatedAt: new Date().toISOString(),
    };
    if (s.pct >= 80) math.level = mode;
    hub().recordProgress(child.id, { math });
  }, [screen, mode, results]);

  const choose = (v: number) => {
    if (feedback) return;
    stopSpeaking();
    const p = round[idx];
    const r: Result = { problem: p, chosen: v, correct: v === p.answer, ms: Math.round(performance.now() - shownAt.current) };
    setResults(rs => [...rs, r]); setFeedback(r);
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= round.length) setScreen('done'); else setIdx(i => i + 1);
    }, r.correct ? 700 : 1600);
  };

  if (screen === 'start') return (
    <main className="app">
      <h1>Math Fluency ⭐</h1>
      <p className="sub">{player ? `Hi, ${player.name}!` : 'Hi!'} Pick a kind of problem!</p>
      {player ? <p className="level">Level: {GRADE_NAME[player.grade] ?? `Grade ${player.grade}`}</p> : null}
      <div className="grid">{modes.map(m => <button key={m.id} className="big" onClick={() => start(m.id)}>{m.label}</button>)}</div>
    </main>
  );

  if (screen === 'play') {
    const p = round[idx];
    return (
      <main className="app">
        <div className="progress">Problem {idx + 1} of {round.length}</div>
        <div className={`card ${p.format ?? 'fact'} ${feedback ? (feedback.correct ? 'ok' : 'bad') : ''}`} data-format={p.format ?? 'fact'}>
          {p.visual ? <div className="visual" aria-label={p.visual}>{p.visual}</div> : null}
          <div className="prompt">{p.text ?? `${p.a} ? ${p.b}`}</div>
          {p.format === 'word' || p.speak ? (
            <button type="button" className="read-aloud" aria-label="Read aloud" title="Read aloud"
              onClick={() => speakWord(p.speak ?? p.text ?? '')}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
                <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span>Read to me</span>
            </button>
          ) : null}
        </div>
        <div className={`grid answers ${p.choices ? 'choices' : ''}`}>{p.options.map(o => (
          <button key={o} className={`big ans ${feedback && o === p.answer ? 'right' : ''} ${feedback && o === feedback.chosen && !feedback.correct ? 'wrong' : ''}`}
            onClick={() => choose(o)} disabled={!!feedback}>{p.choices ? p.choices[o] : o}</button>))}</div>
        <div className="feedback" aria-live="polite">
          {feedback && (feedback.correct ? '🎉 Great job!' : `Oops! The answer is ${p.choices ? p.choices[p.answer] : p.answer}${p.key?.startsWith('count:') || p.format === 'algebra' ? '' : ` (${answerText(p)})`}`)}
        </div>
      </main>
    );
  }

  const s = summarize(results);
  return (
    <main className="app">
      <h1>Round done! 🏁</h1>
      <div className="stats">
        <div><b>{s.correct}/{s.total}</b><span>correct ({s.pct}%)</span></div>
        <div><b>{s.avgSec.toFixed(1)}s</b><span>average time</span></div>
      </div>
      <h2>Slowest facts</h2>
      <ul className="slow">{s.slowest.map((r, i) => (
        <li key={i}>{answerText(r.problem)} — {(r.ms / 1000).toFixed(1)}s {r.correct ? '✅' : '❌'}</li>))}</ul>
      <div className="grid">
        <button className="big" onClick={() => start(mode)}>Play again</button>
        <button className="big alt" onClick={() => setScreen('start')}>Change operation</button>
      </div>
    </main>
  );
}
