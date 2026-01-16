# Деплой на GitHub Pages (демо-режим)

Этот билд адаптирован под GitHub Pages:
- На домене `*.github.io` включается **демо‑режим** (без Firebase).
- Регистрация/вход и база персонажей работают через `localStorage`.
- На Firebase Hosting (или когда добавишь домен в Authorized domains) сайт автоматически использует Firebase.

## Как залить на GitHub Pages
1) Создай репозиторий на GitHub.
2) Залей ВСЕ файлы сайта в корень репозитория (где `index.html`).
3) Repo Settings → Pages → Build and deployment:
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
4) Открой ссылку вида `https://<username>.github.io/<repo>/`.

## Важно
- В демо‑режиме данные хранятся только в браузере (localStorage).
- Фото в демо‑режиме сохраняется как DataURL (лучше использовать небольшие файлы).
