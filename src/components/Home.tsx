import { DIFFICULTIES, getCategoryTitle, getDifficulty, isAvailable, modeKey, type CategoryId, type Difficulty } from '../data/difficulty';
import { CATEGORIES } from '../data/words';
import type { Progress } from '../lib/progress';
import Icon from './Icon';

interface Props {
  progress: Progress;
  onChange: (difficulty: Difficulty, category: CategoryId) => void;
  onStart: () => void;
  onResume: () => void;
  onResetProgress: () => void;
}

export default function Home({ progress, onChange, onStart, onResume, onResetProgress }: Props) {
  const { difficulty, category, inProgress } = progress;
  const learned = Object.keys(progress.seen).length;
  const solvedHere = progress.modes[modeKey(difficulty, category)]?.solved ?? 0;
  const resumeHere = inProgress && inProgress.difficulty === difficulty && inProgress.category === category;
  const solvedInDifficulty = (d: Difficulty) =>
    Object.entries(progress.modes)
      .filter(([key]) => key.startsWith(`${d}:`))
      .reduce((sum, [, m]) => sum + m.solved, 0);

  const pickDifficulty = (d: Difficulty) => onChange(d, category && isAvailable(d, category) ? category : null);

  return (
    <div className="shell home">
      <header className="levels-head">
        <div className="levels-intro">
          <h1>Kelime Bulmaca</h1>
          <p className="lead">Türkçe ipuçlarına bak, İngilizce karşılıklarını bulmacaya yaz.</p>
        </div>
        <dl className="home-stats">
          <div>
            <dt>Yıldız</dt>
            <dd className="num">
              <Icon name="star" />
              {progress.totalStars}
            </dd>
          </div>
          <div>
            <dt>Bulmaca</dt>
            <dd className="num">{progress.totalSolved}</dd>
          </div>
          <div>
            <dt>Kelime</dt>
            <dd className="num">{learned}</dd>
          </div>
        </dl>
      </header>

      <section className="pick" aria-labelledby="pick-difficulty">
        <h2 id="pick-difficulty">Zorluk</h2>
        <div className="choice-grid" role="radiogroup" aria-labelledby="pick-difficulty">
          {DIFFICULTIES.map((d) => {
            const solved = solvedInDifficulty(d.id);
            return (
              <button
                type="button"
                role="radio"
                aria-checked={d.id === difficulty}
                key={d.id}
                className={`level-card ${d.id === difficulty ? 'current' : ''}`}
                onClick={() => pickDifficulty(d.id)}
              >
                <span className="level-id num">{d.id}</span>
                <span className="level-title">{d.title}</span>
                <span className="level-meta">
                  {d.wordCount} kelime, {d.minLen} ile {d.maxLen} harf
                </span>
                <span className="level-foot">
                  <span className="level-meta">{solved ? `${solved} bulmaca çözüldü` : 'Henüz çözülmedi'}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pick" aria-labelledby="pick-category">
        <h2 id="pick-category">Kategori</h2>
        <p className="pick-note">İsteğe bağlı. Seçmezsen bütün kategorilerden karışık kelimeler gelir.</p>
        <div className="pills" role="radiogroup" aria-labelledby="pick-category">
          {[null, ...CATEGORIES.map((c) => c.id)].map((id) => {
            const available = isAvailable(difficulty, id);
            return (
              <button
                type="button"
                role="radio"
                aria-checked={id === category}
                key={id ?? 'all'}
                className="pill"
                disabled={!available}
                title={available ? undefined : `${getDifficulty(difficulty).title} zorlukta bu kategoride yeterli kelime yok`}
                onClick={() => onChange(difficulty, id)}
              >
                {id ? getCategoryTitle(id) : 'Hepsi karışık'}
              </button>
            );
          })}
        </div>
      </section>

      <section className="start-bar" aria-label="Başla">
        <div className="start-text">
          <p className="start-mode">
            {getDifficulty(difficulty).title}, {getCategoryTitle(category)}
          </p>
          <p className="level-meta">
            {solvedHere ? `Bu seçimde ${solvedHere} bulmaca çözdün` : 'Bu seçimde ilk bulmacan olacak'}
          </p>
        </div>
        <div className="start-actions">
          {inProgress && !resumeHere && (
            <button type="button" className="btn-text" onClick={onResume}>
              Yarım kalan bulmacaya dön ({getDifficulty(inProgress.difficulty).title}, {getCategoryTitle(inProgress.category)})
            </button>
          )}
          <button type="button" className="btn btn-primary btn-start" onClick={resumeHere ? onResume : onStart}>
            {resumeHere ? 'Devam et' : 'Bulmacaya başla'}
          </button>
        </div>
      </section>

      <footer className="levels-foot">
        <button
          type="button"
          className="btn-text"
          onClick={() => {
            if (confirm('Tüm ilerleme silinsin mi?')) onResetProgress();
          }}
        >
          İlerlemeyi sıfırla
        </button>
      </footer>
    </div>
  );
}
