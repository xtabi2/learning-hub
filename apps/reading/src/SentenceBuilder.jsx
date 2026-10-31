import { useEffect, useRef, useState } from "react";
import { hub } from "../../../shared/index.js";
import { formatSentence, gradeSentence } from "./grade-sentence.js";
import { dealOrder, mixHand, setKey } from "./sentence-sets.js";
import { speakWord, stopSpeaking } from "./speech.js";
import { ButtonFace, Icon } from "./icons.jsx";
import { loadRecent, rememberRecent, sentenceBucket } from "./variety.js";

const storage = typeof localStorage !== "undefined" ? localStorage : undefined;

function playerId() {
  try {
    return hub().getCurrentChild()?.id ?? null;
  } catch {
    return null;
  }
}

export default function SentenceBuilder({ deck, onBack }) {
  const who = useRef(playerId());
  const scope = sentenceBucket(deck.id);
  const [queue] = useState(() => dealOrder(
    deck.words.map((word) => word.text),
    loadRecent(storage, who.current, scope),
  ));
  const [cursor, setCursor] = useState(0);
  const [bank, setBank] = useState(() => (queue[0] ? mixHand(queue[0].words) : []));
  const [built, setBuilt] = useState([]);
  const [note, setNote] = useState(null);
  const current = queue[cursor] ?? null;

  function showSet(index) {
    const next = queue[index];
    if (!next) return;
    setCursor(index);
    setBank(mixHand(next.words));
    setBuilt([]);
    setNote(null);
    stopSpeaking();
    rememberRecent(storage, who.current, scope, setKey(next));
  }

  useEffect(() => {
    if (queue[0]) rememberRecent(storage, who.current, scope, setKey(queue[0]));
    return () => stopSpeaking();
  }, [deck.id, queue, scope]);

  if (!current) {
    return (
      <main className="app">
        <h1>{deck.label}</h1>
        <p className="sub">Try another deck</p>
        <button type="button" className="big alt" onClick={onBack}>
          <ButtonFace icon="back">Back</ButtonFace>
        </button>
      </main>
    );
  }

  function addWord(word) {
    setBank((items) => items.filter((item) => item !== word));
    setBuilt((items) => [...items, word]);
    setNote(null);
  }

  function removeWord(word, index) {
    setBuilt((items) => items.filter((_, itemIndex) => itemIndex !== index));
    setBank((items) => [...items, word]);
    setNote(null);
  }

  function moveWord(from, to) {
    if (from === to) return;
    setBuilt((items) => {
      const next = [...items];
      const [word] = next.splice(from, 1);
      next.splice(to, 0, word);
      return next;
    });
    setNote(null);
  }

  function onChipDown(event, index) {
    if (event.button !== undefined && event.button !== 0) return;
    const origin = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;
    const word = built[index];
    let moved = false;
    let target = index;
    origin.setPointerCapture?.(event.pointerId);

    const move = (pointer) => {
      if (Math.abs(pointer.clientX - startX) + Math.abs(pointer.clientY - startY) > 12) moved = true;
      const chips = document.querySelectorAll("[data-built]");
      let best = target;
      let bestDist = Infinity;
      chips.forEach((chip) => {
        const rect = chip.getBoundingClientRect();
        const dist = Math.abs(pointer.clientX - (rect.left + rect.width / 2))
          + Math.abs(pointer.clientY - (rect.top + rect.height / 2));
        if (dist < bestDist) {
          bestDist = dist;
          best = Number(chip.dataset.built);
        }
      });
      if (!Number.isNaN(best)) target = best;
    };
    const up = () => {
      origin.removeEventListener("pointermove", move);
      origin.removeEventListener("pointerup", up);
      if (!moved) removeWord(word, index);
      else if (target !== index) moveWord(index, target);
    };
    origin.addEventListener("pointermove", move);
    origin.addEventListener("pointerup", up);
  }

  function clearAll() {
    setBank(mixHand(current.words));
    setBuilt([]);
    setNote(null);
    stopSpeaking();
  }

  function nextSet() {
    showSet((cursor + 1) % queue.length);
  }

  function check() {
    const result = gradeSentence(built);
    setNote(result);
    if (!result.ok) return;
    const child = hub().getCurrentChild();
    if (!child) return;
    hub().recordProgress(child.id, {
      reading: { masteredWords: built, updatedAt: new Date().toISOString() },
    });
  }

  function readAloud() {
    if (!built.length) return;
    speakWord(formatSentence(built));
  }

  return (
    <main className="app play">
      <div className="top">
        <button type="button" className="big alt grades" onClick={onBack}>
          <ButtonFace icon="back">Back</ButtonFace>
        </button>
        <div className="progress">
          <span>{deck.label}</span>
        </div>
      </div>
      <div className="chips" aria-label="Words">
        {bank.map((word) => (
          <button key={word} type="button" className="chip" onClick={() => addWord(word)}>
            <Icon name="add" />
            <span>{word}</span>
          </button>
        ))}
      </div>
      <p className="line" aria-live="polite">
        {formatSentence(built)}
      </p>
      <div className="well">
        {built.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            className="chip"
            data-built={index}
            onPointerDown={(event) => onChipDown(event, index)}
          >
            {word}
          </button>
        ))}
      </div>
      {note && <p className={note.ok ? "note ok" : "note"}>{note.message}</p>}
      <button type="button" className="big speak" onClick={readAloud} disabled={!built.length}>
        <ButtonFace icon="speaker">Read it to me</ButtonFace>
      </button>
      <div className="nav">
        <button type="button" className="big" onClick={check} disabled={!built.length}>
          <ButtonFace icon="check">Check</ButtonFace>
        </button>
        <button type="button" className="big alt" onClick={clearAll}>
          <ButtonFace icon="clear">Clear</ButtonFace>
        </button>
      </div>
      <button type="button" className="big" onClick={nextSet}>
        <ButtonFace icon="shuffle">New words</ButtonFace>
      </button>
    </main>
  );
}
