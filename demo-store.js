// Demo/local backend for GitHub Pages (no Firebase).
// Stores auth + characters in localStorage.

const KEY_USER = 'ballas_demo_user_v1';
const KEY_CHARS = 'ballas_demo_characters_v1';

export function isDemoMode() {
  // Demo backend is used when Firebase Auth is likely to fail due to origin restrictions
  // (GitHub Pages, local preview, or file:// opened HTML).
  const host = (location.hostname || '').toLowerCase();
  const proto = (location.protocol || '').toLowerCase();

  // Opening the site by double-clicking HTML (file://) is a very common workflow.
  // Firebase Auth/Firestore usually won't work there, so we fall back to demo.
  if (proto === 'file:') return true;

  // GitHub Pages (project pages or user pages)
  if (host.endsWith('github.io')) return true;

  // Local preview (VS Code Live Server etc.)
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') return true;

  return false;
}

export function getDemoUser() {
  try {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setDemoUser(email) {
  const uid = 'demo-' + btoa(unescape(encodeURIComponent(email))).replace(/=+$/g, '');
  const user = { uid, email };
  localStorage.setItem(KEY_USER, JSON.stringify(user));
  return user;
}

export function clearDemoUser() {
  localStorage.removeItem(KEY_USER);
}

function readChars() {
  try {
    const raw = localStorage.getItem(KEY_CHARS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeChars(map) {
  localStorage.setItem(KEY_CHARS, JSON.stringify(map));
}

export function getDemoCharacters() {
  const map = readChars();
  return Object.values(map);
}

export function getDemoCharacterByUid(uid) {
  const map = readChars();
  return map[uid] || null;
}

export function upsertDemoCharacter(uid, payload) {
  const map = readChars();
  map[uid] = { ...map[uid], ...payload, uid };
  writeChars(map);
  return map[uid];
}

export function getDemoCharacterBySlug(slug) {
  const chars = getDemoCharacters();
  return chars.find(c => (c.slug || '') === slug) || null;
}
