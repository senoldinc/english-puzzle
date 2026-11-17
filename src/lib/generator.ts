import type { Word } from '../data/words';

export type Dir = 'across' | 'down';

export interface Entry {
  num: number;
  dir: Dir;
  row: number;
  col: number;
  answer: string;
  clue: string;
}

export interface Puzzle {
  rows: number;
  cols: number;
  /** null = siyah (boş) hücre, aksi halde doğru harf */
  grid: (string | null)[][];
  entries: Entry[];
}

interface Placed {
  word: Word;
  r: number;
  c: number;
  dir: Dir;
}

interface Cell {
  ch: string;
  across: boolean;
  down: boolean;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const key = (r: number, c: number) => `${r},${c}`;
const step = (dir: Dir) => (dir === 'across' ? [0, 1] : [1, 0]);

class Board {
  cells = new Map<string, Cell>();
  placed: Placed[] = [];
  minR = 0;
  maxR = 0;
  minC = 0;
  maxC = 0;

  get(r: number, c: number) {
    return this.cells.get(key(r, c));
  }

  /** Geçersizse -1, aksi halde kesişim sayısı */
  check(ans: string, r: number, c: number, dir: Dir): number {
    const [dr, dc] = step(dir);
    if (this.get(r - dr, c - dc)) return -1;
    if (this.get(r + dr * ans.length, c + dc * ans.length)) return -1;
    let inter = 0;
    for (let i = 0; i < ans.length; i++) {
      const rr = r + dr * i;
      const cc = c + dc * i;
      const cell = this.get(rr, cc);
      if (cell) {
        if (cell.ch !== ans[i] || cell[dir]) return -1;
        inter++;
      } else if (this.get(rr + dc, cc + dr) || this.get(rr - dc, cc - dr)) {
        return -1;
      }
    }
    return inter;
  }

  place(word: Word, r: number, c: number, dir: Dir) {
    const [dr, dc] = step(dir);
    for (let i = 0; i < word.en.length; i++) {
      const rr = r + dr * i;
      const cc = c + dc * i;
      const k = key(rr, cc);
      const cell = this.cells.get(k) ?? { ch: word.en[i], across: false, down: false };
      cell[dir] = true;
      this.cells.set(k, cell);
      if (this.placed.length === 0 && i === 0) {
        this.minR = this.maxR = rr;
        this.minC = this.maxC = cc;
      }
      this.minR = Math.min(this.minR, rr);
      this.maxR = Math.max(this.maxR, rr);
      this.minC = Math.min(this.minC, cc);
      this.maxC = Math.max(this.maxC, cc);
    }
    this.placed.push({ word, r, c, dir });
  }

  areaWith(ans: string, r: number, c: number, dir: Dir) {
    const [dr, dc] = step(dir);
    const r2 = r + dr * (ans.length - 1);
    const c2 = c + dc * (ans.length - 1);
    const h = Math.max(this.maxR, r2) - Math.min(this.minR, r) + 1;
    const w = Math.max(this.maxC, c2) - Math.min(this.minC, c) + 1;
    // Kareye yakın ızgaraları tercih et
    return h * w + Math.abs(h - w) * 2;
  }

  /** Kelime için en iyi konumu bulur, yoksa null */
  bestSpot(ans: string, rng: () => number) {
    let best: { r: number; c: number; dir: Dir; score: number } | null = null;
    for (const [k, cell] of this.cells) {
      const [cr, cc] = k.split(',').map(Number);
      for (let i = 0; i < ans.length; i++) {
        if (ans[i] !== cell.ch) continue;
        for (const dir of ['across', 'down'] as Dir[]) {
          if (cell[dir]) continue;
          const [dr, dc] = step(dir);
          const r = cr - dr * i;
          const c = cc - dc * i;
          const inter = this.check(ans, r, c, dir);
          if (inter < 1) continue;
          const score = inter * 50 - this.areaWith(ans, r, c, dir) + rng() * 5;
          if (!best || score > best.score) best = { r, c, dir, score };
        }
      }
    }
    return best;
  }
}

function attempt(pool: Word[], target: number, rng: () => number): Board {
  const board = new Board();
  const shuffled = shuffle(pool, rng);
  // Uzun kelimeler önce: daha çok kesişim imkânı
  const firstPick = shuffled.slice(0, Math.max(target, 4));
  firstPick.sort((a, b) => b.en.length - a.en.length);
  const first = firstPick[0];
  board.place(first, 0, 0, rng() < 0.5 ? 'across' : 'down');

  let remaining = shuffled.filter((w) => w !== first);
  for (let pass = 0; pass < 3 && board.placed.length < target; pass++) {
    const failed: Word[] = [];
    for (const w of remaining) {
      if (board.placed.length >= target) break;
      const spot = board.bestSpot(w.en, rng);
      if (spot) board.place(w, spot.r, spot.c, spot.dir);
      else failed.push(w);
    }
    remaining = failed;
  }
  return board;
}

function toPuzzle(board: Board): Puzzle {
  const rows = board.maxR - board.minR + 1;
  const cols = board.maxC - board.minC + 1;
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (const [k, cell] of board.cells) {
    const [r, c] = k.split(',').map(Number);
    grid[r - board.minR][c - board.minC] = cell.ch;
  }

  const starts = new Map<string, Placed[]>();
  for (const p of board.placed) {
    const k = key(p.r - board.minR, p.c - board.minC);
    starts.set(k, [...(starts.get(k) ?? []), p]);
  }

  const entries: Entry[] = [];
  let num = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ps = starts.get(key(r, c));
      if (!ps) continue;
      num++;
      for (const p of ps) {
        entries.push({ num, dir: p.dir, row: r, col: c, answer: p.word.en, clue: p.word.tr });
      }
    }
  }
  return { rows, cols, grid, entries };
}

/**
 * Kelime havuzundan seed'e bağlı (deterministik) bir çengel bulmaca üretir.
 */
export function generatePuzzle(pool: Word[], target: number, seed: number, attempts = 40): Puzzle {
  const rng = mulberry32(seed);
  let best: Board | null = null;
  let bestScore = -Infinity;
  for (let i = 0; i < attempts; i++) {
    const b = attempt(pool, target, rng);
    const area = (b.maxR - b.minR + 1) * (b.maxC - b.minC + 1);
    const score = b.placed.length * 1000 - area;
    if (score > bestScore) {
      best = b;
      bestScore = score;
    }
  }
  return toPuzzle(best!);
}
