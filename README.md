**BydGO! - Sciezki Pamieci 2.0**

Gra miejska odkrywajaca historie Bydgoszczy.
Zamien zwiedzanie w przygode - zbieraj wirtualne pieczatki, rozwiazuj zagadki i poznaj sekrety miasta dzieki interaktywnej aplikacji PWA.
**
[ TECH STACK ]**

Projekt oparty o WordPress dzialajacy jako CMS oraz silnik aplikacji (Progressive Web App).

Core: WordPress 6.x (Headless / Hybrid mode)

Frontend UI: Custom WordPress Theme + Tailwind CSS

Backend/Database: MySQL / MariaDB (Standard WP Structure)

Data Management: Advanced Custom Fields (ACF) - do zarzadzania scenariuszami i punktami mapy

Maps: Leaflet.js (zintegrowane via WP)

Features: PWA (Service Workers), REST API

**[ STRUKTURA PROJEKTU (WORDPRESS THEME) ]**

wp-content/themes/bydgo-theme/
|
|-- assets/
|   |-- css/         # Skompilowane style Tailwind
|   |-- js/          # Logika mapy i interakcje w grze
|   |-- images/      # Statyczne zasoby graficzne
|
|-- inc/             # Niestandardowe klasy i funkcje PHP
|   |-- api/         # Endpointy REST API
|   |-- gamification/# Logika pieczatek i postepu
|
|-- template-parts/  # Komponenty UI wielokrotnego uzytku
|-- page-templates/  # Widoki konkretnych ekranow gry
|-- functions.php    # Plik startowy motywu
|-- style.css        # Deklaracja motywu
|-- tailwind.config.js # Konfiguracja Tailwind

**[ DEVELOPMENT & INSTALACJA ]**

Wymagane srodowisko: Serwer lokalny (np. LocalWP, XAMPP) z PHP 8.1+ oraz Node.js (do kompilacji stylow).

Konfiguracja WordPress:

Zainstaluj czysta instancje WordPressa.

Skopiuj folder 'bydgo-theme' do katalogu '/wp-content/themes/'.

Budowanie zasobow (Tailwind):

Zainstaluj zaleznosci: npm install

Tryb deweloperski (nasluchiwanie zmian): npm run watch

Budowanie na produkcje: npm run build

Aktywacja:

Aktywuj motyw w panelu administratora.

Zaimportuj przykladowe dane (scenariusze) za pomoca wtyczki ACF/Importera.

[ BRAND IDENTITY ]

Miasto Bydgoszcz: Oficjalny partner

BydGO!: Nazwa gry

Sciezki Pamieci 2.0: Oficjalna nazwa projektu

[ LICENCJA ]

Projekt zostal stworzony na potrzeby HackNation 2025.
