interface Props {
  onCheck: () => void;
  onRevealLetter: () => void;
  onRevealWord: () => void;
  onReset: () => void;
  onNewPuzzle: () => void;
  disabled: boolean;
}

export default function Toolbar({ onCheck, onRevealLetter, onRevealWord, onReset, onNewPuzzle, disabled }: Props) {
  const noBlur = (e: React.MouseEvent) => e.preventDefault();
  return (
    <div className="toolbar" onMouseDown={noBlur}>
      <div className="toolbar-main">
        <button type="button" className="btn btn-primary" onClick={onCheck} disabled={disabled} title="Yanlış harfleri göster (1 yardım)">
          Kontrol et
        </button>
        <button type="button" className="btn" onClick={onRevealLetter} disabled={disabled} title="Seçili harfi aç (1 yardım)">
          Harf aç
        </button>
        <button type="button" className="btn" onClick={onRevealWord} disabled={disabled} title="Seçili kelimeyi aç (1 yardım)">
          Kelimeyi göster
        </button>
      </div>
      <div className="toolbar-quiet">
        <button type="button" className="btn-text" onClick={onReset} disabled={disabled}>
          Temizle
        </button>
        <button type="button" className="btn-text" onClick={onNewPuzzle} disabled={disabled}>
          Yeni bulmaca
        </button>
      </div>
    </div>
  );
}
