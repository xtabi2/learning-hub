import { loadRecent, orderByFreshness, rememberRecent } from "./variety.js";

export const STORY_BUCKET = "stories";
export const STORY_CHOICES = 3;

/** Stories to offer: never-seen or least-recently-read first, recent ones last. */
export function pickStories(all, recentIds = [], count = STORY_CHOICES, random = Math.random) {
  const fresh = orderByFreshness(all, recentIds, (story) => story.id, random);
  const recentOrder = new Map(recentIds.map((id, index) => [String(id).toLowerCase(), index]));
  const unseen = fresh.filter((story) => !recentOrder.has(story.id));
  const seen = fresh
    .filter((story) => recentOrder.has(story.id))
    .sort((a, b) => recentOrder.get(a.id) - recentOrder.get(b.id));
  return [...unseen, ...seen].slice(0, count);
}

export function recentStories(store, childId) {
  return loadRecent(store, childId, STORY_BUCKET);
}

export function rememberStory(store, childId, storyId) {
  return rememberRecent(store, childId, STORY_BUCKET, storyId);
}
