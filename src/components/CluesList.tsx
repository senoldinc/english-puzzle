import type { Dir, Entry } from '../lib/generator';

interface Props {
  entries: Entry[];
  activeIdx: number;
  letters: Record<string, string>;
  onSelect: (index: number) => void;
}

function isFilled(e: Entry, letters: Record<string, string>) {
  return [...e.answer].every((_, i) =>
    letters[e.dir === 'across' ? `${e.row},${e.col + i}` : `${e.row + i},${e.col}`],
  );
}

export default function CluesList({ entries, activeIdx, letters, onSelect }: Props) {
  const group = (dir: Dir, title: string) => {
    const items = entries.map((e, i) => ({ e, i })).filter(({ e }) => e.dir === dir);
    if (!items.length) return null;
    return (
      <div className="clue-group">
        <h2>{title}</h2>
        <ol>
          {items.map(({ e, i }) => (
            <li key={i}>
              <button
                type="button"
                className={`clue ${i === activeIdx ? 'active' : ''} ${isFilled(e, letters) ? 'filled' : ''}`}
                aria-current={i === activeIdx ? 'true' : undefined}
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => onSelect(i)}
              >
                <span className="clue-num num">{e.num}</span>
                <span className="clue-text">{e.clue}</span>
                <span className="clue-len num" aria-label={`${e.answer.length} harf`}>
                  {e.answer.length}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    <aside className="clues" aria-label="İpuçları">
      {group('across', 'Yatay')}
      {group('down', 'Dikey')}
    </aside>
  );
}
