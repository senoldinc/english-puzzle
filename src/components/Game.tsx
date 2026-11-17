import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Word } from '../data/words';
import { generatePuzzle, type Dir, type Entry } from '../lib/generator';
import { normalizeLetter } from '../lib/normalize';
import { starsFor } from '../lib/progress';
import PuzzleBoard from './PuzzleBoard';
import CluesList from './CluesList';
import Toolbar from './Toolbar';
import LevelComplete from './LevelComplete';
import Icon from './Icon';

export interface BoardState {
  letters: Record<string, string>;
  revealed: Record<string, true>;
  hints: number;
}

interface Props {
  /** Aday kelimeler; üretici bunlardan wordCount kadarını yerleştirir */
  words: Word[];
  wordCount: number;
  seed: number;
  /** Başlık, ör. "Orta, Hayvanlar" */
  title: string;
  /** Bu seçimde kaç bulmaca çözüldü (bu dahil değil) */
  solvedInMode: number;
  saved?: BoardState;
  onSave: (state: BoardState) => void;
  onComplete: (hints: number, answers: string[]) => void;
  onBack: () => void;
  onNewPuzzle: () => void;
  onNext: () => void;
}

export type Pos = { r: number; c: number };
const k = (r: number, c: number) => `${r},${c}`;

export function entryCells(e: Entry): Pos[] {
  return [...e.answer].map((_, i) =>
    e.dir === 'across' ? { r: e.row, c: e.col + i } : { r: e.row + i, c: e.col },
  );
}

