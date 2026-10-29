import { useState } from "react";
import { grades } from "./words.js";
import { allClassWords, lessons } from "./class-words.js";
import FlashCards from "./FlashCards.jsx";
import SentenceBuilder from "./SentenceBuilder.jsx";
import StoryTime from "./StoryTime.jsx";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("cards");
  const [deck, setDeck] = useState(null);

  function pickMode(next) {
    setMode(next);
    setDeck(null);
    setScreen("decks");
  }

  function openDeck(next) {
    setDeck(next);
    setScreen(mode);
  }

  function openGrade(grade) {
    openDeck({
      id: grade.id,
      label: grade.label,
      backTo: "decks",
      words: grade.words.map((text) => ({ text })),
    });
  }

  function openLesson(lesson) {
    openDeck({
      id: lesson.id,
      label: lesson.label,
      backTo: "class",
      words: lesson.words,
    });
  }

  function leaveDeck() {
    setScreen(deck?.backTo ?? "decks");
    setDeck(null);
  }

  if (screen === "stories") {
    return <StoryTime onBack={() => setScreen("home")} />;
  }

  if (screen === "cards" && deck) {
    return <FlashCards deck={deck} onBack={leaveDeck} />;
  }

  if (screen === "sentence" && deck) {
    return <SentenceBuilder deck={deck} onBack={leaveDeck} />;
  }

  if (screen === "class") {
    return (
      <main className="app">
        <div className="top">
          <button type="button" className="big alt grades" onClick={() => setScreen("decks")}>
            Back
          </button>
        </div>
        <h1>Class Words</h1>
        <div className="grid">
          {lessons.map((lesson) => (
            <button key={lesson.id} type="button" className="big" onClick={() => openLesson(lesson)}>
              {lesson.label}
            </button>
          ))}
          <button
            type="button"
            className="big wide"
            onClick={() =>
              openDeck({
                id: "class-all",
                label: "All together",
                backTo: "class",
                words: allClassWords(),
              })
            }
          >
            All together
          </button>
        </div>
      </main>
    );
  }

  if (screen === "decks") {
    return (
      <main className="app">
        <div className="top">
          <button type="button" className="big alt grades" onClick={() => setScreen("home")}>
            Back
          </button>
        </div>
        <h1>{mode === "sentence" ? "Build a Sentence" : "Flash Cards"}</h1>
        <div className="grid">
          {grades.map((grade) => (
            <button key={grade.id} type="button" className="big" onClick={() => openGrade(grade)}>
              {grade.label}
            </button>
          ))}
          <button type="button" className="big alt wide" onClick={() => setScreen("class")}>
            Class Words
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>Sight Words</h1>
      <div className="stack">
        <button type="button" className="big" onClick={() => pickMode("cards")}>
          Flash Cards
        </button>
        <button type="button" className="big" onClick={() => pickMode("sentence")}>
          Build a Sentence
        </button>
        <button type="button" className="big" onClick={() => setScreen("stories")}>
          Story Time
        </button>
      </div>
    </main>
  );
}
