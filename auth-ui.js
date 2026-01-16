// Auth-aware header UI (static site + Firebase Auth)
// - Auto switches "Вход" <-> "Профиль"
// - Adds "Выйти" button behavior

const root = document.documentElement.dataset.root || '.';

// Hard stop: Firebase does not work reliably under file:// (origin "null").
// Provide a visible hint on pages that have a status/note element.
if (location.protocol === 'file:') {
  const hint = 'Сайт открыт как файл (file://). Firebase Auth/DB/Storage не работают при origin "null". Запусти через локальный сервер (Live Server / http://localhost) или выложи на хостинг.';
  console.warn(hint);
  const note = document.querySelector('#statusNote') || document.querySelector('.note');
  if (note) note.textContent = hint;
}

import { isDemoMode, getDemoUser, clearDemoUser } from `${root}/demo-store.js`;

const DEMO = isDemoMode();

let auth = null;
let onAuthStateChanged = null;
let signOut = null;

if (!DEMO) {
  // Import Firebase only when we're not on GitHub Pages.
  // GitHub Pages domains are usually not added to Firebase Authorized Domains yet,
  // so we run a local demo backend there.
  const cfg = await import(`${root}/firebase-config.js`);
  auth = cfg.auth;
  const mod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
  onAuthStateChanged = mod.onAuthStateChanged;
  signOut = mod.signOut;
}

function $(sel, parent = document) {
  return parent.querySelector(sel);
}

function $all(sel, parent = document) {
  return Array.from(parent.querySelectorAll(sel));
}

function setAuthUI(isAuthed) {
  const links = $all('[data-auth-link]');
  const logoutBtns = $all('[data-logout-btn]');

  links.forEach((a) => {
    a.textContent = isAuthed ? 'Профиль' : 'Вход';
    a.href = isAuthed ? `${root}/profile.html` : `${root}/login.html`;
  });

  logoutBtns.forEach((b) => {
    b.hidden = !isAuthed;
  });

  // Optional: show/hide "Мой профиль" links if they exist.
  $all('[data-profile-link]').forEach((a) => {
    a.hidden = !isAuthed;
    a.href = `${root}/profile.html`;
  });
}

async function doLogout() {
  if (DEMO) {
    clearDemoUser();
    location.href = `${root}/index.html`;
    return;
  }
  try {
    await signOut(auth);
    location.href = `${root}/index.html`;
  } catch (e) {
    console.error(e);
    alert('Не удалось выйти. Попробуй ещё раз.');
  }
}

// Wire logout buttons
$all('[data-logout-btn]').forEach((b) => b.addEventListener('click', doLogout));

// React to auth state
if (DEMO) {
  const user = getDemoUser();
  setAuthUI(!!user);
  const requires = document.documentElement.getAttribute('data-auth-required') === '1';
  if (requires && !user) location.href = `${root}/login.html`;
} else {
  onAuthStateChanged(auth, (user) => {
    setAuthUI(!!user);
    const requires = document.documentElement.getAttribute('data-auth-required') === '1';
    if (requires && !user) location.href = `${root}/login.html`;
  });
}
