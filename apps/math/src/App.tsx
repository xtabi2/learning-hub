import { useEffect, useRef, useState } from 'react';
import { hub } from '../../../shared/index.js';
import { Mode, Problem, Result, makeRound, summarize, factText } from './logic';

const MODES: { id: Mode; label: string }[] = [
  { id: 'add', label: '➕ Addition' }, { id: 'sub', label: '➖ Subtraction' },
  { id: 'mul', label: '✖️ Multiplication' }, { id: 'div', label: '➗ Division' }, { id: 'mixed', label: '🎲 Mixed' },
];

export default function App() {
  const [screen, setScreen] = useState<'start' | 'play' | 'done'>('start');
  const [mode, setMode] = useState<Mode>('add');
  const [round, setRound] = useState<Problem[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [feedback, setFeedback] = useState<Result | null>(null);
  const shownAt = useRef(0);

  const player = hub().getCurrentChild();
  const start = (m: Mode) => { setMode(m); setRound(makeRound(m)); setIdx(0); setResults([]); setFeedback(null); setScreen('play'); };
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
      <div className="grid">{MODES.map(m => <button key={m.id} className="big" onClick={() => start(m.id)}>{m.label}</button>)}</div>
    </main>
  );

  if (screen === 'play') {
    const p = round[idx];
    return (
      <main className="app">
        <div className="progress">Problem {idx + 1} of {round.length}</div>
        <div className={`card ${feedback ? (feedback.correct ? 'ok' : 'bad') : ''}`}>{factText(p)} = ?</div>
        <div className="grid answers">{p.options.map(o => (
          <button key={o} className={`big ans ${feedback && o === p.answer ? 'right' : ''} ${feedback && o === feedback.chosen && !feedback.correct ? 'wrong' : ''}`}
            onClick={() => choose(o)} disabled={!!feedback}>{o}</button>))}</div>
        <div className="feedback" aria-live="polite">
          {feedback && (feedback.correct ? '🎉 Great job!' : `Oops! ${factText(p)} = ${p.answer}`)}
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
        <li key={i}>{factText(r.problem)} = {r.problem.answer} — {(r.ms / 1000).toFixed(1)}s {r.correct ? '✅' : '❌'}</li>))}</ul>
      <div className="grid">
        <button className="big" onClick={() => start(mode)}>Play again</button>
        <button className="big alt" onClick={() => setScreen('start')}>Change operation</button>
      </div>
    </main>
  );
}
