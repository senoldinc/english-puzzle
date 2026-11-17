import type { Word } from '../data/words';
import { mulberry32, shuffle } from './generator';

/**
 * Bir sonraki bulmaca için aday kelimeleri seçer: en az görülenler önce,
 * eşitler arasında seed'e bağlı rastgele. Böylece aynı seçimle devam edildikçe
 * havuzdaki kelimeler sırayla gelir, tekrar en aza iner.
 */
export function pickCandidates(pool: Word[], seen: Record<string, number>, wordCount: number, seed: number): string[] {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  const ranked = shuffle(pool, rng).sort((a, b) => (seen[a.en] ?? 0) - (seen[b.en] ?? 0));
  return ranked.slice(0, Math.max(wordCount * 2, 12)).map((w) => w.en);
}

export function wordsFor(pool: Word[], candidates: string[]): Word[] {
  const byEn = new Map(pool.map((w) => [w.en, w]));
  return candidates.map((en) => byEn.get(en)).filter((w): w is Word => Boolean(w));
}

export const randomSeed = () => Math.floor(Math.random() * 1e9);
