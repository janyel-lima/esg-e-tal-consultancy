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
let globalConfig: { firebase?: any; emailjs?: any } = {};

try {
  // Sync fetch site-config.json for production/hosting environments (e.g., GitHub Pages)
  const baseUrl = import.meta.env.BASE_URL || '/';
  const configPath = baseUrl.endsWith('/') ? baseUrl + 'site-config.json' : baseUrl + '/site-config.json';
  
  const xhr = new XMLHttpRequest();
  xhr.open('GET', configPath, false); // Synchronous fetch
  xhr.send(null);
  
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    if (data) {
      globalConfig = data;
      console.log("[ESG e Tal] Global configurations loaded from site-config.json successfully.");
    }
  }
} catch (configError) {
  // Silent fallback if site-config.json is missing or inaccessible
}

try {
  // Try loading credentials dynamically from localStorage if saved by developer,
  // or use site-config.json from build/repository configuration,
  // or use env variables during build,
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

  const finalConfig = storedConfig 
    ? JSON.parse(storedConfig) 
    : (globalConfig.firebase || envConfig || (isDev ? firebaseConfig : null));

  if (finalConfig && finalConfig.apiKey && !finalConfig.apiKey.includes('local-emulator-key')) {
    if (getApps().length === 0) {
      app = initializeApp(finalConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getDatabase(app);
    isConfigured = true;

    console.log("Firebase successfully initialized in ESG e Tal.");
  } else if (isDev && finalConfig && finalConfig.apiKey) {
    // Dev with emulator fallback
    if (getApps().length === 0) {
      app = initializeApp(finalConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getDatabase(app);
    isConfigured = true;

    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectDatabaseEmulator(db, "127.0.0.1", 9000);
      console.log("Firebase Emulators auto-negotiated: Auth (9099), Realtime Database (9000)");
    } catch (emuError) {
      console.warn("Firebase emulators already registered or failed to connect:", emuError);
    }
  } else {
    console.warn("Firebase not configured yet. Running in high-fidelity offline mode.");
  }
} catch (error) {
  console.error("Error setting up Firebase config:", error);
}

export { auth, db, isConfigured, globalConfig };
