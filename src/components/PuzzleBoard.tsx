import type { ReactNode } from 'react';
import type { Puzzle } from '../lib/generator';
import type { Pos } from './Game';

interface Props {
  puzzle: Puzzle;
  letters: Record<string, string>;
  revealed: Record<string, true>;
  wrong: Record<string, true>;
  active: Pos;
  activeSet: Set<string>;
  onCellClick: (pos: Pos) => void;
  children?: ReactNode;
}

export default function PuzzleBoard({ puzzle, letters, revealed, wrong, active, activeSet, onCellClick, children }: Props) {
  const numbers = new Map<string, number>();
  for (const e of puzzle.entries) numbers.set(`${e.row},${e.col}`, e.num);

  return (
    <div className="board-wrap">
      <div className="mat">
        <i aria-hidden="true" />
        <div
          className="board"
          style={{ '--cols': puzzle.cols, '--rows': puzzle.rows } as React.CSSProperties}
        >
          {puzzle.grid.map((row, r) =>
            row.map((ch, c) => {
              const key = `${r},${c}`;
              if (!ch) return <div key={key} className="cell block" aria-hidden />;
              const cls = ['cell'];
              if (activeSet.has(key)) cls.push('in-word');
              if (active.r === r && active.c === c) cls.push('active');
              if (wrong[key]) cls.push('wrong');
              if (revealed[key]) cls.push('revealed');
              return (
                <div key={key} className={cls.join(' ')} onMouseDown={(e) => e.preventDefault()} onClick={() => onCellClick({ r, c })}>
                  {numbers.has(key) && <span className="cell-num">{numbers.get(key)}</span>}
                  <span className="cell-letter">{letters[key] ?? ''}</span>
                </div>
              );
            }),
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
