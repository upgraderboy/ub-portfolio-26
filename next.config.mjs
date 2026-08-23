// Fuzzy match and resolve Firebase configuration keys from process.env
let apiKey = "";
let authDomain = "";
let projectId = "";
let storageBucket = "";
let messagingSenderId = "";
let appId = "";
let measurementId = "";

for (const key of Object.keys(process.env)) {
  const normalized = key.toUpperCase().trim();
  const value = (process.env[key] || "").trim();
  if (!value) continue;

  if (normalized.includes("API") && normalized.includes("KEY")) {
    apiKey = value;
  } else if (normalized.includes("AUTH") && normalized.includes("DOMAIN")) {
    authDomain = value;
  } else if (normalized.includes("PROJECT") && normalized.includes("ID")) {
    projectId = value;
  } else if (normalized.includes("STORAGE") && normalized.includes("BUCKET")) {
    storageBucket = value;
  } else if (normalized.includes("MESSAGING") && (normalized.includes("SENDER") || normalized.includes("SND"))) {
    messagingSenderId = value;
  } else if (normalized.includes("APP") && normalized.includes("ID") && !normalized.includes("PROJECT")) {
    appId = value;
  } else if (normalized.includes("MEASUREMENT") && normalized.includes("ID")) {
    measurementId = value;
  }
}

console.log("Fuzzy Env Resolver Results:", {
  hasApiKey: !!apiKey,
  hasAuthDomain: !!authDomain,
  hasProjectId: !!projectId,
  hasStorageBucket: !!storageBucket,
  hasMessagingSenderId: !!messagingSenderId,
  hasAppId: !!appId,
  hasMeasurementId: !!measurementId
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_VITE_FIREBASE_API_KEY: apiKey,
    NEXT_PUBLIC_VITE_FIREBASE_AUTH_DOMAIN: authDomain,
    NEXT_PUBLIC_VITE_FIREBASE_PROJECT_ID: projectId,
    NEXT_PUBLIC_VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
    NEXT_PUBLIC_VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
    NEXT_PUBLIC_VITE_FIREBASE_APP_ID: appId,
    NEXT_PUBLIC_VITE_FIREBASE_MEASUREMENT_ID: measurementId,
    
    VITE_FIREBASE_API_KEY: apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: authDomain,
    VITE_FIREBASE_PROJECT_ID: projectId,
    VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
    VITE_FIREBASE_APP_ID: appId,
    VITE_FIREBASE_MEASUREMENT_ID: measurementId,
  },
};

export default nextConfig;
