// Fresh order every session. Fisher-Yates uses Math.random directly.
// There is no seed and no saved shuffle to replay.

export const HISTORY_SIZE = 40;
export const CARD_THEMES = ["sun", "sky", "leaf", "berry", "coral", "aqua"];
export const CARD_MOTIONS = ["pop", "rise", "wiggle"];

export const historyKey = (childId) => `learning-hub.reading-recent.v1:${childId ?? "guest"}`;
export const cardBucket = (deckId) => `cards:${deckId}`;
export const sentenceBucket = (deckId) => `sentences:${deckId}`;

export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function orderByFreshness(items, recentIds = [], idOf = (item) => item, random = Math.random) {
  const recent = new Set(recentIds.map((id) => String(id).toLowerCase()));
  const fresh = [];
  const stale = [];
  for (const item of items) {
    (recent.has(String(idOf(item)).toLowerCase()) ? stale : fresh).push(item);
  }
  return [...shuffle(fresh, random), ...shuffle(stale, random)];
}

function readHistory(store, childId) {
  try {
    const raw = store?.getItem(historyKey(childId));
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data && typeof data === "object" && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

export function loadRecent(store, childId, bucket) {
  const list = readHistory(store, childId)[bucket];
  return Array.isArray(list) ? list.map(String).slice(-HISTORY_SIZE) : [];
}

export function rememberRecent(store, childId, bucket, id) {
  const key = String(id).toLowerCase();
  const data = readHistory(store, childId);
  const prev = Array.isArray(data[bucket]) ? data[bucket].map(String) : [];
  const next = [...prev.filter((item) => item.toLowerCase() !== key), key].slice(-HISTORY_SIZE);
  data[bucket] = next;
  try {
    store?.setItem(historyKey(childId), JSON.stringify(data));
  } catch {
    // Private mode or a full disk: this session still plays, the next one just won't remember.
  }
  return next;
}

export function pickTwist(roll, uniqueCount) {
  if (uniqueCount >= 3 && roll < 0.18) return "find";
  if (roll < 0.34) return "flip";
  return "show";
}

export function findChoices(target, words, random = Math.random) {
  const others = shuffle(
    words.filter((word) => word.text.toLowerCase() !== target.text.toLowerCase()),
    random,
  );
  const picked = [];
  const seen = new Set([target.text.toLowerCase()]);
  for (const word of others) {
    const key = word.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(word);
    if (picked.length === 2) break;
  }
  return shuffle([target, ...picked], random);
}

export function planCards(words, recentTexts = [], random = Math.random) {
  const uniqueCount = new Set(words.map((word) => word.text.toLowerCase())).size;
  const ordered = orderByFreshness(words, recentTexts, (word) => word.text, random);
  return ordered.map((word) => {
    const theme = CARD_THEMES[Math.floor(random() * CARD_THEMES.length)];
    const motion = CARD_MOTIONS[Math.floor(random() * CARD_MOTIONS.length)];
    const twist = pickTwist(random(), uniqueCount);
    return {
      word,
      theme,
      motion,
      twist,
      choices: twist === "find" ? findChoices(word, words, random) : [],
    };
  });
}
