/**
 * Shared child profile for the learning hub.
 * Stored in localStorage on the hub origin so Math, Reading, and Adventure
 * see the same kid. Games keep their own saved progress; this is the foundation.
 */

export const GRADES = ["K", "1", "2", "3"];
export const STORAGE_KEY = "learning-hub.v1";

let memoryStorage;

export function readingGradeId(grade) {
  if (grade === "K" || grade === "k") return "k";
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
      if (!raw) return { children: [], currentId: null };
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.children)) return { children: [], currentId: null };
      return { children: data.children, currentId: data.currentId ?? null };
    } catch {
      return { children: [], currentId: null };
    }
  }

  function save(data) {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  return {
    listChildren() {
      return load().children.map((child) => ({ ...child }));
    },

    addChild({ name, grade }) {
      const trimmed = String(name ?? "").trim().slice(0, 40);
      if (!trimmed) throw new Error("Name is required");
      if (!GRADES.includes(grade)) throw new Error("Grade must be K, 1, 2, or 3");
      const data = load();
      const child = {
        id: crypto.randomUUID(),
        name: trimmed,
        grade,
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
        if (!GRADES.includes(patch.grade)) throw new Error("Grade must be K, 1, 2, or 3");
        child.grade = patch.grade;
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
