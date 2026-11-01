import { useEffect, useRef, useState } from "react";
import { getLevel, hub } from "../../../shared/index.js";
import { stories, storyLevelFor } from "./stories.js";
import { pickStories, recentStories, rememberStory } from "./story-rotation.js";
import StoryArt from "./StoryArt.jsx";
import { speakSequence, speakWord, stopSpeaking } from "./speech.js";
import { ButtonFace, Icon } from "./icons.jsx";
import Say, { isPreReader } from "./Say.jsx";
import { storyHelp } from "./explain.js";
import HelpCard from "./HelpCard.jsx";

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

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function currentKid() {
  try {
    return hub().getCurrentChild();
  } catch {
    return null;
  }
}

export default function StoryTime({ onBack }) {
  const [kid] = useState(currentKid);
  const level = storyLevelFor(getLevel(kid));
  const [picks, setPicks] = useState(() => pickStories(stories, recentStories(storage(), kid?.id)));
  const [story, setStory] = useState(null);
  const [view, setView] = useState("list");
  const [active, setActive] = useState(-1);
  const [scene, setScene] = useState(0);
  const [question, setQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [help, setHelp] = useState(null);
  const wait = useRef(0);

  useEffect(() => {
    if (view !== "ask" || !story || !isPreReader(kid)) return undefined;
    const t = window.setTimeout(() => speakWord(story.questions[question].prompt), 300);
    return () => window.clearTimeout(t);
  }, [view, question, story]);

  useEffect(() => () => {
    window.clearTimeout(wait.current);
    stopSpeaking();
  }, []);

  function morePicks() {
    const shown = picks.map((item) => item.id);
    setPicks(pickStories(stories, [...recentStories(storage(), kid?.id), ...shown]));
  }

  function open(next) {
    stopSpeaking();
    rememberStory(storage(), kid?.id, next.id);
    setStory({ ...next, ...next.levels[level] });
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
    setPicks(pickStories(stories, recentStories(storage(), kid?.id)));
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

  function goNext() {
    stopSpeaking();
    setHelp(null);
    setFeedback("");
    const next = question + 1;
    if (next >= story.questions.length) {
      setView("done");
      return;
    }
    setQuestion(next);
    setChoices(mix(story.questions[next].choices));
  }

  function answer(choice) {
    if (help || feedback) return;
    if (!choice.ok) {
      // Show the right answer and the story sentence; wait for Next.
      const found = storyHelp(story.sentences, story.questions[question]);
      setHelp(found);
      speakWord(found.say);
      return;
    }
    setFeedback("Yes!");
    speakWord("Yes!");
    window.clearTimeout(wait.current);
    wait.current = window.setTimeout(goNext, 500);
  }

  if (view === "list" || !story) {
    return (
      <main className="app">
        <div className="top">
          <button type="button" className="big alt grades" onClick={onBack}>
            <ButtonFace icon="home">Back</ButtonFace>
          </button>
        </div>
        <h1 className="said">
          Story Time
          <Say text="Pick a story." />
        </h1>
        <div className="stack">
          {picks.map((item) => (
            <button key={item.id} type="button" className="big story-name" onClick={() => open(item)}>
              <ButtonFace icon={item.id} emoji={item.emoji}>
                {item.title}
              </ButtonFace>
            </button>
          ))}
          <button type="button" className="big alt" onClick={morePicks}>
            <ButtonFace icon="shuffle">More stories</ButtonFace>
          </button>
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
        <h1 className="said">
          You did it!
          <Say text="You did it!" />
        </h1>
        <button type="button" className="big" onClick={backToList}>
          <ButtonFace icon="book">Stories</ButtonFace>
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
            <ButtonFace icon="back">Back</ButtonFace>
          </button>
          <div className="progress">
            {question + 1} of {story.questions.length}
          </div>
        </div>
        <p className="prompt">{current.prompt}</p>
        <button type="button" className="big speak" onClick={() => speakWord(current.prompt)}>
          <ButtonFace icon="speaker">Read it to me</ButtonFace>
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
                <Icon name="speaker" />
              </button>
              <button
                type="button"
                className={`big choice-main${help && choice.ok ? " right" : ""}${help && !choice.ok ? " dim" : ""}`}
                onClick={() => answer(choice)}
                disabled={Boolean(help)}
              >
                <ButtonFace icon="choose">{choice.text}</ButtonFace>
              </button>
            </div>
          ))}
        </div>
        {help ? (
          <HelpCard answer={help.right} say={help.say} onNext={goNext}>
            {help.because ? (
              <p className="help-quote">
                <span aria-hidden="true">📖 </span>
                “{help.because}”
              </p>
            ) : null}
          </HelpCard>
        ) : feedback ? (
          <p className="note ok">
            <span aria-hidden="true">🎉 </span>
            {feedback}
          </p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="app">
      <div className="top">
        <button type="button" className="big alt grades" onClick={backToList}>
          <ButtonFace icon="back">Back</ButtonFace>
        </button>
      </div>
      <h1>{story.title}</h1>
      <StoryArt storyId={story.id} scene={scene} cast={story.cast} />
      {story.sentences.map((sentence, index) => (
        <div key={`${index}-${sentence}`} className={index === active ? "sentence now" : "sentence"}>
          {partsOf(sentence).map((part, partIndex) => (
            <button
              key={`${partIndex}-${part.show}`}
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
        <ButtonFace icon="speaker">Read it to me</ButtonFace>
      </button>
      <button type="button" className="big" onClick={startQuestions}>
        <ButtonFace icon="questions">Questions</ButtonFace>
      </button>
    </main>
  );
}
