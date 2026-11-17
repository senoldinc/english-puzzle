const TURKISH_MAP: Record<string, string> = { ı: 'I', i: 'I', İ: 'I' };

/** Klavyeden gelen tek karakteri A–Z büyük harfe çevirir; geçersizse null. */
export function normalizeLetter(ch: string): string | null {
  const up = (TURKISH_MAP[ch] ?? ch).toUpperCase();
  return /^[A-Z]$/.test(up) ? up : null;
}
