// Auth-aware header UI (static site + Firebase Auth)
// - Auto switches "Вход" <-> "Профиль"
// - Adds "Выйти" button behavior

const root = document.documentElement.dataset.root || '.';

// Import Firebase config from the correct relative root.
const { auth } = await import(`${root}/firebase-config.js`);

import {
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

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
onAuthStateChanged(auth, (user) => {
  setAuthUI(!!user);

  // If a page requires auth, it can mark itself with data-auth-required="1".
  const requires = document.documentElement.getAttribute('data-auth-required') === '1';
  if (requires && !user) {
    location.href = `${root}/login.html`;
  }
});
