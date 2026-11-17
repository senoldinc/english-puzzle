# Kelime Bulmaca (English Puzzle)

Türkçe ipuçlarıyla İngilizce kelime öğreten çengel bulmaca. Faz 1: backend yok, ilerleme tarayıcıda (`localStorage`) saklanır.

```bash
npm install
npm run dev     # geliştirme sunucusu
npm test        # bulmaca üretici testleri
npm run build   # üretim derlemesi (dist/)
```

- Kelimeler: `src/data/words.ts` (`ingilizce: Türkçe ipucu` satırları)
- Seviyeler: `src/data/levels.ts` (kelime sayısı, harf uzunluğu aralığı, havuz)
- Bulmaca üretici: `src/lib/generator.ts` (seed'li, deterministik)
