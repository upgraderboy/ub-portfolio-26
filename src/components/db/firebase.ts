import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, Auth } from "firebase/auth";

// @ts-ignore
const vApiKey = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_API_KEY : undefined;
// @ts-ignore
const vAuth = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : undefined;
// @ts-ignore
const vProject = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_PROJECT_ID : undefined;
// @ts-ignore
const vStorage = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : undefined;
// @ts-ignore
const vMsg = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined;
// @ts-ignore
const vApp = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_APP_ID : undefined;
// @ts-ignore
const vMeasure = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_FIREBASE_MEASUREMENT_ID : undefined;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || vApiKey,
  authDomain: process.env.NEXT_PUBLIC_VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || vAuth,
  projectId: process.env.NEXT_PUBLIC_VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || vProject || "ub-portfolio",
  storageBucket: process.env.NEXT_PUBLIC_VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || vStorage,
  messagingSenderId: process.env.NEXT_PUBLIC_VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || vMsg,
  appId: process.env.NEXT_PUBLIC_VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || vApp,
  measurementId: process.env.NEXT_PUBLIC_VITE_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || vMeasure,
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
