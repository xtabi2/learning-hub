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

function recentLabel(item) {
  if (typeof item === "string" || typeof item === "number") return String(item).toLowerCase();
  if (!item || typeof item !== "object" || Array.isArray(item)) return "";
  const text = typeof item.text === "string"
    ? item.text
    : typeof item.word === "string"
      ? item.word
      : item.word && typeof item.word.text === "string"
        ? item.word.text
        : "";
  return text.toLowerCase();
}

// Old sessions sometimes stored a find-the-word or flip card. Keep only the
// word that was seen, and drop anything that is not a list of words.
function scrubHistory(data) {
  const clean = {};
  for (const [bucket, list] of Object.entries(data)) {
    if (!Array.isArray(list)) continue;
    const words = [];
    for (const item of list) {
      const label = recentLabel(item);
      if (!label || words.includes(label)) continue;
      words.push(label);
    }
    if (words.length) clean[bucket] = words.slice(-HISTORY_SIZE);
  }
  return clean;
}

function readHistory(store, childId) {
  try {
    const raw = store?.getItem(historyKey(childId));
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const clean = scrubHistory(data);
    if (store && JSON.stringify(data) !== JSON.stringify(clean)) {
      try {
        store.setItem(historyKey(childId), JSON.stringify(clean));
      } catch {
        // Leave the old value if storage is blocked. Callers still see words only.
      }
    }
    return clean;
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

export function planCards(words, recentTexts = [], random = Math.random) {
  const ordered = orderByFreshness(words, recentTexts, (word) => word.text, random);
  return ordered.map((word) => ({
    word,
    theme: CARD_THEMES[Math.floor(random() * CARD_THEMES.length)],
    motion: CARD_MOTIONS[Math.floor(random() * CARD_MOTIONS.length)],
  }));
}
