import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";
import { env, isFirebaseAdminConfigured } from "@/lib/env";

function formatPrivateKey(key?: string) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;
let adminStorage: Storage | null = null;

if (typeof window === "undefined" && isFirebaseAdminConfigured) {
  try {
    // Dynamic import to prevent bundler cold start crashes on serverless when unconfigured
    const { getApps, initializeApp, cert } = require("firebase-admin/app");
    const { getAuth } = require("firebase-admin/auth");
    const { getFirestore } = require("firebase-admin/firestore");
    const { getStorage } = require("firebase-admin/storage");

    const currentApps = getApps();
    if (currentApps.length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: env.FIREBASE_ADMIN_PROJECT_ID!,
          clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL!,
          privateKey: formatPrivateKey(env.FIREBASE_ADMIN_PRIVATE_KEY)!,
        }),
      });
    } else {
      adminApp = currentApps[0];
    }

    if (adminApp) {
      adminAuth = getAuth(adminApp);
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);
    }
  } catch (e) {
    console.warn("Failed to initialize Firebase Admin:", e);
  }
}

export { adminApp, adminAuth, adminDb, adminStorage };

