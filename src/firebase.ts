import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Default mock configuration to allow clean compilation and elegant local offline state.
// If the user configures live credentials later, they will overwrite this or be loaded dynamically.
const firebaseConfig = {
  apiKey: "local-emulator-key-for-dev",
  authDomain: "esg-e-tal.firebaseapp.com",
  databaseURL: "http://127.0.0.1:9000/?ns=esg-e-tal-default-rtdb",
  projectId: "esg-e-tal",
  storageBucket: "esg-e-tal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:123456"
};

let app;
let auth: any = null;
let db: any = null;
let isConfigured = false;

try {
  // Try loading credentials dynamically from localStorage if saved by developer,
  // or use env variables during build (e.g. for GitHub Pages),
  // or use local emulator config dynamically in local dev mode.
  const storedConfig = localStorage.getItem('esg-firebase-config');
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  const envConfig = import.meta.env.VITE_FIREBASE_API_KEY ? {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  } : null;

  const finalConfig = storedConfig ? JSON.parse(storedConfig) : (envConfig || (isDev ? firebaseConfig : null));

  if (finalConfig && finalConfig.apiKey) {
    if (getApps().length === 0) {
      app = initializeApp(finalConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getDatabase(app);
    isConfigured = true;

    // Connect to emulators if running in local dev mode
    if (isDev) {
      try {
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectDatabaseEmulator(db, "127.0.0.1", 9000);
        console.log("Firebase Emulators auto-negotiated: Auth (9099), Realtime Database (9000)");
      } catch (emuError) {
        console.warn("Firebase emulators already registered or failed to connect:", emuError);
      }
    }

    console.log("Firebase successfully initialized in ESG e Tal.");
  } else {
    console.warn("Firebase not configured yet. Running in high-fidelity offline mode.");
  }
} catch (error) {
  console.error("Error setting up Firebase config:", error);
}

export { auth, db, isConfigured };
