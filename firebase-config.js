// Firebase config (CDN ESM). Public config is safe to ship.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBQOYsJ4yVmlRgnc9Fl06vr8xauv2jMgpI',
  authDomain: 'ballas-a3c8a.firebaseapp.com',
  projectId: 'ballas-a3c8a',
  storageBucket: 'ballas-a3c8a.appspot.com',
  messagingSenderId: '388259770524',
  appId: '1:388259770524:web:228f1f03e060d4a5f97d59'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
