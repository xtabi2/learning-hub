/**
 * Shared child profile for the learning hub.
 * Stored in localStorage on the hub origin so Math, Reading, and Adventure
 * see the same kid. Games keep their own saved progress; this is the foundation.
 */

export const GRADES = ["PreK", "K", "1", "2", "3"];
export const STORAGE_KEY = "learning-hub.v1";

export const AVATARS = ["cat", "bunny", "monkey", "dog", "bear", "panda", "fox", "frog", "owl", "pig"];
const NAMED_AVATARS = { madison: "cat", sydney: "bunny", wesley: "monkey" };

/** Avatar for a saved kid that has none: the named default, else a stable pick from the id. */
export function fallbackAvatar(child) {
  const named = NAMED_AVATARS[String(child?.name ?? "").trim().toLowerCase()];
  if (named) return named;
  const key = String(child?.id ?? child?.name ?? "");
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  return AVATARS[hash % AVATARS.length];
}

function checkAvatar(avatar) {
  if (!AVATARS.includes(avatar)) throw new Error("Pick an animal");
  return avatar;
}

/** Shown only when no profiles are saved yet. Never written over saved kids. */
export const DEFAULT_CHILDREN = Object.freeze([
  Object.freeze({ id: "default-madison", name: "Madison", age: 7, grade: "1", avatar: "cat" }),
  Object.freeze({ id: "default-sydney", name: "Sydney", age: 5, grade: "PreK", avatar: "bunny" }),
  Object.freeze({ id: "default-wesley", name: "Wesley", age: 2, grade: "PreK", avatar: "monkey" }),
]);

const GRADE_ERROR = "Grade must be Pre-K, K, 1, 2, or 3";

export function gradeLabel(grade) {
  if (grade === "PreK") return "Pre-K";
  if (grade === "K") return "Kindergarten";
  return `Grade ${grade}`;
}

function normalizeAge(age) {
  if (age === undefined || age === null || age === "") return undefined;
  const n = Number(age);
  if (!Number.isInteger(n) || n < 0 || n > 18) throw new Error("Age must be a whole number from 0 to 18");
  return n;
}

function seedChildren() {
  return DEFAULT_CHILDREN.map((kid) => ({ ...kid, createdAt: "2026-10-30T00:00:00.000Z", progress: {} }));
}

let memoryStorage;

export function readingGradeId(grade) {
  // Pre-K has no deck of its own; it uses the easiest (Kindergarten) sight words.
  if (grade === "PreK" || grade === "K" || grade === "k") return "k";
  return grade;
}

export function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

export function createHub(storage) {
  function load() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return { children: seedChildren(), currentId: null };
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.children) || data.children.length === 0) {
        return { children: seedChildren(), currentId: null };
      }
      // One-time, non-destructive migration: fill in a missing avatar, keep everything else.
      let migrated = false;
      for (const child of data.children) {
        if (child && typeof child === "object" && !AVATARS.includes(child.avatar)) {
          child.avatar = fallbackAvatar(child);
          migrated = true;
        }
      }
      if (migrated) storage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { children: data.children, currentId: data.currentId ?? null };
    } catch {
      // Unreadable data: show defaults but do not overwrite what is stored until a real save.
      return { children: seedChildren(), currentId: null };
    }
  }

  function save(data) {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  return {
    listChildren() {
      return load().children.map((child) => ({ ...child }));
    },

    addChild({ name, grade, age, avatar }) {
      const trimmed = String(name ?? "").trim().slice(0, 40);
      if (!trimmed) throw new Error("Name is required");
      if (!GRADES.includes(grade)) throw new Error(GRADE_ERROR);
      const childAge = normalizeAge(age);
      const data = load();
      const childAvatar = avatar === undefined ? fallbackAvatar({ name: trimmed, id: trimmed }) : checkAvatar(avatar);
      const child = {
        id: crypto.randomUUID(),
        name: trimmed,
        grade,
        ...(childAge !== undefined ? { age: childAge } : {}),
        avatar: childAvatar,
        createdAt: new Date().toISOString(),
        progress: {},
      };
      data.children.push(child);
      data.currentId = child.id;
      save(data);
      return { ...child };
    },

    updateChild(id, patch) {
      const data = load();
      const child = data.children.find((item) => item.id === id);
      if (!child) return null;
      if (patch.name !== undefined) {
        const trimmed = String(patch.name).trim().slice(0, 40);
        if (!trimmed) throw new Error("Name is required");
        child.name = trimmed;
      }
      if (patch.grade !== undefined) {
        if (!GRADES.includes(patch.grade)) throw new Error(GRADE_ERROR);
        child.grade = patch.grade;
      }
      if (patch.avatar !== undefined) child.avatar = checkAvatar(patch.avatar);
      if (patch.age !== undefined) {
        const childAge = normalizeAge(patch.age);
        if (childAge === undefined) delete child.age;
        else child.age = childAge;
      }
      save(data);
      return { ...child };
    },

    removeChild(id) {
      const data = load();
      data.children = data.children.filter((child) => child.id !== id);
      if (data.currentId === id) data.currentId = data.children[0]?.id ?? null;
      save(data);
    },

    getCurrentChild() {
      const data = load();
      const child = data.children.find((item) => item.id === data.currentId);
      return child ? { ...child } : null;
    },

    setCurrentChild(id) {
      const data = load();
      const child = data.children.find((item) => item.id === id);
      if (!child) return null;
      data.currentId = id;
      save(data);
      return { ...child };
    },

    getProgress(childId) {
      const data = load();
      const child = data.children.find((item) => item.id === childId);
      if (!child) return null;
      return child.progress ? structuredClone(child.progress) : {};
    },

    recordProgress(childId, patch) {
      const data = load();
      const child = data.children.find((item) => item.id === childId);
      if (!child) return null;
      child.progress = mergeProgress(child.progress && typeof child.progress === "object" ? child.progress : {}, patch ?? {});
      save(data);
      return structuredClone(child.progress);
    },
  };
}

function mergeProgress(prev, patch) {
  const out = { ...prev };
  for (const key of Object.keys(patch)) {
    const value = patch[key];
    if (Array.isArray(value)) {
      const before = Array.isArray(out[key]) ? out[key] : [];
      out[key] = [...new Set([...before, ...value.map(String)])];
    } else if (value && typeof value === "object") {
      const base = out[key] && typeof out[key] === "object" && !Array.isArray(out[key]) ? out[key] : {};
      out[key] = mergeProgress(base, value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

export function hub() {
  if (typeof localStorage !== "undefined") return createHub(localStorage);
  memoryStorage ??= createMemoryStorage();
  return createHub(memoryStorage);
}
