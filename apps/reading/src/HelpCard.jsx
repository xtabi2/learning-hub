import { speakWord } from "./speech.js";
import { Icon } from "./icons.jsx";

/**
 * Shown after a wrong answer: the right answer, why (children), a speaker that
 * reads it all, and a big Next button. Nothing moves on until Next is tapped.
 */
export default function HelpCard({ answer, say, onNext, children }) {
  return (
    <section className="help" aria-live="polite" data-testid="explain">
      <p className="help-answer">
        <span aria-hidden="true">✅ </span>
        {answer}
      </p>
      {children}
      <div className="help-actions">
        <button type="button" className="help-speaker" aria-label="Read to me" title="Read to me" onClick={() => speakWord(say)}>
          <Icon name="speaker" />
        </button>
        <button type="button" className="big help-next" aria-label="Next" onClick={onNext}>
          <span className="btn-text">Next</span> <span aria-hidden="true">➡️</span>
        </button>
      </div>
    </section>
  );
}
