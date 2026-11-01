import { useEffect, useRef, useState } from 'react';
import { getLevel, hub } from '../../../shared/index.js';
import { Mode, Problem, Result, summarize, answerText } from './logic';
import { speakWord, stopSpeaking } from '../../reading/src/speech.js';
import { explain } from './explain';
import { levelFor, loadRecent, makeVariedRound, modesForLevel, newSeed, saveRecent, seededRng } from './variety';

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
  const lv = getLevel(player);
  const level = levelFor(lv.grade, lv.progress);
  const young = lv.grade === 'PreK' || lv.grade === 'K';
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
    // Right answers move on by themselves; wrong answers wait for the Next button.
    if (r.correct) setTimeout(next, 700);
    else speakWord(explain(p, young).say);
  };
  const next = () => {
    stopSpeaking();
    setFeedback(null);
    if (idx + 1 >= round.length) setScreen('done'); else setIdx(idx + 1);
  };

  if (screen === 'start') return (
    <main className="app">
      <h1>Math Fluency ⭐</h1>
      <p className="sub">{player ? `Hi, ${player.name}!` : 'Hi!'} Pick a kind of problem!</p>
      {player ? <p className="level">Level: {lv.grade ? GRADE_NAME[lv.grade] ?? `Grade ${lv.grade}` : ''}</p> : null}
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
              <SpeakerIcon />
              <span>Read to me</span>
            </button>
          ) : null}
        </div>
        <div className={`grid answers ${p.choices ? 'choices' : ''}`}>{p.options.map(o => (
          <button key={o} className={`big ans ${feedback && o === p.answer ? 'right' : ''} ${feedback && o === feedback.chosen && !feedback.correct ? 'wrong' : ''}`}
            onClick={() => choose(o)} disabled={!!feedback}>{p.choices ? p.choices[o] : o}</button>))}</div>
        {feedback && !feedback.correct ? (() => {
          const e = explain(p, young);
          return (
            <section className="explain" aria-live="polite" data-testid="explain">
              <div className="explain-answer"><span aria-hidden="true">✅</span> {e.answer}</div>
              {e.visual ? <div className="explain-visual" aria-label={e.visual}>{e.visual}</div> : null}
              <p className="explain-text">{e.text}</p>
              <div className="explain-actions">
                <button type="button" className="speaker" aria-label="Read to me" title="Read to me" onClick={() => speakWord(e.say)}>
                  <SpeakerIcon />
                </button>
                <button type="button" className="big next" aria-label="Next" onClick={next}>Next <span aria-hidden="true">➡️</span></button>
              </div>
            </section>
          );
        })() : <div className="feedback" aria-live="polite">{feedback?.correct ? '🎉 Great job!' : ''}</div>}
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

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
