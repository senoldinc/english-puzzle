import { describe, expect, it } from 'vitest';
import { generatePuzzle, type Puzzle } from './generator';
import { pickCandidates, wordsFor } from './session';
import { DIFFICULTIES, isAvailable, poolFor } from '../data/difficulty';
import { CATEGORIES } from '../data/words';

const MODES = DIFFICULTIES.flatMap((d) =>
  [null, ...CATEGORIES.map((c) => c.id)].filter((c) => isAvailable(d.id, c)).map((c) => ({ d, c })),
);

function cellsOf(p: Puzzle, i: number) {
  const e = p.entries[i];
  return [...e.answer].map((_, k) => (e.dir === 'across' ? [e.row, e.col + k] : [e.row + k, e.col]));
}

function build(d: (typeof DIFFICULTIES)[number], c: string | null, seed: number, seen: Record<string, number> = {}) {
  const pool = poolFor(d.id, c);
  const words = wordsFor(pool, pickCandidates(pool, seen, d.wordCount, seed));
  return generatePuzzle(words, d.wordCount, seed);
}

describe('kelime verisi', () => {
  it('İngilizce taraf yalnızca A–Z', () => {
    for (const c of CATEGORIES) for (const w of c.words) expect(w.en).toMatch(/^[A-Z]+$/);
  });

  it('aynı İngilizce kelime her yerde aynı ipucuyla geçer, aynı ipucu iki farklı kelimeye gitmez', () => {
    const byEn = new Map<string, string>();
    const byTr = new Map<string, string>();
    for (const c of CATEGORIES)
      for (const w of c.words) {
        expect(byEn.get(w.en) ?? w.tr, `${w.en}`).toBe(w.tr);
        expect(byTr.get(w.tr) ?? w.en, `"${w.tr}"`).toBe(w.en);
        byEn.set(w.en, w.tr);
        byTr.set(w.tr, w.en);
      }
  });

  it('her zorlukta karışık mod ve her kategori en az iki zorlukta oynanabilir', () => {
    for (const d of DIFFICULTIES) expect(isAvailable(d.id, null)).toBe(true);
    for (const c of CATEGORIES) expect(DIFFICULTIES.filter((d) => isAvailable(d.id, c.id)).length).toBeGreaterThanOrEqual(2);
  });
});

describe('generatePuzzle', () => {
  it('kesişimler tutarlı, kelimeler uç uca yapışmıyor, her dolu hücre bir kelimeye ait', () => {
    for (const { d, c } of MODES) {
      for (const seed of [1, 42]) {
        const p = build(d, c, seed);
        const covered = new Set<string>();
        p.entries.forEach((e, i) => {
          cellsOf(p, i).forEach(([r, col], k) => {
            expect(p.grid[r][col]).toBe(e.answer[k]);
            covered.add(`${r},${col}`);
          });
          const [dr, dc] = e.dir === 'across' ? [0, 1] : [1, 0];
          expect(p.grid[e.row - dr]?.[e.col - dc] ?? null).toBeNull();
          expect(p.grid[e.row + dr * e.answer.length]?.[e.col + dc * e.answer.length] ?? null).toBeNull();
        });
        p.grid.forEach((row, r) => row.forEach((ch, col) => ch && expect(covered.has(`${r},${col}`)).toBe(true)));
      }
    }
  });

  it('aynı seed aynı bulmacayı üretir', () => {
    const d = DIFFICULTIES[2];
    expect(build(d, null, 99)).toEqual(build(d, null, 99));
  });

  it('her oynanabilir zorluk/kategori için hedef kelimelerin en az %80i yerleşir', () => {
    for (const { d, c } of MODES) {
      for (const seed of [1, 2, 3, 4]) {
        const p = build(d, c, seed);
        expect(p.entries.length, `${d.title} / ${c}`).toBeGreaterThanOrEqual(Math.ceil(d.wordCount * 0.8));
        expect(p.entries.length).toBeLessThanOrEqual(d.wordCount);
      }
    }
  });
});

describe('pickCandidates', () => {
  it('daha önce görülmeyen kelimeleri öne alır', () => {
    const d = DIFFICULTIES[1];
    const pool = poolFor(d.id, 'animals');
    const seen = Object.fromEntries(pool.slice(0, pool.length - 12).map((w) => [w.en, 1]));
    const picked = pickCandidates(pool, seen, d.wordCount, 5);
    const fresh = new Set(pool.slice(pool.length - 12).map((w) => w.en));
    expect(picked.slice(0, 12).every((en) => fresh.has(en))).toBe(true);
  });
});
