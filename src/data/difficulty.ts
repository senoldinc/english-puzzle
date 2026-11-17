import { CATEGORIES, type Word } from './words';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface DifficultyDef {
  id: Difficulty;
  title: string;
  wordCount: number;
  minLen: number;
  maxLen: number;
}

export const DIFFICULTIES: DifficultyDef[] = [
  { id: 1, title: 'Başlangıç', wordCount: 5, minLen: 3, maxLen: 4 },
  { id: 2, title: 'Kolay', wordCount: 6, minLen: 3, maxLen: 5 },
  { id: 3, title: 'Orta', wordCount: 8, minLen: 4, maxLen: 6 },
  { id: 4, title: 'Zor', wordCount: 9, minLen: 5, maxLen: 8 },
  { id: 5, title: 'Uzman', wordCount: 10, minLen: 6, maxLen: 11 },
];

/** null = tüm kategoriler karışık */
export type CategoryId = string | null;

export function getDifficulty(id: Difficulty): DifficultyDef {
  return DIFFICULTIES.find((d) => d.id === id)!;
}

export function getCategoryTitle(id: CategoryId): string {
  return id ? (CATEGORIES.find((c) => c.id === id)?.title ?? 'Karışık') : 'Karışık';
}

/** Seçilen zorluk ve kategori için kelime havuzu (İngilizcesi tekrar etmeyen) */
export function poolFor(difficulty: Difficulty, category: CategoryId): Word[] {
  const d = getDifficulty(difficulty);
  const source = category ? CATEGORIES.filter((c) => c.id === category) : CATEGORIES;
  const seen = new Set<string>();
  const out: Word[] = [];
  for (const c of source) {
    for (const w of c.words) {
      if (w.en.length < d.minLen || w.en.length > d.maxLen || seen.has(w.en)) continue;
      seen.add(w.en);
      out.push(w);
    }
  }
  return out;
}

/** Çeşitli bulmacalar kurulabilmesi için havuz, kelime sayısının en az 1,6 katı olmalı */
export const minPool = (difficulty: Difficulty) => Math.ceil(getDifficulty(difficulty).wordCount * 1.6);

export function isAvailable(difficulty: Difficulty, category: CategoryId): boolean {
  return poolFor(difficulty, category).length >= minPool(difficulty);
}

export const modeKey = (difficulty: Difficulty, category: CategoryId) => `${difficulty}:${category ?? 'all'}`;
