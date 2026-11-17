export interface Word {
  en: string;
  tr: string;
}

export interface Category {
  id: string;
  title: string;
  words: Word[];
}

/** Kısa yazım: "ingilizce: Türkçe ipucu" satırları → Word[] */
function parse(list: string): Word[] {
  return list
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(':');
      return { en: line.slice(0, i).trim().toUpperCase(), tr: line.slice(i + 1).trim() };
    });
}

// Aynı Türkçe ipucu iki farklı İngilizce kelimeye gidecekse parantezle ayırt edilir
// (ör. "Ay (gökyüzündeki)" / "Ay (takvim)"). Test bunu denetler.
export const CATEGORIES: Category[] = [
  {
    id: 'basics',
    title: 'Temel kelimeler',
    words: parse(`
      cat: Kedi
      dog: Köpek
      sun: Güneş
      red: Kırmızı
      car: Araba
      egg: Yumurta
      bus: Otobüs
      cup: Fincan
      hat: Şapka
      pen: Tükenmez kalem
      bed: Yatak
      box: Kutu
      map: Harita
      key: Anahtar
      sea: Deniz
      eye: Göz
      ear: Kulak
      arm: Kol
      leg: Bacak
      bag: Çanta
      tea: Çay
      ice: Buz
      toy: Oyuncak
      cow: İnek
      man: Adam
      six: Altı
      ten: On (sayı)
      two: İki
      one: Bir (sayı)
      yes: Evet
      book: Kitap
      milk: Süt
      ball: Top
      ring: Yüzük
      bell: Zil
      gift: Hediye
      name: İsim
      word: Kelime
      game: Oyun
      idea: Fikir
      life: Hayat
      love: Aşk
      money: Para
      phone: Telefon
      paper: Kâğıt
      music: Müzik
      dream: Rüya
      story: Hikâye
      voice: Ses
      secret: Sır
      letter: Mektup
      picture: Resim
    `),
  },
  {
    id: 'animals',
    title: 'Hayvanlar',
    words: parse(`
      fish: Balık
      bird: Kuş
      lion: Aslan
      bear: Ayı
      frog: Kurbağa
      duck: Ördek
      goat: Keçi
      wolf: Kurt
      horse: At
      sheep: Koyun
      mouse: Fare
      snake: Yılan
      tiger: Kaplan
      camel: Deve
      eagle: Kartal
      shark: Köpekbalığı
      whale: Balina
      bee: Arı
      ant: Karınca
      owl: Baykuş
      fox: Tilki
      pig: Domuz
      bat: Yarasa
      fly: Sinek
      lamb: Kuzu
      deer: Geyik
      crab: Yengeç
      worm: Solucan
      crow: Karga
      rabbit: Tavşan
      donkey: Eşek
      monkey: Maymun
      turtle: Kaplumbağa
      parrot: Papağan
      spider: Örümcek
      insect: Böcek
      kitten: Yavru kedi
      puppy: Yavru köpek
      pigeon: Güvercin
      giraffe: Zürafa
      dolphin: Yunus
      penguin: Penguen
      elephant: Fil
      squirrel: Sincap
      butterfly: Kelebek
    `),
  },
  {
    id: 'colorsNumbers',
    title: 'Renkler ve sayılar',
    words: parse(`
      blue: Mavi
      green: Yeşil
      black: Siyah
      white: Beyaz
      pink: Pembe
      brown: Kahverengi
      gray: Gri
      yellow: Sarı
      orange: Turuncu
      purple: Mor
      gold: Altın
      silver: Gümüş
      dark: Koyu (renk)
      color: Renk
      three: Üç
      four: Dört
      five: Beş
      seven: Yedi
      eight: Sekiz
      nine: Dokuz
      zero: Sıfır
      half: Yarım
      twenty: Yirmi
      fifty: Elli
      sixty: Altmış
      seventy: Yetmiş
      eighty: Seksen
      ninety: Doksan
      hundred: Yüz (sayı)
      thousand: Bin
      million: Milyon
      eleven: On bir
      twelve: On iki
      thirty: Otuz
      forty: Kırk
      first: Birinci
      third: Üçüncü
      number: Sayı
    `),
  },
  {
    id: 'family',
    title: 'Aile ve insanlar',
    words: parse(`
      mom: Anne (gündelik dil)
      dad: Baba (gündelik dil)
      mother: Anne
      father: Baba
      sister: Kız kardeş
      brother: Erkek kardeş
      baby: Bebek
      uncle: Amca / Dayı
      aunt: Teyze / Hala
      son: Oğul
      boy: Erkek çocuk
      kid: Çocuk (gündelik dil)
      twin: İkiz
      king: Kral
      daughter: Kız evlat
      wife: Karı, eş (kadın)
      husband: Koca, eş (erkek)
      friend: Arkadaş
      family: Aile
      child: Çocuk
      woman: Kadın
      girl: Kız
      bride: Gelin
      groom: Damat
      guest: Misafir
      adult: Yetişkin
      queen: Kraliçe
      prince: Prens
      couple: Çift
      cousin: Kuzen
      nephew: Yeğen (erkek)
      niece: Yeğen (kız)
      neighbor: Komşu
      teacher: Öğretmen
      student: Öğrenci
      people: İnsanlar
      parents: Ebeveynler
      relative: Akraba
      stranger: Yabancı
      grandmother: Büyükanne
      grandfather: Büyükbaba
    `),
  },
  {
    id: 'food',
    title: 'Yiyecek ve içecek',
    words: parse(`
      pie: Turta
      jam: Reçel
      oil: Yağ
      bread: Ekmek
      water: Su
      apple: Elma
      pear: Armut
      corn: Mısır
      bean: Fasulye
      flour: Un
      peach: Şeftali
      melon: Kavun
      cheese: Peynir
      butter: Tereyağı
      honey: Bal
      rice: Pirinç
      soup: Çorba
      meat: Et
      salt: Tuz
      sugar: Şeker
      juice: Meyve suyu
      salad: Salata
      lunch: Öğle yemeği
      coffee: Kahve
      banana: Muz
      lemon: Limon
      grape: Üzüm
      cherry: Kiraz
      potato: Patates
      tomato: Domates
      onion: Soğan
      carrot: Havuç
      garlic: Sarımsak
      yogurt: Yoğurt
      dinner: Akşam yemeği
      walnut: Ceviz
      chicken: Tavuk
      dessert: Tatlı (yemek sonrası)
      lettuce: Marul
      cake: Pasta
      olive: Zeytin
      pepper: Biber
      fork: Çatal
      spoon: Kaşık
      knife: Bıçak
      cucumber: Salatalık
      mushroom: Mantar
      sandwich: Sandviç
      breakfast: Kahvaltı
      strawberry: Çilek
      watermelon: Karpuz
    `),
  },
  {
    id: 'home',
    title: 'Ev ve eşyalar',
    words: parse(`
      pan: Tava
      pot: Tencere
      house: Ev
      room: Oda
      sink: Lavabo
      bowl: Kase
      desk: Çalışma masası
      kitchen: Mutfak
      window: Pencere
      table: Masa
      chair: Sandalye
      mirror: Ayna
      clock: Duvar saati
      lamp: Lamba
      carpet: Halı
      pillow: Yastık
      blanket: Battaniye
      garden: Bahçe
      roof: Çatı
      wall: Duvar
      fence: Çit
      gate: Bahçe kapısı
      shelf: Raf
      stairs: Merdiven
      bathroom: Banyo
      sofa: Kanepe
      towel: Havlu
      soap: Sabun
      door: Kapı
      fridge: Buzdolabı
      oven: Fırın (mutfak)
      plate: Tabak
      glass: Bardak
      bottle: Şişe
      candle: Mum
      broom: Süpürge
      bucket: Kova
      shower: Duş
      toilet: Tuvalet
      drawer: Çekmece
      garage: Garaj
      curtain: Perde
      ceiling: Tavan
      balcony: Balkon
      hallway: Koridor
      basement: Bodrum
    `),
  },
  {
    id: 'body',
    title: 'Vücut ve sağlık',
    words: parse(`
      lip: Dudak
      toe: Ayak parmağı
      hip: Kalça
      head: Baş, kafa
      hair: Saç
      face: Yüz (surat)
      chin: Çene
      nail: Tırnak
      lung: Akciğer
      mouth: Ağız
      tooth: Diş
      tongue: Dil (organ)
      neck: Boyun
      cheek: Yanak
      wrist: Bilek
      ankle: Ayak bileği
      thumb: Başparmak
      shoulder: Omuz
      finger: Parmak
      knee: Diz
      foot: Ayak
      heart: Kalp
      blood: Kan
      bone: Kemik
      skin: Deri, cilt
      stomach: Mide
      back: Sırt
      chest: Göğüs
      elbow: Dirsek
      brain: Beyin
      muscle: Kas
      throat: Boğaz
      eyebrow: Kaş
      sick: Hasta
      pain: Ağrı
      fever: Ateş (hastalık)
      cough: Öksürük
      injury: Yaralanma
      healthy: Sağlıklı
      headache: Baş ağrısı
      medicine: İlaç
      hospital: Hastane
      health: Sağlık
      nurse: Hemşire
    `),
  },
  {
    id: 'verbs',
    title: 'Fiiller',
    words: parse(`
      run: Koşmak
      see: Görmek
      say: Söylemek
      ask: Sormak
      pay: Ödemek
      sit: Oturmak
      win: Kazanmak
      eat: Yemek yemek
      walk: Yürümek
      play: Oynamak
      work: Çalışmak
      jump: Zıplamak
      find: Bulmak
      hide: Saklanmak
      lose: Kaybetmek
      send: Göndermek
      draw: Resim çizmek
      drink: İçmek
      sleep: Uyumak
      read: Okumak
      write: Yazmak
      swim: Yüzmek
      sing: Şarkı söylemek
      dance: Dans etmek
      open: Açmak
      close: Kapatmak
      buy: Satın almak
      sell: Satmak
      give: Vermek
      come: Gelmek
      stand: Ayakta durmak
      start: Başlamak
      carry: Taşımak
      climb: Tırmanmak
      throw: Fırlatmak
      catch: Yakalamak
      build: İnşa etmek
      break: Kırmak
      teach: Öğretmek
      drive: Araba sürmek
      leave: Ayrılmak
      arrive: Varmak
      choose: Seçmek
      finish: Bitirmek
      borrow: Ödünç almak
      listen: Dinlemek
      speak: Konuşmak
      think: Düşünmek
      learn: Öğrenmek
      forget: Unutmak
      believe: İnanmak
      explain: Açıklamak
      remember: Hatırlamak
      understand: Anlamak
      laugh: Gülmek
      cry: Ağlamak
      wait: Beklemek
      help: Yardım etmek
      cook: Yemek pişirmek
      clean: Temizlemek
      travel: Seyahat etmek
    `),
  },
  {
    id: 'nature',
    title: 'Doğa ve hava',
    words: parse(`
      sky: Gökyüzü
      fog: Sis
      air: Hava (soluduğumuz)
      tree: Ağaç
      hill: Tepe
      sand: Kum
      rock: Kaya
      wave: Dalga
      fire: Ateş (alev)
      root: Kök
      seed: Tohum
      cave: Mağara
      soil: Toprak
      flower: Çiçek
      river: Nehir
      mountain: Dağ
      forest: Orman
      cloud: Bulut
      snow: Kar
      wind: Rüzgâr
      storm: Fırtına
      rain: Yağmur
      island: Ada
      lake: Göl
      desert: Çöl
      beach: Plaj, kumsal
      stone: Taş
      grass: Çimen
      leaf: Yaprak
      field: Tarla
      ocean: Okyanus
      valley: Vadi
      branch: Dal
      planet: Gezegen
      star: Yıldız
      moon: Ay (gökyüzündeki)
      earth: Dünya (gezegen)
      summer: Yaz
      winter: Kış
      spring: İlkbahar
      autumn: Sonbahar
      sunset: Gün batımı
      volcano: Yanardağ
      thunder: Gök gürültüsü
      rainbow: Gökkuşağı
      lightning: Şimşek
      waterfall: Şelale
    `),
  },
  {
    id: 'adjectives',
    title: 'Sıfatlar',
    words: parse(`
      big: Büyük
      new: Yeni
      old: Yaşlı
      hot: Sıcak
      bad: Kötü
      sad: Üzgün
      wet: Islak
      dry: Kuru
      good: İyi
      cold: Soğuk
      fast: Hızlı
      slow: Yavaş
      tall: Uzun boylu
      kind: Nazik
      busy: Meşgul
      soft: Yumuşak
      hard: Sert
      loud: Yüksek sesli
      same: Aynı
      short: Kısa
      small: Küçük
      funny: Komik
      sweet: Tatlı (tadı)
      happy: Mutlu
      angry: Kızgın
      tired: Yorgun
      hungry: Aç (karnı aç)
      thirsty: Susamış
      beautiful: Güzel
      ugly: Çirkin
      strong: Güçlü
      weak: Zayıf, güçsüz
      young: Genç
      rich: Zengin
      poor: Fakir
      cheap: Ucuz
      expensive: Pahalı
      dirty: Kirli
      empty: Boş
      full: Dolu
      heavy: Ağır
      quiet: Sessiz
      noisy: Gürültülü
      brave: Cesur
      lazy: Tembel
      clever: Zeki
      bitter: Acı (tadı)
      polite: Kibar
      honest: Dürüst
      famous: Ünlü
      correct: Doğru
      careful: Dikkatli
      different: Farklı
      dangerous: Tehlikeli
      difficult: Zor
      easy: Kolay
      early: Erken
      late: Geç
    `),
  },
  {
    id: 'clothes',
    title: 'Giysiler',
    words: parse(`
      hat: Şapka
      bag: Çanta
      ring: Yüzük
      vest: Yelek
      suit: Takım elbise
      hood: Kapüşon
      jeans: Kot pantolon
      shorts: Şort
      sleeve: Kol (giysi)
      zipper: Fermuar
      pajamas: Pijama
      tie: Kravat
      cap: Kasket
      sock: Çorap
      boot: Çizme
      belt: Kemer
      coat: Palto
      shoe: Ayakkabı
      dress: Elbise
      skirt: Etek
      shirt: Gömlek
      glove: Eldiven
      scarf: Atkı
      watch: Kol saati
      jacket: Ceket
      pocket: Cep
      button: Düğme
      wallet: Cüzdan
      sweater: Kazak
      earring: Küpe
      glasses: Gözlük
      trousers: Pantolon
      necklace: Kolye
      umbrella: Şemsiye
      bracelet: Bilezik
      slippers: Terlik
    `),
  },
  {
    id: 'time',
    title: 'Zaman',
    words: parse(`
      age: Yaş
      now: Şimdi
      soon: Yakında
      past: Geçmiş
      time: Zaman
      date: Tarih (takvim)
      day: Gün
      may: Mayıs
      week: Hafta
      year: Yıl
      hour: Saat (süre)
      noon: Öğle
      june: Haziran
      july: Temmuz
      month: Ay (takvim)
      night: Gece
      today: Bugün
      march: Mart
      april: Nisan
      minute: Dakika
      second: Saniye
      friday: Cuma
      sunday: Pazar (gün)
      monday: Pazartesi
      morning: Sabah
      evening: Akşam
      tuesday: Salı
      century: Yüzyıl
      holiday: Tatil
      weekend: Hafta sonu
      tomorrow: Yarın
      thursday: Perşembe
      saturday: Cumartesi
      birthday: Doğum günü
      yesterday: Dün
      wednesday: Çarşamba
      january: Ocak
      february: Şubat
      august: Ağustos
      october: Ekim
      november: Kasım
      december: Aralık
      september: Eylül
    `),
  },
  {
    id: 'transport',
    title: 'Ulaşım ve seyahat',
    words: parse(`
      car: Araba
      bus: Otobüs
      map: Harita
      van: Minibüs
      tram: Tramvay
      ship: Gemi
      boat: Tekne
      bike: Bisiklet
      taxi: Taksi
      road: Yol
      seat: Koltuk
      trip: Gezi
      fuel: Yakıt
      train: Tren
      plane: Uçak
      truck: Kamyon
      wheel: Tekerlek
      speed: Hız
      ticket: Bilet
      engine: Motor
      tunnel: Tünel
      subway: Metro
      flight: Uçuş
      traffic: Trafik
      luggage: Bagaj
      journey: Yolculuk
      accident: Kaza
      passport: Pasaport
      suitcase: Bavul
      motorcycle: Motosiklet
      helicopter: Helikopter
    `),
  },
  {
    id: 'school',
    title: 'Okul',
    words: parse(`
      art: Resim dersi
      map: Harita
      pen: Tükenmez kalem
      book: Kitap
      math: Matematik
      quiz: Kısa sınav
      team: Takım
      note: Not (kısa yazı)
      paper: Kâğıt
      answer: Cevap
      mistake: Hata
      teacher: Öğretmen
      student: Öğrenci
      question: Soru
      history: Tarih
      science: Bilim
      uniform: Okul forması
      page: Sayfa
      exam: Sınav
      glue: Yapıştırıcı
      class: Sınıf
      grade: Not (puan)
      chalk: Tebeşir
      board: Tahta (yazı tahtası)
      ruler: Cetvel
      lesson: Ders
      pencil: Kurşun kalem
      eraser: Silgi
      school: Okul
      library: Kütüphane
      spelling: Yazım
      sentence: Cümle
      homework: Ödev
      notebook: Defter
      scissors: Makas
      geography: Coğrafya
      dictionary: Sözlük
    `),
  },
  {
    id: 'jobsCity',
    title: 'Meslekler ve şehir',
    words: parse(`
      zoo: Hayvanat bahçesi
      spy: Casus
      boss: Patron
      mall: Alışveriş merkezi
      guard: Bekçi
      pilot: Pilot
      hotel: Otel
      nurse: Hemşire
      doctor: Doktor
      shop: Dükkân
      town: Kasaba
      city: Şehir
      bank: Banka
      judge: Hakim
      baker: Fırıncı
      tower: Kule
      tailor: Terzi
      barber: Berber
      butcher: Kasap
      worker: İşçi
      corner: Köşe
      square: Meydan
      castle: Kale
      harbor: Liman
      palace: Saray
      mosque: Cami
      theater: Tiyatro
      manager: Müdür
      postman: Postacı
      engineer: Mühendis
      lawyer: Avukat
      farmer: Çiftçi
      driver: Sürücü, şoför
      soldier: Asker
      waiter: Garson
      chef: Aşçı
      dentist: Diş hekimi
      artist: Sanatçı
      writer: Yazar
      singer: Şarkıcı
      bridge: Köprü
      street: Sokak
      market: Pazar (alışveriş yeri)
      airport: Havalimanı
      museum: Müze
      village: Köy
      country: Ülke
      factory: Fabrika
      pharmacy: Eczane
      bakery: Fırın (ekmek dükkânı)
      prison: Hapishane
      church: Kilise
      fisherman: Balıkçı
      scientist: Bilim insanı
      firefighter: İtfaiyeci
    `),
  },
  {
    id: 'abstract',
    title: 'Soyut kavramlar',
    words: parse(`
      war: Savaş
      law: Kanun
      luck: Şans
      fear: Korku
      hope: Umut
      goal: Hedef
      rule: Kural
      peace: Barış
      truth: Gerçek
      power: Güç
      anger: Öfke
      trust: Güven
      habit: Alışkanlık
      reason: Sebep
      result: Sonuç
      choice: Seçim
      change: Değişim
      effort: Çaba
      advice: Tavsiye
      wisdom: Bilgelik
      danger: Tehlike
      respect: Saygı
      silence: Sessizlik
      kindness: İyilik
      attention: Dikkat
      difference: Fark
      freedom: Özgürlük
      knowledge: Bilgi
      friendship: Arkadaşlık
      happiness: Mutluluk
      decision: Karar
      experience: Deneyim
      opportunity: Fırsat
      government: Hükümet
      education: Eğitim
      environment: Çevre
      important: Önemli
      necessary: Gerekli
      possible: Mümkün
      language: Dil (lisan)
      history: Tarih
      science: Bilim
      question: Soru
      answer: Cevap
      solution: Çözüm
      success: Başarı
      future: Gelecek
      mistake: Hata
      promise: Söz (vaat)
      adventure: Macera
      courage: Cesaret
      patience: Sabır
      imagination: Hayal gücü
      agreement: Anlaşma
      beginning: Başlangıç
    `),
  },
];
