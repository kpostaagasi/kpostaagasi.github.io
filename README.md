# kpostaagasi.github.io

**[Siteyi aç](https://kpostaagasi.github.io/)**

Tek sayfalık kişisel CV / landing sitesi. Bağımlılık yok, build adımı yok: `index.html`, `style.css`, `script.js` ve iki içerik dosyası.

```
index.html        iskelet + meta/OG etiketleri
style.css         tüm stiller (açık/koyu tema, mobil, print)
script.js         JSON'u okuyup sayfayı render eder, "Devamı" toggle'ı
content-tr.json   Türkçe içerik
content-en.json   İngilizce içerik
```

Dil `?lang=tr` / `?lang=en` ile seçilir. Parametre yoksa Türkçe açılır. localStorage veya çerez kullanılmaz.

## İçeriği güncelleme

Tüm metin `content-tr.json` ve `content-en.json` içinde. HTML'e dokunmana gerek yok.

**Bir satır (deneyim, eğitim, proje, sertifika…) eklemek:** ilgili bölümün `items` dizisine bir nesne ekle.

```json
{
  "title": "Kurum veya başlık",
  "subtitle": "Tek satırlık açıklama (opsiyonel)",
  "date": "Eyl 2026 – Halen",
  "href": "https://... (opsiyonel, başlığı linke çevirir)"
}
```

- `title` zorunlu. `subtitle`, `date`, `href` opsiyonel — yazmazsan o parça basılmaz.
- Sıralama JSON'daki sıradır; en yeni kayıt en üste.
- **Boş bölüm otomatik gizlenir.** `Yazılar` / `Writing` bölümü şu an `"items": []` olduğu için sayfada görünmüyor; içine bir kayıt ekleyince kendiliğinden çıkar.
- Bölüm başlığını değiştirmek için `heading`, bölüm sırasını değiştirmek için `sections` dizisindeki sırayı düzenle.
- Giriş paragrafı `intro`, "Devamı" ile açılan uzun bio `bio` dizisi (her eleman bir paragraf).
- Üstteki bağlantılar (LinkedIn / GitHub / E-posta) `links` dizisinde. CV PDF eklemek istersen: dosyayı repo köküne koy ve `links` dizisine `{ "label": "CV", "href": "cv.pdf" }` ekle.
- `meta.description` sayfanın arama motoru ve paylaşım açıklamasıdır; değiştirirsen `index.html` içindeki statik `<meta name="description">` ve `og:description` değerlerini de aynı yap (ilk yükleme ve JS kapalıyken bunlar kullanılır).

İki dili birlikte güncelle — dosyaların yapısı birebir aynıdır.

Kaydettikten sonra JSON'un bozulmadığını doğrula:

```bash
jq -e . content-tr.json content-en.json
```

## Yerelde çalıştırma

İçerik `fetch` ile yüklendiği için dosyayı çift tıklayıp `file://` olarak açmak **çalışmaz**. Basit bir sunucu yeterli:

```bash
python3 -m http.server 4173
# http://localhost:4173/?lang=tr
# http://localhost:4173/?lang=en
```

Koyu tema, sistem ayarına bağlıdır (`prefers-color-scheme`). Print çıktısını denemek için tarayıcıda Cmd+P — uzun bio, gizli olsa bile baskıda açılır; dil seçici ve "Devamı" butonu basılmaz.

## Vercel'e deploy

Statik site, framework yok.

1. [vercel.com/new](https://vercel.com/new) → repoyu içe aktar.
2. **Framework Preset:** `Other`. **Build Command:** boş bırak. **Output Directory:** `.` (repo kökü). **Install Command:** boş bırak.
3. Deploy.

CLI ile:

```bash
npx vercel        # önizleme
npx vercel --prod # canlı
```

Sonrasında `main` dalına her push otomatik deploy olur. Özel alan adı bağlarsan `index.html` içindeki `canonical`, `hreflang` ve `og:url` adreslerini yeni alan adıyla güncelle.

GitHub Pages de aynı dosyalarla çalışır (repo adı `kpostaagasi.github.io` olduğu için Settings → Pages → Deploy from branch: `main` / `root` yeterli).
