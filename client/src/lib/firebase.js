import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyDloLaW7FV-fDEeBBLafIiOb_3AletAxTc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'dayflow-87113.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'dayflow-87113',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'dayflow-87113.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '529403212782',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:529403212782:web:dfa5f96eabd61346d654ff',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

