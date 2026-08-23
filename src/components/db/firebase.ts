import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, Auth } from "firebase/auth";

const getEnvVar = (name: string): string | undefined => {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[name]) return process.env[name];
    if (process.env[`NEXT_PUBLIC_${name}`]) return process.env[`NEXT_PUBLIC_${name}`];
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env) {
      // @ts-ignore
      return import.meta.env[name];
    }
  } catch (e) {}
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID") || "ub-portfolio",
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID"),
  measurementId: getEnvVar("VITE_FIREBASE_MEASUREMENT_ID"),
};

let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let isFirebaseConfigured = false;

// Check if critical configuration variables are set
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PLACEHOLDER") {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    
    // Safely configure persistence to avoid IndexedDB lock crashes in private browsing or iframe sandboxes
    setPersistence(auth, browserLocalPersistence)
      .catch((err) => {
        console.warn("Failed to set IndexedDB local persistence, falling back to session storage:", err);
        return setPersistence(auth!, browserSessionPersistence);
      })
      .catch((err) => {
        console.error("Failed to set fallback persistence:", err);
      });

    isFirebaseConfigured = true;
    console.log("Firebase Firestore, Storage, and Auth initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn(
    "Firebase API key not detected or set to placeholder. Operating in fallback LocalStorage mode. Please configure your .env file."
  );
}

export { db, storage, auth, isFirebaseConfigured };
