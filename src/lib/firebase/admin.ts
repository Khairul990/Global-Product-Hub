import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";
import { env, isFirebaseAdminConfigured } from "@/lib/env";

function formatPrivateKey(key?: string) {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

let adminApp: App | undefined;

if (typeof window === "undefined") {
  const currentApps = getApps();
  if (currentApps.length === 0) {
    if (isFirebaseAdminConfigured) {
      try {
        adminApp = initializeApp({
          credential: cert({
            projectId: env.FIREBASE_ADMIN_PROJECT_ID!,
            clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL!,
            privateKey: formatPrivateKey(env.FIREBASE_ADMIN_PRIVATE_KEY)!,
          }),
        });
      } catch (e) {
        console.warn("Failed to initialize Firebase Admin with cert:", e);
      }
    } else {
      try {
        adminApp = initializeApp();
      } catch {
        // Ignored during build or when default credentials not present
      }
    }
  } else {
    adminApp = currentApps[0];
  }
}

export const adminAuth: Auth | null = (adminApp && isFirebaseAdminConfigured) ? getAuth(adminApp) : null;
export const adminDb: Firestore | null = (adminApp && isFirebaseAdminConfigured) ? getFirestore(adminApp) : null;
export const adminStorage: Storage | null = (adminApp && isFirebaseAdminConfigured) ? getStorage(adminApp) : null;
