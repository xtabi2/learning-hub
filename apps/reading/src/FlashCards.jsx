import { useEffect, useRef, useState } from "react";
import { hub } from "../../../shared/index.js";
import { speakWord, stopSpeaking } from "./speech.js";
import { ButtonFace, Icon } from "./icons.jsx";
import { cardBucket, loadRecent, planCards, rememberRecent } from "./variety.js";

const SWIPE_PX = 48;
const storage = typeof localStorage !== "undefined" ? localStorage : undefined;

function playerId() {
  try {
    return hub().getCurrentChild()?.id ?? null;
  } catch {
    return null;
  }
}

function CardWord({ word }) {
  const { text, underline } = word;
  if (!underline) return text;
  const [start, end] = underline;
  return (
    <>
      {text.slice(0, start)}
      <span className="tricky">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  );
}

export default function FlashCards({ deck, onBack }) {
  const who = useRef(playerId());
  const [cards] = useState(() => planCards(deck.words, loadRecent(storage, who.current, cardBucket(deck.id))));
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [found, setFound] = useState(false);
  const [wrongKey, setWrongKey] = useState("");
  const [streak, setStreak] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const drag = useRef(null);
  const speakWatch = useRef(0);
  const cheer = useRef(0);
  const shakeTimer = useRef(0);
  const practiced = useRef(new Set());
  const card = cards[index];

  function markPracticed(cardIndex) {
    if (practiced.current.has(cardIndex)) return;
    const seen = cards[cardIndex];
    if (!seen) return;
    practiced.current.add(cardIndex);
    rememberRecent(storage, who.current, cardBucket(deck.id), seen.word.text);
    const child = hub().getCurrentChild();
    if (child && seen.word?.text) {
      hub().recordProgress(child.id, { reading: { practicedWords: [seen.word.text] } });
    }
    setStreak((current) => {
      const next = current + 1;
      if (next === 3 || next % 5 === 0) {
        setCelebrate(true);
        window.clearTimeout(cheer.current);
        cheer.current = window.setTimeout(() => setCelebrate(false), 1300);
      }
      return next;
    });
  }

  useEffect(() => {
    if (cards[index]?.twist === "show") markPracticed(index);
  }, [index, cards]);

  useEffect(() => {
    stopSpeaking();
    setSpeaking(false);
    window.clearTimeout(speakWatch.current);
    return () => {
      window.clearTimeout(speakWatch.current);
      window.clearTimeout(cheer.current);
      window.clearTimeout(shakeTimer.current);
      stopSpeaking();
    };
  }, [deck.id, index]);

  useEffect(() => {
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
  }, [cards.length, index]);

  function go(step) {
    const next = index + step;
    if (next < 0 || next >= cards.length) return;
    setFlipped(false);
    setFound(false);
    setWrongKey("");
    setCelebrate(false);
    setIndex(next);
  }

  function readAloud() {
    if (!card) return;
    window.clearTimeout(speakWatch.current);
    const started = speakWord(card.word.text, () => {
      window.clearTimeout(speakWatch.current);
      setSpeaking(false);
    });
    if (!started) return;
    setSpeaking(true);
    speakWatch.current = window.setTimeout(() => setSpeaking(false), 5000);
  }

  function reveal() {
    if (!card || flipped) return;
    setFlipped(true);
    markPracticed(index);
    readAloud();
  }

  function pickChoice(choice) {
    if (!card) return;
    if (choice.text.toLowerCase() === card.word.text.toLowerCase()) {
      setFound(true);
      setWrongKey("");
      markPracticed(index);
      return;
    }
    setWrongKey(choice.text.toLowerCase());
    setStreak(0);
    window.clearTimeout(shakeTimer.current);
    shakeTimer.current = window.setTimeout(() => setWrongKey(""), 420);
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

  if (!card) {
    return (
      <main className="app">
        <button type="button" className="big alt" onClick={onBack}>
          <ButtonFace icon="back">Back</ButtonFace>
        </button>
      </main>
    );
  }

  const atStart = index === 0;
  const atEnd = index === cards.length - 1;
  const finding = card.twist === "find" && !found;
  const faceDown = card.twist === "flip" && !flipped;
  const speakButton = (
    <button type="button" className={`big speak${speaking ? " speaking" : ""}`} onClick={readAloud}>
      <ButtonFace icon="speaker">Read it to me</ButtonFace>
    </button>
  );

  return (
    <main
      className="app play"
      data-twist={finding ? "find" : faceDown ? "flip" : "show"}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      <div className="top">
        <button type="button" className="big alt grades" onClick={onBack}>
          <ButtonFace icon="back">Back</ButtonFace>
        </button>
        <div className="progress">
          <span>{deck.label}</span>
          <span>
            {index + 1} of {cards.length}
          </span>
          {streak > 0 ? (
            <span className="streak" aria-label={`${streak} in a row`}>
              {Array.from({ length: Math.min(streak, 5) }, (_, star) => (
                <Icon key={star} name="star" />
              ))}
            </span>
          ) : null}
        </div>
      </div>
      {finding ? (
        <>
          {speakButton}
          <div className="find">
            {card.choices.map((choice) => (
              <button
                key={choice.text}
                type="button"
                className={wrongKey === choice.text.toLowerCase() ? "big find-choice nope" : "big find-choice"}
                onClick={() => pickChoice(choice)}
              >
                <ButtonFace icon="choose">
                  <CardWord word={choice} />
                </ButtonFace>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className={`card theme-${card.theme}${faceDown ? " is-back" : ""}`}
            aria-live="polite"
            aria-label={faceDown ? "Say it, then flip" : undefined}
          >
            {faceDown ? (
              <Icon name="mouth" className="icon icon-hero" />
            ) : (
              <span key={`${index}-${card.twist}`} className={`word motion-${card.motion}`}>
                <CardWord word={card.word} />
              </span>
            )}
            {celebrate && !faceDown ? (
              <div className="burst" aria-hidden="true">
                <Icon name="star" />
                <Icon name="star" />
                <Icon name="star" />
              </div>
            ) : null}
          </div>
          {speakButton}
          {faceDown ? (
            <button type="button" className="big" onClick={reveal}>
              <ButtonFace icon="flip">Flip</ButtonFace>
            </button>
          ) : null}
        </>
      )}
      <div className="nav">
        <button type="button" className="big" onClick={() => go(-1)} disabled={atStart}>
          <ButtonFace icon="back">Previous</ButtonFace>
        </button>
        <button type="button" className="big" onClick={() => go(1)} disabled={atEnd}>
          <ButtonFace icon="next">Next</ButtonFace>
        </button>
      </div>
    </main>
  );
}
