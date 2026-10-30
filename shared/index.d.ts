export const GRADES: readonly ["PreK", "K", "1", "2", "3"];
export const STORAGE_KEY: string;

export type Grade = "PreK" | "K" | "1" | "2" | "3";

export const DEFAULT_CHILDREN: readonly { id: string; name: string; age: number; grade: Grade }[];
export function gradeLabel(grade: string): string;

export interface Child {
  id: string;
  name: string;
  grade: Grade;
  age?: number;
  createdAt: string;
  progress?: Progress;
}

export interface MathProgress {
  lastMode?: string;
  lastPct?: number;
  lastAvgSec?: number;
  level?: string;
  updatedAt?: string;
}

export interface ReadingProgress {
  practicedWords?: string[];
  masteredWords?: string[];
  updatedAt?: string;
}

export interface AdventureProgress {
  lastOpenedAt?: string;
  storyReadingBand?: string;
  partsCollected?: number;
  readyToLeave?: boolean;
  updatedAt?: string;
}

export interface Progress {
  math?: MathProgress;
  reading?: ReadingProgress;
  adventure?: AdventureProgress;
  [key: string]: unknown;
}

export interface HubStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface Hub {
  listChildren(): Child[];
  addChild(input: { name: string; grade: Grade; age?: number | string }): Child;
  updateChild(id: string, patch: { name?: string; grade?: Grade; age?: number | string | null }): Child | null;
  removeChild(id: string): void;
  getCurrentChild(): Child | null;
  setCurrentChild(id: string): Child | null;
  getProgress(childId: string): Progress | null;
  recordProgress(childId: string, patch: Progress): Progress | null;
}

export function readingGradeId(grade: string): string;
export function createMemoryStorage(): HubStorage;
export function createHub(storage: HubStorage): Hub;
export function hub(): Hub;
