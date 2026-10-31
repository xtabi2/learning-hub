/**
 * Shared child profile for the learning hub.
 * Stored in localStorage on the hub origin so Math, Reading, and Adventure
 * see the same kid. Games keep their own saved progress; this is the foundation.
 */

export const GRADES = ["PreK", "K", "1", "2", "3"];
export const STORAGE_KEY = "learning-hub.v1";

export const AVATARS = ["cat", "bunny", "monkey", "dog", "bear", "panda", "fox", "frog", "owl", "pig"];
const NAMED_AVATARS = { madison: "cat", sydney: "bunny", wesley: "monkey" };
/** Birthdays and kindergarten start years for the family's kids, filled in by name when missing. */
export const KNOWN_KIDS = Object.freeze({
  madison: Object.freeze({ birthMonth: 10, birthYear: 2019, kStartYear: 2025 }),
  sydney: Object.freeze({ birthMonth: 9, birthYear: 2021, kStartYear: 2027 }),
  wesley: Object.freeze({ birthMonth: 6, birthYear: 2024, kStartYear: 2029 }),
});

// ---------- automatic grade progression ----------
/** New school year starts Aug 15 (Big Walnut). Returns the calendar year the school year began. */
export function schoolYear(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return m > 8 || (m === 8 && date.getDate() >= 15) ? y : y - 1;
}

/** Whole years old from birth month/year (birthday counted from the 1st of that month). */
export function ageFrom(kid, date = new Date()) {
  const by = Number(kid?.birthYear);
  const bm = Number(kid?.birthMonth);
  if (!Number.isInteger(by) || !Number.isInteger(bm)) return Number.isInteger(kid?.age) ? kid.age : undefined;
  const months = (date.getFullYear() - by) * 12 + (date.getMonth() + 1 - bm);
  return Math.max(0, Math.floor(months / 12));
}

/** Days from Aug 15 until the year's content is fully in play (about mid-April). */
export const RAMP_DAYS = 240;

/** How far into the school year: 0 on Aug 15, 1 by about mid-April through summer. */
export function yearProgress(date = new Date()) {
  const start = new Date(schoolYear(date), 7, 15);
  const days = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(start.getFullYear(), 7, 15)) / 86400000);
  return Math.round(Math.min(1, Math.max(0, days / RAMP_DAYS)) * 100) / 100;
}

/** Grade from the kindergarten start year: before K is Pre-K, 4+ years after K stays 3rd. */
export function gradeFromKStart(kStartYear, date = new Date()) {
  const idx = schoolYear(date) - Number(kStartYear);
  if (idx < 0) return "PreK";
  if (idx === 0) return "K";
  return String(Math.min(3, idx));
}

/**
 * The kid's level on a date: { grade, progress }. A manual gradeOverride wins; otherwise the
 * grade comes from kStartYear, else the saved grade. progress (0..1) ramps across the school year.
 */
export function getLevel(kid, date = new Date()) {
  if (!kid) return { grade: null, progress: 1 };
  let grade;
  if (GRADES.includes(kid.gradeOverride)) grade = kid.gradeOverride;
  else if (Number.isInteger(Number(kid.kStartYear)) && kid.kStartYear !== undefined && kid.kStartYear !== null && kid.kStartYear !== "") grade = gradeFromKStart(kid.kStartYear, date);
  else grade = GRADES.includes(kid.grade) ? kid.grade : null;
  if (!grade) return { grade: null, progress: 1 };
  const progress = kid.kStartYear !== undefined || kid.gradeOverride ? yearProgress(date) : 1;
  return { grade, progress };
}

/** Previous grade (the review scope early in the year), or null for Pre-K. */
export function priorGrade(grade) {
  const i = GRADES.indexOf(grade);
  return i > 0 ? GRADES[i - 1] : null;
}

