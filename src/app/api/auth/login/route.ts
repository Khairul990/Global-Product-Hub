import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/auth/server";
import { env, isFirebaseAdminConfigured } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, email, isDemo } = body;
    const cookieStore = await cookies();

    // 1. Allow demo / preview login when Firebase is unconfigured or in demo mode
    if (isDemo || !isFirebaseAdminConfigured || !adminAuth) {
      const demoEmail = email || "admin@globalproducthub.com";
      cookieStore.set(SESSION_COOKIE_NAME, `demo_session_${demoEmail}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 5, // 5 days
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: { email: demoEmail, role: "superadmin", isDemo: true },
      });
    }

    // 2. Production Firebase Auth flow
    if (!idToken) {
      return NextResponse.json(
        { error: "Firebase ID token is required for authentication" },
        { status: 400 }
      );
    }

    // Verify the ID token and create session cookie
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email?.toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "User has no email" }, { status: 403 });
    }

    // Check authorization against ADMIN_EMAILS or Firestore admin_users
    const authorized = env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase());
    let role = "admin";

    if (authorized.includes(userEmail)) {
      role = "superadmin";
    } else if (adminDb) {
      const adminDoc = await adminDb.collection("admin_users").doc(decodedToken.uid).get();
      if (!adminDoc.exists || !adminDoc.data()?.active) {
        return NextResponse.json(
          { error: "Access denied. Your account is not authorized as an administrator." },
          { status: 403 }
        );
      }
      role = adminDoc.data()?.role || "admin";
    } else {
      return NextResponse.json(
        { error: "Access denied. Your account is not authorized as an administrator." },
        { status: 403 }
      );
    }

    // 5-day session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    // Write audit log if database is connected
    if (adminDb) {
      try {
        await adminDb.collection("audit_logs").add({
          action: "admin.login",
          userId: decodedToken.uid,
          userEmail,
          role,
          timestamp: new Date().toISOString(),
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        });
      } catch (e) {
        console.error("Failed to write login audit log", e);
      }
    }

    return NextResponse.json({
      success: true,
      user: { uid: decodedToken.uid, email: userEmail, role, isDemo: false },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