export default function Game({ words, wordCount, seed, title, solvedInMode: solvedProp, saved, onSave, onComplete, onBack, onNewPuzzle, onNext }: Props) {
  // Bulmaca açıldığı andaki sayı; çözülünce ilerleme güncellense de değişmesin
  const [solvedInMode] = useState(solvedProp);
  const puzzle = useMemo(() => generatePuzzle(words, wordCount, seed), [words, wordCount, seed]);

  /** hücre → { across: entryIndex, down: entryIndex } */
  const cellMap = useMemo(() => {
    const m = new Map<string, Partial<Record<Dir, number>>>();
    puzzle.entries.forEach((e, i) => {
      for (const p of entryCells(e)) {
        const key = k(p.r, p.c);
        m.set(key, { ...m.get(key), [e.dir]: i });
      }
    });
    return m;
  }, [puzzle]);

  const first = puzzle.entries[0];
  const [letters, setLetters] = useState<Record<string, string>>(saved?.letters ?? {});
  const [revealed, setRevealed] = useState<Record<string, true>>(saved?.revealed ?? {});
  const [hints, setHints] = useState(saved?.hints ?? 0);
  const [wrong, setWrong] = useState<Record<string, true>>({});
  const [active, setActive] = useState<Pos>({ r: first.row, c: first.col });
  const [dir, setDir] = useState<Dir>(first.dir);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeIdx = (() => {
    const m = cellMap.get(k(active.r, active.c));
    return m?.[dir] ?? m?.[dir === 'across' ? 'down' : 'across'] ?? 0;
  })();
  const activeEntry = puzzle.entries[activeIdx];
  const activeCells = entryCells(activeEntry);

  const isComplete = useMemo(
    () =>
      puzzle.grid.every((row, r) => row.every((ch, c) => ch === null || letters[k(r, c)] === ch)),
    [puzzle, letters],
  );

  useEffect(() => {
    if (completedRef.current) return;
    if (isComplete) {
      completedRef.current = true;
      setDone(true);
      onComplete(hints, puzzle.entries.map((e) => e.answer));
    } else {
      onSave({ letters, revealed, hints });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters, revealed, hints, isComplete]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(t);
  }, [message]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Masaüstünde açılır açılmaz yazmaya başlanabilsin (mobilde klavye kendiliğinden açılmasın)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia?.('(pointer: fine)').matches) focusInput();
  }, [focusInput]);

  const select = (pos: Pos, preferDir?: Dir) => {
    const m = cellMap.get(k(pos.r, pos.c));
    if (!m) return;
    const want = preferDir ?? dir;
    setDir(m[want] !== undefined ? want : want === 'across' ? 'down' : 'across');
    setActive(pos);
  };

  const clearWrong = (key: string) =>
    setWrong((w) => {
      if (!w[key]) return w;
      const { [key]: _, ...rest } = w;
      return rest;
    });

  const typeLetter = (ch: string) => {
    if (done) return;
    const key = k(active.r, active.c);
    if (!revealed[key]) {
      setLetters((l) => ({ ...l, [key]: ch }));
      clearWrong(key);
    }
    const idx = activeCells.findIndex((p) => p.r === active.r && p.c === active.c);
    if (idx < activeCells.length - 1) setActive(activeCells[idx + 1]);
  };

  const backspace = () => {
    if (done) return;
    const key = k(active.r, active.c);
    if (letters[key] && !revealed[key]) {
      setLetters(({ [key]: _, ...rest }) => rest);
      clearWrong(key);
      return;
    }
    const idx = activeCells.findIndex((p) => p.r === active.r && p.c === active.c);
    if (idx > 0) {
      const prev = activeCells[idx - 1];
      const pk = k(prev.r, prev.c);
      setActive(prev);
      if (!revealed[pk]) {
        setLetters(({ [pk]: _, ...rest }) => rest);
        clearWrong(pk);
      }
    }
  };

  const move = (dr: number, dc: number) => {
    const axis: Dir = dc !== 0 ? 'across' : 'down';
    const m = cellMap.get(k(active.r, active.c));
    if (axis !== dir && m?.[axis] !== undefined) {
      setDir(axis);
      return;
    }
    let r = active.r + dr;
    let c = active.c + dc;
    while (r >= 0 && c >= 0 && r < puzzle.rows && c < puzzle.cols) {
      if (puzzle.grid[r][c]) {
        select({ r, c }, axis);
        return;
      }
      r += dr;
      c += dc;
    }
  };

  const goEntry = (delta: number) => {
    const n = puzzle.entries.length;
    const e = puzzle.entries[(activeIdx + delta + n) % n];
    setDir(e.dir);
    setActive({ r: e.row, c: e.col });
  };

  const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    const arrows: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    if (arrows[ev.key]) {
      ev.preventDefault();
      move(...arrows[ev.key]);
    } else if (ev.key === 'Backspace' || ev.key === 'Delete') {
      ev.preventDefault();
      backspace();
    } else if (ev.key === 'Tab' || ev.key === 'Enter') {
      ev.preventDefault();
      goEntry(ev.shiftKey ? -1 : 1);
    } else if (ev.key === ' ') {
      ev.preventDefault();
      const m = cellMap.get(k(active.r, active.c));
      const other: Dir = dir === 'across' ? 'down' : 'across';
      if (m?.[other] !== undefined) setDir(other);
    }
  };

  // Gizli input daima " " içerir: harf eklenirse harf, silinirse geri tuşu (mobil klavyeler için).
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const v = ev.target.value;
    if (v.length === 0) {
      backspace();
      return;
    }
    const chars = [...v.replace(/ /g, '')];
    const ch = chars.length ? normalizeLetter(chars[chars.length - 1]) : null;
    if (ch) typeLetter(ch);
  };

  const onCellClick = (pos: Pos) => {
    if (pos.r === active.r && pos.c === active.c) {
      const m = cellMap.get(k(pos.r, pos.c));
      const other: Dir = dir === 'across' ? 'down' : 'across';
      if (m?.[other] !== undefined) setDir(other);
    } else {
      select(pos);
    }
    focusInput();
  };

  // --- Yardımlar ---
  const check = () => {
    const w: Record<string, true> = {};
    let empty = 0;
    puzzle.grid.forEach((row, r) =>
      row.forEach((ch, c) => {
        if (!ch) return;
        const v = letters[k(r, c)];
        if (!v) empty++;
        else if (v !== ch) w[k(r, c)] = true;
      }),
    );
    setWrong(w);
    setHints((h) => h + 1);
    const nWrong = Object.keys(w).length;
    setMessage(
      nWrong
        ? `${nWrong} yanlış harf var`
        : empty
          ? 'Şu ana kadar hepsi doğru 👍'
          : 'Hepsi doğru!',
    );
    focusInput();
  };

  const revealCells = (cells: Pos[]) => {
    const todo = cells.filter((p) => letters[k(p.r, p.c)] !== puzzle.grid[p.r][p.c]);
    if (!todo.length) {
      setMessage('Bu kelime zaten doğru');
      return false;
    }
    setLetters((l) => {
      const n = { ...l };
      for (const p of todo) n[k(p.r, p.c)] = puzzle.grid[p.r][p.c]!;
      return n;
    });
    setRevealed((rv) => {
      const n = { ...rv };
      for (const p of todo) n[k(p.r, p.c)] = true;
      return n;
    });
    setWrong((w) => {
      const n = { ...w };
      for (const p of todo) delete n[k(p.r, p.c)];
      return n;
    });
    setHints((h) => h + 1);
    return true;
  };

  const revealLetter = () => {
    const curKey = k(active.r, active.c);
    const target =
      letters[curKey] !== puzzle.grid[active.r][active.c]
        ? active
        : activeCells.find((p) => letters[k(p.r, p.c)] !== puzzle.grid[p.r][p.c]);
    if (target) revealCells([target]);
    else setMessage('Bu kelime zaten doğru');
    focusInput();
  };

  const revealWord = () => {
    revealCells(activeCells);
    focusInput();
  };

  const reset = () => {
    if (!confirm('Girdiğin harfler silinsin mi? (Açılan harfler kalır)')) return;
    setLetters((l) => Object.fromEntries(Object.entries(l).filter(([key]) => revealed[key])));
    setWrong({});
    focusInput();
  };

  const activeSet = new Set(activeCells.map((p) => k(p.r, p.c)));

  return (
    <div className="shell game">
      <header className="game-header">
        <button type="button" className="btn-back" onClick={onBack} aria-label="Ana ekrana dön">
          <Icon name="chevron-left" />
          <span>Ana ekran</span>
        </button>
        <div className="game-title">
          <span className="level-num">Bulmaca {solvedInMode + 1}</span>
          <h1>{title}</h1>
        </div>
        <p className="hint-count" title="Kullanılan yardım">
          Yardım <span className="num">{hints}</span>
        </p>
      </header>

      <div className="game-body">
        <section className="board-col" aria-label="Bulmaca">
          <div className="current-clue">
            <button type="button" className="btn btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => goEntry(-1)} aria-label="Önceki ipucu">
              <Icon name="chevron-left" />
            </button>
            <div className="current-clue-text" aria-live="polite">
              <span className="clue-tag">
                {activeEntry.num} {activeEntry.dir === 'across' ? 'yatay' : 'dikey'}, {activeEntry.answer.length} harf
              </span>
              <span className="clue-word">{activeEntry.clue}</span>
            </div>
            <button type="button" className="btn btn-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => goEntry(1)} aria-label="Sonraki ipucu">
              <Icon name="chevron-right" />
            </button>
          </div>

          <PuzzleBoard
            puzzle={puzzle}
            letters={letters}
            revealed={revealed}
            wrong={wrong}
            active={active}
            activeSet={activeSet}
            onCellClick={onCellClick}
          >
            <input
              ref={inputRef}
              className="hidden-input"
              value=" "
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={(e) => e.target.setSelectionRange(1, 1)}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              aria-label="Harf gir"
            />
          </PuzzleBoard>
          <div className="toast" role="status" aria-live="polite">
            {message}
          </div>

          <Toolbar
            onCheck={check}
            onRevealLetter={revealLetter}
            onRevealWord={revealWord}
            onReset={reset}
            onNewPuzzle={() => {
              if (confirm('Bu bulmaca atlanıp yenisine geçilsin mi?')) onNewPuzzle();
            }}
            disabled={done}
          />
        </section>

        <CluesList
          entries={puzzle.entries}
          activeIdx={activeIdx}
          letters={letters}
          onSelect={(i) => {
            const e = puzzle.entries[i];
            setDir(e.dir);
            setActive({ r: e.row, c: e.col });
            focusInput();
          }}
        />
      </div>

      {done && (
        <LevelComplete
          title={title}
          solvedInMode={solvedInMode + 1}
          stars={starsFor(hints)}
          hints={hints}
          entries={puzzle.entries}
          onNext={onNext}
          onBack={onBack}
        />
      )}
    </div>
  );
}
