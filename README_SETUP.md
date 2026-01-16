# Ballas RP — установка (GitHub Pages / Firebase)

## 1) GitHub Pages: убрать 404
Если видишь экран **404 File not found** от GitHub Pages:

1. Убедись, что в корне репозитория лежит файл **index.html** (этот проект уже так устроен).
2. GitHub → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (или `master`)
   - Folder: **/(root)** (ВАЖНО)
3. Подожди 1–2 минуты и обнови страницу.

> Частая причина 404: выбран `/docs`, а файлы лежат в корне, или ZIP распакован в подпапку.

## 2) Firebase Auth: исправить "unauthorized-domain"
Firebase Auth блокирует вход/регистрацию, если домен сайта не разрешён.

Firebase Console → **Authentication → Settings → Authorized domains** → добавь:
- `*.github.io` (или конкретно твой домен вида `username.github.io`)
- если используешь кастомный домен — добавь и его

## 3) Firestore rules (чтение всем, запись только своему uid)
Firebase Console → Firestore → **Rules**:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /characters/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 4) Storage rules (загрузка фото только своему uid)
Firebase Console → Storage → **Rules**:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && fileName.matches(request.auth.uid + '.*');
    }
  }
}
```

## 5) Как проверить
1. Открой `login.html` → зарегистрируй email+пароль.
2. Открой `profile.html` → заполни поля, выбери фото, нажми **Сохранить профиль**.
3. Открой `characters/index.html` → персонаж должен появиться.
4. Клик по имени → откроется `person.html?slug=...`.
