import { useEffect, useRef } from 'react';
import type { Entry } from '../lib/generator';
import { Stars } from './Icon';

interface Props {
  /** ör. "Orta, Hayvanlar" */
  title: string;
  /** Bu seçimde bu bulmaca dahil çözülen sayı */
  solvedInMode: number;
  stars: number;
  hints: number;
  entries: Entry[];
  onNext: () => void;
  onBack: () => void;
}

export default function LevelComplete({ title, solvedInMode, stars, hints, entries, onNext, onBack }: Props) {
  const words = [...entries].sort((a, b) => a.answer.localeCompare(b.answer));
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => nextRef.current?.focus(), []);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <div className="modal">
        <div className="modal-head">
          <h2 id="complete-title">Tebrikler!</h2>
          <p className="muted">
            {title} seçiminde {solvedInMode}. bulmacayı çözdün
          </p>
          <div className="modal-stars">
            <Stars count={stars} />
          </div>
          <p className="muted small">
            {hints === 0 ? 'Hiç yardım almadan çözdün!' : `${hints} yardım kullandın`}
          </p>
        </div>

        <h3>Öğrendiğin kelimeler</h3>
        <dl className="word-list">
          {words.map((e) => (
            <div key={`${e.dir}-${e.num}`}>
              <dt lang="en">{e.answer.toLowerCase()}</dt>
              <dd>{e.clue}</dd>
            </div>
          ))}
        </dl>

        <div className="modal-actions">
          <button type="button" ref={nextRef} className="btn btn-primary" onClick={onNext}>
            Sonraki bulmaca
          </button>
          <button type="button" className="btn-text" onClick={onBack}>
            Zorluğu ya da kategoriyi değiştir
          </button>
        </div>
      </div>
    </div>
  );
}
