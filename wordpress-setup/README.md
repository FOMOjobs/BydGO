# 🔌 BydGO! WordPress Plugin

Custom WordPress plugin dla gry miejskiej **BydGO! - Ścieżki Pamięci 2.0**.

## 🚀 Szybki Start

### 1. Instalacja wtyczki

**Metoda A - FTP/SFTP:**
```bash
# Skopiuj ten folder do:
/wp-content/plugins/bydgo-plugin/
```

**Metoda B - ZIP:**
```bash
# Spakuj folder do ZIP
zip -r bydgo-plugin.zip .

# Następnie prześlij przez panel WordPress:
# Wtyczki → Dodaj nową → Prześlij wtyczkę
```

### 2. Wymagane wtyczki

Przed aktywacją zainstaluj:
1. **Advanced Custom Fields** (ACF)
2. **ACF to REST API**

### 3. Aktywacja

```
Panel WordPress → Wtyczki → BydGO! - Gra Miejska → Aktywuj
```

### 4. Weryfikacja

Sprawdź czy działa REST API:
```bash
curl https://twoja-domena.pl/wp-json/wp/v2/wyzwania
```

---

## 📋 Co robi ta wtyczka?

### ✅ Rejestruje Custom Post Type: `wyzwania`

- Endpoint REST API: `/wp-json/wp/v2/wyzwania`
- Wspiera featured images
- Wspiera kategoryzację
- Pełna integracja z REST API

### ✅ Dodaje pola ACF (programatycznie)

**Główne pola:**
- `location_name` - Nazwa lokalizacji
- `location_coords` - GPS (format: lat,lng)
- `difficulty` - Poziom trudności (easy/medium/hard)
- `points` - Punkty za ukończenie
- `secret_code` - Kod weryfikacyjny
- `category` - Kategoria wyzwania
- `image_url` - URL obrazu (opcjonalnie)

**Pola dodatkowe:**
- `requirements` - Lista wymagań (textarea)
- `benefits` - Lista korzyści (textarea)
- `contact_email` - Email kontaktowy
- `organization` - Nazwa organizacji
- `max_volunteers` - Limit uczestników
- `current_volunteers` - Liczba uczestników
- `time_commitment` - Szacowany czas
- `date_start` - Data rozpoczęcia
- `date_end` - Data zakończenia
- `is_urgent` - Priorytet (checkbox)

### ✅ Custom Endpoints

**Statystyki gry:**
```
GET /wp-json/bydgo/v1/stats
```

Response:
```json
{
  "total_challenges": 16,
  "total_participants": 425,
  "city": "Bydgoszcz",
  "game_name": "BydGO! - Ścieżki Pamięci 2.0"
}
```

---

## 📝 Przykład użycia

### Tworzenie wyzwania przez REST API

```bash
curl -X POST https://twoja-domena.pl/wp-json/wp/v2/wyzwania \
  -H "Content-Type: application/json" \
  -u admin:haslo \
  -d '{
    "title": "Kod Enigmy",
    "content": "Znajdź ukryty kod na pomniku kryptologa Mariana Rejewskiego...",
    "status": "publish",
    "acf": {
      "location_name": "Ławeczka Mariana Rejewskiego, Bydgoszcz",
      "location_coords": "53.1235,18.0084",
      "difficulty": "medium",
      "points": 100,
      "secret_code": "ENIGMA",
      "category": "culture",
      "requirements": "Smartfon z GPS\nChęć rozwiązywania zagadek",
      "benefits": "Pieczątka w wirtualnym paszporcie\nPoznanie historii kryptologii",
      "contact_email": "gra@bydgo.bydgoszcz.pl",
      "organization": "Muzeum Okręgowe Bydgoszczy",
      "max_volunteers": 100,
      "current_volunteers": 0,
      "time_commitment": "1-2 godziny",
      "date_start": "2024-10-01",
      "date_end": "2025-12-31",
      "is_urgent": false
    }
  }'
```

### Pobieranie wyzwań

```bash
# Wszystkie wyzwania
curl https://twoja-domena.pl/wp-json/wp/v2/wyzwania?acf_format=standard

# Z featured image URL
curl https://twoja-domena.pl/wp-json/wp/v2/wyzwania?acf_format=standard&_embed=true

# Filtrowanie po kategorii
curl https://twoja-domena.pl/wp-json/wp/v2/wyzwania?acf[category]=culture
```

---

## 🔧 Rozwój

### Struktura pliku

```php
bydgo-plugin.php
├── Plugin Header (metadata)
├── bydgo_register_wyzwania_cpt() - Rejestracja CPT
├── bydgo_register_acf_fields() - Definicje pól ACF
├── bydgo_add_featured_image_to_rest() - Featured image w API
├── bydgo_register_rest_routes() - Custom endpoints
├── bydgo_get_stats() - Handler statystyk
└── Activation/Deactivation hooks
```

### Dodawanie nowych pól ACF

Edytuj funkcję `bydgo_register_acf_fields()`:

```php
array(
  'key' => 'field_nowe_pole',
  'label' => 'Nowe Pole',
  'name' => 'nowe_pole',
  'type' => 'text',
  'required' => 0,
),
```

Dostępne typy pól: `text`, `textarea`, `number`, `email`, `url`, `select`, `checkbox`, `true_false`, `date_picker`, `image`, `file`

---

## 📚 Dokumentacja

Pełna dokumentacja instalacji i konfiguracji: **[WORDPRESS_INSTRUCTION.md](../WORDPRESS_INSTRUCTION.md)**

---

## 🐛 Znane problemy

### 404 na endpoint `/wp-json/wp/v2/wyzwania`

**Rozwiązanie:**
1. Ustawienia → Bezpośrednie odnośniki → Nazwa wpisu
2. Zapisz zmiany (flush rewrite rules)

### Pola ACF nie są widoczne w REST API

**Rozwiązanie:**
- Zainstaluj i aktywuj **ACF to REST API**
- Dodaj parametr: `?acf_format=standard`

---

## 📄 Licencja

GPL v2 or later

---

## 👨‍💻 Autor

BydGO! Team - dev@bydgo.bydgoszcz.pl
