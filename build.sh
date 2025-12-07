#!/bin/bash

# Zmienna ścieżki do frontendu
FRONTEND_DIR="/var/www/bydgo/front/BydGO-main"
TARGET_DIR="/var/www/bydgo"

echo "🔹 Budowanie frontendu w $FRONTEND_DIR ..."

# Przechodzimy do katalogu frontendu
cd "$FRONTEND_DIR" || { echo "Nie mogę wejść do katalogu $FRONTEND_DIR"; exit 1; }

# Instalacja zależności (opcjonalnie, jeśli nie są zainstalowane)
#echo "🔹 Instalacja zależności npm..."
#npm install

# Build projektu
echo "🔹 Uruchamiam npm run build ..."
#npm run build || { echo "Build nie powiódł się!"; exit 1; }

# Kopiowanie plików z dist do /var/www/bydgo
echo "🔹 Kopiowanie plików do $TARGET_DIR ..."
# Najpierw czyścimy stare pliki (opcjonalnie)
#rm -rf "$TARGET_DIR"/*

# Kopiujemy wszystko z dist
cp -r "$FRONTEND_DIR/dist/"* "$TARGET_DIR/"

echo "✅ Frontend został zbudowany i skopiowany do $TARGET_DIR"
