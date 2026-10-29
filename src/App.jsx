import { useEffect, useRef, useState } from "react";
import { grades } from "./words.js";
import { speakWord, stopSpeaking } from "./speech.js";

const SWIPE_PX = 48;

export default function App() {
  const [gradeId, setGradeId] = useState(null);
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const drag = useRef(null);
  const speakWatch = useRef(0);

  const grade = grades.find((item) => item.id === gradeId) ?? null;
  const word = grade?.words[index] ?? "";

  useEffect(() => {
    stopSpeaking();
    setSpeaking(false);
    window.clearTimeout(speakWatch.current);
    return () => window.clearTimeout(speakWatch.current);
  }, [gradeId, index]);

  useEffect(() => {
    if (!grade) return undefined;

    const onKey = (event) => {
      if (event.repeat) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grade, index]);

  function pickGrade(id) {
    setGradeId(id);
    setIndex(0);
  }

  function go(step) {
    if (!grade) return;
    setIndex((current) => {
      const next = current + step;
      if (next < 0 || next >= grade.words.length) return current;
      return next;
    });
  }

  function readAloud() {
    if (!word) return;
    window.clearTimeout(speakWatch.current);
    const started = speakWord(word, () => {
      window.clearTimeout(speakWatch.current);
      setSpeaking(false);
    });
    if (!started) return;
    setSpeaking(true);
    speakWatch.current = window.setTimeout(() => setSpeaking(false), 5000);
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return;
    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerUp(event) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  }

  function onPointerCancel() {
    drag.current = null;
  }

  if (!grade) {
    return (
      <main className="app">
        <h1>Sight Words</h1>
        <p className="sub">Pick a grade</p>
        <div className="grid">
          {grades.map((item) => (
            <button
              key={item.id}
              type="button"
              className="big"
              onClick={() => pickGrade(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>
    );
  }

  const atStart = index === 0;
  const atEnd = index === grade.words.length - 1;

  return (
    <main
      className="app play"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="top">
        <button type="button" className="big alt grades" onClick={() => pickGrade(null)}>
          Grades
        </button>
        <div className="progress">
          <span>{grade.label}</span>
          <span>
            {index + 1} of {grade.words.length}
          </span>
        </div>
      </div>
      <div className="card" aria-live="polite">
        {word}
      </div>
      <button
        type="button"
        className={`big speak${speaking ? " speaking" : ""}`}
        onClick={readAloud}
      >
        Read it to me
      </button>
      <div className="nav">
        <button type="button" className="big" onClick={() => go(-1)} disabled={atStart}>
          Previous
        </button>
        <button type="button" className="big" onClick={() => go(1)} disabled={atEnd}>
          Next
        </button>
      </div>
    </main>
  );
}
