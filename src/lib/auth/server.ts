import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { env, isFirebaseAdminConfigured } from "@/lib/env";

export const SESSION_COOKIE_NAME = "gph_admin_session";

export interface AdminUser {
  uid: string;
  email: string;
  role: "superadmin" | "admin" | "editor";
  isDemo?: boolean;
}

export async function getServerAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  // Handle demo / development session cookie
  if (sessionCookie.startsWith("demo_session_")) {
    const email = sessionCookie.replace("demo_session_", "");
    return {
      uid: "demo-admin-uid",
      email: email || "admin@globalproducthub.com",
      role: "superadmin",
      isDemo: true,
    };
  }

  // Handle production Firebase Admin Session Verification
  if (isFirebaseAdminConfigured && adminAuth) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const email = decodedClaims.email?.toLowerCase();
      if (!email) return null;

      // Check against configured admin emails
      const authorizedEmails = env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase());
      if (!authorizedEmails.includes(email)) {
        // Alternatively, check admin_users collection if adminDb is available
        if (adminDb) {
          const userDoc = await adminDb.collection("admin_users").doc(decodedClaims.uid).get();
          if (!userDoc.exists || !userDoc.data()?.active) {
            return null;
          }
          return {
            uid: decodedClaims.uid,
            email,
            role: userDoc.data()?.role || "admin",
            isDemo: false,
          };
        }
        return null;
      }

      return {
        uid: decodedClaims.uid,
        email,
        role: "superadmin",
        isDemo: false,
      };
    } catch {
      return null;
    }
  }

  return null;
}
