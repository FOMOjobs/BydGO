# 📚 Instrukcja Instalacji i Konfiguracji WordPress Backend

## 🎯 Przegląd

Ten dokument zawiera pełną instrukcję instalacji i konfiguracji **Headless WordPress** jako backendu dla aplikacji **BydGO! - Ścieżki Pamięci 2.0**.

---

## 📋 Wymagania

### Wymagania Serwerowe

- **PHP:** 7.4 lub wyższy (zalecane 8.0+)
- **MySQL:** 5.7+ lub **MariaDB:** 10.3+
- **WordPress:** 5.8 lub wyższy (zalecane najnowsza wersja)
- **HTTPS:** Wymagane dla REST API
- **mod_rewrite:** Włączony (dla pretty permalinks)

### Wymagane Wtyczki WordPress

1. **Advanced Custom Fields (ACF)** - wersja PRO lub darmowa
2. **ACF to REST API** - ekspozycja pól ACF przez REST API
3. **BydGO! Plugin** - nasza custom wtyczka (dostarczona)

---

## 🚀 Instalacja Krok po Kroku

### KROK 1: Instalacja WordPress

#### Opcja A: Instalacja na serwerze lokalnym (XAMPP/MAMP/Local)

1. Pobierz WordPress z [wordpress.org](https://wordpress.org/download/)
2. Rozpakuj do katalogu serwera (np. `htdocs/bydgo-cms`)
3. Utwórz bazę danych MySQL:
   ```sql
   CREATE DATABASE bydgo_wp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'bydgo_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON bydgo_wp.* TO 'bydgo_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
4. Przejdź do `http://localhost/bydgo-cms` i przeprowadź instalację WordPress
5. Zapisz dane dostępowe

#### Opcja B: Hosting (np. OVH, home.pl, Hostinger)

1. Zaloguj się do panelu hostingowego
2. Użyj instalatora automatycznego (np. Softaculous)
3. Wybierz WordPress i wypełnij formularz instalacji
4. Zapisz URL panelu administracyjnego (np. `https://bydgo.com.pl/wp-admin`)

---

### KROK 2: Instalacja Wymaganych Wtyczek

#### 2.1. Advanced Custom Fields (ACF)

**Opcja A: Instalacja z repozytorium WordPress (wersja darmowa)**
1. Panel WordPress → **Wtyczki** → **Dodaj nową**
2. Wyszukaj: "Advanced Custom Fields"
3. Kliknij **Zainstaluj** → **Aktywuj**

**Opcja B: Instalacja ACF PRO (zalecana)**
1. Zakup licencji na [advancedcustomfields.com](https://www.advancedcustomfields.com/pro/)
2. Pobierz plik `.zip`
3. Panel WordPress → **Wtyczki** → **Dodaj nową** → **Prześlij wtyczkę**
4. Wybierz plik `.zip` → **Zainstaluj** → **Aktywuj**

#### 2.2. ACF to REST API

1. Panel WordPress → **Wtyczki** → **Dodaj nową**
2. Wyszukaj: "ACF to REST API"
3. Kliknij **Zainstaluj** → **Aktywuj**

**Weryfikacja:**
- Przejdź do: `https://twoja-domena.pl/wp-json/acf/v3`
- Powinieneś zobaczyć odpowiedź JSON z informacjami o ACF

---

### KROK 3: Instalacja Wtyczki BydGO!

1. Skopiuj plik `bydgo-plugin.php` z folderu `wordpress-setup/`
2. **Metoda 1 - FTP/SFTP:**
   - Połącz się z serwerem przez FTP
   - Przejdź do: `/wp-content/plugins/`
   - Utwórz folder: `bydgo-plugin`
   - Wklej plik: `/wp-content/plugins/bydgo-plugin/bydgo-plugin.php`

3. **Metoda 2 - Panel WordPress:**
   - Spakuj `bydgo-plugin.php` do ZIP: `bydgo-plugin.zip`
   - Panel WordPress → **Wtyczki** → **Dodaj nową** → **Prześlij wtyczkę**
   - Wybierz `bydgo-plugin.zip` → **Zainstaluj**

4. **Aktywacja:**
   - Panel WordPress → **Wtyczki**
   - Znajdź "BydGO! - Gra Miejska"
   - Kliknij **Aktywuj**

**Weryfikacja:**
- Sprawdź czy w menu bocznym pojawił się nowy element: **"Wyzwania BydGO"** (z ikoną pinezki)
- Jeśli widzisz ostrzeżenie o brakujących wtyczkach, wróć do KROKU 2

---

### KROK 4: Konfiguracja Permalinków

**⚠️ KLUCZOWE dla działania REST API!**

1. Panel WordPress → **Ustawienia** → **Bezpośrednie odnośniki**
2. Wybierz: **Nazwa wpisu** (lub inny format z ładnymi URLami)
3. Kliknij **Zapisz zmiany**

**Weryfikacja:**
- Przejdź do: `https://twoja-domena.pl/wp-json/wp/v2/wyzwania`
- Powinieneś zobaczyć pustą tablicę `[]` (lub listę wyzwań jeśli już dodałeś)

---

### KROK 5: Testowanie REST API

#### Test 1: Podstawowy endpoint

```bash
curl https://twoja-domena.pl/wp-json/wp/v2/wyzwania
```

**Oczekiwany wynik:** `[]` lub lista wyzwań w formacie JSON

#### Test 2: Custom endpoint statystyk

```bash
curl https://twoja-domena.pl/wp-json/bydgo/v1/stats
```

**Oczekiwany wynik:**
```json
{
  "total_challenges": 0,
  "total_participants": 0,
  "city": "Bydgoszcz",
  "game_name": "BydGO! - Ścieżki Pamięci 2.0"
}
```

---

## 📝 Dodawanie Wyzwań

### Przez Panel WordPress

1. Panel WordPress → **Wyzwania BydGO** → **Dodaj nowe**
2. Wypełnij podstawowe pola:
   - **Tytuł:** Kod Enigmy
   - **Treść:** Znajdź ukryty kod na pomniku kryptologa Mariana Rejewskiego...
   - **Zdjęcie wyzwania:** Dodaj featured image lub zostaw puste (użyty zostanie fallback)

3. Przewiń w dół do sekcji **"Szczegóły Wyzwania"** i wypełnij pola ACF:

| Pole | Przykład | Wymagane |
|------|----------|----------|
| Nazwa Lokalizacji | Ławeczka Mariana Rejewskiego, Bydgoszcz | ✅ |
| Współrzędne GPS | 53.1235,18.0084 | ✅ |
| Poziom Trudności | Medium | ✅ |
| Punkty | 100 | ✅ |
| Tajny Kod | ENIGMA | ❌ |
| URL Obrazu | https://source.unsplash.com/800x600/?museum | ❌ |
| Kategoria | Kultura | ✅ |
| Wymagania | Smartfon z GPS<br>Chęć rozwiązywania zagadek | ❌ |
| Korzyści | Pieczątka w wirtualnym paszporcie<br>Poznanie historii | ❌ |
| Email Kontaktowy | gra@bydgo.bydgoszcz.pl | ❌ |
| Organizacja | Muzeum Okręgowe Bydgoszczy | ❌ |
| Maksymalna liczba uczestników | 100 | ❌ |
| Obecna liczba uczestników | 0 | ❌ |
| Szacowany czas | 1-2 godziny | ❌ |
| Data rozpoczęcia | 2024-10-01 | ❌ |
| Data zakończenia | 2025-12-31 | ❌ |
| Pilne? | Nie | ❌ |

4. Kliknij **Opublikuj**

### Przez REST API (programatycznie)

```bash
curl -X POST https://twoja-domena.pl/wp-json/wp/v2/wyzwania \
  -H "Content-Type: application/json" \
  -u admin:haslo \
  -d '{
    "title": "Kod Enigmy",
    "content": "Znajdź ukryty kod na pomniku kryptologa...",
    "status": "publish",
    "acf": {
      "location_name": "Ławeczka Mariana Rejewskiego, Bydgoszcz",
      "location_coords": "53.1235,18.0084",
      "difficulty": "medium",
      "points": 100,
      "category": "culture"
    }
  }'
```

---

## 🔌 Konfiguracja Aplikacji Frontend

### 1. Edycja pliku `.env`

Otwórz plik `.env` w projekcie React i dodaj:

```env
# WordPress Headless CMS Configuration
VITE_WP_API_URL="https://twoja-domena.pl/wp-json"
```

**Przykłady:**
- Localhost: `http://localhost/bydgo-cms/wp-json`
- Hosting: `https://cms.bydgo.pl/wp-json`

### 2. Restart serwera deweloperskiego

```bash
npm run dev
```

### 3. Weryfikacja połączenia

Otwórz konsolę przeglądarki (F12) i sprawdź logi:
- ✅ `Fetching challenges from WordPress: ...`
- ✅ `Fetched X challenges from WordPress`

Jeśli widzisz:
- ❌ `WordPress not configured, using local data` → Sprawdź plik `.env`
- ❌ `Error fetching from WordPress...` → Sprawdź URL API w `.env`

---

## 🔧 Rozwiązywanie Problemów

### Problem: 404 na endpoint `/wp-json/wp/v2/wyzwania`

**Rozwiązanie:**
1. Sprawdź permalinki: **Ustawienia** → **Bezpośrednie odnośniki** → **Nazwa wpisu**
2. Kliknij **Zapisz zmiany** (nawet jeśli nic nie zmieniłeś)
3. Wyczyść cache wtyczek (jeśli używasz cache)

### Problem: Pola ACF nie są widoczne w REST API

**Rozwiązanie:**
1. Upewnij się że wtyczka **ACF to REST API** jest aktywna
2. Sprawdź czy wtyczka BydGO! jest aktywowana
3. Test: `https://twoja-domena.pl/wp-json/acf/v3/wyzwania/1`

### Problem: CORS Error

**Rozwiązanie:**
Dodaj do `wp-config.php`:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

Lub zainstaluj wtyczkę: **"WP REST API - Allow All CORS"**

### Problem: Puste pola w response JSON

**Weryfikacja:**
```bash
curl "https://twoja-domena.pl/wp-json/wp/v2/wyzwania?acf_format=standard" | jq '.[] | .acf'
```

**Rozwiązanie:**
- Sprawdź czy wyzwanie ma wypełnione pola ACF
- Dodaj parametr `?acf_format=standard` do URL

---

## 📊 Import Przykładowych Danych

### Opcja 1: Ręcznie przez panel (zalecane dla pierwszych testów)

Użyj danych z pliku `src/data/volunteerData.ts` jako wzór.

### Opcja 2: Import przez WP-CLI (szybki import 16 wyzwań)

```bash
# Stwórz plik import.json z danymi z volunteerData.ts
# Następnie:
wp post create --post_type=wyzwania --post_title="Kod Enigmy" \
  --post_content="Znajdź ukryty kod..." \
  --post_status=publish \
  --meta_input='{"location_name":"Ławeczka Rejewskiego","location_coords":"53.1235,18.0084"}'
```

### Opcja 3: Skrypt PHP (dla zaawansowanych)

Stwórz plik `wordpress-setup/import-data.php`:

```php
<?php
// Plik do uruchomienia JEDNORAZOWO przez przeglądarkę: /import-data.php
// Importuje dane z volunteerData.ts

require_once('wp-load.php');

$challenges = [
  [
    'title' => 'Kod Enigmy',
    'content' => 'Znajdź ukryty kod na pomniku...',
    'acf' => [
      'location_name' => 'Ławeczka Mariana Rejewskiego, Bydgoszcz',
      'location_coords' => '53.1235,18.0084',
      'difficulty' => 'medium',
      'points' => 100,
      'category' => 'culture',
    ]
  ],
  // ... więcej wyzwań
];

foreach ($challenges as $challenge) {
  $post_id = wp_insert_post([
    'post_type' => 'wyzwania',
    'post_title' => $challenge['title'],
    'post_content' => $challenge['content'],
    'post_status' => 'publish',
  ]);

  foreach ($challenge['acf'] as $key => $value) {
    update_field($key, $value, $post_id);
  }
}

echo "Import completed!";
```

---

## 🔐 Zabezpieczenia

### 1. Ukryj WordPress Admin

Zainstaluj wtyczkę: **"WPS Hide Login"**

### 2. Ogranicz REST API tylko do odczytu (opcjonalnie)

Dodaj do `functions.php`:

```php
add_filter('rest_authentication_errors', function($result) {
  if (!is_user_logged_in() && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    return new WP_Error('rest_forbidden', 'Unauthorized', ['status' => 401]);
  }
  return $result;
});
```

### 3. Rate Limiting

Zainstaluj wtyczkę: **"WP REST API Controller"**

---

## 📚 Dodatkowe Zasoby

- **WordPress REST API Docs:** https://developer.wordpress.org/rest-api/
- **ACF Docs:** https://www.advancedcustomfields.com/resources/
- **BydGO! Repo:** https://github.com/FOMOjobs/BydGO

---

## 🆘 Pomoc Techniczna

Problemy z instalacją? Skontaktuj się:
- **Email:** dev@bydgo.bydgoszcz.pl
- **GitHub Issues:** https://github.com/FOMOjobs/BydGO/issues

---

**Wersja dokumentu:** 1.0.0
**Ostatnia aktualizacja:** 6 grudnia 2024