/** Early in the year (before ~November) kids review last year's scope. */
export const REVIEW_UNTIL = 0.34;

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
  Object.freeze({ id: "default-madison", name: "Madison", age: 7, grade: "1", avatar: "cat", birthMonth: 10, birthYear: 2019, kStartYear: 2025 }),
  Object.freeze({ id: "default-sydney", name: "Sydney", age: 5, grade: "PreK", avatar: "bunny", birthMonth: 9, birthYear: 2021, kStartYear: 2027 }),
  Object.freeze({ id: "default-wesley", name: "Wesley", age: 2, grade: "PreK", avatar: "monkey", birthMonth: 6, birthYear: 2024, kStartYear: 2029 }),
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

function intIn(value, lo, hi, message) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < lo || n > hi) throw new Error(message);
  return n;
}

/** Validated birthday / K start / override fields from form input; empty values are left out. */
function progressionFields(input) {
  const out = {};
  const bm = intIn(input.birthMonth, 1, 12, "Birth month must be 1 to 12");
  const by = intIn(input.birthYear, 2005, 2100, "Birth year looks wrong");
  const ks = intIn(input.kStartYear, 2005, 2100, "Kindergarten start year looks wrong");
  if ((bm === undefined) !== (by === undefined)) throw new Error("Give both birth month and year");
  if (bm !== undefined) Object.assign(out, { birthMonth: bm, birthYear: by });
  if (ks !== undefined) out.kStartYear = ks;
  if (input.gradeOverride !== undefined && input.gradeOverride !== null && input.gradeOverride !== "") {
    if (!GRADES.includes(input.gradeOverride)) throw new Error(GRADE_ERROR);
    out.gradeOverride = input.gradeOverride;
  }
  return out;
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
        if (!child || typeof child !== "object") continue;
        if (!AVATARS.includes(child.avatar)) {
          child.avatar = fallbackAvatar(child);
          migrated = true;
        }
        // Fill in a known kid's birthday / K start only where the field is missing.
        const known = KNOWN_KIDS[String(child.name ?? "").trim().toLowerCase()];
        if (known) {
          for (const [field, value] of Object.entries(known)) {
            if (child[field] === undefined || child[field] === null || child[field] === "") {
              child[field] = value;
              migrated = true;
            }
          }
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

    addChild({ name, grade, age, avatar, ...rest }) {
      const trimmed = String(name ?? "").trim().slice(0, 40);
      if (!trimmed) throw new Error("Name is required");
      const extra = progressionFields(rest);
      if (grade === undefined || grade === "") grade = getLevel({ ...extra }).grade ?? undefined;
      if (!GRADES.includes(grade)) throw new Error(grade === undefined ? "Pick a grade or a kindergarten start year" : GRADE_ERROR);
      let childAge = normalizeAge(age);
      if (childAge === undefined && extra.birthYear !== undefined) childAge = ageFrom(extra);
      const data = load();
      const childAvatar = avatar === undefined ? fallbackAvatar({ name: trimmed, id: trimmed }) : checkAvatar(avatar);
      const child = {
        id: crypto.randomUUID(),
        name: trimmed,
        grade,
        ...(childAge !== undefined ? { age: childAge } : {}),
        avatar: childAvatar,
        ...extra,
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
      for (const field of ["birthMonth", "birthYear", "kStartYear", "gradeOverride"]) {
        if (patch[field] === undefined) continue;
        if (patch[field] === null || patch[field] === "") delete child[field];
      }
      const merged = { birthMonth: child.birthMonth, birthYear: child.birthYear, kStartYear: child.kStartYear, gradeOverride: child.gradeOverride };
      for (const field of Object.keys(merged)) if (patch[field] !== undefined && patch[field] !== null && patch[field] !== "") merged[field] = patch[field];
      for (const field of Object.keys(merged)) if (merged[field] === undefined) delete merged[field];
      for (const field of Object.keys(merged)) delete child[field];
      Object.assign(child, progressionFields(merged));
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
