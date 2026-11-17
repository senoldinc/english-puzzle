import { useCallback, useMemo, useRef, useState } from 'react';
import { getCategoryTitle, getDifficulty, modeKey, poolFor, type CategoryId, type Difficulty } from './data/difficulty';
import Game, { type BoardState } from './components/Game';
import Home from './components/Home';
import { DEFAULT_PROGRESS, loadProgress, saveProgress, starsFor, type InProgress, type Progress } from './lib/progress';
import { pickCandidates, randomSeed, wordsFor } from './lib/session';

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  /** Ekrandaki bulmaca; bitince de tebrik penceresi için açık kalır */
  const [session, setSession] = useState<InProgress | null>(null);

  // Ref ile güncel ilerleme tutulur; böylece localStorage'a anında (senkron) yazılır.
  const progressRef = useRef(progress);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(progressRef.current);
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  /** Seçili zorluk ve kategoride yeni bir bulmaca kurar ve onu yarım kalan bulmaca olarak kaydeder */
  const startNew = useCallback(() => {
    update((p) => {
      const d = getDifficulty(p.difficulty);
      const seed = randomSeed();
      const candidates = pickCandidates(poolFor(p.difficulty, p.category), p.seen, d.wordCount, seed);
      const inProgress: InProgress = {
        difficulty: p.difficulty,
        category: p.category,
        seed,
        candidates,
        letters: {},
        revealed: {},
        hints: 0,
      };
      setSession(inProgress);
      return { ...p, inProgress };
    });
  }, [update]);

  const resume = () => {
    const ip = progressRef.current.inProgress;
    if (!ip) return startNew();
    update((p) => ({ ...p, difficulty: ip.difficulty, category: ip.category }));
    setSession(ip);
  };

  const ip = session;
  const words = useMemo(
    () => (ip ? wordsFor(poolFor(ip.difficulty, ip.category), ip.candidates) : []),
    [ip],
  );

  if (ip) {
    const key = modeKey(ip.difficulty, ip.category);
    const solvedInMode = progress.modes[key]?.solved ?? 0;
    return (
      <Game
        key={ip.seed}
        words={words}
        wordCount={getDifficulty(ip.difficulty).wordCount}
        seed={ip.seed}
        title={`${getDifficulty(ip.difficulty).title}, ${getCategoryTitle(ip.category)}`}
        solvedInMode={solvedInMode}
        saved={ip}
        onSave={(state: BoardState) =>
          update((p) => (p.inProgress ? { ...p, inProgress: { ...p.inProgress, ...state } } : p))
        }
        onComplete={(hints, answers) =>
          update((p) => {
            const stars = starsFor(hints);
            const m = p.modes[key] ?? { solved: 0, stars: 0 };
            const seen = { ...p.seen };
            for (const a of answers) seen[a] = (seen[a] ?? 0) + 1;
            return {
              ...p,
              totalSolved: p.totalSolved + 1,
              totalStars: p.totalStars + stars,
              modes: { ...p.modes, [key]: { solved: m.solved + 1, stars: m.stars + stars } },
              seen,
              inProgress: undefined,
            };
          })
        }
        onBack={() => setSession(null)}
        onNewPuzzle={startNew}
        onNext={startNew}
      />
    );
  }

  return (
    <Home
      progress={progress}
      onChange={(difficulty: Difficulty, category: CategoryId) => update((p) => ({ ...p, difficulty, category }))}
      onStart={startNew}
      onResume={resume}
      onResetProgress={() => update(() => ({ ...DEFAULT_PROGRESS }))}
    />
  );
}
