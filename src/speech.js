export function speakWord(word, onDone) {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return false;

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.85;

  try {
    const voices = synth.getVoices();
    const voice =
      voices.find((item) => item.lang?.toLowerCase() === "en-us") ||
      voices.find((item) => item.lang?.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
  } catch {
    // An empty or unusual voice list should still leave the word speakable.
  }

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onDone?.();
  };
  utterance.onend = finish;
  utterance.onerror = finish;

  // Speak in this turn so mobile browsers treat it as a tap.
  synth.cancel();
  synth.resume();
  synth.speak(utterance);
  return true;
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
