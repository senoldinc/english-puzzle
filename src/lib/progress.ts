import type { CategoryId, Difficulty } from '../data/difficulty';

const STORAGE_KEY = 'ep-progress-v2';
const LEGACY_KEY = 'ep-progress';

export interface InProgress {
  difficulty: Difficulty;
  category: CategoryId;
  seed: number;
  /** Bulmacanın kurulduğu aday kelimeler (İngilizce); aynı bulmacayı yeniden üretmek için */
  candidates: string[];
  letters: Record<string, string>;
  revealed: Record<string, true>;
  hints: number;
}

export interface ModeStats {
  solved: number;
  stars: number;
}

export interface Progress {
  /** Son seçilen zorluk ve kategori */
  difficulty: Difficulty;
  category: CategoryId;
  totalSolved: number;
  totalStars: number;
  /** Zorluk:kategori → çözülen bulmaca ve toplanan yıldız */
  modes: Record<string, ModeStats>;
  /** Kelime → kaç bulmacada çözüldü (tekrarı azaltmak için) */
  seen: Record<string, number>;
  inProgress?: InProgress;
}

export const DEFAULT_PROGRESS: Progress = {
  difficulty: 1,
  category: null,
  totalSolved: 0,
  totalStars: 0,
  modes: {},
  seen: {},
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROGRESS, ...(JSON.parse(raw) as Progress) };
    // Eski sürümden (seviye sistemi) gelen yıldızları ve çözülen sayısını taşı
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy) as { stars?: Record<string, number> };
      const stars = Object.values(old.stars ?? {});
      return {
        ...DEFAULT_PROGRESS,
        totalSolved: stars.length,
        totalStars: stars.reduce((a, b) => a + b, 0),
      };
    }
  } catch {
    // bozuk veri ya da depolama kapalı: sıfırdan başla
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Depolama kullanılamıyorsa oyun yine çalışır, sadece ilerleme kaydedilmez.
  }
}

export function starsFor(hints: number): number {
  if (hints === 0) return 3;
  if (hints <= 3) return 2;
  return 1;
}
