let request = 0;

function prepare(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  try {
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((item) => item.lang?.toLowerCase() === "en-us") ||
      voices.find((item) => item.lang?.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
  } catch {
    // An empty or unusual voice list should still leave the words speakable.
  }
  return utterance;
}

export function speakWord(word, onDone) {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return false;
  const mine = ++request;
  synth.cancel();
  const utterance = prepare(word);
  let finished = false;
  const finish = () => {
    if (finished || mine !== request) return;
    finished = true;
    onDone?.();
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  synth.resume();
  synth.speak(utterance);
  return true;
}

export function speakSequence(parts, hooks = {}) {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return false;
  const mine = ++request;
  synth.cancel();
  let index = 0;

  const step = () => {
    if (mine !== request) return;
    if (index >= parts.length) {
      hooks.onDone?.();
      return;
    }
    hooks.onStart?.(index);
    const utterance = prepare(parts[index]);
    const advance = () => {
      if (mine !== request) return;
      index += 1;
      step();
    };
    utterance.onend = advance;
    utterance.onerror = advance;
    synth.resume();
    synth.speak(utterance);
  };

  step();
  return true;
}

export function stopSpeaking() {
  request += 1;
  window.speechSynthesis?.cancel();
}
