import { useEffect, useRef, useState } from "react";
import { stories } from "./stories.js";
import StoryArt from "./StoryArt.jsx";
import { speakSequence, speakWord, stopSpeaking } from "./speech.js";

function mix(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function partsOf(sentence) {
  return sentence.split(" ").map((part) => ({
    show: part,
    say: part.replace(/[^A-Za-z']/g, ""),
  }));
}

function Speaker() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path d="M3 9h4l6-5v16l-6-5H3z" fill="currentColor" />
      <path d="M16 8a5 5 0 0 1 0 8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function StoryTime({ onBack }) {
  const [story, setStory] = useState(null);
  const [view, setView] = useState("list");
  const [active, setActive] = useState(-1);
  const [scene, setScene] = useState(0);
  const [question, setQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const wait = useRef(0);

  useEffect(() => () => {
    window.clearTimeout(wait.current);
    stopSpeaking();
  }, []);

  function open(next) {
    stopSpeaking();
    setStory(next);
    setView("read");
    setActive(-1);
    setScene(0);
    setQuestion(0);
    setFeedback("");
  }

  function backToList() {
    stopSpeaking();
    window.clearTimeout(wait.current);
    setStory(null);
    setView("list");
  }

  function readAll() {
    speakSequence(story.sentences, {
      onStart: (index) => {
        setActive(index);
        setScene(index);
      },
      onDone: () => setActive(-1),
    });
  }

  function hearWord(sentenceIndex, word) {
    setActive(-1);
    setScene(sentenceIndex);
    speakWord(word);
  }

  function startQuestions() {
    stopSpeaking();
    setActive(-1);
    setQuestion(0);
    setFeedback("");
    setChoices(mix(story.questions[0].choices));
    setView("ask");
  }

  function answer(choice) {
    if (!choice.ok) {
      setFeedback("Not quite.");
      return;
    }
    setFeedback("Yes!");
    window.clearTimeout(wait.current);
    wait.current = window.setTimeout(() => {
      const next = question + 1;
      if (next >= story.questions.length) {
        setView("done");
        return;
      }
      setQuestion(next);
      setChoices(mix(story.questions[next].choices));
      setFeedback("");
    }, 500);
  }

  if (view === "list" || !story) {
    return (
      <main className="app">
        <div className="top">
          <button type="button" className="big alt grades" onClick={onBack}>
            Back
          </button>
        </div>
        <h1>Story Time</h1>
        <div className="stack">
          {stories.map((item) => (
            <button key={item.id} type="button" className="big story-name" onClick={() => open(item)}>
              {item.title}
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (view === "done") {
    return (
      <main className="app">
        <div className="celebrate" aria-hidden="true">
          <svg className="star" viewBox="0 0 80 80">
            <polygon points="40,6 49,30 74,30 54,46 62,70 40,56 18,70 26,46 6,30 31,30" fill="#ffca28" />
          </svg>
        </div>
        <h1>You did it!</h1>
        <button type="button" className="big" onClick={backToList}>
          Stories
        </button>
      </main>
    );
  }

  if (view === "ask") {
    const current = story.questions[question];
    return (
      <main className="app">
        <div className="top">
          <button type="button" className="big alt grades" onClick={() => setView("read")}>
            Back
          </button>
          <div className="progress">
            {question + 1} of {story.questions.length}
          </div>
        </div>
        <p className="prompt">{current.prompt}</p>
        <button type="button" className="big speak" onClick={() => speakWord(current.prompt)}>
          Read it to me
        </button>
        <div className="stack">
          {choices.map((choice) => (
            <div className="choice" key={choice.text}>
              <button
                type="button"
                className="hear"
                aria-label={`Read ${choice.text}`}
                onClick={() => speakWord(choice.text)}
              >
                <Speaker />
              </button>
              <button type="button" className="big choice-main" onClick={() => answer(choice)}>
                {choice.text}
              </button>
            </div>
          ))}
        </div>
        {feedback && <p className={feedback === "Yes!" ? "note ok" : "note"}>{feedback}</p>}
      </main>
    );
  }

  return (
    <main className="app">
      <div className="top">
        <button type="button" className="big alt grades" onClick={backToList}>
          Back
        </button>
      </div>
      <h1>{story.title}</h1>
      <StoryArt storyId={story.id} scene={scene} />
      {story.sentences.map((sentence, index) => (
        <div key={sentence} className={index === active ? "sentence now" : "sentence"}>
          {partsOf(sentence).map((part) => (
            <button
              key={`${sentence}-${part.show}`}
              type="button"
              className="word-tap"
              onClick={() => hearWord(index, part.say)}
            >
              {part.show}
            </button>
          ))}
        </div>
      ))}
      <button type="button" className="big speak" onClick={readAll}>
        Read it to me
      </button>
      <button type="button" className="big" onClick={startQuestions}>
        Questions
      </button>
    </main>
  );
}
